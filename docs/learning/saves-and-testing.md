# Saves and testing (nobody loses progress; nothing ships broken)

Written 2026-10-09. Read this before changing what a game saves, and before saying "all checks pass".

## Saves that can't be lost
A save written straight over the old one can be cut off half-way (a crash, a power cut, a closed browser tab). The
half-written file won't read, and the game then thinks there is no journey at all. Both Godot games now save through
`scripts/safe_save.gd` (one file, copied in each game):

1. write the new save to a spare file (`journey.json.tmp`) and check it reads back whole;
2. rename the current save to the backup (`journey.json.bak`);
3. rename the spare into place.

Reading tries the save, then the spare, then the backup, and skips any that are broken or make no sense (Wildbond:
no team; Starfall: no coins or day). Tests prove a broken save and a missing save both fall back to the backup.
The browser games keep saves in localStorage, which writes all at once, and keep their own recovery backups
(`arcade-backup:*`, docs/test-runner-safety.md).

## Saves that keep loading (the "old saves load" rule)
- **New field:** give it a default when loading (`d.get("tavern", {})`), never assume it is there.
- **Changed meaning or layout:** raise the save's `"v"` number and add a small upgrade step that turns the old layout
  into the new one on load. Keep every upgrade step forever; a player may come back after a year.
- **Test it:** keep a copy of a save from before your change and check it loads (the Godot suites save, wipe and
  reload; add a check for your field).
- **Importing between versions** (browser Wildbond into Godot, WB6.3) is the same idea across games: read the old
  save, build a new one, never change the old one.

## The checks
| Suite | Covers | Count (2026-10-09) |
| --- | --- | --- |
| tests/run.html | Realmbound | 8,441 |
| tests/wildbond.html | browser Wildbond | 2,290 |
| tests/otherworld.html | Otherworld | 1,895 |
| tests/diamond.html | Diamond Career | 122 |
| tests/starfall.html | Starfall Guild (browser) | 48 |
| tests/runner-safety.html | test runners never touch real saves | 35 |
| tests/sound.html | shared sound | 21 |
| tests/offline.html | offline play | 15 |
| wildbond-godot/tests/run_tests.gd | Godot Wildbond | 277 |
| starfall-godot/tests/run_tests.gd | Godot Starfall | 119 |

**One command runs all ten:** `node tools/run-all-checks.cjs` from the repository folder. It serves the folder, opens
each page in a hidden browser, presses Run checks and reads the result, then runs both Godot suites if it finds Godot
(on Evan's PC it looks in `C:\Users\evanb\Godot`; elsewhere set `GODOT`). Name suites to run only some
(`node tools/run-all-checks.cjs wildbond`). It needs Node and Playwright (`npm i -g playwright`; it uses the
installed Chrome on Windows).

**GitHub runs it too** (`.github/workflows/checks.yml`) on every push to `main` and every pull request, on a clean
Linux machine with Godot 4.7.2. The pull request page shows a green tick or a red cross. **Rules:**
- Never merge a pull request with a red cross; open the run, read which suite failed, fix it.
- "All checks pass" in a session log or PR means the command above (or the tick) said so, not a guess.
- A new feature adds checks for what it does, in the suite of the game it belongs to.
- If a page can't run headless (it needs a click a machine can't make), say so in the PR; don't skip it silently.

## Testing as a player
Automatic checks prove the rules; they don't prove the game is fun or readable. After a visible change, look at the
real screen as a first-time player (docs/CREATIVE.md "Writing for players"), and for big steps do the 20-minute
newcomer pass in DEVELOPMENT-PATH.md Part 3.
