# Research Grounding Service — Phase 1 Design

> Issue: [#49](https://github.com/KomatikAI/cairn/issues/49) — seed-002 findings
> failed the charter §6.1 quality bar (0 citations, no methodology).
> Reference: `docs/references/nuna/` — the rigor north star.
> Date: 2026-06-20.

## Goal

Before the research agent generates, it has **real, cited web sources in its
context.** This closes the capability gap (agents have no web access today, so
they generate from training data and cannot cite primary sources) that makes
Nuna-level rigor impossible. **Phase 1 delivers the capability.** Phase 2
(separate spec) delivers the prompt + structural-enforcement quality contract
that the capability enables.

## Background

- Seed-002 dry-run (2026-06-20) produced findings with 0 URLs, 0 DOIs, empty
  `methodology`, `confidence: validated` — see issue #49.
- Root cause: the runner's only `fetch` calls are gateway-health + the LLM
  completion; none of the 17 gateway tools search the web; Bifrost MCP is not
  wired to agents. Agents emit findings from parametric memory only.
- Nuna (`docs/references/nuna/docs/06-global-lifecycle-research.md`) reached the
  bar via **Firecrawl search + authoritative scrape → grounded source content →
  cited synthesis.** This is the pattern Phase 1 replicates.
- Chosen architecture: dedicated grounding service (Approach A), the lowest-risk
  fit for the existing single-call runner and the proven Nuna method.

## Scope

**In (Phase 1):** grounding service, `seed_sources` store, context-assembler
injection, scheduler trigger, cost controls.

**Out (Phase 2, separate spec):** shared-soul rewrites (Nuna-style rigor
instructions), runner structural backstop (reject findings lacking
URL/methodology, force `confidence: preliminary` for seeds), mission-agent §6.1
rubric.

## Locked design decisions

1. **Sequencing — proceed-gracefully.** The research agent does **not** block on
   grounding. It uses whatever `seed_sources` rows exist when it claims its
   step. Grounding fires at cycle creation and should finish first, but a slow
   first cycle yields thinner grounding rather than stalling the cycle. A
   "wait for N sources" gate is deferred.
2. **Storage — new `seed_sources` Supabase table.** Clean provenance per source
   (query, URL, scraped_at, credits_used), queryable, public-read like
   `findings`. Reusing `findings` with `kind: 'source'` was rejected: it would
   conflate grounded inputs with research outputs and pollute the findings
   stream the category tier reads.

## Architecture

```
                        ┌──────────────────────────────┐
   scheduler ──event──► │      grounding service        │
   (createCycle)        │  • generate N queries (LLM)   │
                        │  • Firecrawl search × N       │
                        │  • scrape top K per query     │
                        │  • dedup by URL, credit-cap   │
                        └───────────────┬──────────────┘
                                        ▼ write
                        ┌──────────────────────────────┐
                        │   Supabase: seed_sources      │  (public read)
                        └───────────────┬──────────────┘
                                        ▼ read (5th context bucket)
                        ┌──────────────────────────────┐
                        │   research agent (context     │
                        │   assembler) → generates +    │
                        │   cites real sources          │
                        └──────────────────────────────┘
```

### Components

1. **`infrastructure/grounding/`** — new Node.js container, mirrors
   `signal-aggregator`'s shape (poll loop + Bifrost LLM call + writes). Polls
   `knowledge_events` for `event_type = 'grounding_required'`. For each event:
   - one cheap LLM call generates `GROUNDING_QUERIES` (default 8) targeted
     queries from the seed mission + tags;
   - **Firecrawl `/v2/search`** per query, using `categories` to target primary
     sources (`research` for academic literature, `github` for code/artifacts,
     default web for government/NGO reports);
   - for each top result, **`/scrape` with the `highlights` format** keyed to the
     query — returns the verbatim sentences/tables/code on the page that match,
     ~100x smaller than a full scrape and **provably from the source** (every
     line is the page's own text, not generated). *This is the citation-integrity
     mechanism: the agent quotes Firecrawl's excerpt, so citations cannot be
     hallucinated.* Fall back to full markdown when `highlights` returns nothing;
   - **`/parse`** for PDF URLs (LAHSA/HUD/academic reports) → markdown via
     Fire-PDF;
   - dedup by URL; write rows; mark event processed. Hard stops at
     `GROUNDING_CREDIT_CAP` (default 40) credits per cycle.

2. **Migration `002_seed_sources.sql`** — new table:
   ```sql
   CREATE TABLE seed_sources (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     seed_id text NOT NULL,
     query text NOT NULL,
     url text NOT NULL,
     title text,
     content text NOT NULL DEFAULT '',        -- verbatim highlights / parsed PDF / full markdown
     format text NOT NULL DEFAULT 'highlights', -- highlights | markdown | pdf
     match_query text,                          -- the query the highlights matched against
     source_type text NOT NULL DEFAULT 'web',
     workflow_id uuid,
     scraped_at timestamptz NOT NULL DEFAULT now(),
     credits_used integer NOT NULL DEFAULT 0,
     created_at timestamptz NOT NULL DEFAULT now()
   );
   CREATE INDEX seed_sources_seed_idx ON seed_sources (seed_id, created_at DESC);
   -- RLS: public read, service-role write (matches findings)
   ```

3. **`infrastructure/agent/lib/context-assembler.js`** — add a 5th context
   bucket: recent `seed_sources` for `SOURCE_ID` (last ~7 days), token-budgeted
   like the existing 4 buckets. Each source rendered as markdown with its URL so
   the agent can cite it inline. Surfaced to research + documentation roles.

4. **`infrastructure/scheduler/index.js`** — `createCycleWorkflow` emits a
   `grounding_required` knowledge_event (payload: `seed_id`, mission summary,
   topic hints from `seed.yaml` tags). Decoupled — scheduler does not wait.

5. **Config / cost** — `CAIRN_FIRECRAWL_API_KEY` env (new, dedicated Cairn
   Firecrawl account); `GROUNDING_QUERIES`, `GROUNDING_SCRAPE_PER_QUERY`,
   `GROUNDING_CREDIT_CAP` (all overridable); compose adds the `grounding`
   service. **Cost centers are separate:** Firecrawl credits are billed by
   Firecrawl against its own key and bounded per-cycle by `GROUNDING_CREDIT_CAP`;
   the one grounding LLM call (query generation) routes through Bifrost and
   counts against the existing seed LLM budget. The `highlights` format also
   shrinks what lands in the research agent's context (~100x vs full pages), so
   more sources fit the context budget — the saving is on the LLM side, not
   Firecrawl credits.

## Data flow

1. Scheduler creates the cycle → emits `grounding_required` event.
2. Grounding service polls, claims the event → LLM generates 8 queries →
   Firecrawl search + scrape → writes ~24 deduped `seed_sources` rows → marks
   event processed.
3. Research agent claims its step → context assembler pulls recent `seed_sources`
   (5th bucket) → agent generates with real URLs in context → cites them.
4. *(Phase 2 makes citation mandatory; Phase 1 only delivers the sources.)*

## Error handling

- **Firecrawl failure / out of credits** → log, write 0 sources, mark event
  processed. Research proceeds with empty grounding (proceed-gracefully).
- **Credit cap hit mid-run** → stop scraping, keep what was gathered.
- **LLM query-generation failure** → fall back to static queries derived from
  `seed.yaml` `mission_summary` + `tags`.
- **Grounding service down** → research proceeds without grounding; no cycle is
  ever blocked by grounding.

## Testing

- **Query generation** — unit test (mocked LLM) that mission + tags yield N
  well-formed queries.
- **Dedup + cap** — unit test (mocked Firecrawl) that duplicate URLs collapse
  and the run stops at `GROUNDING_CREDIT_CAP`.
- **Context assembler** — extend the existing tests: 5th bucket includes
  `seed_sources`, respects token budget.
- **Integration** — a seed-002 dry-run, then assert the research agent's context
  contains `seed_sources` with resolvable URLs.

## Success criteria (Phase 1 — done when)

- After a seed-002 dry-run, the research agent's assembled context includes
  a non-empty set of real `seed_sources` rows carrying resolvable URLs (count
  bounded by `GROUNDING_QUERIES × GROUNDING_SCRAPE_PER_QUERY`, post-dedup).
- The research output cites some of them, with the cited text matching
  `seed_sources.content` verbatim (highlights → citation integrity). Phase 2
  makes "some" → "required".
- Per-cycle Firecrawl spend ≤ cap; no cycle blocked by grounding.

## Future evolution (post-Phase 2)

- **Agent-driven search (the Approach B we deferred).** Firecrawl MCP v3
  (stable cloud HTTP/SSE) and the Firecrawl Skill/CLI (explicitly supports
  OpenCode) can expose Firecrawl tools directly to agents, enabling a tool-use
  loop where the researcher searches and re-searches dynamically instead of
  consuming a pre-grounded set. Worth revisiting once the grounding pattern is
  proven; deferred here to avoid a runner rewrite in Phase 1.
- **`/monitor` for staleness.** Firecrawl `/monitor` fires a webhook on page
  change — maps directly to the charter's "knowledge decays" principle
  (re-trigger grounding when a cited source changes). Candidate for the
  staleness-prevention work, not Phase 1.

## Risks / open

- **Firecrawl credits cost real money** — the `GROUNDING_CREDIT_CAP` is
  load-bearing; dry-run must stay within the raised Bifrost budget.
- **Grounding latency vs cycle start** — proceed-gracefully mitigates; the very
  first cycle after boot may have thin grounding.
- **Query quality** — LLM-generated; static fallback covers the degenerate case.
