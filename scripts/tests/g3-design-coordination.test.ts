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
const verify = read('../../skills/verify-change/SKILL.md');
const review = read('../../skills/review-change/SKILL.md');
const completion = read('../../docs/contracts/completion-decision.md');
const planTemplate = read('../../skills/large-task-orchestrator/references/plan-template.md');
const adapter = read('../../docs/examples/synthetic-company-adapter.md');
const readmeZh = read('../../README.md');
const readmeEn = read('../../README.en.md');

// Static contracts and isolated synthetic transition fixtures only. These tests do not invoke an agent,
// browser, product app, accessibility checker, or real user study, and cannot establish model behavior.
test('design flow requires explicit revision approval and returns to Plan before implementation', () => {
  assert.match(designContract, /DesignBrief/);
  assert.match(designContract, /DesignSpec/);
  assert.match(designContract, /DesignImplementationMap/);
  assert.match(designContract, /do not require a separate document/);
  assert.match(designContract, /real user decision reference/);
  assert.match(designContract, /silence/);
  assert.match(designer, /approve or request changes to the exact revision/i);
  assert.match(designer, /return to Plan/i);
  assert.match(planner, /design-interface/);
  assert.match(planner, /小型 UI 變更若已有精確批准設計，引用 DesignSpec revision／實際使用者決定/);
  assert.match(planner, /不強制另建 DesignImplementationMap 文件/);
  assert.match(planner, /返回本 Plan 建立／更新實作映射/);
  assert.match(implementer, /Plan 的任務卡（large 時為 TaskContract）引用使用者明確批准的 DesignSpec revision/);
  assert.match(implementer, /light 不必另建映射文件/);
  assert.match(designToCode, /approval/);
  assert.match(designToCode, /light work, a concise inline task-card map \(no separate document required\)/);
  assert.match(designToCode, /large work, the complete DesignImplementationMap/);
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

function implementationGate({ spec, plan, mode }) {
  if (spec.status !== 'approved' || !spec.approval_ref) throw new Error('approval-required');
  const map = mode === 'light' ? plan.task_card?.design_mapping : plan.design_implementation_map;
  if (!map) throw new Error('mapping-required');
  if (mode === 'light' && map.location !== 'task-card') throw new Error('inline-map-required');
  if (mode === 'large' && map.coverage !== 'complete') throw new Error('complete-map-required');
  if (plan.design_revision !== spec.revision || map.design_revision !== spec.revision || map.approval_ref !== spec.approval_ref) throw new Error('revision-mismatch');
  const mapped = new Map(map.entries.map((entry) => [entry.screen_state, entry]));
  for (const screenState of spec.required_screen_states) {
    const entry = mapped.get(screenState);
    if (!entry) throw new Error(`unmapped:${screenState}`);
    if (!entry.interaction || !entry.implementation_location || !entry.ux_acceptance || !entry.layout_acceptance || !entry.verification) {
      throw new Error(`incomplete-entry:${screenState}`);
    }
    if (mode === 'large' && (!entry.owner || !entry.data_api || !entry.integration_task)) {
      throw new Error(`incomplete-large-entry:${screenState}`);
    }
  }
  return 'ready';
}

const approvedFixture = (mode = 'light') => {
  const entries = ['form:empty', 'form:error', 'form:success'].map((screen_state) => ({
    screen_state,
    interaction: `interaction-${screen_state}`,
    implementation_location: 'src/FormPanel.tsx',
    ux_acceptance: `ux-${screen_state}`,
    layout_acceptance: `layout-${screen_state}`,
    verification: `verify-${screen_state}`,
    owner: 'T-form',
    data_api: 'FormViewModel',
    integration_task: 'T-integrate',
  }));
  const mapping = {
    design_revision: 'design-r3',
    approval_ref: 'decision-fixture-7',
    location: mode === 'light' ? 'task-card' : 'plan',
    coverage: mode === 'large' ? 'complete' : 'scoped',
    entries,
  };
  const plan = { design_revision: 'design-r3' };
  if (mode === 'light') plan.task_card = { design_mapping: mapping };
  else plan.design_implementation_map = mapping;
  return {
    spec: { status: 'approved', revision: 'design-r3', approval_ref: 'decision-fixture-7', required_screen_states: ['form:empty', 'form:error', 'form:success'] },
    plan,
    mode,
  };
};

test('synthetic handoff allows inline light mapping and requires a complete large map without gaps', () => {
  const light = approvedFixture('light');
  assert.equal('design_implementation_map' in light.plan, false);
  assert.equal(implementationGate(light), 'ready');

  const large = approvedFixture('large');
  assert.equal(implementationGate(large), 'ready');

  const incompleteLarge = approvedFixture('large');
  incompleteLarge.plan.design_implementation_map.coverage = 'scoped';
  assert.throws(() => implementationGate(incompleteLarge), /complete-map-required/);

  const missingMapping = approvedFixture('light');
  delete missingMapping.plan.task_card.design_mapping;
  assert.throws(() => implementationGate(missingMapping), /mapping-required/);

  const unapproved = approvedFixture('light');
  unapproved.spec.status = 'awaiting-review';
  unapproved.spec.approval_ref = '';
  assert.throws(() => implementationGate(unapproved), /approval-required/);

  const stale = approvedFixture('light');
  stale.plan.design_revision = 'design-r2';
  assert.throws(() => implementationGate(stale), /revision-mismatch/);

  const incomplete = approvedFixture('light');
  incomplete.plan.task_card.design_mapping.entries.pop();
  assert.throws(() => implementationGate(incomplete), /unmapped:form:success/);

  const missingAcceptance = approvedFixture('light');
  missingAcceptance.plan.task_card.design_mapping.entries[0].layout_acceptance = '';
  assert.throws(() => implementationGate(missingAcceptance), /incomplete-entry:form:empty/);

  const missingInteraction = approvedFixture('light');
  missingInteraction.plan.task_card.design_mapping.entries[1].interaction = '';
  assert.throws(() => implementationGate(missingInteraction), /incomplete-entry:form:error/);

  const missingImplementation = approvedFixture('light');
  missingImplementation.plan.task_card.design_mapping.entries[2].implementation_location = '';
  assert.throws(() => implementationGate(missingImplementation), /incomplete-entry:form:success/);

  const incompleteLargeEntry = approvedFixture('large');
  delete incompleteLargeEntry.plan.design_implementation_map.entries[0].owner;
  assert.throws(() => implementationGate(incompleteLargeEntry), /incomplete-large-entry:form:empty/);
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
  assert.match(coordinator, /in-flight I\/O is drained/);
  assert.match(coordinator, /coordinator is accountable for final whole-scope acceptance/);
  assert.match(coordinator, /does not require personally rerunning all tests/);
  assert.doesNotMatch(coordinator, /personally performs final whole-scope acceptance/);
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

test('acceptance and review contracts preserve coverage, applicable evidence, and required gates', () => {
  assert.match(lto, /逐項確認全部必要需求/);
  assert.match(lto, /缺失證據與新增整合風險補驗/);
  assert.match(lto, /不要求主代理親自重跑全部/);
  assert.match(lto, /要求獨立審查時必須滿足/);
  assert.doesNotMatch(lto, /必須親自重新做完整最終驗收|兩輪審查及主代理完整最終驗收/);
  assert.match(verify, /跨 revision 不自動沿用/);
  assert.match(verify, /具體 diff 與依賴影響分析/);
  assert.match(verify, /不以 mock 或較弱測試替代/);
  assert.match(review, /一份報告涵蓋兩軸/);
  assert.match(review, /明確要求獨立審查時仍須滿足/);
  assert.match(completion, /必要 gate 不降級/);
  assert.match(planTemplate, /必要驗證無法執行就保留 blocked／not-run/);
});

// Illustrative acceptance decisions; these fixtures test the stated rules, not actual agent behavior.
function acceptanceDecision({ required, receipts, revision, artifact, environment, independentRequired, independentDone }) {
  const missing = required.filter((id) => !receipts.some((r) =>
    r.id === id && r.passed && r.environment === environment &&
    (r.revision === revision || (artifact && r.artifact === artifact) || r.unaffectedByDocumentedDiff === true)));
  return { missing, complete: missing.length === 0 && (!independentRequired || independentDone) };
}

test('synthetic decisions reuse applicable evidence but block missing acceptance, integration and independent review', () => {
  const input = { required: ['unit', 'integration'], revision: 'r2', artifact: 'build2', environment: 'real', independentRequired: false, independentDone: false,
    receipts: [{ id: 'unit', revision: 'r2', environment: 'real', passed: true }, { id: 'integration', revision: 'r2', environment: 'real', passed: true }] };
  assert.deepEqual(acceptanceDecision(input), { missing: [], complete: true });
  assert.deepEqual(acceptanceDecision({ ...input, receipts: input.receipts.slice(0, 1) }), { missing: ['integration'], complete: false });
  assert.equal(acceptanceDecision({ ...input, required: [...input.required, 'new-integration-risk'] }).complete, false);
  assert.equal(acceptanceDecision({ ...input, independentRequired: true }).complete, false);
  assert.equal(acceptanceDecision({ ...input, independentRequired: true, independentDone: true }).complete, true);
  assert.equal(acceptanceDecision({ ...input, receipts: input.receipts.map((r) => ({ ...r, revision: 'r1' })) }).complete, false);
  assert.equal(acceptanceDecision({ ...input, receipts: input.receipts.map((r) => ({ ...r, revision: 'r1', unaffectedByDocumentedDiff: true })) }).complete, true);
  assert.equal(acceptanceDecision({ ...input, receipts: input.receipts.map((r) => ({ ...r, environment: 'mock' })) }).complete, false);
});
