# Roadmap

Shared plan for every contributor (Claude, ChatGPT/Codex, or a person). One ticket per session.
Mark a ticket done in the same PR that finishes it.

## Priorities
1. **Realmbound** is the flagship. Everything else is parked until it reaches level 60.
2. **The creature system** is next: built once as a shared module, used by Realmbound pets/mounts and by a
   standalone creature game (capture, raise, breed hybrids, race and battle; common to mythical).
3. Parked: Primordial, Starfall Guild, Diamond Career (baseball), Otherworld (isekai). See docs/ideas.md.

## Research and future upgrade plans

See [docs/plans/README.md](plans/README.md) for comparable-game research, staged plans for each game, the expanded sports career/lifestyle direction, manual-to-automated controls, and tonight's desktop checklist. These are proposed milestones, not newly approved gameplay tickets. Desktop and phone are the current targets; VR is deferred. Keep existing ticket ownership and parked status until Evan changes them.

## Who does what
- **Claude:** specs and design decisions, new systems with tricky game feel (creatures, raids, guilds),
  balance passes, anything that changes the save format, reviewing and merging PRs.
- **ChatGPT/Codex:** refactors with no behavior change, content written to a spec (zones, quests, enemies,
  items, dialogue), test tooling, bug fixes from the list below.

## Tickets
- [x] **T0: Split Realmbound into small files** (ChatGPT). No behavior change. See HANDOFF.md.
- [ ] **T1: Specs for levels 30-60, raids and the guild** (Claude).
- [x] **T2: Creature game spec + shared creature module plan** (Claude). See docs/creature-game-design.md.
- [x] **T3: Content for levels 30-40** (Codex): Frostmere, The Winter Road. See
  [chapter specification](realmbound-winter-road.md). Evan authorized the narrow progression spec while Claude
  was unavailable; T1's remaining 40–60, raid and guild design stays open.
- [x] **T4a: Shared creature module + Wildbond part 1** (Claude): starters, rival, Thornwood, capture, 3v3 command
  battles, evolution, Warden and badge, art-era system (Pixel only). Done 2026-10-08.
- [x] **T4b: Wildbond part 2** (Claude): ranch days (food, training regimens, fatigue, injury, mood), breeding barn with
  inherited genes, pedigree and 3 discoverable hybrids, biome travel (for T6). Done 2026-10-08.
- [x] **T5: Wildbond 16-bit art era** (ChatGPT): a new `ART.bit16` in games/wildbond/js/01-art.js with the same three
  functions as `ART.pixel` (creature, backdrop, tamer). Finer sprites, shading, outlines. Unlocked by the Thorn Badge
  (add 'bit16' to S.eras when the badge is earned). Gameplay files must not change.
- [x] **T6: Wildbond second biome, data only** (ChatGPT): add **Saltmarsh Coast** to `BIOMES` in
  games/wildbond/js/00-data.js (levels 10-18, `req: 'thorn'` so it opens after the Thorn Badge, its own sky/hill/ground
  colors and a wild table) and 8-10 new species to `SPECIES` using only the existing families (wolf, boar, cat, hyena,
  lizard, croc, spider, horse, bird, sprite) and elements. Include at least one two-stage evolution line (with `evo`),
  one rare species (low weight in the wild table) and one unique legendary-style species with `unique: 1` that is not
  in the wild table. Each species needs base stats (sum about 300 for basic forms, 420 for evolved), a learnset using
  existing MOVES only, and a one-line `dex` entry. Data only: change no other file. Claude adds biome travel in T4b.
- [x] **T7a: Wildbond real-game feel, part 1** (Claude): dialogue scenes with portraits and typewriter text for
  every story beat (09-dialogue.js, CAST/SCENES/`lines`/`win` in 00-data.js), battle animation (slide-in, lunge,
  flinch, element sparks, crit shake, faint, victory hop), chiptune sound effects and per-area music made live with
  Web Audio (10-sound.js, off by default). Done 2026-10-08.
