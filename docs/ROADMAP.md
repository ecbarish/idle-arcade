# Roadmap

Shared plan for every contributor (Claude, ChatGPT/Codex, or a person). One ticket per session.
Mark a ticket done in the same PR that finishes it.

## Priorities
1. **Realmbound** is the flagship. Everything else is parked until it reaches level 60.
2. **The creature system** is next: built once as a shared module, used by Realmbound pets/mounts and by a
   standalone creature game (capture, raise, breed hybrids, race and battle; common to mythical).
3. Parked: Primordial, Starfall Guild, Diamond Career (baseball), Otherworld (isekai). See docs/ideas.md.

## Who does what
- **Claude:** specs and design decisions, new systems with tricky game feel (creatures, raids, guilds),
  balance passes, anything that changes the save format, reviewing and merging PRs.
- **ChatGPT/Codex:** refactors with no behavior change, content written to a spec (zones, quests, enemies,
  items, dialogue), test tooling, bug fixes from the list below.

## Tickets
- [x] **T0: Split Realmbound into small files** (ChatGPT). No behavior change. See HANDOFF.md.
- [ ] **T1: Specs for levels 30-60, raids and the guild** (Claude).
- [x] **T2: Creature game spec + shared creature module plan** (Claude). See docs/creature-game-design.md.
- [ ] **T3: Content for levels 30-40** (ChatGPT, after T0 and T1).
- [x] **T4a: Shared creature module + Wildbond part 1** (Claude): starters, rival, Thornwood, capture, 3v3 command
  battles, evolution, Warden and badge, art-era system (Pixel only). Done 2026-10-08.
- [ ] **T4b: Wildbond part 2** (Claude): ranch days (feed/train/rest), breeding with genes and hybrids.
- [x] **T5: Wildbond 16-bit art era** (ChatGPT): a new `ART.bit16` in games/wildbond/js/01-art.js with the same three
  functions as `ART.pixel` (creature, backdrop, tamer). Finer sprites, shading, outlines. Unlocked by the Thorn Badge
  (add 'bit16' to S.eras when the badge is earned). Gameplay files must not change.
- [ ] **T6: Wildbond second biome, data only** (ChatGPT): add **Saltmarsh Coast** to `BIOMES` in
  games/wildbond/js/00-data.js (levels 10-18, `req: 'thorn'` so it opens after the Thorn Badge, its own sky/hill/ground
  colors and a wild table) and 8-10 new species to `SPECIES` using only the existing families (wolf, boar, cat, hyena,
  lizard, croc, spider, horse, bird, sprite) and elements. Include at least one two-stage evolution line (with `evo`),
  one rare species (low weight in the wild table) and one unique legendary-style species with `unique: 1` that is not
  in the wild table. Each species needs base stats (sum about 300 for basic forms, 420 for evolved), a learnset using
  existing MOVES only, and a one-line `dex` entry. Data only: change no other file. Claude adds biome travel in T4b.

## Bugs and feedback
Add one line per issue: what happened, where (zone or screen), and the character's level/class.
