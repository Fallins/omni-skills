# Upstream

- Repository: vercel-labs/agent-browser
- Path: skills/agent-browser
- Synced commit: 8934fdb7ff5c016b46d473454ec51c0df814bead
- Integration strategy: thin runtime wrapper
- License: Apache-2.0

## Local integration

omni-skills intentionally stores only the discovery/runtime-loading wrapper.

The installed `agent-browser` CLI is the source of truth for current workflows
and command documentation through:

`agent-browser skills get core`
