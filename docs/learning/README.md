# Learning notes (how we build, and why)

Written 2026-10-09 by Claude after Evan asked: "research the project and make sure we're using best methods and add
any education we're missing." The design side of the arcade is well documented (docs/research/, docs/plans/,
docs/lore/); the **craft** side (how the games are built, saved, tested and shipped) lived only in people's heads.
These pages fix that. Every assistant reads the page for the area it touches; Evan can read any of them in plain words.

| Page | Read it when | In one line |
| --- | --- | --- |
| [glossary.md](glossary.md) | Any word in a session log makes no sense | Plain-words meanings of the technical words we use |
| [godot-practices.md](godot-practices.md) | Working in `wildbond-godot/` or `starfall-godot/` | How our Godot games measure up to Godot's own advice, and the rules we now follow |
| [saves-and-testing.md](saves-and-testing.md) | Changing what a game saves, or adding a feature | Saves that can't be lost, saves that keep loading, and the one command that runs every check |
| [web-and-shipping.md](web-and-shipping.md) | Rebuilding `play/`, adding sound or art, or publishing | Download size, sound formats, and keeping the repository from growing too large |

**The review, 2026-10-09 (what was checked and what came of it):**

| Area | What we found | What we did |
| --- | --- | --- |
| Saving (both Godot games) | A save was written straight over the old one every five seconds; a crash or closed tab mid-write could leave a broken file and the title would offer a new game | Safe saving: spare file first, last good save kept as a backup, read falls back (`scripts/safe_save.gd`, 7 new checks) |
| Sound files | Wildbond's place sounds were WAV (17 MB); two tunes were stored twice | OGG Vorbis (1.1 MB); shared tunes share one file. Web download 25.3 MB to 20.0 MB |
| Godot import settings | `*.import` files were ignored, against Godot's advice | Committed, so every computer and assistant builds the same game |
| Line endings | No rules; Windows and Linux machines both commit | `.gitattributes`: LF for text, CRLF for `.bat`/`.ps1`, binary for media |
| Testing | Ten suites, each run by hand; "all pass" was taken on trust | `node tools/run-all-checks.cjs` runs all ten; GitHub runs it on every push and pull request |
| Repository size | `.git` is 284 MB, mostly old web builds (each Wildbond rebuild adds ~20 MB) | Rule: rebuild `play/` at milestones, not every step. Proposal for building on GitHub instead: web-and-shipping.md |
| Code shape | Wildbond's `main.gd` is 3,600 lines; keys are read directly; no sound buses | Rules for growing out of it gradually, tied to the deliverables that need it (godot-practices.md) |

Sources consulted: Godot's documentation (best practices, version control, import process, exporting for the web,
saving games), GitHub's documentation (Pages limits, Actions), and the state of this repository on 2026-10-09.
