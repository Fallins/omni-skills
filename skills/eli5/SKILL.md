---
name: eli5
description: >-
  Creates a grounded visual explanation of how a codebase, feature, architecture,
  request flow, data flow, bug, or performance issue works. Use when the user
  explicitly asks for ELI5, a visual explanation, an architecture walkthrough,
  "how does this work", "how does this flow", or wants a complex system explained
  simply. Prefer this skill for understanding and diagnosis, not for implementing
  features or modifying production code.
disable-model-invocation: false
---

# eli5

與使用者對話用**繁體中文**。HTML 產物可中英混排。

把指定主題講給「聰明、但對這塊系統完全陌生」的讀者。目標不是童言童語，而是：

- 大局理解
- 強視覺層級
- 很少文字
- 扣住實際程式庫
- 事實與推論分開

**少文字不等於少概念。ELI5 要降低的是每個概念的理解成本，不是應該涵蓋的概念數量。**

非瑣碎題目時，產出**可離線開啟**的 HTML 視覺說明。

本 skill 的 SoT 在 omni-skills（安裝進各工具使用者 skill 目錄）。**不要**在每個業務 repo 建立 `.agents/skills/eli5`。

## 核心：一切以 repo 為據

程式相關題目：先查 repo 再解釋。不要用命名習慣或想像發明架構。

追實作到足以指出：進入點、重要模組、API 邊界、資料來源、狀態轉換、外部服務、儲存、非同步、轉換／聚合、最終輸出。

若題目是架構／概念系統，不只追 execution path；也要找出構成該架構的主要角色、層級、責任、source of truth、routing、precedence、lifecycle 與重要 boundary，只保留與題目有關者。

優先 repo 證據，其次通用框架知識。框架行為與應用行為要分開寫。

用各工具原生能力：**搜尋 repo、找呼叫端、追 reference、讀相關檔**。不要寫某家工具專屬指令名。

## 證據層級

每個重要結論都要能歸到：

### Confirmed

程式、設定、log、測試、schema 或其他 repo 證據直接支持。

### Inferred

合理詮釋，但未直接證明。

### Unknown

目前從 repo 無法判定。

推論不得寫成 Confirmed。

## 先判斷題目的形狀

開始調查前，先判斷這次解釋主要屬於哪一類。這會決定要追「一條流」還是先建立「概念地圖」。

### Narrow flow

例如：一個 request 怎麼走、登入怎麼完成、玩家進地圖發生什麼。

重點：追主要 execution / data flow，以及真正會影響理解的重要分支。

### Broad architecture / concept system

例如：整個 repository 的架構、agent-work 的架構與概念、authentication architecture、deployment architecture。

重點：先建立 concept inventory 與關係圖，再用具體 flow 當例子。**不要把 broad architecture 強行縮成一條 request flow。**

### Diagnostic

例如：為什麼慢、bug 怎麼產生、事故在哪裡分岔。

重點：正常 flow + actual flow / bottleneck / divergence + evidence。

題型可以混合；選一個主要形狀，再補必要的次要視角。

## 調查步驟

1. 弄清使用者要解釋的題目與範圍。
2. 判斷題型：narrow flow / broad architecture / diagnostic。
3. 找最能證明該題的入口、文件、設定與代表性實作。
4. Narrow flow：搜尋 reference、呼叫端，追主執行或資料路徑。
5. Broad architecture：先建立 concept inventory，至少辨認主要角色／層級／責任／source of truth／routing／precedence／lifecycle／boundary 中與題目有關的部分。
6. Diagnostic：建立正常路徑，再找 divergence、阻塞或失敗點。
7. 標出外部邊界、重要分支與平行工作。
8. 記下最有用的檔案路徑與符號。
9. 做一次 coverage check：有沒有因為追求「少文字」而漏掉理解這個題目不可缺的概念？
10. 然後才組解釋與視覺。

不要為了完整而通讀整個 repo。取得**足以完整解釋題目的最小充分證據集合（minimum sufficient evidence set）**。

- 窄 flow 題目可以沿主要路徑深追。
- broad architecture 題目應跨越足以涵蓋核心概念的幾個代表性來源，而不是只找一條最窄路徑。
- 有足夠脈絡就不要為問而問。

## Concept inventory 與 coverage gate

對 broad architecture / concept system，HTML 前先在內部建立 concept inventory。不要把 inventory 原樣全部貼給使用者；它是用來防止漏概念。

可檢查：

- 主要角色／系統／repository 是誰？
- 每一層或每一類東西的責任是什麼？
- 哪裡是 canonical source of truth？
- context / data / control 怎麼 routing？
- 哪些 precedence / override 會影響行為？
- lifecycle / install / sync / deploy / enroll 等流程怎麼串？
- 是否有不同 lane、模式或使用情境？
- 哪些 boundary 是刻意設計、不能混在一起？
- 哪個具體例子最能把整套模型跑一次？

