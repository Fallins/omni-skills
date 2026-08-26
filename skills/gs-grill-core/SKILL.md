---
name: gs-grill-core
description: >-
  Relentless interview loop to stress-test a plan or decision. Used by
  gs-grill-with-docs and gs-grill-me. Manual invoke only.
disable-model-invocation: true
---

# gs-grill-core

## 語言

與使用者對話一律使用**繁體中文**。

## 指示

針對計畫、決策或構想，持續訪談直到達成共識。沿著決策樹逐分支走，一次解開一個相依決策。每個問題都要附上你的**建議答案**。

**一次只問一題**，等使用者回覆再繼續。一次多問會讓人混亂。

若事實可從環境（檔案系統、工具、程式碼）查到，自己查，不要問。**決策**則必須交給使用者——提出來並等待回答。

在使用者確認已達成共識之前，不要開始實作或改程式。

## 結束時

```
### 下一步建議
若這次 grilling 是為了工程需求對齊：建議執行 `/gs-to-spec`（把共識收成 spec）。
若只是一般決策釐清：可結束，或視需要 `/gs-handoff`。
```
