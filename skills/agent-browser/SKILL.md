---
name: agent-browser
description: >-
  Use real browser automation to navigate and test web applications, interact
  with UI, fill forms, capture screenshots, reproduce browser bugs, perform
  exploratory QA, and verify actual browser behavior. Requires the external
  agent-browser CLI.
license: Complete terms in LICENSE.txt
---

# agent-browser

Use `agent-browser` when the task requires interaction with a real browser.

The CLI is the runtime source of truth for commands and workflows.

Installing this skill is not the same as installing the `agent-browser` CLI.
omni-skills installs the skill; browser automation still needs the CLI.

## Start

Before running browser automation, verify the runtime exists:

```bash
command -v agent-browser
```

If available, load the current core workflow:

```bash
agent-browser skills get core
```

Follow the returned workflow for browser interaction.

Load the full command reference only when necessary:

```bash
agent-browser skills get core --full
```

Avoid loading `--full` by default when the core workflow is sufficient.

## Specialized workflows

When the requested task requires functionality beyond ordinary browser-page
automation, inspect the skills available in the installed CLI:

```bash
agent-browser skills list
```

Load only the relevant specialized workflow:

```bash
agent-browser skills get <skill>
```

Do not preload unrelated workflows.

## Missing runtime

If `agent-browser` is unavailable, report that the runtime dependency is
missing and provide the installation commands:

```bash
npm install -g agent-browser
agent-browser install
```

Do not silently install a global package as part of an unrelated task.

## Browser interaction principle

Use the interaction model supplied by the installed runtime.

For ordinary browser automation, prefer the runtime's accessibility snapshot
and element-reference workflow rather than guessing selectors or page state.

After navigation or substantial page changes, refresh browser state before
continuing interactions.

---

Adapted/wrapped for Fallins/omni-skills.
Original skill: vercel-labs/agent-browser — agent-browser.
Runtime workflow remains upstream CLI-served.
