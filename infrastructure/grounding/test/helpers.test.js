import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  parseQueries,
  dedupeByUrl,
  selectToCreditCap,
  buildSearchBody,
  buildHighlightsBody,
} from "../lib/helpers.js";

describe("parseQueries", () => {
  it("parses a bare JSON string array", () => {
    assert.deepEqual(parseQueries('["a","b"]', ["fb"]), ["a", "b"]);
  });
  it("strips markdown fences", () => {
    assert.deepEqual(parseQueries("```json\n[\"x\"]\n```", ["fb"]), ["x"]);
  });
  it("falls back when content is unparseable", () => {
    assert.deepEqual(parseQueries("no json here", ["fallback"]), ["fallback"]);
  });
  it("falls back when JSON is not a string array", () => {
    assert.deepEqual(parseQueries('{"a":1}', ["fallback"]), ["fallback"]);
  });
});

describe("dedupeByUrl", () => {
  it("keeps first occurrence, drops later dupes by url", () => {
    const rows = [
      { url: "https://a", content: "first" },
      { url: "https://b", content: "b" },
      { url: "https://a", content: "dupe" },
    ];
    assert.deepEqual(dedupeByUrl(rows), [
      { url: "https://a", content: "first" },
      { url: "https://b", content: "b" },
    ]);
  });
});

describe("selectToCreditCap", () => {
  it("greedily keeps rows until the credit cap would be exceeded", () => {
    const rows = [
      { url: "https://a", credits_used: 5 },
      { url: "https://b", credits_used: 5 },
      { url: "https://c", credits_used: 5 },
    ];
    const { kept, totalCredits } = selectToCreditCap(rows, 12);
    assert.equal(kept.length, 2);
    assert.equal(totalCredits, 10);
  });
  it("keeps everything under the cap", () => {
    const rows = [{ url: "https://a", credits_used: 5 }];
    const { kept, totalCredits } = selectToCreditCap(rows, 50);
    assert.equal(kept.length, 1);
    assert.equal(totalCredits, 5);
  });
});

describe("buildSearchBody", () => {
  it("builds a /v2/search body with optional categories", () => {
    assert.deepEqual(buildSearchBody("homelessness LA", { categories: ["research"] }), {
      query: "homelessness LA",
      limit: 5,
      categories: ["research"],
    });
  });
  it("omits categories when not provided", () => {
    assert.deepEqual(buildSearchBody("homelessness LA", {}), {
      query: "homelessness LA",
      limit: 5,
    });
  });
});

describe("buildHighlightsBody", () => {
  it("builds a /v2/scrape highlights request body", () => {
    assert.deepEqual(buildHighlightsBody("https://a", "housing first outcomes"), {
      url: "https://a",
      formats: [{ type: "highlights", query: "housing first outcomes" }],
    });
  });
});
