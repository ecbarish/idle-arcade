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
**Wildbond in Godot (2026-10-08, the newest work):** `wildbond-godot/` plays the whole opening: faded Larkhaven (Ninja
Adventure CC0 tiles, our own parts-built people and creatures in `scripts/figures.gd`), Maren's ranch register (the
character creator; signing paints you in colour), her barn with Cindercub, Ripplet and Mosshog (each with its own body
and habits, Wilddex pages), the bond flooding colour out of the barn, Wren running in, and the first battle on the field
(`scripts/battle.gd`, rules in `scripts/rules.gd` checked number-for-number against the browser). **Thornwood is playable:**
tall grass with wild creatures, catching with Bond (lure + calm meter; each catch brings colour back), Bram and Lise,
Warden Isolde and the Thorn Badge, items, signs, healing with Maren, all 81 creatures with bodies (ten family plans),
and saving with a Continue page. **Saltmarsh Coast and the Emberfall Highlands are playable too** (cliffs, hot springs,
Orsk, Sela, Warden Toren; battles with the highland skyline). Content comes from the
browser game via `tools/godot-export.ps1`; checks: `tests/run_tests.gd` (133); sharing: `tools/godot-build.ps1` once
Evan installs Godot's export templates. The plan for the move: `docs/godot-port-plan.md`.

**Current (2026-10-07):** the goal is Launch (docs/QUEUE.md). Wildbond follows **docs/wildbond-plan.md** (Evan'splay notes turned into principles and phases); Realmbound is balanced and gets its guide and onboarding next. Theolder detail below is history; CLAUDE.md "Where we are" has the short current summary.

**Wildbond** (creature game): eight areas, each with a Warden and badge: Thornwood (2-12), Saltmarsh Coast (12-22),
Emberfall Highlands (22-32), Cloudglass Pass (32-42), Stillreed Basin (52-60), Hollowecho Hills (58-64), Sunthread Commons (62-68),
Farwatch Reach (66-72; W1 merged); caps follow `CAP_TABLE` (75 with all eight badges). A walkable world with towns, trainers, items and riding; art eras Pocket (the
faded start, explained in the intro) → Pixel/16-bit → HD-2D (on the shared world kit) → Diorama (3D); day/night,
weather with a Journal forecast, thunderstorms, living ambience and regional battle backdrops; visible wild
creatures; ranch and breeding; challenge modes with ranch pennants, rematches, area mastery; music, effects and rain
sounds. T30 adds the Returning Light League, Wren's gate battle, four courts and Champion Avenne, with a
Champion title and the colour-restoration ending (v1.2.0; merged). T31/W3 part 1 adds the Lighthouse Spire and daily league rematches (v1.3.0, merged); Stillreed has a walkable ferry landing (W7). Plans: `docs/creature-game-design.md`; lore: `docs/lore/wildbond.md`.

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

**Merged:** G2's Frostmere lighting pass (Realmbound v1.0.1): low snow haze, cool reflected light and blue mountain layers. Other G2 zones remain open.

## Up next (take the first one that isn't claimed; mark it "claimed by <who>, <date>" when you start)

**Autopilot (2026-10-07):** every assistant now works its own lane in [docs/QUEUE.md](docs/QUEUE.md), top to bottom,
without waiting for Evan: Codex/ChatGPT has Lane A, Claude Lane B (reviews first), a third AI (Grok) Lane C. The list
below is background; QUEUE.md is what to do next.

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
3. ~~**T29: Wildbond area 7, Sunthread Commons**~~ (Codex; data) — done by ChatGPT, merged by Claude 2026-10-10 (branch `codex/wildbond-sunthread`): levels 62-68; ticket in
   `docs/ROADMAP.md`, "T29".
4. **Wildbond's ending:** W1 and T30/W2 are merged. T31/W3 part 1, the Lighthouse Spire and daily league rematches, is merged (v1.3.0). Next: roaming legendaries (W3 part 2), contests and races, and the Modern 3D era.
5. **Realmbound next:** members' personal stories in the guild; battlegrounds (faction rivalry, the raid's closing
   hook); a second raid tier later.
   **G2:** Frostmere is merged; Saltmarsh is merged; the other Wildbond areas are T32 (ChatGPT); Realmbound zones remain.
