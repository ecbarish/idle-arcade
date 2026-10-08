# Starfall Guild research: review against the working game

Codex, 2026-10-08. [Gemini's supplied report](starfall-first-season-research.md) is preserved from Evan's attachment without rewriting it. Read alongside [the answered brief](archive/gemini-starfall-first-season-prompt.md), [owner direction](owner-direction-2026-10-07.md), [the plan](../plans/starfall-guild.md) and the actual browser code. The report admits it did not inspect or play the game. Its recommendations are research input, not owner instructions or an approved implementation ticket.

The supplied Starfall text contains no claim-level links or bibliography. Gemini may have shown those separately; none was attached with this report. Claims about comparator AI, scaling, retention and psychological effects remain unverified here. They should not become project requirements because the report sounds certain.

## My assessment

The strong idea is simple: **prepare a party, watch what your preparation changes, understand the result, choose a useful next action.** Starfall's autonomous combat fits a guildmaster fantasy. It does not justify letting staff make every recruitment, purchase, relic or season decision before the player understands them. That distinction matches Evan's earned-convenience direction.

The report gets too ambitious when it adds formations, individual fatigue, paid recovery, permanent traits, invulnerable puzzle enemies and a whole narrative season before validating one recruitment decision. Its priority table starts by building combat that already exists. Our first investment should be making the existing loop legible, not replacing it with the report's imagined game.

## Ground truth and corrections

Reviewed against main `060bf9c`; no Starfall gameplay or save edits.

| Report assumption or proposal | Current code and implication |
|---|---|
| Build the core automatic combat engine first | `02-dungeon.js` already resolves battles; `04-loop.js` advances them. First audit whether a newcomer understands the decisions around that engine. |
| Ren needs a second hero to survive his first encounter | Ren starts as a one-star Swordsman, with 60 gold and Meadow floor 1. Verify actual difficulty before declaring a mandatory counterparty. A random board can also offer unaffordable recruits. |
| Front/back placement, individual taunts, armor and magic immunity | Current combat aggregates attack and **shared party HP**; `derive()` applies class combinations. There is no positional targeting, personal taunt, physical/magic resistance or mandatory mage counter. A visual formation must not falsely promise those effects. |
| Tavern spending heals injuries; gold must be reserved for survival | Tavern upgrades improve recruiting. The **Inn** improves rest/healing. Defeat triggers timed rest (8 seconds before modifiers), then restores party HP; it does not remove heroes or charge healing gold. Preserve that recovery path. |
| Relics are assigned to individual portraits; Vanguard Shield / Swift Boots exist | Relics currently affect the party through multipliers/flags, and drop after bosses. Those example relics and per-member equipment slots are new proposals, not existing content. Use actual relics and report their actual effects. |
| Hall of Legends lets players manually select favorites and preserves memories/relationships | `newSeason()` retains the strongest eligible members by `power()`, according to the Hall upgrade, at level 1. Memory logs and relationships do not exist. Favorite selection would be a separate, worthwhile proposal. |
| Seasons are already narrative campaigns | The current reset is a Renown/progression loop. Gold, floor, businesses, facilities and relics reset; crest upgrades, earned staff and selected strongest members can persist. Do not advertise a regional finale, winter blight or story continuity that has not been built. |
| Add a free replacement hero to prevent defeat wiping the roster | Ordinary defeat does not erase members. Dismissal is a different risk: test an empty party with no income/affordable recruit. `chooseRegion()` already adds a basic Swordsman when a new season has no retained party. Recover from demonstrated states, not hypothetical permadeath. |
| Make rare recruits only complex, never stronger | Current `STAR_MULT` and recruitment pricing make stars affect strength. Changing rarity is a balance and save-facing design proposal, not a harmless tutorial fix. |
| Stop all input during expeditions | It may make a single result easier to read, but locking existing management controls would change the loop. First test a pause/readable-summary approach without asserting that hands-off play is the only valid design. |

Code references: [state and derived stats](../../games/starfall-guild/js/01-state-save.js), [combat](../../games/starfall-guild/js/02-dungeon.js), [recruitment/seasons/staff](../../games/starfall-guild/js/03-town-staff.js), [startup](../../games/starfall-guild/js/99-boot.js), [data](../../games/starfall-guild/js/00-data.js).

## Keep / try / defer / reject

| Decision | Candidate | Smallest useful test |
|---|---|---|
| Keep | Explicit guildmaster role, ordinary failure recovery, readable names and class roles, earned staff, accessible controls | A newcomer explains one preparation decision and recovers from one defeat without a restart. |
| Try | A brief mentor introduction to Ren and a deliberate first recruitment opportunity | Offer affordable existing classes and explain the real combo effect. Watch whether both choices feel viable; do not invent guaranteed positional bonuses. |
| Try | A short result card that shows the preparation's actual effect | Describe observed combo/healing/relic effects, total reward and one useful next action. Do not label a single factor the cause of victory without evidence. |
| Try | One remembered, authored expedition detail per member, as flavor only | Does the player recognize and value a member later? First prove attachment before adding permanent buffs or a biography generator. |
| Try | Honest season preview showing exactly what resets and which strongest members remain | Ask the tester what they expect to keep before confirmation; compare with the actual post-reset save. |
| Defer | Favorite selection, rotating injury rosters, formations, resistance puzzles, combat rewind, narrative campaigns, member-changing memory traits | Separate approved tickets after the first loop is understood. These are not onboarding prerequisites. |
| Reject for this slice | Permadeath, paid survival upkeep, a universal new-engine mandate, major roster/economy replacement | No established player problem requires them; some contradict the current recovery and attachment goals. |

A small event-driven memory is plausible: Wildermyth's developer-hosted [story inputs/outputs](https://wildermyth.com/wiki/Story_Inputs_and_Outputs) and [modding guide](https://wildermyth.com/wiki/Modding_Guide) document contextual stories. That supports studying triggered authored text; it does not establish that permanent combat buffs or an unlimited procedural biography system are right for Starfall. This is an inference to test.

## The next approved slice should be small

1. Audit a fresh save: what starts moving before the player is ready, what the first board costs, and whether Ren plus either affordable companion survives the intended early encounter.
2. Introduce the guildmaster's role and one meaningful recruitment/level decision using existing rules. Exact stats stay available in the notebook; essential role effects are plain words.
3. Let the battle show one preparation effect and give a result that waits. Preserve correct uncertainty; avoid exact outcome forecasts.
4. Explain the existing free rest and a genuinely useful purchase. Never create a paid-healing soft lock to make a tutorial more dramatic.
5. Only later preview Renown and Hall carryover, using the actual reset rules.

This is a proposed sequence, not authorization to implement it. The safest immediate playtest is the existing game with a fresh save and no developer coaching.

## Playtest the report's method too

The supplied script tells a tester they are a manager, describes the intended decisions, then asks whether they discovered that role. That can hide the exact confusion we want to find. Run one uncoached first minute (what do you think you can do?) and only then introduce the intended goal if needed. Record that help.

Observe recruitment, a meaningful improvement, a result, a defeat/rest, save/reload and a later reset preview. Ask neutral questions: “What changed?”, “What would you do next?”, “What do you expect to keep?” Do not force an immune enemy or a failure solely to satisfy a tutorial script. Phone taps, keyboard focus, larger text, reduced motion and ultrawide readability are baseline checks, not player-earned rewards.

Keep findings as observations, not retention predictions. No telemetry service, new dependency or paid tool is needed. The whole-project approximate $200 ceiling remains a constraint, not spending approval. Research for Starfall is received; implementation remains scoped by its existing plan and future explicit tickets.