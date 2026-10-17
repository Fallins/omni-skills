---
name: gs-diagnosing-bugs
description: >-
  Disciplined diagnosis loop for hard bugs and performance regressions. Manual
  invoke only (/gs-diagnosing-bugs).
disable-model-invocation: true
---

# gs-diagnosing-bugs

## 語言

與使用者對話一律使用**繁體中文**。

探索時依 `AW/domain.md` 讀取已有的 `AW/CONTEXT.md`／相關 ADR，以建立心智模型；沿用專案既有文件命名，不為本次除錯搬移文件。

## 秘密遮蔽

展示指令、輸出與 captured artifacts 前，先以 `<REDACTED>` 遮蔽金鑰、密碼、cookie 等秘密。認證資料留在環境變數，避免出現在可見指令與日誌；HAR／trace 只引用承載診斷訊號的片段。HITL 的 `capture` 會回印答案，只收觀測結果，登入由使用者透過 `step` 完成。遮蔽後證據不足時明說缺口，索取所需的非敏感訊號。

## Phase 1 — 建立回饋迴圈

這是本 skill 的核心。沒有對「這個 bug」會紅的緊密訊號，後面都是空轉。

優先嘗試（約略順序）：失敗測試、curl／HTTP、CLI＋fixture、headless browser、重放 trace、拋棄式 harness、property／fuzz、bisect harness、differential、最後 HITL（可用同目錄 `scripts/hitl-loop.template.sh`）。

收緊迴圈：更快、更準、更決定性。非決定性 bug 先提高再現率。

真的建不出迴圈：明確停止、列出嘗試、向使用者要環境／已遮蔽的 artifact／臨時觀測許可。**不要**沒有迴圈就亂猜。

完成條件：已實際跑過一次、會紅、決定性、夠快、可無人值守的**一條指令**（貼出已遮蔽的指令與輸出）。未達標勿進 Phase 2。

## Phase 2 — 重現＋最小化

確認是使用者描述的那個失敗；縮到仍會紅的最小情境。

## Phase 3 — 假設

列 **3–5 個可證偽**假設（含預測）並排序，先給使用者看再測。這是資訊同步，不是新的核准關卡；在已有授權內繼續測試，並納入使用者隨後提供的證據。

## Phase 4 — 觀測

一次改一個變數；偏好 debugger → 針對性 log（唯一前綴如 `[DEBUG-a4f2]`）。效能問題先量測再修。

## Phase 5 — 修復＋回歸

有正確 seam 時：先寫會失敗的回歸測 → 修 → 綠 → 再跑 Phase 1 原始情境。若透過修改程式或 fixture 強制製造紅燈，先與保留的未修改副本做 diff，證明 mutation 確實落到測試路徑，再信任結果；不要覆蓋使用者原有變更。無正確 seam 則記為架構發現。

## Phase 6 — 清理＋事後

原 repro 不再發生；回歸測過（或記錄無 seam）；清掉 DEBUG 前綴；刪拋棄式原型；在說明中寫出正確假設。必要的架構缺口列為後續建議；不強制開新的架構討論或阻擋本次修復收尾。

## 結束時

```
### 下一步建議
修畢後建議 `/gs-tdd`（鎖回歸）或 `/gs-code-review`。
```
