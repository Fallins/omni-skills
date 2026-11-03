import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const understand = read('../../skills/understand-task/SKILL.md');
const planner = read('../../skills/plan-change/SKILL.md');
const implementer = read('../../skills/implement-change/SKILL.md');
const verifier = read('../../skills/verify-change/SKILL.md');
const reviewer = read('../../skills/review-change/SKILL.md');
const coordinator = read('../../skills/coordinate-work/SKILL.md');
const lifecycle = read('../../skills/coordinate-work/references/coordination-lifecycle.md');
const orchestrator = read('../../skills/large-task-orchestrator/SKILL.md');
const adapter = read('../../docs/examples/synthetic-company-adapter.md');
const completion = read('../../docs/contracts/completion-decision.md');

// Static contract checks and deterministic synthetic fixtures only. These do not run a model,
// company system, browser, production process, PostgreSQL service, or physical NAS.

function validateLightCard(card) {
  const required = ['goal', 'success', 'scope', 'invariants', 'verification', 'risk'];
  for (const key of required) {
    if (!card[key]) throw new Error(`missing-light-card:${key}`);
  }
  if (card.mode !== 'light') throw new Error('light-mode-required');
  return 'ready';
}

function validateSmallBugCard(card) {
  if (!card.failureEvidence) throw new Error('bug-failure-evidence-required');
  if (!card.rerunPath) throw new Error('bug-rerun-path-required');
  return validateLightCard(card);
}

function runLightFlow({ card, implementation, verification, review }) {
  if (card.kind === 'bug') validateSmallBugCard(card);
  else validateLightCard(card);
  if (implementation.contract_revision !== card.revision) throw new Error('implementation-contract-mismatch');
  if (verification.revision !== card.revision || verification.status !== 'passed') throw new Error('verification-not-passed');
  if (review.revision !== card.revision || review.status !== 'accepted') throw new Error('review-not-accepted');
  return 'complete';
}

function composeSyntheticAdapter(methods, rules) {
  if (rules !== 'external') throw new Error('adapter-cannot-override-external-rules');
  if (new Set(methods).size !== methods.length) throw new Error('duplicate-stage');
  if (!methods.includes('large-task-orchestrator') && methods.includes('coordinate-work')) {
    return { methods, coordinator: 'coordinate-work' };
  }
  return {
    methods,
    coordinator: methods.includes('large-task-orchestrator') ? 'large-task-orchestrator' : 'adapter-owner',
  };
}

function mayTransferReaderWriter({ processStopped, inFlightIO, leaseState }) {
  return processStopped === true && inFlightIO === 0 && ['released', 'expired'].includes(leaseState);
}

const readerAcceptance = [
  'process-lifecycle',
  'io-drained',
  'lease-released-or-expired',
  'idempotent-recovery',
  'rollback',
  'isolated-db',
  'required-nas',
];

function readerAcceptanceStatus(checks) {
  const missing = readerAcceptance.filter((gate) => checks[gate] !== 'passed');
  return missing.length ? { status: 'blocked', missing } : { status: 'complete', missing: [] };
}

test('light personal feature and BUG flows retain compact cards and required verification', () => {
  assert.match(understand, /目標使用者與情境/);
  assert.match(planner, /\*\*light\*\*/);
  assert.match(planner, /此檢查只適用 large/);
  assert.match(planner, /不強制最高模型或最高思考程度/);
  assert.match(planner, /BUG 計畫包含可取得的修復前失敗證據/);
  assert.match(implementer, /輕量工作保留足以避免猜測的短任務卡/);
  assert.match(verifier, /每項標記 `passed`、`failed`、`blocked` 或 `not-run`/);
  assert.match(reviewer, /固定 base\/head revision/);

  const feature = {
    kind: 'feature', mode: 'light', revision: 'personal-feature-r1', goal: 'show item count',
    success: 'count matches saved items', scope: 'one view', invariants: 'no data mutation',
    verification: 'run existing isolated unit entry', risk: 'bounded',
  };
  assert.equal(validateLightCard(feature), 'ready');
  assert.equal(runLightFlow({
    card: feature,
    implementation: { contract_revision: feature.revision },
    verification: { revision: feature.revision, status: 'passed' },
    review: { revision: feature.revision, status: 'accepted' },
  }), 'complete');
  assert.equal('dag' in feature, false);
  assert.equal('planner_execution_check' in feature, false);

  const bug = {
    ...feature, kind: 'bug', revision: 'personal-bug-r1', goal: 'fix stale badge after refresh',
    failureEvidence: 'isolated fixture: refresh leaves old badge',
    rerunPath: 'repeat the same refresh flow after fix',
  };
  assert.equal(validateSmallBugCard(bug), 'ready');
  assert.equal(runLightFlow({
    card: bug,
    implementation: { contract_revision: bug.revision },
    verification: { revision: bug.revision, status: 'passed' },
    review: { revision: bug.revision, status: 'accepted' },
  }), 'complete');
  const missingFailure = { ...bug, failureEvidence: '' };
  assert.throws(() => validateSmallBugCard(missingFailure), /bug-failure-evidence-required/);
  const wrongRevision = runLightFlow.bind(null, {
    card: feature,
    implementation: { contract_revision: 'stale-r0' },
    verification: { revision: feature.revision, status: 'passed' },
    review: { revision: feature.revision, status: 'accepted' },
  });
  assert.throws(wrongRevision, /implementation-contract-mismatch/);
});

