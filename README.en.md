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

**Other:** `enroll` (agent-work concept: five layers, approach B, skeleton, enroll current git) and `eli5` (read-only HTML visual explanation under the target repo `.agent-artifacts/eli5/`).

Talk to the user in Traditional Chinese.

## License

Upstream MIT: `LICENSE.upstream`, `NOTICE`. Adaptations: `LICENSE`.
