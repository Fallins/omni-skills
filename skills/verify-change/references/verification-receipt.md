# VerificationReceipt

每次驗證交付一份可追溯收據；保留原始輸出／artifact reference，不只留一段「測試通過」。可沿用 repo 既有報告格式，但至少能還原以下資訊：

```yaml
verification_id: stable-run-id
task_id: ticket-or-task-id
task_contract_revision: exact-contract-revision-or-not-applicable
verifier: role-or-owner
independence: independent | self-review | not-reviewed
target:
  repo: repository-identity
  branch: branch-name
  commit: exact-commit
  dirty_patch: patch-hash-or-clean
  artifact_hash: hash-or-not-applicable
environment:
  runtime: version
  service_instance: observed-identity-or-not-applicable
  account: synthetic-or-redacted-label
  data_fixture: fixture-id-or-hash
  tested_at: timestamp-with-timezone
checks:
  - acceptance_id: AC-1
    command_or_action: exact-command-and-working-directory-or-user-entry
    exit_status: 0
    result: passed | failed | blocked | not-run
    observed: concise-observation
    evidence: immutable-or-reviewable-reference
    skip_reason: reason-or-not-applicable
coverage:
  selected_features: [SYN-REPORT-001]
  tested_features: [SYN-REPORT-001]
  not_run_or_blocked: []
gaps: []
cleanup:
  outcome: complete | partial | not-required | blocked
  removed_resources: [run-owned-resource-ids]
  evidence_retained: true
limitations: []
```

收據還要明確說明整體結果與尚未驗範圍。只有所有必要 acceptance 均有適用證據時才報 passed；任何 required check blocked／not-run 都要揭露 coverage gap。Process exit status 與語意結果分欄。整體 scope、實作、驗證、reviewability 與發布狀態依 [CompletionDecision](../../../docs/contracts/completion-decision.md) 另行表達。不可在收據寫 credential 值、個人資料或無權保存的內容。
