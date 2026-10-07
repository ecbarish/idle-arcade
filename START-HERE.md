# START HERE

**For Evan:** when one assistant runs out of usage, open any other one (Claude, ChatGPT/Codex, another AI or a
person) and paste the prompt in the box below. Everything it needs is in this file and the files it links.
**For any assistant:** read this file top to bottom before doing anything. It is the single source of "where we are
and what's next". Update it before you stop (see "Before you stop").

```
Repo: github.com/ecbarish/idle-arcade. Read START-HERE.md first and follow it.
Take the first unclaimed task in "Up next", do it, test it as the file says, then update START-HERE.md
("Where we are", "Up next", "Session log") before you stop. Ask me only about the "Questions for Evan".
```

## Rules (short version; HANDOFF.md has the full list)

- **Commit email:** only `206636510+ecbarish@users.noreply.github.com` (set it as the repo's `user.email`). Never a
  personal email.
- **Plain HTML/JS, no build step, no installs.** Run `powershell -ExecutionPolicy Bypass -File serve.ps1` (or
  `python -m http.server 8765`) in the repo folder and open http://localhost:8765/.
- **Tests must stay all-pass:** http://localhost:8765/tests/run.html (Realmbound) and
  http://localhost:8765/tests/wildbond.html (Wildbond). Click **Run checks**. Add checks for what you build.
- **Old saves must keep loading.** New save fields need defaults (Wildbond `fresh()`/`load()`, Realmbound `migrate()`).
- **Small playable steps,** each with a line in README.md's changelog.
- **Save your work to GitHub at the end of every step** (commit and push). Never leave finished work only on one
  computer or only in one assistant's sandbox.
- **What Evan wants:** real games with deep lore, not dashboards; automation is earned, never sold; active play is
  always worth at least as much as Auto; the player picks the pace; explain things in plain words.

## How work moves

- **Claude** works directly on `main` in `C:\Users\evanb\OneDrive\Desktop\idle-arcade` and pushes.
- **ChatGPT/Codex** works in its own clone or a cloud task (never switches branches in that Desktop folder), on a
  branch `codex/<topic>`, opens a pull request and does not merge it.
- **Whoever is next with repo access** (normally Claude) reviews `codex/*` branches: check the author email, read
  the diff, run both test pages, merge with `git merge --no-ff`, push, and note it in the Session log.
- **If Claude is unavailable,** Codex may merge its own PR after both test pages pass, and should say so in the
  Session log so Claude can double-check later. Design calls normally made by Claude (marked *design* below) can be
  made by Codex using the defaults written here; record any decision in the Session log.

## Where we are (2026-10-08, night)

**Wildbond** (creature game): four areas, Thornwood (2-12), Saltmarsh Coast (12-22), Emberfall Highlands (22-32),
Cloudglass Pass (32-42), each with a Warden and badge (cap 15 + 10 per badge, so 55 after four); a walkable world
with towns, trainers, items and riding; art eras Pocket → Pixel/16-bit → HD-2D → Diorama (3D, three.js) unlocked by
badges; day/night, weather, visible wild creatures; ranch and breeding; challenge modes (Nuzlocke, Randomizer, Solo,
Hardcore), rematches, area mastery stars; music and effects from the shared sound system. Plans: `docs/creature-game-design.md`; lore: `docs/lore/wildbond.md`.

**Realmbound** (classic-MMO idle, flagship): levels 1-52 (the Hollow Crown, 45-52, is the newest zone), five classes, three talent trees each with roles that follow
your build, four 5-person dungeons (Drowned Sanctum, Cindervein Foundry, Silent Barrows with its Grave Chill
mechanic that needs a healer), pets, mounts, companions, earned addons, quest givers in portrait scenes, music
per zone and sound effects (off by default), Rootrot Hollow (49-52), and a Supplies tab where heroes you aren't playing
mine ore for repair kits (R1). Item names change every 10 levels to 60. The plan to 60 with the guild and the first raid: `docs/realmbound-40-60.md`; lore:
`docs/lore/realmbound.md`.

**T23 ready for review:** `codex/realmbound-crownheart` adds levels 52-60, Heartwatch Camp, fourteen voiced quests,
the Heartwood Vault (56+), an original zone tune and the Hollow Key gates. `ch14` unlocks the existing raid.
Pacing is recorded in `docs/realmbound-40-60.md`. Evan kept the strict file list: the quest-log message for missing
dungeon clears remains a separate UI follow-up; `qState()` enforces the gate.

**Hub and promo pages:** `index.html`, `promo.html` (Realmbound), `promo-wildbond.html`.

**Starfall Guild:** split into small files with browser checks (T25) and its own music and effects (T26, off by default); still parked for new features.

**Parked:** Starfall Guild, Diamond Career (baseball), Otherworld (side lane: structural and polish tasks only), and
Primordial (back burner, least exciting to Evan). Plans in `docs/plans/`.

## Up next (take the first one that isn't claimed; mark it "claimed by <who>, <date>" when you start)

1. ~~**T21: Realmbound item name tiers**~~ — done by ChatGPT, merged 2026-10-08.
2. ~~**T1-B: Grave Chill and pacing 40-45**~~ — done by Claude 2026-10-08. Grave Chill is `graveChill()` in
   11-combat.js (`mech.chill` on the Barrows bosses); pacing results and the sim method are in
   `docs/realmbound-40-60.md` ("Measured: the Barrowfields"). To re-measure a later chapter, copy that method:
   loop `window.__rb.step(0.1)`, keep the quest log full with `accept`/`turnIn`, loot by hand (`lootAll()`) and
   empty bags in "Focus", and replace gear at each level.
3. ~~**T22: Realmbound Hollow Crown, part 1**~~ — merged by Claude 2026-10-08 after all three test pages passed (929 / 488 / 24); implemented by Codex 2026-10-07, including the owner-approved
   original tune in `17-sound.js`. Awaiting PR review; branch
   `codex/realmbound-hollowcrown`; full ticket in `docs/ROADMAP.md`, "T22"). Same shape as T20 (see its ticket in
   `docs/ROADMAP.md`): zone `hollowcrown`, "The Hollow Crown", `lv: [45, 52]`, shared hub *Thornmantle Camp*, a lore
   paragraph, 5 mob types 45-52 (Ashwing drakes use the `lizard` family; corrupted treants as humanoids; wolves,
   spiders, boars of the rotting wood), a legendary tameable elite at 52, 12 voiced quests (`hc1`…) following "The
   Hollow Crown" in `docs/realmbound-40-60.md`, dungeon `rootrot` "Rootrot Hollow" (`minLvl: 49`, levels 49-52,
   4 packs, 3 bosses, existing `mech` keys), `LEVEL_CAP = 52`, `npcZone` 45+ → `hollowcrown`, lore record, checks.
