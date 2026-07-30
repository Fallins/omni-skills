#!/usr/bin/env bash
# Fetch latest mattpocock/skills into a temp dir and print paths for manual merge.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UPSTREAM_REF="${1:-main}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 --branch "$UPSTREAM_REF" https://github.com/mattpocock/skills.git "$TMP/skills" >/dev/null
NEW_COMMIT="$(git -C "$TMP/skills" rev-parse HEAD)"
OLD_COMMIT="$(cat "$ROOT/.upstream-commit" 2>/dev/null || echo none)"

echo "Previous upstream: $OLD_COMMIT"
echo "Fetched upstream:  $NEW_COMMIT"
echo "Checkout at:       $TMP/skills"
echo "Compare engineering skills under skills/engineering and skills/productivity,"
echo "then manually merge into $ROOT/skills/bl-*"
echo "When done: echo $NEW_COMMIT > $ROOT/.upstream-commit"
