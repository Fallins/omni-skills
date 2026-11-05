---
name: coordinate-work
description: Coordinate a bounded multi-task execution using one owner, explicit work contracts, shared-resource controls, stop/resume handoffs, and final integration acceptance. When large-task-orchestrator already owns the task, use this as a method reference only.
---

# Coordinate work

This skill defines a reusable coordination method. First identify the active coordinator from the user's instruction, current Plan, task ledger, or repo adapter. Read the [coordination lifecycle](references/coordination-lifecycle.md).

- If `large-task-orchestrator` (LTO) is active, LTO remains the only coordinator. Use this skill's lifecycle guidance inside LTO; do not create a second DAG, task ledger, dispatch loop, writer, or integration gate.
- If an authorized project/company adapter already names a coordinator, that coordinator remains the owner; compose this method only where the adapter permits.
- Act as coordinator only when explicitly assigned that role and no other coordinator owns the execution. Do not infer execution authorization from a request to plan or coordinate.

The coordinator maintains one revisioned task ledger, dependency map, ownership map, and resume pack. Each work item has a single outcome and writer, exact inputs/revisions, owned files/resources, dependencies, non-goals, validation evidence, stop conditions, and handoff format. Parallelize only after checking both file ownership and semantic shared resources such as databases/schema, NAS, leases, ports, services, generated artifacts, external accounts, and background I/O. For long-running work, record active operations and lease owner/expiry alongside writer ownership.

Before dispatch, validate the Plan's ready-to-dispatch contract and authorization. On a contract/revision/owner change, stop affected work; do not reassign a shared write until the previous worker and its tools/background processes are confirmed stopped, in-flight I/O is drained, and any lease or writer lock is released or confirmed expired. Preserve diffs and evidence, publish the new revision, and require acknowledgement before resume. A timeout or stop request is not stop confirmation.

Review returned work against its contract and keep blocked/partial states explicit. The coordinator is accountable for final whole-scope acceptance: check that every required acceptance has applicable evidence for the final integrated revision, reuse evidence only under verify-change, and fill gaps and new integration risks. This responsibility does not require personally rerunning all tests. Slice tests or worker claims alone do not prove integrated flows. Preserve required gates, report actual evidence and gaps, and do not present synthetic checks as model, browser, or user validation.
