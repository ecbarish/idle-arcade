"""Add AC3 project notes. One-shot."""
from pathlib import Path

def once(path, old, new):
    file = Path(path)
    text = file.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(path + " count " + str(count))
    file.write_text(text.replace(old, new, 1))

once(
    "README.md",
    "## Changelog\n\n",
    "## Changelog\n\n"
    "- Brisket's Crossing v0.1.0 (2026-10-10, AC3): help Pell's mule "
    "cross the wagon roads and the log jam, then light the far-bank lanterns. "
    "[Play](games/briskets-crossing/) · "
    "[PR #160](https://github.com/ecbarish/idle-arcade/pull/160), "
    "ready for review, not merged. Hub stays v1.5.1. "
    "Ember Bricks is a separate cabinet.\n",
)
once(
    "START-HERE.md",
    "## Session log (newest first; one or two lines each)\n\n",
    "## Session log (newest first; one or two lines each)\n\n"
    "- 2026-10-10 — Grok (Adam / abarish-dev, guest): AC3 Brisket's Crossing "
    "is draft [PR #160](https://github.com/ecbarish/idle-arcade/pull/160) "
    "(Frogger shape, original art, v0.1.0). Ready for review, not merged. "
    "Ember Bricks stays a separate unclaimed cabinet. No hub version bump.\n",
)
once(
    "docs/COMMS.md",
    "## Messages\n\n",
    "## Messages\n\n"
    "### 2026-10-10 13:32, Grok (Adam / abarish-dev) to all\n"
    "Claiming AC3 Brisket's Crossing as draft "
    "[PR #160](https://github.com/ecbarish/idle-arcade/pull/160) "
    "(`guest/briskets-crossing`). It plays start to finish: wagon roads, "
    "a log-jammed river, five lantern posts, high scores, and a phone layout. "
    "Not for merge until checks are green and someone reviews. "
    "Ember Bricks (the Breakout shape) is still free. "
    "One PR each; do not fold it into #160.\n\n",
)
once(
    "docs/DEVELOPMENT-PATH.md",
    "- [ ] AC3 [any] Brisket's Crossing (the Frogger shape) and "
    "Ember Bricks (the Breakout shape), one PR each.\n",
    "- [ ] AC3 [any] Brisket's Crossing (the Frogger shape) and "
    "Ember Bricks (the Breakout shape), one PR each. "
    "Brisket's Crossing is draft PR #160 (ready for review, not merged). "
    "Ember Bricks is still free.\n",
)
once(
    "docs/DEVELOPMENT-PATH.md",
    "- **2026-10-10, ART-SF-5:**",
    "- **2026-10-10, AC3:** a log has to carry the mule before the lane "
    "moves, or the log slides out from under them the same tick. "
    "A full set of lanterns rebuilds faster lanes. "
    "Open water and a cart each cost a life.\n\n"
    "- **2026-10-10, ART-SF-5:**",
)
dev = Path("docs/DEVELOPMENT-PATH.md").read_text()
if "- [x] AC3" in dev or "- [X] AC3" in dev:
    raise SystemExit("AC3 was ticked")
print("notes ok")
