# 合成公司 adapter 範例

本文件只是一個虛構 adapter 的組合測試案例。名稱、規則、能力、需求與欄位皆為合成資料；不描述或修改任何真實公司的工作流程，不含真實 repo 路徑、內部 command、帳戶或憑證。

## Adapter 定義

- `adapter_id`: `fictional.product-change`
- `version`: `0.1.0-example`
- `scope`: 虛構的單一產品 repo 與一般功能／BUG 工作
- `owner`: 本次 adapter invocation 的唯一 coordination owner
- `inputs`: 使用者需求、repo 規則位置、可取得的程式和測試證據
- `outputs`: TaskBrief／TaskContract、需要時的 DesignSpec／實作映射（light 內嵌任務卡；large 使用完整 DesignImplementationMap）、程式差異、VerificationReceipt、ReviewFindings 與 coverage

### 組合方法

| 順序 | 通用方法 | 虛構本地能力 | 產物映射 |
|---|---|---|---|
| 理解 | `understand-task` | `Fictional Request Card`（僅範例名稱） | 本地 request ID ↔ TaskBrief 需求與證據來源 |
| 規劃 | `plan-change` | `Fictional Acceptance Index`（僅範例名稱） | 本地 acceptance ID ↔ TaskContract acceptance／FeatureMap ID |
| 設計（有未定 UI 時） | `design-interface` | `Fictional Design Review`（僅範例名稱） | exact DesignSpec revision／實際使用者決定 ↔ 返回 Plan 的映射（light 內嵌任務卡；large 完整 DesignImplementationMap）；UXAcceptance 與 LayoutAcceptance 分開 |
| 實作 | `implement-change` | `Fictional Component Notes`（僅範例名稱） | approved TaskContract 與 DesignSpec revision／map（如適用）↔ 修改檔案與回報 |
| 驗證 | `verify-change` | `Fictional Test Entry`（僅範例名稱） | 執行結果與原始輸出 ↔ VerificationReceipt checks／evidence |
| 審查 | `review-change` | `Fictional Change Summary`（僅範例名稱） | 本地 finding ID ↔ ReviewFinding 的 revision、位置、證據與回歸驗收 |

頂層方法不依賴、不載入此 adapter；刪除這個合成例子不影響通用技能。adapter 只傳遞方法版本、資料映射及責任，不複製通用流程全文。

## 唯一 owner 與任務大小

- 輕量切片由 invocation owner 順序確認 TaskBrief／批准條件、交單一 writer 實作、呼叫驗證與審查，再整合結果。角色可由同一執行者依序承擔，但 self-review 必須標明；不可用角色別名宣稱獨立。
- 若任務符合 large 條件，唯一大型協調 owner 改由 `large-task-orchestrator` 承擔。adapter 將已核實的需求、規則引用和本地能力映射提供給它，不再另建計畫、派工表或第二個 orchestrator。`coordinate-work` 是可引用的生命週期方法；LTO 已接手時它不另開 coordinator、DAG、台帳或派工迴圈。`implement-change`、`verify-change`、`review-change` 只處理各自階段，不接管整案協調；LTO 保留停止／移交、單一 writer、整合 review 與最終驗收。
- 驗證 owner 和產品 writer 分清寫入範圍。驗證需要修產品時交回 implement-change；維護 FeatureMap／VerificationKit 不得順手改產品。

## 外部規則與授權

示例輸入只引用兩個虛構來源：「fictional organization rules」與「fictional repository rules」。adapter 讀取本次宿主實際提供的有效規則並引用其範圍，不重寫規則優先級、不把假想政策寫進頂層技能。工具、發布、帳戶、資料存取及清理是否允許，依當次有效授權；adapter 的 capability 清單不會創造權限。來源衝突時記錄引用與受阻步驟並停止受影響動作。

## 範例驗收

1. 方法引用方向是 adapter → 頂層與虛構本地能力；沒有頂層反向載入公司內容。
2. 未定 UI 依 Plan → design-interface → 使用者審核 → 返回 Plan 更新 map／TaskContract；實作只消費批准版本，UX／Layout acceptance 分開追蹤。
3. 每次 invocation 只有一個 coordinator；large 時由 LTO 唯一整合，coordinate-work 只供引用，adapter 不重複派工。
4. Request／acceptance／feature／receipt／finding 的 ID 與版本映射明確，原始證據仍可追溯。
5. 外部規則只被引用；衝突、缺少授權或必要能力時會阻塞受影響步驟。
6. 全文沒有真實公司流程、私有 command、路徑、帳戶或秘密資料。
