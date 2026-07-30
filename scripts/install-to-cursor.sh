#!/usr/bin/env bash
# Install bl-* skills and commands into ~/.cursor for cross-project use.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_SRC="$ROOT/skills"
CMDS_SRC="$ROOT/commands"
SKILLS_DST="${CURSOR_SKILLS_DIR:-$HOME/.cursor/skills}"
CMDS_DST="${CURSOR_COMMANDS_DIR:-$HOME/.cursor/commands}"

mkdir -p "$SKILLS_DST" "$CMDS_DST"

echo "Installing skills → $SKILLS_DST"
for dir in "$SKILLS_SRC"/bl-*; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  target="$SKILLS_DST/$name"
  if [ -L "$target" ] || [ -e "$target" ]; then
    rm -rf "$target"
  fi
  ln -s "$dir" "$target"
  echo "  linked $name"
done

echo "Installing commands → $CMDS_DST"
for file in "$CMDS_SRC"/bl-*.md; do
  [ -f "$file" ] || continue
  name="$(basename "$file")"
  cp "$file" "$CMDS_DST/$name"
  echo "  wrote $name"
done

echo
echo "Done. Restart Cursor or open a new agent chat, then try /bl-setup"
echo "Skills are symlink'd; edit files under: $ROOT"
