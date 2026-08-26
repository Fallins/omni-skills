# INSTALL.md（給 Agent）

協助使用者安裝 omni-skills。對話用繁體中文。**不要**把使用者的家目錄路徑寫進本 git。

## 1. 問參數（一次一題，附建議）

1. **工具**（建議全選）：`cursor`、`codex`、`claude`、`antigravity`
2. **Cursor slash 額外前綴** `commandPrefix`（建議空。skill 已叫 `gs-setup`，空前綴的 slash 即 `/gs-setup`）
3. **是否使用 agent-work 工作區？**
   - 是：`layout=work-personal`，問 `workspaceRoot` 絕對路徑（私人 clone，常見為使用者放工作區的目錄）
   - 否：`layout=scratch`，不設 `workspaceRoot`
4. **個人 lane 路徑片段**（建議 `/Personal/`；git 根路徑含此字串 → `personal/`）

## 2. 執行

在**本套件 clone** 根目錄：

```bash
chmod +x scripts/*.sh scripts/omni_config.py
./scripts/install-skills.sh --yes \
  --tools cursor,codex,claude,antigravity \
  --command-prefix "<使用者填的，可空>" \
  --layout work-personal \
  --workspace-root "<絕對路徑，scratch 則省略此旗標>" \
  --personal-substring "/Personal/"
```

`scratch` 時不要傳 `--workspace-root`，改 `--layout scratch`。

腳本會：

- 寫 `~/.config/omni-skills/config.json`（含 `skillsSource` = 本 clone）
- 把 `skills/<name>/` symlink 到各工具使用者目錄
- 產生 Cursor commands：`{commandPrefix}{skillFolder}.md`（**不**為 `gs-grill-core` 產生）
- 清掉舊的 `bl-*`／`ctx-enroll` 連結與 command
- `work-personal` 時寫入家目錄做法 B 片段（Cursor rule／Codex／Claude／Gemini），內容用 `workspaceRoot` 填模板，不寫死套件作者的路徑

官方 skill 發現路徑（安裝目標）：

- Codex：`$HOME/.agents/skills`（另相容 `$HOME/.codex/skills`）
- Claude：`~/.claude/skills/<name>/SKILL.md`
- Antigravity：`~/.gemini/config/skills/` 與 `~/.gemini/antigravity-cli/skills/`
- Cursor：`~/.cursor/skills/`；slash 在 `~/.cursor/commands/`

## 3. 回報

列出寫入的 config 路徑、symlink 目標、產生的 command 檔名。請使用者新開 Agent 對話後試 `/enroll` 或 `/gs-setup`。
