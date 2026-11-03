# VerificationKit：run／bootstrap／maintain

VerificationKit 是 repo／產品特定的重跑入口。位置和可保存內容依該 repo 的有效規則決定；通用技能只定義欄位與操作方法，不寫入公司路徑、私有命令或帳號政策。確認現有 harness 不能可靠重跑後，才新增 kit。

## 最小元件

- **Launch**：已核實的啟動／準備命令、工作目錄、必要設定名稱、migration／seed 與可用狀態判準。DB ping 只證明連線，不證明資料可用。記下服務／版本前提；不暴露秘密值。
- **Doctor**：唯讀確認實例、repo／artifact／commit、服務、埠、帳號和資料前提。目標不符即停止後續 Drive，不能自動連到「看起來可用」的其他 instance。
- **Drive**：從使用者入口執行可重跑步驟，使用穩定 selector、公開 API 或正式 CLI。內部 setter 不可冒充使用者流程。步驟應涵蓋預期主要結果與本 feature 的重要負向／恢復行為。
- **Evidence**：保存動作、可見結果與資料／檔案／事件副作用，連回 feature ID、acceptance、版本與環境；把原始證據和解讀分開。證據須在 Cleanup 後仍可讀。
- **Cleanup**：只清理由本次 run 建立、可識別且獲授權的資源。保留 evidence；不得按程序名稱終止共用服務或刪除不能歸屬於本次 run 的資料。
- **Helpers**：列用途、依賴、參數、工作目錄、命令、輸出和常見失敗；讓下一位執行者可重跑，不需猜工具用法。

## Bootstrap 順序

1. 固定 repository revision、現存未提交改動、驗證 owner 和允許的產物位置。
2. 盤點既有 test runner、服務啟動、seed／migrations、認證與隔離能力；能重用就不另建 runner。
3. 先選少數代表性 feature，建 FeatureMap，再實作 Launch／Doctor／Drive／Evidence／Cleanup／Helpers。
4. 在隔離資料上從乾淨狀態實跑完整生命週期。確認 Doctor 對正確目標放行、錯誤目標停止；確認 Drive 由使用者入口產生預期可觀察結果及副作用；確認 Cleanup 只移除本次資源且 Evidence 仍在。
5. 留下版本、命令、exit status、語意結果、Coverage 與殘留資源。只跑過代表性 feature 就只能標 partial，不可稱整張 FeatureMap 通過。

若必要環境或授權不足，交 kit 草案和確切 blocker。不要以假服務、mock、DB ping 或模型自述冒充端到端行為證據。

## Maintain 分類與覆蓋

按改動來源找受影響 feature：程式／schema／API、依賴、資料準備、啟動／設定、selector／入口、期望文件或 Evidence schema。更新來源與 FeatureMap 後重跑必要的受影響路徑；執行任何操作前重新 Doctor。

| 觀察 | 分類 | 處置 |
|---|---|---|
| 批准行為已由獨立證據確認，但說明文字描述不同 | `doc drift` | 修正文檔，記錄依據與版本；不修改產品 |
| 批准行為有證據存在，但入口因 selector／driver／fixture 不相容而無法操作 | `harness gap` | 修正 kit，實際重跑受影響路徑 |
| 由有效入口觀察到的產品結果違反批准契約 | `product regression` | 保存失敗證據並交 implement-change；不改 acceptance |
| 證據不足以區分以上情況 | `blocked`／`unknown` | 說明缺少的觀察、嘗試方式與解除條件；不可強選分類 |

`clean` 僅代表選定 FeatureMap 範圍在指定 revision／環境已重驗且無 kit/map 文件變更；`changed` 表示 kit 或 map 經驗證後有更新；`blocked` 表示必要前提不足。抽樣需明列 `tested / selected` coverage，並標 `partial`。