4. ~~**R1: two-hero supply trial**~~ — done by Claude 2026-10-08 with S3 (`shared/roster.js`, Realmbound `js/18-supplies.js`, Supplies tab; rules in its header and in `docs/realmbound-40-60.md`, "R1 as built"). Originally: See `docs/plans/realmbound.md` ("First proposed
   system ticket") and the guild section of `docs/realmbound-40-60.md`. Defaults: 3 job slots; one gathering job
   (Mining ore) and one recipe (ore → repair kits); a shared account bank; jobs capped like rested XP; the hero you're
   playing always earns more than one on a job.
5. ~~**T1-C: third talent trees**~~ — done by Claude 2026-10-09 (`TALENTS[cls][2]`; checks in the T1-C block). Originally: Warrior Fury, Rogue Subtlety, Mage Arcane, Priest Discipline, Hunter
   Survival, same shape as T1-A (25 ranks + capstone at 25 in that tree), plus talents that open new reactive windows.
6. ~~**T24: Wildbond test coverage**~~ — done by Codex, merged by Claude 2026-10-08: trainers, items, signs,
   riding/running, era unlocks, weather, visible wild creatures, challenge modes, rematches and mastery.
7. ~~**T25: Split Starfall Guild into files + a test page**~~ — done by Codex, merged by Claude 2026-10-08. Layout in
   HANDOFF.md ("Starfall Guild layout"); checks in `tests/starfall.html` (parked games side lane).
8. ~~**Research brief for the big decisions**~~ — done by Claude 2026-10-08: `docs/research/decisions.md` (sources,
   recommendations, and the shared-systems plan: dialogue → sound → roster → world kit).
9. ~~**D1: Wildbond cap table**~~ — done by Claude 2026-10-08. `levelCap()` in 02-state.js uses a table
   (`CAP_TABLE` in 00-data.js): 15, 25, 35, 45, 55, 60, 65, 70, then 75 with all eight badges.
10. ~~**D2+D3: Realmbound group XP split and journey length**~~ — done by Claude 2026-10-08 (measured: groups
   1.0-1.3× solo speed; numbers in `docs/realmbound-40-60.md`). Kill XP ÷
   group size × (1, 1, 1.166, 1.3, 1.4); quest XP whole. A Breezy/Classic/Long Road setting scaling kill and quest XP
   (×1.6 / ×1 / ×0.6), chosen at character creation and changeable in town; re-run the pacing sim afterwards.
11. ~~**D7: shared multiverse record**~~ — done by Claude 2026-10-08: `docs/lore/multiverse.md` (rules, how the worlds
   connect, recurring characters Pell the peddler and the Archivist). Use it whenever writing new lore.
12. ~~**S1: shared dialogue scenes**~~ — done by Claude 2026-10-08 (`shared/dialogue.js`; Wildbond and Realmbound
   both use it). Originally: move Wildbond's `09-dialogue.js` into `shared/dialogue.js` (portrait
   drawing, typewriter, auto-advance) with a small game-specific adapter, keep Wildbond identical (both test pages
   pass), then use it for Realmbound quest givers' offer/turn-in lines (portraits from a small cast list).
