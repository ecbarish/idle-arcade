# Godot practices (how our Godot games are built, and the rules from here on)

Reviewed 2026-10-09 against Godot's documentation (best practices, version control, import process, saving games,
exporting for the web) and the code as it stood (Wildbond 277 checks, Starfall 119). Read this before working in
`wildbond-godot/` or `starfall-godot/`.

## What we already do well (keep doing it)
- **Pixel-perfect setup:** a 384x216 viewport, integer scaling, `canvas_items` stretch, nearest filtering and 2D
  pixel snapping (`project.godot`). This is the textbook setup for crisp pixel art at any window size.
- **Data in files, not code:** species, maps, lines and stories come from JSON (`data/*.json`), much of it exported from
  the browser game. Writers (ChatGPT) can change content without touching code.
- **Scripts loaded by path with `preload`** rather than global class names, so a fresh copy of the project runs
  without the editor having to rebuild a class list first.
- **Tests that play the game:** `tests/run_tests.gd` drives the real scene by hand in fixed 0.05 s steps, so results
  never depend on how fast the computer is, and exits with a failure code so a machine can read it.
- **Saves live in `user://`** as readable JSON with a version number (`"v": 1`), and tests never touch a real save.
- **Comments that explain the why** in the player's terms, and doc comments (`##`) on functions.

## Fixed on 2026-10-09
- **Safe saving** (`scripts/safe_save.gd`, the same file in both games): see saves-and-testing.md.
- **`.import` files are committed.** Godot's documentation says to commit them (they hold each asset's import
  settings) and to ignore only the `.godot/` folder. They were ignored before, so a fresh copy (a new PC, a cloud
  session, GitHub's checks) imported everything with defaults. Rule: when you add an asset, commit its `.import` file.
- **`.uid` files are committed** (Godot 4.4+ writes one beside each script; they were already, keep it that way).
- **Sounds:** looping place sounds are OGG, not WAV (web-and-shipping.md).

## Rules from here on (adopt gradually, when the work touches it)
These are not a rewrite. Each one is tied to the deliverable that needs it, so the change pays for itself.

1. **Split `main.gd` as you touch it.** Wildbond's `main.gd` is 3,600 lines doing the world, people, the ranch,
   festivals, music, saving and more; Starfall's is 2,300. Godot's advice is small scenes and scripts with one job each.
   A big file is slow to read for every assistant and makes two people's changes collide. **Rule:** when a deliverable
   adds a sizeable new system, put it in its own script (as `calendar.gd`, `battle.gd`, `book.gd`, `safe_save.gd`
   already are) and call it from `main.gd`. When a deliverable reworks an existing system, move that system out first
   in a commit of its own with the checks passing. Good first candidates: music and ambience (`audio.gd`), festivals,
   interiors, the ranch.
2. **Named input actions before phone controls (WB6.1) and settings (WB6.2).** Keys are read directly today
   (`KEY_...`). Godot's Input Map gives each action a name (`move_up`, `talk`, `open_book`) that any key, a gamepad or an
   on-screen button can trigger, and players can rebind. **Rule:** new controls use named actions; WB6.1 moves the rest.
3. **Sound buses before the settings menu (WB6.2).** Godot mixes sound through *buses*; a `Music`, `Ambience` and
   `Effects` bus (in `default_bus_layout.tres`) is what a volume slider controls. Today each player sets its own volume.
   **Rule:** WB6.2 adds the three buses and routes every player through them.
4. **Typed code.** Most variables already have types (`var x := 0`, `-> void`). Keep typing new code: Godot catches more
   mistakes before the game runs, and typed GDScript runs faster.
5. **Signals for "something happened", calls for "do this".** A child (the battle, the book) should announce events with
   a signal (`battle.finished`) rather than reach back into `main`. Already done for the title screen (`title.chosen`);
   follow it for new screens.
6. **Save versions and migrations.** When a save field changes meaning (not just a new field with a default), raise
   `"v"` and add a step that upgrades the old layout on load. New fields still need a default in the loader. See
   saves-and-testing.md.
7. **Same engine version everywhere: 4.7.2.** The CI, Evan's PCs and cloud sessions all use it. Upgrading is a
   deliberate step: one commit that bumps the version in `.github/workflows/checks.yml`, START-HERE.md, play/README.md
   and memory, with both suites and a web export checked.
8. **Shared code between the two games** is a copied file with a header naming its twin (`calendar.gd`,
   `safe_save.gd`). When you change one, change the other in the same commit. If this grows past a handful of files, move
   them into a shared Godot addon folder.

## How to check your work (every Godot change)
```
node tools/run-all-checks.cjs wildbond-godot starfall-godot      (with GODOT set to the console executable)
```
or each suite directly: `Godot_v4.7.2-stable_win64_console.exe --headless --path wildbond-godot -s tests/run_tests.gd`.
Then look at the real screen (`--skip-opening`, the picture flags in each README) as a first-time player.
