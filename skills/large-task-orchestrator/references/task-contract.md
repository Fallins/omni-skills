# Task contract

為實作任務填寫以下欄位；調查／審查任務可省略不適用的程式修改欄位，但保留明確輸入、產出與驗收證據。詳細度以「另一個代理不用猜關鍵決策就能工作」為準，不要求預先寫完整實作。

## 任務識別與邊界

- Task ID／名稱／類型：investigation、spike、implementation、review 或 integration。
- Requirement IDs：對應的需求與 acceptance criteria。
- Goal：這次交付的單一可驗證結果。
- Non-goals：本次不處理什麼，特別是容易順手擴張的範圍。
- Owner：唯一負責人（子代理或循序執行的主代理）；審查者與整合者另列，自己實作再審查時標 self-review。
- Base：repo、branch／worktree、commit、已知未提交變更；未取得資訊填 unknown，不捏造。
- Inputs：來源、適用 repo 指引、已決定的規格與合約版本；以 evidence IDs 連回來源。
- Dependencies：前置任務、所需產物與完成條件；下游消費者。

## 修改範圍與實作方向

- Owned files / regions：允許修改的現有路徑與 symbol。新檔案標為 proposed；未驗證的位置標為待確認。
- Read-only references：需要理解但不允許本任務改寫的檔案。
- Shared-file protocol：共用檔案 owner、序列化順序或交由整合者套用的 patch；不得與別的 writer 同時寫入。改版／移交依 [SKILL.md 第 4 節](../SKILL.md) 的停筆程序；記錄舊代理與工具停止寫入的證據、保存的 diff／產物、新舊合約版本、ownership 移交及新版確認。未確認停筆不得重派同一範圍。
- Implementation outline：按建議順序列出要閱讀、修改與測試的位置，說明函式／模組責任、資料流、演算法或既有元件的重用方式，給足具體提示讓執行者不用自行設計關鍵決策。列出必要 migration／backfill／相容策略；不適用則簡述原因。
- Constraints：效能、相容性、安全性與版本要求，只納入與此任務相關的限制。
- Open questions：列出 Q-IDs、影響的需求／接口／任務、查核結果、決策來源與解除條件。阻擋本任務的問題未解決則 not ready；與其他問題無關須附依賴與 ownership 證據，不能只貼「不阻擋」標籤。使用者接受有界風險或延後驗證時，記錄範圍、替代驗證、重查時點與剩餘缺口，不將未知改成已驗證。適用 [SKILL.md 的分析確認關卡](../SKILL.md)。

## 完整的局部 spec 與接口

- Consumes / produces：每個跨任務邊界的資料、事件、檔案或 API。
- Interface / schema：欄位與型別、required / optional、預設值、識別碼、狀態轉移與不變量；既有正式 schema 直接引用，避免複製後漂移。
- Normal behavior：觸發條件、主要流程、可觀察結果。
- Error / edge cases：輸入缺漏或錯誤、空資料、重複請求、權限不足、相依服務失敗；依任務需要說明 timeout、重試、冪等性及併發行為，不機械補齊無關項目。
- Compatibility：既有呼叫者會否受影響、版本化或漸進遷移方式。
- Spec decisions：已決定事項與來源；尚缺的技術事實由主代理查核。既有授權與定版契約內的例行實作選擇由主代理記錄理由；缺少產品決策、必要授權或會改變驗收／跨任務契約的問題，彙整給使用者決定，不能猜測以通過關卡。
- Do not guess：列出不能自行發明的欄位、錯誤碼、預設值、相容策略或商業規則；遇到缺漏先回報主代理，不靠「合理猜測」繼續。

## 驗證、驗收與失敗處理

- Tests：unit／integration／端到端範圍，使用哪些 fixture，斷言什麼；需要新增或調整的具體測試。
- Commands：實際驗證過的命令與執行目錄；尚未核實者標為 proposed command，不能保證可執行。
- Acceptance criteria：可客觀檢查的結果，以及各自對應的測試或人工證據。
- Regression boundary：必須保持不變的行為；如何檢查。
- Review gates：先 spec compliance，再 code quality；重大問題修正後重新核對相關驗收。
- Retry budget / stop condition：依任務風險設定有限次數或時間；禁止無新證據的同型重試。權限或授權不足立即回報，不繞過限制。
- Failure recovery：適用時說明可逆的修改邊界與復原方式，不允許以清空工作樹等方式抹去既有修改。

## Ready-to-dispatch 檢查

所有實作任務派出前，主代理確認：

