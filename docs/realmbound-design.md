# Realmbound — design plan

A classic-MMO idle adventure. The feeling we're after is the 2005-era MMO: leveling through zones one
quest at a time, the first green item, the first blue, a dungeon group that finally clicks, a raid night.
Original world, names and art — inspired by that era, not a copy of any game.

**Pillars**
1. **The leveling journey is the game.** Zones, quests, gear and talents carry the first hours on their own.
2. **Loot you care about.** Item rarity, random "of the Bear" suffixes, slot-by-slot upgrades, set pieces.
3. **The holy trinity.** Tank, healer, damage. Groups win or wipe on threat, mana and gear, not raw numbers.
4. **Addons are the automation.** Every addon is earned by doing that thing by hand first, like the real ones
   people installed once a chore got old.
5. **Play it or idle it.** An optional action bar rewards attention; leaving it alone still progresses.

---

## Decisions (2026-10-06)

- **Focus / Auto toggle.** Focus: you press the abilities. Auto: the hero plays itself. **Active play is
  always worth at least as much as Auto:** Auto acts a beat late (55% efficiency), never catches reactive
  windows, and doesn't get the +10% *Engaged* XP bonus. The Rotation Macro addon closes the gap over time
  (70% → 80% → 90%, and reactive windows half the time at rank 3), and is earned only by pressing abilities
  yourself. If you go quiet in Focus mode for 15 seconds, Auto takes over until you press something.
- **Two factions.** The Concord (Human, Stonekin) start in Thornvale; the Wildclans (Grishar, Duskelf) start in
  the Redsand Steppe. Both meet in the contested Greywater Fens at level 10; faction battlegrounds come later.
- **Death: the classic sting.** A corpse run plus 10% durability loss on worn gear; broken gear gives no stats
  until repaired in town.

## Hunters and pets (built 2026-10-06)

The first slice of the creature system, written to be shared with the standalone creature game later.

- **Taming:** fight a beast your level or lower, press Tame Beast, survive a 6-second channel. Elites can be
  tamed. Taming counts as defeating the beast for quests. Auto never tames; it is always your choice.
- **Wild rarity:** every beast spawns with a rarity. Common, Uncommon (Scarred, Sleek…), Rare color variants
  (Ashen, Frostcoat, Bloodmane…), Epic named beasts (Old One-Eye, Silkmother…), Legendary zone elites
  (Grizzlemaw, Kraska Duneclaw). Mythical is reserved for hybrids. Rarity multiplies stats and trait count.
- **Families:** Wolf (Furious Howl), Boar (Charge, tank), Cat (Claw), Hyena (Frenzy), Lizard (Tail Whip),
  Crocolisk (Death Roll, tank), Spider (Web). Tanks draw more enemy attacks.
- **Traits:** Ferocious, Thick Hide, Swift, Keen, Loyal, Hardy, Vicious, Guardian.
- **Bond:** Wary → Friendly → Loyal → Devoted → Bonded, earned by winning fights together while fed. Loyal
  unlocks Coordinated Strike (lights up when the pet uses its ability or crits; you and the pet strike
  together). Devoted shortens the pet ability cooldown. Bonded: the pet takes a killing blow for you once
  per fight.
- **Happiness:** food from beasts (meat), humanoids (bread, boars only) or the town vendor. Happy pets hit
  harder and bond faster; unhappy pets stall. PetCare addon automates feeding (earned by feeding 20 times).
- **Stable** of 3, swapped in town. Grishar bond 20% faster.

## Mounts (built 2026-10-06)

- Mounts shorten travel: finding the next monster, town trips, zone travel. Ghosts walk.
- Riding skill from the trainer in town: Apprentice (level 10, 60% cap), Journeyman (level 20, 100% cap).
- Faction vendors: Concord horses, Wildclans great wolves; swift versions at 20. Legendary elites have a 25%
  chance to drop epic reins.
- Training: every mount improves as you ride it (Green → Trained → Seasoned → Swift → Champion, +5% speed
  each, on top of the riding cap), a first step toward the raising/racing fantasy.
- Hunters can train a Devoted, level 10+ pet (not spiders) to carry them; rarity sets base speed (common 60% →
  legendary 100%).

## The world

The Sundered Reach: a continent of zones by level band, each with its own quest hub, mobs and named elites.

| Zone | Levels | Flavor |
|---|---|---|
| Thornvale (Concord) | 1–10 | Farmland, wolves, tunnel "Diggers" in the old mine, a bandit gang |
| Redsand Steppe (Wildclans) | 1–10 | Red canyons, hyenas, outcast raiders, cliff harpies |
| Greywater Fens | 10–20 | Swamps, murloc-like "Gloomfins", a sunken temple dungeon |
| Ashen Ridge | 20–30 | Volcanic badlands, ogre camps, a fire cult |
| Frostmere | 30–45 | Tundra, ice trolls, a necropolis |
| The Hollow Crown | 45–60 | Corrupted forest, dragonkin, raid entrances |

**Races** (small passive bonuses): Human (+rep gain), Stonekin (+armor, mining), Duskelf (+crit, herbalism),
Grishar (+health, enrage bonus).
**Classes**: Warrior (tank/dps), Paladin (tank/heal), Priest (heal), Druid (any role), Rogue, Mage, Hunter,
Warlock. Each has 3 talent trees, one point per level from 10.

## Layer 1 — your hero (levels 1–60)

