---
name: verify-change
description: 執行、建立或維護可重跑的功能驗證入口，將驗收條件連到版本、環境與真實行為證據。
---

# 變更驗證

依任務選 `run`、`bootstrap` 或 `maintain`。本技能可獨立使用，也可由大型任務的唯一整合者呼叫；不建立第二個協調或派工流程。產品特定的 VerificationKit 是 repo 產物，不是新的通用 skill。

## 共通輸入與證據

- 核對 acceptance、功能／票據 ID、指定 repo／branch／commit／artifact、工作樹狀態、適用規則、可用環境、資料與帳戶前提。
- 先查 README、package scripts、既有測試和驗證入口；確認其版本、實際範圍與副作用。入口名稱存在不代表覆蓋本次 acceptance。
- 建立 acceptance-to-check 對照，分開記錄靜態、單元、整合、artifact、瀏覽器及必要實體環境檢查。Mock、HTTP 200、process exit 0 或服務存活不能單獨證明語意成功。
- 每個結果記錄可追溯的命令／動作、執行位置、版本、環境、可觀察結果及資料／檔案／事件副作用。credential 只記設定名稱和狀態，不記秘密值。
- 每項標記 `passed`、`failed`、`blocked` 或 `not-run`。必要環境或權限缺少就揭露 blocker，不把跳過、mock 或推測計為通過。
- 收據格式見 [VerificationReceipt](references/verification-receipt.md)；產品功能地圖見 [FeatureMap](references/feature-map.md)；若沒有可靠入口，依 [VerificationKit playbook](references/verification-kit.md) 建立或維護。
- Receipt 記錄驗證結果，不替代實作、review 或發布判定；整體工作狀態依共用 [CompletionDecision](../../docs/contracts/completion-decision.md) 分開回報。

## 證據適用與補驗

逐項核對證據的 acceptance、實際結果、方法、版本／產物及環境與目前要求是否一致，包含資料、帳戶、依賴和必要真實環境。可追溯且適用於同最終 revision（含工作樹差異）或同一確定產物的通過證據可沿用，不必自動重跑；產物相同也須確認環境與驗收範圍適用。跨 revision 不自動沿用：只有記錄具體 diff 與依賴影響分析，足以支持該 acceptance 未受影響時才考慮；不確定就補驗或標 blocked／not-run。修正、整合、環境或依賴改變後，對受影響項、缺失證據及新增整合風險補驗；各切片通過不等於整體流程通過。必要核心流程、權限、資料安全、重要回歸與專案強制 gate 不降級；指定真實資料庫、瀏覽器或 NAS 時，不以 mock 或較弱測試替代。保存沿用理由、證據來源、適用範圍與缺口，依 CompletionDecision 判定是否完成。

## Run

沿已存在且有效的專案入口驗收指定版本。先執行 Doctor 類唯讀檢查確認實例、版本、服務、埠、帳戶與資料前提；不符就停止 Drive，避免操作錯誤或他人的環境。從使用者入口跑 acceptance，檢查畫面／API、資料副作用和錯誤恢復是否一致，並保留清理後仍可讀的證據。若契約涉及背景程序、lease、持久 I/O 或外部儲存，依 acceptance 分別驗證實際程序生命週期、I/O drain、lease 到期／釋放、隔離 DB 與必要 NAS gate；合成 DB、artifact 或 mock 不能代替另一個指定的真實環境 gate，環境不可用就標 blocked。

## Bootstrap

只有缺少可靠、可重跑的入口時才建立最小 VerificationKit。先讀 repo、harness、啟動方式、資料初始化、認證前提與隔離能力，重用現有工具；不得為 bootstrap 擅自修改產品、安裝工具、開權限或清除資料。至少用隔離資料跑通一條 `Launch → Doctor → Drive → Evidence → Cleanup` 路徑並確認證據仍在，才可稱 kit 已試跑；其他 features 逐項標狀態。

## Maintain

程式、schema、依賴、環境或 harness 改變時，只重驗受影響的來源與 FeatureMap。完整 clean 必須覆蓋所選 map 的全部 feature；抽樣只能標 `partial`。分類為：

- `doc drift`：文件與已批准行為不一致，更新文件並保留來源。
- `harness gap`：產品行為有獨立證據，但測試入口無法驅動，修 harness 後實際重跑。
- `product regression`：產品行為不符已批准契約，保存失敗證據並交 `implement-change`；不可改預期值洗綠。

每次異常後重新 Doctor。程序健康但 UI／流程卡住時回到已知狀態，或只重啟自己建立且可識別的實例。Cleanup 只清本次建立且獲准清理的資源；禁止依程序名稱誤殺共享服務，且不得刪除證據。維護結果用 `clean`、`changed` 或 `blocked`，另列 coverage 和未驗項；`changed` 不代表已 push、開 PR 或部署。

需要產品修改時停止維護寫入並交 `implement-change`。所有結論都要分清實際觀察與文件／靜態推論，不以測試框架 exit status 代替語意判定。
