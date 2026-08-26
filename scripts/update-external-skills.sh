#!/usr/bin/env bash
# Fetch third-party skill upstreams recorded in skills/*/UPSTREAM.md.
# Never overwrites adapted SKILL.md. Use for frontend-design, systematic-debugging,
# agent-browser (wrapper), and any future skill with UPSTREAM.md.
#
# gs-* still use scripts/sync-from-upstream.sh (mattpocock).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APPLY_LICENSE=0
MARK_SYNCED=0
SKILL_FILTER=""

usage() {
  cat <<EOF
Usage: update-external-skills.sh [skill-name] [--apply-license] [--mark-synced]

  Fetches each skills/<name>/UPSTREAM.md source into a temp dir, compares the
  recorded commit with upstream HEAD, and prints a diff of LICENSE / supporting
  files. Does not overwrite SKILL.md.

  --apply-license   copy upstream LICENSE into the skill dir (LICENSE.txt)
  --mark-synced     after you merge, write the fetched HEAD into UPSTREAM.md

Strategies:
  adapted mirror        fetch + manual merge into SKILL.md
  thin runtime wrapper  CLI is source of truth; usually only LICENSE may change
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply-license) APPLY_LICENSE=1; shift ;;
    --mark-synced) MARK_SYNCED=1; shift ;;
    -h|--help) usage; exit 0 ;;
    -*) echo "unknown arg: $1" >&2; usage; exit 2 ;;
    *) SKILL_FILTER="$1"; shift ;;
  esac
done

python3 - "$ROOT" "$SKILL_FILTER" "$APPLY_LICENSE" "$MARK_SYNCED" <<'PY'
from __future__ import annotations

import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

root = Path(sys.argv[1])
skill_filter = sys.argv[2] or None
apply_license = sys.argv[3] == "1"
mark_synced = sys.argv[4] == "1"
skills_root = root / "skills"


def parse_upstream(text: str) -> dict[str, str]:
    def field(label: str) -> str:
        m = re.search(rf"^-\s*{re.escape(label)}:\s*(.+)$", text, re.M)
        if not m:
            raise SystemExit(f"UPSTREAM.md missing field: {label}")
        return m.group(1).strip()

    return {
        "repository": field("Repository"),
        "path": field("Path"),
        "commit": field("Synced commit"),
        "strategy": field("Integration strategy"),
        "license": field("License"),
    }


def git(args: list[str], cwd: Path | None = None) -> str:
    return subprocess.check_output(["git", *args], cwd=cwd, text=True).strip()


def fetch_repo(repo: str, sparse_path: str, dest: Path) -> str:
    url = f"https://github.com/{repo}.git"
    subprocess.check_call(
        ["git", "clone", "--depth", "1", "--filter=blob:none", "--sparse", url, str(dest)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    subprocess.check_call(
        ["git", "sparse-checkout", "set", sparse_path],
        cwd=dest,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return git(["rev-parse", "HEAD"], cwd=dest)


def license_src(clone: Path, skill_path: Path) -> Path | None:
    for cand in (
        skill_path / "LICENSE.txt",
        skill_path / "LICENSE",
        clone / "LICENSE",
        clone / "LICENSE.txt",
    ):
        if cand.is_file():
            return cand
    try:
        text = git(["show", "HEAD:LICENSE"], cwd=clone)
    except subprocess.CalledProcessError:
        return None
    out = clone / "_HEAD_LICENSE"
    out.write_text(text)
    return out


def copy_if_changed(src: Path, dest: Path, apply: bool) -> str:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.is_file() and dest.read_bytes() == src.read_bytes():
        return "unchanged"
    if apply:
        shutil.copyfile(src, dest)
        return "copied"
    return "differs"


def main() -> None:
    dirs = sorted(p for p in skills_root.iterdir() if p.is_dir() and (p / "UPSTREAM.md").is_file())
    if skill_filter:
        dirs = [p for p in dirs if p.name == skill_filter]
        if not dirs:
            raise SystemExit(f"no UPSTREAM.md for skill {skill_filter}")

    if not dirs:
        print("no skills/*/UPSTREAM.md found")
        return

    tmp = Path(tempfile.mkdtemp(prefix="omni-skills-upstream-"))
    print(f"staging: {tmp}\n")

    for skill_dir in dirs:
        meta_path = skill_dir / "UPSTREAM.md"
        meta = parse_upstream(meta_path.read_text())
        name = skill_dir.name
        clone = tmp / name / "repo"
        clone.parent.mkdir(parents=True)
        print(f"== {name} ({meta['strategy']}) ==")
        print(f"   repo:   {meta['repository']}")
        print(f"   path:   {meta['path']}")
        print(f"   recorded: {meta['commit']}")
        new = fetch_repo(meta["repository"], meta["path"], clone)
        print(f"   fetched:  {new}")
        already = new == meta["commit"]
        if already:
            print("   status:  already at recorded commit")
        else:
            print("   status:  upstream moved — inspect before merging")

        upstream_skill = clone / meta["path"]
        fetched_copy = tmp / name / "files"
        if upstream_skill.is_dir():
            shutil.copytree(upstream_skill, fetched_copy, dirs_exist_ok=True)
        else:
            print(f"   warning: upstream path missing in clone: {upstream_skill}")
            continue

        if meta["strategy"] == "thin runtime wrapper":
            print("   note:    CLI is source of truth; do not copy upstream SKILL.md")
        else:
            print("   note:    adapted mirror — merge SKILL.md by hand, never overwrite")
            local_skill = skill_dir / "SKILL.md"
            remote_skill = fetched_copy / "SKILL.md"
            if local_skill.is_file() and remote_skill.is_file() and not already:
                diff = subprocess.run(
                    ["diff", "-u", str(local_skill), str(remote_skill)],
                    capture_output=True,
                    text=True,
                )
                print("   --- SKILL.md unified diff (local → fetched; do not apply blindly) ---")
                print(diff.stdout[:4000] + ("\n   ... truncated ...\n" if len(diff.stdout) > 4000 else ""))
            elif already:
                print("   SKILL.md: local adaptations vs upstream (expected; skipped dump)")

        lic = license_src(clone, upstream_skill)
        if lic is not None:
            dest_lic = skill_dir / "LICENSE.txt"
            state = copy_if_changed(lic, dest_lic, apply_license)
            print(f"   LICENSE.txt: {state}")
        else:
            print("   LICENSE.txt: not found upstream")

        for extra in sorted(fetched_copy.iterdir()):
            if extra.name in {"SKILL.md", "LICENSE.txt", "LICENSE"}:
                continue
            local = skill_dir / extra.name
            if extra.is_file():
                if local.is_file():
                    same = extra.read_bytes() == local.read_bytes()
                    print(f"   supporting {extra.name}: {'same' if same else 'DIFFERS — merge by hand'}")
                else:
                    print(f"   supporting {extra.name}: present upstream, not vendored locally")

        if mark_synced and new != meta["commit"]:
            text = meta_path.read_text()
            updated = re.sub(
                r"^(-\s*Synced commit:\s*).+$",
                rf"\g<1>{new}",
                text,
                count=1,
                flags=re.M,
            )
            meta_path.write_text(updated)
            print(f"   UPSTREAM.md: Synced commit -> {new}")
        print()

    print("Next:")
    print("  1. Read fetched files under the staging dir above")
    print("  2. Merge into skills/<name>/SKILL.md (keep local adaptations)")
    print("  3. Re-run with --apply-license if LICENSE changed")
    print("  4. Re-run with --mark-synced after the merge is done")


if __name__ == "__main__":
    main()
PY
