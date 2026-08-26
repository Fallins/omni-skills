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

非瑣碎題目時，產出**可離線開啟**的 HTML 視覺說明。

本 skill 的 SoT 在 omni-skills（安裝進各工具使用者 skill 目錄）。**不要**在每個業務 repo 建立 `.agents/skills/eli5`。

## 核心：一切以 repo 為據

程式相關題目：先查 repo 再解釋。不要用命名習慣或想像發明架構。

追實作到足以指出：進入點、重要模組、API 邊界、資料來源、狀態轉換、外部服務、儲存、非同步、轉換／聚合、最終輸出。

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

## 調查步驟

1. 弄清使用者要解釋的題目。
2. 找可能的進入點。
3. 搜尋 reference 與呼叫端。
4. 追主執行或資料路徑。
5. 標出外部邊界。
6. 標出重要分支或平行工作。
7. 記下最有用的檔案路徑與符號。
8. 然後才組解釋。

不要通讀整個 repo。走能準確回答該題的最窄路徑。有足夠脈絡就不要為問而問。

## 視覺模型

優先由左到右或由上到下的流。圖必須反映真實系統，不要因為「常見架構」就加元件。

## HTML 產出

非瑣碎解釋：做一份自包含 HTML。

使用 HTML、CSS、需要時 inline SVG；只有明顯幫助理解時才加一點 JavaScript。

禁止：CDN、Mermaid CDN、遠端字型、外部 JS 庫。用瀏覽器直接打開檔案要能看。以桌面為主，小螢幕仍可用。

### 視覺風格

要：大圖、大標籤、箭頭、卡片、分組、短註、留白、層級。

不要：長文、密段落、大段原始碼、牆一樣的表、裝飾噪音。

想成「一張大圖把系統講完」，不是「文件渲染成 HTML」。

使用者若另外要求「文字流程圖」，聊天裡用 `|+-` 組成，**不取代** HTML 主產出。

### 建議結構

1. **What is happening?** 一兩句總結整套系統。
2. **The big picture** 主圖，通常是頁面最大塊。
3. **Follow one request** 主路徑編號步驟，每步很短。
4. **What each important piece does** 重要元件各一句。
5. **Why it was designed this way** 僅在程式有足夠證據時；推斷的設計意圖標 Inferred。
6. **Where things may go wrong** 題目涉及 bug／延遲／效能／可靠度／race／失敗時；標在圖上或近旁。沒證據不要宣稱瓶頸。區分 confirmed bottleneck／likely／possible investigation target。
7. **Evidence** 頁底列出最重要的 repo 引用（路徑 → 符號），不要整檔貼上。

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

調查範圍對齊題目。例如「為什麼進地圖慢」只追進地圖那條路。

## 結束回覆（聊天保持短）

1. HTML 路徑
2. 一句結論
3. 妨礙定論的主要 Unknown

HTML 才是主說明。
