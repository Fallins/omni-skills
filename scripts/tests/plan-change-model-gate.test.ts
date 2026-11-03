import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const planChange = readFileSync(new URL('../../skills/plan-change/SKILL.md', import.meta.url), 'utf8');
const orchestrator = readFileSync(new URL('../../skills/large-task-orchestrator/SKILL.md', import.meta.url), 'utf8');
const planTemplate = readFileSync(new URL('../../skills/large-task-orchestrator/references/plan-template.md', import.meta.url), 'utf8');
const taskContract = readFileSync(new URL('../../skills/large-task-orchestrator/references/task-contract.md', import.meta.url), 'utf8');

// These are static contract checks. They do not simulate or claim model behavior.
test('large PlannerExecutionCheck precedes substantive planning research', () => {
  const gate = planChange.indexOf('### 規劃者配置閘門');
  const research = planChange.indexOf('1. **研究覆蓋**');
  assert.ok(gate >= 0 && research > gate);
  assert.match(planChange, /規劃者實際配置/);
  assert.match(planChange, /最高適任模型及該環境支援的最高思考程度/);
  assert.match(planChange, /核對目前實際模型與 effort/);
});

test('unmatched or unverifiable planner settings require notice and authorized fallback', () => {
  assert.match(planChange, /大型研究開始前告知使用者實際限制/);
  assert.match(planChange, /本次有效授權及宿主規則明確允許/);
  assert.match(planChange, /標為 provisional/);
  assert.match(planChange, /不可先由較低或未知配置完成大型 Plan/);
  assert.match(planTemplate, /unverifiable／unavailable/);
  assert.match(planTemplate, /未獲准 fallback 不開始大型 Plan/);
});

test('light planning is exempt and child recommendations are separate', () => {
  assert.match(planChange, /此檢查只適用 large/);
  assert.match(planChange, /不強制最高模型或最高思考程度/);
  assert.match(planChange, /不替代前面的 PlannerExecutionCheck/);
  assert.match(taskContract, /本節只記錄子任務／委派角色的推薦/);
  assert.match(taskContract, /不代表撰寫大型 Plan 的規劃者實際模型或 effort/);
});

test('large-task-orchestrator and shared plan references enforce the same gate', () => {
  assert.match(orchestrator, /大型 Plan 開始實質研究前/);
  assert.match(orchestrator, /PlannerExecutionCheck/);
  assert.match(orchestrator, /fallback 授權明確涵蓋派工/);
  assert.match(planTemplate, /PlannerExecutionCheck（large only，在任何實質 Plan 研究前完成）/);
  assert.match(planTemplate, /允許繼續寫 Plan 不等於允許派工/);
});