6. **Later (Evan, 2026-10-09): an immersive homepage** that shows off the arcade's engines (a living scene on the
   ambience kit, shared sound, dialogue and creature art, a taste of each game). Build it once the games are further
   along.

## Questions for Evan (work continues on the defaults until he answers)

1. **Browser or a standalone game?** (Evan, 2026-10-07: "the more I see we can do the more I feel it needs to be its
   own game.") Options: (a) keep the browser games and wrap them as a desktop app for Steam later (cheap, same code);
   (b) build Wildbond's next version in the free **Godot** engine (Windows, Mac, Linux, phones and still the web;
   proper 2D with pixel-perfect scaling, and 3D for the "one day first person" goal), carrying over all the story,
   creatures, maps and balance as data; (c) Unity or Unreal (more powerful 3D, but heavy, and harder for AI
   assistants to edit). Claude recommends **(b), starting with a small trial**: the Wildbond opening rebuilt in Godot
   to see how it plays and how well the assistants work in it, before committing. Needs Evan to install Godot (free,
   no account). **Default until he answers:** keep building content and design; hold the big screen rebuild
   (Wildbond phases 1, 3, 4) so it is built once.
2. **Baby forms (W9):** read `docs/proposals/creature-growth.md` and answer its five questions. Default if no
   answer: the recommendations in it (life stages, babies stay on the ranch, elders, 3 ranch days, return-or-adopt).

