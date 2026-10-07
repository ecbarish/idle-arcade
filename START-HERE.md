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

## Where we are (2026-10-09)

**Wildbond** (creature game): six areas, each with a Warden and badge: Thornwood (2-12), Saltmarsh Coast (12-22),
Emberfall Highlands (22-32), Cloudglass Pass (32-42), Stillreed Basin (52-60), Hollowecho Hills (58-64); caps follow
`CAP_TABLE` (65 after six badges). A walkable world with towns, trainers, items and riding; art eras Pocket (the
faded start, explained in the intro) → Pixel/16-bit → HD-2D (on the shared world kit) → Diorama (3D); day/night,
weather with a Journal forecast, thunderstorms, living ambience and regional battle backdrops; visible wild
creatures; ranch and breeding; challenge modes with ranch pennants, rematches, area mastery; music, effects and rain
sounds. Plans: `docs/creature-game-design.md`; lore: `docs/lore/wildbond.md`.

**T29 ready for review:** `codex/wildbond-sunthread` adds Sunthread Commons (62–68), nine species, Wren's
gathering rematch, Meadowmantle, Warden Halen and the Loom Badge (cap 70). A connected meadow map, two trainers,
Pell at the gathering, three supplies, weather, original music and battle scenery.

**Realmbound** (classic-MMO idle, flagship): levels 1-60 across eight zones, five classes with three talent trees
each, five 5-person dungeons, the 10-person raid **The Hollow Throne** (opened by the Hollow Key; guild adventurers
from any hero can join), pets, mounts, companions, earned addons, quest givers in portrait scenes, music, effects and
rain per zone, living backdrops with weather and a day/night cycle, **walkable towns** (inn, smithy, trainer, stable,
guild hall, Pell and Brisket), the **Guild** (founding, members with mood and favors, guild levels, a jobs board with
Mining, Herbalism, Questing and Guard duty, the supply bank with repair kits and potions). Plans:
`docs/realmbound-40-60.md`; lore: `docs/lore/realmbound.md`.

**Starfall Guild:** small files with checks, its own music, living torches and a night window with falling stars;
parked for new features. **Hub and promo pages:** `index.html`, `promo.html`, `promo-wildbond.html`.

**Shared systems** (`shared/`): engine, creatures, dialogue (S1), sound with rain (S2), roster/jobs (S3), world kit
(S4: walker + HD-2D renderer), ambience (S5). Test pages: `tests/run.html`, `tests/wildbond.html`,
`tests/starfall.html`, `tests/sound.html`.

**Parked:** Diamond Career (baseball), Otherworld (side lane: structural and polish tasks only), Primordial (back
burner). Plans in `docs/plans/`.

## Up next (take the first one that isn't claimed; mark it "claimed by <who>, <date>" when you start)

**The master list is `docs/PROJECTS.md`** (every outlined project, sizes, dependencies, claims, the launch track);
**ground rules and creative freedom: `docs/CREATIVE.md`**. Below are only the next few items in flight.

**Done so far** (details in `docs/ROADMAP.md`, the design docs and git history): T20-T28 content tickets; T1, T1-A,
T1-B, T1-C (talents and pacing); R1 + the guild (with member favors and guild raiders); R2 (the raid); D1-D7
decisions; S1-S5 shared systems (S4 part 1); Wildbond weather forecast, battle backdrops, challenge pennants; shared
rain sounds; walkable Realmbound towns.

1. ~~**Hollowecho ambience**~~ — done by Claude 2026-10-09 (dust, mist colour, bats at dusk, battle scenery).
2. **S4 part 2: the world kit** (Claude) — mostly done 2026-10-09: Wildbond walks on `World.walker`; Wildclan camps and Thornvale's Abbey; the walkable guild hall. **Left:** a walkable guild hall for Starfall Guild; more hub variety (a layout per zone). Originally: move Wildbond's walking (12-walk.js) onto `World.walker` (its 769 checks
   guard it); a layout per Realmbound hub (Wildclan camps, Thornvale's abbey); the guild hall as an interior you
   walk into; then a walkable guild hall for Starfall Guild.
3. ~~**T29: Wildbond area 7, Sunthread Commons**~~ (Codex; data) — **done, awaiting Claude's review, 2026-10-07** (branch `codex/wildbond-sunthread`): levels 62-68; ticket in
   `docs/ROADMAP.md`, "T29".
4. **Wildbond's ending:** area 8 (66-72), then the league and the Champion (around 72-75), the post-game (battle
   tower, legendaries, the road to 100); contests and races; the Modern 3D era.
