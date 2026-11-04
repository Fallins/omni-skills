---
name: plan-change
description: 為程式變更建立可執行、可驗證的計畫；同一技能提供精簡 light 與研究先行的 large 模式，支援同 repo 多需求／BUG 及跨 repo 工作。
---

# 變更規劃

本技能只規劃。先讀取使用者已給的需求與可取得的現況證據；若上下文不足，可自行形成 TaskBrief 或沿用 understand-task 的結果。計畫深度與 operation mode 分開：plan-only 必須在交付計畫後停止；execute 授權不會因規劃完成而擴大到 push、部署或其他未授權動作。

## 選擇深度

依語意、範圍、風險、依賴和共享資源判斷，不只計算檔案或票數：

- **light**：單一有界需求／BUG、介面穩定、影響局部且能直接驗證。單一任務卡即可，不要求獨立計畫檔、完整 DAG 或代理。
- **large**：同 repo 多需求／BUG 要合併排序或派工；跨 repo 共用成果、介面或 writer；或單一需求涉及權限、不可逆資料、schema／協定遷移、分散狀態、難以隔離的並發或重要未知。
- 使用者明示模式時遵從。若發現無法安全省略的風險，解釋為何增加必要查核；不得藉升級擴大範圍或授權。
- 輕量任務中發現新的跨界依賴、共用 writer 或重大未知時，保留已查證成果，只升級受影響部分，不重做無關工作。

## 重要決策與分析關卡

- 每個未解 Q-ID 記錄問題、影響的需求／接口／任務及下游、目前證據、所需查核或決策、解除條件與阻擋範圍。可查證的技術事實先查，不拿未知直接當成無關。
- 缺少產品決策、必要授權，或可能改變驗收／共享契約的假設時，列出選項、建議與影響，暫停受影響任務及其下游。影響範圍無法界定時先保守暫停可能受影響工作並查明範圍。
- 只有有證據能證明不共用待定契約、writer 或依賴的任務，才可在原授權內繼續。全案目標、共同基礎或使用者要求全案確認的問題仍阻擋全案。
- 使用者接受有界風險、延後驗證或排除範圍時，記錄適用範圍、替代驗證、重查時點與剩餘缺口。這不會把 unknown 變成 verified，也不能越過必要權限。
- plan-only 可做已授權的唯讀調查或隔離實驗，不改產品或部署。完整逐任務判定可沿用共用 Plan 範本的分析確認清單。

## Light：短任務卡

只列足以讓執行者與驗收者不必猜測的內容：

- 目標與可觀察成功條件。
- 相關現況、版本、根因證據或待驗假設。
- 修改範圍、非範圍、重要不變量。
- 簡短實作順序、必要接口與邊界。
- 驗證方式、預期結果、回歸範圍。
- 風險、阻塞與升級條件；沒有則明示。

BUG 計畫包含可取得的修復前失敗證據，以及修後重跑同一路徑的驗收方式。無法重現時標示 static inspection、待驗或 blocked，不編造行為證據。小型 UI 變更若已有精確批准設計，引用 DesignSpec revision／實際使用者決定，並在任務卡內精簡對應每個受影響畫面／狀態、互動、元件／檔案、UX 與 Layout acceptance 及驗證；不強制另建 DesignImplementationMap 文件，也不可漏掉本次涵蓋的狀態。若仍有外觀或互動決策，交付 DesignBrief，經 design-interface 設計與使用者審核，再返回 Plan 更新實作契約。

## Large：研究先行的完整計畫

大型不限跨 repo；同 repo 多需求／BUG 的整批規劃同樣適用。先查核足以影響需求、方案、拆分、接口、風險和驗收的資料，再形成方案。研究範圍受本次授權、工具與 repo 範圍限制，不掃描無關私人資料。

### 規劃者配置紀錄（large 專用，不設開工閘門）

PlannerExecutionCheck 只記錄目前主規劃 session 的選定配置與可觀察限制，不是最高配置檢查，也不是大型研究的開始條件。

