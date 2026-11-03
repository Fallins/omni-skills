---
name: review-change
description: 依固定 revision 審查程式變更是否符合需求、規範與驗證證據，輸出可追溯且去重的 findings。
---

# 變更審查

用於 spec compliance 與 code-quality review。大型任務仍由 `large-task-orchestrator` 指定唯一協調 owner 並完成最終整合驗收；本技能提供審查方法，不另開派工／整合迴圈。

## 輸入與固定範圍

- 固定 base/head revision、工作樹 patch、repo 規則與允許的修改範圍。
- 需求、TaskContract、已批准設計 revision、驗收條件及已接受限制。
- `verify-change` 的 VerificationReceipt 和可檢查證據。沒有收據不代表沒有缺陷，也不能自行宣稱已驗證。
- 先確認實際差異與來源；不要只依摘要、作者自述或測試 exit code 審查。

## 兩個審查軸

1. **Spec compliance**：逐項比對需求／contract／設計與實際變更，檢查必要狀態、負向流程、資料副作用和未授權行為。指出缺少 acceptance 對應或與批准版本不一致之處。
2. **Code quality**：檢查正確性、錯誤處理、相容性、安全／權限、資料完整性、競態、可維護性和 regression。只把會造成可說明影響的問題列為 finding；個人風格偏好不當 blocker。

對背景 worker、lease、持久寫入或外部儲存，逐項核對在途 I/O、lease owner／到期、drain／停機、冪等恢復與 rollback acceptance，以及對應環境證據；單一 finding 修好不代表其他 gate 通過。每個 finding 依 [ReviewFinding contract](references/review-finding.md) 記錄位置、條件、影響、證據、修正方向和回歸驗收。`evidence_type` 必須為：

- `confirmed-static`：可由固定程式差異與契約證明。
- `reproduced`：在收據所記錄的環境與步驟實際重現。
- `needs-verification`：有具體疑點但證據不足，不稱為已證實 bug。

沿用同根因 finding ID 去重；已確認修復的問題沒有新證據不得重開。狀態只用 `open`、`fixed-pending-verification`、`verified-fixed`、`accepted-risk`、`not-a-bug`；`accepted-risk` 需要有權決策者的可查核接受紀錄，不能消除安全底線。審查者若也實作了這份變更，要標 `self-review`；角色名稱不同不代表審查獨立。

## 結果

列出阻塞 findings、非阻塞 findings、需求／差異覆蓋、使用的 revision、驗證收據、未審與未驗範圍。若沒有新 finding，寫明「在所列範圍未發現問題」，不可擴大成整個系統沒有 bug。需要修程式時交回 `implement-change`，修後重驗受影響 acceptance 並重審固定的新 revision。整體結果依 [CompletionDecision](../../docs/contracts/completion-decision.md) 區分實作、驗證、reviewability 與發布。
