# omni-skills

跨工具 skill 庫（Cursor／Codex／Claude／Antigravity）。Skill 正文只放這裡。本庫**不含**你家目錄路徑。

讓 Agent 先拿到地圖，需要時再讀細節。架構理念：[docs/agent-context-architecture.zh-TW.md](docs/agent-context-architecture.zh-TW.md)。

舊的 [Fallins/skills](https://github.com/Fallins/skills.git) 是同一段歷史的 kit 快照，請改用本庫。

新增或更新任何 skill／command **必須**改本 README（以及 [README.en.md](README.en.md)）：名稱、用途、怎麼用。啟發來源與範例選填。

## 安裝

人看下面；請 Agent 協助安裝時改讀 [INSTALL.md](INSTALL.md)。

### Codex／Claude Code 原生安裝（Node.js 24+）

已有 agent-work 時，優先在該庫執行 `node scripts/update-skills.ts --skills-source "<omni-skills clone 的絕對路徑>" --tools codex,claude`，同時套用版本釘選與全域規則。後續用 `node scripts/update-skills.ts`；加 `--check` 只檢查、不連網或寫入。

獨立安裝（在本庫執行，不安裝 agent-work 規則）：

```sh
node scripts/install-skills.ts --tools codex,claude --yes
node scripts/install-skills.ts --tools codex,claude --check
```

Windows 使用 directory junction，不需 Python、Bash 或更改 OS 設定；macOS／Linux 使用 symlink。安裝到 `~/.agents/skills`、`$CODEX_HOME/skills`（預設 `~/.codex/skills`）與 `$CLAUDE_CONFIG_DIR/skills`（預設 `~/.claude/skills`）。先檢查全部目標，遇到既有一般目錄、外來或損壞連結就停止；不刪除舊 skills。

設定預設為 `~/.config/omni-skills/config.json`，可用 `OMNI_CONFIG` 或 `--config` 指定；`--home` 用於隔離安裝，忽略環境中的家目錄覆寫。原生入口只支援 Codex／Claude Code；其他工具沿用下方 Bash 入口。新開對話或重新載入後使用新 skills。

### Bash 安裝（含 Cursor／Antigravity）

```bash
git clone https://github.com/Fallins/omni-skills.git
cd omni-skills
chmod +x scripts/install-skills.sh
./scripts/install-skills.sh
```

安裝會問：工具、Cursor slash 額外前綴（通常留空）、是否使用 agent-work 工作區（`workspaceRoot`）。設定寫入 `~/.config/omni-skills/config.json`。沒有 `workspaceRoot` 時，工作區落到當前 git 的 `.scratch/<repo>/`。

Bash 安裝器不為 `gs-grill-core` 產生 Cursor slash 檔；Codex／Claude Code 可能仍列出此 skill。它供 `gs-grill-me`／`gs-grill-with-docs` 讀取，不作一般使用入口。

## 推薦流程

```
/enroll                   # 把目前 git 納管進 agent-work（概念見 docs/agent-work.md）
/gs-setup                 # 若只要 tracker（enroll 已含）
  → /gs-grill-with-docs
  → /gs-to-spec
  → /gs-to-tickets
  → /gs-implement         # TDD 實作，收尾 code-review
  → （確認後再 commit）
```

對話用**繁體中文**。

---

## Skill 清單

### gs-*（grill-skill 族）

來自 [mattpocock/skills](https://github.com/mattpocock/skills) 的工程閉環：盤問 → spec → tickets → TDD／實作 → review／handoff。族前綴避免與以後引進的 `tdd`／`setup` 撞名。

| 名稱 | 用途 | 怎麼用 |
|------|------|--------|
| `gs-setup` | 為目前 repo 在 AW 建／補 `issue-tracker.md` | `/gs-setup` 或「幫我 setup」。只保證 tracker；完整納管用 `enroll`。 |
| `gs-grill-me` | 只訪談、不寫領域文件 | `/gs-grill-me`。會讀 `gs-grill-core`。 |
| `gs-grill-with-docs` | 訪談並維護 CONTEXT／ADR | `/gs-grill-with-docs`。需求對齊時用這個。 |
| `gs-grill-core` | 訪談迴圈本體 | **不要**當 slash。由上面兩個 Read。 |
| `gs-to-spec` | 把對話收成 spec，不再訪談 | `/gs-to-spec`。缺 tracker 會閘門。 |
| `gs-to-tickets` | spec 拆成 tracer-bullet tickets | `/gs-to-tickets`。核心票要 Behavior matrix。 |
| `gs-implement` | 依 spec／tickets 實作（內含 TDD + review） | `/gs-implement`。未要求勿擅自 commit。 |
| `gs-tdd` | 單獨跑 red→green | `/gs-tdd`；也給 `gs-implement` 讀。 |
| `gs-code-review` | 雙軸 Standards／Spec review | `/gs-code-review`。 |
| `gs-diagnosing-bugs` | 難除 bug／效能：先建回饋迴圈 | `/gs-diagnosing-bugs`。 |
| `gs-handoff` | 交接給下一個 session | `/gs-handoff`。寫到 OS 暫存，不預設進 workspace。 |
| `gs-domain-modeling` | 打磨詞彙與 ADR | 給 `gs-grill-with-docs` 讀；也可單獨用。 |

啟發來源：mattpocock/skills（MIT，見 `LICENSE.upstream`、`NOTICE`）。

### 其他

| 名稱 | 用途 | 怎麼用 |
|------|------|--------|
| `enroll` | 把目前 git 納管進 agent-work：建專案工作區與 tracker。公司不改業務 git。概念：[docs/agent-work.md](docs/agent-work.md) | 說「納管」「enroll」或 `/enroll`。可被模型叫。 |
| `eli5` | 用 HTML 視覺解釋現有程式怎麼跑（Confirmed／Inferred／Unknown） | 「ELI5 這個流程」；產出在**被解釋的專案** `.agent-artifacts/eli5/`。不要改 production code。 |
| `frontend-design` | 新 UI、大型視覺調整、設計 polish；強調 typography、composition、hierarchy 與 distinctive design | `/frontend-design` 或「用 frontend-design 設計這個頁面」 |
| `agent-browser` | 使用真實 browser 做操作、QA、repro、截圖與流程驗證 | `/agent-browser` 或「用 agent-browser 測這個登入流程」 |
| `systematic-debugging` | 對 concrete failure 做 root-cause-first 除錯，先證明根因再修 | `/systematic-debugging` 或「用 systematic-debugging 查這個 failure」 |
| `large-task-orchestrator` | 大型程式任務的證據查核、規格拆解、代理分工與整合驗收；保留 Luna MAX 子代理偏好，依環境確認實際模型 | 說「大型任務模式」或使用 `$large-task-orchestrator`（支援 slash 的工具可用 `/large-task-orchestrator`）；只要求規劃時不實作，要執行請明確要求「規劃並執行」。 |

除錯分工：

- `systematic-debugging`：已有穩定 failure，主要工作是追 root cause。
- `gs-diagnosing-bugs`：難重現 bug／performance regression，主要工作是先建立可靠 feedback loop。

#### eli5 範例

```text
Use eli5 to explain the login flow.
ELI5 這個地圖載入流程。
用 eli5 解釋玩家進入關卡後，資料到底經過哪些地方。
ELI5 why this page is slow.
ELI5 這個 bug。我要看到 expected flow、actual flow，以及兩者在哪裡分岔。
```

## Runtime dependencies

### agent-browser

`agent-browser` skill 會由 omni-skills 安裝，但 browser automation 本身需要額外的 `agent-browser` CLI。

```bash
npm install -g agent-browser
agent-browser install
```

Skill 在執行時會透過：

```bash
agent-browser skills get core
```

讀取與目前 CLI 版本一致的操作 workflow。

## 設定

見 `config.example.json`。實際檔在 `~/.config/omni-skills/config.json`，**不要**把絕對路徑 commit 進本庫。

| 欄位 | 意義 |
|------|------|
| `commandPrefix` | 可選。只加在 Cursor slash 檔名最前面。預設空 → `/gs-setup` |
| `workspaceRoot` | agent-work clone。空則 scratch |
| `layout` | `work-personal` 或 `scratch` |
| `tools` | `cursor`／`codex`／`claude`／`antigravity` |
| `personalPathSubstring` | 路徑含此字串 → personal lane（預設 `/Personal/`） |
| `skillsSource` | 本 clone 的絕對路徑（安裝時寫入） |

## 更新

skill 是 symlink／junction，改檔即生效（新對話較穩）。agent-work 使用者依其釘選更新，不直接對 detached clone 執行 pull。

2026-10-17 已審查所有既有 skills 的來源：gs-* 補強依賴順序、驗證證據、跨工具 review 與 tracker 關係；frontend-design 合併視覺設計與可及性指引；systematic-debugging 修正環境診斷洩漏變數值的範例。各 skill 的呼叫方式如上表；本地 AW／CONTEXT 規約保留。agent-browser 的 wrapper 未變，僅更新查核版本。詳見 [來源同步紀錄](docs/upstream-sync-2026-10-17.md)。

原生安裝器測試：`node --test scripts/tests/install-skills.test.ts`。

- **gs-***（mattpocock 改編）：

```bash
./scripts/sync-from-upstream.sh
```

- **有 `UPSTREAM.md` 的外部 skill**（`frontend-design`、`systematic-debugging` 為 adapted mirror；`agent-browser` 為薄 wrapper，真正 workflow 在 CLI）：

```bash
./scripts/update-external-skills.sh
./scripts/update-external-skills.sh frontend-design
```

腳本只抓上游、比對 recorded commit，**不會覆寫**本地改編過的 `SKILL.md`。LICENSE 可用 `--apply-license`；合併完成後 `--mark-synced` 寫回 `UPSTREAM.md` 的 commit。

三種來源不是同一種改寫程度：

| Skill | 策略 | 更新時 |
|------|------|--------|
| `frontend-design` | 上游正文 + 少量改編 | 看 diff，把上游新段 merge 進本地 guardrails／description |
| `systematic-debugging` | 同上 | 保留與 `gs-diagnosing-bugs`／`gs-tdd` 的邊界 |
| `agent-browser` | 幾乎不改寫 | 日常靠升級 CLI；本庫多半只跟 LICENSE |

## 授權

- `gs-*` 上游 MIT：`LICENSE.upstream`。
- 其他第三方 skill 授權見 `NOTICE` 與各 skill 的 `LICENSE.txt`。
- 本庫改編見 `LICENSE`。
