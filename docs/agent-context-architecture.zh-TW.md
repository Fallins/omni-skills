# Agent Context & Skills Architecture

讓 Agent 先拿到「地圖」，需要時再讀「細節」；
讓 Context 告訴 Agent 這個專案是什麼，讓 Skills 告訴 Agent 這類工作應該怎麼做。

這份文件說明 omni-skills 背後採用的 Agent 工作架構，以及 Skills 在整體 Context Engineering 中扮演的位置。

目標不是建立更多 Markdown，而是讓不同 Coding Agent 在不同專案中，都能用較少、較準確的 context，取得一致的工作方法。

```text
Context = WHAT / WHY
Skills  = HOW
Task    = NOW
```

```text
AGENTS.md 是地圖。
docs/ 是知識。
Skills 是能力。
Task 是目標。
Tests / CI 是證據。
```

## 1. Context Engineering，不是 Prompt Collection

Coding Agent 的品質不只取決於模型，也取決於：

- 它一開始看到了哪些資訊
- 哪些資訊會常駐 context
- 哪些資訊只在需要時才載入
- 哪些知識是專案事實
- 哪些內容是可重用的工作方法
- 哪些規則應交給 lint、test、CI 等機械式驗證

因此我們把 Agent 工作環境視為一個有分層、有路由的 context system，而不是一堆 prompt 與 instruction file 的集合。

## 2. 整體模型

```text
                    ┌─────────────────────────┐
                    │       Task Intent       │
                    │  這次到底要完成什麼？    │
                    └────────────┬────────────┘
                                 │
                                 v
┌─────────────────────┐   ┌─────────────────────┐
│  Project Entry Map  │   │   Relevant Skills   │
│     AGENTS.md       │   │   reusable HOW      │
└──────────┬──────────┘   └──────────┬──────────┘
           │                         │
           v                         │
┌─────────────────────┐             │
│   Durable Context   │             │
│ docs / ADR / domain │             │
└──────────┬──────────┘             │
           └────────────┬────────────┘
                        v
              ┌──────────────────┐
              │   Agent Working  │
              │      Context     │
              └────────┬─────────┘
                       v
        investigate → plan → implement → verify
```

這裡最重要的分工是：

```text
Context = WHAT / WHY
Skills  = HOW
Task    = NOW
```

### Context

描述目前這個 codebase 的事實、限制、domain 與決策。

例如：

- 系統邊界
- authentication flow
- domain rules
- architecture decisions
- build / test / deploy conventions
- project-specific constraints

### Skills

描述一種可跨專案重複使用的工作方法。

例如：

- 如何做 root-cause debugging
- 如何建立高品質 frontend design
- 如何以真實 browser 驗證流程
- 如何進行 TDD
- 如何把複雜 code flow 做成視覺解說

### Task

只描述這一次工作的目標、scope 與 acceptance criteria。

任務完成後，只有真正變成 durable knowledge 的內容才應升級進正式文件。

## 3. Context 的五層

Context 可以依作用範圍由外到內分成五層：

| Layer | Purpose | Examples |
|------|---------|----------|
| Personal / Tool | 使用者與工具層級的工作習慣 | 回覆語言、是否自動 commit、完成前驗證 |
| Organization / Shared | 多專案共同成立的工程原則 | review philosophy、testing policy |
| Stack / Reference | 某類技術棧的預設做法 | Next.js、Solid/Vite、Python service conventions |
| Project | 只有目前 repository 成立的事實 | architecture、domain、legacy boundary、ADR |
| Task | 只對當次工作成立 | issue、spec、migration plan、acceptance criteria |

判斷資訊該放哪裡時，可以問：

- 任何專案都成立？ → Shared
- 只有某類 stack 成立？ → Stack / Reference
- 只有這個 repo 成立？ → Project
- 只有這次需求成立？ → Task

越靠近目前正在修改的 code，優先級越高。

## 4. Skills 是一個獨立的 Capability Layer

Skills 不應被塞進上面的 Project Context。

