---
name: gs-to-spec
description: >-
  Synthesize the current conversation into a spec and publish to the configured
  tracker. No interview. Manual invoke only (/gs-to-spec).
disable-model-invocation: true
---

# gs-to-spec

## 語言

與使用者對話一律使用**繁體中文**。Spec 本文可用繁中或與專案文件一致的語言。

## 前提

1. Read 套件 `docs/agent-work-and-setup.md`（見該檔路徑說明）。
2. 執行其中的 **缺 setup 閘門**：無 `AW/issue-tracker.md`（`AW` 見 `docs/agent-work-and-setup.md`）則提示執行 **`/gs-setup`**（或「幫我 setup」代跑），**完成前不要寫 spec**。
3. 讀取 `AW/issue-tracker.md`；Local 路徑以該檔為準。**查找** CONTEXT／ADR／既有 spec 時一律到 `AW/`，不要去業務 repo 根目錄（`scratch` layout 時 `AW` 即 `.scratch/<repo>/`）。

**不要再訪談**——只綜合對話與程式庫既有理解。

## 流程

1. 若尚未探索 codebase，先探索。全文使用領域詞彙（有 `AW/CONTEXT.md` 就讀）；遵守 `AW/docs/adr/` 相關 ADR。
2. 草擬要測試的 **seams**（優先既有、越高層越好、越少越好）。與使用者確認 seams。
3. 依下方模板寫 spec，並依 issue-tracker 設定發布。Local 典型路徑：  
   `AW/<feature>/spec.md`  
   狀態標為 `ready-for-agent`（若 tracker 有此概念）。

## Spec 模板

## Problem Statement

使用者視角的問題。

## Solution

使用者視角的解法。

## User Stories

長列表，格式：`As an <actor>, I want <feature>, so that <benefit>`（或等價繁中）。盡量涵蓋面向。

## Implementation Decisions

模組／介面／架構／schema／API／互動決策。**不要**寫易過期的具體檔案路徑或大段程式碼。例外：prototype 產出的精簡決策片段（狀態機、型別形狀等）。

## Testing Decisions

好測試定義（只測外部行為）、測哪些模組、repo 內類似先例。

## Out of Scope

明確不做。

## Further Notes

其他註記。

## 結束時

```
### 下一步建議
建議執行 `/gs-to-tickets`：把 spec 拆成可獨立交付的 tracer-bullet tickets。
```
