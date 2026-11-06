import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const planChange = readFileSync(new URL('../../skills/plan-change/SKILL.md', import.meta.url), 'utf8');
const orchestrator = readFileSync(new URL('../../skills/large-task-orchestrator/SKILL.md', import.meta.url), 'utf8');
const planTemplate = readFileSync(new URL('../../skills/large-task-orchestrator/references/plan-template.md', import.meta.url), 'utf8');
const taskContract = readFileSync(new URL('../../skills/large-task-orchestrator/references/task-contract.md', import.meta.url), 'utf8');
const documents = [planChange, orchestrator, planTemplate, taskContract];

// These are static contract checks. They do not simulate or claim model behavior.
test('large PlannerExecutionCheck records the current UI selection without a startup gate', () => {
  assert.match(planChange, /主規劃 agent 直接沿用使用者在目前 session UI 選定的模型與 effort/);
  assert.match(planChange, /不自動切換、升級或降級/);
  assert.match(planChange, /不是最高配置檢查，也不是大型研究的開始條件/);
  assert.match(planTemplate, /PlannerExecutionCheck（large only，配置紀錄，不阻擋研究）/);
});

test('the main planner does not request exact settings, ceilings or separate Ultra permission', () => {
  for (const document of [planChange, orchestrator, planTemplate]) {
    assert.match(document, /不[^。\n]*詢問精確型號、可用上限或 Ultra 額外許可/);
  }
  assert.match(planChange, /使用者選定 Ultra 時也直接沿用，不為該選項另取許可/);
  assert.match(planChange, /可用上限無須另查/);
  assert.match(planChange, /不要求主規劃者達到最高適任模型或最高思考程度/);
});

test('unobservable main settings remain unknown and do not require fallback or provisional plans', () => {
  assert.match(planChange, /不可觀測，記為 unknown／not observable/);
  assert.match(planChange, /不可觀測不阻擋已授權的研究或計畫，不要求 fallback，也不因此將計畫標為 provisional/);
  assert.match(orchestrator, /不可觀測就記 unknown／not observable 並繼續已授權工作，不要求 fallback/);
  assert.match(planTemplate, /不可觀測時記 unknown／not observable/);
  assert.match(taskContract, /不因不可觀測而阻擋研究/);
});

test('optional current-session evidence stays scoped and is not provider-side execution proof', () => {
  assert.match(planChange, /宿主已提供.*可觀察值時，可記錄 selected model／effort、來源與觀察時間/);
  assert.match(planChange, /使用者主動提供同一 session 的 UI 顯示值/);
  assert.match(planChange, /不代表已獨立驗證服務端實際執行型號/);
  assert.match(planChange, /提示詞、技能文字、設定檔預設值、舊 session、子任務推薦或工具接受設定，不可冒充/);
  assert.match(planChange, /無資料時如實保留 unknown，不要求使用者補證/);
  assert.match(planTemplate, /UI evidence source/);
  assert.match(planTemplate, /active session/);
  assert.match(planTemplate, /observed at/);
  assert.match(planTemplate, /不是 provider-side execution 證明/);
});

test('UI selection does not authorize extra tasks or replace delegation confirmations', () => {
  assert.match(planChange, /不替代後續子任務的模型選擇與確認，也不授權另行啟動或委派任務/);
  assert.match(planChange, /實際委派仍依本次使用者授權與宿主規則確認所需模型設定及必要許可/);
  assert.match(orchestrator, /實際委派前仍依本次使用者授權與宿主規則確認模型／effort、執行範圍及必要許可/);
  assert.match(taskContract, /正式委派仍依本次使用者授權與宿主規則確認所需設定及必要許可/);
  assert.match(planTemplate, /未回覆不視為同意/);
});

