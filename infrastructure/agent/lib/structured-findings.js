/**
 * Structured finding extraction helpers.
 *
 * Synthesis agents can publish machine-readable findings by including JSON
 * fenced code blocks in their normal markdown output. Markdown permits code
 * fences of three or more matching backticks or tildes, so the parser accepts
 * all of those forms instead of only the common ```json variant.
 */

export function parseJsonBlocks(content, { onInvalid } = {}) {
  if (!content) return [];

  const blocks = [];
  const fencePattern = /(^|\n)(`{3,}|~{3,})[ \t]*json[ \t]*\r?\n([\s\S]*?)(?:\r?\n)?\2[ \t]*(?=\n|$)/gi;

  for (const match of content.matchAll(fencePattern)) {
    try {
      blocks.push(JSON.parse(match[3].trim()));
    } catch (err) {
      if (onInvalid) onInvalid(err);
    }
  }

  return blocks;
}

export function extractStructuredFindings(content, opts = {}) {
  return parseJsonBlocks(content, opts).flatMap((block) => {
    if (Array.isArray(block?.world_tree_findings)) return block.world_tree_findings;
    if (Array.isArray(block?.findings)) return block.findings;
    if (block?.title && block?.summary && block?.content) return [block];
    return [];
  });
}

/**
 * Valid values for findings.source_type (mirrors the Supabase
 * finding_source_type enum). Used to reject hallucinated values before they
 * reach the database — agents occasionally invent values like
 * "prototype_output" that would trigger an enum violation and drop the finding.
 */
export const FINDING_SOURCE_TYPES = new Set([
  "seed",
  "category",
  "root",
  "apex",
  "public_signal",
]);

/**
 * Normalize an agent-supplied source_type against the enum, falling back to the
 * container's own source type when the value is missing or invalid.
 */
export function normalizeFindingSourceType(value, fallback) {
  if (!value) return fallback;
  const normalized = String(value).toLowerCase();
  if (FINDING_SOURCE_TYPES.has(normalized)) return normalized;
  return fallback;
}
