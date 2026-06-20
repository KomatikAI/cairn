-- 002_seed_sources.sql
--
-- Grounded web sources for the research agent (issue #49 Phase 1).
-- Written by the grounding service (Firecrawl /v2/search + /v2/scrape highlights);
-- read by the agent context assembler's 5th bucket. Public read; service-role write.

CREATE TABLE IF NOT EXISTS seed_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_id text NOT NULL,
  query text NOT NULL,
  url text NOT NULL,
  title text,
  content text NOT NULL DEFAULT '',             -- verbatim highlights excerpt / fallback markdown
  format text NOT NULL DEFAULT 'highlights',    -- highlights | markdown
  match_query text,                             -- the highlights query the excerpt matched
  source_type text NOT NULL DEFAULT 'web',      -- web (reserved for future channels)
  workflow_id uuid,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  credits_used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS seed_sources_seed_idx
  ON seed_sources (seed_id, created_at DESC);

ALTER TABLE seed_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seed_sources_public_read ON seed_sources;
CREATE POLICY seed_sources_public_read ON seed_sources
  FOR SELECT TO anon, authenticated USING (true);
