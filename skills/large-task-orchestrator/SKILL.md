---
name: large-task-orchestrator
description: 大型程式任務的證據查核、可行性分析、細粒度規格拆解與多代理協作。使用者說「大型任務模式」、明確使用 $large-task-orchestrator，或要求先驗證資料與程式碼再分工時使用；單純小修正不必套用完整流程。
---

# 大型任務協作

主代理擔任 planner / integrator：掌握需求、判斷證據、設計接口、分派工作、審查與整合。子代理負責有邊界、可驗收的調查、實作或審查；不要只轉交整份需求後等待回報。

## G1 過渡期路由

- 本技能保留既有大型 execute 的單一整合入口與協調保障。只要求計畫時改走 [plan-change](../plan-change/SKILL.md) 並在計畫交付後停止。
- 大型 execute 不要同時啟動另一套 plan-change 流程。若已有 plan-change 產物，先核對其版本、來源和仍有效的決策，再沿用；若沒有，依 plan-change 的 canonical 方法完成一次規劃後，接續本技能的協調與驗收。
- 大型 execute 進入研究前，必須完成 plan-change 定義的 PlannerExecutionCheck，核對實際規劃者模型／effort。已有 Plan 時也要檢查其配置證據；缺少或不符時不可直接標 ready，依當次授權重新規劃、採 provisional fallback 或阻塞。派工需另通過 ready-to-dispatch，且 fallback 授權明確涵蓋派工。
- 本技能仍負責本地能力預檢、唯一協調 owner、writer 管理、停止／移交、審查、最終整合驗收及恢復。規劃與 TaskContract 格式共用 plan-change 使用的 [Plan 範本](references/plan-template.md) 和 [TaskContract](references/task-contract.md)，不維護第二套模板。

## 1. 啟動與能力確認

- 辨識本輪目標、範圍與授權。「大型任務模式」或 plan-only 預設只讀取、查核、提出方案；plan-only 由 plan-change 負責並在交付後停止，不進入本協調技能。使用者明確要求規劃並執行時，完成必要查核後依授權繼續，不另加重複批准關卡。具體高風險操作仍遵守有效宿主規則。
- 缺少任務內容、資料或 repo 時，先查找可用來源；只有無法從來源查明且會影響下一步時才問最小必要問題。不得把技能關鍵字當成已安裝全域觸發器。
- 開始前確認可用環境、repo／revision、讀寫權限、驗證工具、代理工具、並行限制，以及宿主能否指定模型與思考程度。遇阻明確標示。
- 大型 Plan 開始實質研究前，依 [plan-change 的 PlannerExecutionCheck](../plan-change/SKILL.md) 核對目前規劃者的實際模型與思考程度是否符合最高適任要求。若不符或不可核實，先告知並依有效授權決定 fallback 或暫停；不可先完成 Plan 再事後推薦高階模型。此閘門不套用 light。
- 子任務的模型推薦另依 plan-change 契約處理，區分推薦、使用者要求、工具接受設定與可觀察型號；不設固定模型偏好，也不聲稱已切換。
- 只有確實要委派時才確認委派所需設定。若無可用子代理、工具或名額，且使用者只要求成果並已授權，主代理可按相同 TaskContract 循序執行；如實記錄執行者與模型，不假稱獨立代理。使用者若指定必須由特定模型／子代理執行而環境無法滿足，暫停該部分並回報可用選項。
- 遇到規格、授權、驗收或跨任務契約未知時，套用 Plan 的分析確認關卡；可查核的技術事實先查，必要產品決策或權限缺口只阻擋受影響工作。

## 2. Plan 與研究的唯一來源

本技能被選作大型 execute 入口時，Plan 由本技能單一 owner 負責；在研究前先完成 plan-change 的 PlannerExecutionCheck，之後依其研究、矛盾查核、架構、DAG、TaskContract、委派角色推薦與完成門檻執行。既有 Plan 若沒有符合要求的規劃者配置證據，不得直接視為 ready；依當次授權重新規劃、標 provisional 或阻塞。provisional 計畫只有在 fallback 授權也涵蓋派工且其餘 ready-to-dispatch 條件通過時才可派工。不要把相同任務再交給另一位 planner，也不要重複已讀且仍新鮮的研究。完整計畫欄位見共用的 [Plan 範本](references/plan-template.md)。

計畫要區分 plan-complete 與 ready-to-dispatch。只要求規劃時交付前者及尚未 ready 的原因後停止；明確要求規劃並執行時，也只有通過本次分析確認關卡、授權涵蓋且依賴就緒的任務才可進入執行。完整 TaskContract 欄位見共用的 [TaskContract](references/task-contract.md)。

## 3. 分工與 TaskContract

所有子任務使用共用 TaskContract，先固定跨任務資料契約與 ownership，再建立 dependency DAG。每個檔案或修改區域同時只有一位 writer；共用 schema、路由表、設定、lockfile 和生成碼要指定單一 owner 或序列化修改。不同 worktree 不代表語意上沒有衝突。

