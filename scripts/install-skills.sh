#!/usr/bin/env bash
# Install omni-skills into user-level Agent skill directories.
# Ask (or accept flags) for tools, commandPrefix, workspaceRoot; write config; symlink; Cursor commands.
set -euo pipefail

KIT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_PY="$KIT/scripts/omni_config.py"
NO_SLASH="gs-grill-core"

COMMAND_PREFIX=""
WORKSPACE_ROOT=""
LAYOUT=""
TOOLS=""
YES=0
SKIP_BRIDGE=0
PERSONAL_SUB="/Personal/"

usage() {
  cat <<EOF
Usage: install-skills.sh [options]

  --command-prefix PREFIX   Cursor slash extra prefix (default empty)
  --workspace-root PATH     agent-work clone path (omit for scratch layout)
  --layout work-personal|scratch
  --tools LIST              comma list: cursor,codex,claude,antigravity
  --personal-substring STR  path fragment treated as personal lane (default /Personal/)
  --yes                     non-interactive (use flags / existing config / defaults)
  --skip-bridge             do not write home-dir approach-B snippets
  -h, --help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --command-prefix) COMMAND_PREFIX="${2:-}"; shift 2 ;;
    --workspace-root) WORKSPACE_ROOT="${2:-}"; shift 2 ;;
    --layout) LAYOUT="${2:-}"; shift 2 ;;
    --tools) TOOLS="${2:-}"; shift 2 ;;
    --personal-substring) PERSONAL_SUB="${2:-}"; shift 2 ;;
    --yes) YES=1; shift ;;
    --skip-bridge) SKIP_BRIDGE=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown arg: $1" >&2; usage; exit 2 ;;
  esac
done

prompt() {
  local q="$1"
  local def="$2"
  local ans=""
  if [[ -n "$def" ]]; then
    read -r -p "$q [$def]: " ans || true
    echo "${ans:-$def}"
  else
    read -r -p "$q: " ans || true
    echo "$ans"
  fi
}

if [[ "$YES" -eq 0 && -t 0 ]]; then
  echo "omni-skills 安裝（套件：$KIT）"
  TOOLS="$(prompt "要安裝的工具（comma：cursor,codex,claude,antigravity）" "${TOOLS:-cursor,codex,claude,antigravity}")"
  COMMAND_PREFIX="$(prompt "Cursor slash 額外前綴（族名已是 gs-setup，通常留空）" "$COMMAND_PREFIX")"
  local_ws="$(prompt "是否使用 agent-work 工作區？(y/N)" "N")"
  if [[ "$local_ws" == [yY] ]]; then
    LAYOUT="work-personal"
    WORKSPACE_ROOT="$(prompt "workspaceRoot 絕對路徑" "${WORKSPACE_ROOT:-$HOME/Documents/Git/Personal/omni-agent-work}")"
  else
    LAYOUT="${LAYOUT:-scratch}"
    WORKSPACE_ROOT=""
  fi
  PERSONAL_SUB="$(prompt "個人 repo 路徑片段" "$PERSONAL_SUB")"
else
  TOOLS="${TOOLS:-cursor,codex,claude,antigravity}"
  if [[ -z "$LAYOUT" ]]; then
    if [[ -n "$WORKSPACE_ROOT" ]]; then
      LAYOUT="work-personal"
    else
      LAYOUT="scratch"
    fi
  fi
fi

python3 - "$CONFIG_PY" "$KIT" "$COMMAND_PREFIX" "$WORKSPACE_ROOT" "$LAYOUT" "$TOOLS" "$PERSONAL_SUB" <<'PY'
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(sys.argv[1]).parent))
import omni_config
kit, prefix, ws, layout, tools, personal = sys.argv[2:8]
data = omni_config.load()
data["commandPrefix"] = prefix
data["workspaceRoot"] = ws or None
data["layout"] = layout
data["tools"] = [t.strip() for t in tools.split(",") if t.strip()]
data["personalPathSubstring"] = personal
data["skillsSource"] = kit
path = omni_config.save(data)
print("wrote", path)
PY

eval "$("$CONFIG_PY" dump-env)"

