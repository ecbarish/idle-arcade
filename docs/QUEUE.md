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
- **Saves:** new fields get defaults; old saves must load (add a check). Commits only as
  `206636510+ecbarish@users.noreply.github.com`.

## Lane A: ChatGPT / Codex (Wildbond content, Realmbound content, art passes)

| # | Task | Status | Notes |
|---|---|---|---|
| A1 | **T32** Wildbond lighting for every other area (G2) | claimed: Codex (ticket T32) | docs/ROADMAP.md T32 |
| A2 | **R9** Heroic tiers and loot review for Rootrot and Heartwood | open | Realmbound data; compare with Sanctum/Foundry heroics; checks for every tier's loot |
| A3 | **W8** Wildbond pacing pass for areas 5-8 plus the league (sim) | open | Use the pacing sim in docs/creature-game-design.md; tune only wild levels, XP and trainer levels; record measured times |
| A4 | **R4** Guild members' personal stories | open | 3-4 short beats per adventurer, unlocked by mood and time together (docs/realmbound-40-60.md "The guild as built"); talk scenes in the guild hall; their voices from docs/lore/realmbound.md |
| A5 | **W4** Contests and races at the ranch | open | Write a short "Design" section first (docs/creature-game-design.md has notes); contests judge stats and bond, races use speed and stamina; held at Larkhaven on certain ranch days; prizes are food, titles and cosmetics, never power you can only get there |
| A6 | **R6** Realmbound hub variety | open | A layout per zone hub (Fenwatch Post, Lanternrest Lodge...) and interiors for the inn and smithy in js/22-town.js; keep walking checks passing |
| A7 | **G3** Water in Wildbond's HD-2D view | open | Reflections of sky, sun and moon, gentle flow, depth colour (Stillreed, Saltmarsh, Farwatch); 13-hd.js only |
| A8 | **R5** Crafted gear from level 55 | open | docs/realmbound-40-60.md "Loot from 40 to 60"; uses the guild bank's supplies |
| A9 | **W11** A larger Wildbond roster, batch 1 | open | 10-12 species filling empty family/element pairs (T6 rules in docs/creature-game-design.md), placed in the areas where they fit; one batch per PR, then repeat as A9b, A9c... |
| A10 | While you wait | always | Lore and dex text polish, more checks, small bugs from GitHub issues labelled for Wildbond or Realmbound |

## Lane B: Claude (reviews first, then systems and shared code)

| # | Task | Status | Notes |
|---|---|---|---|
| B0 | **Review and merge** every waiting PR (Codex, Grok), then bump versions | always first | Check email, diff, tests, play it; `git merge --no-ff`; update START-HERE |
| B1 | **G2** Realmbound dungeon lighting | open | DUN_LIGHT in 23-light.js |
| B2 | **W3 part 2** Roaming legendaries in Wildbond's post-game | open | Guardians reappear as rare roaming encounters for Champions; new 18-roaming.js |
| B3 | **L1** Shared settings panel (sound, graphics, reduced motion, text size) | open | shared/settings.js, every game |
| B4 | **L2** Save safety in every game (export/import, automatic backup, version tags) | open | Builds on the Studio's save doctor |
| B5 | **W10** Baby forms, part 1 | open | On the defaults in docs/proposals/creature-growth.md unless Evan answers first |
| B6 | **G4** Graphics quality and phone performance budget | open | |
| B7 | **G7** Reactive light | open | shared/light.js |

## Lane C: a third assistant (Grok or another AI): the Studio and accessibility

Self-contained work that touches almost nothing the other lanes use: the Studio is one page (`studio.html`) plus small
read-only hooks, and the accessibility audit is mostly reports and small fixes.

| # | Task | Status | Notes |
|---|---|---|---|
| C1 | **E4** Studio text browser | open | In studio.html: browse and search every line of dialogue, quest text, item and creature name (read them from the games' data files); show where each is used. Read-only first; editing comes with E1's patch format |
| C2 | **E5** Creature and quest viewers with the test rules as validators | open | Studio pages that list species, moves, evolutions, wild tables and quests, flagging anything the checks in tests/ would reject |
| C3 | **L10** Accessibility audit | open | Keyboard play, contrast, labels in all four games; write `docs/accessibility.md` with findings, then fix the small ones (one PR per game) |
| C4 | **E7** Lighting and music tuner | open | Studio sliders for a zone's fog, shadow strength and grade, writing to localStorage only; previews in an iframe |
| C5 | While you wait | always | Playtest a game end to end and file what you find as GitHub issues (bug / suggestion templates) |

## Where this list comes from

Lanes are re-filled by Claude from PROJECTS.md when they run low. Evan can reorder anything, or say "Lane A: do X
next". Status here and in PROJECTS.md should agree; when a task is merged, Claude marks both `done`.
