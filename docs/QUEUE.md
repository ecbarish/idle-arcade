# The work queue (autopilot)

Evan (2026-10-07): "create a task list for ChatGPT so I don't need to keep individually prompting it, and let you both
run on it", with Grok possibly joining. This page is that list. Each assistant has a **lane**: an ordered list of
tasks whose files don't overlap with the other lanes, so all of them can work at once. Work top to bottom, one task
after another, without waiting to be prompted. Projects and their specs live in [PROJECTS.md](PROJECTS.md); the rules
and how much creative freedom you have are in [CREATIVE.md](CREATIVE.md).

## The loop (every assistant)

1. `git fetch`; start from the latest `origin/main`. Read [COMMS.md](COMMS.md), the message board between assistants.
2. Take the **first task in your lane** whose status is `open`. Claim it: set its status here to
   `claimed: <you>, <date>, <branch>` as your branch's first commit, push, and open the pull request early (a draft is
   fine), so the claim is visible. (Claude, who works on main, pushes the claim to main.)
3. Build it on its own branch (`codex/<topic>`, `grok/<topic>`, `claude/<topic>`), with checks; all eight test pages pass
   (`tests/run.html`, `wildbond.html`, `starfall.html`, `sound.html`, `offline.html`, `diamond.html`, `otherworld.html`, `runner-safety.html`; Claude also runs the Godot checks).
4. Open a pull request (Codex and Grok never merge their own). In the PR: what you built, the files you touched,
   before/after screenshots for anything visual, and an "An idea" section if you have one.
5. **Go straight to the next task in your lane.** Don't wait for the review.
   - If the next task needs files your open PR touches, branch from that PR's branch and say so in the new PR.
   - **No limit on open PRs** (Evan, 2026-10-08: "remove the 2 PR limit in case it gets ahead"). Keep going down
     your lane; Claude reviews them in order. Keep each PR to one task so reviews stay easy.
6. **Lane empty? Never stop and never report "finished".** Use the ticket factory in
   [DEVELOPMENT-PATH.md](DEVELOPMENT-PATH.md) (Part 1): take the next deliverable you own from the path, write its ticket,
   add it to your lane here, build it. The path has work for every assistant through each game's version 2.0 and beyond.
7. If a task is unclear or turns out to need Evan (CREATIVE.md "Ask Evan first"), write `docs/proposals/<topic>.md`,
   mark the task `blocked: <why>`, and move to the next one.

## Rules that keep parallel work merging cleanly

- **Don't bump game versions** (`VERSION` in 99-boot.js and the header label). Claude bumps them when merging.
- **Don't edit START-HERE.md's "Where we are" or "Up next".** Add only your one dated line at the top of its Session
  log. Claude keeps the rest current.
- **README changelog:** add your entry at the top, without a version number ("Wildbond (2026-10-08): ...").
- **Stay inside your task's files.** If you must touch a file another lane owns, keep it to a few lines and say so.
- **In the game window** (Evan, 2026-10-08): every feature in every game happens inside the game window (people, places, things you hold, a thin overlay), not in panels beside it. See CLAUDE.md.
- **Saves:** new fields get defaults; old saves must load (add a check). Commits only as
  `206636510+ecbarish@users.noreply.github.com`.

## The focus (2026-10-09): read [PRIORITIES.md](PRIORITIES.md) first

**Flagship: Wildbond (Godot) to version 2.0. Second: the Starfall village. ChatGPT's own: Realmbound. Keep alive:
Diamond Career, Otherworld, browser Wildbond. Parked: the rest.** Each lane takes flagship work first. PRIORITIES.md
section 4 has the order inside each game; new ideas go through its scorecard before they reach a lane.

## The current goal (updated 2026-10-08, night; the focus above now decides the order)

What changed since the "Launch" goal of 2026-10-07: Evan moved the fleshed-out games to **Godot** (the new Wildbond
and the Starfall village, which also play on the web), asked that **everything happen in the game window** in every
game, and started sharing the games with **friends** (the Come Play page, web previews, a trailer). So:

