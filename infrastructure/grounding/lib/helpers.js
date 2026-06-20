// Pure helpers for the grounding service. No network, no side effects — fully unit-tested.

export function parseQueries(llmContent, fallbackQueries) {
  if (typeof llmContent !== "string") return fallbackQueries;
  const cleaned = llmContent.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.every((q) => typeof q === "string") && parsed.length > 0) {
      return parsed;
    }
  } catch {
    /* fall through */
  }
  return fallbackQueries;
}

export function dedupeByUrl(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    if (!row || !row.url || seen.has(row.url)) continue;
    seen.add(row.url);
    out.push(row);
  }
  return out;
}

export function selectToCreditCap(rows, cap) {
  const kept = [];
  let totalCredits = 0;
  for (const row of rows) {
    const cost = Number(row.credits_used) || 0;
    if (totalCredits + cost > cap) break;
    kept.push(row);
    totalCredits += cost;
  }
  return { kept, totalCredits };
}

export function buildSearchBody(query, { categories } = {}) {
  const body = { query, limit: 5 };
  if (Array.isArray(categories) && categories.length > 0) body.categories = categories;
  return body;
}

export function buildHighlightsBody(url, query) {
  return { url, formats: [{ type: "highlights", query }] };
}
