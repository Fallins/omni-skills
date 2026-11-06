import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const planner = readFileSync(new URL('../../skills/plan-change/SKILL.md', import.meta.url), 'utf8');
const orchestrator = readFileSync(new URL('../../skills/large-task-orchestrator/SKILL.md', import.meta.url), 'utf8');
const template = readFileSync(new URL('../../skills/large-task-orchestrator/references/plan-template.md', import.meta.url), 'utf8');

// Deterministic fixtures for routing and completion decisions.
// They do not run an agent, browser, Jira, Drive, or company start-task.

const complexRisks = new Set(['permission', 'data', 'shared-contract', 'migration', 'concurrency', 'shared-writer']);

function presentPlan(input) {
  const complex = (input.risks ?? []).some((risk) => complexRisks.has(risk));
  const missing = [];
  for (const item of input.items) {
    if (item.summaryOnly) {
      missing.push(`${item.id}:execution-detail`);
      continue;
    }
    for (const key of ['change', 'noChange', 'success', 'repo', 'base', 'verify', 'sources']) {
      if (item[key] === undefined || item[key] === '' || (Array.isArray(item[key]) && item[key].length === 0)) {
        missing.push(`${item.id}:${key}`);
      }
    }
  }
  if (complex && !input.expandedContract) missing.push('expanded-contract');
  const order = [];
  const pending = new Map(input.items.map((item) => [item.id, new Set(item.deps ?? [])]));
  const guard = pending.size + 1;
  for (let step = 0; step < guard && pending.size; step += 1) {
    const readyIds = [...pending.keys()].filter((id) => pending.get(id).size === 0);
    if (!readyIds.length) break;
    readyIds.sort();
    for (const id of readyIds) {
      order.push(id);
      pending.delete(id);
      for (const deps of pending.values()) deps.delete(id);
    }
  }
  return {
    shape: complex ? 'expanded' : 'short-summary',
    ready: missing.length === 0 && pending.size === 0,
    missing,
    order,
    cycle: [...pending.keys()],
  };
}

function sourceState(source) {
  if (source.applicable === false) return { state: 'not-applicable', analyzed: false };
  if (source.needsAuth) return { state: 'needs-auth', analyzed: false };
  if (!source.contentRead) return { state: 'unreadable', analyzed: false };
  return { state: 'read', analyzed: true };
}

function afterPlan(input) {
  if (input.reply === 'silence') {
    return { action: 'keep-waiting', writeProduct: false, silenceIsApproval: false };
  }
  if (input.authorization !== 'plan-and-execute') {
    return { action: 'ask-to-implement', writeProduct: false, reaskSameAuthorization: false };
  }
  const blocked = (input.questions ?? [])
    .filter((question) => !(input.resolved ?? []).includes(question.id))
    .flatMap((question) => question.blocks);
  const independent = (input.authorizedWork ?? []).filter((id) => !blocked.includes(id));
  return {
    action: blocked.length ? 'continue-independent' : 'enter-next-stage',
    writeProduct: independent.length > 0,
    continue: independent,
    blocked,
    reaskSameAuthorization: false,
    inventedDecision: false,
  };
}

function sliceReturned(event) {
  if (event.kind === 'awaiting-confirmation' && !event.verifiableChange) {
    return { batchComplete: false, next: 'record-wait', startAcceptance: false, continueIndependent: true };
  }
  if (event.kind === 'post-mr-check' && !event.mrReady) {
    return { batchComplete: false, next: 'hold-until-mr', startAcceptance: false };
  }
  if (!event.verifyReceipt) return { batchComplete: false, next: 'verify-change', startAcceptance: true };
  if (!event.review) return { batchComplete: false, next: 'review-change', startAcceptance: true };
  return { batchComplete: false, next: 'wait-for-remaining-slices', startAcceptance: false };
}

function projectWait(input) {
  if (!input.userAuthorized) return { status: 'waiting', push: false, mr: false, extraGate: false };
  return { status: 'continue-entry', push: false, mr: false, extraGate: false, followProjectEntry: true };
}