test('child model selection retains suitability, cost and evidence rules independently of the main UI model', () => {
  assert.match(planChange, /先按領域推理、上下文、工具／視覺需求、品質與返工風險篩選適任者，再比較 CP 值/);
  assert.match(planChange, /高風險 migration、權限、並發或跨 repo 契約不得只因工作範圍小就降階/);
  assert.match(planChange, /正式委派前查當時可用模型、思考程度、工具能力和價格資料/);
  assert.match(taskContract, /本節只記錄子任務／委派角色的推薦/);
  assert.match(taskContract, /不代表撰寫大型 Plan 的規劃者實際模型或 effort/);
  assert.match(taskContract, /以任務所需的規劃／整合能力為基準/);
  assert.match(taskContract, /不以主規劃 UI 選定型號／effort 代替能力需求/);
  for (const field of ['recommended', 'requested', 'tool-accepted', 'observed']) {
    assert.ok(taskContract.includes(field));
  }
});

test('existing plans are not invalidated solely by missing main-model evidence', () => {
  assert.match(planChange, /既有 Plan 不因缺少模型／effort 或上限證據而需要重寫、補授權或失去 ready 狀態/);
  assert.match(orchestrator, /不因缺少主規劃配置證據而失去 ready 狀態/);
  assert.match(planTemplate, /既有 Plan 不因缺少此配置證據而需要重規劃或失去 ready 狀態/);
  assert.match(orchestrator, /既有 Plan 依範圍、證據新鮮度、契約、依賴與驗收核對/);
  assert.match(planTemplate, /恢復委派工作時依使用者要求與宿主規則核對所需設定、必要許可/);
  assert.match(planTemplate, /主規劃 session 仍直接沿用目前 UI 選定值，不因配置不可觀測而要求補證或阻擋研究/);
});

test('planning records do not expand plan-only or dispatch authorization', () => {
  assert.match(planChange, /只要求 plan-only 時仍在交付計畫後停止/);
  assert.match(planChange, /計畫完成不等於授權實作/);
  assert.match(orchestrator, /派工另須通過 ready-to-dispatch 及必要授權/);
  assert.match(planTemplate, /也不擴大 plan-only／execute 範圍/);
});

test('no shared reference reintroduces the removed maximum-configuration or fallback gate', () => {
  for (const document of documents) {
    assert.doesNotMatch(document, /最高適任模型及該環境支援的最高思考程度|unverifiable／unavailable/);
    assert.doesNotMatch(document, /未獲准 fallback 不開始|若未取得明確 fallback 授權即暫停|fallback 授權明確涵蓋派工/);
    assert.doesNotMatch(document, /PlannerExecutionCheck 的 required capability|規劃者配置須另.*研究前核實/);
    assert.doesNotMatch(document, /沒有明確同意、未回覆或授權範圍含糊時，暫停且不開始研究/);
  }
});

test('light planning stays exempt from the large configuration record', () => {
  assert.match(planChange, /此紀錄只適用 large/);
  assert.match(planChange, /Light.*不強制最高模型或最高思考程度/);
  assert.match(planTemplate, /Light 標 not applicable/);
});

test('selectable hosts prefer a capable lower-cost model for bounded implementation', () => {
  for (const document of [planChange, orchestrator, planTemplate, taskContract]) {
    assert.match(document, /需求明確、範圍可界定、驗收具體/);
    assert.match(document, /能力足夠且成本較低|能力足夠、成本較低/);
    assert.match(document, /有條件的預設/);
  }
  assert.match(planChange, /主動評估並優先考慮能力足夠且成本較低的模型，或適當的較低思考程度/);
  assert.match(planChange, /不是強制所有實作降階/);
  assert.match(orchestrator, /先考量適任、工具能力與完成品質，再比較成本與返工風險/);
  assert.match(taskContract, /先看適任、工具能力與完成品質，再比較成本與返工風險/);
});

