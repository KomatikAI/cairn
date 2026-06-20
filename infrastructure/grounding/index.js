import { fileURLToPath } from "node:url";
import {
  getSupabase,
  pollKnowledgeEvents,
  markEventProcessed,
} from "@komatik/shared/supabase";
import {
  parseQueries,
  dedupeByUrl,
  selectToCreditCap,
  buildSearchBody,
  buildHighlightsBody,
} from "./lib/helpers.js";

const FIRECRAWL_URL = process.env.FIRECRAWL_URL || "https://api.firecrawl.dev";
const FIRECRAWL_KEY = process.env.CAIRN_FIRECRAWL_API_KEY || "";
const BIFROST_URL = process.env.BIFROST_URL || "http://bifrost:8080";
const BIFROST_API_KEY = process.env.SEED_VIRTUAL_KEY || "";
const QUERY_MODEL = process.env.GROUNDED_QUERY_MODEL || "google/gemini-2.5-flash";
const SOURCE_ID = process.env.SOURCE_ID || "";
const SEED_MISSION = process.env.SEED_MISSION || "";
const GROUNDING_QUERIES = parseInt(process.env.GROUNDING_QUERIES || "8", 10);
const GROUNDING_CREDIT_CAP = parseInt(process.env.GROUNDING_CREDIT_CAP || "50", 10);
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || "60000", 10);
const RUN_ONCE = process.env.RUN_ONCE === "true";

const SYSTEM_PROMPT = `You generate targeted web-search queries for a research agent.
Given a seed mission, return a JSON array of \${""}search query strings that target
primary sources (government reports, peer-reviewed studies, official datasets,
named programs). Prefer queries likely to surface citable evidence over
journalism. Return ONLY a JSON array of strings, no prose.`;

// --- Bifrost LLM call (query generation) ---------------------------------

async function generateQueriesViaBifrost() {
  const headers = { "Content-Type": "application/json" };
  if (BIFROST_API_KEY) headers["Authorization"] = `Bearer ${BIFROST_API_KEY}`;
  const body = {
    model: QUERY_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT.replace("${\"\"}", String(GROUNDING_QUERIES)) },
      { role: "user", content: `Seed mission:\n${SEED_MISSION}\n\nReturn ${GROUNDING_QUERIES} search queries as a JSON string array.` },
    ],
    max_tokens: 1024,
  };
  const res = await fetch(`${BIFROST_URL}/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Bifrost error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// --- Firecrawl calls ------------------------------------------------------

function firecrawlHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${FIRECRAWL_KEY}`,
  };
}

async function firecrawlSearch(query, { categories } = {}) {
  if (!FIRECRAWL_KEY) return [];
  const res = await fetch(`${FIRECRAWL_URL}/v2/search`, {
    method: "POST",
    headers: firecrawlHeaders(),
    body: JSON.stringify(buildSearchBody(query, { categories })),
  });
  if (!res.ok) {
    console.warn(`[grounding] /v2/search failed (${res.status}) for "${query}"`);
    return [];
  }
  const json = await res.json();
  // /v2/search returns { data: { web: [...] } } or { data: [...] }
  const web = json?.data?.web;
  if (Array.isArray(web)) return web;
  if (Array.isArray(json?.data)) return json.data;
  return [];
}

async function firecrawlHighlights(url, query) {
  if (!FIRECRAWL_KEY) return null;
  const res = await fetch(`${FIRECRAWL_URL}/v2/scrape`, {
    method: "POST",
    headers: firecrawlHeaders(),
    body: JSON.stringify(buildHighlightsBody(url, query)),
  });
  if (!res.ok) {
    console.warn(`[grounding] /v2/scrape highlights failed (${res.status}) for ${url}`);
    return null;
  }
  const json = await res.json();
  const data = json?.data || {};
  // Highlights excerpt is in data.highlights; fall back to data.markdown.
  const content = data.highlights || data.markdown || "";
  return {
    url,
    title: data.metadata?.title || url,
    content,
    format: data.highlights ? "highlights" : "markdown",
    match_query: query,
    credits_used: data.highlights ? 5 : 1, // highlights 5, markdown 1
  };
}