- 本任務的分析確認關卡已通過；沒有仍阻擋本任務或必要依賴的 Q-ID，解除依據及剩餘驗證缺口可追溯。使用者若要求全案確認，另須符合該要求。
- 實際 path／symbol／import／signature 已查核；提供必要摘錄，或子代理確實可讀取的定版 canonical contract。新增項目清楚標示 proposed，而非假裝已存在。
- 正常與錯誤輸入、預期輸出、boundary assertions 足夠具體，不把核心設計交給執行者猜。
- 依賴產物與合約有確切 revision，相關工具／服務／非秘密設定就緒；任何缺口已揭露並由使用者決定處理方式。
- 提供已核實可執行的驗證命令與目錄；若有已確認但無法執行的驗證，明列使用者接受的暫時缺口與替代驗證，不能宣稱最終完整驗收已通過。
- writer ownership 與禁止修改範圍清楚；若有舊 writer，已核實其代理與工具停止寫入並保存產物；執行者確認新版與自身範圍後再繼續。舊版晚到成果須重新核對，不能直接整合。

## 子代理回報合約

先回報有用結果，再附必要細節：

1. Status：done / partial / blocked；完成的 acceptance criteria 與尚未完成者。
2. Changes：實際採用的合約版本、檔案、symbol、commit 或可檢查的 diff／產物位置，標明實際做了什麼。
3. Verification：執行目錄、完整命令、結果、關鍵輸出與 log 位置；區分 passed / failed / not run。不得以「應該通過」替代測試。
4. Deviations：規格／接口變動、未預期的相依或跨界需求；未經協調不要自行套用。
5. Blockers：確切動作與目標、阻礙原因、已完成部分，以及 denied / pending / uncertain；指出最小需要的決策。
6. Handoff：下游需要的產物、已知風險與下一個安全動作；停筆／取消／移交時另列代理及工具／背景程序的狀態、停止寫入證據與尚未確認項目。

主代理需核實回報與實際狀態；子代理回報 done 不會自動把全案標為完成。

## 小型示例：批次輸入驗證

以下 repo、檔名、symbol 與規則完全虛構，只示範合約深度，不是使用者專案的事實。實際任務必須先查驗並替換。此例假設所有產品規則已由使用者確認，接口已由 owner 定稿。

- Task：T2，實作純函式 validateBatch(input: unknown): BatchValidationResult；R1「無效批次在寫入前被拒絕」。
- Goal：精確驗證批次資料並回傳既有的 typed result；不執行任何寫入。
- Non-goals：不改 HTTP route、資料庫、驗證結果 schema、認證、批次執行或 UI；不新增套件。
- Base / evidence：實際任務須填查得的 commit 與 evidence ID；本例沒有真實 commit。
- Dependency：T1 已交付並凍結 BatchItem 與 BatchValidationResult 的契約，才可開始。
- Owned files：src/batch/validate.ts（proposed）、tests/batch-validate.test.ts（proposed）；只可寫這兩個檔案。
- Read-only：src/contracts/batch.ts（假設在本虛構 repo 已驗證存在，owner 為 T1）；若型別與以下規格不符，回報主代理，不自行改它。
- Consumes：未知輸入；合法形狀為 { items: [{ sku: string, quantity: number }] }。
- Produces：成功 { ok: true, items: BatchItem[] }；失敗 { ok: false, error: { code: 'INVALID_BATCH', path: string } }。回傳新陣列與新項目物件，不修改原輸入。
- Rules：外層只允許 items；items 長度 1–50；每個項目只允許 sku、quantity；sku 必須是非空字串且等於自身 trim 結果，不自動修剪；quantity 為 1–99 的整數；sku 大小寫敏感，完全相同的 sku 不得重複。
- Error order：先檢查外層結構，再長度，再按 index 檢查項目結構、sku、quantity、重複 sku；只回報第一個錯誤。結構錯誤 path 使用 '' 或 'items.0'，欄位錯誤使用 'items.0.sku' 等格式；項目未知欄位視為該項結構錯誤。
- Implementation hints：先核對契約 imports；寫失敗案例測試；依序使用型別 guard 排除 null／array／非物件；用 Number.isInteger 檢查 quantity，Set 檢查重複；最後建立結果副本。不把 unknown 強制轉型當成已驗證，不做字串轉數字。
- Acceptance examples：{ items: [{ sku: 'A', quantity: 1 }] } 成功；50 個不同 sku 成功、51 個失敗 path='items'；null 失敗 path=''；空陣列失敗 path='items'；quantity='1'、0、1.5、100 均失敗指向 quantity；sku=' A' 失敗指向 sku；第二個相同 sku 失敗 path='items.1.sku'；新增未知欄位失敗；深度凍結輸入後呼叫仍成功且內容不變。
- Verification：以 repo 已核實的測試命令執行上述案例，回報實際命令、執行目錄、結果與 diff。本例不提供假裝已驗證的 npm 指令。
- Do not guess：不要放寬上限、靜默去重、修正資料或改 schema；若測試／契約衝突，回報明確差異，等待主代理處理。
- Final acceptance：子代理測試是 T2 的證據；全案完成後仍由主代理在最終合併版本驗證 R1 的實際端到端行為，確認拒絕時沒有寫入。
