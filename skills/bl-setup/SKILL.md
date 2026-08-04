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

為**當前業務 repo** 在 **agent-work** 建立工作區（規格／tickets／CONTEXT／ADR）。  
**不在業務 git repo 內寫任何檔**（含 `docs/agents/` 指標、`.scratch/`、根 `CONTEXT.md`）。

先 Read：`/Users/user/Documents/Git/Personal/cursor-agent-kit/docs/agent-work-and-setup.md`

## 流程

### 1. 探索

- `git rev-parse --show-toplevel` → `repo名`
- `AW=~/Documents/Git/agent-work/<repo名>`
- 是否已有 `AW/issue-tracker.md`（若有，告知已 setup，詢問是否覆寫／更新）

### 2. 詢問（一次一題，附推薦答案）

**A — Issue tracker**（推薦：**Local → agent-work**）

- **Local markdown（agent-work）**（預設）
- GitHub／GitLab／Other（自訂；若選 Local 以外，仍避免污染業務 repo，除非使用者堅持）

**B — Domain docs**

- 無 monorepo 訊號 → 直接 **single-context**：`AW/CONTEXT.md` + `AW/docs/adr/`
- 有 monorepo → 問 single vs multi（文件仍只在 `AW/`）

### 3. 確認草稿

展示即將建立／覆寫的路徑（僅 `AW/` 下），例如：

- `AW/README.md`
- `AW/issue-tracker.md`（自 `templates/issue-tracker-local.md` 填入 repo 名）
- `AW/domain.md`（自 `templates/domain.md`）

**明確說明：不會修改業務 repo 內任何檔案。**

### 4. 寫入（只寫 AW）

1. `mkdir -p AW/docs/adr`
2. 寫入／更新上述 markdown
3. `CONTEXT.md`／ADR **懶建立**（有內容再寫）；setup 不強制建空 CONTEXT

### Local issue-tracker 範例

```markdown
# Issue tracker: Local Markdown（agent-work only）

Project folder: `~/Documents/Git/agent-work/<repo名>/`

- Spec: `…/<feature-slug>/spec.md`
- Tickets: `…/<feature-slug>/issues/<NN>-<slug>.md`
```

### 5. 完成

告知 `AW` 絕對路徑；之後 bl-* 以 `AW/issue-tracker.md` 是否存在判斷 setup，並**一律到 agent-work 查找** CONTEXT／ADR／spec。

## 結束時

```
### 下一步建議
建議執行 `/bl-grill-with-docs`：對齊需求並維護 CONTEXT／ADR（寫入 agent-work）。
若題目已清楚：可直接 `/bl-to-spec`。
```