1. **Friends' testing now.** Keep playtest.html, the previews in `play/` and the browser games working and current.
   Bugs from friends come first (GitHub issues, or Evan's messages).
2. **The new Wildbond (Godot) reaches the full journey**: the remaining areas, the league, then the deeper systems
   (tamer abilities, the wild bond, the Unbound, reputation, depth). Claude's lane; PROJECTS.md "Wildbond in Godot".
3. **The Starfall village grows** (Godot): members' stories, seasons, failing and excelling. Claude's lane.
4. **The browser games move into the game window**, one at a time (Realmbound, then Diamond Career), and keep their
   content growing (Otherworld's next worlds, Realmbound's raid tier, the creature catalogue). ChatGPT's lane.

What a public "version 2.0" launch means now (the Godot Wildbond, or the browser games as they stand) is a question
for Evan in START-HERE; until he answers, the old checklist below still applies to the browser games.

**Old launch checklist (browser games):** L1 settings Â· L2 save safety Â· L3 phone pass Â· L4 onboarding Â· L7 bug bash
and balance Â· L8 the arcade launcher Â· L10 accessibility Â· guides and lore pages (T8) Â· no open bug issues.
**Old launch checklist (browser games):** L1 settings · L2 save safety · L3 phone pass · L4 onboarding · L7 bug bash
and balance · L8 the arcade launcher · L10 accessibility · guides and lore pages (T8) · no open bug issues.
## Lane A: ChatGPT / Codex (browser games, data and lore, moving browser games into the game window)

Updated 2026-10-08: Wildbond's new version is built in Godot by Claude (never edit `wildbond-godot/`, `starfall-godot/` or `play/`). Wildbond browser work stays in data, lore and checks: it feeds the Godot version through tools/godot-export.ps1. Earlier note: Claude was rebuilding Wildbond's browser screens (plan phases 1-5), so
Lane A's Wildbond work stays in data, drawing and new files; don't restyle Wildbond's 05-ui.js, 06-scene.js,
index.html or style.css until those phases are merged.

| # | Task | Status | Notes |
|---|---|---|---|
| A1 | **T33** Wildbond creature variants (W14) | done, merged 2026-10-08 by Claude (Wildbond v1.6.0) | docs/ROADMAP.md T33: a rare shimmering colour, tiny/huge sizes, seeded markings; cosmetic only |
| A0 | **T34** Diamond Career part 1: the first call-up and the first payday | done, merged 2026-10-08 by Claude (56 checks pass; on the shelf and the road) | Evan unparked it 2026-10-08; docs/ROADMAP.md T34; browser, games/diamond-career/ |
| A2 | **T32** Wildbond lighting for every other area (G2) | blocked: profile-only scope cannot select town/league/Spire; see docs/proposals/wildbond-area-air.md | Finish if started; otherwise after A1. Only `AREA_AIR` values and their checks in 06-scene.js |
| A3 | **T8** Realmbound guide and lore pages | done, merged 2026-10-08 by Claude | ROADMAP T8, Realmbound first; Wildbond's guide waits for its redesign |
| A4 | **L4 + V1** Realmbound onboarding: the first quest, told by people | done, merged 2026-10-08 by Claude (Realmbound v1.1.0) | docs/realmbound-onboarding.md: arrival scene on the first questgiver, optional road guidance; legacy heroes stay quiet |
| A4b | **Diamond Career part 2** | done, merged 2026-10-08 by Claude | docs/diamond-career-first-month.md: second contract, a 30-day first month, Iona's notebook |
| A5 | **R4** Guild members' personal stories | done, merged 2026-10-08 by Claude (Realmbound v1.2.0); follow-up: give some stories an outcome that can go either way (VISION §9) | 3-4 beats per adventurer, unlocked by mood and time together; one outcome that can go either way (VISION §9) |
| A5c | **R4 follow-up: choices with consequences** | done, merged 2026-10-08 (Realmbound v1.3.0, PR #53) | Evan: about a third of stories can hurt trust; plain, recoverable outcomes in portrait conversations |
| A5b | **D1c** Diamond Career: swings you understand | done, merged 2026-10-08 by Claude (Diamond Career v0.3.0) | From docs/research/diamond-first-contract-review.md: Timing mode shows Contact / Power (no hidden carried-over stance); results say when a pitch was off the plate and separate good-contact-caught from weak contact; one visible effect of Eye growth noted by Iona. Checks for each; old saves load |
| A6 | **W11** A larger Wildbond roster, batch 1 | done, merged 2026-10-08 by Claude (Wildbond browser v1.7.0; 93 species) | 10-12 species filling empty family/element pairs (T6 rules); data only. Now part of the shared catalogue plan (docs/proposals/creature-catalogue-and-evolution.md): include at least one creature that never evolves and is strong for it, and write lore so the species can also live in Realmbound's zones |
| A6b | **Guides and wiki** | done, merged 2026-10-08 (PR #52) | Evan, 2026-10-08: a guide per game with pictures, tips and tricks, later short videos. Extend guides/realmbound.html with screenshots and a tips page; start a Diamond Career and an Otherworld page. Wildbond's waits for the Godot version |
| A7 | **R6** Realmbound hub variety | done, merged 2026-10-08 by Claude (Realmbound v1.4.0) | A layout per zone, inn and smithy interiors |
| A7b | **R5** crafted gear from 55 | done, merged 2026-10-08 by Claude (Realmbound v1.5.0) | Separate PR after R6 |
| A8a | **Otherworld browser runner save safety** | done, merged 2026-10-08 by Claude (PR #56; tests only) | Restore recovery backups too, including failed/thrown checks |
| A8b | **Realmbound guide: rooms and commissions** | done, merged 2026-10-08 (PR #57) | Current hub/service instructions, actual pictures and generated costs |
| A9 | **T35** Otherworld O1, a living Lanthorn | done, merged 2026-10-08 by Claude (Otherworld v0.2.0, PR #58; 831 checks) | docs/ROADMAP.md T35; moved from Claude's B0b |
| A10 | **T36** Diamond Career in the game window, and a road trip | done, merged 2026-10-08 (Diamond Career v0.4.0, PR #59) | docs/ROADMAP.md T36 |
| A11 | **T37** The shared creature catalogue, batch 2 | done, merged 2026-10-08 (Wildbond v1.8.0, PR #60) | docs/ROADMAP.md T37; data and lore only |
| A12 | **T38** Realmbound in the game window: the plan, then part 1 | done, merged 2026-10-08 (Realmbound v1.6.0, PR #62) | docs/ROADMAP.md T38 |
| A13 | **T39** Otherworld: Hearthmere, the second world | done, merged 2026-10-08 (Otherworld v0.3.0, PR #63) | docs/ROADMAP.md T39 |
| A14 | **T40** Wildbond areas 5-8: woven clues, signs and chatter (data; flows into the Godot version) | done, merged 2026-10-08 (Wildbond v1.8.0, PR #64) | docs/ROADMAP.md T40 |
| A15 | **OW0c** Otherworld: the Ashen Throne, complete third life | done, merged 2026-10-08 (Otherworld v0.3.0, PR #65) | docs/otherworld-design.md: Kael, three gifts with costs, endings and cross-world memories; Evan authorized further development |
| A16 | **T41** Realmbound in the game window, part 2: pages become places | done, merged 2026-10-09 (Realmbound v1.7.0) | docs/ROADMAP.md T41 |
| A17 | **T42** Otherworld: memories that matter across lives, toward a systemic world | done, merged 2026-10-09 (Otherworld v0.4.0) | docs/ROADMAP.md T42 |
| A18 | **T43** The creature catalogue reaches Realmbound | done, merged 2026-10-09 (Realmbound v1.7.0) | docs/ROADMAP.md T43 |
| A19 | **T44** Accessibility pass on the browser games (L10) | done, merged 2026-10-09 | docs/ROADMAP.md T44 |
| A20 | **T45** Early-road heritage dialogue (WB2.6) | done, merged 2026-10-09 (Wildbond v1.8.1) | Browser data and ledger; no Godot edits |
| A32 | **T57** Starfall four seasonal chapter outlines (SF3.3) | ready: PR #84, Codex, 2026-10-09 | One threat/festival/newcomer each; current calendar, existing street loop; docs only |
| A31 | **T56** Wildbond final-four-area and league pacing (WB3.6) | ready: PR #83, Codex, 2026-10-09 | Actual Godot battle/rules in a disposable diagnostic project; no Godot edits |
| A30 | **T55** Final truth clue audit (WB4.4b part 1) | ready: PR #82, Codex, 2026-10-09 | Check all placed clues; propose three shared late observations; review before dialogue |
| A29 | **T54** Wildbond Champion return conversations | done, merged 2026-10-09 | Claude's new WB4.4 request: gate scene and every Warden; stacked after #80 |
| A28 | **T53** Wildbond league script and payoff map (WB4.4a) | done, merged 2026-10-09 | Safe writing handoff while Claude builds WB4.1; no Godot edits |
| A27 | **T52** Starfall member writing handoff (SF2.4a) | done, merged 2026-10-09 | Separate additive JSON, preserve Godot ownership; stacked after #78 |
| A26 | **T51** Wildbond festival writing (WS6) | done, merged 2026-10-09 | Stacked after T50/#77; exact calendar IDs, traditions, town voices and cosmetic keepsakes |
| A25 | **T50** Wildbond seasonal data (WS3) | done, merged 2026-10-09 | Claude's next request: regional shifts, rare year-round visitors, seasonal voices; export only |
| A24 | **T49** Sunthread and Farwatch build briefs (WB3.5 part 2) | done, merged 2026-10-09 | Claude requested this next; existing data/canon only |
| A23 | **T48** Walkable Realmbound town road (RB1.3) | done, merged 2026-10-09 | Optional inn/camp approach; existing combat/travel retained |
| A22 | **T47** Hollowecho area brief (WB3.5 part 1) | done, merged 2026-10-09 | Data/lore handoff for Claude, no Godot edits |
| A21 | **T46** Put the new previews on the arcade shelf (AR2.2) | done, merged 2026-10-09 | Stacked after T44; no Godot/export edits |
| A8 | While you wait | always | Lore and dex text polish, more checks, bugs from GitHub issues |
| — | Done | — | A2 L7a Wildbond balance, A3 L7b Realmbound balance, R9 heroic loot review (all merged 2026-10-07) |

## Lane B: Claude (reviews first, then the Godot games: Wildbond and Starfall)

| # | Task | Status | Notes |
|---|---|---|---|
| B0 | **Review and merge** every waiting PR, bump versions, keep START-HERE current, refill the lanes | always first | Check email, diff, tests, play it; `git merge --no-ff` |
| B0b | **Otherworld O0: the Between and Asterhold** | part 1 done 2026-10-08 (the Between, Asterhold's whole life, 8 endings, rebirth and memories; tests/otherworld.html); O1 handed to ChatGPT 2026-10-08 (A9, T35); was: **O1, a living Lanthorn** (docs/research/otherworld-first-life-review.md: locked choices shown with reasons, every gift cost bites, the town's food and fear change over the days), then Hearthmere, the Ashen Throne | Evan unparked it 2026-10-08; docs/otherworld-design.md; browser, games/otherworld/ |
| B1 | **Wildbond phase 1: the screen is the world** | done in Godot (the new Wildbond is all game window); no browser rebuild | docs/wildbond-plan.md: full-window scene, overlay HUD, dialogue near speakers, satchel and pause menu, bigger characters |
| B2 | **Wildbond phase 2: the opening, alive** | **in Godot, mostly done 2026-10-08** (wildbond-godot/: register = character creator, Maren, the barn and the partner choice, Wren); left: prologue, Wilddex goal, guided first wild bond | Prologue, Maren in the world, the character creator (W13), choosing your partner in the barn, Wren, guided first bond, the Wilddex goal |
| B3 | **Wildbond phase 3: battles on the field** | **in Godot, first battle done 2026-10-08** (scripts/battle.gd, rules.gd matches the browser exactly); left: Bond (catching) and Bag in wild battles, more creatures' bodies | Transition, classic layout, Fight / Bond / Bag / Run, a summary that waits |
| B2b | **Wildbond in Godot: the move** | **Thornwood, Saltmarsh and Emberfall done 2026-10-08** (wild creatures, catching, trainers, Wardens, story moments, shop, inn, Wilddex book, saving, area battle skylines); the ranch as a place started 2026-10-08 (creatures in the paddock and barn, visit, take along, swap); Cloudglass Pass done 2026-10-08; next: the rest of the ranch (feeding at the trough, breeding stall, Maren's daily letter), evolution shapes and conditions done 2026-10-08 (data/evolution.json: three third stages, the Poolkit branch, never-evolvers, Not yet); heritages at the register done 2026-10-08 (gifts, tales, recognition); next: the ranch trough and breeding stall, Stillreed Basin, tamer abilities | docs/godot-port-plan.md: Route 1 (Thornwood) from the exported maps, wild creatures and catching, team and save (with a browser-save importer), then area by area. Checks: wildbond-godot/tests/run_tests.gd |
| B4 | **Wildbond phase 4: menus you hold** | in Godot: the field book (J) and creature pages done; the Journal with map and badge case is part of WG8 | Wilddex field book, team scene, Journal with map and badge case |
| B5 | **Wildbond phase 5: the ranch as a place** | in Godot: paddock, barn, nursery, trough, workbench done 2026-10-08; Maren's daily letter is WG8 | Trough, posts, meadow, breeding stall, shop counter, Maren's daily letter |
| B6 | **L10** Accessibility; **L3** phone pass part 2 | open | Browser games now; the Godot previews need phone controls (WG10) |
| B9 | **Next in Godot, in focus order (PRIORITIES.md section 4, 2026-10-09):** Wildbond: pacing fixes from T56, finish the ending (WB4.3 with WB4.4b), phone controls and settings (WB6.1-6.2), the Spire and rematches (WB5.1), the Unbound (WB3.7), polish alongside (WB2.2-2.4, WS4). Starfall: SF2.5 apprentice, SF3.1 seasons, SF3.4 festivals. Rebuild play/ and the Come Play pictures after big steps | open | Was: WG1, WG6, WG7, WG2, SV1, SV3 (all done or under way by 2026-10-09) |
| B6b | **The screen is the world, for every game** | Wildbond and Starfall: done in Godot; Diamond Career: ChatGPT A10 (T36); Realmbound: ChatGPT A12 (T38) | Evan, 2026-10-08. Realmbound first, done in Godot when Realmbound moves (docs/research/decisions.md, 2026-10-08 evening), unless it stays in the browser (the world fills the window; quests, bags, guild and the new Road guide move into the world: quest givers speak in place, bags and the quest log are things you open over the scene); then Diamond Career (the ballpark fills the screen, at-bat choices and contracts happen in the scene: the clubhouse, Iona, your home); then Starfall. One plan doc per game first, then small steps |
| B6c | **V11 walk-in arcade, steps 1-2** | later (Evan: the games come first) | docs/research/arcade-first-visit-review.md: each game saves a small look record of its character; the hall puts you by the last door as that game's character, shows progress on the doors, glows the last-played door for a one-tap return |
| B6d | **Starfall village, first slice (Godot)** | done 2026-10-08 (starfall-godot/, 33 checks); slice 2 done 2026-10-08 (plots, the Healer's Hut, a Training Yard, the town's rank and newcomers; 51 checks); slice 3 done 2026-10-08 (the Smithy worked by hand, Garrick, the Apothecary with prices, more plots, adventurers' savings; 85 checks); next: members' stories, seasons | docs/plans/starfall-village.md: the guild board, one inn run by hand, three adventurers who take bounties, return hurt and recover, hiring the first barkeep |
| B7 | **V3** Game boxes on the launcher | open | docs/VISION.md §3 |
| B8 | **G2** Realmbound dungeon lighting; **W3 part 2** roaming legendaries; **W10** baby forms | open | After Launch is fine |
| — | Done | — | L2 save safety, L1 settings, L8 launcher (living world, road, hall, vote), L3 phone part 1, Wildbond v1.4-1.5.2 fixes from Evan's play |

## Lane D: the local helper (Ollama on Evan's PC; small, checkable jobs only)

docs/research/local-ai-helper.md says what it is good for (drafts, mechanical edits gated by a check, searches and
lists) and what not (reviews, design, story, balance). It works in its own clone with push disabled; nothing it makes
is merged without review. Queue tasks in `C:\Users\evanb\Local-AI\queue\` (one JSON file each, read-only first).

| # | Task | Status | Notes |
|---|---|---|---|
| D0 | **Make the queue runner work**: switch Run-LocalAgent.ps1 from Codex to OpenCode (`opencode run`, OPENCODE_CONFIG) | done, merged 2026-10-08 (PR #66) | The model can't drive Codex's tools; OpenCode works |
| D0b | **Preserve permission precedence in runtime overrides** (ChatGPT) | claimed: Codex, 2026-10-08, `codex/local-helper-permissions` | Ordered PowerShell policy; keep wildcard denial before explicit tool rules |
| D1 | List every player-facing string in games/otherworld/js/ that breaks docs/CREATIVE.md "Writing for players" (lowercase names, rule words in story text) | open (read-only) | Claude or ChatGPT checks the list |
| D2 | Draft ten dex lines for the newest catalogue creatures in the house style, for review | open (read-only; output in its log) | A person picks and edits |
| D3 | Check every link and image in guides/ and playtest.html points to a file that exists | open (read-only) | |

## Lane C: parked (a third assistant, if one joins): the Studio

Self-contained work that touches almost nothing the other lanes use: the Studio is one page (`studio.html`) plus small
read-only hooks, and the accessibility audit is mostly reports and small fixes.

| # | Task | Status | Notes |
|---|---|---|---|
| C1 | **E4** Studio text browser | open | In studio.html: browse and search every line of dialogue, quest text, item and creature name (read them from the games' data files); show where each is used. Read-only first; editing comes with E1's patch format |
| C2 | **E5** Creature and quest viewers with the test rules as validators | open | Studio pages that list species, moves, evolutions, wild tables and quests, flagging anything the checks in tests/ would reject |
| C4 | **E7** Lighting and music tuner | open | Studio sliders for a zone's fog, shadow strength and grade, writing to localStorage only; previews in an iframe |
| C5 | While you wait | always | Playtest a game end to end and file what you find as GitHub issues (bug / suggestion templates) |

## Where this list comes from

Lanes are re-filled by Claude from PROJECTS.md when they run low. Evan can reorder anything, or say "Lane A: do X
next". Status here and in PROJECTS.md should agree; when a task is merged, Claude marks both `done`.
