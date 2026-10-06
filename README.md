# Idle Arcade

A stable of idle and progression browser games. Each game saves on its own in the browser,
and the hub page shows where you left off in every one.

**Design rule:** automation (managers, staff, instincts) is always earned by playing, never sold.

## Games

| Game | Status | What it is |
|---|---|---|
| [Primordial](games/primordial/) | Playable | Evolution idle game: cell to Leviathan, mutation drafts, niche fights, extinction resets |
| [Starfall Guild](games/starfall-guild/) | Prototype | Kairosoft-style adventurer guild: recruit, class combos, dungeon autobattle, town, staff, seasons |
| [Realmbound](games/realmbound/) | Prototype | Classic-MMO-inspired adventure: two factions, 5 classes including a pet-taming Hunter, levels 1–30, quests, loot, Focus/Auto play, addons as automation ([design](docs/realmbound-design.md)) |
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

- **2026-10-08** — Wildbond part 1 (early access): shared creature module, three starters with evolutions, rival Wren,
  Thornwood with 10 wild species, lure-and-calm capture, 3v3 auto battles with commands (Focus, Guard, Rally),
  telegraphed attacks, Elderhorn, the Thornwood Warden and the Thorn Badge, Wilddex, art-era system. Merged
  ChatGPT's Realmbound split (PR #2).

- **2026-10-07 (night)** — Hub: "Reset progress" on every game card with progress, with a confirmation step.
  Erases that game's save on this device (for Realmbound, every character).

- **2026-10-07 (evening)** — Primordial rebalance from phone playtest: breeding slowed to a fraction, milestones double at
  25/50/100/200…, first extinction at 10B (simulated ~22 min for a perfect player, ~40 real), at most 3
  mutations waiting at once. Clear "← Arcade" button in Primordial and Starfall Guild.

- **2026-10-07 (later)** — Merged ChatGPT's Ashen Ridge / level 30 / Cindervein Foundry work (PR #1) after review; 118 scenario
  checks pass. Added promo.html, a shareable pitch page for friends.

- **2026-10-06** — Realmbound: level cap 30, Ashen Ridge with two faction outposts, ten quests,
  six enemy types including the legendary Coalmaw, and the Cindervein Foundry (three bosses).
  Dungeons now keep separate Heroic unlocks; existing Sanctum saves migrate automatically.
  New bosses use Cinder Rain and Molten Rupture with the same active dodge controls.

- **2026-10-07** — Realmbound: wandering NPC adventurers with personalities and friendship, grouping,
  combo abilities, the Drowned Sanctum (3 bosses, waves, dodgeable Tidal Surge, loot sharing, infinite Heroic
  tiers), LFG Tool addon. See HANDOFF.md to continue with any tool.

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

## Development checks

Serve the repository with `python -m http.server 8765` (or `serve.ps1`). With Playwright and its
Chromium browser installed, run `node tests/realmbound-smoke.cjs`. The check covers old dungeon
save migration, levels 20–30, quest chains, per-dungeon Heroic gates, save/reload, group-finder
controls and mobile layout. For a DOM-only check without Chromium, install `jsdom` in your development
environment and run `node tests/realmbound-dom.cjs`. This executes the same progression scenarios and
checks save/reload and group-finder interactions, but does not verify browser rendering or mobile layout.
The games themselves still require no dependencies or build step.
