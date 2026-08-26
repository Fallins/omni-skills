# Repository Agent Guide

## Start here

1. Read the docs listed below that match the task.
2. Inspect existing code and tests.
3. Check `git diff`.

## Sources of truth

- Architecture: `docs/architecture/`
- Conventions: `docs/development/`
- Domain: `docs/domain/`
- Decisions: `docs/decisions/`

## Required behavior

- Do not weaken types to silence errors.
- Prefer existing project abstractions.
- Run relevant validation before finishing.

## Context routing

- Task specs (if any) live in the configured omni-skills workspace, not in this git tree.
- Resolve with the omni-skills clone: `scripts/resolve-aw.sh`（套件路徑見 `~/.config/omni-skills/config.json` 的 `skillsSource`）。
