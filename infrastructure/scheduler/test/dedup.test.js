import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { consolidateDuplicateActiveWorkflows } from "../dedup.js";

describe("consolidateDuplicateActiveWorkflows", () => {
  it("cancels older active workflows and keeps the newest", async () => {
    const workflows = [
      { id: "w-new", name: "research-cycle-2", status: "running", created_at: new Date("2026-01-02") },
      { id: "w-old", name: "research-cycle-1", status: "pending", created_at: new Date("2026-01-01") },
    ];
    const updates = [];

    const db = {
      async query(sql, params) {
        if (sql.includes("FROM workflows") && sql.includes("pending")) {
          return { rows: workflows };
        }
        if (sql.startsWith("UPDATE workflows")) {
          updates.push({ sql, params });
          return { rows: [] };
        }
        if (sql.startsWith("UPDATE workflow_steps")) {
          return { rows: [] };
        }
        return { rows: [] };
      },
    };

    const kept = await consolidateDuplicateActiveWorkflows(db);
    assert.equal(kept, "w-new");
    assert.equal(updates.length, 1);
    assert.equal(updates[0].params[1], "w-old");
  });

  it("returns null when no active workflows", async () => {
    const db = {
      async query() {
        return { rows: [] };
      },
    };
    assert.equal(await consolidateDuplicateActiveWorkflows(db), null);
  });
});
