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

針對計畫、決策或構想，把需要釐清的選擇整理成決策樹：每個決策連到依賴它的後續決策，沿樹逐輪訪談直到達成共識。每個問題都附上**建議答案**，問法讓「是／好」代表接受該建議。

**每輪只問前提已確定、可獨立回答的問題**（frontier），以編號與推薦答案一起呈現，等使用者回覆後重算下一輪。依賴本輪未回答問題的選擇留到後一輪；問題多時依認知負荷分批，不為湊齊整輪塞入所有問題。已明確回答的決策直接沿用，不重問。

若事實可從環境（檔案系統、工具、程式碼）查到，自己查，不要問。有適用且獲准的 subagent 時可委派獨立查證；調查尚未完成就只暫緩依賴它的問題，其餘已具前提的問題可繼續。**決策**交給使用者並等待回答；使用者已明確授權自行決定的範圍則沿用該授權。

在使用者確認已達成共識之前，不要開始實作或改程式。

## 結束時

```
### 下一步建議
若這次 grilling 是為了工程需求對齊：建議執行 `/gs-to-spec`（把共識收成 spec）。
若只是一般決策釐清：可結束，或視需要 `/gs-handoff`。
```
