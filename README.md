# Idle Arcade

A stable of idle and progression browser games. Each game saves on its own in the browser,
and the hub page shows where you left off in every one.

**Design rule:** automation (managers, staff, instincts) is always earned by playing, never sold.

## Games

| Game | Status | What it is |
|---|---|---|
| [Primordial](games/primordial/) | Playable | Evolution idle game: cell to Leviathan, mutation drafts, niche fights, extinction resets |
| [Starfall Guild](games/starfall-guild/) | Prototype | Kairosoft-style adventurer guild: recruit, class combos, dungeon autobattle, town, staff, seasons |
| Realmbound | In design | Classic-MMO-inspired idle adventure: leveling, dungeons, raids, loot, addons as automation ([design](docs/realmbound-design.md)) |
| Diamond Career | In design | Baseball: create a player, earn a contract, spend it; later manage the club |
| Otherworld | Idea | Anime isekai: status window, evolving skills, story arcs, guild ranks F to S, reincarnation |

Design plans live in [docs/](docs/): [Realmbound](docs/realmbound-design.md), [idea backlog](docs/ideas.md).

## Layout

```
index.html            the hub (the "stable")
shared/engine.js      saves, export/import, number formatting, hub progress cards
games/<name>/         one folder per game, plain HTML + JS, no build step
serve.ps1             local test server: http://localhost:8765/
```

## Run locally

```
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```
then open http://localhost:8765/

## Changelog

- **2026-10-06** — Hub and shared engine. Primordial v1 (playtested: drafts, instincts, contests,
  extinction, offline catch-up, import). Starfall Guild prototype (playtested: recruiting, leveling,
  shops, bosses and relics, staff, seasons). Fixed: drafts no longer offer mutations for locked organisms;
  Starfall heal-between-fights and crit math.
