import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const designContract = read('../../docs/contracts/design-workflow.md');
const designer = read('../../skills/design-interface/SKILL.md');
const journeyChecklist = read('../../skills/design-interface/references/journey-layout-checklist.md');
const implementer = read('../../skills/implement-change/SKILL.md');
const designToCode = read('../../skills/implement-change/references/design-to-code.md');
const planner = read('../../skills/plan-change/SKILL.md');
const coordinator = read('../../skills/coordinate-work/SKILL.md');
const lifecycle = read('../../skills/coordinate-work/references/coordination-lifecycle.md');
const lto = read('../../skills/large-task-orchestrator/SKILL.md');
const adapter = read('../../docs/examples/synthetic-company-adapter.md');
const readmeZh = read('../../README.md');
const readmeEn = read('../../README.en.md');

// Static contracts and isolated synthetic transition fixtures only. These tests do not invoke an agent,
// browser, product app, accessibility checker, or real user study, and cannot establish model behavior.
test('design flow requires explicit revision approval and returns to Plan before implementation', () => {
  assert.match(designContract, /DesignBrief/);
  assert.match(designContract, /DesignSpec/);
  assert.match(designContract, /DesignImplementationMap/);
  assert.match(designContract, /real user decision reference/);
  assert.match(designContract, /silence/);
  assert.match(designer, /approve or request changes to the exact revision/i);
  assert.match(designer, /return to Plan/i);
  assert.match(planner, /design-interface/);
  assert.match(planner, /小型 UI 變更若已有精確批准設計，引用 revision／decision/);
  assert.match(planner, /返回本 Plan 建立／更新 DesignImplementationMap/);
  assert.match(implementer, /使用者明確批准的 DesignSpec revision/);
  assert.match(designToCode, /approval/);
  assert.match(readmeZh, /Plan → design-interface → 使用者審核/);
  assert.match(readmeEn, /Plan → design-interface → user review/);
  assert.match(adapter, /使用者審核 → 返回 Plan 更新 map／TaskContract/);
});

test('design acceptance covers journey, recovery, geometry, responsive content, and separate evidence', () => {
  for (const text of [designContract, designer, journeyChecklist, designToCode]) {
    assert.match(text, /UXAcceptance/);
    assert.match(text, /LayoutAcceptance/);
    assert.match(text, /narrow/i);
    assert.match(text, /long|unbreakable/i);
  }
  for (const text of [designContract, designer, journeyChecklist, designToCode]) {
    assert.match(text, /back|返回/i);
    assert.match(text, /cancel|取消/i);
    assert.match(text, /retry|重試/i);
  }
  assert.match(designContract, /container max width/);
  assert.match(designContract, /between-section spacing/);
  assert.match(designContract, /column gaps/);
  assert.match(journeyChecklist, /screenshot|screenshots/i);
  assert.match(journeyChecklist, /measurements/i);
  assert.match(designer, /real-user/i);
});

function implementationGate({ spec, plan, map }) {
  if (spec.status !== 'approved' || !spec.approval_ref) throw new Error('approval-required');
  if (plan.design_revision !== spec.revision || map.design_revision !== spec.revision) throw new Error('revision-mismatch');
  const mapped = new Set(map.entries.map((entry) => entry.screen_state));
  for (const screenState of spec.required_screen_states) {
    if (!mapped.has(screenState)) throw new Error(`unmapped:${screenState}`);
  }
  if (!map.ux_acceptance_ref || !map.layout_acceptance_ref) throw new Error('acceptance-map-required');
  return 'ready';
}

const approvedFixture = () => ({
  spec: { status: 'approved', revision: 'design-r3', approval_ref: 'decision-fixture-7', required_screen_states: ['form:empty', 'form:error', 'form:success'] },
  plan: { design_revision: 'design-r3' },
  map: {
    design_revision: 'design-r3',
    entries: ['form:empty', 'form:error', 'form:success'].map((screen_state) => ({ screen_state, component: `native-${screen_state}` })),
    ux_acceptance_ref: 'ux-fixture-v1',
    layout_acceptance_ref: 'layout-fixture-v1',
  },
});

