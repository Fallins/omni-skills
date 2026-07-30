# Cursor Agent Kit（bl-*）

私人工程流程技能組，改編自 [mattpocock/skills](https://github.com/mattpocock/skills)，給 Cursor 使用。

## 安裝

```bash
cd ~/Documents/Git/Personal/cursor-agent-kit   # 或本 repo 路徑
chmod +x scripts/install-to-cursor.sh
./scripts/install-to-cursor.sh
```

會把 `skills/bl-*` **symlink** 到 `~/.cursor/skills/`，並把 `commands/bl-*.md` 複製到 `~/.cursor/commands/`。

全部 skill 皆為 `disable-model-invocation: true`——**只在你手動呼叫 Command（或明確點名）時執行**。

重新開一個 Agent 對話後即可使用 `/bl-setup` 等命令。

## 推薦流程

```
/bl-setup                 # 每個專案一次：tracker + domain docs 設定
  → /bl-grill-with-docs   # 對齊需求，維護 CONTEXT／ADR
  → /bl-to-spec           # 收成 spec
  → /bl-to-tickets        # 拆 tracer-bullet tickets
  → /bl-implement         # TDD 實作，收尾 code-review
  → （確認後再 commit）
```

其他：

| 命令 | 用途 |
|------|------|
| `/bl-grill-me` | 純 grilling（不寫領域文件） |
| `/bl-tdd` | 單獨跑 TDD 迴圈 |
| `/bl-code-review` | 雙軸 Standards／Spec review |
| `/bl-diagnosing-bugs` | 難除的 bug／效能診斷 |
| `/bl-handoff` | 交接給下一個 session |

每個 skill 結束會提示建議的下一步命令。

## 語言

與使用者對話使用**繁體中文**。

## 更新

改 skill 內容後，因是 symlink，存檔即生效（新對話較穩）。

跟上游：

```bash
./scripts/sync-from-upstream.sh
# 依提示手動比對 merge，再更新 .upstream-commit
```

## 授權

上游 MIT：見 `LICENSE.upstream` 與 `NOTICE`。
