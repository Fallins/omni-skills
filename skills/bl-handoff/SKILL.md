---
name: bl-handoff
description: >-
  Compact the conversation into a handoff doc for another agent session. Manual
  invoke only (/bl-handoff).
disable-model-invocation: true
---

# bl-handoff

## 語言

與使用者對話一律使用**繁體中文**。Handoff 文件本身用繁中（除非使用者要求英文）。

## 指示

寫一份交接文件，讓新 session 的 agent 能接續工作。

- 存到**使用者 OS 的暫存目錄**（例如 macOS `$TMPDIR`），**不要**預設寫進 workspace（除非使用者明確要求路徑）。
- 含「建議 skills」小節：列出下一步該呼叫的 `/bl-*`。
- 已存在於 spec／plan／ADR／issue／commit／diff 的內容不要重複貼；改引用路徑或 URL。
- 遮罩敏感資訊（金鑰、密碼、個資）。
- 若使用者有傳參數，視為「下一 session 焦點」並據此裁切。

## 結束時

```
### 下一步建議
在新 session 開啟 handoff 檔後，依文件建議的 `/bl-*` 繼續（常見為 `/bl-implement` 或 `/bl-to-tickets`）。
```