test('synthetic design handoff blocks missing approval, stale revisions, and unmapped states', () => {
  const complete = approvedFixture();
  assert.equal(implementationGate(complete), 'ready');

  const unapproved = approvedFixture();
  unapproved.spec.status = 'awaiting-review';
  unapproved.spec.approval_ref = '';
  assert.throws(() => implementationGate(unapproved), /approval-required/);

  const stale = approvedFixture();
  stale.plan.design_revision = 'design-r2';
  assert.throws(() => implementationGate(stale), /revision-mismatch/);

  const incomplete = approvedFixture();
  incomplete.map.entries.pop();
  assert.throws(() => implementationGate(incomplete), /unmapped:form:success/);
});

function mayTransferWriter({ stopConfirmed, inFlightIO }) {
  return stopConfirmed === true && inFlightIO === 0;
}

function assertExclusiveResourceWriters(tasks) {
  const byResource = new Map();
  for (const task of tasks) {
    for (const resource of task.resources) {
      const previous = byResource.get(resource);
      if (previous && !task.serialized_after?.includes(previous)) throw new Error(`resource-conflict:${resource}`);
      byResource.set(resource, task.id);
    }
  }
}

function resolveCoordinator(activeCoordinator, requestedCoordinator) {
  return activeCoordinator || requestedCoordinator || null;
}

function finalAcceptanceReady({ activeCoordinator, integratedRevision, acceptedRevision, acceptanceRef, allTasksComplete }) {
  return Boolean(activeCoordinator && integratedRevision === acceptedRevision && acceptanceRef && allTasksComplete);
}

test('coordinate-work preserves a single owner, confirmed stop, and final integrated acceptance', () => {
  assert.match(coordinator, /If `large-task-orchestrator` \(LTO\) is active, LTO remains the only coordinator/);
  assert.match(coordinator, /confirmed stopped/);
  assert.match(coordinator, /in-flight I\/O has ended/);
  assert.match(coordinator, /personally performs final whole-scope acceptance/);
  assert.match(lifecycle, /one source of truth/);
  assert.match(lifecycle, /stop cannot be confirmed/);
  assert.match(lifecycle, /final integrated revision/);
  assert.match(lto, /本技能仍是唯一 coordinator/);
  assert.match(lto, /主代理最終整合驗收/);
  assert.match(readmeZh, /coordinate-work 僅提供可重用協調方法/);
  assert.match(readmeEn, /reusable method/);
  assert.match(adapter, /coordinate-work 只供引用/);

  assert.equal(resolveCoordinator('LTO', 'coordinate-work'), 'LTO');
  assert.equal(resolveCoordinator(null, 'coordinate-work'), 'coordinate-work');

  assert.equal(mayTransferWriter({ stopConfirmed: false, inFlightIO: 0 }), false);
  assert.equal(mayTransferWriter({ stopConfirmed: true, inFlightIO: 1 }), false);
  assert.equal(mayTransferWriter({ stopConfirmed: true, inFlightIO: 0 }), true);

  assert.throws(() => assertExclusiveResourceWriters([
    { id: 'T1', resources: ['shared-db'] },
    { id: 'T2', resources: ['shared-db'] },
  ]), /resource-conflict:shared-db/);
  assert.doesNotThrow(() => assertExclusiveResourceWriters([
    { id: 'T1', resources: ['shared-db'] },
    { id: 'T2', resources: ['shared-db'], serialized_after: ['T1'] },
  ]));

  assert.equal(finalAcceptanceReady({ activeCoordinator: 'LTO', integratedRevision: 'merge-r2', acceptedRevision: 'merge-r2', acceptanceRef: 'acceptance-v2', allTasksComplete: false }), false);
  assert.equal(finalAcceptanceReady({ activeCoordinator: 'LTO', integratedRevision: 'merge-r2', acceptedRevision: 'merge-r1', acceptanceRef: 'acceptance-v2', allTasksComplete: true }), false);
  assert.equal(finalAcceptanceReady({ activeCoordinator: 'LTO', integratedRevision: 'merge-r2', acceptedRevision: 'merge-r2', acceptanceRef: 'acceptance-v2', allTasksComplete: true }), true);
});
