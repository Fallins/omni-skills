import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import test from 'node:test';

const implementSkill = readFileSync(new URL('../../skills/implement-change/SKILL.md', import.meta.url), 'utf8');
const verifySkill = readFileSync(new URL('../../skills/verify-change/SKILL.md', import.meta.url), 'utf8');
const verifyKit = readFileSync(new URL('../../skills/verify-change/references/verification-kit.md', import.meta.url), 'utf8');
const featureMap = readFileSync(new URL('../../skills/verify-change/references/feature-map.md', import.meta.url), 'utf8');
const receipt = readFileSync(new URL('../../skills/verify-change/references/verification-receipt.md', import.meta.url), 'utf8');
const reviewSkill = readFileSync(new URL('../../skills/review-change/SKILL.md', import.meta.url), 'utf8');
const reviewFinding = readFileSync(new URL('../../skills/review-change/references/review-finding.md', import.meta.url), 'utf8');
const completionDecision = readFileSync(new URL('../../docs/contracts/completion-decision.md', import.meta.url), 'utf8');
const orchestrator = readFileSync(new URL('../../skills/large-task-orchestrator/SKILL.md', import.meta.url), 'utf8');
const adapter = readFileSync(new URL('../../docs/examples/synthetic-company-adapter.md', import.meta.url), 'utf8');
const readmeZh = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');
const readmeEn = readFileSync(new URL('../../README.en.md', import.meta.url), 'utf8');

// Static contracts and a deterministic CLI fixture only; this does not evaluate agent behavior.
test('G2 skills define stage boundaries, receipts and findings without adding a second coordinator', () => {
  assert.match(implementSkill, /ready for verification/i);
  assert.match(implementSkill, /TaskContract/);
  assert.match(verifySkill, /run/);
  assert.match(verifySkill, /bootstrap/);
  assert.match(verifySkill, /maintain/);
  assert.match(verifySkill, /FeatureMap/);
  assert.match(verifySkill, /VerificationReceipt/);
  assert.match(verifySkill, /doc drift/);
  assert.match(verifySkill, /harness gap/);
  assert.match(verifySkill, /product regression/);
  assert.match(receipt, /artifact_hash/);
  assert.match(receipt, /exit_status/);
  assert.match(receipt, /evidence_retained/);
  assert.match(reviewSkill, /confirmed-static/);
  assert.match(reviewSkill, /reproduced/);
  assert.match(reviewSkill, /needs-verification/);
  assert.match(reviewFinding, /regression_acceptance/);
  assert.match(reviewFinding, /fixed-pending-verification/);
  assert.match(reviewFinding, /verified-fixed/);
  assert.match(completionDecision, /implementation_status/);
  assert.match(completionDecision, /verification_status/);
  assert.match(completionDecision, /review_status/);
  assert.match(completionDecision, /release_status/);
  assert.match(orchestrator, /implement-change/);
  assert.match(orchestrator, /verify-change/);
  assert.match(orchestrator, /review-change/);
  assert.match(orchestrator, /本技能仍是唯一 coordinator/);
  assert.match(verifyKit, /Launch/);
  assert.match(verifyKit, /Doctor/);
  assert.match(verifyKit, /Drive/);
  assert.match(verifyKit, /Evidence/);
  assert.match(verifyKit, /Cleanup/);
  assert.match(featureMap, /false_success_traps/);
});

