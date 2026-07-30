---
name: bl-to-tickets
description: >-
  Break a plan, spec, or conversation into tracer-bullet tickets with blocking
  edges. Manual invoke only (/bl-to-tickets).
disable-model-invocation: true
---

# bl-to-tickets

## 語言

與使用者對話一律使用**繁體中文**。

## 前提

讀取 `docs/agents/issue-tracker.md`；缺失則先 `/bl-setup`，或預設本機 markdown（見下）。

## 流程

### 1. 蒐集脈絡

用對話既有內容；若使用者給了 spec／issue 路徑或編號，讀完整正文。

### 2. 探索 codebase（可選）

尚未探索則探索。標題與描述用領域詞彙；尊重 ADR。尋找可先做的 prefactor（「先讓改動變容易，再做容易的改動」）。

### 3. 起草垂直切片

拆成 **tracer bullet** tickets：

- 每個切片縱切完整路徑（schema／API／UI／tests），不是單層橫切
- 完成後可 demo 或可驗證
- 體積約一個乾淨 context window
- Prefactor 排在前面

每張票標明 **Blocked by**（無則可立即開始）。

**寬重構例外**：blast radius 極大的機械變更用 expand–contract，分批遷移，最後 contract。

### 4. 請使用者確認

列出編號清單：Title、Blocked by、交付內容。問粒度／依賴／是否合併拆分，直到核准。

### 5. 發布

依 tracker：

- **Local**：`.scratch/<feature>/issues/<NN>-<slug>.md`，從 `01`、依賴先寫；一票一檔。
- **GitHub／其他**：依 `docs/agents/issue-tracker.md` 建立 issue，並寫 blocking 關係。

Local 檔模板：

```markdown
# NN — <title>

**What to build:** （使用者視角端到端行為）

**Blocked by:** None — can start immediately | 或列出編號

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2
```

避免易過期的具體路徑／大段程式碼（prototype 決策片段除外）。

## 結束時

```
### 下一步建議
建議執行 `/bl-implement`：依核准的 tickets／spec 實作（內含 TDD，收尾 code-review）。
```
