# ReviewFinding

一個 finding 對應一個可驗證的根因。保留 stable ID，跨 revision 更新狀態，不把同一根因拆成多則表面相同的警告。

```yaml
finding_id: stable-finding-id
reviewed_revision: exact-reviewed-head
severity: blocking | non-blocking | informational
evidence_type: confirmed-static | reproduced | needs-verification
location: file-and-line-or-symbol
condition: when-the-problem-occurs
impact: user-data-compatibility-security-or-delivery-impact
evidence: source-diff-test-or-verification-receipt-reference
proof_or_reproduction: exact-reasoning-or-steps-and-environment
fix_direction: bounded-suggested-correction
regression_acceptance: check-that-proves-the-fix
verification: check-result-or-pending
status: open | fixed-pending-verification | verified-fixed | accepted-risk | not-a-bug
```

未重現的疑點標 `needs-verification` 並寫明最小查核方式。只有 finding 所依據的新證據改變或修正不完整時才重開已固定項目；純重述不建立新 ID。`accepted-risk` 必須有適格決策者的可查核依據；不能接受違反安全底線的風險。
