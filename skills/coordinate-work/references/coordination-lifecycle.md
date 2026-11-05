# Coordination lifecycle

## 1. Establish one owner and one source of truth

Record the task authorization and scope; active coordinator; Plan/contract revision; repo, branch, and base; current dirty state; dependencies; one task ledger; and one resume location. If another coordinator is active, this method does not create a parallel owner. If no executable Plan or complete task contracts exist, return to Plan rather than dispatching guesses.

## 2. Prepare ownership and resources

For every task, record one goal, requirement IDs, owner, owned files/regions, read-only inputs, exact contract revision, dependencies and artifact revisions, non-goals, verification evidence, retry/stop limits, and report format. Map shared files and semantic resources (for example DB/schema, NAS paths, leases, ports, long-lived services, generated files, external accounts, and background I/O). For persistent work, record in-flight operations and lease owner/renewal/expiry. Serialize conflicts or assign one owner; separate worktrees alone do not prove isolation.

## 3. Dispatch and track

Dispatch only tasks authorized and marked ready-to-dispatch. Record requested versus observed worker/model/tool configuration honestly. Maintain status and evidence in the single ledger; don't dispatch duplicate work because a response is delayed. Retry only when new evidence changes the next action and within the agreed limit.

## 4. Stop, revise, and hand off

On cancellation, contract change, or owner transfer, stop new dispatch and integration for affected work. Request a stop, then verify the worker and every relevant tool/background process have stopped writing, in-flight I/O is drained, and leases/writer locks are released or confirmed expired. Save diff, artifact, evidence, last contract revision, and exact resume point. If stop cannot be confirmed, keep the overlap blocked and do not assign a replacement writer. Publish a new contract/ownership revision and obtain acknowledgement before work resumes. Mark late results against old revisions stale until reconciled.

## 5. Review, integrate, and accept

Check returned work against requirements, contract, and code quality; one fixed-revision review can cover both axes unless independent review is required. Re-evaluate affected evidence after fixes or rebase. Resolve integration conflicts under a single owner. The coordinator checks that every required normal, boundary, error, recovery, and integration acceptance has applicable evidence for the final integrated revision. Apply verify-change's evidence reuse rules; add checks for affected areas, missing evidence, and new integration risks, without automatically rerunning valid checks. Record exact revision, environment, evidence, and gaps; never infer whole-task completion from each slice passing or waive a required gate.
