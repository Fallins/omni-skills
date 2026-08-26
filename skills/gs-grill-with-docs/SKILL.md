---
name: gs-grill-with-docs
description: >-
  Grilling session that also sharpens domain glossary and ADRs. Manual invoke
  only; use when the user runs /gs-grill-with-docs.
disable-model-invocation: true
---

# gs-grill-with-docs

## 語言

與使用者對話一律使用**繁體中文**。

## 指示

1. 用 Read 讀取並遵循 `gs-grill-core/SKILL.md`（與本 skill 同層安裝目錄）。
2. 用 Read 讀取並遵循 `gs-domain-modeling/SKILL.md`（與本 skill 同層安裝目錄）。
3. 在 grilling 過程中同步維護領域詞彙（`CONTEXT.md`）與必要的 ADR。
4. 若尚無 `AW/issue-tracker.md`（`AW` 見 `docs/agent-work-and-setup.md`），**提示**執行 **`/gs-setup`**（或「幫我 setup」）；可繼續 grilling，但 CONTEXT／ADR **寫入 `AW/`**，且之後 `/gs-to-spec`／`/gs-to-tickets` 會被閘門擋住直到 setup 完成。細節見套件 `docs/agent-work-and-setup.md`。

## 結束時

```
### 下一步建議
建議執行 `/gs-to-spec`：把目前共識收成 spec，無需再訪談。
```
