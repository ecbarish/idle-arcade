# Primordial development plan

Status: planning only; implementation remains parked until explicitly authorized. [Research](RESEARCH.md#primordial-adaptations-that-change-survival); [portfolio plan](README.md).

## The experience to protect

Guide a lineage through environments where survival favors different adaptations. Observe what changed, make a consequential choice and carry some knowledge into the next extinction/run. An organism should feel like the result of decisions, rather than a picture beside a larger resource counter.

The current game has eight purchasable organism tiers, eight world definitions, mutation drafts, niche contests, extinction/Genetic Memory and earned instincts. Most mutations modify production, cost or contest power. Its in-game future direction includes multicellular bodies and land, but these are not implemented ecological simulations. Everything currently lives in one HTML file.

## Staged development

| Stage | Concrete scope | Completion gate |
|---|---|---|
| P0: make development safe | Split the source without behavior changes; record the current formulas and save schema; add seeded-run and offline checks. | Existing exports load; the same fixtures reach the same production, mutation and extinction results. |
| P1: prove ecological choices | One bounded adaptation chapter in two existing habitat styles: light versus chemical food, defense versus mobility, and a visible energy budget. | At least two builds succeed for different reasons; the favored build changes with the environment; failure explains its cause. |
| P2: make a body matter | A small multicellular body model with a few functional parts; each changes survival and the organism's drawing. | A part has a benefit and a tradeoff; changing the body alters behavior rather than only a total multiplier. |
| P3: make migration a decision | A connected set of habitats, readable destination conditions, environmental events and optional niche opportunities. | Moving yields a useful opportunity; remaining in a habitat can be a valid strategy; no unexplained navigation or forced repeated opening. |
| P4: make extinction a lineage story | A summary of adaptations, niches and cause of collapse; meaningful inheritance options; later land as a new chapter. | The next run gives a new route or build question; inheritance is understood and does not make all mutation choices irrelevant. |

P1 can use a simplified, clearly labeled model. Scientific flavor does not require a research-grade ecosystem simulation. Avoid presenting a fixed ladder toward “more advanced” life as a universal scientific law; our tiers are gameplay abstractions.

## First proposed feature ticket

**Two habitats, two successful body strategies.** Write a small model using a sunlit shallows scenario and a vent scenario. Define resource sources, energy costs and threats in plain language. First test the model without rendering. Give a player three or four understandable adaptation choices and show the effects on the next survival interval.

Prototype numbers are hypotheses to tune. The important acceptance test is a changed tradeoff: the option that is strongest in abundant light should not automatically be strongest at a dark vent. An explanation panel should tell the player why food access, protection or metabolism mattered. Keep numerical modifiers traceable so offline simulation matches foreground intervals.

## Apply the comparison lessons

Spore's creator attachment is useful, but its reviewed breadth/depth tradeoff argues for finishing one mode before civilization or space. Niche shows the value of survival pressure while warning that safe openings and unclear destinations can reduce motivation to explore. Thrive's documented scope challenges suggest a staged plan that remains worthwhile even if the final ambition takes years.

Do not replace an existing incremental game with a completely unrelated simulation in one upgrade. Preserve old progress and offer a clear bridge into the new chapter. The first new ecological choices can sit beside the present economy until the revised progression is validated.

## Content and replay

New habitats need a distinct survival question, a readable opportunity, two relevant adaptations, an event and a lineage record. New mutations should have combinations and drawbacks, not merely higher rarity/color and another global multiplier. A short narrative field note can explain discovery without pausing every production event.

Late extinction should reveal a new decision or shorten a genuinely solved opening. Distinguish player-chosen challenges from unavoidable waiting. Instincts can execute known routines while the player chooses the habitat or adaptation strategy.

## Groundwork and owner decisions

Separate model, data, state, UI and organism drawing before large content work. Introduce seeded randomness for reproducible ecological tests when the feature is approved. Save only what needs to persist; do not pre-create civilization, continent or multiplayer schemas.

Evan should choose whether the desired future is mainly a relaxing incremental lineage, a survival strategy game, or a mixture with optional survival challenges. Also choose how much organism customization is central to the fantasy. Until those decisions and unpark authorization exist, P0–P4 are an ordered backlog, not active tickets.

## Updated control direction

Evan confirmed a range from fully manual through fully automated play for all games. Use the [common control contract](README.md#manual-through-fully-automated-play): delegate individual layers, keep manual choices meaningful, and prove an unattended progression route without mandatory maintenance clicks. Existing earned-automation/manual-specific unlock rules remain current behavior until a reviewed ticket reconciles them with this direction. Desktop and phone are the primary targets; VR is deferred.