3. **Heritages for your Wildbond tamer?** (Evan's idea, 2026-10-08.) `docs/proposals/wildbond-heritage.md`: everyone human, but
   you choose where your family comes from (farm, coast, highlands, wanderers), with a small bonding gift and how people
   greet you. Default if no answer: hold until the Godot opening is finished.

**Decided 2026-10-08 (Evan: "go with your recommendations, and yes to the shared universe where
it makes sense"):** see the "Decided" section at the top of `docs/research/decisions.md`. New questions go here, each with
a default so work never waits.

## Before you stop (every session, even a short one)

1. Commit and push everything that works. Half-done work goes on a branch (`claude/<topic>` or `codex/<topic>`),
   pushed, never left uncommitted.
2. Update this file: "Where we are" if something shipped, "Up next" (tick, re-order or add tasks, with enough detail
   that someone with no memory of today could do them), and add a dated line to the Session log.
3. If you added a design decision, put it in the relevant design doc too.

## Session log (newest first; one or two lines each)

- 2026-10-08 Claude (PC session, later): Godot trial: the Emberfall Highlands (cliff road from the coast with the Tide Badge; layered
  cliffs, meadow boulders, amber hot springs with steam, drifting sparks; Orsk, Sela, Warden Toren; battles with a highland skyline).
  Fixed a battle crash when a foe chose a support move (no power value). 133 Godot checks. Next (B2b): the ranch as a place, then
  Cloudglass Pass; the Godot build for friends once Evan installs export templates.

- 2026-10-08 Claude (from Evan's phone, PC session): merged ChatGPT's PR #47 Realmbound onboarding (v1.1.0: arrival scene on the first
  questgiver, optional road guidance) and PR #48 Diamond Career's second contract and first month (v0.2.0). All seven pages pass:
  Realmbound 4407, Diamond 83, Wildbond 1254, Starfall 48, sound 21, offline 15, Otherworld 38. ChatGPT next: A5 R4 guild stories.

- 2026-10-08 Codex: Lane A4 Realmbound onboarding ready in PR #47: existing first request, optional Focus/loot/reward/town/companion guidance, safe legacy defaults and paused arrival replay. All seven pages pass (Realmbound 4407); phone through ultrawide controls/save reload checked. No version/cache bump or merge; Claude's Godot files untouched.

- 2026-10-08 Codex: Lane A4b Diamond Career second contract/30-day first month ready in PR #48 (83 Diamond checks; all seven pages pass), legacy salary IDs preserved, phone through ultrawide checked. Independent Realmbound onboarding is ready in PR #47. Two PRs await Claude; no further Lane A implementation started, no version/cache bumps or merges. Read-only phone/PC Claude test prompt: docs/claude-pc-connection-test.md.

- 2026-10-08 Claude (day): merged ChatGPT's T34 Diamond Career (56 checks pass; on the shelf and the road) and its
  Starfall research review. Queue: ChatGPT next A4 Realmbound onboarding (from the first-hour review), then Diamond Career
  part 2. Godot trial: Larkhaven shop + inn + Pip, the field book (Wilddex + team, J), story moments while exploring
  (Wren rematches, Elderhorn, Breakwatermane), Saltmarsh Coast with Warden Nerys, level caps from badges; 122 checks.
  Next for Claude (B2b): Emberfall Highlands (new tiles), the ranch as a place, then the Godot build for friends once Evan
  installs export templates.
- 2026-10-08 Codex: T34 Diamond Career first call-up/payday prototype (merged by Claude 2026-10-08, 56 checks). Both batting styles, six-game careers, contracts, home/garage, 56 Diamond checks and all six existing pages pass; keyboard/touch, saves and phone/desktop/ultrawide played. No existing version or cache bump. Integrated latest main, preserving Claude's Godot work; Starfall report/prompt cleanup is a separate documentation task.
- 2026-10-08 Codex: Evan's Starfall report preserved and reviewed against existing aggregate combat, Inn recovery and automatic Hall selection; answered prompts archived, one active Gemini queue for Diamond Career/Otherworld/arcade/optional Primordial. Documentation in PR #46; no gameplay changes. T34 is separately ready in PR #45, all seven test pages pass; two PRs now await Claude, so no next Lane A implementation is started.

- 2026-10-08 Claude (overnight, continued): Godot trial, Thornwood playable from the exported data: roads between maps,
  tall grass + water + items, exploring like the browser (62% wild creature), Bond (lure + calm meter, browser catch
  formula), Bag berries, catches restore colour, team of three + ranch, Bram/Lise spot and battle, Warden Isolde and the
  Thorn Badge open the gate, signs, Maren heals, body plans for all ten families (81 creatures), save/load with a
  Continue page, --skip-opening for testing; 98 Godot checks. Next (B2b): Larkhaven's shop and inn as places (lures for
  coins), the Wilddex book, then Saltmarsh Coast from the data.
- 2026-10-08 Claude (overnight, Evan asleep): Godot trial: the partner choice in Maren's barn (full-screen barn, three
  starters with their own bodies and habits, Wilddex pages, Choose / Not yet, colour floods out of the barn), Wren and
  the first battle (classic layout, turn order, orders, results); rules.gd translated and checked against the browser;
  data bridge tools/godot-export.ps1 (Edge, no installs); click/tap to walk; a launcher that finds Godot anywhere; web
  and Windows export presets + tools/godot-build.ps1; 64 Godot checks; docs/godot-port-plan.md answers Evan's questions.
  Measured the first battle (battle_odds.gd): Cindercub won 5 in 100 -> Wildbond v1.6.1 (element moves at level 5:
  97/78/100); browser checks 1254 pass. Next: Evan installs export templates; then Route 1 in Godot (B2b).
- 2026-10-08 Claude: Godot trial: the cub (parts-based creature in scripts/figures.gd: trot, wag, sniff, sit, pounce at a
  butterfly, watches you when you come near) and Maren's ranch register, the character creator (scripts/register.gd:
  name, body, skin, hair, clothes; signing paints you in colour onto your own layer). Fixed after Evan's look: cabins
  were cut off (they are 4 tiles wide), register values now centred. Next: choosing your partner in Maren's barn.