它們是橫跨多個 context layer 的「能力層」。

```text
               Project A
                  │
               Project B
                  │
               Project C
                  │
                  v
        ┌─────────────────────┐
        │   Reusable Skills   │
        │                     │
        │ debugging           │
        │ testing             │
        │ design              │
        │ browser automation  │
        │ explanation         │
        └─────────────────────┘
```

這個分離很重要。

如果把「如何 debugging」寫進每個專案的 `AGENTS.md`：

- 同一套流程會被複製很多次
- 更新容易不同步
- 每次啟動 Agent 都可能浪費 context
- Project instructions 會越來越肥

改成 Skill 後：

- Project Context → 告訴 Agent 這個系統怎麼運作
- `systematic-debugging` → 告訴 Agent 遇到可重現 bug 時怎麼查
- `gs-diagnosing-bugs` → 告訴 Agent 遇到難重現或難量測問題時怎麼建立 feedback loop

專案知識與工作方法各自維護一份。

## 5. Progressive Disclosure

整套架構的核心不是「讓 Agent 看更多」，而是「讓 Agent 在正確時間看到正確資訊」。

### 第一階段：只給入口

`AGENTS.md` 應該像地圖，而不是百科全書。

它負責：

- 指出 source of truth 在哪裡
- 告訴 Agent 不同任務應讀哪些文件
- 列出真正重要的 project constraints
- 列出完成前必要 validation

### 第二階段：依任務讀 deeper context

- UI task → relevant frontend docs
- Auth task → architecture/auth + domain docs
- E2E task → testing docs
- Architecture question → ADR / decisions

### 第三階段：只載入相關 Skill

- visual design task → `frontend-design`
- concrete reproducible bug → `systematic-debugging`
- hard-to-reproduce / performance investigation → `gs-diagnosing-bugs`
- real browser verification → `agent-browser`
- complex flow explanation → `eli5`

Agent 不需要在每一個任務中預載所有 Skill 的完整內容。

這也是 Skill description 很重要的原因：它同時是 capability description 與 context router。

## 6. Source of Truth

每一種知識最好只有一份 canonical source。

| 知識 | Canonical source |
|------|------------------|
| Project architecture | project docs |
| Project routing | `AGENTS.md` |
| Reusable workflow | `SKILL.md` |
| Task requirement | current spec / prompt |
| Mechanically enforceable rule | lint / typecheck / test / CI |

避免：

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- tool-specific rules
- README

各自保存一份內容近似、但最後逐漸不同步的長篇規範。

Tool-specific entry files 如果存在，應盡量保持為 adapter 或 routing layer，而不是第二份百科。

## 7. omni-skills 的角色

omni-skills 專注處理上面架構中的 Reusable Capability Layer。

```text
omni-skills
│
├── skills/
│   ├── reusable workflow A
│   ├── reusable workflow B
│   └── reusable workflow C
│
└── installer
        │
        ├── Cursor
        ├── Codex
        ├── Claude Code
        └── Antigravity
```

設計原則是：

Skill 本體只維護一份，工具相容性由安裝層處理。

因此 Skill 應盡量描述：

- search the repository
- trace callers
- inspect relevant files
- run relevant tests
- verify observed behavior

而不是把 workflow 綁死在某一個 Agent 的專屬 tool syntax。

工具差異屬於 distribution / adapter 問題，不應污染 Skill 的核心方法。

安裝與目前支援方式請以 repository 的 [README.md](../README.md) 與 [INSTALL.md](../INSTALL.md) 為準。

## 8. 一個 Skill 應該包含什麼？

好的 Skill 通常回答四件事：

### 8.1 什麼時候使用？

由 frontmatter description 定義 trigger。

Trigger 應足夠精準。

太廣（例如「遇到任何 coding task 都使用」）容易造成：

- 過度觸發
- context 增加
- 小問題被放大成大型 workflow

太窄則可能讓 Agent 無法 discover。

### 8.2 怎麼做？