不是每題都要回答全部問題；只保留理解該題不可缺的部分。

在產出前問自己：

> 如果讀者只看這份 ELI5，是否會因為少掉某個核心概念，而對整體架構形成錯誤或過度簡化的 mental model？

若會，就先補 coverage，再壓縮文字。

## 視覺模型

優先由左到右或由上到下的流。圖必須反映真實系統，不要因為「常見架構」就加元件。

優先有一張 **dominant big-picture diagram** 作為整頁主視覺。

若 broad topic 無法在單一主圖中清楚涵蓋核心概念，可以再用 **2–4 個互相連貫的 supporting diagrams** 分別呈現層級、routing、lifecycle、precedence 或具體例子。

不要為了遵守「一張圖」而省略重要架構概念。

## HTML 產出

非瑣碎解釋：做一份自包含 HTML。

使用 HTML、CSS、需要時 inline SVG；只有明顯幫助理解時才加一點 JavaScript。

禁止：CDN、Mermaid CDN、遠端字型、外部 JS 庫。用瀏覽器直接打開檔案要能看。以桌面為主，小螢幕仍可用。

### 視覺風格

要：大圖、大標籤、箭頭、卡片、分組、短註、留白、層級。

不要：長文、密段落、大段原始碼、牆一樣的表、裝飾噪音。

想成「用少量文字和少數幾張圖，讓讀者建立正確 mental model」，不是「文件渲染成 HTML」。

**Visual simplicity must not reduce conceptual coverage.**

使用者若另外要求「文字流程圖」，聊天裡用 `|+-` 組成，**不取代** HTML 主產出。

### 建議結構

結構依題型調整，不要所有題目都硬套同一模板。

#### Narrow flow

1. **What is happening?** 一兩句總結。
2. **The big picture** 主 flow。
3. **Follow one request** 主路徑編號步驟，每步很短。
4. **What each important piece does** 重要元件各一句。
5. **Why it was designed this way** 有足夠證據才寫。
6. **Evidence**。

#### Broad architecture / concept system

1. **What is happening?** 一兩句說清整套模型。
2. **The big picture** 顯示主要角色／層級與關係。
3. **Major concepts / layers** 用短標籤說清各自責任。
4. **How the pieces relate** 視需要補 routing / precedence / lifecycle / source of truth。
5. **One concrete example** 用一條實際 flow 把整套模型跑一次，但不要讓這個例子取代完整架構。
6. **Important boundaries / design intent** 有證據才寫；推斷標 Inferred。
7. **Evidence**。

#### Diagnostic

1. **What is happening?** 症狀與範圍。
2. **Normal / expected flow**。
3. **Actual flow / bottleneck / divergence**。
4. **Evidence / hypothesis / how to verify**。
5. **Important pieces**。
6. **Evidence**。

題目涉及 bug／延遲／效能／可靠度／race／失敗時，標出問題點。沒證據不要宣稱瓶頸；區分 confirmed bottleneck／likely／possible investigation target。

## 效能調查

若問為什麼慢，另外指出：連續／平行網路、DB、連線取得、serverless 邊界、cold start、物件儲存、大 payload、重複請求、N+1、重複計算、序列化、聚合、阻塞依賴、client waterfall。

每個疑似瓶頸寫：

```text
Evidence: 程式證明了什麼
Hypothesis: 什麼可能慢
How to verify: 最小量測
```

不要把 ELI5 變成優化專案，除非使用者要求優化。主目標是理解。

## Bug 與事故

```text
Expected path
     ↓
Actual path
     ↓
Where they diverge
     ↓
Observed symptom
```

根因未證明就標 hypothesis。

## 產出位置

寫進**被解釋的那個專案**：

```text
.agent-artifacts/eli5/<slug>.html
```

目錄不存在就建。不要寫進應用程式 source 目錄。

若該 git 的 `.gitignore` 沒有 `.agent-artifacts/`，補上：

```gitignore
# Local AI-generated investigation artifacts
.agent-artifacts/
```

**不要** ignore `.agents/`。不要把完整 skill 貼進 `AGENTS.md`／`GEMINI.md`／`CLAUDE.md`。

## 安全範圍

對 production code **唯讀**，除非使用者另外要求改實作。

允許：讀檔、搜尋、看設定／測試／既有 log、安全的唯讀檢查指令、建立 ELI5 artifact。

不要：重構、修 bug、改行為、改依賴、改部署、跑破壞性指令。

若看出可能修法，只說明、不套用，除非使用者明確要求。

調查範圍對齊題目：窄 flow 不要擴成整個產品；broad architecture 也不要因為追求「最窄」而漏掉核心概念。

## 結束回覆（聊天保持短）

1. HTML 路徑
2. 一句結論
3. 妨礙定論的主要 Unknown

HTML 才是主說明。
