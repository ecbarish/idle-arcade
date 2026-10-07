# Idle Arcade: notes for Claude

Evan's personal stable of browser games, live at https://ecbarish.github.io/idle-arcade/ (GitHub Pages from `main`).
Evan works on this from more than one computer and with ChatGPT/Codex too, so **this repo is the shared memory**:
read this file, `HANDOFF.md` (rules, layout, workflow) and `docs/ROADMAP.md` (tickets) at the start of a session.

## Start of every session
1. `git pull`, then `git fetch` and check `git branch -r` for `codex/*` branches newer than `main` (ChatGPT's work).
2. For each: `git log --format='%h %ae %s' main..origin/<branch>`, review the diff, test it (see below), merge with
   `git merge --no-ff`, push, and mark the ticket done if ChatGPT didn't. Evan confirmed on 2026-10-06 that Claude
   merges after checking; ChatGPT/Codex still opens PRs and never merges its own work.
3. Pick up the next ticket from "Where we are" below.

## Rules
- **Commits use only** `206636510+ecbarish@users.noreply.github.com` (set it as repo-local `user.email`). Never a
  personal email. End commit messages with the Co-Authored-By line the session gives you.
- Never enter Evan's passwords or create accounts for him; he signs in himself.
- Plain HTML/JS, no build step, no installs. Test locally with `serve.ps1` (http://localhost:8765/) in the browser
  pane. Realmbound: `tests/run.html` must stay all-pass. Wildbond: `tests/wildbond.html` must stay all-pass;
  `window.__wb` hook on localhost.
- Ship in small playable steps with a README changelog entry. When handing work to ChatGPT, write the ticket into
  `docs/ROADMAP.md` first and give Evan a copy-paste prompt (branch `codex/<topic>`, open a PR, don't merge,
  noreply email).

## What Evan wants (keep this in mind for every design choice)
- **Real games, not dashboards or puzzles:** deep lore and deep gameplay, like Pokemon, Palworld, classic WoW.
  Be *in* the world: places and people instead of menu buttons. May become an app or full game someday.
- **Earned automation, never paywalled.** Active play is always worth at least as much as idle.
- **The journey and the grind are the fun**, but the player picks the pace (journey-length settings, badge level
  caps, challenge modes) and there are reasons to revisit old content (rematches, rare spawns, mastery).
- References are inspiration, not templates. Suggest better mechanics from other games when they fit
  (he liked IdleOn's many characters working at once, Palworld ranch jobs, DQM inheritance, fusion).
- Guides per game come later, once games are near-finished. Record lore in docs as it's written
  (`docs/lore/`, design docs).
- Evan isn't a programmer: explain in plain words, show results, give clear next steps.

## Where we are (update this at the end of each session)
- **Wildbond** (creature game, the current focus): starters, rival Wren, Thornwood (2-12) → Saltmarsh Coast
  (12-22, Warden Nerys, Tide Badge) → Emberfall Highlands (22-32, Warden Toren, Ember Badge), ranch/breeding, art eras (Pixel,
  16-bit), dialogue scenes with portraits, battle animation, chiptune sound. T11 pacing is done: levels to 100,
  journey length, badge caps, XP share (numbers and measured times in `docs/creature-game-design.md`). Pacing is
  checked with a fast Auto simulation in the browser (call `worldTick(0.1)` in a loop, skipping scenes).
- **Walkable world (T7b parts 1-2) is done:** Larkhaven and the three areas are tile maps you walk (keys or tap),
  tall grass = exploring, walk-in inn/shop/ranch, Wardens and townsfolk stand in the world, Auto walks the grass,
  six route trainers who spot you (`trainer` npcs in 11-maps.js, beaten ones in `S.beaten`), items on the ground
  (`S.items`), signposts, your lead creature follows you.
- **T13 part 1 (eras) is done:** new games start in the faded Pocket era (Game Boy greens); the Thorn Badge brings
  color back in a scene (Pixel + 16-bit unlock), Warden's boots (Shift to run, `S.shoes`) and the day/night clock
  (ranch day; night = more Shade spawns; shown in eras with `light`). Townsfolk lines change by badge (`byBadge`).
- **T13 part 2 (HD-2D) is done:** the Tide Badge unlocks `ART.hd` (13-hd.js: the same maps in perspective with
  standing sprites, haze, depth of field, warm light; `world()` draws the whole map, 06-scene builds the view with
  `worldView`), weather (`weatherNow`, changes spawns) and visible wild creatures in tall grass (`WK.roam`).
- **T13 part 3 (Diorama) is done:** the Ember Badge unlocks `ART.diorama` (14-diorama.js: three.js r134 from cdnjs,
  loaded on first use, HD-2D stands in until then or offline; the maps as instanced blocks, sprites extruded into
  voxels; drag to orbit, wheel to zoom, arrow keys follow the camera via `turnDir`) and riding (`S.ride`, R key).
  **Next for Claude:** T11b (challenge modes, rematches), or Modern 3D when Evan wants it. Open owner question from the lore bible: 8 badges give a cap of 95, the design says the main
  journey ends near 70; decide before area 5.
  Emberfall now has Warden Toren and the Ember Badge (T15, ChatGPT, merged), so the cap is 45 after three
  badges. The lore bible is `docs/lore/wildbond.md` (T14); areas 4-8 there are proposals. ChatGPT has T17 (area 4,
  Cloudglass Pass: 00-data.js + 11-maps.js); while it's open Claude only touches `SCENES` and `ERAS` in 00-data.js
  and nothing in 11-maps.js.
- **Realmbound** (classic-MMO idle, flagship): levels 1-40, two dungeons, hunters/pets/mounts, lore bible in
  `docs/lore/realmbound.md`. Frostmere / The Winter Road (30-40, PR #7) is merged; its necropolis dungeon and levels
  41+ wait on the rest of T1 (Claude: specs for 40-60, raids, guild).
  Big future direction: the whole roster plays at once (IdleOn-style).
- Parked: Primordial, Starfall Guild, Diamond Career (baseball), Otherworld (isekai).

## Latest owner direction and Codex handoff — 2026-10-06

Read [docs/plans/README.md](docs/plans/README.md) and [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). The plans cover six games and a broader sports framework, based on 19 comparable titles. All games should eventually support manual through full automation, with independent delegation settings. Earned automation remains the current rule; whether full Auto is available immediately is still an owner decision. Desktop and phone come first; VR is deferred.

Sports should support athlete careers and team management across sports. Salaries should fund lasting personal progress (homes, cars, other purchases). Baseball remains the recommended first module; do not silently unpark implementation.

Winter Road (PR #7) and these plans (PR #8) are merged and live; `tests/run.html` passed (231) before merging. Wider T1 remains open. Wildbond stays Claude's lane. Open owner decisions: full-Auto unlock timing, the second sport, and whether purchases (homes/cars) have gameplay effects.
