# Plan、evidence ledger 與接續包

選用現有專案文件或任務系統保存；沒有合適位置時先在對話或已允許的工作區建立草案，不擅自往使用者 repo 新增計畫檔。以下是一份可縮放的結構，不需要為小範圍工作填滿無關章節。

## 1. 本輪邊界與 capability preflight

- Outcome：本輪要達成的結果；plan-only 或 plan-and-execute，附使用者依據。
- Scope / non-goals：哪些屬於本輪，哪些不屬於。
- Repo / revision：實際路徑、base commit、branch、工作樹修改與適用 repo 指引。
- Capabilities：可用的讀寫／測試／委派工具、並行限制、隔離方案與權限阻礙；執行方式為 delegation、primary-sequential 或 plan-only，記錄選擇依據及使用者是否要求指定代理／模型。委派能力另標一種，不混寫：A 可指定模型／思考程度、B 可派子代理但不能指定模型或思考程度、C 沒有可用子代理而由主代理循序完成、D 能建立任務但無法確認實際模型、價格或是否成功啟動。工具接受的設定不是 observed；成本沒有資料標未知。這筆記錄不擴大授權，也不代表任務已啟動。
- Dependency readiness：每個必要套件、服務、工具與 credential 設定的版本／API 相容性、目標環境、owner、available / missing / unknown、查驗方法與證據、所需權限或使用者步驟。credential 只記名稱與狀態，絕不記錄秘密值；建立／配置持續存取依宿主要求另取得確認。
- PlannerExecutionCheck（large only，配置紀錄，不阻擋研究）：主規劃 agent 直接沿用使用者在目前 session UI 選定的模型與 effort，不自動切換或要求最高配置。不為此紀錄詢問精確型號、可用上限或 Ultra 額外許可。宿主已有可觀察值或使用者主動提供時，可記 selected model／effort、`UI evidence source`、active session 範圍與 `observed at`；這是 UI 選定值，不是 provider-side execution 證明。設定檔預設值、舊 session、提示詞、子任務推薦或工具接受設定不可冒充觀察證據。不可觀測時記 unknown／not observable；可用上限無須另查，不因此阻塞、要求 fallback 或標 provisional。既有 Plan 不因缺少此配置證據而需要重規劃或失去 ready 狀態。這不授權另行啟動或委派任務，也不擴大 plan-only／execute 範圍。Light 標 not applicable。
- SubtaskModelAssignments：針對委派角色與子任務列適任能力、推薦模型／思考程度、理由、可接受替代、成本假設及升級條件。監管／整合 writer 推薦以任務所需的規劃／整合能力為基準，同級或略低一階，不以主規劃 UI 選定型號／effort 代替能力需求；子任務先看適任，再比較 CP 值。宿主屬於情境 A，且需求明確、範圍可界定、驗收具體時，主動評估並優先考慮能力足夠且成本較低的模型或適當的較低思考程度；這是有條件的預設。權限、資料安全、migration、並發、跨 repo 契約、重要架構或高度不確定的工作不得只因看起來小就降階。較低階模型不保證便宜或勝任，不寫死品牌、等級或價格排名。情境 B 不宣稱成本已降低；情境 C 由主代理循序完成，除非使用者要求必須委派；情境 D 不憑預設值或 tool-accepted 宣稱成功，也不把該值寫成 observed。正式委派前查當下可用模型與支援設定，不寫固定偏好或過時品牌排名。每項分開記錄 recommended、requested、tool-accepted、observed；工具不能設定或核實時說明限制，不宣稱已切換。沒有委派任務就標 not applicable。推薦不是額外額度或外部任務的授權。卡住時保存成果，再依授權與宿主能力升級、調整拆分或交回主代理，並遵守重試上限。
- Open startup questions：缺少且影響本輪決策的資訊。主規劃沿用 UI 選定配置，不詢問精確型號、可用上限或 Ultra 額外許可，不把配置不可觀測當作啟動問題。子任務模型與必要許可只在準備委派時，依使用者授權與宿主規則確認；既有確認不重問，未回覆不視為同意。

## 2. 需求與來源查核

每項需求給一個 R-ID，記錄可驗收的描述、來源與重要性。把「必須滿足的需求」與「對目前實作的假設」分開。

每筆 evidence 記錄：

- E-ID／claim：正在支持或反駁的具體主張。
- Source：文件／連結、repo file + symbol（適用時加行號）、commit／版本與查驗時間。
- Method：直接閱讀、執行命令、測試或一手文件；測試附環境與輸出位置。
- State：verified / assumed / unknown / contradicted。
- Finding：實際觀察、驗證的範圍及限制。
- Impact：影響的需求、設計決策或任務。

「verified」只表示在所列版本與方法下有證據，不保證跨版本或未測情境。未執行程式的閱讀結論應標明 static inspection。

## 3. Contradiction ledger 與可行性

每筆 C-ID 列出：衝突的 E-IDs、差異、決策影響、裁決人、驗證動作、決議與理由、受影響任務及其下游。依 [SKILL.md 的分析確認關卡](../SKILL.md) 判定阻擋範圍；無法界定時先查核，不直接當成無關。

