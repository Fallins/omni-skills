# agent-work

本機工程工作區與私人 context。**不進各業務 git**，也不在業務 repo 留指標檔。

## 查找路徑

`repo` = `git rev-parse --show-toplevel` 的目錄名。

1. `work/<repo>/` — 公司專案（做法 B 讀這裡的 `README.md`）
2. `personal/<repo>/` — 個人專案的任務／spec（專案地圖在該 git 的 `AGENTS.md`）
3. 完成條件（gs-*）：該目錄有 `issue-tracker.md`

新建時：git 路徑含個人片段（預設 `/Personal/`）→ `personal/`，否則 → `work/`。

## 樹

```text
workspaceRoot/
├── _global/           # 第 1 層習慣
├── work/
│   ├── _addon/        # 蓋在團隊／Pantheon 上的個人附加（衝突時團隊贏）
│   └── <repo>/
└── personal/
    ├── _playbook/     # 個人專案之間的工程手冊
    ├── _stacks/
    └── <repo>/
```
