# Agent-work 公司補充（做法 B）

當目前 git 根目錄**不是** `{{WORKSPACE_ROOT}}` 本身，且路徑**不含** `{{PERSONAL_SUBSTRING}}`：

若下列檔案存在，請讀它當**補充地圖**（不要一次讀完整棵工作區）：

`{{WORKSPACE_ROOT}}/work/<目前資料夾名>/README.md`

- `<目前資料夾名>` = git 根目錄的資料夾名（與 `basename $(git rev-parse --show-toplevel)` 相同）。
- 檔案不存在就忽略，不要報錯、不要掃其他專案。
- 與該 repo 已 commit 的 `AGENTS.md`／`CLAUDE.md`／Pantheon 衝突時，**團隊與 Pantheon 優先**。

全域習慣見 `{{WORKSPACE_ROOT}}/_global/habits.md`。
