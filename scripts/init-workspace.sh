#!/usr/bin/env bash
# Create agent-work skeleton under workspaceRoot if missing. Does not overwrite.
set -euo pipefail

KIT="$(cd "$(dirname "$0")/.." && pwd)"
eval "$("$KIT/scripts/omni_config.py" dump-env)"

ROOT="${1:-$OMNI_WORKSPACE_ROOT}"
if [[ -z "$ROOT" ]]; then
  echo "init-workspace.sh: no workspaceRoot (pass path or set config)" >&2
  exit 1
fi

mkdir -p "$ROOT/_global" "$ROOT/work/_addon" "$ROOT/personal/_playbook" "$ROOT/personal/_stacks"

copy_if_missing() {
  local src="$1"
  local dest="$2"
  if [[ ! -f "$dest" ]]; then
    cp "$src" "$dest"
    echo "wrote $dest"
  else
    echo "keep $dest"
  fi
}

copy_if_missing "$KIT/templates/workspace/README.md" "$ROOT/README.md"
copy_if_missing "$KIT/templates/workspace/INDEX.md" "$ROOT/INDEX.md"
copy_if_missing "$KIT/templates/workspace/gitignore" "$ROOT/.gitignore"
copy_if_missing "$KIT/templates/workspace/habits.md" "$ROOT/_global/habits.md"
copy_if_missing "$KIT/templates/workspace/skills.md" "$ROOT/_global/skills.md"
copy_if_missing "$KIT/templates/workspace/addon.md" "$ROOT/work/_addon/README.md"
copy_if_missing "$KIT/templates/workspace/playbook.md" "$ROOT/personal/_playbook/README.md"
echo "workspace skeleton ready at $ROOT"
