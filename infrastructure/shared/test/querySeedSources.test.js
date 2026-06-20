import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { querySeedSources } from "../supabase.js";

// Minimal stub of the supabase query builder used by the helper.
// The chain is itself thenable so `await builder.select().eq()...` resolves
// to { data, error }. (A Symbol.toStringTag of "PromiseLike" does NOT make
// an object thenable — only a real `.then` method does.)
function fakeClient(rows, { throwErr = false } = {}) {
  const chain = {
    select() { return chain; },
    eq() { return chain; },
    gte() { return chain; },
    order() { return chain; },
    limit() { return chain; },
    then(resolve) {
      if (throwErr) resolve({ data: null, error: { message: "boom" } });
      else resolve({ data: rows, error: null });
      return Promise.resolve(rows);
    },
  };
  chain[Symbol.toStringTag] = "PromiseLike";
  return { from: () => chain };
}

describe("querySeedSources", () => {
  it("returns rows when supabase + seedId provided", async () => {
    const rows = [{ id: "1", url: "https://example.org", query: "q" }];
    const out = await querySeedSources(fakeClient(rows), { seedId: "002-homelessness-la" });
    assert.deepEqual(out, rows);
  });

  it("returns [] when supabase is null", async () => {
    const out = await querySeedSources(null, { seedId: "x" });
    assert.deepEqual(out, []);
  });

  it("returns [] when seedId missing", async () => {
    const out = await querySeedSources(fakeClient([]), {});
    assert.deepEqual(out, []);
  });

  it("returns [] on a supabase error (swallow, do not throw)", async () => {
    const out = await querySeedSources(fakeClient(null, { throwErr: true }), { seedId: "x" });
    assert.deepEqual(out, []);
  });
});
