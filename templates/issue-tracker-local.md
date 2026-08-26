# Issue tracker: Local Markdown

All specs and tickets for this repo live under the configured workspace (`AW`), not the business git tree (work-personal layout) or under `.scratch/` (scratch layout).

## This project

- Workspace root: `<WORKSPACE_ROOT>`
- Project folder: `<WORKSPACE_ROOT>/<LANE>/<REPO_NAME>/` （scratch 時即 git 根下 `.scratch/<REPO_NAME>/`）

Replace `<LANE>` with `work` or `personal`. Replace `<REPO_NAME>` with the git root directory name.

## Conventions

- One feature per directory: `<feature-slug>/`
- Spec: `<feature-slug>/spec.md`
- Tickets: `<feature-slug>/issues/<NN>-<slug>.md` from `01`

## Related domain docs（same tree）

- Glossary: `CONTEXT.md`
- ADRs: `docs/adr/`
- Domain skill config: `domain.md`
