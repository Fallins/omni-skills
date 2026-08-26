# Domain Docs（agent-work）

How gs-* skills consume domain documentation. **All files live under AW**, not the business git repo.

## Project folder

`AW` 依 `docs/agent-work-and-setup.md`

## Before exploring, read these（from AW）

- **`AW/CONTEXT.md`**, or
- **`AW/CONTEXT-MAP.md`** if it exists — points at one `CONTEXT.md` per context
- **`AW/docs/adr/`** — ADRs for the area you’re working on

If these don’t exist yet, **proceed silently** (lazy create via domain-modeling / grill-with-docs).

## File structure（single-context，預設）

```
AW/
├── README.md
├── issue-tracker.md
├── domain.md
├── CONTEXT.md
├── docs/adr/
└── <feature>/
    ├── spec.md
    └── issues/
```

## Multi-context

If `AW/CONTEXT-MAP.md` exists, follow it for per-context `CONTEXT.md` / ADR paths **still under AW** (do not place them under business repo `src/`).

## Vocabulary

Use terms as defined in `AW/CONTEXT.md`. Flag ADR conflicts explicitly.
