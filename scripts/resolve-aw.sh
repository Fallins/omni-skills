#!/usr/bin/env bash
# Resolve the agent workspace folder (AW) for a git repo directory name.
# Prints an absolute path.
# layout=work-personal: prefers work/<repo> then personal/<repo>.
# layout=scratch or no config: <git-root>/.scratch/<repo>
set -euo pipefail

KIT="$(cd "$(dirname "$0")/.." && pwd)"
eval "$("$KIT/scripts/omni_config.py" dump-env)"

REPO="${1:-}"
TOP=""
if git rev-parse --show-toplevel >/dev/null 2>&1; then
  TOP="$(git rev-parse --show-toplevel)"
fi

if [[ -z "$REPO" ]]; then
  if [[ -n "$TOP" ]]; then
    REPO="$(basename "$TOP")"
  else
    echo "resolve-aw.sh: not in a git repo and no name given" >&2
    exit 1
  fi
fi

AW_ROOT="${AGENT_WORK_ROOT:-$OMNI_WORKSPACE_ROOT}"
LAYOUT="${OMNI_LAYOUT:-scratch}"
PERSONAL_SUB="${OMNI_PERSONAL_SUBSTRING:-/Personal/}"

if [[ -z "$AW_ROOT" || "$LAYOUT" == "scratch" ]]; then
  if [[ -z "$TOP" ]]; then
    echo "resolve-aw.sh: scratch layout needs a git repo" >&2
    exit 1
  fi
  echo "$TOP/.scratch/$REPO"
  exit 0
fi

work="$AW_ROOT/work/$REPO"
personal="$AW_ROOT/personal/$REPO"

if [[ -f "$work/issue-tracker.md" ]]; then
  echo "$work"
  exit 0
fi
if [[ -f "$personal/issue-tracker.md" ]]; then
  echo "$personal"
  exit 0
fi

lane="work"
if [[ -n "$TOP" && "$TOP" == *"$PERSONAL_SUB"* ]]; then
  lane="personal"
fi

echo "$AW_ROOT/$lane/$REPO"
