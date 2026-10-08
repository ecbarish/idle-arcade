# Otherworld development plan

**Unparked 2026-10-08:** Evan's answers are in docs/research/decisions.md (top); the plan to follow is
docs/otherworld-design.md (choose your world from a list; rebirth by choice and on death). Claude builds O0.

Status: planned concept only; no playable game directory. Implementation remains parked until explicitly authorized. [Research](RESEARCH.md#otherworld-a-life-worth-living-again); [portfolio plan](README.md).

## The experience to protect

One protagonist arrives in an unfamiliar world, receives an unusual gift and grows through a story. Using a skill changes what the protagonist can do. A later life uses knowledge from an earlier one, creating a new route rather than only accelerating the same grind. Companions join the protagonist's story; the player does not manage a guild roster as the main activity.

The backlog contains skill evolution/merging, story arcs, F–S guild ranks, companions, goddess gift drafts, randomized rebirth types, events, soul points and earned automation. These are concepts without an approved first-life simulation or save model. Arbitrary free-form magic generation is not required for the initial game.

## Staged development

| Stage | Concrete scope | Completion gate |
|---|---|---|
| O0: one complete life | One arrival scene, one town/region, a few authored skill choices, one companion and a short arc/boss. | The player finishes an arc with at least two viable builds and understands how the gift influenced the story. |
| O1: skills evolve through use | A small set of skills with explicit XP sources and branching evolutions; a few authored combinations. | Evolving a skill opens a different action or strategy; advancement is not obtained fastest by meaningless repeat clicks. |
| O2: the second life remembers | One alternative origin, a limited inheritance choice and a few knowledge-gated scenes that change the first arc. | A prior life opens an option unavailable before; what persists is explained; accidental death and chosen rebirth have specified effects. |
| O3: a branching journey | More regions, companions, guild ranks and themed events; several origin/gift combinations. | Branches reconnect cleanly; scenes respect past choices; random drafts do not create an unwinnable opening. |
| O4: earned parallel actions | A skill/familiar executes mastered routines; advanced arcs and replay challenges. | Automation removes repetition while leaving meaningful choices; idle rewards follow the intended balance. |
| O5: richer storytelling | Portraits, authored scenes, animated travel/combat and later exploratory presentation. | Presentation reads the same story flags; choices and skill progression remain accessible without elaborate visuals. |

Do not start with every rebirth species and every gift. One finished life plus one meaningfully different replay is a better test of the concept than a large random list with shallow consequences.

## First proposed prototype

**A gift with a consequence.** Three original gifts support distinct approaches to a bounded problem: protection, insight or crafting. The protagonist meets one companion and must protect or recover something in the first region. Two different gifts should solve that problem through different actions. A gift should create a limitation as well as a useful strength.

If crafting is included, begin with explicit original recipes and known tags. Avoid promising unrestricted “create anything” interactions that an authored simulation cannot adjudicate. No live language model service is necessary to make skill discovery or a surprising combination feel magical.

The first arc needs an arrival, a meaningful choice, a payoff and a clear ending. Save a small set of authored story flags. Only then design which of those flags become soul memories in O2. A screenshot-ready status window can show progress, but most of the fun should happen through decisions in scenes and encounters.

## Apply the comparison lessons

Loop Hero suggests that indirect combat can remain engaging when the player shapes the run, but repeated resource requirements can outgrow the appeal. Your Chronicle is a closer text-idle reference; sampled complaints about production babysitting warn against tiny capacities that require frequent switches with little choice. Wildermyth suggests the value of memory and character continuity while warning that repeated scenes become visible quickly.

We should make a later life recontextualize an earlier scene, not simply let the same dialogue run at double speed. Event selection can check origin, gift, companion and prior knowledge. A finite, carefully conditioned event library is preferable to pretending generated prose is unlimited meaningful content.

## Progression, risk and groundwork

Soul points should open approaches or controlled inheritance, with caps defined by the spec. If each reset keeps everything, the new life may lose challenge; if it keeps nothing, investment may feel wasted. Use an explicit keep/lose preview before voluntary rebirth and distinguish a challenge mode's harsher loss rules.

Separate story data/conditions, skill effects, encounter simulation, save state and presentation. Stable skill/scene IDs and a tested condition evaluator become useful when branching arrives. Test every gift/origin opening for a viable route, save/reload around choices, one-time rewards, skill evolutions and memory carryover.

## Owner choices

How cozy, adventurous or dark should the tone be? Does a life last a short evening session or a longer campaign? Is rebirth primarily voluntary experimentation or a consequence of defeat? How free should the gift/crafting fantasy feel within authored rules? Answer these before a save spec; keep Otherworld focused on one protagonist rather than duplicating Starfall.

## Updated control direction

Evan confirmed a range from fully manual through fully automated play for all games. Use the [common control contract](README.md#manual-through-fully-automated-play): delegate individual layers, keep manual choices meaningful, and prove an unattended progression route without mandatory maintenance clicks. Existing earned-automation/manual-specific unlock rules remain current behavior until a reviewed ticket reconciles them with this direction. Desktop and phone are the primary targets; VR is deferred.
