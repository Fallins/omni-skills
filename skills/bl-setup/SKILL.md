---
name: bl-setup
description: >-
  One-time per-repo setup for bl-* engineering skills (issue tracker, domain
  docs layout). Manual invoke only (/bl-setup).
disable-model-invocation: true
---

# bl-setup

## 語言

與使用者對話一律使用**繁體中文**。寫入的設定檔可用繁中或英文。

為本 repo 建立工程 skills 需要的設定：

- **Issue tracker** — issues／specs 放哪裡（預設推薦：**本機 markdown**）
- **Domain docs** — `CONTEXT.md` 與 ADR 的 layout

這是提示驅動流程：探索 → 呈現 → 確認 → 寫入。本套件**未**附 `triage` skill，略過 triage 標籤區塊。

## 流程

### 1. 探索

- `git remote -v`
- 根目錄 `AGENTS.md`／`CLAUDE.md`
- `CONTEXT.md`／`CONTEXT-MAP.md`、`docs/adr/`、`docs/agents/`、`.scratch/`
- monorepo 訊號（workspaces 等）

### 2. 詢問（一次一題，附推薦答案）

**A — Issue tracker**（推薦：**Local markdown**，適合個人與多數 side project）

- Local markdown → `.scratch/<feature>/`
- GitHub（`gh`）
- GitLab（`glab`）
- Other（請使用者用一段話描述；原樣寫入）

寫入 `docs/agents/issue-tracker.md`。Local 範本可參考 kit 的 `templates/issue-tracker-local.md`（若已安裝，路徑也可能在 `~/.cursor/skills/../` 的 kit repo；或依下方「Local 精簡範本」撰寫）。

**B — Domain docs**：無 monorepo 訊號則直接採用 **single-context**（根 `CONTEXT.md` + `docs/adr/`），不必多問。有 monorepo 才問是否 multi-context。

寫入 `docs/agents/domain.md`（可從 kit `templates/domain.md` 改編）。

### 3. 確認草稿

展示即將寫入的 `docs/agents/*.md` 與（若會改）`AGENTS.md`／`CLAUDE.md` 的 `## Agent skills` 區塊，讓使用者改完再寫。

### 4. 寫入

- 已有 `CLAUDE.md` → 編它；否則已有 `AGENTS.md` → 編它；都沒有 → 問要建哪一個。
- 已有 `## Agent skills` 則就地更新，勿重複附加。

區塊範例：

```markdown
## Agent skills

### Issue tracker

[一句話]. See `docs/agents/issue-tracker.md`.

### Domain docs

[single-context 或 multi-context]. See `docs/agents/domain.md`.
```

### Local 精簡範本（issue-tracker.md）

```markdown
# Issue tracker: Local Markdown

Issues and specs live under `.scratch/`.

- Spec: `.scratch/<feature-slug>/spec.md`
- Tickets: `.scratch/<feature-slug>/issues/<NN>-<slug>.md` (from `01`)
- Status line near top; comments under `## Comments`
```

### 5. 完成

告知設定完成；之後 `/bl-to-spec`、`/bl-to-tickets`、`/bl-implement`、`/bl-code-review` 會讀這些檔。可直接改 `docs/agents/*.md`；換 tracker 再跑本 skill。

## 結束時

```
### 下一步建議
建議執行 `/bl-grill-with-docs`：對齊需求並維護 CONTEXT／ADR。
若題目已清楚：可直接 `/bl-to-spec`。
```
