# Idle Arcade: research and development plans

Prepared 2026-10-06 for Evan. These documents turn comparable-game research and the owner's stated direction into proposed development stages. They are not a promise of every feature, a completed game spec or authorization to unpark implementation. `docs/ROADMAP.md` still controls approved work. This planning branch adds documentation only above the updated Winter Road branch; it implements no additional gameplay.

## Owner direction recorded during this session

- Build strong basic games and upgrade their mechanics, content, presentation and capabilities over time.
- Every game should span fully manual through fully automated play, with useful intermediate settings.
- Desktop and phone must play well. VR is low priority and is parked; it is not a condition for progress.
- Sports should expand across sports, either under one game or separate modules. Player careers, team management and their different gameplay should be supported.
- A sports contract should matter beyond a number: earned money should buy meaningful personal progress, such as homes/cars, and potentially open later opportunities.
- Keep decisions, ownership, status and checks in notes so Evan can switch between Claude and Codex.

## Read in this order

1. [Comparable-game research and source ledger](RESEARCH.md): reported strengths/problems and our interpretation.
2. The relevant game plan below: an ordered set of playable milestones, gates and unresolved choices.
3. [Desktop pickup checklist](DESKTOP.md): source, saves, authentication and the information needed tonight.
4. `docs/DEVELOPMENT.md`: actual branch/PR and handoff status, which takes precedence over a future stage table.

| Project | Distinct experience | First next milestone | Plan |
|---|---|---|---|
| Realmbound | Inhabit a hero supported by an adventuring account | Publish/review Winter Road (lore is merged), then specify a two-hero supply proof alongside the remaining T1 progression plan | [Realmbound](realmbound.md) |
| Wildbond | Travel with creatures, raise individuals and develop bloodlines | Connect current badge/area progression and complete one walkable route before widening content | [Wildbond](wildbond.md) |
| Primordial | Adapt a lineage to environments with different survival questions | Source split and a two-habitat/two-strategy proof when unparked | [Primordial](primordial.md) |
| Starfall Guild | Direct a growing guild whose members have careers | Source split and two classes with meaningful specialization/history when unparked | [Starfall Guild](starfall-guild.md) |
| Sports / Diamond Career | Play a career, enjoy its earnings and later manage teams | Baseball's first contract, match moments, home/garage purchase and transparent evaluation when unparked | [Sports framework](sports-careers.md), [baseball module](diamond-career.md) |
| Otherworld | One protagonist whose skills and past lives change the story | One complete life and one meaningful skill choice before broad rebirth variety | [Otherworld](otherworld.md) |

The sports plan supersedes the narrower assumption that baseball is the entire sports project. Football, hockey, basketball, soccer and other sports can become distinct modules. The second sport is an owner choice; do not begin all of them at once.

## Evidence and recommendation boundaries

This is source-based research, not a hands-on review of every comparator or an exhaustive analysis of all reviews. The research includes 19 distinct comparable titles and 27 reference entries, including primary developer descriptions, critics, sampled player reviews and technical documentation. Some references examine the same title from different viewpoints. Review versions and dates matter; disagreement is included rather than converted into a universal verdict.

We did not infer revenue, retention or commercial success from a score or a few reviews. Each development response is our hypothesis. The milestone tests tell us whether it works for this project. The source-ledger summaries are brief paraphrases; original content remains required.

## Manual through fully automated play

A single Auto toggle is not sufficient to describe the target. Define who controls each layer, and allow combinations. Manual mode means controlling the meaningful actions the game actually offers; do not label choosing a build as direct action control if all combat remains automated.

| Level | Player experience | Example |
|---|---|---|
| Full manual | Player controls available actor actions and all strategic decisions; only opponents/background simulation use AI | Play baseball actions and choose training, contract and purchases |
| Assisted | Player retains the key layer and delegates selected routines | Play battles/at-bats; assistants handle approved care, loot or training |
| Manager/strategist | Player chooses strategy, assignments and development; actors execute | Set a lineup, creature schedule, party plan or survival priorities |
| Full automated | Policies govern all supported progression layers, including ordinary transitions, while the player watches or returns later | Simulate a career, pay salary once, follow training/offer policies, keep a defined savings budget and report purchases/results |

These are target capabilities, not claims about today's four playable games. Existing behavior sometimes requires manual actions for capture, quests, earned automation or special decisions. An explicit ticket must reconcile those restrictions before claiming full automation. Preserve current saves and intentional manual accomplishments.