- [ ] **T8: Game guides** (ChatGPT) — **parked** until games are closer to finished, so guides don't need constant
  rewrites. Spec kept below. Meanwhile, keep lore written down in each game's design doc as it's added.
- [ ] **T9: Wildbond guide** (ChatGPT) — parked with T8.
- [x] **T11: Wildbond pacing overhaul** (Claude): levels 1-100, journey length (Breezy/Classic/Long Road),
  badge level caps (soft/hard/off), XP share toggle, Saltmarsh Warden + Tide Badge, Saltmarsh/Emberfall rescaled.
  Done 2026-10-06. See "Pacing, level caps and journey settings" in docs/creature-game-design.md.
- [ ] **T11b: Challenge modes and rematches** (Claude, later): Nuzlocke/Randomizer/Solo/Hardcore at a new game,
  Warden and Wren rematch tiers, area mastery stars.
- [ ] **T13: Era progression in the world** (Claude, after T7b): Pocket (Game Boy) → 16-bit → HD-2D → voxel
  Diorama → modern 3D → first-person/VR, each with era-matched mechanics and story beats. See "Eras you walk through"
  in docs/creature-game-design.md. T7b must keep the tile map separate from the renderer.
- [ ] **T7b (revised): Walkable world** (Claude): top-down map with tall grass, route trainers, items, NPCs; towns
  you walk into (inn, shop, ranch) instead of menu buttons. Auto-explore = your tamer walks routes on their own.
- [x] **T10: Wildbond third area, data only** (ChatGPT): see the T10 section below.

- [x] **T12: Realmbound lore pass** (ChatGPT): see the T12 section below.
- [ ] **T14: Wildbond lore bible and region outline** (ChatGPT, docs only): see the T14 section below.

