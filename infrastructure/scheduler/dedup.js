/**
 * Workflow deduplication helpers (testable without a live DB pool).
 */

export async function consolidateDuplicateActiveWorkflows(db) {
  const active = await db.query(
    `SELECT id, name, status, created_at
     FROM workflows
     WHERE status IN ('pending', 'running')
     ORDER BY created_at DESC`
  );
  if (active.rows.length <= 1) return active.rows[0]?.id ?? null;

  const [keep, ...dupes] = active.rows;
  for (const row of dupes) {
    await db.query(
      `UPDATE workflows
       SET status = 'failed', updated_at = now(), result = $1
       WHERE id = $2`,
      [
        JSON.stringify({
          reason: "duplicate_workflow",
          superseded_by: keep.id,
          cancelled_at: new Date().toISOString(),
        }),
        row.id,
      ]
    );
    await db.query(
      `UPDATE workflow_steps
       SET status = 'failed', completed_at = now(),
           output = jsonb_build_object('error', 'duplicate workflow cancelled by scheduler')
       WHERE workflow_id = $1 AND status IN ('pending', 'running')`,
      [row.id]
    );
  }

  console.log(
    `[scheduler] Dedup: cancelled ${dupes.length} duplicate active workflow(s), ` +
      `keeping '${keep.name}' (${keep.id})`
  );
  return keep.id;
}
