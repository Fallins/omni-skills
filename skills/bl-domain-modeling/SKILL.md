---
name: bl-domain-modeling
description: >-
  Build and sharpen a project's domain glossary and ADRs. Manual invoke only;
  also Read by bl-grill-with-docs.
disable-model-invocation: true
---

# bl-domain-modeling

## 語言

與使用者對話一律使用**繁體中文**。寫入 `CONTEXT.md`／ADR 可用英文或繁中，與專案既有風格一致；與使用者說明時用繁中。

## 主動建模

在設計過程中主動打磨領域模型：挑戰用語、構想邊界情境，並在詞彙與決策一成形就寫進文件。（只讀 `CONTEXT.md` 查詞彙不算本 skill。）

## 檔案結構

多數 repo 單一 context：

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

若根目錄有 `CONTEXT-MAP.md`，表示多 context；依 map 指向各區 `CONTEXT.md`／ADR。

懶建立：有東西要寫才建檔。第一個詞彙落地時建 `CONTEXT.md`；第一個 ADR 需要時建 `docs/adr/`。

若 `docs/agents/domain.md` 存在，遵守其中記載的 layout。

## 會話中

### 對照詞彙表

使用者用語與 `CONTEXT.md` 衝突時立刻指出並確認。

### 銳化模糊用語

提出精確的規範用語並請使用者拍板。

### 具體情境

用邊界情境壓力測試概念關係。

### 對照程式碼

聲稱與程式不符時表面矛盾並釐清。

### 即時更新 CONTEXT.md

詞彙一決議就更新；格式見同目錄 [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md)。

`CONTEXT.md` **禁止**實作細節——只做 glossary。

### ADR 從嚴

僅在三者皆成立時提議 ADR：(1) 難回頭 (2) 沒脈絡會怪 (3) 真有取捨。格式見 [ADR-FORMAT.md](./ADR-FORMAT.md)。

## 結束時

```
### 下一步建議
若剛完成需求 grilling：`/bl-to-spec`。若僅維護詞彙：可結束。
```