function recordEvidence(input) {
  return {
    unit: input.unit ?? 'not-run',
    browser: input.browserAvailable ? (input.browser ?? 'not-run') : 'not-verified',
    allPassed: input.unit === 'passed' && input.browserAvailable === true && input.browser === 'passed',
  };
}

function integrate(input) {
  const reusable = (input.prior ?? []).filter((item) => item.revision === input.finalRevision && !input.changed.includes(item.scope));
  const rerun = input.changed.filter((scope) => !reusable.some((item) => item.scope === scope));
  const review = input.selfReview ? 'self-review' : 'separate-reviewer';
  const independentGap = input.independentRequired && !input.independentDone;
  return {
    reusable: reusable.map((item) => item.scope),
    rerun,
    review,
    complete: !independentGap && input.slicesReady === true,
    claimedIndependent: false,
  };
}

test('three small requirements keep a short plan with per-item verification and asset order', () => {
  const plan = presentPlan({
    items: [
      { id: 'R1', change: 'publish banner asset', noChange: 'product routes', success: 'asset revision frozen', repo: 'assets', base: 'a1', sources: ['file'], verify: 'asset hash', deps: [] },
      { id: 'R3', change: 'update label', noChange: 'banner', success: 'label matches copy', repo: 'product', base: 'p1', sources: ['spec'], verify: 'unit label', deps: [] },
      { id: 'R2', change: 'use published asset', noChange: 'label', success: 'banner uses R1 revision', repo: 'product', base: 'p1', sources: ['comment'], verify: 'browser shows banner', deps: ['R1'] },
    ],
  });
  assert.equal(plan.shape, 'short-summary');
  assert.equal(plan.ready, true);
  assert.ok(plan.order.indexOf('R1') < plan.order.indexOf('R2'));
  assert.match(planner, /多張各自簡單、介面清楚的需求，可以用短摘要加精簡任務卡/);
  assert.match(template, /資產先行/);
});

test('a complex requirement is not ready from a short summary alone', () => {
  const plan = presentPlan({
    risks: ['permission', 'shared-contract'],
    items: [{ id: 'R1', summaryOnly: true }],
  });
  assert.equal(plan.shape, 'expanded');
  assert.equal(plan.ready, false);
  assert.ok(plan.missing.includes('expanded-contract'));
  assert.match(planner, /不得標 ready-to-dispatch/);
  assert.match(template, /不能只靠短摘要標 ready-to-dispatch/);
});

test('an unread image or video link is not analyzed content', () => {
  const unread = sourceState({ linkSeen: true, contentRead: false });
  assert.deepEqual(unread, { state: 'unreadable', analyzed: false });
  assert.equal(sourceState({ contentRead: true }).analyzed, true);
  assert.equal(sourceState({ needsAuth: true }).state, 'needs-auth');
  assert.match(planner, /看到連結不等於已讀內容/);
  assert.match(template, /看到連結不等於已讀內容/);
});

test('one open product decision blocks only the affected work', () => {
  const next = afterPlan({
    authorization: 'plan-and-execute',
    questions: [{ id: 'Q1', blocks: ['R2'] }],
    resolved: [],
    authorizedWork: ['R1', 'R2', 'R3'],
  });
  assert.deepEqual(next.continue, ['R1', 'R3']);
  assert.deepEqual(next.blocked, ['R2']);
  assert.equal(next.inventedDecision, false);
  assert.equal(next.reaskSameAuthorization, false);
  assert.match(planner, /不因一個局部問題停止整批/);
});

test('plan-only asks before implementation, while granted execution does not re-ask', () => {
  const planOnly = afterPlan({ authorization: 'plan-only' });
  assert.equal(planOnly.action, 'ask-to-implement');
  assert.equal(planOnly.writeProduct, false);
  const granted = afterPlan({ authorization: 'plan-and-execute', questions: [], authorizedWork: ['R1'] });
  assert.equal(granted.action, 'enter-next-stage');
  assert.equal(granted.reaskSameAuthorization, false);
  const silence = afterPlan({ authorization: 'plan-and-execute', reply: 'silence' });
  assert.equal(silence.silenceIsApproval, false);
  assert.equal(silence.writeProduct, false);
  assert.match(planner, /獲得授權前不改產品程式/);
  assert.match(planner, /不為同一授權再問一次/);
  assert.match(planner, /沉默不是同意/);
});

