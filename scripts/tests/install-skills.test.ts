import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { install } from '../install-skills.ts';

function fixture(t: test.TestContext) {
  const root = mkdtempSync(join(dirname(fileURLToPath(import.meta.url)), '.native-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const source = join(root, 'source'), home = join(root, 'home'), workspace = join(root, 'workspace');
  for (const path of [join(source, 'skills', 'example'), workspace]) mkdirSync(path, { recursive: true });
  writeFileSync(join(source, 'skills', 'example', 'SKILL.md'), '# example');
  const config = join(home, '.config', 'omni-skills', 'config.json');
  const args = ['--tools', 'codex,claude', '--home', home, '--workspace-root', workspace];
  return { root, source, home, workspace, config, args };
}
test('installs junctions/symlinks for all three paths, preserves unknown config, and is idempotent', t => {
  const f = fixture(t);
  mkdirSync(dirname(f.config), { recursive: true });
  writeFileSync(f.config, JSON.stringify({ extra: { preserve: true } }));
  assert.equal(install(f.args, {}, f.source), 0);
  for (const tool of ['.agents', '.codex', '.claude']) {
    const path = join(f.home, tool, 'skills', 'example');
    assert.ok(lstatSync(path).isSymbolicLink());
    assert.equal(realpathSync(path), realpathSync(join(f.source, 'skills', 'example')));
  }
  assert.deepEqual(JSON.parse(readFileSync(f.config, 'utf8')).extra, { preserve: true });
  const before = statSync(f.config).mtimeMs;
  assert.equal(install(f.args, {}, f.source), 0);
  assert.equal(statSync(f.config).mtimeMs, before);
  assert.equal(install([...f.args, '--check'], {}, f.source), 0);
  assert.ok(!existsSync(join(f.home, '.codex', 'AGENTS.md')));
});
test('a conflict at the last destination prevents all links and config writes', t => {
  const f = fixture(t);
  mkdirSync(join(f.home, '.claude', 'skills', 'example'), { recursive: true });
  assert.throws(() => install(f.args, {}, f.source), /Conflict/u);
  assert.ok(!existsSync(f.config));
  assert.ok(!existsSync(join(f.home, '.agents')));
  assert.ok(!existsSync(join(f.home, '.codex')));
});
test('check is read-only for missing installation and rejects broken links', t => {
  const f = fixture(t);
  assert.equal(install([...f.args, '--check'], {}, f.source), 1);
  assert.ok(!existsSync(f.home));
  const destination = join(f.home, '.claude', 'skills');
  mkdirSync(destination, { recursive: true });
  const gone = join(f.root, 'gone');
  mkdirSync(gone);
  symlinkSync(gone, join(destination, 'example'), process.platform === 'win32' ? 'junction' : 'dir');
  rmSync(gone, { recursive: true });
  assert.throws(() => install([...f.args, '--check'], {}, f.source), /broken skill link/u);
  assert.ok(!existsSync(f.config));
});
test('foreign links are refused', t => {
  const f = fixture(t);
  const foreign = join(f.root, 'foreign');
  mkdirSync(foreign);
  const destination = join(f.home, '.agents', 'skills');
  mkdirSync(destination, { recursive: true });
  symlinkSync(foreign, join(destination, 'example'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => install(f.args, {}, f.source), /another source/u);
  assert.ok(!existsSync(f.config));
});
test('linked destination parent is refused before config or other links are written', t => {
  const f = fixture(t);
  const foreign = join(f.root, 'foreign');
  mkdirSync(foreign);
  mkdirSync(f.home);
  symlinkSync(foreign, join(f.home, '.claude'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => install(f.args, {}, f.source), /non-directory parent/u);
  assert.ok(!existsSync(f.config));
  assert.ok(!existsSync(join(f.home, '.agents')));
});
test('--home ignores real-home overrides, explicit --config remains supported', t => {
  const f = fixture(t);
  const outside = join(f.root, 'untouched');
  const env = { CODEX_HOME: outside, CLAUDE_CONFIG_DIR: outside, OMNI_CONFIG: join(outside, 'config.json') };
  const config = join(f.root, 'custom-config.json');
  assert.equal(install([...f.args, '--config', config], env, f.source), 0);
  assert.ok(!existsSync(outside));
  assert.ok(existsSync(config));
  assert.ok(!existsSync(f.config));
});
test('without --home respects config directories and rejects unsupported tools before writes', t => {
  const f = fixture(t);
  const codex = join(f.root, 'custom-codex'), claude = join(f.root, 'custom-claude');
  // Claude-only avoids writing the actual home .agents path in this isolated test.
  assert.equal(install(['--tools', 'claude', '--config', f.config], { CODEX_HOME: codex, CLAUDE_CONFIG_DIR: claude }, f.source), 0);
  assert.ok(existsSync(join(claude, 'skills', 'example')));
  assert.ok(!existsSync(codex));
  assert.throws(() => install([...f.args.slice(2), '--tools', 'cursor'], {}, f.source), /only --tools/u);
});
test('preflight rejects config below a planned link without writing source', t => {
  const f = fixture(t);
  const config = join(f.home, '.agents', 'skills', 'example', 'config.json');
  assert.throws(() => install([...f.args, '--config', config], {}, f.source), /overlap/u);
  assert.ok(!existsSync(f.home));
  assert.ok(!existsSync(join(f.source, 'skills', 'example', 'config.json')));
});
