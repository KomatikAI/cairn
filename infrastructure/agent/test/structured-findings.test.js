import test from "node:test";
import assert from "node:assert/strict";

import {
  extractStructuredFindings,
  parseJsonBlocks,
  normalizeFindingSourceType,
  FINDING_SOURCE_TYPES,
} from "../lib/structured-findings.js";

test("parseJsonBlocks accepts markdown fences of three or more backticks", () => {
  const blocks = parseJsonBlocks([
    "before",
    "```json",
    '{"title":"Triple"}',
    "```",
    "middle",
    "````json",
    '{"title":"Quad"}',
    "````",
  ].join("\n"));

  assert.deepEqual(blocks, [{ title: "Triple" }, { title: "Quad" }]);
});

test("parseJsonBlocks accepts matching tilde fences", () => {
  const blocks = parseJsonBlocks([
    "~~~json",
    '{"title":"Tilde"}',
    "~~~",
  ].join("\n"));

  assert.deepEqual(blocks, [{ title: "Tilde" }]);
});

test("parseJsonBlocks reports invalid fenced JSON without throwing", () => {
  const errors = [];
  const blocks = parseJsonBlocks("```json\n{bad json}\n```", {
    onInvalid: (err) => errors.push(err.message),
  });

  assert.deepEqual(blocks, []);
  assert.equal(errors.length, 1);
});

test("extractStructuredFindings supports world_tree_findings, findings, and single finding blocks", () => {
  const content = [
    "```json",
    JSON.stringify({
      world_tree_findings: [
        { title: "World", summary: "summary", content: "content" },
      ],
    }),
    "```",
    "````json",
    JSON.stringify({ findings: [{ title: "Findings", summary: "summary", content: "content" }] }),
    "````",
    "~~~json",
    JSON.stringify({ title: "Single", summary: "summary", content: "content" }),
    "~~~",
  ].join("\n");

  assert.deepEqual(
    extractStructuredFindings(content).map((finding) => finding.title),
    ["World", "Findings", "Single"]
  );
});

test("normalizeFindingSourceType accepts valid enum values and falls back on invalid/missing", () => {
  assert.equal(normalizeFindingSourceType("seed"), "seed");
  assert.equal(normalizeFindingSourceType("Category"), "category");
  assert.equal(normalizeFindingSourceType("apex"), "apex");
  assert.equal(normalizeFindingSourceType("public_signal"), "public_signal");
  assert.equal(normalizeFindingSourceType("prototype_output", "seed"), "seed");
  assert.equal(normalizeFindingSourceType(undefined, "seed"), "seed");
  assert.equal(normalizeFindingSourceType("", "seed"), "seed");
  assert.equal(FINDING_SOURCE_TYPES.has("seed"), true);
});
