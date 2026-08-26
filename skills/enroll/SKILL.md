---
name: enroll
description: >-
  把目前 git repo 納管進 agent-work（work 或 personal）：建工作區骨架、索引、tracker。
  公司不改業務 git。在使用者說「納管」「enroll」「加入 agent-work」「初始化工作區」時使用。
disable-model-invocation: false
---

# enroll

與使用者對話用**繁體中文**。

本 skill 是整套 **agent-work 納管**（不只建 tracker）。tracker 可另用 `gs-setup`；完整納管走這裡。

套件路徑：從本 `SKILL.md` 往上兩層（symlink 解析後），或讀 `~/.config/omni-skills/config.json` 的 `skillsSource`。先 Read 同套件 `docs/agent-work.md`（概念）與 `docs/agent-work-and-setup.md`（路徑與閘門）。路徑全部來自該 config，**不要寫死家目錄**。

五層、做法 B、公司／個人分工見 `docs/agent-work.md`。衝突：團隊 `AGENTS.md`／Pantheon 贏。不要複製 Pantheon。不要把本機工作區路徑寫進**公司** git。

## 做什麼

1. **若 workspace 骨架不存在**（config `layout=work-personal` 且 `workspaceRoot` 有值）：跑 `scripts/init-workspace.sh`。
2. **納管當前 git**：`work|personal/<basename>/` + `issue-tracker.md`。
3. 公司（work）：**不修改業務 git**。
4. 個人（personal）：可補薄 `AGENTS.md`、`CLAUDE.md`、`docs/` 骨架；已有則不要覆寫。

若沒有 config／`workspaceRoot`：走 `scratch`——在當前 git 根建 `.scratch/<repo>/`，並 gitignore `.scratch/`。不要假裝有 agent-work。

## 流程

1. `git rev-parse --show-toplevel` → repo 名。路徑含 config `personalPathSubstring`（預設 `/Personal/`）則 lane=personal，否則 work。使用者指定 lane 時聽使用者。
2. 說明即將建立的路徑，等確認（使用者已說「直接納管」則可直接跑）。
3. 執行（`KIT` = 套件根目錄）：

```bash
"$KIT/scripts/enroll-project.sh" --lane <work|personal> "$(git rev-parse --show-toplevel)"
```

4. 回報 `AW` 路徑。不要一次掃完 repo 寫百科。缺文件的 audit 留到使用者要求。

## 不要做

- 不要把本機工作區路徑寫進**公司** git 的 `AGENTS.md`。
- 不要複製 Pantheon。
- 不要覆寫已存在且非空的 `AGENTS.md`。
