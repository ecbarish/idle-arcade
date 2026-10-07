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
- [x] **T11b: Challenge modes and rematches** (Claude, done 2026-10-07; ranch cosmetics for titles still to come): Nuzlocke/Randomizer/Solo/Hardcore at a new game,
  Warden and Wren rematch tiers, area mastery stars.
- [x] **T13 part 3** (Claude): the Diorama era (Ember Badge): the same maps as a voxel model in three.js, sprites
  extruded into voxels, an orbiting camera; riding your lead creature. Done 2026-10-07. Modern 3D and VR later.
- [x] **T13 part 2** (Claude): the HD-2D era (Tide Badge): perspective view of the same maps with standing sprites,
  haze, depth of field and light; weather that changes spawns; wild creatures you can see in the grass. Done 2026-10-06.
- [x] **T13 part 1** (Claude): the Pocket era to start, color returning with the Thorn Badge, running shoes,
  day/night clock, era-aware townsfolk. Done 2026-10-06. Parts 2 (HD-2D) and 3 (Diorama) follow.
- [ ] **T13: Era progression in the world** (Claude, after T7b): Pocket (Game Boy) → 16-bit → HD-2D → voxel
  Diorama → modern 3D → first-person/VR, each with era-matched mechanics and story beats. See "Eras you walk through"
  in docs/creature-game-design.md. T7b must keep the tile map separate from the renderer.
- [x] **T7b part 1: Walkable world** (Claude): top-down tile maps for Larkhaven, Thornwood, Saltmarsh Coast and
  Emberfall (games/wildbond/js/11-maps.js, data only); walking by keys or tap (12-walk.js); tall grass finds wild
  creatures; inn, shop and Maren's ranch you walk into; townsfolk and Wardens standing in the world; Auto-explore
  walks the grass. Drawn through `ART[era].tile/walker`. Done 2026-10-06.
- [x] **T7b part 2** (Claude): route trainers who spot you, items on the ground, your lead creature following you,
  signposts. Done 2026-10-06. Later: more townsfolk; the menu shortcuts (Rest, Buy lures, Travel) can retire.
- [x] **T10: Wildbond third area, data only** (ChatGPT): see the T10 section below.

- [x] **T12: Realmbound lore pass** (ChatGPT): see the T12 section below.
- [x] **T14: Wildbond lore bible and region outline** (ChatGPT, docs only): see the T14 section below.
- [x] **T15: Emberfall Warden and badge, data only** (ChatGPT): see the T15 section below.
- [x] **T16: Wildbond browser checks** (ChatGPT, tests only): see the T16 section below.
- [ ] **T17: Wildbond area 4, Cloudglass Pass** (ChatGPT, data + map): see the T17 section below.
- [ ] **T19: Promo pages for friends** (ChatGPT, pages only): see the T19 section below.

### T19: Promo pages for friends (pages only)
`promo.html` (linked from the hub) is a "game box back cover" for Realmbound, but it's out of date: it lists Wildbond
as "Creature game · Planned" and doesn't know Realmbound reaches level 40. Bring it up to date and give Wildbond
its own. **Change only `promo.html`, a new `promo-wildbond.html`, and the hub `index.html`** (the Wildbond and
Realmbound entries in its `GAMES` list, and a promo link like the existing one). Don't change games/, shared/ or
docs other than ticking T19 here. Claude is working in games/wildbond/ meanwhile.
- **promo.html (Realmbound):** update facts from the game and README (levels to 40, Frostmere and the Winter Road,
  Hushfang, the lore pass: quest givers who answer when you turn in). In "Also in the arcade", replace "Creature game
  · Planned" with **Wildbond** (status like the hub's "Early access") linking to promo-wildbond.html.
- **promo-wildbond.html:** same idea and structure (title, a short pitch, "What's in it today" feature cards, "Where
  it's headed", play button to games/wildbond/), with Wildbond's own look: reuse the hub's Wildbond colors and fonts
  (Fredoka/Nunito), not Realmbound's bronze. Cover, in plain words for friends: picking a partner and your rival
  Wren; walking a real world (towns, tall grass, trainers who spot you, items, riding your partner); catching with
  lures and timing; raising, training and breeding on the ranch (hybrids, potential grades); Wardens and badges that
  raise your level cap; choosing your journey length; the world's look growing with the story (a faded handheld
  start, color, then light and depth, then a little 3D diorama you can turn); day/night, weather, music. "Where it's
  headed": more regions, contests and races, challenge modes. Facts must match the game: read README.md's changelog
  and games/wildbond/js/00-data.js, don't invent features. A small live scene at the top is welcome if it stays
  simple (a canvas drawing a couple of creatures and the tamer like the hub covers do); no screenshots needed.
- Plain HTML/CSS/JS, no build, readable at phone width (16px side gutter, no sideways scrolling), light and dark
  are both fine. Check both pages and the hub at http://localhost:8765/ (serve.ps1).
- [x] **T18: Wildbond music for every place** (ChatGPT, sound only): see the T18 section below.

