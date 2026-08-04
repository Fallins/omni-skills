# Issue tracker: Local Markdown（agent-work only）

All specs and tickets for this business repo live under **agent-work**. Nothing is written into the business git tree (no `.scratch/`, no `docs/agents/` pointer).

## This project

- Agent-work root: `~/Documents/Git/agent-work`
- Project folder: `~/Documents/Git/agent-work/<REPO_NAME>/`
- Replace `<REPO_NAME>` with the business repo directory name.

## Conventions

- One feature per directory: `<project>/<feature-slug>/`
- Spec: `<feature-slug>/spec.md`
- Tickets: `<feature-slug>/issues/<NN>-<slug>.md` from `01`
- `Status:` near top; comments under `## Comments`

## Publish / fetch

Create or read files only under this project folder in agent-work.

## Related domain docs（same tree）

- Glossary: `CONTEXT.md`
- ADRs: `docs/adr/`
- Domain skill config: `domain.md`
