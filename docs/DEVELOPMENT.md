# Development notes and next handoff

This is the shared status and decision record for Evan, Claude and Codex. Read this with `HANDOFF.md` and `docs/ROADMAP.md` before taking work. The roadmap controls ticket scope and priorities; these notes distinguish observed code, pending work and proposals. Recheck main and open PRs before relying on an older status entry.

## Latest handoff — research and portfolio plans, 2026-10-06

**Request:** research all planned games, record what comparable games do well/poorly, and propose development stages. Evan clarified that sports spans multiple sports and athlete/team-management roles, salaries must fund meaningful homes/cars/purchases, all games need manual through full automation, and desktop/phone matter more than VR.

**Deliverables:** [master plan](plans/README.md), [research and 27-reference ledger](plans/RESEARCH.md), six individual game plans, a separate [shared sports direction](plans/sports-careers.md), and [desktop pickup checklist](plans/DESKTOP.md). Research covers 19 distinct comparable titles, using critics, developer descriptions and sampled player reviews; this is desk research, not personal playtesting or a representative market survey. Recommendations are hypotheses with concrete milestone gates. No parked game is unparked by these plans.

**Current source status:** main was refreshed to `e4c10f6f53999d38bec770991f8543316ad96efd`. T12 PR #6 is now merged. Local `codex/realmbound-winter-road` integrates main, including Claude's separate zone-lore paragraph; two test selectors were updated to `#zoneLore`. The earlier 231 browser/236 DOM passes predate this integration. A rerun was attempted, but temporary Chromium/jsdom installations were gone. Syntax checks pass; rerun `tests/run.html` on the desktop before approving the chapter.

**Branches/publication:** Winter Road remains local and unpublished; open its PR against main. `codex/arcade-development-plan` adds only documentation above Winter Road; open a stacked PR against that branch, then retarget after its merge. Every new commit uses the required noreply author email. Git CLI publishing lacks credentials here; the previously blocked website route was not bypassed. The supplied Git bundle retains both branches and commits; the source ZIP is for immediate local play, not history. No PR was opened by this session.

**Recommended next work:** publish/review Winter Road, then finish T1's remaining progression/raid/guild design and specify a bounded two-hero supply-economy proof. Keep Claude's current Wildbond pacing/walkable-world lane separate. Sports starts later with a baseball first-payday slice: contract, playable match moments, salary ledger, first lasting purchase. Manual/Auto settings should delegate individual layers. Full-Auto unlock timing, the second sport and purchase benefits remain owner decisions.

**Desktop needs:** project path and branch, Claude's latest unpushed work, authenticated Git/client publishing, backed-up saves, actual desktop/phone browsers, and one next active ticket. Do not copy over uncommitted files or assume moving source moves browser progress. VR/backend setup is unnecessary tonight. Current notes above supersede the historical baseline below.

## Active work — The Winter Road, 2026-10-06

**Owner authorization:** Evan said to proceed with the recommendation while Claude was unavailable, then reiterated that all games need a path from their basic foundation to richer mechanics and capabilities. Codex therefore wrote the narrow T1 progression decisions required for T3 instead of waiting for Claude. This does not transfer or complete the wider T1 raid/guild/30–60 design.

**Branch and dependency:** `codex/realmbound-winter-road`, based on PR #6's lore head `ab972312df00603789071d6efcb560e550788376`. The earlier documentation-only review commit is included here; do not publish it again separately if this branch is used. Main was refreshed at `fd93445126fa3fbfd139dd926597dcf1f404c961` before starting. This is local work awaiting publication/review, not a merged feature.

**Implemented:** level cap 40; Frostmere's first 30–40 chapter, two faction hubs, six enemies, ten voiced quests, three ordinary tameable species and the legendary wolf Hushfang. A narrow runtime change sends level-30+ companions to Frostmere; the quest hint follows the next accessible zone instead of always sending heroes back to Greywater. Existing save key, migration, combat formulas, equipment budgets, dungeon rules and old world entries remain unchanged. Wildbond and the parked games were not edited.

**Source of truth:** [chapter specification](realmbound-winter-road.md), including the content table, access at 28 under the existing travel rule, cap behavior, rewards, lore and review limitations. T3 is marked done in this branch; T1 remains open. The chapter reaches the necropolis approach, not its dungeon or levels 41–45.