- 2026-10-08 Claude: Godot trial environment now uses the Ninja Adventure CC0 tilesets (grass, dirt paths with edges,
  flowers, garden bushes, cottages, a staggered woods border; scripts/main.gd _draw_ground and _draw_structures; files in
  wildbond-godot/assets/env/). Our figures, fences and sign stay code-drawn. Fan-made Pokemon sprites ruled out
  (Nintendo's characters; docs/wildbond-plan.md). Next: the cub's animation, the character creator, the partner choice.
- 2026-10-08 Claude: Godot trial figures rebuilt from parts (draw_person, LOOKS in scripts/main.gd): head, hair style,  body, apron, swinging arms, legs or a skirt, 4-frame walk in four directions, blinking, idle glances, a dark  outline; the parts system is the basis for the character creator and a later 3D rig. Next: the environment  (Evan liked the pack's structures; pieces kept as separate objects with footprints so they can stand up in 3D).
- 2026-10-08 Claude: Evan rejected the Ninja Adventure look (chibi, no visible legs; preferred our code-drawn figures).  Reverted the Godot trial to the code-drawn tamer, Maren and cub; removed the pack's files from the project. Art  direction recorded in docs/wildbond-plan.md: real proportions with legs, our own art. (The test window that raced  through the opening was the sped-up recording, not the game's real pace.)
- 2026-10-08 Claude: downloaded Ninja Adventure (CC0, 94 MB zip in Evan's Downloads; unzipped to  C:UsersevanbGodotNinjaAdventure; only used files copied into wildbond-godot/assets/ninja). The Godot trial's  tamer, Maren and the cub are now real 4-way animated sprites. Next: the map from the pack's tilesets. Own original  art is the long-term goal (Evan).
- 2026-10-08 Claude: Evan's worries recorded: sports need no physics engine (stats model + readable moments, T34 as  written); Otherworld must not be predetermined: systemic world first, an AI storyteller layer as an experiment  (docs/otherworld-design.md). Asked Evan to approve downloading a CC0 sprite pack for Wildbond's Godot art.
- 2026-10-08 Claude: Otherworld v0.1.0 built in games/otherworld/ (data in 00-data.js: CAST, WORLDS, GIFTS, MEMORIES,  ENDINGS, NODES, EPILOGUES; engine 01-game.js; scenes 02-scene.js): the Between, world and gift choice, name and look,  Asterhold's full life (status window, Mira, 3 branching choices, 8 endings), soul memories and rebirth both ways.  tests/otherworld.html walks every path for every gift and memory set (38 checks). Hub v1.4.0 (portal on the road).
- 2026-10-08 Claude: Evan unparked Diamond Career and Otherworld (answers in docs/research/decisions.md). T34 for  ChatGPT (Diamond Career part 1, games/diamond-career/); docs/otherworld-design.md (choose your world from a list:  Asterhold, Hearthmere, the Ashen Throne; gifts with costs; rebirth by choice and on death); Claude builds O0.
- 2026-10-07 Codex: preserved Evan's Gemini Realmbound report and three source panels in docs/research/; realmbound-first-hour-review.md separates useful companion/UX lessons from incorrect Godot/creature-game/full-Auto assumptions and proposes current-game onboarding tests. Integrated main a2ddc69, preserving Claude's trial fixes. Research only; no gameplay/installs/merges into main, PR #44.

- 2026-10-08 Claude: merged ChatGPT's branch: Wildbond creature variants (T33: Gleaming, tiny/huge, markings; cosmetic;  js/19-variants.js) -> Wildbond v1.6.0, the Realmbound field guide (guides/realmbound.html), and research: its careful  review of Gemini's Godot report (docs/research/godot-production-slice-review.md: keep/try/defer/reject) and Evan's  direction (docs/research/owner-direction-2026-10-07.md: ~US$200 cash ceiling, platforms open, automation serves play).  Godot trial: vertex snapping off (transform snapping only, per Godot docs). Wildbond 1254, Realmbound 4173, offline 15.
- 2026-10-08 Claude: Evan played the Godot trial: "this feels much better". Fixed his notes (Maren off the gate,  fences join vertically, four-way facing with walk frames and idle breathing, cub tail wag and trot). His animation  bar ("better than the first Pokémon") needs real sprite art: docs/wildbond-plan.md "Art and animation".
- 2026-10-07 Codex: saved Evan's supplied Gemini Godot report verbatim as docs/research/godot-production-slice.md; review beside it fact-checks snapping, MSDF, saves and web constraints, rejects invented stamina/chemistry requirements and unsupported schedule. Research only, PR #44; no trial edits, installs or plan adoption.

- 2026-10-07 Codex: recorded Evan's clarified direction in docs/research/owner-direction-2026-10-07.md: open platform choice, approximate US$200 total cash budget, earned help for tedium rather than universal full Auto; Otherworld/Diamond remain in design discussions. Updated the old control contract in docs/plans/README.md to prevent conflicting instructions. Documentation only, PR #44.

- 2026-10-07 Codex: Evan confirmed Godot production research is running in Gemini and requested research for the other games. Added docs/research/first-play-research-pack.md with full Realmbound/Starfall/arcade prompts, parked-game briefs and a newcomer completion gate. Research only; no gameplay/Claude files changed; PR #44.

- 2026-10-07 Codex: reviewed Gemini's creature research and the Godot trial at Evan's request; docs/research/codex-godot-assessment.md adds priorities and migration cautions, gemini-godot-production-prompt.md asks for art/animation and safe-port research. Installed Godot 4.7.2 verified; short headless startup passed. No trial/plan/gameplay changes; documents in PR #44.

- 2026-10-07 Codex: at Evan's request, left Godot and Wildbond to Claude. Lane A8 Realmbound opening audit added to PR #44: four isolated browser diagnostics and an L4/V1 implementation brief in docs/realmbound-first-ten-minutes.md; corrected the guide's Focus fallback explanation. Documentation only; no gameplay, versions or merge.

- 2026-10-07 Codex: T8 Realmbound guide ready in PR #44, stacked on T33 #43; static 2800-word lore/booklet, generated references and hub card link. All five pages pass (1254/4173/48/21/15), phone through ultrawide, links/spoilers/save safety checked. T32 scope conflict documented in docs/proposals/wildbond-area-air.md; no partial lighting shipped. Two PRs await review; no version/cache bump or merge.

- 2026-10-07 Codex: T33/W14 variants ready in PR #43 (codex/wildbond-variants): Gleaming, tiny/huge and seeded markings, cosmetic only; egg inheritance, old-save defaults, Wilddex records and all-era art. All five pages pass (1254/4173/48/21/15), saves/hub restored, phone through ultrawide and actual Diorama checked. Small label/drawing adapters only; no restyle, version/cache bump or merge. Continuing Lane A.

- 2026-10-07 Claude: Evan installed Godot 4.7.2 (unzipped to C:UsersevanbGodot). Built the trial in wildbond-godot/  (README there): faded Larkhaven on the real map at 384x216 with integer scaling, Maren walks up and speaks in  bubbles, the first bond floods colour back (fade.gdshader), the partner follows. Verified headless and with recorded  frames. Waiting for Evan to play it (Play Wildbond trial.bat) before deciding browser vs standalone.
- 2026-10-07 Claude: saved Gemini's research (docs/research/creature-games-ux.md) and mapped its lessons onto  docs/wildbond-plan.md phases. Evan is considering a standalone game: options and a recommendation (Godot, small  trial first) are Question 1 in Questions for Evan; the screen rebuild waits for his answer.
- 2026-10-07 Claude: rewrote the plans from Evan's play notes: docs/wildbond-plan.md (one plan, principles + phases  1-7), queue lanes A and B rewritten, CLAUDE.md "Where we are" rewritten, T33 creature variants ticket for ChatGPT.
- 2026-10-07 Claude: merged ChatGPT's launch balance (Wildbond L7a: Stillreed 46+, later Wardens within caps; Realmbound  L7b: late-zone xpMult .6 from level 40). Wildbond v1.5.2: DAY_SECONDS 3600, AUTOPILOT=false (Auto-explore off).  Recorded Evan's notes: characters present in the intro (B3b), W13 character creator, W14 creature variants, V10 big  worlds/first person. Wildbond 1225, Realmbound 4173 checks.
- 2026-10-07 Claude: Wildbond v1.5.1 (results wait for Continue, visible tamer, close view, softer fade, ranch/breeding/  pennants appear with the story: `ranchOpen`, `breedOn`). Evan wants Wildbond to be all game world: plan in  docs/wildbond-immersive.md, queued as B3a (Claude, top priority). 1214 checks.
- 2026-10-07 Codex: L7b/R8 Realmbound audit ready in PR #42, stacked on #41. Fifteen actual-combat class/journey runs complete story and both Heroic 1 clears; proposed late-zone 0.6 XP budget gives Classic 40–60 19.91–23.77h. All five pages pass (4173/1225/48/21/15), saves/hub restored; no version/cache bumps or merge. Two audit PRs await Claude.

- 2026-10-07 Codex: L7a/W8 Wildbond pacing audit in PR #41 (codex/wildbond-launch-balance): 15-case before/after simulations, smoother Stillreed entry, cap-aligned late Wardens, 11 new regression checks. All five browser pages pass (4150/1213/48/21/15), saves/hub restored. Failed Nuzlocke starts are distinguished from second-chance completions; no version/cache changes or merge. Next: Lane A3 Realmbound pacing.


- 2026-10-07 Claude: Wildbond v1.5.0 from Evan's second play notes: turn-based battles (`S.battleStyle`, `B.wait`,  `chooseTurn`, `moveInfo`), autopilot earned at the first badge (`autoEarned`; fixed lastInput -99 bug), new  journeys start in faded colour (`S.faded`, body.faded filter; Thorn lifts it), panel menu buttons removed (walk;  `fastTravel` at the Ember Badge, `S.visited`), roles and stat help on cards (`roleOf`, `STAT_HELP`). 1214 checks.
- 2026-10-07 Claude: Evan's first Wildbond play notes -> v1.4.0: start screen picks then confirms (`START.pick`,  `starterCard`, Begin), story names + random, challenge modes unlock at Champion (`modesUnlocked`, localStorage  wildbond-modes-unlocked), Maren's Wilddex goal lines, fixed a missing comma that swallowed two intro lines.  docs/wildbond-opening.md has his notes, the premise and part 2 (queue B3b). Wildbond 1209 checks.
- 2026-10-07 Claude: vision V9 (choices that matter, Mass Effect). L3 phone pass part 1: shared/settings.js adds 40px  tap targets on phones/touch (audit at 375px: Wildbond 13, Realmbound 27, Starfall 15 small targets -> 0); launcher  starts phones on the road. Tests pass (Wildbond 1202, Realmbound 4150, Starfall 48).
- 2026-10-07 Claude: votes confirmed working (first response in Evan's form). Wrote docs/VISION.md from Evan's  brainstorm (prologues, too-retro worry, game boxes, procedural content, bot world, friends, nodes, automation as QoL)  and projects V1-V8; CLAUDE.md, CREATIVE.md ("old soul, modern craft") and AGENTS.md point to it; queue A5 now  includes prologues, B4b game boxes.
- 2026-10-07 Claude: votes connected to Evan's Google Form (shared/votes-config.js; a Pages build was skipped, re-pushed).  L8 part 2, the road (launcher/launcher.js `road()`, STOPS = the four games + building sites for games in design),  from Evan's feedback (hall scales better, likes a character). Poll is now `launcher-style-2`. Hub v1.3.0.
- 2026-10-07 Claude: L8 part 1: launcher/launcher.js (the living world on the real clock, ?time=dawn|day|dusk|night  to preview; the arcade hall with walkable cabinets), shared/votes.js + votes-config.js (Google Form, empty until  Evan sets it up: docs/VOTES.md), poll `launcher-style-1` on the hub. Hub v1.2.0, fresher game blurbs.
- 2026-10-07 Claude: merged R9 heroic loot review (ChatGPT, +2613 Realmbound checks) and Saltmarsh follow-up notes;  L1 settings (Lane B2): shared/settings.js (loads right after engine.js; text size via --arc-text in each style.css,  motion by answering matchMedia's reduced-motion query) and per-game rows in wildbond 18-settings.js, realmbound  25-settings.js, starfall 10-settings.js. Wildbond 1202, Realmbound 4150, Starfall 48, offline 15. Next: B3 launcher.
- 2026-10-07 Claude: L2 save safety (Lane B1): shared/engine.js keeps automatic backups (arcade-backup:<key>:auto-recent  and auto-day-<date>, Studio format), load() recovers from them, `Arcade.saveToolsHTML(KEY)` box in all three games,  `Arcade.validators`; GM pruning skips auto backups; test runners restore backup keys. Wildbond 1199, Realmbound 1537,  Starfall 48, sound 21.
- 2026-10-07 Claude: decided with Evan: the next phase is **Launch** (both games content complete, not launch ready).  docs/QUEUE.md now leads with the launch checklist; Lane A: T32, then bug bash and balance (both games), guides and  lore pages (T8 unparked), onboarding; Lane B: save safety, settings, the arcade launcher, phone, accessibility.  Both games become 2.0 at Launch; a new game only after (docs/research/decisions.md).
- 2026-10-07 Codex: Lane A2/R9 Heroic loot review ready in PR #40 (`codex/realmbound-heroic-review`). Rootrot/Heartwood already match the shared ladder and seven-drop budget; no balance, version or cache changes. All five pages pass (Realmbound 4150, Wildbond 1194, Starfall 48, sound 21, offline 15), saves/hub restored. Review measurements in docs/realmbound-heroic-review.md.

- 2026-10-07 Claude: docs/QUEUE.md, the autopilot work queue: a lane per assistant (A Codex, B Claude, C Grok/other),  the loop (claim, build, PR, next; max two open PRs), and rules that avoid conflicts (Claude bumps versions and edits  START-HERE's status sections at merge).
- 2026-10-07 Claude: G2 for every Realmbound zone (23-light.js `ZONE_LIGHT`: per-zone `night` colour, bounce, grade,  shafts, fogTop; 20-ambience.js `ambFront` holds the visual dark to 30% while the sun is up, fixing grey sunsets;  towns use the zone night). Realmbound v1.0.2, 1537 checks. **Next for Claude:** G2 dungeons, or W3 part 2 (roaming  legendaries); review T32 when ChatGPT finishes.
- 2026-10-07 Codex: integrated main b9d526b into `codex/wildbond-saltmarsh-light` after Claude merged PR #38 during validation. Preserved T32 and online-first offline code unchanged. All five pages pass: Wildbond 1194, Realmbound 1534, Starfall 48, sound 21, offline 15; saves/hub restored. Follow-up contains refreshed screenshots, validation notes and a v1.3.1 tester route only. No Codex merge into main.


- 2026-10-07 Claude: merged G2 Saltmarsh lighting (ChatGPT; Wildbond v1.3.1, 1194 checks); wrote T32 (lighting for  every other Wildbond area, `codex/wildbond-area-light`) for ChatGPT. **Next for Claude:** G2 for Realmbound zones and  dungeons (not Frostmere), or W3 part 2 (roaming legendaries).
- 2026-10-07 Claude: merged six ChatGPT branches: T31 post-game (Spire + league rematches, v1.3.0), W7 ferry landing,
  G2 Frostmere lighting, F4 playtest notes, L6 credits, L5 offline. **Changed L5 to online first** (sw.js: network
  first with a 4 s fallback to the kept copy, no `CACHE_VERSION` bumps, takes over at once; docs/offline.md says why).
  Hub header combines What to try, Credits and Install. playtest.html gained a v1.3.0 Wildbond route. All pass:
  Wildbond 1176, Realmbound 1534, Starfall 48, sound 21, offline 15. The browser pane can't run service workers, so
  the live install is unchecked: on the site, the hub should say "Ready for offline play".
- 2026-10-07 Codex: T31/W3 part 1 complete on `codex/wildbond-postgame` (PR #37), awaiting review, no merge. Wildbond v1.3.0; Spire, safe persistent rewards/eggs, daily league rematches. All four browser pages pass; real 30-floor command-driven max-level climb completed, all five art styles (including actual 3D) and four screen sizes checked. Preserved Claude’s wider view/feedback keyboard changes. Next: review pending PRs; W3 roaming legendaries remains open.

- 2026-10-07 Claude: Wildbond view distance (L11: `VIEWS`, `viewMult()`, `cycleView()` in 06-scene.js; header button
  and V key; `S.view` optional, no `fresh()` change so T31 merges cleanly); feedback menu keys no longer walk. 1123
  checks. **Next for Claude:** W9 baby-forms design (`docs/proposals/creature-growth.md`), then G2 zone lighting.
- 2026-10-07 Claude: merged T30 (ChatGPT, the league and Champion, Wildbond v1.2.0, 1120 checks; played through to
  the Champion title); wrote T31 (post-game part 1: the tower and league rematches) for ChatGPT on
  `codex/wildbond-postgame`. **Next for Claude:** W9 baby-forms design, or the wider walkable view (L11).
- 2026-10-07 Codex: T30/W2 complete on `codex/wildbond-league`, awaiting PR review; no merge. Returning Light League, Wren, four courts, Avenne and the colour-restoration homecoming; Champion title, daily progress and reload recovery, v1.2.0. All four pages pass: Wildbond 1120, Realmbound 1519, Starfall 48, sound 21; saves/hub restored. Phone/laptop/desktop/3440x1440 and five eras checked.

- 2026-10-07 Codex: G2 Frostmere lighting ready for review on `codex/realmbound-frostmere-light`; no merge. Realmbound v1.0.1; low snow haze, cool bounce and blue distant layers. Four browser pages pass: Realmbound 1534, Wildbond 1044, Starfall 48, sound 21; saves/hub restored. Dawn/noon/night/blizzard, hubs, High/Low, reduced motion and 375/1366/1920/3440 widths checked; save reloaded. Before/after captures in `docs/screenshots/`. Claude's league retry investigation is untouched.
- 2026-10-10 Claude: E3 save doctor in studio.html (summary, health check with fixes, searchable editor; per-game
  rules in `DOCTOR`, labels in `LABELS`; backs up before writing). **Next:** review T30 when it lands; W9 design or
  the wider walkable view (L11).
- 2026-10-10 Claude: L11 part 2: panels, text and buttons scale with CSS `zoom` at 1700 px+ (1.12) and 2400 px+
  (1.3); canvases never zoom so taps stay exact (checked at 3440x1440 in all three games; tests pass). **Next:** review
  T30 (`codex/wildbond-league`) when it lands; then E3 save doctor, or W9 design, or the wider walkable view (L11).
- 2026-10-10 Claude: merged W1 (ChatGPT, Farwatch, Wildbond 1044 checks, v1.1.0); sent T30 (Wildbond's ending: the
  league and the Champion) to ChatGPT; L11 part 1: wide layouts for desktops and ultrawides (CSS only, verified at
  3440x1440). **Next:** review T30; L11 part 2 (panel text and buttons scale), or E3 save doctor, or W9 design.
- 2026-10-07 Codex: W1 Farwatch Reach complete on `codex/wildbond-area8`, awaiting PR review; no merge. Rysa/Horizon/Watchlight, nine species, harbor map, Wren's shared-notes rematch, original tune and coastal backdrop are canon. Wildbond v1.1.0; no save or engine changes. All four browser pages pass: Wildbond 1044, Realmbound 1519, Starfall 48, sound 21; saves/hub restored. Five art eras and 375px phone map/backdrop checked.

- 2026-10-10 Claude: built the Studio (E1 part, E2): studio.html (GM mode, save backups/download/import/restore, GM
  log) and the GM panel (shared/gm.js) with actions in every game. Tests: Realmbound 1519, Wildbond 908, Starfall 48,
  sound 21. ChatGPT is on W1 (Wildbond area 8). **Next for Claude:** E3 save doctor or W9 baby-forms design; G2.
- 2026-10-10 Claude: merged T29 (ChatGPT, Sunthread Commons, Wildbond 908 checks). Jules (Google's coding agent, first
  task, L9 + F2) couldn't push from its sandbox, so Evan pasted its diff and Claude applied it with three fixes
  (Wildbond's context read the wrong fields, Starfall's season field, `VERSION` placed above 'use strict').
  **Jules is paused (Evan, 2026-10-10: more work than it was worth).** ChatGPT and Claude carry the work. If Jules is
  ever used again: Evan must press "Publish branch / Publish PR" in its code panel, and its guesses need checking.
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
  Realmbound 1513, Starfall 48, sound 21, all pass; saves/hub restored. Map and backdrop desktop/phone checked.

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