1. 主規劃 agent 直接沿用使用者在目前 session UI 選定的模型與 effort，不自動切換、升級或降級。使用者選定 Ultra 時也直接沿用，不為該選項另取許可。
2. 不為本項紀錄詢問精確型號、可用上限或 Ultra 額外許可。若模型／effort 不可觀測，記為 unknown／not observable；可用上限無須另查。不可觀測不阻擋已授權的研究或計畫，不要求 fallback，也不因此將計畫標為 provisional。
3. 宿主已提供目前 session 的可觀察值時，可記錄 selected model／effort、來源與觀察時間；使用者主動提供同一 session 的 UI 顯示值時也可記錄。這只是 UI 選定值證據，不代表已獨立驗證服務端實際執行型號。提示詞、技能文字、設定檔預設值、舊 session、子任務推薦或工具接受設定，不可冒充目前 session 的觀察證據；無資料時如實保留 unknown，不要求使用者補證。
4. 不要求主規劃者達到最高適任模型或最高思考程度，也不宣稱已達最高。既有 Plan 不因缺少模型／effort 或上限證據而需要重寫、補授權或失去 ready 狀態；仍按需求、證據新鮮度、契約、依賴、風險與驗收判定計畫及派工是否就緒。
5. 本項只適用目前主規劃 session，不替代後續子任務的模型選擇與確認，也不授權另行啟動或委派任務。實際委派仍依本次使用者授權與宿主規則確認所需模型設定及必要許可；主規劃 UI 選定值不能代替這些確認或授權。只要求 plan-only 時仍在交付計畫後停止。

此紀錄只適用 large。Light 依任務需要選擇適任能力，不強制最高模型或最高思考程度。

1. **研究覆蓋**：列出需求文件、repo 指引、入口與呼叫鏈、schema／migration、測試／fixtures、設計系統、部署與執行環境、舊 review、已知缺口及外部依賴等適用來源。逐項標 read、unavailable 或 not-applicable，附版本／commit、查核時間、方法與影響。追到會改變計畫的資料流與邊界；README 或搜尋片段不足以證明全貌。
   - 為必要套件、服務、工具和非秘密設定建立 dependency-readiness inventory：版本／API 相容性、目標環境、owner、available／missing／unknown、查核證據及所需使用者動作。憑證只記設定名稱與狀態，不記秘密值；建立持續存取仍依有效宿主規則。
   - 「所有可取得資訊」限定在本任務範圍、權限與工具內，且足以影響需求、拆分、接口、風險或驗收；不做無界掃描。
2. **證據與問題**：EvidenceLedger 對關鍵主張標 verified／assumed／unknown／contradicted，附來源及查核方法。文件和實作不一致時列 C-ID、差異、決策影響及處置。建立 Q-ID 與受影響任務；先查技術事實，僅把仍需產品決定或必要授權的問題交使用者。研究完成不等於所有未知消失；有關鍵阻塞時標 partial plan。
   - 高風險技術未知可提出有界 risk spike：寫明假說、範圍／隔離方式、時間或嘗試上限、停止條件、通過／失敗證據及結果如何改變方案；不得自行啟動未授權的產品修改或外部動作。
3. **全案方案**：列需求與非目標、既有行為不變量、方案與不採方案理由、模組／repo 接口、相容和遷移、資料／安全／並發風險、回退方法及最終驗收地圖。每個需求都映射到任務和最終驗收，不能只規劃「下一片能做」。
4. **整批拆解**：同 repo 多需求先為各項需求／BUG 建立 R-ID／BUG-ID，再查重疊程式、共同根因、重複修復與共用驗收；合併重複工作並指定共享契約 owner。跨 repo 列每庫 branch／revision／dirty 狀態、適用規則、producer／consumer、接口版本、部署順序、相容窗口、遷移與回退。用可驗收切片建立 DAG；每條依賴指明所需產物和 revision、owner、critical path、共享檔案，以及共享 DB／NAS／外部帳號等競態資源。不能按需求數直接開同等數量 writer。規劃深度與代理數量分開決定；單一高風險大型任務不必然需要多代理。
5. **TaskContract**：每項可派工作至少記錄：
   - task_id、類型、需求 IDs、單一可驗收目標與 non-goals。
   - repo／branch／base revision／dirty 狀態、適用規則和來源證據。
   - 唯一 owner、可寫檔案／區域、唯讀參考、共享檔 owner 與移交方式。
   - 已核實的 path／symbol／import／signature；新檔與新接口標 proposed，不假稱存在。
   - 必讀來源、必要摘錄、canonical contract revision，以及執行環境能否讀取。
   - consumes／produces、欄位型別、required／optional、預設值、錯誤碼、狀態轉移及不變量。
   - 適用的正常、邊界、失敗、取消、重試、冪等和並發行為。若任務涉及長存背景工作、lease 或外部寫入，另定在途 I/O 範圍、lease owner／續租／到期、drain／停機條件、冪等重試／replay、回退／恢復，以及能證明沒有未完成 I/O 的觀察證據。
   - 建議實作順序、模組責任、既有元件重用方式及執行者容易猜錯的正反例。
   - 依賴任務、產物版本、必要環境和開始條件。
   - 驗證命令與工作目錄、fixtures、斷言、證據格式、回歸範圍；未實測的命令標 proposed。
   - 完成與 review gate、有限重試、停止條件和失敗回復。
   - do-not-guess：不得自行發明的產品規則、預設值、相容策略或越界修改。
   - 模型推薦與依據、替代、不可降級／升級條件及可核實的實際設定範圍。
   - 回報狀態 done／partial／blocked、實際變更版本、驗證、偏離、阻塞與交接。
   核心設計不能留給較低能力的執行者猜，也不需要預寫大量實作程式碼。