**Unlock policy remains a decision:** Evan confirmed the control range but has not specified whether complete autopilot must exist on day one or be earned. Recommended starting point: useful basic Auto early, specialized delegation earned through progression, never sold; ensure an auto-first player has a route to those unlocks if that is the chosen policy. Current manual-specific unlocks are not changed by this document.

Full automation needs sensible defaults or preselected policies for branching story, capture/breeding, spending and season/rebirth transitions. “Pause for a major choice” may be a user option, not a hidden mandatory confirmation that makes every run stall. Destructive decisions and high spending should use explicit policies and limits. A player can always take control again at a valid boundary.

Manual/Auto must run the same underlying rules and save identities. Manual skill should offer a meaningful opportunity, not guaranteed victory. Existing project policy says active play is worth at least as much as Auto; measure normalized rewards and challenge outcomes rather than comparing ten active minutes with eight unattended hours. Earned automation should reduce chores instead of making unattended play unreliable.

Acceptance checks for each new control layer: no double reward when switching; no AI consuming inputs queued by a player; pause/speed/offline consistency; the same loss conditions; policy choices reflected in reports; and an unattended fixture that reaches the intended milestone without a required routine click.

## Upgrade path shared by the portfolio

1. **Playable foundation:** stable rules, save/load, keyboard/mouse and touch, a complete initial loop.
2. **Meaningful content and choices:** regions, careers, builds, authored scenes, creatures and discovery.
3. **Deeper systems:** account economies, breeding/racing, parallel guild expeditions, sports management or reincarnation, one bounded feature at a time.
4. **Richer presence:** stronger art, animations, audio and exploration that consume the same data and rules.
5. **Additional capabilities when justified:** alternate renderers, optional online services or other platforms after a concrete use case and feasibility check.

Do not require the games to look identical. A microscope lineage, a warm guild town, an MMO-style action bar and a sports home/garage should have distinct presentation. Better interaction and readability are upgrades too. Modern 3D is optional; quality desktop/phone 2D is a legitimate release stage. VR is parked.

Maintain stable content IDs, separate game rules from rendering, and add a save version/migration only when a real approved change needs it. Do not build an all-purpose engine or speculative schemas. Shared creature rules and existing save/format helpers are proven reuse; a future shared sports wallet/contracts module should be extracted when two sports demonstrate the need.

## Portfolio sequence and proposed ticket boundaries

| Order | Deliverable | Owner recommendation | State |
|---|---|---|---|
| 0 | Restore authenticated publishing; review Winter Road against main; back up current saves | Evan/Claude review, Codex assists | Needed before calling local work deployed |
| 1 | Finish T1's 40–60/raid/guild spec; approve one roster-economy proof | Claude design, Codex content/tests | Proposed next work, T1 still open |
| 2 | Build Realmbound's reviewed next chapter/system one ticket at a time | Split by named files | Realmbound remains flagship to 60 |
| Existing lane | Wildbond T11/T7b and later T13 | Claude, with content handed to Codex under a spec | Already explicitly assigned; no takeover in this plan |
| Later | Sports first-payday/baseball prototype | Owner picks timing; spec first | Parked implementation; broadened ambition recorded |
| Later | Primordial ecological chapter, Starfall careers and Otherworld first life | Separate sessions/branches when unparked | Planning allowed; implementation parked |

Candidate tickets should name a player outcome, files owned, spec/dependencies, save impact, manual/Auto impact, desktop/phone checks and an end condition. This research does not mark a gameplay ticket done or invent dates for features with unknown effort.

## Tests that tell us whether a game is improving

Use a small written session record: new player, progressed save, manual/assisted/Auto route, elapsed play, where decisions occur, where progress stalls and what the player wants next. Track confusing deaths, unearned unlocks and mandatory repetition. Collect impressions as well as numbers; a technically passing test does not prove enjoyable pacing.

Start with goals, not arbitrary counters: a visible first purchase in sports, a cared-for creature winning its first specialized challenge, two adaptations favoring different environments, or a recruit's career decision changing the guild party. Every system should show a benefit a player can explain.

Device checks cover phone portrait and landscape, desktop keyboard/mouse, controls reachable without hover, readable text and clear feedback. Test at least Evan's actual phone/browser and desktop; broaden beyond a powerful desktop before claiming general device performance. No headset, backend hosting or new engine is needed for tonight's work.
