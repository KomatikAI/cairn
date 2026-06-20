import test from "node:test";
import assert from "node:assert/strict";

import { computeCycleIntervalMs, MAX_TIMER_MS } from "../interval.js";

test("computeCycleIntervalMs honors normal minute values", () => {
  assert.equal(computeCycleIntervalMs("60"), 3_600_000);
  assert.equal(computeCycleIntervalMs(1440), 86_400_000);
});

test("computeCycleIntervalMs clamps overflow to Node's 32-bit timer limit", () => {
  // 525960 min (the dry-run "single-cycle" sentinel) = 31,557,600,000 ms,
  // which exceeds 2^31-1. Node would otherwise clamp the delay to 1ms
  // (TimeoutOverflowWarning), making setInterval fire ~1000x/sec and spawn
  // duplicate cycles. It must be clamped to the timer limit instead.
  assert.equal(computeCycleIntervalMs("525960"), MAX_TIMER_MS);
  assert.ok(computeCycleIntervalMs("525960") < 31_557_600_000);
});

test("computeCycleIntervalMs applies a sane default for missing or garbage input", () => {
  assert.equal(computeCycleIntervalMs(undefined), 3_600_000);
  assert.equal(computeCycleIntervalMs("not-a-number"), 3_600_000);
  assert.equal(computeCycleIntervalMs("0"), 3_600_000);
});
