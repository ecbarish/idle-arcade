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

## The world

The Sundered Reach: a continent of zones by level band, each with its own quest hub, mobs and named elites.

| Zone | Levels | Flavor |
|---|---|---|
| Thornvale | 1–10 | Farmland, wolves, kobold-like "Diggers" in the mines |
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
