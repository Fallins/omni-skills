# agent-work 布局 + 缺 setup 閘門

bl-* skill 共用約定。Agent 請 Read：

`/Users/user/Documents/Git/Personal/cursor-agent-kit/docs/agent-work-and-setup.md`

（或 kit repo 內相對路徑 `docs/agent-work-and-setup.md`。）

## 原則

- **一律**寫入 `~/Documents/Git/agent-work/<git-repo-目錄名>/`
- **禁止**在業務 git repo 寫入：`.scratch/`、`docs/agents/`、根目錄 `CONTEXT.md`／`docs/adr/`（除非使用者在 setup 明確選 Other）
- **禁止**在業務 repo 留「指標檔」指向 agent-work

對齊 `~/Documents/Git/agent-work/README.md`。

## 路徑

令 `AW = ~/Documents/Git/agent-work/<repo名>`（repo 名 = `git rev-parse --show-toplevel` 的目錄名）。

| 用途 | 路徑 |
|------|------|
| 專案工作區 | `AW/` |
| Tracker 設定 | `AW/issue-tracker.md` |
| Domain 設定 | `AW/domain.md` |
| 領域詞彙 | `AW/CONTEXT.md`（可選 `AW/CONTEXT-MAP.md`） |
| ADR | `AW/docs/adr/` |
| Spec | `AW/<feature-slug>/spec.md` |
| Tickets | `AW/<feature-slug>/issues/<NN>-<slug>.md` |

## Setup 是否完成

**完成條件**：存在 `AW/issue-tracker.md`。

不要用業務 repo 的 `docs/agents/issue-tracker.md` 判斷（不應存在）。

## 缺 setup 閘門（to-spec／to-tickets／implement／code-review 必做）

在讀寫 spec／tickets／domain 文件 **之前**：

1. 解析當前 git toplevel → `repo名` → `AW`。
2. **若無** `AW/issue-tracker.md`：
   - **停止**本流程的發布／寫入。
   - 提示（繁中），必須含命令：
     > 此專案尚未在 agent-work 完成 bl-* 設定。請執行 **`/bl-setup`**，或回覆「幫我 setup」由我依預設建立 `~/Documents/Git/agent-work/<repo>/`。
   - 使用者同意 → Read 並遵循 `bl-setup/SKILL.md` → 確認後只寫入 `AW/` → 再繼續原命令。
   - 拒絕 → 結束。
3. **若有**：依 `AW/issue-tracker.md` 與本檔約定讀寫。

## 查找順序（讀 CONTEXT／ADR／spec）

1. `AW/issue-tracker.md`／`AW/domain.md`（若存在）
2. `AW/CONTEXT.md`、`AW/CONTEXT-MAP.md`、`AW/docs/adr/`
3. `AW/<feature>/spec.md`、`AW/<feature>/issues/`
4. **不要**預設去業務 repo 根目錄找 CONTEXT／ADR／`.scratch`
