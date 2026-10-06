# Realmbound development plan

Status: proposed sequencing for owner/Claude review, 2026-10-06. Existing rules and approved tickets remain authoritative. [Research](RESEARCH.md#realmbound-connected-progression-without-a-maintenance-burden); [portfolio plan](README.md).

## The experience to protect

Inhabit a hero, earn memorable equipment, assemble a party and make the rest of your adventuring account useful. The world and its people give a reason to progress. Other characters eventually support the adventure through gathering, crafting and assignments. Active play offers meaningful openings; automation handles routines already mastered.

Main currently has a level-30 journey, four zones, five classes, pets, mounts, companions and two dungeons. T12 lore is merged in main (PR #6). The locally committed Winter Road branch extends the journey to 40 with Frostmere; it is not deployed. Do not treat that branch's roadmap checkboxes as proof of a merged release.

## Staged development

| Stage | Concrete scope | Completion gate | Dependency |
|---|---|---|---|
| R0: consolidate the current journey | Review/publish T12 and The Winter Road; test a normal level-30 save; measure solo and group pacing across the new chapter. | Scenario suite passes; both factions finish the chapter; log the builds and time spent at each level gate. | Owner review and authenticated publishing |
| R1: prove a supporting economy | Specify two heroes, one gathering activity, one crafting recipe chain and a shared storage contract. Prototype assigning a secondary hero while controlling the first. | The secondary hero produces a useful supply; switching heroes neither duplicates rewards nor loses elapsed work; inventory can explain every transfer. | New approved system ticket; Claude owns schema/economy |
| R2: finish the leveling spine | Finish T1's 40–60 plan; build the remaining Frostmere chapter/necropolis, then the Hollow Crown as separate content slices. Add selected talent choices that change play rather than only raising output. | Old saves traverse the new route; tank/healer/damage roles matter; active and auto builds have measured routes through content. | T1 spec; bounded content tickets |
| R3: make the account a guild | A shared guild hall, assignment queue, bank and small raid prototype. Begin with a manageable encounter/roster before a 40-member raid. | Preparation and assignments matter; one member's absence does not require dozens of manual repairs; rewards/loot allocation are explained. | Economy and raid/guild spec |
| R4: improve presence and replay | Zone-specific animation/audio, companion stories, legible boss tells; later seasonal challenges and Legacy. | Improved art does not change saves or combat timing; a replay has different decisions, not only faster numbers. | Stable content and encounter rules |

R1 is deliberately a proof, not all professions at once. If it delays the 60 journey, keep it on an isolated prototype branch while content progresses to its approved spec. New classes and three full talent trees should follow a demonstrated need for another playstyle; avoid adding five unfinished versions of the same role.

## First proposed system ticket

**Two-hero supply trial.** Draft the shared storage rules, assignment result ledger and one ore-to-useful-equipment/repair-supply chain. Decide whether the second hero keeps its existing inventory while contributing to an account store. Do not silently move items or introduce offline banking into `migrate()`. Deliver a small playable loop, then review it before widening to several professions.

Tests should cover the same elapsed interval while active, offline and after switching heroes; cap time to the intended offline limit; save/reload partway through an assignment; account/character identity; and no duplicate consumption or reward on reload. The assignment can improve convenience but must not make neglecting the active hero the optimal route for every reward.

## Pacing and content rules

Use the IdleOn lesson to constrain chore count, and Melvor's contrasting reviews to connect skills without abandoning guidance. Explain the next unlock, why an elite is dangerous, and what a gear comparison assumes. A useful first economy lets a player collect, craft and equip something without consulting an external wiki. Keep the roster's routine work behind safe defaults and one return report.

The next content package should have a zone purpose, named cast, enemy roles, quest offer/turn-in voices, its elite or dungeon payoff and a continuity update to the lore bible. Every new level band needs an expected gear source and a route for players who do not already have perfect gear.

## Groundwork and later capabilities

Retain the existing content/runtime/rendering split. Add stable assignment and recipe IDs when the approved feature needs them. Define serialization and ownership before introducing shared account state. Prefer reproducible combat fixtures and a short event log over a new analytics backend. Rendering can get richer after combat remains testable without the canvas.

Multiplayer, live markets and synchronized raids are later architecture decisions, not prerequisites to making NPC groups and an account guild satisfying. GitHub Pages remains the deployment until a concrete service requirement warrants another system.

## Owner choices to settle

How much of the account should act simultaneously: a small supported roster or all eight character slots? Is a first raid primarily preparation/management, or active encounter play? Which parts of Classic WoW's friction are enjoyable for Evan, and which are conveniences he wants to earn away? Existing Focus/Auto and old-save compatibility remain fixed boundaries unless explicitly revised.

## Updated control direction

Evan confirmed a range from fully manual through fully automated play for all games. Use the [common control contract](README.md#manual-through-fully-automated-play): delegate individual layers, keep manual choices meaningful, and prove an unattended progression route without mandatory maintenance clicks. Existing earned-automation/manual-specific unlock rules remain current behavior until a reviewed ticket reconciles them with this direction. Desktop and phone are the primary targets; VR is deferred.
