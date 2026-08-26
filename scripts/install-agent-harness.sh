#!/usr/bin/env bash
# Back-compat wrapper for the previous harness name.
exec "$(cd "$(dirname "$0")" && pwd)/install-skills.sh" "$@"
