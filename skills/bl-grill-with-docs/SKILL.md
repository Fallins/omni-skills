---
name: bl-grill-with-docs
description: >-
  Grilling session that also sharpens domain glossary and ADRs. Manual invoke
  only; use when the user runs /bl-grill-with-docs.
disable-model-invocation: true
---

# bl-grill-with-docs

## 語言

與使用者對話一律使用**繁體中文**。

## 指示

1. 用 Read 讀取並遵循 `~/.cursor/skills/bl-grilling/SKILL.md`。
2. 用 Read 讀取並遵循 `~/.cursor/skills/bl-domain-modeling/SKILL.md`。
3. 在 grilling 過程中同步維護領域詞彙（`CONTEXT.md`）與必要的 ADR。
4. 若專案尚無 `docs/agents/issue-tracker.md`，提醒使用者先跑 `/bl-setup`（可繼續 grilling，但之後 to-spec／to-tickets 需要設定）。

## 結束時

```
### 下一步建議
建議執行 `/bl-to-spec`：把目前共識收成 spec，無需再訪談。
```