test('synthetic company adapter composes top-level methods, maps artifacts and defers to external rules', () => {
  assert.match(adapter, /虛構 adapter/);
  assert.match(adapter, /understand-task/);
  assert.match(adapter, /plan-change/);
  assert.match(adapter, /implement-change/);
  assert.match(adapter, /design-interface/);
  assert.match(adapter, /DesignImplementationMap/);
  assert.match(adapter, /coordinate-work/);
  assert.match(adapter, /verify-change/);
  assert.match(adapter, /review-change/);
  assert.match(adapter, /唯一 coordination owner/);
  assert.match(adapter, /fictional organization rules/);
  assert.match(adapter, /fictional repository rules/);
  assert.match(adapter, /VerificationReceipt/);
  assert.match(adapter, /ReviewFinding/);
  assert.doesNotMatch(adapter, /\/Users\/|\/home\/|\/private\//);
  assert.match(readmeZh, /implement-change/);
  assert.match(readmeZh, /verify-change/);
  assert.match(readmeZh, /review-change/);
  assert.match(readmeEn, /implement-change/);
  assert.match(readmeEn, /verify-change/);
  assert.match(readmeEn, /review-change/);
});

test('synthetic VerificationKit runs Launch→Doctor→Drive→Evidence→Cleanup and retains evidence', () => {
  const runRoot = mkdtempSync(join(tmpdir(), 'omni-verify-change-'));
  const appRoot = join(runRoot, 'fixture-app');
  const stateRoot = join(appRoot, 'run-data');
  const evidenceRoot = join(runRoot, 'evidence');
  const runId = 'run-' + process.pid + '-' + Date.now();
  mkdirSync(appRoot, { recursive: true });
  mkdirSync(evidenceRoot, { recursive: true });

  const appPath = join(appRoot, 'application.mjs');
  const appSource = [
    "import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';",
    "import { join } from 'node:path';",
    'const version = process.env.FIXTURE_VERSION;',
    'const expectedVersion = process.env.FIXTURE_EXPECTED_VERSION;',
    'const runId = process.env.FIXTURE_RUN_ID;',
    'const account = process.env.FIXTURE_ACCOUNT;',
    'const expectedAccount = process.env.FIXTURE_EXPECTED_ACCOUNT;',
    'const dataRoot = process.env.FIXTURE_DATA_ROOT;',
    "const recordsPath = join(dataRoot, 'reports.json');",
    "const command = process.argv[2];",
    "const emit = (value) => process.stdout.write(JSON.stringify(value) + '\\n');",
    "const readRecords = () => existsSync(recordsPath) ? JSON.parse(readFileSync(recordsPath, 'utf8')) : [];",
    "if (command === 'launch') {",
    '  mkdirSync(dataRoot, { recursive: true });',
    "  emit({ status: 'launched', version, runId });",
    "} else if (command === 'doctor') {",
    "  if (version !== expectedVersion || account !== expectedAccount) { process.stderr.write('target-mismatch\\n'); process.exitCode = 3; }",
    "  else if (!existsSync(dataRoot)) { process.stderr.write('run data is not prepared\\n'); process.exitCode = 2; }",
    "  else emit({ status: 'healthy', version, runId, account, dataRoot });",
    "} else if (command === 'submit') {",
    '  const title = process.argv.slice(3).join(\' \');',
    "  if (!title) { process.stderr.write('title-required\\n'); process.exitCode = 2; }",
    '  else {',
    '    const records = readRecords();',
    "    const report = { id: 'report-' + runId, title, status: 'ready', runId };",
    '    records.push(report);',
    '    writeFileSync(recordsPath, JSON.stringify(records));',
    '    emit(report);',
    '  }',
    "} else if (command === 'list') {",
    '  emit(readRecords());',
    "} else { process.stderr.write('unknown-command\\n'); process.exitCode = 2; }",
  ].join('\n');
  writeFileSync(appPath, appSource);
  const appHash = createHash('sha256').update(readFileSync(appPath)).digest('hex');
  const fixtureEnv = {
      PATH: process.env.PATH ?? '',
      FIXTURE_VERSION: '1.0.0-synthetic',
      FIXTURE_EXPECTED_VERSION: '1.0.0-synthetic',
      FIXTURE_RUN_ID: runId,
      FIXTURE_ACCOUNT: 'synthetic-test-account',
      FIXTURE_EXPECTED_ACCOUNT: 'synthetic-test-account',
      FIXTURE_DATA_ROOT: stateRoot,
  };
  const runFixtureWithEnv = (command, overrides = {}, ...args) => spawnSync(process.execPath, [appPath, command, ...args], {
    cwd: appRoot,
    encoding: 'utf8',
    timeout: 5000,
    env: {
      ...fixtureEnv,
      ...overrides,
    },
  });
  const runFixture = (command, ...args) => runFixtureWithEnv(command, {}, ...args);

  try {
    // Launch: prepare only this run's private data directory; this fixture is a one-shot CLI.
    const launchResponse = runFixture('launch');
    assert.equal(launchResponse.status, 0, launchResponse.stderr);
    const launch = JSON.parse(launchResponse.stdout);
    assert.equal(launch.status, 'launched');

    const wrongTargetDoctor = runFixtureWithEnv('doctor', { FIXTURE_ACCOUNT: 'unexpected-account' });
    assert.equal(wrongTargetDoctor.status, 3);
    assert.match(wrongTargetDoctor.stderr, /target-mismatch/);

    // Doctor: verify the exact run, version and synthetic account before Drive.
    const doctorResponse = runFixture('doctor');
    assert.equal(doctorResponse.status, 0, doctorResponse.stderr);
    const doctor = JSON.parse(doctorResponse.stdout);
    assert.deepEqual(doctor, {
      status: 'healthy',
      version: '1.0.0-synthetic',
      runId,
      account: 'synthetic-test-account',
      dataRoot: stateRoot,
    });
    assert.equal(resolve(stateRoot).startsWith(resolve(appRoot) + sep), true);

    // Drive: use the fixture's public CLI entry point, not an internal setter.
    const driveResponse = runFixture('submit', 'Synthetic report');
    assert.equal(driveResponse.status, 0, driveResponse.stderr);
    const driveResult = JSON.parse(driveResponse.stdout);
    assert.equal(driveResult.status, 'ready');
    assert.equal(driveResult.runId, runId);

    // Evidence: capture observed response and persisted side effect separately from run data.
    const recordsResponse = runFixture('list');
    assert.equal(recordsResponse.status, 0, recordsResponse.stderr);
    const records = JSON.parse(recordsResponse.stdout);
    assert.equal(records.length, 1);
    assert.equal(records[0].id, driveResult.id);
    const evidencePath = join(evidenceRoot, runId + '.json');
    const evidence = {
      task_id: 'SYNTH-REPORT-001',
      task_contract_revision: 'synthetic-contract-v1',
      repo: 'isolated-fixture',
      commit: 'synthetic-fixture-v1',
      artifact_hash: appHash,
      environment: { node: process.version, account: 'synthetic-test-account', runId },
      commands: [
        { stage: 'Launch', command: 'node application.mjs launch', exit_status: launchResponse.status },
        { stage: 'Doctor-negative', command: 'node application.mjs doctor', exit_status: wrongTargetDoctor.status, result: 'blocked before Drive' },
        { stage: 'Doctor', command: 'node application.mjs doctor', exit_status: doctorResponse.status },
        { stage: 'Drive', command: 'node application.mjs submit Synthetic report', exit_status: driveResponse.status },
        { stage: 'Evidence', command: 'node application.mjs list', exit_status: recordsResponse.status },
      ],
      checks: [{ acceptance_id: 'AC-REPORT-READY', result: 'passed', exit_status: driveResponse.status, observed: driveResult }],
      side_effect: records[0],
      cleanup: { outcome: 'pending', evidence_retained: true },
    };
    writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));

    // Cleanup: delete only this run's data; retain evidence.
    const unownedMarker = join(appRoot, 'unowned-marker.txt');
    writeFileSync(unownedMarker, 'preserve');
    rmSync(stateRoot, { recursive: true, force: true });
    assert.equal(existsSync(stateRoot), false);
    assert.equal(existsSync(unownedMarker), true);
    assert.equal(existsSync(evidencePath), true);
    const retained = JSON.parse(readFileSync(evidencePath, 'utf8'));
    retained.cleanup = { outcome: 'complete', removed_resources: ['fixture-data-' + runId], evidence_retained: true };
    writeFileSync(evidencePath, JSON.stringify(retained, null, 2));
    const finalEvidence = JSON.parse(readFileSync(evidencePath, 'utf8'));
    assert.equal(finalEvidence.checks[0].result, 'passed');
    assert.equal(finalEvidence.side_effect.status, 'ready');
    assert.equal(finalEvidence.cleanup.evidence_retained, true);
  } finally {
    rmSync(runRoot, { recursive: true, force: true });
  }
});

function classifyMaintainEvidence({ accepted, documented, drivenResult, driveSucceeded, independentObservation }) {
  if (!driveSucceeded) {
    if (independentObservation === accepted) return 'harness gap';
    return 'blocked';
  }
  if (drivenResult !== accepted) return 'product regression';
  if (documented !== accepted) return 'doc drift';
  return 'clean';
}

test('maintain classifies doc drift, harness gap and product regression without changing expectations', () => {
  const approved = 'ready';
  assert.equal(classifyMaintainEvidence({
    accepted: approved,
    documented: 'submitted',
    drivenResult: 'ready',
    driveSucceeded: true,
  }), 'doc drift');
  assert.equal(classifyMaintainEvidence({
    accepted: approved,
    documented: approved,
    drivenResult: undefined,
    driveSucceeded: false,
    independentObservation: 'ready',
  }), 'harness gap');
  assert.equal(classifyMaintainEvidence({
    accepted: approved,
    documented: approved,
    drivenResult: 'error',
    driveSucceeded: true,
  }), 'product regression');
  assert.equal(classifyMaintainEvidence({
    accepted: approved,
    documented: approved,
    drivenResult: undefined,
    driveSucceeded: false,
  }), 'blocked');
});