6. **UI 設計等待點**：有尚未定案的 UI／互動工作時，先交 DesignBrief，含需求 ID、完整 journey、操作問題、既有元件／tokens、狀態、邊界及審核條件，再交給 [design-interface](../design-interface/SKILL.md)。需涵蓋返回／前進／取消／重試、資料保留、錯誤恢復；版面需明示容器邊界、頁邊距、內距、群組／區段／欄距、字級／行高、控制尺寸與對齊，並規劃相關窄／中／寬尺寸、長內容和溢位。UXAcceptance（旅程與行為）和 LayoutAcceptance（指定尺寸及量測證據）分開記錄。原型須標出假資料與非功能控制，不算正式產品驗收。
   - design-interface 產出綁定版本的 DesignSpec，等待使用者明確審核。記錄確切版本與真實決定；不得從沉默或含糊回應推定批准。要求修改時先修訂並再次審核。
   - 只有使用者批准該版後，才返回本 Plan 建立／更新實作映射並更新 TaskContract、依賴與 DAG。大型工作需完整 DesignImplementationMap，逐項對應畫面／狀態、互動、原生元件／檔案、資料契約、UX／Layout acceptance、驗證方式與 owner；輕量工作可把同等必要欄位精簡內嵌於任務卡，不另建文件。任一規模都不可漏掉受影響的狀態或 acceptance；未批准設計、映射缺口或未決產品決定會阻擋受影響的實作。
7. **委派角色模型推薦**：這裡記錄後續監管／整合 writer 與子任務的推薦，與前面的 PlannerExecutionCheck 分開。監管／整合 writer 的推薦能力以任務所需的規劃／整合能力為基準，同級或略低一階；不把主規劃 UI 選定型號／effort 當作子任務的能力要求。每個子任務先按領域推理、上下文、工具／視覺需求、品質與返工風險篩選適任者，再比較 CP 值。高風險 migration、權限、並發或跨 repo 契約不得只因工作範圍小就降階。列首選、effort、理由、可接受替代、不可降級條件與升級條件；資訊不足就推薦能力等級，不寫死品牌或過時價格。
   - 正式委派前查當時可用模型、思考程度、工具能力和價格資料；成本假設需標來源與時間。分開記錄每個子任務的 recommended、requested、tool-accepted、observed 證據。工具不能設定模型／effort 時明示限制；工具接受設定不等於已核實底層型號。推薦不代表已啟動任務、已切換模型或已獲額外授權。
8. **分開判定完成**：plan-complete 表示全案範圍、研究、架構、依賴、風險、驗收和未決問題均可追溯；ready-to-dispatch 另要求該任務的決策已定、契約可讀、依賴及環境就緒、唯一 owner 明確、驗收可執行。下游被上游阻塞時列解除條件，不標 ready。計畫完成不等於授權實作。
## 輸出與唯一流程

按需要把產物合併在同一份文件，不為欄位數量建立多份表。大型輸出至少包含 ResearchCoverage、EvidenceLedger、Decision／ContradictionLedger、ArchitecturePlan、DAG、TaskContracts、ModelAssignmentPlan（含不阻擋研究的 PlannerExecutionCheck 配置紀錄與分開記錄的委派角色推薦）、AcceptanceMatrix、ResumePack；有未定 UI 時增加 DesignBrief，批准後記錄 DesignSpec revision／approval reference 與完整 DesignImplementationMap。輕量輸出只保留任務卡必要欄位，但 UI 任務卡仍須內嵌精簡完整映射，無須另建 DesignImplementationMap 文件。依 [Plan 範本](../large-task-orchestrator/references/plan-template.md) 與 [TaskContract](../large-task-orchestrator/references/task-contract.md) 記錄大型細節；兩者是目前過渡期的共用 canonical references，避免新舊流程維護兩套格式。

大型 execute 暫由既有 large-task-orchestrator 作為唯一整合入口；若本計畫之後交給它，附上本計畫 revision 與證據範圍，讓它核對新鮮度後沿用，不另開第二位 planner。只要求計畫時不啟動該協調流程。小任務也不因拆解有多個步驟就自動增加代理。完成後交付計畫狀態、ready／blocked 任務、未解決事項與下一個安全步驟。
