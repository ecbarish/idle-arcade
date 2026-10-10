"""Merge current main into the Brisket branch and keep both notes. One-shot."""
import subprocess
from pathlib import Path

DOCS = (
    "README.md",
    "START-HERE.md",
    "docs/COMMS.md",
    "docs/DEVELOPMENT-PATH.md",
)

def line_with(text, marker):
    for line in text.splitlines(keepends=True):
        if marker in line:
            return line
    raise SystemExit("missing " + marker)

def comms_block(text):
    lines = text.splitlines(keepends=True)
    for index, line in enumerate(lines):
        if "### 2026-10-10 13:32" in line:
            end = index + 1
            while end < len(lines) and lines[end].strip():
                end += 1
            if end < len(lines):
                end += 1
            return "".join(lines[index:end])
    raise SystemExit("missing comms note")

def lesson_block(text):
    lines = text.splitlines(keepends=True)
    for index, line in enumerate(lines):
        if "**2026-10-10, AC3:**" in line:
            chunk = line
            if index + 1 < len(lines) and lines[index + 1].strip() == "":
                chunk += lines[index + 1]
            return chunk
    raise SystemExit("missing lesson")

def insert_after(path, anchor, chunk, marker):
    file = Path(path)
    text = file.read_text()
    if marker in text:
        return
    count = text.count(anchor)
    if count != 1:
        raise SystemExit(path + " anchor " + str(count))
    file.write_text(text.replace(anchor, anchor + chunk, 1))

def restore(ours, paths):
    if "README.md" in paths:
        insert_after(
            "README.md",
            "## Changelog\n\n",
            line_with(ours["README.md"], "Brisket's Crossing v0.1.0"),
            "Brisket's Crossing v0.1.0",
        )
    if "START-HERE.md" in paths:
        insert_after(
            "START-HERE.md",
            "## Session log (newest first; one or two lines each)\n\n",
            line_with(ours["START-HERE.md"], "AC3 Brisket's Crossing is draft"),
            "AC3 Brisket's Crossing is draft",
        )
    if "docs/COMMS.md" in paths:
        insert_after(
            "docs/COMMS.md",
            "## Messages\n\n",
            comms_block(ours["docs/COMMS.md"]),
            "### 2026-10-10 13:32",