5. **Realmbound next:** members' personal stories in the guild; battlegrounds (faction rivalry, the raid's closing
   hook); a second raid tier later.
6. **Later (Evan, 2026-10-09): an immersive homepage** that shows off the arcade's engines (a living scene on the
   ambience kit, shared sound, dialogue and creature art, a taste of each game). Build it once the games are further
   along.

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

- 2026-10-09 Claude (night, low on credits, planning only): Evan's new notes are now projects in docs/PROJECTS.md:
  the **Studio** (E1-E7: GM panel, save doctor, text/creature/quest editors, map painter, lighting tuner), the
  **feedback loop** (F1 done: GitHub issue forms for feedback, bugs, suggestions, docs/FEEDBACK.md; F2 in-game button),
  **baby forms and a larger creature roster** (W9 design first, W10-W12), **reactive light** (G7: walls block light,
  sprites lit on the light side, moving lights, cloud shadows, reflections). T29 (Sunthread) not pushed yet.
  **Next:** merge T29 when it lands; then pick from PROJECTS.md (suggested: E1+E2, W9, G2, L-track).
- 2026-10-09 Claude (evening): Evan asked for (1) WoW: Forever-quality lighting, (2) a master project list any
  assistant can work from, (3) room for other assistants' creativity. Wrote `docs/PROJECTS.md` and `docs/CREATIVE.md`
  (linked from AGENTS.md, CLAUDE.md, here); built G1, the light engine (`shared/light.js`) in Realmbound (side view,
  towns, hall) and Wildbond (HD-2D, ambience). Tests: Realmbound 1519, Wildbond 769, Starfall 48, sound 21.
  **Next:** G2 zone lighting passes (any assistant, one zone per PR), review T29, then W1/W2 or R3 (see PROJECTS.md).

- 2026-10-07 Codex: T29 complete on `codex/wildbond-sunthread`, awaiting review, no merge. Sunthread/Halen/Loom/
  Meadowmantle are canon; no caps, eras, journey settings or shared-engine changes. Browser checks: Wildbond 908,
  Realmbound 1519, Starfall 48, sound 21, all pass; saves/hub restored. Map and backdrop desktop/phone checked.
  Rebased onto Claude's new light-engine main; preserved his new notes and shared engine.

- 2026-10-09 Claude (later): S4 part 2: Wildbond's walking on the shared walker; Wildclan camps (tents, firepit,
  torches, totem), Thornvale's Abbey; the guild hall interior with members, favors, chest and jobs board. Tests:
  Realmbound 1513, Wildbond 769, Starfall 48. **Next:** review T29 (Sunthread) when it lands; Starfall's walkable hall.
- 2026-10-09 Claude: reviewed and merged seven ChatGPT branches (T28 Hollowecho Hills, guild member favors, guild
  raiders, shared rain sounds, Wildbond battle backdrops, Journal forecast, challenge pennants); fixed three check
  closings lost in the merge and a portrait crash without a hero; tidied this file; gave Hollowecho its ambience and
  battle scenery; sent T29 (Sunthread Commons) to ChatGPT. Tests: Realmbound 1506, Wildbond 769, Starfall 48, sound 21.
  **Next:** S4 part 2 (item 2).
- 2026-10-07 Codex: pulled Claude's S4 towns and completed guild-wide raid rosters on
  `codex/realmbound-guild-raiders`, awaiting review, no merge. All browser checks pass: Realmbound 1475,
  Wildbond 619, Starfall 48; saves/hub restored, zero errors. Gather button, nine health frames, reserved
  members, desktop/phone layouts checked. Combined with latest S4 main and all six earlier PRs:
  Realmbound 1506, Wildbond 769, Starfall 48, sound 21, all pass. S4 part 2 remains for Claude; PRs #22–27 also await review.

