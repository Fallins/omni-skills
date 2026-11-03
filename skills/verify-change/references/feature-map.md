# FeatureMap

FeatureMap 是產品的驗收入口地圖，不是通用 skill 的產品清單。每個穩定 feature 使用可持續引用的 `feature_id`；票據和 TaskContract 可引用該 ID，而非把唯一操作路徑留在已關閉任務裡。

## 必要欄位

- `feature_id`、名稱與使用者目標。
- 入口（畫面／公開 API／正式 CLI）與前置條件。
- 資料準備、可重跑的使用者步驟、可觀察結果。
- 預期資料／檔案／事件副作用。
- 負向與恢復情境、重試／取消／返回情境（適用時）。
- 假成功陷阱（例如 exit 0 但資料未保存）。
- 來源 repo／commit、需求或 acceptance IDs、對應 harness／kit 版本。
- 最後驗證狀態、日期／環境與 evidence reference；`passed` 必須連到真實可檢查證據。

## 合成範例

以下欄位只是測試 fixture，不能當成任何實際產品的驗收規格：

```yaml
feature_id: SYN-REPORT-001
goal: 透過合成 CLI 建立一筆報告
entry: 測試 fixture 的正式 submit CLI
preconditions: 隔離的 run-owned data directory；synthetic account label
data_preparation: 每個 run 使用新目錄和唯一 run_id
steps:
  - 從 CLI submit 一筆已知輸入
observable_result: CLI 回報穩定 report_id 與 status=ready
side_effects: 該 run 的資料目錄內新增一筆報告紀錄
negative_recovery: 缺少必要標題時回傳可觀察錯誤且不建立紀錄
false_success_traps: exit 0 但紀錄不存在
source_revision: synthetic-fixture-v1
harness: verify-change-workflow.test.ts
last_validation: test fixture only；不可代表 agent 行為或任何外部產品
```

無法抵達的 feature 要列出試過的入口和缺少的前提，狀態標 `blocked`／`unreachable`，不可當成 passed。新增或改變批准行為時同步更新 map 和測試；維護文件不能自行定義新產品行為。