test('fictional company adapter composes shared stages and defers policy to external rules', () => {
  assert.match(adapter, /虛構 adapter/);
  assert.match(adapter, /fictional organization rules/);
  assert.match(adapter, /fictional repository rules/);
  assert.match(adapter, /adapter 讀取本次宿主實際提供的有效規則並引用其範圍/);
  assert.match(adapter, /不重寫規則優先級/);
  assert.match(adapter, /不含真實 repo 路徑、內部 command、帳戶或憑證/);

  const light = composeSyntheticAdapter(
    ['understand-task', 'plan-change', 'implement-change', 'verify-change', 'review-change'],
    'external',
  );
  assert.equal(light.coordinator, 'adapter-owner');

  const large = composeSyntheticAdapter(
    ['understand-task', 'plan-change', 'large-task-orchestrator', 'implement-change', 'verify-change', 'review-change'],
    'external',
  );
  assert.equal(large.coordinator, 'large-task-orchestrator');
  assert.throws(() => composeSyntheticAdapter(['plan-change', 'plan-change'], 'external'), /duplicate-stage/);
  assert.throws(() => composeSyntheticAdapter(['plan-change'], 'embedded-private-policy'), /adapter-cannot-override-external-rules/);
});

test('Reader-type backend workflow blocks unsafe transfer and keeps environment gates independent', () => {
  assert.match(planner, /在途 I\/O 範圍/);
  assert.match(planner, /lease owner／續租／到期/);
  assert.match(planner, /drain／停機條件/);
  assert.match(planner, /冪等重試／replay/);
  assert.match(planner, /回退／恢復/);
  assert.match(coordinator, /NAS, leases, ports, services/);
  assert.match(coordinator, /in-flight I\/O is drained/);
  assert.match(coordinator, /lease or writer lock is released or confirmed expired/);
  assert.match(lifecycle, /lease owner\/renewal\/expiry/);
  assert.match(orchestrator, /本技能仍是唯一 coordinator/);
  assert.match(planner, /大型 execute 暫由既有 large-task-orchestrator 作為唯一整合入口/);
  assert.match(orchestrator, /verify-change/);
  assert.match(orchestrator, /review-change/);
  assert.match(verifier, /實際程序生命週期、I\/O drain、lease 到期／釋放/);
  assert.match(verifier, /隔離 DB 與必要 NAS gate/);
  assert.match(verifier, /合成 DB、artifact 或 mock 不能代替/);
  assert.match(reviewer, /逐項核對在途 I\/O、lease owner／到期、drain／停機/);
  assert.match(reviewer, /單一 finding 修好不代表其他 gate 通過/);
  assert.match(completion, /verification_status=complete/);

  // A stop request alone is not proof that a background writer can be reassigned.
  assert.equal(mayTransferReaderWriter({ processStopped: false, inFlightIO: 0, leaseState: 'released' }), false);
  assert.equal(mayTransferReaderWriter({ processStopped: true, inFlightIO: 1, leaseState: 'released' }), false);
  assert.equal(mayTransferReaderWriter({ processStopped: true, inFlightIO: 0, leaseState: 'held' }), false);
  assert.equal(mayTransferReaderWriter({ processStopped: true, inFlightIO: 0, leaseState: 'expired' }), true);

  const syntheticChecks = Object.fromEntries(readerAcceptance.map((gate) => [gate, 'passed']));
  syntheticChecks['required-nas'] = 'blocked';
  const result = readerAcceptanceStatus(syntheticChecks);
  assert.deepEqual(result, { status: 'blocked', missing: ['required-nas'] });
  syntheticChecks['required-nas'] = 'passed';
  assert.deepEqual(readerAcceptanceStatus(syntheticChecks), { status: 'complete', missing: [] });
  assert.equal(readerAcceptanceStatus({ 'isolated-db': 'passed' }).status, 'blocked');
});