**Checks:** `/tests/run.html` passes 231/231; the Node DOM suite passes 236 checks. Browser interactions cover both faction travel gates, generated-gear battles and elite loot, correct quest voices, all tabs, taming and save/reload with no console errors. A save made by main's old-cap scripts loaded and resumed at level 31. All five classes won an opening fight with four companions. Solo results depend on build/rarity; a mage died in one spot check and succeeded in the next. See the chapter specification for the exact limits of testing. Reusable browser check: `tests/realmbound-winter-road.cjs`.

**Publishing:** the final `git push -u origin codex/realmbound-winter-road` failed: `could not read Username for https://github.com`. No chapter branch or PR was published. The earlier website upload hit a browser error page blocked by URL policy; that route was not retried or bypassed. The work is committed locally with the required noreply email. A complete source ZIP, Git bundle retaining the commits, and patch are supplied for Evan's desktop setup tonight. Publish the branch from an authenticated desktop, open a PR against `codex/realmbound-lore` while PR #6 is open (or main once that dependency is merged), and do not merge it automatically.

**Next action for Claude/owner:** publish/review this stacked branch, review T12 first, then merge/rebase the chapter onto main as appropriate. Do not merge it automatically. Review sustained solo/group pacing, the existing equipment naming ceiling and the 40–60 plan. Avoid editing this branch's world data concurrently until ownership is handed back. The old proposal below is historical; the chapter spec supersedes its unresolved first-slice decisions.

## Owner's standing direction: upgrade the games in stages

Start with each game's core loop and foundations, then expand its mechanics, world, presentation and technical capabilities over time. Larger artwork alone is not the whole upgrade. Keep the source and notes easy to hand between Claude and Codex, and carry existing player progress forward.

| Stage | Deliverable | Gate before proceeding |
|---|---|---|
| Core foundation | A playable loop, stable saves, small source files and checks | Players can complete the initial slice; state and rules are understood |
| Content and choices | Chapters, creatures, quests, builds and character stories | Each addition has a purpose, progression rules and original names |
| Deeper systems | Professions, parties, raids/guilds or the game's equivalent | A specific approved design, save-compatibility plan and acceptance route |
| Richer world/presentation | Exploration, stronger art eras, animation/audio and interaction | Upgrade serves the loop; game rules and identities survive rendering changes |
| Technical capability | New platforms, networking or tools when needed | A concrete requirement justifies deployment/dependency changes |

This is a direction, not permission to unpark every game or implement all stages at once. Realmbound remains the priority to 60. Wildbond already separates data, battle/state and art eras; preserve that route while Claude owns its pacing/walkable-world work. Primordial and Starfall should eventually separate their large source files before sustained parallel content work. Diamond Career and Otherworld first need a small playable foundation when unparked. Every feature handoff should record its current stage, the player benefit, future dependencies and save compatibility; avoid speculative infrastructure with no current use.

## Latest review — 2026-10-06

**Request:** review the project, recommend a next development step, and keep notes so Evan can switch between Claude and Codex. Evan has more content ideas for all the games. This review does not implement a new game feature or unpark other games.