- 2026-10-09 Claude (late night): wrote T28 for ChatGPT (Wildbond Hollowecho Hills); built S4 part 1, the shared
  world kit (walker + HD-2D renderer), moved Wildbond's HD-2D onto it, and made Realmbound's towns walkable (inn,
  smithy, trainer, stable, guild hall, quest giver, Pell and Brisket, Auto stroll). Tests: Realmbound 1448,
  Wildbond 619, Starfall 48. **Next:** review T28 when it lands (and add Hollowecho's ambience); S4 part 2.
- 2026-10-07 Codex: T28 finished in the isolated clone, awaiting PR review; no merge. Wildbond 748, Realmbound 1434,
  Starfall 48 pass with saves restored. Senna/Echo/Undertone are canon; desktop and phone map verified.
- 2026-10-07 Codex: used Evan's lunch-session development authorization for the S5 Journal weather forecast; no merge.
  Shared the current weather schedule with predictions, hid locked routes, added live boundary/rollover checks.
- 2026-10-07 Codex: implemented the S5 regional battle-backdrop follow-up under Evan's lunch-session authorization.
  Shared ambience behind fighters; no save/combat changes. Reduced motion freezes the new scenery. Awaiting review.
- 2026-10-07 Codex: picked the planned ranch cosmetics while Claude prepares to return. Four original static
  pennants display automatically from earned challenge titles, no stats or save-format changes. Branch
  `codex/wildbond-challenge-pennants`, awaiting review; no merge. Tests: Wildbond 627, Realmbound 1434, Starfall 48,
  saves restored; desktop/phone checked. Combined with all five earlier PRs: Realmbound 1465, Wildbond 769,
  Starfall 48, sound 21, all pass. Earlier PRs #22–26 are ready for review; S4 remains claimed by Claude.
- 2026-10-07 Codex: S5 rain audio complete on `codex/shared-rain-audio`, awaiting PR review; no merge. Quiet filtered
  noise in effects or music mode, fades with weather, stops on off/hidden, one loop maximum. No save fields.
  Browser checks: Realmbound 1442, Wildbond 620, Starfall 48, shared sound 21; saves restored. Actual Web Audio
  measured rain signal, dry fade and zero hidden/off output. Combined with PRs #22–25: Realmbound 1465, Wildbond 761, Starfall 48, sound 21, all pass. Earlier PRs remain pending; S4 stays Claude's.
- 2026-10-07 Codex: used Evan's lunch-session authorization for the guild's first member requests; chose one-time
  supply favors, no deadlines, +10 mood/+3 friendship/15 guild XP. Browser checks: Realmbound 1457, Wildbond 619,
  Starfall 48; saves restored. Combined validation of all four lunch PRs also passed: Realmbound 1457, Wildbond 760, Starfall 48. Branch `codex/realmbound-member-requests`, awaiting review; no merge. S4 remains Claude's.

- 2026-10-09 Claude: merged ChatGPT's T27 (Wildbond area 5, Stillreed Basin, levels 52-60, Warden Olan, Reed Badge,
  Stillwake) and gave the basin its own mist and fireflies. Tests: Wildbond 619, Realmbound 1434, Starfall 48.
- 2026-10-07 Codex: T27 complete on `codex/wildbond-stillreed` for Claude's review, no merge. Browser checks pass:
  Wildbond 619, Realmbound 1434, Starfall 48; saves restored, zero errors. Desktop/phone map checked. Existing
  species, story, eras, journey settings and cap constants are preserved; Claude can add Stillreed ambience next.

- 2026-10-09 Claude (late): Wildbond's intro now explains the faded green start (Evan took it for a bug); recorded
  Evan's notes (outside assets allowed with a license and CREDITS.md; an immersive homepage later, item 21); built
  the Realmbound guild (founding, members with mood, guild levels, adventurers on the jobs board, Guard duty).
  Tests: Realmbound 1434, Wildbond 490, Starfall 48. **Next:** review T27 (Wildbond Stillreed) when it lands and add
  its ambience; then S4, the world kit (walkable towns for Realmbound, starting with a guild hall), or Wildbond
  areas 6-8 with ChatGPT.
- 2026-10-09 Claude (evening): built S5, the shared ambience kit (living skies, scenery, weather with lightning and
  thunder, night lighting, fire, life) in all three games; merged ChatGPT's T23 (Crown's Heart, cap 60, Hollow Key);
  the quest log now says which dungeons an attunement quest waits on; raid re-measured at 60 (no retune). Tests:
  Realmbound 1408, Wildbond 488, Starfall 48. Sent T27 (Wildbond Stillreed Basin) to ChatGPT. **Next:** the guild (members, mood, guild level, more job slots); review T27 when it lands.
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