分析確認清單：每個 Q-ID 包含問題、選項、建議、受影響的需求／接口／任務、阻擋範圍、解除條件、查核或決策來源。逐任務記錄 gate 結果；不受影響的任務須有依賴及 ownership 證據才可在授權內續做。全案基礎問題或使用者要求全案確認時，套用全案關卡。查核已解決的技術事項記為 findings；例行實作選擇記錄主代理的依據，不製造多餘批准。使用者明確接受有界風險／延後驗證／排除範圍時，保存適用範圍、替代驗證、重查時點與剩餘缺口；解除阻擋不等於證實假設或完成驗收。

可行性摘要分成：

- 已確認可沿用的現有能力。
- 需要新增或改造的部分與大致實作方向。
- 困難點：依賴、資料相容、並發／效能、跨模組接口等與本輪相關的風險。
- 未知與信心水準；哪些未知會改變拆分或工期估計。

Risk spike S-ID：

- Question / hypothesis：要判定的技術問題。
- Scope / sandbox：允許碰觸的範圍，是否僅唯讀或隔離實驗。
- Budget / stop condition：時間或嘗試上限；何時已取得足夠證據。
- Evidence for pass / fail：具體可觀察結果。
- Decision after result：選哪個方向，或要重新規劃什麼。

## 4. 架構、DAG 與分工

- Shared contracts：資料 schema、API／事件接口、錯誤語意與版本；指定 owner。
- DAG：例如 T1 → T2；T1 → T3；T2 + T3 → T4 integration。每條依賴寫明等的是哪個產物，不只畫順序。
- Parallel groups：可並行的任務及理由；critical path 與阻塞點。
- Ownership / conflict map：每個檔案／區域的唯一 writer；共用設定、schema、lockfile、產生碼的寫入協調方式。沒有隔離機制時縮小並行範圍，不冒險同時寫入。
- Task contracts：使用 [task-contract.md](task-contract.md)，每項任務附 R-IDs、輸入及輸出、合約版本與 ready-to-dispatch 結果；未通過不得開始實作。
- Estimates：若需要工期，使用有假設依據的範圍並註明信心；未知事項未驗證前不給虛假的精確承諾。

## 5. 執行台帳與整合驗收

每項任務記錄 owner、模型／effort 的可觀察設定（不可觀測則記 unknown，不冒充已核實；tool-accepted 不是 observed）、狀態、base revision、合約版本、交付產物、測試證據、審查問題、重試次數及下一步。成本沒有資料標未知，不編造節省。啟動結果不明時先核對，不重複啟動可能已成功的任務。改版／移交另記 stop-requested 與 stop-confirmed、代理及工具停止寫入的證據、保存的 diff／產物、新版確認及 ownership 移交；無法確認停止時維持 blocked。晚到舊版成果標 stale，記錄是否經新版核對後採用。

狀態可用：planned → ready → running → implemented → spec-reviewed → code-reviewed → integrated → verified。blocked / partial 保留原因；修正或 rebase 後受影響的審查與測試需重新評估。

完成矩陣將 R-ID 對應至實作任務、spec／code review、必要正常／邊界／錯誤／整合驗收、適用證據及剩餘缺口；記錄最終 commit／工作樹或產物標識、環境、證據來源與適用性判斷。主代理負責完整判定，依 verify-change 沿用有效證據並補驗受影響項、缺口與新增整合風險，不必重跑全部。跨 revision 沿用須有具體差異與依賴影響分析。記錄實作者與審查者，相同時標 self-review；使用者、團隊或專案要求獨立審查時未滿足不得宣稱完整完成。必要驗證無法執行就保留 blocked／not-run；分支自行通過不等於整合通過，強制 gate 不降級。完成判定沿用 CompletionDecision。

## 6. Resume / replan context pack

中斷或重大變更時，只保存足以安全接手的資訊：

- 目前目標、授權範圍、使用者後續變更與 executor 選擇。
- repo／branch／worktree／commit、不可覆蓋的既有修改。
- 最新 plan／spec／evidence 的位置與版本。
- 已完成及已整合的任務；測試與審查證據適用哪一版。
- 每個仍在執行的代理／任務及工具／背景程序、owner、合約版本、最後已知狀態與產物、停筆確認及待移交範圍，避免重複派工。
- blocking contradictions、待回覆問題、已試過的失敗及重試預算。
- 下一個安全動作、所需前提與停止條件。

恢復時先核對環境是否仍可用、實際 repo 狀態及既有任務是否已完成。接口、需求或 base revision 改變時，依 [SKILL.md 第 4 節](../SKILL.md) 完成停筆與工具狀態核對，再更新 DAG／contracts／驗收、移交 ownership，並取得新版確認後續做；不能只更新摘要或收到中斷回覆就假設舊 writer 已停止。模型推薦只作計畫；恢復委派工作時依使用者要求與宿主規則核對所需設定、必要許可、工具能力和原計畫適用性，必要時更新推薦與證據。主規劃 session 仍直接沿用目前 UI 選定值，不因配置不可觀測而要求補證或阻擋研究。