test('a draft MR returns to the coordinator instead of completing the batch', () => {
  const returned = sliceReturned({ kind: 'draft-mr', verifyReceipt: null, review: null });
  assert.equal(returned.batchComplete, false);
  assert.equal(returned.next, 'verify-change');
  const reviewed = sliceReturned({ kind: 'done', verifyReceipt: 'receipt-1', review: 'self-review' });
  assert.equal(reviewed.batchComplete, false);
  assert.match(orchestrator, /建立 MR，或回報該切片完成，都不是整批完成/);
  assert.match(orchestrator, /尚未產生可驗證的變更時，不啟動它的完成驗收/);
  assert.match(orchestrator, /先有可用的驗證證據，再用該證據審查/);
  assert.match(orchestrator, /代理回報、commit、MR 或 exit 0 不能單獨當作完整驗收/);
});

test('waiting before implementation is not treated as ready for acceptance', () => {
  const waiting = sliceReturned({ kind: 'awaiting-confirmation', verifiableChange: false });
  assert.equal(waiting.startAcceptance, false);
  assert.equal(waiting.next, 'record-wait');
  assert.equal(waiting.continueIndependent, true);
  assert.equal(waiting.batchComplete, false);
  const held = sliceReturned({ kind: 'post-mr-check', mrReady: false });
  assert.equal(held.startAcceptance, false);
  assert.equal(held.next, 'hold-until-mr');
  assert.match(orchestrator, /必須在 MR 建立且條件具備後才能做的檢查：維持未完成，不提前啟動/);
});

test('a required project wait is preserved, and approval does not add another gate', () => {
  const waiting = projectWait({ userAuthorized: false });
  assert.equal(waiting.status, 'waiting');
  assert.equal(waiting.push, false);
  assert.equal(waiting.mr, false);
  const approved = projectWait({ userAuthorized: true });
  assert.equal(approved.extraGate, false);
  assert.equal(approved.followProjectEntry, true);
  assert.match(orchestrator, /尚未獲批准時停在等待並回報，不自動 push 或送 MR/);
  assert.match(orchestrator, /已開 MR 不是驗收通過/);
});

test('unavailable browser evidence stays not verified without discarding other evidence', () => {
  const evidence = recordEvidence({ unit: 'passed', browserAvailable: false });
  assert.equal(evidence.unit, 'passed');
  assert.equal(evidence.browser, 'not-verified');
  assert.equal(evidence.allPassed, false);
  assert.match(orchestrator, /標未驗證與影響，保留已取得的其他證據/);
  assert.match(planner, /UI 的可見行為不以 typecheck 或文字搜尋代替/);
});

test('applicable final-revision evidence is reused and self-review is not independent review', () => {
  const reused = integrate({
    finalRevision: 'rev-2',
    prior: [{ revision: 'rev-2', scope: 'R1', status: 'passed' }],
    changed: ['R2'],
    selfReview: true,
    independentRequired: false,
    slicesReady: true,
  });
  assert.deepEqual(reused.reusable, ['R1']);
  assert.deepEqual(reused.rerun, ['R2']);
  assert.equal(reused.review, 'self-review');
  assert.equal(reused.complete, true);
  const gap = integrate({
    finalRevision: 'rev-2',
    prior: [],
    changed: ['R1'],
    selfReview: true,
    independentRequired: true,
    independentDone: false,
    slicesReady: true,
  });
  assert.equal(gap.complete, false);
  assert.equal(gap.claimedIndependent, false);
  assert.match(orchestrator, /實作者自審標 self-review|實作者自行審查標明 self-review/);
});
