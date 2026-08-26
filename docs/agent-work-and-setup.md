# agent-work 布局 + 缺 setup 閘門

概念（五層、做法 B、為什麼拆庫）見 [agent-work.md](agent-work.md)。本檔只寫查找路徑與缺 setup 閘門。

`gs-*` 與 `enroll` 共用。Agent 請 Read 本檔（位於本套件 `docs/agent-work-and-setup.md`，從 skill 目錄往上兩層）。

路徑**不要寫死家目錄**。一律讀 `~/.config/omni-skills/config.json`（可用環境變數 `OMNI_CONFIG` 覆寫）。腳本：`scripts/resolve-aw.sh`、`scripts/enroll-project.sh`。

## 兩種 layout

### `work-personal`（有 `workspaceRoot`）

`AW_ROOT` = config 的 `workspaceRoot`。

- 寫入 `AW_ROOT/work/<repo>/` 或 `AW_ROOT/personal/<repo>/`
- **禁止**在業務 git 寫 `.scratch/`、`docs/agents/`、根 `CONTEXT.md`／`docs/adr/`（除非使用者在 setup 明確選 Other）
- **禁止**在業務 repo 留指標檔指向工作區
- 公司補充地圖（做法 B）：`AW_ROOT/work/<repo>/README.md`
- 個人：可補薄 `AGENTS.md` + `CLAUDE.md`（只 `@AGENTS.md`）

### `scratch`（沒有設定，或 `workspaceRoot` 為空）

不要假裝有 agent-work。`AW` = 當前 git 根的 `.scratch/<repo>/`。把 `.scratch/` 加進該 git 的 `.gitignore`。

## 解析 AW

`repo` = `git rev-parse --show-toplevel` 的目錄名。

`work-personal`：

1. 若存在 `AW_ROOT/work/<repo>/issue-tracker.md` → `AW` 為該目錄
2. 否則若存在 `AW_ROOT/personal/<repo>/issue-tracker.md` → `AW` 為該目錄
3. 否則新建：toplevel 路徑含 config 的 `personalPathSubstring`（預設 `/Personal/`）→ `personal/<repo>`，否則 `work/<repo>`

`scratch`：`AW` 永遠是 `<git-root>/.scratch/<repo>`。

| 用途 | 路徑 |
|---|---|
| 專案工作區 | `AW/` |
| Tracker | `AW/issue-tracker.md` |
| 公司補充地圖（做法 B） | `AW_ROOT/work/<repo>/README.md` |
| Domain 設定 | `AW/domain.md` |
| 領域詞彙 | `AW/CONTEXT.md` |
| ADR | `AW/docs/adr/` |
| Spec | `AW/<feature-slug>/spec.md` |
| Tickets | `AW/<feature-slug>/issues/<NN>-<slug>.md` |

## Setup 是否完成

**完成條件**：存在 `AW/issue-tracker.md`（已解析後的路徑）。

不要用業務 repo 的 `docs/agents/issue-tracker.md`。

## 缺 setup 閘門（gs-to-spec／gs-to-tickets／gs-implement／gs-code-review 必做）

1. 解析 toplevel → `repo` → `AW`（上節）。
2. **若無** `AW/issue-tracker.md`：
   - 停止寫入 spec／tickets。
   - 提示執行 **`gs-setup`** 或 **`enroll`**（納管含 setup）。Cursor slash 無安裝前綴時為 `/gs-setup`、`/enroll`。
   - 同意後只寫入 `AW/`。
3. **若有**：依 `AW/issue-tracker.md` 讀寫。

查找 CONTEXT／ADR／spec 只在 `AW/`，不要預設去業務 repo 根目錄。
