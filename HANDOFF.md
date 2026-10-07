# Handoff guide (for any AI coding assistant or developer)

**Start with [START-HERE.md](START-HERE.md):** current state, the ordered task queue and the session log. This file
holds the full rules and the file layout.

Idle Arcade is a set of plain HTML/JS browser games with no build step. The live site is
https://ecbarish.github.io/idle-arcade/ (GitHub Pages serves the `main` branch).

## Rules the owner cares about
- Git commits must use the author email 206636510+ecbarish@users.noreply.github.com (never a personal email).
  Work on a `codex/<topic>` branch and open a pull request; the owner reviews and merges.
- Read docs/ROADMAP.md and do only the ticket you were given.
- Depth and gameplay come first. Automation (addons, staff, instincts) is earned by playing, never sold.
- Active play must always be worth at least as much as Auto mode.
- Original names and art only. Inspired by classic WoW, Pokemon and Kairosoft; never copied.
- Game state saves through `shared/engine.js` (`Arcade.save/load/report`). Keep old saves loading:
  Realmbound has a `migrate()` function for exactly this.

## Shared development notes

[START-HERE.md](START-HERE.md) is the live shared record: where things stand, the ordered task queue and the session
log. Keep it current after every meaningful step so Evan can switch assistants at any moment. If a ticket limits
which files you may edit, put your notes in the PR description and the session log line instead, and whoever merges
updates START-HERE.md. [docs/plans/README.md](docs/plans/README.md) holds the six-game research and long-term
plans; [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) is the historical record up to 2026-10-06.

## Layout
- `index.html`: the hub. `shared/engine.js`: shared save and formatting helpers.
- `games/realmbound/index.html`: Realmbound markup and ordered classic script tags; no build step.
- `games/realmbound/style.css`: the unchanged MMO interface styles.
- `games/realmbound/js/00-core.js`: save key, selectors, formatting aliases, random helpers and level cap.
- `games/realmbound/js/01-world.js`: faction, race, class, zone and quest data only.
- `games/realmbound/js/02-items.js`: equipment, weapon, suffix and loot data only.
- `games/realmbound/js/03-talents-abilities.js`: talent and action-bar definitions and ability use helpers.
- `games/realmbound/js/04-creatures.js`: families, rarity, traits, bond, pets, feeding and taming.
- `games/realmbound/js/05-mounts.js`: riding, vendors, reins, mount training and travel speed.
- `games/realmbound/js/06-npcs.js`: adventurers, personalities, friendship, stats and world encounters.
- `games/realmbound/js/07-dungeons.js`: dungeon encounter and modifier data only.
- `games/realmbound/js/08-inventory-quests.js`: item generation, equipment, vendors, quest logic and addons.
- `games/realmbound/js/09-dungeon-runs.js`: dungeon metadata setup, records, run logic, bosses and loot sharing.
- `games/realmbound/js/10-state.js`: quest index setup, character state, unchanged migration, saves and offline gains.
- `games/realmbound/js/11-combat.js`: derived stats, combat runtime, damage, XP, deaths and party combat.
- `games/realmbound/js/12-tabs.js`: tab definitions and tab rendering.
- `games/realmbound/js/13-world-ui.js`: modals, tooltips, world UI, character screens and group finder.
- `games/realmbound/js/14-scene.js`: canvas setup and original procedural pixel art rendering.
- `games/realmbound/js/15-events.js`: mouse, keyboard and input event handlers.
- `games/realmbound/js/99-boot.js`: startup, load, timers and the unchanged localhost-only `window.__rb` hook.
- `docs/realmbound-design.md`: design decisions. `docs/ideas.md`: parked backlog.

Scripts load in the order listed above after `shared/engine.js`, without `async`, `defer`, modules or a
bundler. Classic scripts share global lexical bindings; references inside functions resolve when called.
The quest-index loop moved into state setup, after world data. The existing `Object.assign(SANCTUM,…)`
moved into dungeon runtime setup, after dungeon data. Boot loads last, after every function and binding.

## Run and test
Run `powershell -ExecutionPolicy Bypass -File serve.ps1` or `python -m http.server 8765` from the
repository root, then open http://localhost:8765/. Open http://localhost:8765/tests/run.html and click
**Run checks** for all 231 scenario checks (including the original coverage and Frostmere) and a clear PASS/FAIL list, without Node.js or npm.
The runner loads the scenario file in a same-origin game iframe and restores the Realmbound
save and hub progress afterward. Close other Realmbound tabs before running. The game keeps its
localhost-only debug hook; on other server hostnames the runner exposes that same hook only inside its
test iframe. Existing Node DOM and Playwright checks remain in `tests/` for development environments.

