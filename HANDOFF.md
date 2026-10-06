# Handoff guide (for any AI coding assistant or developer)

Idle Arcade is a set of plain HTML/JS browser games with no build step. The live site is
https://ecbarish.github.io/idle-arcade/ (GitHub Pages serves the `main` branch).

## Rules the owner cares about
- Depth and gameplay come first. Automation (addons, staff, instincts) is earned by playing, never sold.
- Active play must always be worth at least as much as Auto mode.
- Original names and art only. Inspired by classic WoW, Pokemon and Kairosoft; never copied.
- Game state saves through `shared/engine.js` (`Arcade.save/load/report`). Keep old saves loading:
  Realmbound has a `migrate()` function for exactly this.

## Layout
- `index.html`: the hub. `shared/engine.js`: shared helpers.
- `games/realmbound/index.html`: the main project (classic-MMO idle game): classes, Hunter pets,
  mounts, characters, wandering NPC adventurers, the Drowned Sanctum and Cindervein Foundry dungeons with separate Heroic tiers, levels 1–30.
- `docs/realmbound-design.md`: design decisions. `docs/ideas.md`: backlog (creature game, isekai, sports).
- Run locally: `powershell -ExecutionPolicy Bypass -File serve.ps1` then open http://localhost:8765/
  (a `window.__rb` debug hook exists on localhost only).

## Next steps
1. Promo page for friends (hub card + screenshots).
2. Realmbound: professions and expanded talent trees, then levels 30-60, more dungeons, raids and guild, faction battlegrounds.
3. Standalone creature game reusing Realmbound's creature system (families, rarity, traits, bond).
4. Diamond Career (baseball), then Otherworld (isekai).
