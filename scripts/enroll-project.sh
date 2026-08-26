#!/usr/bin/env bash
# Enroll the current (or given) git repo into the configured workspace.
set -euo pipefail

KIT="$(cd "$(dirname "$0")/.." && pwd)"
eval "$("$KIT/scripts/omni_config.py" dump-env)"
chmod +x "$KIT/scripts/resolve-aw.sh" "$KIT/scripts/init-workspace.sh"

LANE=""
TARGET=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --lane)
      LANE="${2:-}"
      shift 2
      ;;
    --help|-h)
      echo "Usage: enroll-project.sh [--lane work|personal] [git-root]"
      exit 0
      ;;
    *)
      TARGET="$1"
      shift
      ;;
  esac
done

if [[ -n "$TARGET" ]]; then
  cd "$TARGET"
fi

TOP="$(git rev-parse --show-toplevel)"
REPO="$(basename "$TOP")"
PERSONAL_SUB="${OMNI_PERSONAL_SUBSTRING:-/Personal/}"
LAYOUT="${OMNI_LAYOUT:-scratch}"
AW_ROOT="${AGENT_WORK_ROOT:-$OMNI_WORKSPACE_ROOT}"

if [[ -z "$LANE" ]]; then
  if [[ "$TOP" == *"$PERSONAL_SUB"* ]]; then
    LANE="personal"
  else
    LANE="work"
  fi
fi

if [[ "$LAYOUT" == "scratch" || -z "$AW_ROOT" ]]; then
  AW="$TOP/.scratch/$REPO"
  mkdir -p "$AW/docs/adr"
  GITIGNORE="$TOP/.gitignore"
  if [[ -f "$GITIGNORE" ]]; then
    if ! grep -qE '(^|/)\.scratch/' "$GITIGNORE"; then
      printf '\n# omni-skills local workspace\n.scratch/\n' >>"$GITIGNORE"
      echo "appended .scratch/ to $GITIGNORE"
    fi
  else
    printf '# omni-skills local workspace\n.scratch/\n' >"$GITIGNORE"
    echo "wrote $GITIGNORE"
  fi
else
  if [[ "$LANE" != "work" && "$LANE" != "personal" ]]; then
    echo "lane must be work or personal" >&2
    exit 1
  fi
  "$KIT/scripts/init-workspace.sh" "$AW_ROOT"
  AW="$AW_ROOT/$LANE/$REPO"
  mkdir -p "$AW/docs/adr"
fi

TRACKER="$AW/issue-tracker.md"
if [[ ! -f "$TRACKER" ]]; then
  sed -e "s|<LANE>|$LANE|g" \
      -e "s|<REPO_NAME>|$REPO|g" \
      -e "s|<WORKSPACE_ROOT>|${AW_ROOT:-$TOP/.scratch}|g" \
      "$KIT/templates/issue-tracker-local.md" >"$TRACKER"
  echo "wrote $TRACKER"
else
  echo "keep $TRACKER"
fi

README="$AW/README.md"
if [[ ! -f "$README" ]]; then
  if [[ "$LAYOUT" != "scratch" && "$LANE" == "work" ]]; then
    sed "s|<REPO_NAME>|$REPO|g" "$KIT/templates/work-readme.md" >"$README"
  else
    cat >"$README" <<EOF
# $REPO

對應 git：\`$TOP\`

任務／spec 放此目錄。專案地圖以該 git 的 \`AGENTS.md\` 為準（不進這棵樹，公司 repo 除外：公司不要改業務 git）。
EOF
  fi
  echo "wrote $README"
else
  echo "keep $README"
fi

if [[ "$LAYOUT" != "scratch" && "$LANE" == "personal" ]]; then
  if [[ ! -f "$TOP/AGENTS.md" ]]; then
    cp "$KIT/templates/AGENTS.md" "$TOP/AGENTS.md"
    echo "wrote $TOP/AGENTS.md"
  fi
  if [[ ! -f "$TOP/CLAUDE.md" ]]; then
    cp "$KIT/templates/CLAUDE.md" "$TOP/CLAUDE.md"
    echo "wrote $TOP/CLAUDE.md"
  fi
  mkdir -p "$TOP/docs/architecture" "$TOP/docs/development" "$TOP/docs/domain" "$TOP/docs/decisions"
fi

if [[ "$LAYOUT" != "scratch" && -n "$AW_ROOT" ]]; then
  python3 - "$AW_ROOT" <<'PY'
from pathlib import Path
import sys
root = Path(sys.argv[1])
work_dir = root / "work"
pers_dir = root / "personal"
work = sorted(p.name for p in work_dir.iterdir() if p.is_dir() and not p.name.startswith("_")) if work_dir.is_dir() else []
pers = sorted(p.name for p in pers_dir.iterdir() if p.is_dir() and not p.name.startswith("_")) if pers_dir.is_dir() else []
lines = ["# 已納管索引", "", "由 enroll-project.sh 產生。", "", "## work", ""]
lines += [f"- `{n}`" for n in work]
lines += ["", "## personal", ""]
lines += [f"- `{n}`" for n in pers]
lines.append("")
path = root / "INDEX.md"
path.write_text("\n".join(lines))
print("refreshed", path)
PY
fi

echo "enrolled $REPO as $LANE -> $AW"
