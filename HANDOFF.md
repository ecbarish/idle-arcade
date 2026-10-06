# Handoff guide (for any AI coding assistant or developer)

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
**Run checks** for all 118 existing scenario checks and a clear PASS/FAIL list, without Node.js or npm.
The runner loads the unchanged scenario file in a same-origin game iframe and restores the Realmbound
save and hub progress afterward. Close other Realmbound tabs before running. The game keeps its
localhost-only debug hook; on other server hostnames the runner exposes that same hook only inside its
test iframe. Existing Node DOM and Playwright checks remain in `tests/` for development environments.

## Wildbond layout
- `shared/creatures.js`: shared creature core (genes 0-31 shown as grades F-S, rarity, temperament, traits, bond,
  stat math, XP curve, breeding). Exposes `window.Creatures`.
- `games/wildbond/js/`: 00-data (elements, moves, species, biomes, story, art eras: data only), 01-art (art eras:
  every drawing call goes through `ART[era]`), 02-state, 03-battle, 04-world (explore, story, town), 05-ui,
  06-scene, 99-boot. Localhost test hook: `window.__wb`.
- Art eras: the look evolves with progress (Pixel → 16-bit → HD → 3D). A new era is a new `ART.<id>` object with
  `creature`, `backdrop`, `tamer`; never draw outside it.

## Next steps
1. Promo page for friends (hub card + screenshots).
2. Realmbound: professions and expanded talent trees, then levels 30-60, more dungeons, raids and guild, faction battlegrounds.
3. Standalone creature game reusing Realmbound's creature system (families, rarity, traits, bond).
4. Diamond Career (baseball), then Otherworld (isekai).