13. ~~**S2: shared sound**~~ — done by Claude 2026-10-08 (`shared/sound.js`; Wildbond's `10-sound.js` and
   Realmbound's new `17-sound.js` are thin adapters with each game's own tunes). Realmbound: a tune per zone plus
   dungeon / boss / ghost, a header sound button (off by default, saved in `S.snd`), effects on level, quest,
   tame, rare loot, surge and boss warnings, dodge, death and dungeon clear; givers have their own blip voice.
   Wildbond: drums on four themes, echo, crossfades. A new zone needs a track in `TRACKS` in `17-sound.js`
   (a check fails without one).
14. **Then:** the guild, Hollow Crown part 2 and the raid (Realmbound); Wildbond areas 5-8 (bands 52-60, 58-64, 62-68,
   66-72) and the league, contests and races, ranch cosmetics for challenge titles, Modern 3D.
15. ~~**S3: shared roster and jobs**~~ — done by Claude 2026-10-08 with R1; Herbalism (potions) and Questing added 2026-10-09. Next: the guild (members, mood, guild level, more slots). Originally: assign members to jobs, cap the
   earnings like rested XP, one return report when you come back. Realmbound's guild uses it first, then Starfall
   Guild's adventurers, Wildbond ranch jobs, and Diamond Career's team. Plan: `docs/research/decisions.md` (the
   shared-systems table). After that, S4: the world kit (`shared/world/`, Wildbond's walking world for every game).
16. ~~**T26: Starfall Guild sound**~~ — done by Codex, merged by Claude 2026-10-09 (Starfall 48 checks) (branch
   `codex/starfall-sound`; ticket in `docs/ROADMAP.md`, "T26"). Music and effects through `shared/sound.js`.
17. ~~**T23: Realmbound Hollow Crown II, the Crown's Heart**~~ — **done by Codex 2026-10-07; awaiting Claude's PR review**
   (branch `codex/realmbound-crownheart`; ticket in `docs/ROADMAP.md`, "T23"): levels 52-60, `LEVEL_CAP = 60`, 14
   quests with the Hollow Key attunement (`attune`, `needDun`), dungeon `heartwood` (56+), pacing numbers.
18. ~~**R2: the raid system and The Hollow Throne**~~ — done by Claude 2026-10-09 (`js/19-raid.js`; tuned with an Auto sim: ~11 minutes a clear with good calls, Seraveth ~205 s against a 240 s enrage; Auto without Raid Leader wipes on Choir/Seraveth until it learns). Retune once T23 raises the cap to 60 (raid levels follow `LEVEL_CAP`). Originally: 10 raiders from your characters and companions, a plan
   before each pull, raid calls during it, four bosses, weekly-style lockout (every 3 days), epic loot with tier
   sets. Plan: `docs/realmbound-40-60.md` ("Raids") and decision 5 in `docs/research/decisions.md`. Gate it on the
   Hollow Key (T23's last quest) but build it so it can be tested before T23 lands.
19. ~~**S5: shared ambience kit**~~ — done by Claude 2026-10-09 (`shared/ambience.js`; all three games use it; layout in HANDOFF.md). Ideas for later: Wildbond battle backdrops, a weather forecast in the Journal, rain sounds. Evan asked for it after seeing a living pixel-art
   scene (a floating island at night with rain, lightning, smoke, flickering windows, a campfire, fireflies, a waterfall,
   swaying trees, drifting clouds, a moving character; "the lightning and other moving elements made it most
   impressive"). `shared/ambience.js`, drawn on the games' existing canvases, quality first, used by every game:
   weather (rain with splashes, snow, fog, wind-blown leaves/spores), **lightning storms** (a flash that lights the
   scene, thunder a beat later), fire (embers, smoke bending in the wind, glow), light (flickering windows, lanterns,
   torches, crystals, fireflies, moonlight), **moving scenery** (drifting clouds, swaying trees, running water) and
   **background life** (birds, bats at dusk). Realmbound: a living backdrop per zone and dungeon; Wildbond: richer
   weather and day/night; Starfall: starry sky and torches. Respect reduced motion; cheap on phones.

## Questions for Evan (work continues on the defaults until he answers)

None open right now. **Decided 2026-10-08 (Evan: "go with your recommendations, and yes to the shared universe where
it makes sense"):** see the "Decided" section at the top of `docs/research/decisions.md`. New questions go here, each with
a default so work never waits.

## Before you stop (every session, even a short one)

1. Commit and push everything that works. Half-done work goes on a branch (`claude/<topic>` or `codex/<topic>`),
   pushed, never left uncommitted.
2. Update this file: "Where we are" if something shipped, "Up next" (tick, re-order or add tasks, with enough detail
   that someone with no memory of today could do them), and add a dated line to the Session log.
3. If you added a design decision, put it in the relevant design doc too.

## Session log (newest first; one or two lines each)

- 2026-10-09 Claude (evening): built S5, the shared ambience kit (living skies, scenery, weather with lightning and
  thunder, night lighting, fire, life) in all three games; merged ChatGPT's T23 (Crown's Heart, cap 60, Hollow Key);
  the quest log now says which dungeons an attunement quest waits on; raid re-measured at 60 (no retune). Tests:
  Realmbound 1408, Wildbond 488, Starfall 48. **Next:** the guild (members, mood, guild level, more job slots) and
  Wildbond area 5 (Claude); give ChatGPT a new ticket (ideas: Wildbond battle backdrops on the ambience kit, a
  Realmbound pacing pass for 52-60, or Starfall polish).
- 2026-10-07 Codex: T23 complete on `codex/realmbound-crownheart` for Claude's review; no merge. All browser checks
  pass (Realmbound 1404, Wildbond 488, Starfall 48), saves restored. Focus Warrior: 45-52 282.19 min; 52-55 98.29 min.
  Evan chose to retain the strict file list: locked attunement reasons need a later quest-log UI change.
- 2026-10-09 Claude: merged T26 (Starfall sound); built T1-C (third talent trees for all five classes) and new jobs
  (Herbalism → healing potions, Questing for benched heroes); sent T23 (Crown's Heart 52-60, the Hollow Key) to
  ChatGPT. Evan asked for **larger chunks per prompt**. Tests: Realmbound 972, Wildbond 488, Starfall 48.
  Then built R2, the raid (The Hollow Throne), same session: Realmbound 997 checks. **Next:** review
  `codex/realmbound-crownheart` (T23) when it lands, then retune the raid at cap 60 (sim method in
  `docs/realmbound-40-60.md`, "R2 as built") [done 2026-10-09: T23 merged, raid re-measured at 60, no retune]; Claude next: the guild (members, mood, guild level, more job slots)
  and Wildbond area 5 (it has waited longest; bands in item 14).
- 2026-10-07 Codex: T26 complete on `codex/starfall-sound` for Claude's review, unmerged. Browser checks:
  Realmbound 929, Wildbond 488, Starfall 48; saves restored. Two-minute live audio capture: all three themes,
  no clipping or browser errors; phone-width sound control fits. Subjective listening remains for PR review.

- 2026-10-08 Claude (night, Evan asleep, later): built R1 + S3, the shared roster (`shared/roster.js`) and Realmbound's
  Supplies tab (other heroes mine ore → repair kits); merged ChatGPT's T22 (Hollow Crown 45-52, Rootrot Hollow).
  Tests: Realmbound 929, Wildbond 488, Starfall 24, all pass. **Next chat, start here:** (1) `git fetch`; review
  and merge `codex/starfall-sound` (T26) if it's there; (2) give ChatGPT T23 = Hollow Crown part 2 (the Crown's
  Heart, 52-56, see `docs/realmbound-40-60.md`), writing the ticket in `docs/ROADMAP.md` like T22; (3) Claude:
  T1-C third talent trees (item 5), or the next roster jobs (Questing, Herbalism; item 15), then the guild.
- 2026-10-07 Codex: T22 adds the Hollow Crown (45-52), twelve voiced quests, Veskareth and Rootrot Hollow.
  Evan approved the original zone tune in `17-sound.js` after S2 added per-zone music checks.
  Checks pass: Realmbound 911, Wildbond 488, Starfall 24. `codex/realmbound-hollowcrown` awaits PR review; no merge.

- 2026-10-08 Claude (night, Evan asleep): S2 done, the shared sound system. Realmbound now has its own music and
  effects, and Wildbond's sound improved. All test pages pass: Realmbound 600, Wildbond 488, Starfall 24.
  **Next chat, start here:** (1) `git fetch`; if `origin/codex/realmbound-hollowcrown` exists, review T22 and
  merge it (check the author email, read the diff, run all three test pages, `merge --no-ff`); (2) give
  ChatGPT the next side-lane ticket (T26 Starfall sound was sent too: review `codex/starfall-sound` if it is there); (3) Claude builds R1 together with S3 (items 4 and 15).
- 2026-10-08 Claude (late): merged T24 + T25; built S1, the shared scene system (moods, blinking, choices, faces
  from names): Wildbond switched over unchanged, Realmbound quest givers now speak in portrait scenes with Accept
  / Not now. Sent T22 (Hollow Crown) to ChatGPT. Next for Claude: S2 shared sound.
- 2026-10-08 Codex: T24 (Wildbond checks) and T25 (Starfall Guild split, a three-minute main save loads
  identically); both merged by Claude after all four test pages passed.
- 2026-10-08 Claude (night): Evan accepted all research recommendations and a light shared universe. Built D1
  (Wildbond cap table), D2+D3 (Realmbound group XP split, journey length; groups now ~1.3× solo) and D7
  (`docs/lore/multiverse.md`). Next open: S1 shared dialogue, S2 shared sound, T22 Hollow Crown.
- 2026-10-08 Claude (evening): research brief `docs/research/decisions.md` (level caps, group XP, pace, roster size,
  raids, shared systems and a shared universe). Sent T25 (split Starfall Guild) to ChatGPT; Primordial to the back
  burner at Evan's request.
- 2026-10-08 Claude (later): merged T21 (item names, ChatGPT); built T1-B (Grave Chill; pacing 40-45 measured, no XP
  change; found group questing ~5x faster, added as a question). Sent T24 (Wildbond checks) to ChatGPT. Fixed a
  Frostmere check that depended on which tab a local save was left on.
- 2026-10-08 Claude: wrote this file. Merged T20 (Barrowfields, cap 45) and T19 (promo pages); built T1-A (second
  talent trees, roles, respec) and T17 (Cloudglass Pass, which ChatGPT never delivered). Sent T21 to ChatGPT.
- 2026-10-07 Claude: T13 parts 1-3 (eras), T11b (challenge modes), T1 plan (`docs/realmbound-40-60.md`); merged T14,
  T16, T18 from ChatGPT.
- Earlier history: README.md changelog, `docs/ROADMAP.md`, and `docs/DEVELOPMENT.md` (Codex's notes up to 2026-10-06).
