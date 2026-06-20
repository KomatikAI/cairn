/**
 * Scheduler interval helpers (testable without a live DB pool).
 */

/**
 * Node's setTimeout/setInterval use a 32-bit signed integer for the delay.
 * Values exceeding 2^31-1 are silently clamped to 1ms (TimeoutOverflowWarning),
 * which makes the timer fire ~1000x/sec. A configured cycle interval meant to
 * mean "effectively never" (e.g. the dry-run's 525960-minute sentinel, which
 * resolves to 31,557,600,000 ms) would therefore spawn duplicate cycles
 * continuously. Clamp to the timer limit instead.
 */
export const MAX_TIMER_MS = 2_147_483_647; // 2^31 - 1

const DEFAULT_CYCLE_INTERVAL_MINUTES = 60;

/**
 * Resolve a configured CYCLE_INTERVAL_MINUTES value to a safe delay in
 * milliseconds, clamped to Node's 32-bit timer limit.
 */
export function computeCycleIntervalMs(minutes, maxMs = MAX_TIMER_MS) {
  const parsed = parseInt(minutes || DEFAULT_CYCLE_INTERVAL_MINUTES, 10);
  const effective = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CYCLE_INTERVAL_MINUTES;
  return Math.min(effective * 60 * 1000, maxMs);
}
