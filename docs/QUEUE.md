# The work queue (autopilot)

Evan (2026-10-07): "create a task list for ChatGPT so I don't need to keep individually prompting it, and let you both
run on it", with Grok possibly joining. This page is that list. Each assistant has a **lane**: an ordered list of
tasks whose files don't overlap with the other lanes, so all of them can work at once. Work top to bottom, one task
after another, without waiting to be prompted. Projects and their specs live in [PROJECTS.md](PROJECTS.md); the rules
and how much creative freedom you have are in [CREATIVE.md](CREATIVE.md).

## The loop (every assistant)

1. `git fetch`; start from the latest `origin/main`.
2. Take the **first task in your lane** whose status is `open`. Claim it: set its status here to
   `claimed: <you>, <date>, <branch>` as your branch's first commit, push, and open the pull request early (a draft is
   fine), so the claim is visible. (Claude, who works on main, pushes the claim to main.)
3. Build it on its own branch (`codex/<topic>`, `grok/<topic>`, `claude/<topic>`), with checks; all test pages pass
   (`tests/run.html`, `tests/wildbond.html`, `tests/starfall.html`, `tests/sound.html`, `tests/offline.html`).
4. Open a pull request (Codex and Grok never merge their own). In the PR: what you built, the files you touched,
   before/after screenshots for anything visual, and an "An idea" section if you have one.
5. **Go straight to the next task in your lane.** Don't wait for the review.
   - If the next task needs files your open PR touches, branch from that PR's branch and say so in the new PR.
   - **At most two open PRs per assistant.** With two waiting, stop building and do a "while you wait" task (end of
     your lane), or stop and tell Evan "two PRs are waiting for Claude".
6. If a task is unclear or turns out to need Evan (CREATIVE.md "Ask Evan first"), write `docs/proposals/<topic>.md`,
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

## The current goal: Launch (decided 2026-10-07)

Both games are **content complete**: Wildbond has its whole story (eight areas, the league, the Champion) and a
post-game; Realmbound runs 1-60 with dungeons, a guild and a raid. What's missing for a public launch is the launch track:
a smooth first ten minutes, settings and save safety, a balance pass over full playthroughs, phone and accessibility
polish, guides and lore pages, and a homepage that shows the games off. So the lanes below put **launch work first**
and content second. When every box below is ticked, both games become **version 2.0**, the first public release, announced on the
homepage. Only then does a new game start (Evan picks which).

**Launch checklist:** Wildbond plan phases 1-5 (docs/wildbond-plan.md) · L1 settings · L2 save safety · L3 phone pass · L4 onboarding · L7 bug bash and balance (both
games) · L8 the arcade launcher · L10 accessibility · guides and lore pages (T8) · no open bug issues.

## Lane A: ChatGPT / Codex (Wildbond variety, Realmbound launch work, content)

Rewritten 2026-10-07 around docs/wildbond-plan.md. Claude is rebuilding Wildbond's screens (plan phases 1-5), so
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
| A5 | **R4** Guild members' personal stories | **next** | 3-4 beats per adventurer, unlocked by mood and time together; one outcome that can go either way (VISION §9) |
| A5b | **D1c** Diamond Career: swings you understand | open | From docs/research/diamond-first-contract-review.md: Timing mode shows Contact / Power (no hidden carried-over stance); results say when a pitch was off the plate and separate good-contact-caught from weak contact; one visible effect of Eye growth noted by Iona. Checks for each; old saves load |
| A6 | **W11** A larger Wildbond roster, batch 1 | open | After A1; 10-12 species filling empty family/element pairs (T6 rules); data only |
| A7 | **R6** Realmbound hub variety; **R5** crafted gear from 55 | open | One PR each |
| A8 | While you wait | always | Lore and dex text polish, more checks, bugs from GitHub issues |
| — | Done | — | A2 L7a Wildbond balance, A3 L7b Realmbound balance, R9 heroic loot review (all merged 2026-10-07) |

## Lane B: Claude (reviews first, then Wildbond's plan, then launch polish)

| # | Task | Status | Notes |
|---|---|---|---|
| B0 | **Review and merge** every waiting PR, bump versions, keep START-HERE current, refill the lanes | always first | Check email, diff, tests, play it; `git merge --no-ff` |
| B0b | **Otherworld O0: the Between and Asterhold** | part 1 done 2026-10-08 (the Between, Asterhold's whole life, 8 endings, rebirth and memories; tests/otherworld.html); next: **O1, a living Lanthorn** (docs/research/otherworld-first-life-review.md: locked choices shown with reasons, every gift cost bites, the town's food and fear change over the days), then Hearthmere, the Ashen Throne | Evan unparked it 2026-10-08; docs/otherworld-design.md; browser, games/otherworld/ |
| B1 | **Wildbond phase 1: the screen is the world** | open | docs/wildbond-plan.md: full-window scene, overlay HUD, dialogue near speakers, satchel and pause menu, bigger characters |
| B2 | **Wildbond phase 2: the opening, alive** | **in Godot, mostly done 2026-10-08** (wildbond-godot/: register = character creator, Maren, the barn and the partner choice, Wren); left: prologue, Wilddex goal, guided first wild bond | Prologue, Maren in the world, the character creator (W13), choosing your partner in the barn, Wren, guided first bond, the Wilddex goal |
| B3 | **Wildbond phase 3: battles on the field** | **in Godot, first battle done 2026-10-08** (scripts/battle.gd, rules.gd matches the browser exactly); left: Bond (catching) and Bag in wild battles, more creatures' bodies | Transition, classic layout, Fight / Bond / Bag / Run, a summary that waits |
| B2b | **Wildbond in Godot: the move** | **Thornwood, Saltmarsh and Emberfall done 2026-10-08** (wild creatures, catching, trainers, Wardens, story moments, shop, inn, Wilddex book, saving, area battle skylines); next: the ranch as a place, then Cloudglass Pass | docs/godot-port-plan.md: Route 1 (Thornwood) from the exported maps, wild creatures and catching, team and save (with a browser-save importer), then area by area. Checks: wildbond-godot/tests/run_tests.gd |
| B4 | **Wildbond phase 4: menus you hold** | open | Wilddex field book, team scene, Journal with map and badge case |
| B5 | **Wildbond phase 5: the ranch as a place** | open | Trough, posts, meadow, breeding stall, shop counter, Maren's daily letter |
| B6 | **L10** Accessibility; **L3** phone pass part 2 | open | After phase 1 (the new layout); docs/accessibility.md |
| B6b | **The screen is the world, for every game** | open | Evan, 2026-10-08. Realmbound first (the world fills the window; quests, bags, guild and the new Road guide move into the world: quest givers speak in place, bags and the quest log are things you open over the scene); then Diamond Career (the ballpark fills the screen, at-bat choices and contracts happen in the scene: the clubhouse, Iona, your home); then Starfall. One plan doc per game first, then small steps |
| B7 | **V3** Game boxes on the launcher | open | docs/VISION.md §3 |
| B8 | **G2** Realmbound dungeon lighting; **W3 part 2** roaming legendaries; **W10** baby forms | open | After Launch is fine |
| — | Done | — | L2 save safety, L1 settings, L8 launcher (living world, road, hall, vote), L3 phone part 1, Wildbond v1.4-1.5.2 fixes from Evan's play |

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