`SKILL.md` 描述 workflow 與決策方式。

例如：

```text
reproduce
→ gather evidence
→ form hypothesis
→ test
→ implement
→ verify
```

這裡應描述「方法」，而不是複製某個專案的 architecture。

### 8.3 需要哪些 deeper references？

Skill 本身保持可讀且精簡。

較深入的內容可以拆成 supporting files：

```text
skill/
├── SKILL.md
├── technique-a.md
├── technique-b.md
└── references/
```

只在 workflow 真的需要時讀取。

### 8.4 是否依賴外部 runtime？

有些 Skill 本身就是完整 workflow。

另一些 Skill 只是某個 runtime capability 的 discovery layer。

例如 browser automation 可能由外部 CLI 提供實際執行能力。這種情況應：

- Skill → discovery / routing
- Runtime → command implementation + current reference

避免在 Skill repo 複製一大份容易與 runtime 版本脫節的操作手冊。

## 9. Upstream Skills：Mirror、Adapt、Wrapper

公開 Skill 不一定都要用同一種整合方式。

常見有三種：

### Mirror

幾乎完整保留 upstream。

適合：

- upstream 本身已經跨 Agent
- 不需要本地行為差異

### Adapted Mirror

保留 upstream 方法，但加入少量整合調整。

適合：

- trigger 需要收斂
- 需要與現有 Skill 分工
- upstream workflow 引用了目前 repository 不存在的 companion workflow

Adaptation 應盡量小，並保留：

- upstream source
- synced revision
- license
- local adaptation notes

### Runtime Wrapper

Skill 只負責找到並載入真正 runtime。

適合：

- capability 由 CLI / runtime 提供
- runtime guide 會跟版本一起更新
- vendoring 完整操作文件容易 stale

重點不是「統一所有 Skill 的檔案長相」，而是保留每個 upstream 最合理的 source-of-truth 邊界。

## 10. Skill Routing：避免能力互相打架

擁有更多 Skills 不代表每次都要使用更多 Skills。

兩個能力若處理相似問題，應明確定義邊界。

例如 debugging：

```text
Failure 穩定可重現
        │
        v
systematic-debugging
        │
        └─ root cause first


Failure 本身很難穩定觀測
        │
        v
gs-diagnosing-bugs
        │
        └─ build feedback loop first
```

重點不是同時堆疊兩套 workflow，而是選擇目前問題最需要的那一套。

好的 Skill ecosystem 應該是一個 router，而不是一個 checklist。

## 11. Agent 的推薦工作迴圈

當 context 與 skills 分層後，一個健康的 Agent workflow 大致如下：

```text
1. Read entry map
       ↓
2. Resolve task scope
       ↓
3. Load only relevant project context
       ↓
4. Load relevant skill if needed
       ↓
5. Inspect actual implementation / evidence
       ↓
6. Plan proportionally to task complexity
       ↓
7. Make the smallest coherent change
       ↓
8. Run relevant validation
       ↓
9. Review diff and observed result
       ↓
10. Report outcome and remaining uncertainty
```

其中幾個原則特別重要：

- 不因為存在 Skill 就強制每次使用
- 不因為流程很完整就把簡單任務做成大工程
- 不把推測當成 codebase fact
- 不以「看起來正確」取代實際 validation
- 不因為 Agent 能讀完整 repo，就要求它每次全文掃描

## 12. Evidence Before Documentation

Agent 很適合協助建立 repository context，但應先 audit，再寫規範。

推薦順序：

```text
Repository Mapping
        ↓
Evidence Inventory
        ↓
Documentation Proposal
        ↓
Draft
        ↓
Human / real-task verification
```

對 codebase 的結論至少應區分：

| 標記 | 意義 |
|------|------|
| FACT | code / config / test / schema 可直接證明 |
| INFERENCE | evidence 支持，但不是直接聲明 |
| UNCERTAIN | 目前資料不足 |

最大的風險不是 Agent 看不懂 code，而是把「現在碰巧這樣寫」誤升級成「以後必須這樣寫」。

