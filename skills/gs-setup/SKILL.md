---
name: gs-setup
description: >-
  One-time per-repo setup for gs-* engineering skills (issue tracker, domain
  docs layout). Manual invoke only (/gs-setup).
disable-model-invocation: true
---

# gs-setup

## 語言

與使用者對話一律使用**繁體中文**。寫入的設定檔可用繁中或英文。

為**當前業務 repo** 在設定的工作區建立 AW（規格／tickets／CONTEXT／ADR）。  
`work-personal`：**不在業務 git repo 內寫任何檔**（含 `docs/agents/` 指標、`.scratch/`、根 `CONTEXT.md`）。  
`scratch`：寫入 git 根 `.scratch/<repo>/`，並 gitignore `.scratch/`。

先 Read 套件 `docs/agent-work-and-setup.md`（從本 SKILL.md 往上兩層）。用 `scripts/resolve-aw.sh` 解析 `AW`。

完整納管（五層骨架 + 做法 B + 個人 AGENTS.md）請用 **`enroll`**。本 skill 只保證 `issue-tracker.md`。

## 流程

### 1. 探索

- `git rev-parse --show-toplevel` → `repo名`
- `AW=$(scripts/resolve-aw.sh)`
- 是否已有 `AW/issue-tracker.md`（若有，告知已 setup，詢問是否覆寫／更新）

### 2. 詢問（一次一題，附推薦答案）

**A — Issue tracker**（推薦：**Local → AW**）

- **Local markdown（AW）**（預設）
- GitHub／GitLab／Other（自訂；若選 Local 以外，仍避免污染業務 repo，除非使用者堅持）

**B — Domain docs**

- 無 monorepo 訊號 → 直接 **single-context**：`AW/CONTEXT.md` + `AW/docs/adr/`
- 有 monorepo → 問 single vs multi（文件仍只在 `AW/`）

### 3. 確認草稿

展示即將建立／覆寫的路徑（僅 `AW/` 下），例如：

- `AW/README.md`
- `AW/issue-tracker.md`（自 `templates/issue-tracker-local.md` 填入 repo 名與 lane）
- `AW/domain.md`（自 `templates/domain.md`）

**明確說明：** `work-personal` 不會修改業務 repo 內任何檔案。

### 4. 寫入（只寫 AW）

1. `mkdir -p AW/docs/adr`
2. 寫入／更新上述 markdown
3. `CONTEXT.md`／ADR **懶建立**（有內容再寫）；setup 不強制建空 CONTEXT

`work-personal` 路徑為 `workspaceRoot/work|<personal>/<repo>/`，不要用扁平的 `<workspaceRoot>/<repo>/`。

### 5. 完成

告知 `AW` 絕對路徑；之後 gs-* 以 `AW/issue-tracker.md` 是否存在判斷 setup，並**一律到 AW 查找** CONTEXT／ADR／spec。

## 結束時

```
### 下一步建議
若尚未納管：建議 `/enroll`。
建議執行 `/gs-grill-with-docs`：對齊需求並維護 CONTEXT／ADR（寫入 AW）。
若題目已清楚：可直接 `/gs-to-spec`。
```
