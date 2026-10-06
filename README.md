# Idle Arcade

A stable of idle and progression browser games. Each game saves on its own in the browser,
and the hub page shows where you left off in every one.

**Design rule:** automation (managers, staff, instincts) is always earned by playing, never sold.

## Games

| Game | Status | What it is |
|---|---|---|
| [Primordial](games/primordial/) | Playable | Evolution idle game: cell to Leviathan, mutation drafts, niche fights, extinction resets |
| [Starfall Guild](games/starfall-guild/) | Prototype | Kairosoft-style adventurer guild: recruit, class combos, dungeon autobattle, town, staff, seasons |
| [Realmbound](games/realmbound/) | Prototype | Classic-MMO-inspired adventure: two factions, 5 classes including a pet-taming Hunter, levels 1–20, quests, loot, Focus/Auto play, addons as automation ([design](docs/realmbound-design.md)) |
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

- **2026-10-07** — Realmbound: mounts. Riding skills, faction mount vendors, rare reins from legendary elites,
  mounts that train as you ride them, Hunters riding their own pets. Travel between fights, to town and
  between zones is faster when mounted.

- **2026-10-06 (night)** — Realmbound: character slots (up to 8). Characters button in the top bar; each hero
  keeps their own gear, quests, pets, addons and log. Heroes you aren't playing earn rested XP while away.
  Old single-hero saves upgrade automatically.

- **2026-10-06 (evening)** — Realmbound: Hunter class and pets. Taming with wild rarity from common to
  legendary, 7 beast families, traits, bond levels that unlock Coordinated Strike and a pet that saves you,
  happiness and feeding, a 3-pet stable, PetCare addon, Beast Mastery talents. Playtested taming a common
  and a legendary elite, combat with a pet, feeding, stable swaps; other classes unaffected.

- **2026-10-06 (later)** — Realmbound v0: character creation (2 factions, 4 races, 4 classes), three zones to
  level 20, 26 quests, auto-combat with a 6-button action bar and reactive openings, Focus/Auto modes (active
  play always worth more), loot with rarities and suffixes, durability and corpse runs, town vendor, talents,
  rested XP, 5 earned addons. Playtested all four classes. Design plan in docs/realmbound-design.md. Creature
  and companion idea added to docs/ideas.md.

- **2026-10-06** — Hub and shared engine. Primordial v1 (playtested: drafts, instincts, contests,
  extinction, offline catch-up, import). Starfall Guild prototype (playtested: recruiting, leveling,
  shops, bosses and relics, staff, seasons). Fixed: drafts no longer offer mutations for locked organisms;
  Starfall heal-between-fights and crit math.
