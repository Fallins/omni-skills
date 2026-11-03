---
status: draft
activation: manual-review-required
---

# 通用技能路由規則草案

**草案，尚未生效。** 本檔是可 review 的規則提案；omni-skills 的安裝器不安裝或啟用它。規則安裝與技能安裝是不同動作，需在之後的適用層明確選擇並部署。

## 可貼入適用層的最小規則

~~~text
先辨識使用者明確意圖，將 operation_mode（read、plan-only、execute、review）與 planning_depth（none、light、large）分開判斷。只問問題就回答；只要求規劃就交付計畫後停止；只要求 review 就不修改產品。

若使用者指定模式，依指定處理；指定 light 但無法安全省略必要查核時，說明原因與範圍，不擴大需求或授權。未指定時先做最小必要查核，再選深度：
- 單一有界需求／BUG，介面穩定、影響局部且可直接驗證，預設 light。
- 同 repo 多需求／BUG 要整批排序或派工、跨 repo 介面／共同成果／多 writer，或單一工作涉及高風險遷移、權限、不可逆資料、分散狀態、難隔離並發，預設 large。
- 任務數與檔案數不是唯一標準；不為選模式先跑完整大型研究。

一次選一個有效入口，回報 RoutingDecision（operation_mode、planning_depth、selected_entry、reason、scope、known_risks、recheck_trigger），不要讓兩個 planner／coordinator 同時接管同一任務：
- plan-only 走 plan-change；只有必要時先整理 TaskBrief。
- G1 過渡期的大型 execute 走既有 large-task-orchestrator 作唯一規劃／協調入口；若已有未過期的 plan-change 產物，核對版本後沿用，不重複研究或拆解。
- light execute／review 沿用適用的使用者、公司或專案入口；不因本草案另造尚未完成的技能。

發現新的跨界依賴、共享 writer 或重大未知時，保留已完成證據並只升級受影響計畫。使用者取消、改範圍或只問進度時，依最新意圖處理並停止不再需要的舊動作。不得把大型 plan-only 變成 execute，不擴大原授權；發現必要決策或授權不足時，說清楚受阻步驟。
~~~
