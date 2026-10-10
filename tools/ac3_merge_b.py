        )
    if "docs/DEVELOPMENT-PATH.md" in paths:
        old = (
            "- [ ] AC3 [any] Brisket's Crossing (the Frogger shape) and "
            "Ember Bricks (the Breakout shape), one PR each.\n"
        )
        new = line_with(ours["docs/DEVELOPMENT-PATH.md"], "draft PR #160")
        file = Path("docs/DEVELOPMENT-PATH.md")
        text = file.read_text()
        if "draft PR #160" not in text:
            if text.count(old) != 1:
                raise SystemExit("AC3 line missing")
            file.write_text(text.replace(old, new, 1))
        insert_after(
            "docs/DEVELOPMENT-PATH.md",
            "- **2026-10-10, ART-SF-5:**",
            lesson_block(ours["docs/DEVELOPMENT-PATH.md"]),
            "**2026-10-10, AC3:**",
        )

def check():
    readme = Path("README.md").read_text()
    start = Path("START-HERE.md").read_text()
    comms = Path("docs/COMMS.md").read_text()
    dev = Path("docs/DEVELOPMENT-PATH.md").read_text()
    if "Brisket's Crossing v0.1.0" not in readme or "SF2.6" not in readme:
        raise SystemExit("readme missing a note")
    if "AC3 Brisket's Crossing is draft" not in start or "#157" not in start:
        raise SystemExit("session log missing a note")
    if "### 2026-10-10 13:32" not in comms or "SF2.6" not in comms:
        raise SystemExit("comms missing a note")
    if "- [ ] AC3" not in dev or "- [x] AC3" in dev or "draft PR #160" not in dev:
        raise SystemExit("AC3 line wrong")
    if "- [x] SF2.6" not in dev or "**2026-10-10, AC3:**" not in dev:
        raise SystemExit("path ticks wrong")
    print("merge ok")

def main():
    subprocess.check_call(["git", "config", "user.name", "abarish-dev"])
    subprocess.check_call([
        "git", "config", "user.email",
        "319211409+abarish-dev@users.noreply.github.com",
    ])
    ours = {path: Path(path).read_text() for path in DOCS}
    subprocess.check_call(["git", "fetch", "origin", "main"])
    merged = subprocess.run(["git", "merge", "origin/main", "--no-edit"])
    if merged.returncode != 0:
        unmerged = subprocess.check_output(
            ["git", "diff", "--name-only", "--diff-filter=U"], text=True
        ).split()
        extra = [path for path in unmerged if path not in DOCS]
        if extra:
            raise SystemExit("unexpected conflicts " + " ".join(extra))
        if not unmerged:
            raise SystemExit("merge failed without conflicts")
        subprocess.check_call(["git", "checkout", "--theirs", *unmerged])
        restore(ours, set(unmerged))
        subprocess.check_call(["git", "add", *unmerged])
        still = subprocess.check_output(
            ["git", "diff", "--name-only", "--diff-filter=U"], text=True
        ).strip()
        if still:
            raise SystemExit("still unmerged\n" + still)
        subprocess.check_call(["git", "commit", "--no-edit"])
    check()

if __name__ == "__main__":
    main()
