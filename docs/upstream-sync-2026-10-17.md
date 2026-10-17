# 2026-10-17 來源同步紀錄

本次審查所有 17 個既有 skills，並加入 `large-task-orchestrator`。來源 commit 記錄的是已審查的對應 skills，不代表把上游整庫照抄進來。

| 來源 | 本次審查到 | 結果 |
|---|---|---|
| mattpocock/skills | `49dd158d1076134a641b33efb035946536778336` | 12 個既有 gs-* 對應逐一比對，9 個 skill 有更新 |
| anthropics/skills | `dbd4588f9e1033efb41dad4bef2f7947c8993d44` | frontend-design 合併設計正文，保留本地 guardrails |
| obra/superpowers | `bb92a77741419a4ab5f06e711a283343f1ada0c3` | systematic-debugging 修正環境診斷範例 |
| vercel-labs/agent-browser | `dac13bb87468fe9d74a040d862720f6cc17a9565` | wrapper 與 license 無差異，只推進查核標記 |

## gs-* 的合併邊界

- `gs-code-review`：使用目前環境的子代理 API；不可分工時依雙軸循序 review，讀取適用的 coding standards。
- `gs-diagnosing-bugs`：診斷輸出去除秘密；以實際 diff 證明 mutation，再判讀 forced-red；假說是資訊，不自動新增批准關卡。
- `gs-domain-modeling`：明確使用 AW 相對路徑與 contexts 位置；保留本地 CONTEXT，不改成上游 GLOSSARY。
- `gs-grill-core`：依決策相依性安排提問；接受已確認的建議答案與授權，不反覆確認。
- `gs-handoff`：使用 OS 暫存位置，涵蓋 Windows／Unix。
- `gs-implement`：執行前取得 ticket 標題，重用已確認的 seams。
- `gs-setup`：補 remote tracker 條件式說明，保留既有 labels；不把讀取授權擴成寫入授權。
- `gs-tdd`：說明測試 seams 能抓到與漏掉的情況，沿用已確認的決策。
- `gs-to-tickets`：先建立 blocker；區分 parent/subissue 與 blocking 關係；提供文字 fallback，不越權修改 parent。
- `gs-grill-me`、`gs-grill-with-docs`、`gs-to-spec`：現有改編已涵蓋適用改進，本次不改。

沒有新增未選用的上游 skills，也沒有把 Cursor 專用 API、強制額外確認或上游工作區結構覆蓋到本地規範。`enroll`、`eli5` 是本庫維護，沒有獨立外部更新來源，本次未改。

## 外部 skills

`frontend-design` 合併 typography roles、行寬、motion、可及性與設計校準；只在必要上下文缺失時提問。`systematic-debugging` 的環境檢查只印出 SET／UNSET 或是否存在，不印變數值。上游新增的 find-polluter 指令未直接加入，因為本庫沒有收錄該執行檔，既有文件仍連回上游。各來源 license 均無差異。

## 驗證範圍

新增 skill 已檢查 frontmatter、引用檔案與七種協調情境；保留 Luna MAX 偏好，依環境確認具體模型映射。這是文件情境檢查，沒有假稱執行完整大型模型任務。

原生 Node 安裝器測試使用隔離家目錄與實際 Windows junction；updater 測試使用暫存 Git repo，網路及 child installer 呼叫以 mock 隔離。macOS／Linux 未實機驗證。實際工具的 skill discovery 應在安裝後另外確認；檔案檢查不等於模型流程驗證。
