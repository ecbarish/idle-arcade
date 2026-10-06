# Starfall Guild development plan

Status: planning only; implementation remains parked until explicitly authorized. [Research](RESEARCH.md#starfall-guild-a-guild-whose-members-have-careers); [portfolio plan](README.md).

## The experience to protect

Manage an adventuring guild whose members gain specialties, form useful combinations and bring memorable accomplishments home. The player directs recruitment, preparation and expeditions rather than becoming one hero. The town supports those people, and each season feels like a new undertaking by the same guild.

Current code contains seven classes, party combinations, shops/facilities, relic choices, earned staff, seven region definitions and Renown/season resets. Hall of Legends can retain selected strong members while resetting their level; this is not yet a narrative career system. The source is one HTML file. Its future in-game roadmap names class advancement, multiple expeditions and rival guilds.

## Staged development

| Stage | Concrete scope | Completion gate |
|---|---|---|
| G0: preserve the existing game | Split source; document season carryover; tests for combos, shops, Renown and staff; reduce interruptive routine news only in a separately approved behavior ticket. | Old saves and export/import work; season results and earned automation are unchanged by the split. |
| G1: careers before more floors | Begin with two classes, two specializations per class, a short personal event chain and a readable career record. | The specialties produce different party choices; member identity and intended career memory survive a season. |
| G2: two expeditions | One main party and one small support expedition with preparation, return reports and distinct rewards. | The second group has a useful role without forcing duplicate upkeep; results are reproducible across save/reload/offline. |
| G3: the town serves the guild | Facilities support recovery, recruitment, equipment and contracts; rival guild challenges offer different objectives. | A town decision changes an expedition strategy; every new facility has a visible purpose beyond another income multiplier. |
| G4: seasons become campaigns | Region-specific contracts, event variation, member legacies and a visible guild hall/Hall of Legends. | Two seasons differ in goals/builds; familiar members remain recognizable; solved content does not require identical setup chores. |

Start G1 with a few classes rather than promising seven fully written career trees simultaneously. Expand only after the first specialties create interesting combinations.

## First proposed feature ticket

**A recruit becomes a specialist.** Pick Swordsman and Cleric from the existing classes. Give each two clearly different role choices at a specified milestone. Write a short event that explains the choice and record the member's major accomplishment. Define how retaining that member through Hall of Legends preserves identity while respecting the current level reset.

The concrete specialization names and effects belong in the approved spec; do not borrow names or trees from the comparators. Show a before/after party example where each route is useful. Tests need to prove advancement is awarded once, role/combination calculations are correct, season carryover is intentional and older members receive a valid default without losing their current stats.

## Apply the comparison lessons

Dungeon Village 2's sampled reviews support the pleasure of watching a busy town and growing adventurers, but repeatedly report interruptions from routine announcements. Use one guild report with filters rather than a pause for every level, sale or arrival. A player choice deserves attention; a bookkeeping update usually does not.

Wildermyth suggests that a small number of meaningful memories can produce attachment. Its review's repeated events and discontinuity complaints argue for tracking seen-event conditions and making resets explicit. Keep a brief career history instead of attempting unlimited generated biography. Darkest Dungeon's roster tradeoffs suggest preparation depth, but opaque punishment is a poor fit for a brighter guild-management game.

## Progression and presentation

Avoid rare recruits becoming universally superior solely because of star multipliers. New specialties and contracts should create niches for the members a player likes. If recovery/fatigue is added later, make it a reason to rotate thoughtfully, not a wall that forces mandatory waiting or disposable recruiting.

A later town scene can show assigned staff, returning parties and guild trophies. That scene should read the existing simulation, not own the economy. Add a richer presentation only after the two-expedition state machine is reliable. Audio and animation should support the light, lively guild tone.

## Owner decisions and architecture

How permanent should a recruit's story be across seasons? Should legacy members retain skills, career choices or only a scrapbook alongside the existing level reset? Is the desired town mainly a cozy living scene or a strategic placement puzzle? These choices affect schema and need Claude/owner approval.

Share formatting, save tools and useful content conventions with the arcade; keep Starfall's season economy and career rules separate from Realmbound's account progression. A common module is warranted by a proven second use, not just the fact both games contain adventurers.

## Updated control direction

Evan confirmed a range from fully manual through fully automated play for all games. Use the [common control contract](README.md#manual-through-fully-automated-play): delegate individual layers, keep manual choices meaningful, and prove an unattended progression route without mandatory maintenance clicks. Existing earned-automation/manual-specific unlock rules remain current behavior until a reviewed ticket reconciles them with this direction. Desktop and phone are the primary targets; VR is deferred.