test('high-risk work is not downgraded because the slice looks small', () => {
  for (const document of [planChange, orchestrator, planTemplate, taskContract]) {
    assert.match(document, /權限、資料安全、migration、並發、跨 repo 契約、重要架構或高度不確定/);
    assert.match(document, /不得只因任務看起來小就降階|不得只因看起來小就降階|不得只因範圍小就降階/);
    assert.match(document, /較低階模型不保證便宜/);
    assert.match(document, /不寫死模型品牌、等級或價格排名|不寫死品牌、等級或價格排名/);
  }
});

test('delegation without model selection does not claim a cost reduction', () => {
  for (const document of [planChange, orchestrator]) {
    assert.match(document, /可派子代理但不能指定模型或思考程度/);
    assert.match(document, /不宣稱成本已降低/);
    assert.match(document, /可能繼承或使用的設定/);
  }
  assert.match(planTemplate, /情境 B 不宣稱成本已降低/);
  assert.match(taskContract, /情境 B 不宣稱成本已降低/);
});

test('missing subagents stay on the main agent without skipping verification', () => {
  for (const document of [planChange, orchestrator]) {
    assert.match(document, /沒有可用子代理，或工具／名額不足/);
    assert.match(document, /由目前主代理按相同(任務範圍| TaskContract 與任務範圍)循序完成/);
    assert.match(document, /無法採用模型分工/);
    assert.match(document, /不因此擴大權限、略過驗證或宣稱獨立審查/);
  }
  assert.match(planTemplate, /C 沒有可用子代理而由主代理循序完成/);
  assert.match(taskContract, /情境 C 由主代理循序完成/);
});

test('required model or independent review is not claimed when the host cannot provide it', () => {
  for (const document of [planChange, orchestrator]) {
    assert.match(document, /特定模型訂為必要條件而無法達成時，暫停受影響部分並回報/);
    assert.match(document, /明確要求必須委派或指定執行者而無法滿足時，停下受影響部分並回報/);
  }
  assert.match(planChange, /要求獨立審查而無法滿足時，保留缺口，不假稱已滿足/);
  assert.match(orchestrator, /不能僅以模型階級推定審查品質或獨立性/);
  assert.match(orchestrator, /要求獨立審查時必須滿足，否則保留缺口，不得自行放寬或假稱已滿足/);
  assert.match(taskContract, /不能僅以模型階級推定審查品質或獨立性/);
  assert.match(taskContract, /self-review/);
  assert.match(taskContract, /要求獨立審查而無法滿足時，不假稱已滿足/);
});

test('accepted tool settings are not observed execution, price, or a successful launch', () => {
  for (const document of [planChange, orchestrator, planTemplate]) {
    assert.match(document, /能建立任務但無法確認實際模型、價格或是否成功啟動/);
    assert.match(document, /不憑預設值或 tool-accepted 宣稱成功/);
    assert.match(document, /不重複啟動可能已成功的任務/);
    assert.match(document, /不編造節省/);
  }
  assert.match(taskContract, /情境 D 的 tool-accepted 不是 observed/);
  assert.match(taskContract, /成本未知不編造節省/);
  assert.match(planTemplate, /tool-accepted 不是 observed/);
});

test('model recommendations do not authorize extra work and light tasks are not forced to delegate', () => {
  assert.match(planChange, /推薦不代表已啟動任務、已切換模型、已降低成本或已獲額外額度、外部任務或其他動作的授權/);
  assert.match(planChange, /不為每次能力檢查另設重複確認關卡/);
  assert.match(planChange, /小任務不因本節強制開子代理或升級成 large/);
  assert.match(planChange, /模型分工不要求 light 開子代理或改成 large/);
  assert.match(orchestrator, /不因模型分工把小型工作升級成大型任務/);
  assert.match(orchestrator, /推薦不是取得額外額度、啟動外部任務或其他動作的授權/);
  assert.match(planChange, /先說明問題並保存成果/);
  assert.match(planChange, /可升級模型、調整拆分，或交回主代理/);
  assert.match(orchestrator, /沒有新證據不重複相同失敗/);
  assert.match(orchestrator, /不把同一低價嘗試無限重跑/);
});