link_skills() {
  local dest="$1"
  mkdir -p "$dest"
  local dir name
  for dir in "$KIT/skills"/*; do
    [[ -d "$dir" ]] || continue
    name="$(basename "$dir")"
    ln -sfn "$dir" "$dest/$name"
    echo "  linked $name -> $dest/"
  done
  # drop old kit names so they do not collide
  local old
  for old in bl-setup bl-to-spec bl-to-tickets bl-implement bl-grill-me bl-grill-with-docs bl-grilling bl-tdd bl-code-review bl-diagnosing-bugs bl-handoff bl-domain-modeling ctx-enroll; do
    if [[ -L "$dest/$old" || -e "$dest/$old" ]]; then
      rm -f "$dest/$old"
      echo "  removed stale $dest/$old"
    fi
  done
}

echo "Skills"
IFS=',' read -r -a TOOL_ARR <<<"$OMNI_TOOLS"
for tool in "${TOOL_ARR[@]}"; do
  case "$tool" in
    cursor) link_skills "${CURSOR_SKILLS_DIR:-$HOME/.cursor/skills}" ;;
    codex)
      link_skills "${AGENTS_SKILLS_DIR:-$HOME/.agents/skills}"
      link_skills "${CODEX_SKILLS_DIR:-$HOME/.codex/skills}"
      ;;
    claude) link_skills "${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}" ;;
    antigravity)
      link_skills "${GEMINI_SKILLS_DIR:-$HOME/.gemini/config/skills}"
      link_skills "${AGY_CLI_SKILLS_DIR:-$HOME/.gemini/antigravity-cli/skills}"
      ;;
    *) echo "  skip unknown tool: $tool" >&2 ;;
  esac
done

python3 - "$KIT" "$OMNI_COMMAND_PREFIX" "${CURSOR_COMMANDS_DIR:-$HOME/.cursor/commands}" "$NO_SLASH" <<'PY'
import sys
from pathlib import Path
kit = Path(sys.argv[1])
prefix = sys.argv[2]
dest = Path(sys.argv[3])
no_slash = set(sys.argv[4].split(","))
dest.mkdir(parents=True, exist_ok=True)
# remove old generated names
for stale in dest.glob("bl-*.md"):
    stale.unlink()
    print("  removed stale command", stale.name)
ctx = dest / "ctx-enroll.md"
if ctx.exists():
    ctx.unlink()
    print("  removed stale command ctx-enroll.md")
for skill_dir in sorted((kit / "skills").iterdir()):
    if not skill_dir.is_dir():
        continue
    name = skill_dir.name
    if name in no_slash:
        continue
    skill = skill_dir / "SKILL.md"
    desc = name
    if skill.is_file():
        text = skill.read_text()
        if text.startswith("---"):
            parts = text.split("---", 2)
            if len(parts) >= 3:
                for line in parts[1].splitlines():
                    if line.startswith("description:"):
                        rest = line[len("description:") :].strip()
                        if rest and rest != ">":
                            desc = rest.strip("\"'")
                        break
                    if line.startswith("  ") and "description" in parts[1]:
                        pass
                # folded description
                lines = parts[1].splitlines()
                for i, line in enumerate(lines):
                    if line.startswith("description:"):
                        rest = line.split(":", 1)[1].strip()
                        if rest in {">-", ">"}:
                            bits = []
                            for extra in lines[i + 1 :]:
                                if extra.startswith("  "):
                                    bits.append(extra.strip())
                                elif extra.strip() == "":
                                    continue
                                else:
                                    break
                            if bits:
                                desc = " ".join(bits)
                        elif rest:
                            desc = rest.strip("\"'")
                        break
    fname = f"{prefix}{name}.md"
    home = Path.home()
    body = (
        "---\n"
        f"description: {desc}\n"
        "---\n\n"
        f"讀取並嚴格遵循已安裝 skill：`{home}/.cursor/skills/{name}/SKILL.md`。\n\n"
        "與使用者對話使用繁體中文。完成後依該 skill「下一步建議」提示後續命令（若有）。\n"
    )
    (dest / fname).write_text(body)
    print("  wrote", fname)
PY

if [[ "$SKIP_BRIDGE" -eq 0 && "$LAYOUT" == "work-personal" && -n "$WORKSPACE_ROOT" ]]; then
  BRIDGE_FILLED="$(mktemp)"
  sed -e "s|{{WORKSPACE_ROOT}}|$WORKSPACE_ROOT|g" \
      -e "s|{{PERSONAL_SUBSTRING}}|$PERSONAL_SUB|g" \
      "$KIT/templates/home-bridge.md" >"$BRIDGE_FILLED"

  upsert_marked() {
    local dest="$1"
    local start="<!-- BEGIN:agent-work-bridge -->"
    local end="<!-- END:agent-work-bridge -->"
    mkdir -p "$(dirname "$dest")"
    local block
    block=$(printf '%s\n\n%s\n\n%s\n' "$start" "$(cat "$BRIDGE_FILLED")" "$end")
    if [[ -f "$dest" ]] && grep -q "$start" "$dest"; then
      python3 - "$dest" "$block" "$start" "$end" <<'PY'
from pathlib import Path
import sys
path, block, start, end = Path(sys.argv[1]), sys.argv[2], sys.argv[3], sys.argv[4]
text = path.read_text()
pre, rest = text.split(start, 1)
_, post = rest.split(end, 1)
path.write_text(pre + block + post)
PY
      echo "  updated bridge in $dest"
    else
      {
        if [[ -f "$dest" ]]; then
          cat "$dest"
          printf '\n\n'
        fi
        printf '%s\n' "$block"
      } >"$dest.tmp"
      mv "$dest.tmp" "$dest"
      echo "  appended bridge to $dest"
    fi
  }

  echo "Home bridge"
  upsert_marked "${CODEX_AGENTS_MD:-$HOME/.codex/AGENTS.md}"
  upsert_marked "${CLAUDE_MD:-$HOME/.claude/CLAUDE.md}"
  upsert_marked "${GEMINI_MD:-$HOME/.gemini/GEMINI.md}"

  RULE="${CURSOR_RULES_DIR:-$HOME/.cursor/rules}/agent-work-bridge.mdc"
  mkdir -p "$(dirname "$RULE")"
  cat >"$RULE" <<EOF
---
alwaysApply: true
---
$(cat "$BRIDGE_FILLED")
EOF
  echo "  wrote $RULE"
  rm -f "$BRIDGE_FILLED"
fi

echo
echo "Done. Config: $("$CONFIG_PY" path)"
echo "Try /${OMNI_COMMAND_PREFIX}enroll or /${OMNI_COMMAND_PREFIX}gs-setup"
echo "Skill bodies remain under: $KIT/skills"
