# 遠端 tracker 操作補充

僅在使用者已選 GitHub／GitLab 時讀取，擷取需要的操作寫到 `AW/issue-tracker.md`。沿用該專案既有 connector／CLI 與授權；先確認工具支援的參數，不為套用範例升級 CLI、改 tracker 或建立標籤。本文是操作參考，不代表已獲准發送留言、建立 issue 或修改遠端關係。

## GitHub

- 完整讀取 issue：`gh issue view <number> --json number,title,body,labels,comments`，避免只取得留言而漏掉本文或標籤。
- 子票關係與 blocking 關係分開記錄。CLI 支援時可用 `gh issue create --parent <parent>` 或 `gh issue edit <parent> --add-sub-issue <child>`；否則使用既有 connector／GitHub API。REST `sub_issues` 的 `sub_issue_id` 要用子票 database ID，不是 issue 編號或 node ID。
- 原生 blocking API 的 `issue_id` 同樣使用 blocker 的 database ID。無原生關係能力時，在子票保留 `Part of #<parent>` 與 `Blocked by: #<n>`；不為補文字 fallback 改寫父票。
- 多行本文優先用 connector 的結構化參數；CLI 用檔案搭配 `--body-file`，保留實際換行。
- 只有專案已啟用 PR triage 才需外部 PR 清單。不要向 `gh pr list --json` 索取未支援的 `authorAssociation`；可用 REST 的 `author_association` 並分頁：

```sh
gh api --paginate 'repos/{owner}/{repo}/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'
```

## GitLab

- Issue 清單的 JSON 選項是 `glab issue list -O json`；讀取單票則是 `glab issue view <number> --comments -F json`。不要混用 list 與 view 的參數。
- 查子票的原生相依關係時，links endpoint 使用明確的 child IID：`projects/:id/issues/<child-iid>/links`。
- 沿用 tracker 已有的 blocking／父子關係操作；能力或權限不支援時，在子票寫文字引用，並回報未建立原生關係。

遠端呼叫失敗或結果不明時，先查是否已建立，避免重複票或重複關係。讀取既有標籤與命名；只有使用者已授權相關遠端設定變更時才補缺漏標籤，不啟用本套件未提供的 triage／wayfinder 流程。