Legacy、temporary workaround 與 accidental consistency 都不應被自動當成 architecture standard。

## 13. 機械式驗證優先

能由程式驗證的規則，不要只依賴 Agent 記住。

| 規則 | 交給 |
|------|------|
| Type safety | typecheck |
| Formatting / static rules | lint |
| Behavior | tests |
| Integration / release gate | CI |
| Architecture intent / domain constraint | docs + Agent context |

Markdown 最適合承載：

- 意圖
- navigation
- reasoning
- domain knowledge
- 不容易由程式直接判斷的 constraint

它不應該取代 automation。

## 14. 哪些內容應該放在哪裡？

| Information | Best home |
|-------------|-----------|
| Project map / context routing | `AGENTS.md` |
| Durable architecture | `docs/architecture/` |
| Domain knowledge | `docs/domain/` |
| Architecture decisions | `docs/decisions/` / ADR |
| Project development rules | `docs/development/` |
| Reusable agent workflow | `SKILL.md` |
| Skill deep techniques | Skill supporting files |
| One-off implementation scope | Task prompt / spec |
| Enforceable rule | lint / test / CI |

一個簡單判斷方式：

如果把這段內容複製到另一個完全不同的 repo 仍然成立，它可能屬於 Skill 或 shared standard。  
如果只有目前這個 codebase 成立，它應該留在 Project Context。

## 15. 常見失敗模式

### 巨大的 AGENTS.md

結果：

- context 成本高
- 所有資訊看起來同樣重要
- stale knowledge 很難清理

應改成：thin map → deeper docs。

### 每個 Agent 各維護一份完整規範

結果：tool A version、tool B version、tool C version，最後一定 drift。

應改成 canonical source + thin adapters。

### 把專案知識寫進 Skill

Skill 失去可重用性，也容易把 Project A 的 assumption 帶進 Project B。

### 把工作方法寫進每個 repo

相同 debugging / design / testing workflow 被重複維護。

這正是 reusable Skill layer 要解決的問題。

### 所有 Skills 永遠 preload

Skills 應該是 progressive disclosure，而不是另一種 global prompt dump。

### 只寫規則，不做驗證

如果一條規則可以由 automation 強制，優先把可靠性放進工具鏈。

## 16. 最小可行架構

不需要一次建立完整平台。

單一 project 的起點可以很小：

```text
project/
├── AGENTS.md
└── docs/
    ├── architecture/
    ├── development/
    ├── domain/
    └── decisions/
```

再搭配共用 Skill library：

```text
omni-skills/
└── skills/
    ├── ...
    └── ...
```

Runtime 時：

```text
Task
  +
Project map
  +
Relevant docs
  +
Relevant Skill
  =
Agent working context
```

只有當真實任務證明 context 不足時，再增加文件或能力。

## 17. Design Principles

這套架構最終希望維持以下特性：

| 原則 | 意義 |
|------|------|
| Thin | 常駐 context 只留下導航與真正高價值 constraint。 |
| Layered | 個人、shared、stack、project、task 的責任分開。 |
| Reusable | 通用工作方法抽成 Skills，不在每個 repo 重寫。 |
| Discoverable | Agent 能從短入口與 Skill description 找到 deeper knowledge。 |
| Evidence-based | codebase 文件先以 evidence 建模，再談標準化。 |
| Tool-neutral | 核心 knowledge 與 workflow 不綁死單一 Agent。 |
| Verifiable | 可自動驗證的規則交給工具鏈，而不是只靠 instruction。 |
| Maintainable | 每種知識有明確 source of truth，避免多份長文件互相 drift。 |

## 18. 一句話總結

```text
AGENTS.md 是地圖。
docs/ 是知識。
Skills 是能力。
Task 是目標。
Tests / CI 是證據。
```

Agent 不需要在開始工作時知道所有事情。

它需要的是：知道現在要做什麼、知道去哪裡找正確資訊、知道何時載入正確能力，並在完成後用證據驗證結果。
