# Upstream

- Repository: vercel-labs/agent-browser
- Path: skills/agent-browser
- Synced commit: dac13bb87468fe9d74a040d862720f6cc17a9565
- Integration strategy: thin runtime wrapper
- License: Apache-2.0

## Local integration

omni-skills intentionally stores only the discovery/runtime-loading wrapper.

The installed `agent-browser` CLI is the source of truth for current workflows
and command documentation through:

`agent-browser skills get core`
