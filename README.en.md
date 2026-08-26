# omni-skills

Cross-tool agent skills (Cursor / Codex / Claude / Antigravity). Skill bodies live only here. Task workspaces belong in the private [omni-agent-work](https://github.com/Fallins/omni-agent-work) repo. This repo does not hard-code home-directory paths.

The older [Fallins/skills](https://github.com/Fallins/skills.git) snapshot is the same history; use this repo instead.

The Chinese [README.md](README.md) is canonical. Keep both files updated when adding or changing a skill: name, purpose, how to use. Provenance and examples are optional.

## Install

```bash
git clone https://github.com/Fallins/omni-skills.git
cd omni-skills
chmod +x scripts/install-skills.sh
./scripts/install-skills.sh
```

Agents should follow [INSTALL.md](INSTALL.md). Config is written to `~/.config/omni-skills/config.json`. With no `workspaceRoot`, workspaces fall back to `<git-root>/.scratch/<repo>/`.

`gs-grill-core` does not get a slash command.

## Skill families

**`gs-*` (grill-skill):** engineering loop from [mattpocock/skills](https://github.com/mattpocock/skills) — interview, spec, tickets, TDD/implement, review, handoff. Prefix avoids clashing with other `tdd`/`setup` skills later.

**Other:**

| Name | Purpose | How to use |
|------|---------|------------|
| `enroll` | Agent-work concept: five layers, approach B, skeleton, enroll current git | Say "enroll" or `/enroll` |
| `eli5` | Read-only HTML visual explanation of how code actually runs | "ELI5 this flow"; output in `.agent-artifacts/eli5/` |
| `frontend-design` | New UI, substantial visual redesign or polish; typography, composition, hierarchy | `/frontend-design` |
| `agent-browser` | Real-browser automation for QA, repro, screenshots, flow verification | `/agent-browser` (needs the CLI) |
| `systematic-debugging` | Root-cause-first debugging for a concrete, investigable failure | `/systematic-debugging` |

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

- `gs-*`: `./scripts/sync-from-upstream.sh` (mattpocock)
- Skills with `UPSTREAM.md`: `./scripts/update-external-skills.sh` — fetches and diffs; **does not overwrite** adapted `SKILL.md`. `--apply-license` / `--mark-synced` after a manual merge.

`agent-browser` is a thin wrapper; day-to-day updates come from the CLI (`agent-browser skills get core`), not from copying the upstream skill body.

## License

Upstream MIT: `LICENSE.upstream`, `NOTICE`. Adaptations: `LICENSE`.