派工前核對 ready-to-dispatch：材料可讀、接口已定、依賴和環境就緒、owner 清楚、驗證方式具體，且沒有阻擋本任務的未決產品／授權選擇。未滿足就補 Plan 或標 blocked，不把「去自己研究」當作實作提示。

## 4. 執行、審查與整合

只有在使用者的任務授權涵蓋執行、本任務的分析確認關卡已通過、前置依賴已就緒時，才啟動實作；實際委派另須確認模型設定。主代理循序執行沿用相同合約、台帳與驗收要求。

每個實作切片可沿用 [implement-change](../implement-change/SKILL.md) 的新功能／BUG／重構及設計到程式 playbook；驗證沿用 [verify-change](../verify-change/SKILL.md) 並保存 VerificationReceipt；規格符合與程式風險審查沿用 [review-change](../review-change/SKILL.md)。[coordinate-work](../coordinate-work/SKILL.md) 是可重用的生命週期方法，不是第二個整案協調入口：本技能仍是唯一 coordinator，保留停止／移交、writer ownership、review 排程與主代理最終整合驗收，不再啟動重複 DAG、任務台帳或派工流程。設計批准後回 Plan 更新 DesignImplementationMap 與 TaskContract，再按版次實作；不得略過使用者審核直接從原型寫程式。

1. 每次分派給子代理完整 task contract、必要來源與 repo 指引、base revision、相關使用者指示，以及回報格式；不要假設它能看到父代理對話。主代理持續維護唯一任務台帳與 ownership 表。
2. 子代理只修改自己負責範圍。發現接口不成立、需要越界寫入或依賴改變時，停止受影響寫入並回報，不能自行擴張範圍。合約改版、取消或更換 owner 時，由主代理依序執行：
   - 列出受影響 writer 與下游，停止新派工與成果整合，要求停筆；必要時使用宿主提供的中斷機制。
   - 核對代理及其已啟動工具／背景程序已停止寫入，保存現有 diff、產物與最後使用的合約版本。送出訊息、收到中斷回覆或超時都不等於工具已停止；無法確認時維持 blocked，不派替代 writer 寫同一範圍，也不清空既有修改。
   - 確認停筆後，依分析確認關卡處理新決策，再發布新版合約與 DAG、移交 ownership。新舊版本與受影響驗收保持可追溯。
   - 執行者確認新版與自身範圍後，重新通過 ready-to-dispatch 才恢復。晚到的舊版成果先標 stale，經新版 spec 與相關回歸核對後才可採用；不得直接整合。
3. 收到成果先檢查 spec compliance，再做 code-quality review。審查盡量由未實作該修改的代理分開兩輪完成；若無此能力，由主代理分兩輪審查並揭露限制。主代理若也參與實作，標明 self-review，不能稱為獨立審查；使用者要求獨立審查時，缺口仍待滿足或由使用者明確調整要求。測試證據與實際 diff 優先於子代理自述。
4. 主代理處理整合與衝突，檢查 shared interfaces、migration、設定與生成產物的一致性。所有子任務完成後，主代理必須親自重新做完整最終驗收：逐項核對原始需求、實際 diff、可觀察行為、邊界／錯誤情境及整合結果，並在最後合併狀態執行相關 integration / regression tests；分支各自通過、子代理自行驗收或外部審查報告都不能取代這一步。主代理也實作時如實標明，不能宣稱驗收者獨立於實作者。需要時補上 build、typecheck、lint 或端到端檢查。無法執行的驗證明列缺口，不宣稱完整驗收通過。
5. 執行失敗採有界重試：記錄原因與下一次有何不同。沒有新證據不重複相同失敗；達到任務約定的重試／時間界限，或遇到權限、模型、破壞性操作阻礙時停止受影響步驟並回報。未確認結果前先查狀態，不重複可能已成功的操作。

## 5. 完成或接續

- 只有需求映射、兩輪審查及主代理完整最終驗收都有可檢查的結果，才宣稱相應範圍完成。明列未完成、未測試、已知風險與需要使用者決策的事項；blocked / partial 不能改稱 done。
- commit、build 或測試通過不是部署證據。若本輪包含部署，另核實授權目標環境的實際版本與行為；沒有證據時只報告程式碼／測試狀態。
- 中斷、上下文不足或計畫變更時，更新 plan 中的 resume context pack：目標與授權、版本、已完成成果、正在執行的 owner／狀態、尚未解決的決策及下一個安全動作。恢復時先核對真實工作樹、代理與測試狀態，不以舊摘要直接重做或覆寫他人的變更。
- 計畫交付包含查核結論、矛盾與風險、DAG 與 task contracts；執行交付另外包含變更摘要、實際測試證據及剩餘事項。規劃完成與實作完成分開報告。