**Reviewed baseline:** main `fd93445126fa3fbfd139dd926597dcf1f404c961`. Read the handoff, roadmap, both current game design documents, idea backlog, hub, and the game data/runtime. Opened all four playable games on a local static server. Realmbound T12 is pending in [PR #6](https://github.com/ecbarish/idle-arcade/pull/6), not part of the reviewed main baseline.

| Game | Verified current foundation | Biggest next need |
|---|---|---|
| Realmbound | Level cap 30; four races, five classes, four zones, 36 quests, two dungeons; taming, mounts, companion relationships, earned addons; scripts split into small files. | An approved 30–60 progression spec, followed by a meaningful first chapter beyond 30. T12 adds world/quest voices but is awaiting review. |
| Wildbond | 33 species, 22 moves, three biome data entries, seven STORY beats plus starter scenes; capture, team battles, ranch training/breeding; Pixel and 16-bit art, dialogue, sound. | Connect existing content to normal progression and tune the journey. Main still has cap 20 and awards only the Thorn Badge; Emberfall's Tide requirement has no award path yet. |
| Primordial | Eight organism tiers, eight world definitions, mutation drafts, niche contests, extinctions/Genetic Memory, earned instincts. Single HTML file. | Eventually expand the evolutionary choices across runs, rather than adding only larger multipliers. Currently parked. |
| Starfall Guild | Seven classes, party combinations, shops/facilities, relics, seven region definitions, earned staff, season/Renown resets. Single HTML file. | Eventually give recruits careers and the guild decisions beyond repeating floors. Currently parked. |
| Diamond Career | Hub concept and baseball idea backlog; no playable game directory. | A design spec and one small player-career prototype when unparked. |
| Otherworld | Hub concept and isekai skill/story/rebirth ideas; no playable game directory. | A design spec and one protagonist's first story arc when unparked. |

Counts describe definitions in source, not a claim that every entry is reachable in ordinary play. Main's Wildbond integration gap is expected deferred code work from T10, not a change for Codex to silently make during a different ticket.

### Review findings

- The strongest foundation is Realmbound: its content, combat, relationships and loot already reinforce one another. The split files make another chapter practical to implement and review.
- Wildbond has gained considerable content quickly. Its existing Tide gate, level cap and planned pacing changes need to agree before another biome is valuable. Claude owns that system work; Codex should avoid editing its files concurrently.
- Roadmap and handoff occasionally mix older plans with newer implementations. For example, the standalone creature game already exists, but the Realmbound migration onto the shared creature module is still future work. Do not interpret a design paragraph as proof of a shipped feature.
- The hub is a useful entry point, but tags such as Realmbound's “Raids” describe direction, not implemented raids. Promo copy should eventually distinguish live features from plans.
- The priority remains Realmbound to 60. Wildbond has explicitly assigned work in the current roadmap; that does not unpark Primordial, Starfall Guild, Diamond Career or Otherworld. T8/T9 guides remain parked.

## Recommended next feature: the first Frostmere chapter

**Working chapter name: The Winter Road.** A supply road from Ashen Ridge reaches a snowbound refuge in Frostmere. Someone must get food and protection through before the crossings become unusable. Concord and Wildclan travelers need the same road, but disagree about whose obligations come first. Signs of the planned necropolis appear gradually, leaving its full descent for a later chapter.

This is a proposal for T1/T3, not approved canon, a ticket completion, or authorization to change levels. It follows the existing Frostmere tundra/ice-troll/necropolis direction and should be reconciled with the T12 lore bible once PR #6 is reviewed.

### Why this step

The current journey stops at 30. One coherent chapter gives existing heroes somewhere to go, makes the recent lore pass matter, and advances the flagship toward 60. New creatures, useful loot and companion dialogue can fit inside the systems already present. Racing, professions, raids and rendering overhauls each require separate system design; putting all of them into this chapter would make it difficult to finish or hand off.

### Proposed first slice

- One Frostmere entry area covering roughly levels 30–40, within the design's wider 30–45 region. Claude must approve exact bands, access requirements and cap behavior in T1.
- One hub per faction, connected by the same winter road. Original names and recurring NPC roles should be agreed in the spec before code/content is written.
- About ten linked quests using existing kill/collect objectives: secure the approach, recover supplies, prepare protection, investigate the ice trolls, and confront one named elite. Every quest gets offer and turn-in text; completion should move the chapter's story forward.
- Six or so enemy entries using existing renderable kinds/families, including at least two hunter-tameable beasts. Taming must continue to count for relevant kill quests. Exact numbers are proposals for the spec, not new balancing rules.
- A closing scene or quest response that points toward the necropolis. Keep a full dungeon, new race/class, professions and save-schema work out of the content PR unless T1 expressly includes them in a separate ticket.
- Gear/reward budgets come from T1 and existing generation rules. New content should not make all old dungeon loot pointless without a deliberate balance decision.

### Handoff sequence and ownership

1. **Claude:** finish or narrow T1 so T3 has concrete zone ranges, XP/loot targets, enemies, quest structure, elite difficulty, unlock rules and a testing route. Describe how existing level-30 saves resume. Record any level-cap/runtime work separately from the content files.
2. **Codex:** implement T3 to that approved spec, with original names, quest voices, zone lore and tameable creatures. Claim its exact files before editing. Do not infer a cap increase from the presence of high-level data.
3. **Claude/owner:** review integration and balance, then merge the PR. Check that the chapter can be reached from a normal save rather than only a debug fixture.

**Acceptance criteria to put in the approved ticket:** old saves load; a capped hero can resume as specified; both factions can reach their correct hubs; all quest targets and prerequisites resolve; the chain can be completed with the intended gear/party; taming works for the new beasts; new names render in every existing view; current scenario checks remain green and new chapter scenarios cover its distinct behavior; no console errors; no unrelated Wildbond changes.

**Useful decisions still needed:** Does Frostmere retain two faction hubs or introduce a shared refuge? How much story comes from the faction dispute versus the necropolis? Does the first slice end at 40, or is T1 intended to design the whole 30–60 journey first? Should professions precede this chapter as the older handoff suggests? Resolve these in T1, not through unrecorded implementation choices.

## Content inbox for every game

Capture Evan's ideas here even while a game is parked. Keep each idea's source, purpose, dependencies and approval state. The candidate directions below are reviewer suggestions, not requests Evan has already made.

| Game | Candidate for a later focused slice | Dependency / status |
|---|---|---|
| Realmbound | The Winter Road; later companion personal quests, professions that support the roster economy, then necropolis/dungeon content. | First chapter proposed above; T1 approval before T3. Other systems need their own specs. |
| Wildbond | After progression is connected, a recurring town/route cast and biome-specific discoveries that give reasons to return to old areas. Racing and creature ranch jobs are already design directions. | Claude's T11/T7b first; exact content contract for Codex afterward. No fourth area now. |
| Primordial | A body-plan chapter where several adaptations offer different approaches to surviving a world. | Existing in-game multicellular-body direction; parked, needs a design plan and migration/balance work. |
| Starfall Guild | First class advancements with small recruit stories that explain why an adventurer develops into a specialty. | Existing in-game class-advancement direction; parked, needs progression and save design. |
| Diamond Career | First minor-league contract arc with one playable at-bat decision and consequences between games. | Backlog only; parked, needs design and implementation spec. |
| Otherworld | First-life arrival arc with one evolving skill and one companion, preserving the one-protagonist focus. | Backlog only; parked, needs design and implementation spec. |

For new ideas, use a compact entry:

> **Game / idea:** … **Source:** Evan / Claude / Codex, date. **Player experience:** … **Status:** inbox / proposed / approved / in progress / PR open / merged / parked. **Dependencies:** … **Next decision:** …

Do not turn an inbox entry into an approved ticket automatically. When approved, link the roadmap ticket and design spec; when shipped, link the PR and summarize the actual result.

## Current handoff and verification

- **Codex's last feature:** T12, `codex/realmbound-lore`, [PR #6](https://github.com/ecbarish/idle-arcade/pull/6). Open and unmerged when checked for this review. Adds the lore bible, all 36 quest responses and four zone paragraphs. Its local static-server checks passed 118/118 scenarios, 56 faction-specific turn-ins, zone/dungeon display checks and save/reload. Recheck the PR before taking related files.
- **This session:** review/notes only, branch `codex/development-notes`. Changes `HANDOFF.md` and this file. No game, balance or save changes. No new roadmap ticket is claimed or marked done. The notes are committed locally with the required noreply author email. The remote branch was created, but its file uploads did not commit and no PR was opened: terminal push lacks credentials, and the website upload redirected to a browser error page blocked by the browser URL policy. The remote branch still points to the reviewed main commit. Next publisher should push this local branch (or apply the supplied patch), verify both files, and open a documentation-only PR without merging.
- **Observed main checks:** all four playable games opened on a fresh local Chromium profile without page/console errors; `tests/run.html` returned **118/118 PASS**. This was a startup smoke test plus the existing Realmbound scenarios, not a full balance, pacing or late-game audit of all games.
- **Active boundary:** Evan said Claude is working on Wildbond. T11, revised T7b and T13 remain Claude-owned roadmap work. Leave that directory alone unless the next explicit ticket authorizes a coordinated scope.
- **Historical recommendation:** Claude specifies T1 before T3. Evan subsequently authorized Codex to proceed with the narrow first-chapter specification; see the active record above. The wider T1 remains Claude-owned.

## How to leave the next session

1. Pull main and read open PRs before claiming a ticket. Record the base commit, branch, ticket and files you will touch. Keep concurrent Claude/Codex file ownership distinct.
2. Separate observations, proposals and approved decisions. Include the reason for a design decision, not just the chosen value. Record blockers while they are still clear.
3. Before handing off, update this file with what actually changed, PR status/link, checks performed, limitations and the exact next action. Update the game's design/lore document when the ticket permits it; update the roadmap only for its approved scope.
4. If an explicit ticket limits editable files, honor that limit: put the handoff notes in its allowed documentation or PR description and add them here in a subsequent notes-only change. Notes do not justify touching another contributor's gameplay files.
5. Use `206636510+ecbarish@users.noreply.github.com` as commit author email, publish on a `codex/<topic>` branch, and open a PR without merging. Do not call a PR “shipped” until its merge is verified.

When returning after a gap, the first action is to refresh this status against the repository. Chat recollection and old dates never supersede current code or a newer user instruction.
