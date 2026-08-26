#!/usr/bin/env python3
"""Read and write ~/.config/omni-skills/config.json (no hardcoded home-repo paths)."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

DEFAULT_PATH = Path.home() / ".config" / "omni-skills" / "config.json"

DEFAULTS: dict[str, Any] = {
    "commandPrefix": "",
    "workspaceRoot": None,
    "layout": "scratch",
    "tools": ["cursor", "codex", "claude", "antigravity"],
    "personalPathSubstring": "/Personal/",
    "skillsSource": None,
}


def config_path() -> Path:
    raw = os.environ.get("OMNI_CONFIG")
    if raw:
        return Path(raw).expanduser()
    return DEFAULT_PATH


def load() -> dict[str, Any]:
    path = config_path()
    data = dict(DEFAULTS)
    if path.is_file():
        loaded = json.loads(path.read_text())
        if isinstance(loaded, dict):
            data.update(loaded)
    return data


def save(data: dict[str, Any]) -> Path:
    path = config_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    merged = dict(DEFAULTS)
    merged.update({k: v for k, v in data.items() if v is not None or k in data})
    path.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + "\n")
    return path


def dump_env() -> None:
    data = load()
    tools = data.get("tools") or []
    ws = data.get("workspaceRoot") or ""
    src = data.get("skillsSource") or ""
    prefix = data.get("commandPrefix") or ""
    layout = data.get("layout") or "scratch"
    personal = data.get("personalPathSubstring") or "/Personal/"
    print(f"OMNI_COMMAND_PREFIX={prefix}")
    print(f"OMNI_WORKSPACE_ROOT={ws}")
    print(f"OMNI_LAYOUT={layout}")
    print(f"OMNI_TOOLS={','.join(tools)}")
    print(f"OMNI_PERSONAL_SUBSTRING={personal}")
    print(f"OMNI_SKILLS_SOURCE={src}")


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1] in {"-h", "--help"}:
        print("Usage: omni_config.py dump-env | get <key> | path", file=sys.stderr)
        sys.exit(2)
    cmd = sys.argv[1]
    if cmd == "dump-env":
        dump_env()
        return
    if cmd == "path":
        print(config_path())
        return
    if cmd == "get" and len(sys.argv) >= 3:
        val = load().get(sys.argv[2])
        if val is None:
            print("")
        elif isinstance(val, list):
            print(",".join(str(x) for x in val))
        else:
            print(val)
        return
    print("unknown command", file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