// --- Write to seed_sources ------------------------------------------------

async function writeSeedSources(supabase, seedId, workflowId, rows) {
  if (!rows.length) return;
  const inserts = rows.map((r) => ({
    seed_id: seedId,
    query: r.match_query || "",
    url: r.url,
    title: r.title || null,
    content: r.content || "",
    format: r.format || "highlights",
    match_query: r.match_query || null,
    workflow_id: workflowId || null,
    credits_used: r.credits_used || 0,
  }));
  const { error } = await supabase.from("seed_sources").insert(inserts);
  if (error) console.warn(`[grounding] seed_sources insert failed: ${error.message}`);
}

// --- Orchestration --------------------------------------------------------

export async function handleGroundingEvent(event) {
  const supabase = getSupabase();
  if (!supabase || !FIRECRAWL_KEY) {
    console.warn("[grounding] Supabase or Firecrawl key missing — skipping");
    return;
  }
  const seedId = event.target_id || SOURCE_ID;
  const workflowId = event.payload?.workflow_id || null;
  try {
    const raw = await generateQueriesViaBifrost();
    const queries = parseQueries(raw, fallbackQueries());
    console.log(`[grounding] ${queries.length} queries for seed ${seedId}`);

    // For each query: search, take the top result, highlights-scrape it.
    const collected = [];
    for (const q of queries) {
      const results = await firecrawlSearch(q);
      const top = results[0];
      if (!top?.url) continue;
      const row = await firecrawlHighlights(top.url, q);
      if (row && row.content) collected.push(row);
    }

    const deduped = dedupeByUrl(collected);
    const { kept } = selectToCreditCap(deduped, GROUNDING_CREDIT_CAP);
    await writeSeedSources(supabase, seedId, workflowId, kept);
    console.log(`[grounding] wrote ${kept.length} seed_sources for seed ${seedId}`);
  } catch (err) {
    console.error(`[grounding] event failed (non-fatal): ${err.message}`);
  } finally {
    // Proceed-gracefully: always mark processed so a stuck event can't retry forever.
    try {
      await markEventProcessed(supabase, event.id);
    } catch (err) {
      console.error(`[grounding] markEventProcessed failed: ${err.message}`);
    }
  }
}

function fallbackQueries() {
  // Degenerate case: one query from the mission text, so grounding still runs.
  const base = (SEED_MISSION || "").trim();
  return [base || "homelessness research report"];
}

export async function runOnce() {
  const supabase = getSupabase();
  if (!supabase) return;
  const events = await pollKnowledgeEvents(supabase, {
    targetType: "grounding",
    targetId: SOURCE_ID,
  });
  const pending = events.filter((e) => e.event_type === "grounding_required");
  if (pending.length === 0) return;
  console.log(`[grounding] ${pending.length} grounding_required event(s)`);
  for (const event of pending) {
    await handleGroundingEvent(event);
  }
}

async function main() {
  console.log(`[grounding] Starting. Poll ${POLL_INTERVAL_MS / 1000}s. Seed ${SOURCE_ID || "UNSET"}.`);
  try {
    await runOnce();
  } catch (err) {
    console.error(`[grounding] initial poll failed: ${err.message}`);
  }
  if (RUN_ONCE) {
    console.log("[grounding] RUN_ONCE set, exiting");
    return;
  }
  setInterval(async () => {
    try {
      await runOnce();
    } catch (err) {
      console.error(`[grounding] poll failed: ${err.message}`);
    }
  }, POLL_INTERVAL_MS);
  process.on("SIGTERM", () => {
    console.log("[grounding] Shutting down");
    process.exit(0);
  });
}

const isEntryPoint = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isEntryPoint) {
  main().catch((err) => {
    console.error("[grounding] Fatal:", err);
    process.exit(1);
  });
}
