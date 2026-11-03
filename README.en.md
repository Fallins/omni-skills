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

## Routing rule draft

The G1 routing draft lives at [docs/skill-routing-rule-draft.md](docs/skill-routing-rule-draft.md) and is for review only; it is not active. Installers link skills from skills/ only. Review and activate routing rules separately in the appropriate scope; installing skills will not make this draft take effect.

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
| understand-task | Ground a task in its goal, evidence, scope and success conditions | Use before planning or implementation when context still needs checking; simple questions do not need the full flow. |
| plan-change | Produce verifiable light or large plans; large plans verify the planner's actual model/effort and can specify in-flight I/O, leases, shutdown, and rollback contracts | Use for plan-only requests. Child-task model recommendations are separate. Large execution uses large-task-orchestrator as its sole integration owner. |
| design-interface | Turn a Plan DesignBrief into a reviewable DesignSpec with journey, state, responsive, UX and layout acceptance | `/design-interface`; ask the user to review the exact revision, then return to Plan for the implementation map. It does not write product code. |
| implement-change | Implement an approved feature, bug fix or refactor and hand off a change ready for verification | `/implement-change`; large-task slices are assigned by the existing sole coordinator. |
| verify-change | Run, bootstrap or maintain a rerunnable verification entry and FeatureMap; produce a version- and environment-bound VerificationReceipt | `/verify-change`; choose run, bootstrap or maintain as needed; backend acceptance can separately require a real process, isolated DB and NAS. Exit 0 alone is not semantic evidence. |
| review-change | Review a fixed revision for spec compliance and code risk; produce deduplicated, traceable findings | `/review-change`; mark self-review when the implementer reviews their own change. |
| coordinate-work | Coordinate multi-slice work with one owner, contracts, I/O/lease-aware handoffs, shared-resource controls, resume and final integration acceptance | `/coordinate-work` only when explicitly assigned and no coordinator already owns the task. If large-task-orchestrator is active, use this as a method only; do not open another DAG, ledger, or dispatch loop. |
| large-task-orchestrator | Sole coordination entry for large execution, retaining stop/handoff, single-writer, integration acceptance and resume safeguards | Say "大型任務模式" or use $large-task-orchestrator. Large plan-only requests use plan-change. It can use stage methods without starting another coordinator. |

Debugging split: `systematic-debugging` when the failure is already stable and the job is finding the root cause. `gs-diagnosing-bugs` when the job is first building a reliable feedback loop (hard-to-reproduce bugs, inconsistent performance).

### agent-browser CLI

The skill is installed by omni-skills. Browser automation also needs:

```bash
npm install -g agent-browser
agent-browser install
```

At runtime the skill loads `agent-browser skills get core` from the installed CLI.

Talk to the user in Traditional Chinese.

For a code change, combine only the needed stages: `understand-task → plan-change → implement-change → verify-change → review-change`. For UI work with unresolved design, use `Plan → design-interface → user review → return to Plan to update the task card/TaskContract implementation map → implement-change`; light work may keep its concise complete map in the task card, while large work uses the full DesignImplementationMap. Do not implement an unapproved design. A plan-only request stops after plan-change. Large execution keeps `large-task-orchestrator` as its sole integration owner; `coordinate-work` is a reusable method and does not start a second dispatch or integration loop.

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