- **Questing.** Pick a quest from the zone's hub: kill/collect/deliver, each a timed task fought out by
  auto-combat. Rewards: XP, gold, often a choice of item. Quest chains end in an elite quest that needs a
  group (teaser for Layer 2).
- **Combat.** Your hero fights one mob at a time on its own. Stats from gear and talents decide kill speed
  and whether you survive. **Dying** costs a corpse run (a timer) and gear durability (gold to repair).
- **Action bar (optional play).** 4–6 abilities on cooldowns: Heroic Strike, Fireball, a heal, a burst
  cooldown. Clicking them in a good order beats the auto-attack. Idling works; playing works better.
- **Loot.** Gray (vendor trash) → white → green (random suffix, e.g. *of the Eagle*) → blue (dungeon) →
  purple (raid) → orange (one legendary questline). 8 slots to start: head, chest, legs, feet, hands,
  weapon, off-hand, trinket.
- **Rested XP.** While you're away, the inn fills your rested bar: double XP until it runs out. This *is* the
  offline mechanic, and it's straight out of the era.
- **Professions (the business layer).** Two gathering + crafting pairs (Mining → Blacksmithing,
  Herbalism → Alchemy, etc.). Gatherers run as idle generators, crafted goods feed gear, potions and gold.

## Layer 2 — dungeons (from ~level 15)

- Recruit up to 4 companions with roles. Your party autobattles through pulls and bosses.
- **Threat matters:** a weak tank loses aggro and the healer dies. **Mana matters:** long fights drain
  healers. **Boss mechanics:** enrage timers, adds, a "don't stand in fire" check that talents and gear pass.
- Loot drops per boss; you choose who gets it (and companions remember).
- **Heroic tiers** once you out-level a dungeon: the same dungeon at harder tiers with random modifiers
  (e.g. *Bolstering*: dead mobs empower nearby mobs). This is the infinite ladder.

## Layer 3 — raids and your guild (level 60)

- Found a guild. Grow a roster to 10, then 20, then 40.
- Raids need attunement chains, consumables from professions and a roster that shows up.
- **DKP** (points earned per raid, spent on loot) decides who gets the purples. Keep members happy or they
  leave.
- Raid tiers unlock in sequence; each clears into a harder difficulty.

## Resets and roguelike runs

- **New characters (alts).** Every character you finish adds Legacy: account-wide bonuses to XP, gold and
  professions, plus heirloom gear that levels with the next character. Leveling a new class is faster and
  plays differently.
- **Hardcore seasons.** Optional permadeath realms that start fresh. Each season has a rule set drawn at
  random (*no healers*, *double XP but gear breaks*, *one zone only*). Surviving earns titles and Legacy.
  This is the roguelike layer: high stakes, different every time.

## Addons (the automation)

| Addon | What it does | Earned by |
|---|---|---|
| AutoLoot | Picks up every drop | Looting 100 corpses by hand |
| Vendor Sweep | Sells grays when you visit town | Selling 200 junk items |
| QuestHelper | Picks the next best quest in the zone | Completing 25 quests |
| GearCompare | Equips upgrades automatically | Equipping 30 items |
| Rotation macro | Plays your action bar (at 80%, upgradable) | Using abilities 1,000 times |
| LFG Tool | Queues and runs dungeons for you | Clearing 10 dungeons |
| Auction House bot | Crafts and sells profitable items | Selling 100 crafted items |
| Raid Leader | Handles invites, DKP and loot | Clearing a raid tier |

## Build order

- **v0 (first playable):** character creation (4 races, 4 classes: Warrior, Mage, Priest, Rogue), levels 1–20
  across Thornvale and Greywater Fens, quests, auto-combat with the action bar, 8-slot gear with rarities and
  suffixes, one talent tree per class, rested XP, deaths, and the first 3 addons (AutoLoot, Vendor Sweep,
  QuestHelper). Ends with the first dungeon as a group teaser.
- **v1:** dungeons and companions (Layer 2), professions, all 3 talent trees, levels to 30.
- **v2:** levels to 60, the remaining classes, raids and the guild (Layer 3).
- **v3:** alts and Legacy, hardcore seasons, Heroic tiers.

## Look

A classic MMO interface: dark stone and bronze frames, gold serif headings, a square action bar with
cooldown sweeps, item tooltips colored by rarity, a minimap-style zone panel. Distinct from Starfall Guild's
bright handheld look and Primordial's microscope.

## Ashen Ridge and the Foundry (built 2026-10-06)

- The level cap is 30. Previously capped level-20 characters resume earning XP without resetting.
- Ashen Ridge is shared territory, accessible from level 18. Concord characters use Emberwatch Hold;
  Wildclans characters use Cinderhorn Outpost. Ten quests lead through wolves, obsidian boars, ogres,
  the Ember Covenant and slagscales to the legendary Coalmaw. The new beasts use existing taming,
  rarity, trait, feeding and bond systems.
- The Cindervein Foundry opens at 27: four packs and three bosses. Cinder Rain damages the party;
  Molten Rupture is actively dodgeable with D. Original names, procedural pixel art and volcanic colors.
- Each dungeon tracks clears, runs and its highest Heroic tier separately in `drecords`. Existing
  `dstats` remain aggregate counters for earned addons and companion scaling; old stats initialize the
  Sanctum record only. Old active dungeon runs gain the `sanctum` identity on load.
- Automation and Focus/Auto efficiency are unchanged. LFG Tool repeats the dungeon you just cleared.

Next: professions and broader talent choices, then Frostmere and the journey to level 60.
