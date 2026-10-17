# omni-skills

Cross-tool agent skills (Cursor / Codex / Claude / Antigravity). Skill bodies live only here. This repo does not hard-code home-directory paths.

Give the agent a map first; load details only when needed. Architecture: [docs/agent-context-architecture.zh-TW.md](docs/agent-context-architecture.zh-TW.md) (Chinese, canonical).

The older [Fallins/skills](https://github.com/Fallins/skills.git) snapshot is the same history; use this repo instead.

The Chinese [README.md](README.md) is canonical. Keep both files updated when adding or changing a skill: name, purpose, how to use. Provenance and examples are optional.

## Install

### Native Codex / Claude Code installation (Node.js 24+)

With agent-work, run `node scripts/update-skills.ts --skills-source "<absolute omni-skills clone path>" --tools codex,claude` from that repository to apply its version pin and global rules. Later run `node scripts/update-skills.ts`; add `--check` for a read-only check without fetching.

Standalone, from this repository (does not install agent-work rules):

```sh
node scripts/install-skills.ts --tools codex,claude --yes
node scripts/install-skills.ts --tools codex,claude --check
```

Windows uses directory junctions without Python, Bash or OS changes; macOS/Linux use symlinks. Targets: `~/.agents/skills`, `$CODEX_HOME/skills` (default `~/.codex/skills`) and `$CLAUDE_CONFIG_DIR/skills` (default `~/.claude/skills`). All targets are checked before writing; ordinary directories, foreign or broken links stop installation. Old skills are not removed.

Config defaults to `~/.config/omni-skills/config.json`; override with `OMNI_CONFIG` or `--config`. An explicit `--home` isolates installation from environment home overrides. Native installation supports only Codex/Claude Code; use Bash for other tools. Start a new conversation or reload skills after installation.

### Bash installation (including Cursor / Antigravity)

```bash
git clone https://github.com/Fallins/omni-skills.git
cd omni-skills
chmod +x scripts/install-skills.sh
./scripts/install-skills.sh
```

Agents should follow [INSTALL.md](INSTALL.md). Config is written to `~/.config/omni-skills/config.json`. With no `workspaceRoot`, workspaces fall back to `<git-root>/.scratch/<repo>/`.

The Bash installer does not generate a Cursor slash file for `gs-grill-core`. Native Codex/Claude discovery may list it; it is a supporting skill read by the interview skills.

## Skill families

**`gs-*` (grill-skill):** engineering loop from [mattpocock/skills](https://github.com/mattpocock/skills) — interview, spec, tickets, TDD/implement, review, handoff. Prefix avoids clashing with other `tdd`/`setup` skills later.

**Other:**

| Name | Purpose | How to use |
|------|---------|------------|
| `enroll` | Enroll the current git into agent-work (workspace folder + tracker). Does not modify company git. See [docs/agent-work.md](docs/agent-work.md) | Say "enroll" or `/enroll` |
| `eli5` | Read-only HTML visual explanation of how code actually runs | "ELI5 this flow"; output in `.agent-artifacts/eli5/` |
| `frontend-design` | New UI, substantial visual redesign or polish; typography, composition, hierarchy | `/frontend-design` |
| `agent-browser` | Real-browser automation for QA, repro, screenshots, flow verification | `/agent-browser` (needs the CLI) |
| `systematic-debugging` | Root-cause-first debugging for a concrete, investigable failure | `/systematic-debugging` |
| `large-task-orchestrator` | Evidence checks, task contracts, agent coordination and integration acceptance for large coding tasks; retains the Luna MAX executor preference and verifies the actual model mapping | Say "大型任務模式" or use `$large-task-orchestrator` (`/large-task-orchestrator` where slash commands are supported). Planning requests stay plan-only; explicitly request planning and execution to implement. |

Debugging split: `systematic-debugging` when the failure is already stable and the job is finding the root cause. `gs-diagnosing-bugs` when the job is first building a reliable feedback loop (hard-to-reproduce bugs, inconsistent performance).

### agent-browser CLI

The skill is installed by omni-skills. Browser automation also needs:

```bash
npm install -g agent-browser
agent-browser install
```

At runtime the skill loads `agent-browser skills get core` from the installed CLI.

Talk to the user in Traditional Chinese.

## Updating

Skills use symlinks/junctions. With agent-work, update through its pinned updater rather than pulling a detached checkout.

On 2026-10-17 all existing sources were reviewed. The gs-* updates strengthen dependency ordering, verification evidence, cross-tool review and tracker relations while retaining AW/CONTEXT conventions. frontend-design gains visual/accessibility guidance; systematic-debugging stops diagnostic examples from printing environment variable values. Invocation remains as documented above. agent-browser's wrapper is unchanged; only its reviewed revision advances. See the [sync record](docs/upstream-sync-2026-10-17.md).

Native installer tests: `node --test scripts/tests/install-skills.test.ts`.

- `gs-*`: `./scripts/sync-from-upstream.sh` (mattpocock)
- Skills with `UPSTREAM.md`: `./scripts/update-external-skills.sh` — fetches and diffs; **does not overwrite** adapted `SKILL.md`. `--apply-license` / `--mark-synced` after a manual merge.

`agent-browser` is a thin wrapper; day-to-day updates come from the CLI (`agent-browser skills get core`), not from copying the upstream skill body.

## License

- `gs-*` upstream MIT: `LICENSE.upstream`.
- Third-party skill licenses: `NOTICE` and each skill's `LICENSE.txt`.
- Adaptations: `LICENSE`.
