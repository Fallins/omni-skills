---
name: bl-code-review
description: >-
  Two-axis review (Standards vs Spec) of git diff since a fixed point, via
  parallel Cursor Task subagents. Manual invoke only (/bl-code-review).
disable-model-invocation: true
---

# bl-code-review

## 語言

與使用者對話一律使用**繁體中文**。Subagent 可用英文蒐集，你彙總給使用者時用繁中。

對 `HEAD` 與使用者指定固定點之間的 diff 做雙軸 review：

- **Standards** — 是否符合本 repo 已文件化的寫碼標準？
- **Spec** — 是否忠實實作 originating issue／PRD／spec？

兩軸用 **平行 Task subagent**（`subagent_type: generalPurpose`）執行，避免互相汙染，再由你彙總。

若缺 `docs/agents/issue-tracker.md`，spec 來源改問使用者或掃 `.scratch/`／`docs/`。

## 流程

### 1. 固定比較點

使用者給的 commit／branch／tag／`main`／`HEAD~n` 等；未給則詢問。

記錄：`git diff <fixed-point>...HEAD`（三點）與 `git log <fixed-point>..HEAD --oneline`。

先 `git rev-parse` 確認 ref，且 diff 非空；否則在此失敗，不要開 subagent。

### 2. Spec 來源（順序）

1. Commit message 的 issue 引用 → 依 `docs/agents/issue-tracker.md` 讀取
2. 使用者傳入路徑
3. `docs/`、`specs/`、`.scratch/` 下吻合分支／功能的 spec
4. 找不到就問；使用者說沒有 → Spec 軸略過並註明

### 3. Standards 來源

專案內寫碼規範，例如：

- `.cursor/rules/**`
- `AGENTS.md`／`CLAUDE.md`
- `CODING_STANDARDS.md`／`CONTRIBUTING.md`
- 專案既有 code-review 規則（若有，**優先於**下方 smell baseline）

另外一律帶 **Fowler smell baseline**（_Refactoring_ ch.3）。規則：

- **Repo 覆寫 baseline**：文件標準與 smell 衝突時以文件為準。
- Smell 皆為**判斷呼籲**，不是硬違規；工具已強制的略過。

Smell 清單（what → fix）：

- Mysterious Name → 改名；想不出誠實名字代表設計糊
- Duplicated Code → 抽出共用形狀
- Feature Envy → 方法移到資料所在
- Data Clumps → 收成一型別
- Primitive Obsession → 給領域概念專屬型別
- Repeated Switches → 多型或共用 map
- Shotgun Surgery → 把一起變的收進一模組
- Divergent Change → 拆成單一理由模組
- Speculative Generality → 刪到有真實需求
- Message Chains → 藏在第一個物件的一方法後
- Middle Man → 拿掉中間人
- Refused Bequest → 改組合

### 4. 平行開兩個 Task

同一則回覆裡兩個 `Task` 呼叫，皆 `generalPurpose`。

**Standards prompt** 含：diff 指令、commit 列表、standards 檔路徑清單、**完整 smell baseline**、brief：逐檔／hunk 報告 (a) 違反文件標準（引檔＋規則）(b) baseline smell（點名＋引用 hunk）。區分硬違反與判斷呼籲。略過工具已抓的。400 字內。用繁中或英文皆可，父 agent 會轉繁中。

**Spec prompt** 含：diff、commit 列表、spec 路徑或全文、brief：(a) 缺／半套需求 (b) 範圍外行為 (c) 看似做了但做錯。每點引 spec。400 字內。

無 spec 則跳過 Spec Task。

### 5. 彙總

用 `## Standards` 與 `## Spec` 分欄呈現，**不要**合併重排。

結尾一行：各軸發現數＋各軸最嚴重一項。

## 為何兩軸

符合標準但做錯需求 ≠ 做對需求但違規。分開報才不會互相掩蓋。

## 結束時

```
### 下一步建議
有必修缺口：回到 `/bl-implement` 或 `/bl-tdd`。
已通過：可結束；換 session 用 `/bl-handoff`。提交前請使用者確認（未明確要求勿擅自 commit）。
```
