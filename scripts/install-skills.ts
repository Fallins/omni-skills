#!/usr/bin/env node
// Node.js 24+; no packages or administrator privileges required.
import { lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

type Config = Record<string, unknown>;
const sourceDefault = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const identity = (path: string): string => process.platform === 'win32' ? resolve(path).toLowerCase() : resolve(path);
function absolute(value: string, label: string): string {
  if (!isAbsolute(value)) throw new Error(`${label} must be absolute.`);
  return resolve(value);
}
function directoryParents(path: string): void {
  const parent = dirname(path);
  if (parent !== path) directoryParents(parent);
  const stat = lstatSync(path, { throwIfNoEntry: false });
  if (stat && (!stat.isDirectory() || stat.isSymbolicLink())) {
    throw new Error(`Refusing a linked or non-directory parent: ${path}`);
  }
}
function load(path: string): Config {
  directoryParents(dirname(path));
  const stat = lstatSync(path, { throwIfNoEntry: false });
  if (!stat) return {};
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink > 1) throw new Error(`Unsafe config file: ${path}`);
  const data: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Config must be a JSON object.');
  return data as Config;
}

export function install(args: string[], environment: NodeJS.ProcessEnv = process.env, source = sourceDefault): number {
  const flags = new Map<string, string>();
  let check = false, dryRun = false;
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (key === '--help' || key === '-h') {
      console.log('node scripts/install-skills.ts --tools codex,claude [--workspace-root ABSOLUTE_PATH]\n'
        + '  [--home ABSOLUTE_PATH] [--config ABSOLUTE_PATH] [--layout work-personal|scratch]\n'
        + '  [--command-prefix PREFIX] [--personal-substring STR] [--check | --dry-run] [--yes]');
      return 0;
    }
    if (key === '--check') { check = true; continue; }
    if (key === '--dry-run') { dryRun = true; continue; }
    if (key === '--yes') continue;
    if (!['--tools', '--workspace-root', '--home', '--config', '--layout', '--command-prefix', '--personal-substring'].includes(key)) {
      throw new Error(`Unknown option: ${key}`);
    }
    const value = args[++i];
    if (value === undefined || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
    if (flags.has(key)) throw new Error(`Duplicate option: ${key}`);
    flags.set(key, value);
  }
  if (check && dryRun) throw new Error('Choose --check or --dry-run.');
  // An explicit test home must never inherit real-user path overrides.
  const env = flags.has('--home') ? {} : environment;
  const home = absolute(flags.get('--home') ?? homedir(), 'home');
  const configPath = absolute(flags.get('--config') ?? env.OMNI_CONFIG ?? join(home, '.config', 'omni-skills', 'config.json'), 'config');
  const previous = load(configPath);
  const rawTools = flags.has('--tools') ? flags.get('--tools')!.split(',').map(v => v.trim()) : (previous.tools ?? ['codex', 'claude']);
  if (!Array.isArray(rawTools) || !rawTools.length || rawTools.some(v => v !== 'codex' && v !== 'claude')) {
    throw new Error('Native installer supports only --tools codex,claude; explicitly select supported tools.');
  }
  const selected = [...new Set(rawTools)] as string[];
  const workspace = flags.get('--workspace-root') ?? previous.workspaceRoot ?? null;
  if (workspace !== null && typeof workspace !== 'string') throw new Error('Invalid workspaceRoot.');
  const workspaceRoot = workspace ? absolute(workspace, 'workspaceRoot') : null;
  const layout = flags.get('--layout') ?? (flags.has('--workspace-root') ? 'work-personal' : previous.layout ?? (workspaceRoot ? 'work-personal' : 'scratch'));
  if (!['work-personal', 'scratch'].includes(String(layout)) || (layout === 'work-personal' && !workspaceRoot) || (layout === 'scratch' && workspaceRoot)) {
    throw new Error('layout and workspaceRoot must agree (work-personal requires workspaceRoot).');
  }
  if (workspaceRoot) directoryParents(workspaceRoot);
  const personal = flags.get('--personal-substring') ?? previous.personalPathSubstring ?? '/Personal/';
  const prefix = flags.get('--command-prefix') ?? previous.commandPrefix ?? '';
  if (typeof personal !== 'string' || !personal || typeof prefix !== 'string') throw new Error('Invalid personalPathSubstring or commandPrefix.');
  source = realpathSync(absolute(source, 'skillsSource'));
  const skills = join(source, 'skills');
  const names = readdirSync(skills, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  if (!names.length) throw new Error(`No skill directories: ${skills}`);
  for (const name of names) {
    const stat = lstatSync(join(skills, name, 'SKILL.md'), { throwIfNoEntry: false });
    if (!stat?.isFile() || stat.isSymbolicLink()) throw new Error(`Missing regular SKILL.md: ${name}`);
  }
  const destinations: string[] = [];
  if (selected.includes('codex')) destinations.push(join(home, '.agents', 'skills'), join(absolute(env.CODEX_HOME ?? join(home, '.codex'), 'CODEX_HOME'), 'skills'));
  if (selected.includes('claude')) destinations.push(join(absolute(env.CLAUDE_CONFIG_DIR ?? join(home, '.claude'), 'CLAUDE_CONFIG_DIR'), 'skills'));
  const uniqueDestinations = [...new Map(destinations.map(path => [identity(path), path])).values()];
  const plans = uniqueDestinations.flatMap(destination => {
    directoryParents(destination);
    return names.map(name => {
      const target = join(skills, name), path = join(destination, name);
      const stat = lstatSync(path, { throwIfNoEntry: false });
      if (stat) {
        if (!stat.isSymbolicLink()) throw new Error(`Conflict: existing skill is not a link: ${path}`);
        let actual: string;
        try { actual = realpathSync(path); } catch { throw new Error(`Conflict: broken skill link: ${path}`); }
        if (identity(actual) !== identity(realpathSync(target))) throw new Error(`Conflict: skill belongs to another source: ${path}`);
      }
      return { path, target, missing: !stat };
    });
  });
  const within = (path: string, parent: string) => {
    const part = relative(identity(parent), identity(path));
    return !part || (!part.startsWith('..') && !isAbsolute(part));
  };
  if (within(configPath, source) || uniqueDestinations.some(path => within(path, source))
      || plans.some(plan => within(configPath, plan.path))) {
    throw new Error('Config and destination paths must not overlap source skills or a planned link.');
  }
  const config: Config = { ...previous, tools: selected, workspaceRoot, layout, skillsSource: source, personalPathSubstring: personal, commandPrefix: prefix };
  const configChanged = JSON.stringify(previous) !== JSON.stringify(config);
  const missing = plans.filter(plan => plan.missing);
  if (check || dryRun) {
    console.log(`${check ? 'CHECK' : 'PREFLIGHT'}: ${missing.length} missing skill links; config ${configChanged ? 'needs update' : 'OK'}.`);
    return check && (missing.length > 0 || configChanged) ? 1 : 0;
  }
  // All conflicts are checked before any write. Roll back links created by this run on I/O failure.
  const created: string[] = [];
  let temporary: string | undefined;
  try {
    for (const plan of missing) {
      mkdirSync(dirname(plan.path), { recursive: true });
      symlinkSync(plan.target, plan.path, process.platform === 'win32' ? 'junction' : 'dir');
      created.push(plan.path);
    }
    if (configChanged) {
      mkdirSync(dirname(configPath), { recursive: true });
      temporary = `${configPath}.tmp-${randomUUID()}`;
      writeFileSync(temporary, JSON.stringify(config, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
      renameSync(temporary, configPath);
      temporary = undefined;
    }
  } catch (error) {
    for (const path of created.reverse()) unlinkSync(path);
    throw error;
  } finally {
    if (temporary && lstatSync(temporary, { throwIfNoEntry: false })) unlinkSync(temporary);
  }
  console.log(`Installed ${names.length} skills in ${uniqueDestinations.length} directories. Config: ${configPath}`);
  return 0;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (Number.parseInt(process.versions.node) < 24) throw new Error('Node.js 24+ is required.');
    process.exitCode = install(process.argv.slice(2));
  } catch (error) {
    console.error(`install-skills: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
