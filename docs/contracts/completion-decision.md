# CompletionDecision

CompletionDecision 將程式變更、必要驗證、審查可用性與發布分開判定，避免某一階段的成功被誤報成整案已完成。依任務需要用一份簡短紀錄填寫；不要在每個 skill 或 adapter 維護不同的完成定義。

```yaml
delivery_revision: exact-commit-or-artifact
required_acceptance: [AC-1, AC-2]
verification_receipts: [receipt-reference]
unresolved_findings: [finding-ids]
accepted_exceptions: [decision-reference-or-empty]
scope_result: complete | partial | blocked
implementation_status: complete | partial | not-started
verification_status: complete | partial | blocked | not-run
review_status: reviewable | changes-requested | not-reviewed
release_status: published | not-published | blocked | not-requested
```

- `scope_result=complete` 只代表本次已批准 scope 的必要交付完成，不代表全產品、跨票整合或 release gate 都完成。
- `implementation_status` 只由實際程式差異支持；沒有改程式時填 `not-started` 或不適用，不借用 test exit code。
- `verification_status=complete` 要求必要 acceptance 都有適用的通過證據；部分覆蓋用 `partial`，必要檢查無法執行用 `blocked` 或 `not-run`。
- `review_status=reviewable` 表示固定 revision 的審查材料可用且所需 review 完成；若有 blocking finding，填 `changes-requested`。審查獨立性另照實標記。
- `release_status=published` 需要目標環境的發布證據；commit、build、測試、merge 或可 review 都不等於發布。未要求發布填 `not-requested`。
- `accepted_exceptions` 只連到有權決策者的真實紀錄；不得自我批准、刪除安全底線或把 unknown 寫成 accepted。
