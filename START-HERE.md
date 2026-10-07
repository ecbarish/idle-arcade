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

## Where we are (2026-10-08)

**Wildbond** (creature game): four areas, Thornwood (2-12), Saltmarsh Coast (12-22), Emberfall Highlands (22-32),
Cloudglass Pass (32-42), each with a Warden and badge (cap 15 + 10 per badge, so 55 after four); a walkable world
with towns, trainers, items and riding; art eras Pocket → Pixel/16-bit → HD-2D → Diorama (3D, three.js) unlocked by
badges; day/night, weather, visible wild creatures; ranch and breeding; challenge modes (Nuzlocke, Randomizer, Solo,
Hardcore), rematches, area mastery stars; music. Plans: `docs/creature-game-design.md`; lore: `docs/lore/wildbond.md`.

**Realmbound** (classic-MMO idle, flagship): levels 1-45, five classes, two talent trees each with roles that follow
your build, three 5-person dungeons (Drowned Sanctum, Cindervein Foundry, Silent Barrows with its Grave Chill
mechanic that needs a healer), pets, mounts, companions, earned addons. Item names change every 10 levels to 60. The plan to 60 with the guild and the first raid: `docs/realmbound-40-60.md`; lore:
`docs/lore/realmbound.md`.

**Hub and promo pages:** `index.html`, `promo.html` (Realmbound), `promo-wildbond.html`.

**Parked:** Starfall Guild, Diamond Career (baseball), Otherworld (side lane: structural and polish tasks only), and
Primordial (back burner, least exciting to Evan). Plans in `docs/plans/`.

## Up next (take the first one that isn't claimed; mark it "claimed by <who>, <date>" when you start)

1. ~~**T21: Realmbound item name tiers**~~ — done by ChatGPT, merged 2026-10-08.
2. ~~**T1-B: Grave Chill and pacing 40-45**~~ — done by Claude 2026-10-08. Grave Chill is `graveChill()` in
   11-combat.js (`mech.chill` on the Barrows bosses); pacing results and the sim method are in
   `docs/realmbound-40-60.md` ("Measured: the Barrowfields"). To re-measure a later chapter, copy that method:
   loop `window.__rb.step(0.1)`, keep the quest log full with `accept`/`turnIn`, loot by hand (`lootAll()`) and
   empty bags in "Focus", and replace gear at each level.
3. **T22: Realmbound Hollow Crown, part 1** (any assistant; data). Same shape as T20 (see its ticket in
   `docs/ROADMAP.md`): zone `hollowcrown`, "The Hollow Crown", `lv: [45, 52]`, shared hub *Thornmantle Camp*, a lore
   paragraph, 5 mob types 45-52 (Ashwing drakes use the `lizard` family; corrupted treants as humanoids; wolves,
   spiders, boars of the rotting wood), a legendary tameable elite at 52, 12 voiced quests (`hc1`…) following "The
   Hollow Crown" in `docs/realmbound-40-60.md`, dungeon `rootrot` "Rootrot Hollow" (`minLvl: 49`, levels 49-52,
   4 packs, 3 bosses, existing `mech` keys), `LEVEL_CAP = 52`, `npcZone` 45+ → `hollowcrown`, lore record, checks.
4. **R1: two-hero supply trial** (*design*; Claude preferred). See `docs/plans/realmbound.md` ("First proposed
   system ticket") and the guild section of `docs/realmbound-40-60.md`. Defaults: 3 job slots; one gathering job
   (Mining ore) and one recipe (ore → repair kits); a shared account bank; jobs capped like rested XP; the hero you're
   playing always earns more than one on a job.
5. **T1-C: third talent trees** (*design*): Warrior Fury, Rogue Subtlety, Mage Arcane, Priest Discipline, Hunter
   Survival, same shape as T1-A (25 ranks + capstone at 25 in that tree), plus talents that open new reactive windows.
6. **T24: Wildbond test coverage** (any assistant; tests only) — **sent to ChatGPT 2026-10-08** (branch
   `codex/wildbond-more-checks`). Full ticket in `docs/ROADMAP.md` ("T24"). Extend `tests/wildbond-checks.js` for route
   trainers and items (T7b part 2), challenge modes, rematches and mastery (`15-challenge.js`), eras and weather
   (`weatherNow`, the Pocket/16-bit/HD/Diorama unlocks), and riding.
7. **T25: Split Starfall Guild into files + a test page** (any assistant; no behavior change) — **sent to ChatGPT
   2026-10-08** (branch `codex/starfall-split`). Full ticket in `docs/ROADMAP.md` ("T25"). This is the "parked games
   side lane": parked games get structural and polish work while Claude focuses on the two main games.
8. ~~**Research brief for the big decisions**~~ — done by Claude 2026-10-08: `docs/research/decisions.md` (sources,
   recommendations, and the shared-systems plan: dialogue → sound → roster → world kit).
9. ~~**D1: Wildbond cap table**~~ — done by Claude 2026-10-08. `levelCap()` in 02-state.js uses a table
   (`CAP_TABLE` in 00-data.js): 15, 25, 35, 45, 55, 60, 65, 70, then 75 with all eight badges.
10. ~~**D2+D3: Realmbound group XP split and journey length**~~ — done by Claude 2026-10-08 (measured: groups
   1.0-1.3× solo speed; numbers in `docs/realmbound-40-60.md`). Kill XP ÷
   group size × (1, 1, 1.166, 1.3, 1.4); quest XP whole. A Breezy/Classic/Long Road setting scaling kill and quest XP
   (×1.6 / ×1 / ×0.6), chosen at character creation and changeable in town; re-run the pacing sim afterwards.
11. **D7: shared multiverse record** — claimed by Claude, 2026-10-08: `docs/lore/multiverse.md`.
12. **S1: shared dialogue scenes** (any assistant): move Wildbond's `09-dialogue.js` into `shared/dialogue.js` (portrait
   drawing, typewriter, auto-advance) with a small game-specific adapter, keep Wildbond identical (both test pages
   pass), then use it for Realmbound quest givers' offer/turn-in lines (portraits from a small cast list).
13. **S2: shared sound** (any assistant): same for `10-sound.js` → `shared/sound.js`; give Realmbound effects and
   per-zone music (original tunes), sound off by default.
14. **Then:** the guild, Hollow Crown part 2 and the raid (Realmbound); Wildbond areas 5-8 (bands 52-60, 58-64, 62-68,
   66-72) and the league, contests and races, ranch cosmetics for challenge titles, Modern 3D.

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