## Wildbond layout
- `shared/creatures.js`: shared creature core (genes 0-31 shown as grades F-S, rarity, temperament, traits, bond,
  stat math, XP curve, breeding). Exposes `window.Creatures`.
- `games/wildbond/js/`: 00-data (elements, moves, species, biomes, story, art eras: data only), 01-art (art eras:
  every drawing call goes through `ART[era]`), 02-state, 03-battle, 04-world (explore, story, town), 05-ui,
  06-scene (battle animation), 07-ranch, 08-ranch-ui, 09-dialogue (scenes with portraits; speakers in `CAST`,
  scripts in `SCENES` and story `lines`/`win`), 10-sound (Web Audio effects + note-string music `TRACKS`), 11-maps (walkable tile maps, data only: `MAPS`, `TILES`,
  townsfolk added to `CAST`), 12-walk (moving on maps, doors, exits, talking, Auto walking, trainers, items, weather, visible wild creatures;
  position in `S.pos`), 13-hd (the HD-2D era renderer), 14-diorama (the Diorama era: three.js, loaded on first use),
  15-challenge (challenge modes, rematches, area mastery), 99-boot.
  The map scene is drawn in 06-scene `drawWorld` through `ART[era].tile` and `ART[era].walker`.
  Localhost test hook: `window.__wb`.
- Art eras: the look evolves with progress (Pocket → Pixel/16-bit → HD-2D → Diorama → 3D). A new era is a new
  `ART.<id>` object with `creature`, `backdrop`, `tamer`, `tile`, `walker`, `item`; optional `ctx(realContext)` (a
  color wrapper, as Pocket's four greens) and `light` (shows the day/night clock). Never draw outside it; get a
  canvas context through `eraCtx()`.

## Starfall Guild layout

`games/starfall-guild/index.html` keeps the existing markup and loads `style.css` (the original styles),
`shared/engine.js`, then these classic scripts in order, without modules, async, defer or a build step:

- `00-data.js`: save key, helpers, classes, names, monsters, town buildings, relics, regions, crest and staff data.
- `01-state-save.js`: fresh state, merge defaults, derived stats, save/load and portable saves.
- `02-dungeon.js`: monsters, combat, effects and relic choices.
- `03-town-staff.js`: purchases, leveling, tavern, seasons, region choices and earned staff.
- `04-loop.js`: the main tick, farming and offline progress.
- `05-ui.js`: toasts, modals, tabs and HUD updates.
- `06-render.js`: original procedural pixel art, canvas setup and animation.
- `07-events.js`: existing mouse, keyboard and input handlers.
- `99-boot.js`: startup, loading, timers and localhost-only `window.__sg`.

Classic scripts share lexical bindings. Data callbacks refer to state and UI helpers only when called;
state/save functions refer to later dungeon, town and UI functions only when called. Rendering needs the
existing DOM and dungeon effects. Boot must load last, after every binding and event handler. All original
top-level names, formulas and text are retained. The key remains `starfall-guild-save-v1`, with the same v1 save.

Run `tests/starfall.html` on localhost and click **Run checks**. It loads a same-origin iframe, checks a
three-minute save from unsplit main plus fresh starts, recruiting, combat, purchases, seasons and rendering,
then removes the game iframe before restoring both the game save and `arcade-index-v1`, including failures.
Close other Starfall Guild and hub tabs first. Also run the existing Realmbound and Wildbond test pages.

## Next steps
1. Promo page for friends (hub card + screenshots).
2. Realmbound: professions and expanded talent trees, then levels 30-60, more dungeons, raids and guild, faction battlegrounds.
3. Standalone creature game reusing Realmbound's creature system (families, rarity, traits, bond).
4. Diamond Career (baseball), then Otherworld (isekai).

## Current Realmbound chapter

The Winter Road expands Frostmere to levels 30–40: five zones, 46 quests and a level-40 cap. See
[docs/realmbound-winter-road.md](docs/realmbound-winter-road.md) for the narrow progression specification,
T12 dependency and upgrade stages. Save key and `migrate()` are unchanged. The full T1 design remains open.
For browser interactions, with a local server and development Playwright installation, run
`node tests/realmbound-winter-road.cjs` (optional `REALMBOUND_BROWSER_PATH` selects an installed Chromium).