### T18: Wildbond music for every place (sound only)
Wildbond's chiptune music (games/wildbond/js/10-sound.js) has tracks for Thornwood, the Saltmarsh, battles, trainer
battles and legendaries, written as note strings and played live by Web Audio. Give every place and moment its own
tune. **Change only games/wildbond/js/10-sound.js** (plus ticking T18 here). Claude is building the Diorama era
in other files, and T17 is editing 00-data.js and 11-maps.js.
- **New tracks** in `TRACKS`, same format (one 8th note per token, `.` = rest, `mel` and `bass` the same length,
  `bpm`, optional `shift`): `larkhaven` (cosy home town, gentle), `emberfall` (warm, a bit adventurous, highland
  air), `cloudglass` (airy, high, a little lonely; T17's area 4 uses the biome id `cloudglass`), `warden` (a Warden
  battle: proud and serious, faster than `trainer`), `night` (a soft, slower variant for any area at night) and
  `rain` (a calm, steady tune for rainy weather). Each melody 32-64 tokens, original (never copy real songs), and
  musical: stay mostly in one key, end in a way that loops smoothly back to the start.
- **Choose them** in `musicKey()`: Warden battles (`B.story` is a beat with `gate`, look it up in `STORY`) play
  `warden`; in town (`S.pos` on a map with no `biome`) play `larkhaven`; out in an area, `night` when `isNight()`
  is true, otherwise `rain` when `weatherNow() === 'rain'`, otherwise the area's own track if it has one. Both
  `isNight` and `weatherNow` already exist (12-walk.js); call them only when `S.pos` is set.
- **Voices:** add `vessa` (T17's Warden) and the route trainers in 11-maps.js (`bram`, `lise`, `cato`, `marit`,
  `orsk`, `sela`) to `VOICE`, each a pitch in Hz that suits the character (dialogue blips).
- **Check:** serve the repo (serve.ps1), open http://localhost:8765/games/wildbond/, set Sound to "Effects + music"
  with the header button and listen in town, Thornwood and a battle; `tests/wildbond.html` must still pass.

### T17: Wildbond area 4, Cloudglass Pass (data + map)
Build area 4 from the "Area 4 proposal: Cloudglass Pass" in docs/lore/wildbond.md (Evan approved it by sending
this ticket). **Change only games/wildbond/js/00-data.js and games/wildbond/js/11-maps.js** (plus ticking T17 here
and adding Cloudglass to docs/lore/wildbond.md as canon). Claude is building the HD-2D era in other files meanwhile;
in 00-data.js don't touch `ERAS`, `JOURNEY` or the cap constants.
- **00-data.js:** `BADGES.beacon` (Beacon Badge); a `CAST.vessa` speaker (Warden Vessa, 'Warden of Cloudglass Pass';
  `hair` one of short, long, bun, spiky, hat); `BIOMES.cloudglass` with `lv: [32, 42]`, `req: 'ember'`, its own
  `sky`/`hill`/`ground` colors (misty, pale rock) and a wild table; 8-10 new `SPECIES` mixing Gale birds and horses,
  Stone cats and spiders, Radiant sprites, with the T6 rules (existing families, elements and `MOVES` only; base
  stats about 300 basic / 420 evolved; a one-line `dex`), one two-stage evolution line (`evo.at` 40 or lower), one rare
  species (low weight) and **Lanterncrest** (Radiant bird, `unique: 1`, `big: 1`, not in the wild table).
- **STORY** (after the Emberfall beats, same shape as theirs, `biome: 'cloudglass'`): a Wren rematch at 6 following
  the lore's Wren beat (`team` ending `['$rival', 39]`, levels 37-39); the Lanterncrest encounter at 14
  (`wild: ['lanterncrest', 41, 4]`); Warden Vessa at 24 (`gate: 'beacon'`, `trainer: 'Warden Vessa'`, team at levels
  41, 42, 44, judging asking for help and sharing responsibility). Each with `title`, `text`, `lines` (3-4), `win` (2-3).
- **11-maps.js:** a new `MAPS.cloudglass` (`name: 'Cloudglass Pass'`, `biome: 'cloudglass'`), about 30 wide and 14
  tall, using only the tile letters in the legend at the top of the file (rock `R` edges suit a mountain pass), with
  tall grass patches, a path, an `S` exit at the bottom back to Emberfall, `start`, `warden` spot, one signpost (`P`
  + `signs`), three `items`, and two route trainers (`npcs` with `trainer`, teams at levels 34-40, short warm
  dialogue like the existing ones; add their speakers to the `Object.assign(CAST, ...)` list in that file).
  **Emberfall gets a way up:** change Emberfall's row 0 columns 13-14 from `RR` to `NN` and row 1 columns 13-14 from
  `RR` to `..`, and add `N: { to: 'cloudglass', x: <arrival x>, y: <arrival y>, dir: 'up', locked: '<a line about
  needing the Ember Badge>' }` to Emberfall's `exits`. The Cloudglass `S` exit returns to Emberfall at x 13, y 1.