### T14: Wildbond lore bible and region outline (docs only)
Wildbond is heading for about eight areas and eight badges (levels 1-100, see "Pacing, level caps and journey
settings" in docs/creature-game-design.md). Write the world down before more of it is built, the way T12 did for
Realmbound. **Create one file, `docs/lore/wildbond.md`, and change nothing else** (Claude is editing the Wildbond
code and data for T11 at the same time, so don't touch games/, shared/ or other docs).
- **What exists now, from the game:** read games/wildbond/js/00-data.js (SCENES, STORY, CAST, SPECIES `dex` lines,
  BIOMES) and docs/creature-game-design.md. Record the region's history (the frontier, why nobody owns a creature,
  what bonds are), Larkhaven, Keeper Maren, Wren, Warden Isolde, the Wardens as an order, each area so far
  (Thornwood, Saltmarsh Coast, Emberfall Highlands), the guardians (Elderhorn, Breakwatermane, Hearthcrown) and what
  "every region has something old watching it" means. Expand freely but never contradict in-game text.
- **Saltmarsh Warden:** Claude is adding a Saltmarsh Coast Warden and the Tide Badge in T11. Leave a short
  "to be filled in after T11" stub for them rather than inventing one.
- **Proposed areas 4-8:** for each, a name, a one-paragraph feel (landscape, weather, people), a level band (about
  32-42, 42-52, 52-62, 62-70, then post-game toward 100), an element/family mix using only the existing elements
  and families, a Warden (name, personality, what their test judges), a badge name, a guardian creature, and one story
  beat for Wren. Mark all of these clearly as **proposals for Evan to approve**, not canon.
- **Open questions** at the end: anything the game hints at but never explains.
- Keep it original (inspired by the genre, never naming or copying real games). Friendly, plain tone; headings and
  short paragraphs; about 2,000-3,500 words.

### T12: Realmbound lore pass
Make Realmbound's world feel lived-in, and start the lore record future guides will be built from.
- **Lore bible:** create `docs/lore/realmbound.md`: the Sundered Reach's history (why it is "sundered"), the Concord
  and the Wildclans (how they formed, what they want, why they clash in the Greywater Fens), the four races, every
  zone, every named NPC and quest giver (a line or two each: who they are, what they want), the bosses and named
  elites (Grizzlemaw, Kraska Duneclaw, Coalmaw, the dungeon bosses) and the Ember Covenant. Build only on what the
  game already says (games/realmbound/js/01-world.js, 06-npcs.js, 07-dungeons.js and docs/realmbound-design.md);
  expand freely but never contradict in-game text. Keep it original. List any open lore questions at the end.
- **In-game, data plus one small display change:** give every quest a `done` line (what the giver says when you turn
  it in, in their voice, 1-2 sentences) and show it in the existing quest-completed message in the log. Give every
  zone a `lore` paragraph (2-3 sentences) and show it where the zone's name/description already appears. Change
  nothing else: no balance, no new mechanics, no save-format changes. Run tests/run.html; all checks must still pass.
- Leave games/wildbond/ alone (Claude is working there).

### T10: Wildbond third area (data only)
Add **Emberfall Highlands** (volcanic uplands above the coast; name places and creatures however fits) in
games/wildbond/js/00-data.js only. Change no other file.
- `BIOMES.emberfall`: levels `[18, 26]`, `req: 'tide'` (the Saltmarsh badge Claude adds), its own `sky`/`hill`/`ground`
  colors and a wild table.
- 8-10 new `SPECIES` with the same rules as T6: existing families and elements only, base stats about 300 basic /
  420 evolved, learnsets from existing `MOVES`, a one-line `dex`. Include one two-stage evolution line (`evo`), one
  rare species, and one `unique: 1` legendary that is not in the wild table. Evolution levels must be 25 or lower.
- Two `STORY` beats with `biome: 'emberfall'`, written as scenes like the Saltmarsh ones: a Wren rematch at 6
  (`team` ending with `['$rival', 24]`, levels 22-24) and the legendary encounter at 14 (`wild: [id, 25, 4]`). Each
  needs `text` (one line for the journal), `lines` (3-4 lines of dialogue/narration) and `win` (2 lines). Speakers are
  keys of `CAST` (`wren`, `maren`, `isolde`), `''` for narration, or `'@speciesId'` for a creature. Keep Wren's voice
  (cheeky, competitive, warm) and match the existing tone. You may add one new `CAST` speaker if a scene needs one.
- Claude handles the code side: raising the level cap, the Saltmarsh Warden and the `tide` badge.

### T8: Game guides
One guide page per game, written like a good fan wiki or strategy guide: lore first, then how to play, then tips.
- **Files:** `guides/index.html` (lists the guides), `guides/guide.css` (shared look, readable at phone width, 16px
  side gutter, no horizontal scroll), and one page each: `guides/primordial.html`, `guides/starfall-guild.html`,
  `guides/realmbound.html`. Plain HTML/CSS, no build step, no JavaScript needed (use `<details>` for collapsibles).
  On the hub (`index.html`), add a small "Guide" link to the cards of those three games. Change no game files.
- **Sections per guide:** 1) **The world** (setting, factions, characters, places; written as lore, not
  mechanics), 2) **Getting started** (the first 15 minutes), 3) **Systems explained** (every currency, resource and
  screen, what it does and when it unlocks), 4) **Automation** (what you can automate, how you earn it), 5) **Tips and
  tricks** (concrete advice: what to buy first, good builds, how to beat the hard parts), 6) **Spoilers** (bosses,
  late content, secrets) inside a closed `<details>` with a clear spoiler warning.
- **Facts come from the code.** Every number, unlock condition and name must match the game's source. Read the game
  files, don't guess. If something is unclear, leave it out and list it in the PR description.
- **Lore can be expanded** (history, legends, flavor for places and characters), but it must not contradict any
  in-game text, and must stay original (inspired by the genre, never naming or copying real games).
- **Tone:** friendly and plain, short paragraphs, headings and lists. Each guide 1,500-3,000 words.

## Bugs and feedback
Add one line per issue: what happened, where (zone or screen), and the character's level/class.