- **Check:** serve the repo with serve.ps1 and open http://localhost:8765/tests/wildbond.html: every check must pass
  (it validates maps, exits, NPC spots, speakers and moves). Then play it: give a save the first three badges with
  `window.__wb` on http://localhost:8765/games/wildbond/, walk north out of Emberfall, and make sure the pass, its
  trainers, items and Warden work and the Beacon Badge raises the level cap to 55.

### T16: Wildbond browser checks (tests only)
Realmbound has `tests/run.html` (click **Run checks**, get PASS/FAIL, no Node.js). Give Wildbond the same, so every
future change can be checked in a minute. **Create only `tests/wildbond.html` and `tests/wildbond-checks.js`** (plus
ticking T16 here). Don't change games/, shared/ or other docs: Claude is building T7b part 2 in Wildbond meanwhile.
- **How it runs:** like tests/run.html: served by `serve.ps1`, it loads games/wildbond/index.html in a same-origin
  iframe, uses the localhost hook `window.__wb` plus the game's globals (`iframe.contentWindow`), runs every check,
  and lists each as PASS/FAIL with a summary line `PASS — N checks.` or `FAIL — x of N failed.` in `#summary`.
  **Back up `localStorage['wildbond-save-v1']` and the hub's progress first and restore them afterwards**, even
  when a check throws. Battles can be finished by calling `worldTick(0.1)` in a loop; skip scenes with `skipTalk()`.
- **Data checks** (read the data, no playing): every map in `MAPS` has rows of equal length; every exit letter in a
  map's rows has an `exits` entry whose `to` map exists and whose arrival tile is walkable; every `doors` key sits on a
  `D` tile; every NPC's `who` is in `CAST` and stands on a walkable tile; every `warden` spot is walkable and its
  area has a Warden beat in `STORY`; every `STORY` speaker and every `win`/`lines` speaker is a `CAST` key, `''` or
  `'@<species id>'`; every species' learnset uses moves in `MOVES`; every `evo.to` and every wild-table id is a
  species; every `gate` is a key of `BADGES`; every biome `req` is a badge some Warden gives.
- **Play checks** (through `__wb` on a fresh save): choosing a starter puts you in Larkhaven; walking north reaches
  Thornwood; the Thornwood north gate is locked without the Thorn Badge and open with it; soft/hard/off caps behave
  (soft: a creature at the cap still gains a little XP; hard: none; off: grows past it); `levelCap()` is 15, 25, 35,
  45 with 0-3 badges; each Warden can be challenged on their own map (not in town), beating them awards their badge;
  an old save without `pos`, `journey` or `capMode` loads with defaults; the inn heals; the shop sells 5 lures for 50.
- Add one line to the top of the page saying what it checks, and keep the file plain HTML/JS (no build, no installs).

### T15: Emberfall Warden and badge (data only)
Emberfall Highlands (levels 22-32) is the only area without a Warden. Add one, using the Warden system T11 built.
**Change only games/wildbond/js/00-data.js** (plus ticking T15 here). Claude is building the walkable world (T7b)
in other files at the same time.
- `BADGES`: add one badge (pick an id and a name that fit a volcanic highland, e.g. `ember: { name: 'Ember Badge' }`).
- `CAST`: add the Warden as a speaker (same fields as `isolde`/`nerys`; `hair` must be one of short, long, bun,
  spiky, hat; `hatCol` only with `hat`). Give them a title like 'Warden of Emberfall'.
- `STORY`: add one beat right after the `hearthstag` beat, copying the shape of the `warden2` (Warden Nerys) beat:
  `biome: 'emberfall'`, `at: 24`, a unique `id` (e.g. 'warden3'), `gate: '<your badge id>'`, `title`, `text` (one
  journal line), `lines` (4 lines: one narration line setting the scene, then the Warden), `win` (3 lines: praise, the
  badge handed over, a hint about something old further on), `trainer: '<Warden name>'` matching CAST, and `team` of
  three from Emberfall's own species at levels 31, 32 and 34 (use the evolved form `kilntusk`, not `slaglet`, if
  you use that line). The game already shows the "Challenge" button, plays the scenes, awards the badge and raises
  the level cap from these fields; no code changes are needed.
- **What this Warden judges** must differ from the others: Isolde judges bond ("does your team fight *for* you"),
  Nerys judges adapting ("can your team change with the tide"). Pick something new (patience, endurance under heat,
  trust under pressure...) and make the dialogue show it. Match the existing tone: warm, plain, a little wry.
- Test: serve the repo (`serve.ps1`), open http://localhost:8765/games/wildbond/, and in the console use the
  localhost hook `window.__wb`: give a save both badges, set `S.biome = 'emberfall'` and
  `S.exploredIn = { emberfall: 24 }`; the Challenge button must show your Warden's name, the scene must play,
  and winning must add the badge and raise `__wb.levelCap()` to 45. No console errors.

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
