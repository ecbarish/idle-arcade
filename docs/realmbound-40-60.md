# Realmbound T1: levels 40–60, raids and the guild

Claude's specification for ticket T1, written 2026-10-07 against main after The Winter Road (levels 30–40). It
settles what the journey to 60 contains, in what order it is built, and who builds each piece. Numbers are starting
points to be measured and tuned; names marked *proposed* are new canon unless Evan vetoes them. Owner questions are
listed at the end; sensible defaults are chosen so work can start before they're answered.

## What we have today (the baseline this plan fixes)

- Levels 1–40, five classes (Warrior, Rogue, Mage, Priest, Hunter), one talent tree each, two 5-person dungeons
  (Drowned Sanctum 17+, Cindervein Foundry 27+) with endless Heroic tiers, pets, mounts, companions, earned addons.
- **Talent overflow:** each tree holds 21 ranks, but points arrive one per level from 10. From level 31 on, points
  pile up with nowhere to go. Levels 31–40 already feel like this.
- **Item names stop at level 16:** `genItem` caps the name tier at 3 (`(ilvl-1)/5`), so everything from 16 to 40 is
  a "Tempered Longblade" or "Banded Hauberk". Upgrades no longer read as upgrades.
- **Roles don't exist for the player:** companions fill a party, but nothing says *you* are the tank or the healer.
- XP per level is `200·L + 25·L²` (48,000 at 40, about 99,000 at 59). Pacing beyond 40 has never been measured.

## The journey, chapter by chapter

| Chapter | Levels | Cap after | Hub(s) | Payoff | Built by |
|---|---|---|---|---|---|
| Frostmere II: The Silent Barrows | 40–45 | 45 | Lanternrest Lodge / Whitebough Hearth | dungeon **The Silent Barrows** (42+) | ChatGPT data (T20) |
| The Hollow Crown I: the Outer Wood | 45–52 | 52 | *proposed* Thornmantle Camp (shared) | dungeon **Rootrot Hollow** (49+), legendary elite | ChatGPT data after spec |
| The Hollow Crown II: the Crown's Heart | 52–60 | 60 | same camp, moved inward | attunement chain, **raid: The Hollow Throne** | ChatGPT data + Claude systems |

Each chapter follows The Winter Road's contract: 10–12 voiced quests (offer and turn-in lines per faction), 5–6 mob
types with roles, one legendary tameable elite, quest availability at quest level − 2, zone travel at minimum level
− 2, generated quest rewards (uncommon at +1, rare from elites at +2), a lore update in docs/lore/realmbound.md, and
scenario checks in tests/realmbound-scenarios.cjs. Ten quests don't promise ten levels: grinding between quests stays.

### Story thread (*proposed*, building only on established lore)

- **Frostmere II.** Surveyor Tavin's older carvings belong to the **Wayfolk**, the people who kept the Reach's
  crossings before the Sundering. Their dead lie in the Silent Barrows with their road-stones, because they believed
  a road remembers whoever walked it. The ice trolls took the stones for their own roads, not out of malice. Something
  is waking the barrow-dead: grave-cold spreads up the road. The dungeon's last boss, **the Last Wayward**, is a
  Wayfolk warden who refuses to let the road be used by "people who forgot why it was built". No link to the Ember
  Covenant or the Drowned Cult is established; that stays open.
- **The Hollow Crown.** East of the barrows lies a forest grown around an empty throne: the Wayfolk crowned no one
  after the Sundering, and the absence festered. Dragonkin (*proposed*: **the Ashwing**, a lineage of lesser drakes)
  nest in the crown of the trees and treat the throne as their hoard. The corruption is the forest trying to fill the
  empty seat with anything at all. Both factions arrive because the barrows' road leads here.
- **The Hollow Throne (raid).** The Ashwing matriarch, **Seraveth**, sits on the throne. Beating her doesn't fill
  the seat; the closing scene asks the factions whether they will keep the road together. That's the hook for
  battlegrounds (faction rivalry) and for a second raid tier later.

## Talents: real choices and real roles

The fix arrives in three steps so nothing waits on the whole tree set.

1. **T1-A (Claude, next):** every class gets its **second tree**, and both trees grow to about 26 ranks (the first
   tree gains two talents). Points at 60 = 51, so two trees of 26 = 52 ranks: no more overflow at 31–40, and
   each tree's capstone needs 20 points in it, so two capstones are impossible. Free respec until level 40, then a
   rising gold cost at the class trainer (1 g, then +1 g per respec, resetting weekly in game days).

   | Class | Existing tree | New tree (role) |
   |---|---|---|
   | Warrior | Arms (damage) | **Protection** (tank: threat, block, shield wall) |
   | Rogue | Assassination (burst) | **Combat** (steady damage, evasion; off-tank for trash only) |
   | Mage | Fire (burst) | **Frost** (control: slows, ice barrier; safer solo) |
   | Priest | Shadow & Light (damage with some healing) | **Holy** (healer: bigger heals, mana efficiency) |
   | Hunter | Beast Mastery (pet) | **Marksmanship** (ranged damage, aimed shots, traps) |

2. **Roles follow your build.** The tree with the most points sets your role in groups (Protection = tank,
   Holy = healer, otherwise damage). The party screen fills the other roles with companions. Groups need exactly one
   tank and one healer; a party without them can still enter, but with the existing "weak tank loses threat, healer
   runs dry" rules it will usually wipe on bosses. That's the holy-trinity pillar finally applying to you.
3. **T1-C (Claude, with the Hollow Crown):** the **third tree** (Warrior Fury, Rogue Subtlety, Mage Arcane, Priest
   Discipline, Hunter Survival), so 78 ranks compete for 51 points. A Beast Mastery hunter's pet can hold
   threat in 5-person dungeons (tank role), as the Boar and Crocolisk families already draw attacks. This is where builds differ between players.

Talents must change *how you play* as well as numbers: every tree has at least two talents that alter an ability or
open a new reactive window (the existing Counterstrike/opening system), so Focus play keeps paying more than Auto.

## Loot from 40 to 60

- **Name tiers** (ChatGPT, T21): tiers widen with level instead of stopping at 16: tier = `(ilvl-1)/5` up to tier 3
  (levels 1–20), then one tier per 10 levels: 4 = 21–30, 5 = 31–40, 6 = 41–50, 7 = 51–60. Each material, weapon,
  off-hand and trinket list grows from 4 to 8 names. Existing items keep the names they were generated with.
- **Dungeon blues** gain a prefix pool per dungeon (Wayfolk's, Barrow-, Ashwing…). **Raid epics** (purple, rarity 4)
  drop only in the raid and use their own named items (no random suffix), with **tier sets**: 5 pieces per class
  (head, chest, legs, hands, feet) with 2/4/5-piece bonuses that strengthen the class's role (e.g. Protection 4-piece:
  Shield Wall also reduces damage to the party). The single legendary questline stays reserved for later.
- **Every band has a gear route for imperfect players:** quest rewards (uncommon), the band's dungeon (rare, Heroic
  tiers for more), the legendary elite (rare/epic reins as now), and from 55 crafted gear from the guild economy.

## Pacing from 40 to 60 (to be measured, then tuned)

Targets with Focus play: about 45 minutes per level at 41 rising to about 75 at 59 (roughly 20 hours from 40 to 60);
Auto at its existing 55–90% efficiency. Before a chapter merges, run a headless sim like Wildbond's (loop the game
tick, take quests, accept the best gear) for a level-40 hero of each class, record minutes per level, and tune only
the zone's mob/quest XP multipliers, never the global curve (so 1–40 doesn't change). Rested XP stays the offline
mechanic. Measured numbers go into this doc.

### Measured: the Barrowfields, 40 → 45 (T1-B, 2026-10-08)

Headless sim: a fresh level-40 hero, uncommon gear of its own level replaced at each level-up, no talents, no rested
XP, the quest log kept full, bags emptied like a player selling junk. "Focus" = a stand-in player who presses the
best ready ability every global cooldown and loots by hand; "Auto" = the game's own autopilot (55% efficiency).
Solo heroes skip the elite quest (Paleweft), so its follow-up stays locked; they grind Threshold Keepers once the
quests run out (around level 43). Minutes are total elapsed play when each level was reached.

| Hero | 41 | 42 | 43 | 44 | 45 | Deaths |
|---|---|---|---|---|---|---|
| Warrior, Focus | 16 | 30 | 53 | 105 | 159 | 0 |
| Warrior, Auto | 17 | 37 | 68 | 134 | 203 | 0 |
| Rogue, Focus / Auto | 15 / 18 | 31 / 42 | 62 / 77 | 120 / 139 | 179 / 202 | 5 / 6 |
| Mage, Focus / Auto | 26 / 19 | 48 / 38 | 80 / 80 | 153 / 160 | 215 / 246 | 22 / 14 |
| Priest, Focus / Auto | 13 / 18 | 30 / 38 | 58 / 85 | 114 / 168 | 173 / 246 | 1 / 15 |
| Hunter, Focus / Auto | 11 / 14 | 24 / 29 | 44 / 57 | 89 / 115 | 134 / 175 | 0 / 0 |
| Warrior + 4 companions, Focus / Auto | 4 / 4 | 9 / 8 | 14 / 16 | 20 / 22 | 36 / 40 | 0 / 0 |

- **Solo:** 2¼–3½ hours of Focus play for the chapter (27–43 minutes a level on average); Auto takes 13–43% longer,
  so active play pays more for every class. Early levels (with quests) run ~15–25 minutes, late levels (grinding)
  ~50–70. That's within the "no more than twice the target" rule, so **no XP change** was made.
- **Mages die a lot solo** at this band in uncommon gear (14–22 deaths); worth a look when T1-C revisits Frost/Fire.
- **Companions make leveling about 5× faster** (36–40 minutes for the whole chapter): companions add a lot of damage
  in the open world and the hero's XP isn't shared with them. This affects levels 1–40 too, so it's an owner/design
  decision, not a zone tweak. Option to decide (recorded in START-HERE.md): split kill XP across the party with a
  group bonus, as classic MMOs do, or keep fast group questing as the reward for befriending adventurers.
- **The Silent Barrows** (level 44, uncommon gear, normal tier): with a priest companion the party clears in about two
  minutes without deaths; without a healer, Grave Chill and the bosses wipe it. Heroic tier 3 fails either way in that
  gear, as intended for a Heroic tier.

**After D2+D3 (group XP split, journey length; same sim, Focus, 40 → 45):** Warrior solo 159 min, with four
companions 124 (1.3× faster, down from 5×); Hunter solo 136, with companions 138 (its pet already makes it strong
alone); Warrior with companions on Auto 137. Journey length, Warrior solo: Breezy 66 min, Classic 159, Long Road 349.

## The guild (Layer 3a) — your account becomes the guild

Realmbound's big direction (Evan's favorite): the whole roster plays at once. The guild is where that lives.

- **Founding.** At level 40 any hero can buy a charter (5 g) from their faction's Frostmere hub and gather five
  signatures: your own characters and adventurers at *Friend* affinity or better. The guild is **account-wide**: one
  guild for all your characters.
- **Members.** Your own characters (always members) plus recruited adventurers (the existing `npcs`, who keep their
  personalities and affinity). Adventurers have a **mood**: rises when they're grouped, geared, helped with requests;
  falls when they're benched for long or passed over for loot. Below a threshold they warn you; ignored, they leave.
- **Guild hall** (a screen at first, a place later): roster, **bank** (shared storage across characters; the R1
  two-hero supply trial defines its rules), **jobs board**, guild level and perks.
- **Jobs** (the IdleOn layer, built on R1): any member you're not playing can take a job: *Questing* (XP and gold in a
  zone of their level), *Gathering* (profession materials), *Dungeon run* (with the LFG Tool rules), *Guard duty*
  (guild XP). Jobs run while you play someone else and while you're away (capped like rested XP). The hero you
  control always earns the Engaged bonus; active play stays the best rate.
- **Guild level** from members' activity unlocks: +2% XP per level (to +10%), bank tabs, more job slots, and raid
  sizes (10 → 20 → 40).

## Raids (Layer 3b) — The Hollow Throne

- **Size:** 10 raiders at first (2 tanks, 2–3 healers, 5–6 damage), drawn from the guild: your level-60 characters
  and adventurers (who scale to your level as they do now). 20 and 40 come with later tiers if Evan wants them.
- **Attunement:** *The Hollow Key* chain: clear the Silent Barrows and Rootrot Hollow, then a three-quest finale in the
  Crown's Heart.
- **Four bosses**, each with one readable mechanic the existing engine can extend (wave/surge/enrage plus one new
  idea each): a tank swap (*Bark Warden*: armor-shred stacks), an add phase (*Ashwing Brood*: priority targets),
  a positioning call (*the Rootbound Choir*: spread or stack), and Seraveth (all three, plus an enrage timer).
- **How you play it:** before each pull you choose a plan (who interrupts, stack or spread, which tank opens); during
  the pull you play your hero and make **raid calls** when a tell appears ("Spread!", "Swap!"), which beat Auto's slow
  calls. The *Raid Leader* addon, earned by clearing the raid once, makes those calls for you at a lower efficiency.
- **Preparation:** consumables from Alchemy (via the R1 economy) are optional on the first tier and expected on the
  Heroic tier. Wipes cost repairs as deaths do now.
- **Loot and DKP:** each boss kill gives attending raiders 10 DKP; loot goes to the raider with the most DKP who can
  use it, unless you override it (loot council). Overriding costs the passed-over raider mood. Each boss's loot can be
  won once per **raid lockout** (default: every 3 in-game ranch-style days ≈ real days; see owner questions); the
  raid can always be re-run for practice and DKP.
- **Heroic raid tiers** reuse the dungeon modifier system (Fortified, Tyrannical, …) for the infinite ladder.

## Build order and tickets

| Order | Ticket | Who | Depends on |
|---|---|---|---|
| 1 | **T1-A** second talent trees, roles from your build, respec | Claude | this spec |
| 1 | **T20** Frostmere II + The Silent Barrows (data, existing mechanics), cap 45 | ChatGPT | this spec |
| 1 | **T21** item name tiers 4–7 and dungeon blue prefixes (data + one formula) | ChatGPT | this spec |
| 2 | **T1-B** Silent Barrows' new mechanic (*Grave Chill*: stacking cold the healer must manage), pacing sim 40–45 | Claude | T20 |
| 3 | **R1** two-hero supply trial (bank, one gathering job, one recipe chain) | Claude | owner answers 1–2 |
| 4 | Hollow Crown I content (T22) + T1-C third trees | ChatGPT + Claude | T1-A, T20 measured |
| 5 | Guild founding, members' mood, jobs, guild level | Claude | R1 |
| 6 | Hollow Crown II content + attunement (T23), then the raid system and The Hollow Throne | ChatGPT + Claude | 4, 5 |

Rules for every ticket: old saves load (`migrate()` handles any new field), tests/run.html stays all-pass with new
checks for the new content, no new files outside the existing script order unless the ticket says so, README
changelog entry, lore record updated.

## Owner questions (defaults in brackets)

**Decided 2026-10-08:** all six take the defaults below, plus split group XP and a journey length setting; details
and reasoning in `docs/research/decisions.md`. Job slots: 3 growing to 5-6, never 8.

1. **How much of the account plays at once?** A small supported roster (3–4 heroes with jobs) or all eight character
   slots? [Start with 3 job slots, growing with guild level.]
2. **Raid feel:** mostly preparation and management, or active encounter play? [Both: plan before the pull, raid calls
   during it; Auto possible but weaker.]
3. **Raid sizes:** stop at 10, or grow to 20 and 40 like the classics? [10 now; 20/40 only if you want them.]
4. **Lockouts:** how often can raid loot be won? [Every 3 days of play; practice runs any time.]
5. **Classic friction to keep or earn away:** corpse runs, repair costs, attunement chains, travel time? [Keep them all
   at first; addons and guild perks soften them over time, as now.]
6. **Names:** Wayfolk, the Silent Barrows, the Last Wayward, the Hollow Crown's Ashwing and Seraveth, Thornmantle
   Camp, Rootrot Hollow, The Hollow Throne. Keep, or rename any? [Keep.]

## R1 as built (2026-10-08)

The two-hero supply trial, on the shared roster (`shared/roster.js`), in Realmbound's **Supplies** tab:
- **Bank:** account-wide, holds only supplies (`S.bank = { ore, kit }`). Heroes keep their own bags and gear;
  nothing moves between characters and `migrate()` is unchanged (old saves get an empty bank when first opened).
- **Jobs:** 3 slots (`S.guild.jobs`). One job, *Mining*: one ore every 600 / (1 + level / 40) seconds (level 20:
  about 9 an hour; level 40: 12). The hero being played can't hold a job; switching to a miner pays them and takes
  them off it. Uncollected time caps at 8 hours. Paid by timestamps, so active, offline and switching give the same.
- **Recipe:** 6 ore → a repair kit; a kit mends all gear anywhere; Auto uses a kit instead of a town trip when
  gear drops below 30%. A convenience, never required: town repairs work exactly as before.
- **Next:** Questing (small XP for the worker, below active play), Herbalism and potions, then the guild founding
  at 40 with members' mood, guild level, more slots and the guild hall.

## R2 as built (2026-10-09): The Hollow Throne

`js/19-raid.js`. Entry: the Hollow Key (`h.hollowKey`, or quest `ch14` from T23) and the level cap. Raiders: you + 9
(companions at Acquaintance+ within 2 levels of the cap, and your other characters at the cap - 2, who join at their
own level and role); at least 2 tanks and 2 healers counting you. Seven pulls: three trash packs and four bosses.
Plans before each boss (two each), tells during it (4 s windows, 3.5 s for the Choir), raid calls S/A/Q/W. Auto's call
success: 85% with Raid Leader (first clear), otherwise `aiEff() x 0.6 + 8% per wipe` (capped at 85%). Lockout: bosses
stay dead 3 days. Loot: rarity-4 items at cap + 4 (+6 from Seraveth); each boss drops your class set piece for its
slot (hands, feet, legs, chest + head) plus an epic. Set bonuses: 2 pieces +5% health; 4: tank +10% armor / healer
+10% healing / damage +5%; 5: tank +3% dodge / healer +20% mana regen / damage +3% crit.
Measured (Auto sim, cap 52, rare gear): perfect calls or Raid Leader ~11 min, no deaths; Auto without Raid Leader:
warrior and rogue usually clear, a healer hero wipes on Seraveth until the raid learns. Retune when the cap is 60.

### Measured: the Hollow Crown, 45 → 52 and 52 → 55 (T23, 2026-10-07)

Native browser simulation through `serve.ps1`, using the same stand-in Focus method as the Barrowfields:
a fresh **Concord Human Warrior**, Classic pace, no talents, rested XP, pet, companions, mounts or addons;
uncommon gear of its current level generated at the start and replaced at each level-up. Step the real
`window.__rb.step(0.1)`, set `C.lastInput = C.run`, and use the first ready ability from `aiList()` each global
cooldown (`canUse` / `useAb(a, true)`). Accept available non-elite quests no more than one level above the hero,
keep the three-slot log full, turn in the higher-scoring reward and loot manually with `lootAll()`. Bags are
emptied between ticks as a stand-in for selling unwanted loot; no gear improvement is taken from drops. Repairs
and town departure use the real functions if needed. The sim suppresses presentation callbacks and wall-clock
timers only; it does not replace combat, XP, quest or death logic. Town-selling travel is not timed, matching the
earlier simplified method.

For reproduction, seed `Math.random` **before loading the game** with an unsigned 32-bit LCG: seed 230045;
`seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296`. Reset the seed and create a new
hero for each band. Stop at the destination level (52 or 55); the second run was also continued to 60 to check the
late grind. Solo skips the legendary quests, so their dependent quests and the Key are not completed by this sim.
These are leveling measurements, not dungeon, attunement or raid clear times.

| Start zone / level | Level reached | Minutes for this level | Total minutes from start |
|---|---|---|---|
| Outer Wood / 45 | 46 | 15.00 | 15.00 |
| | 47 | 39.44 | 54.44 |
| | 48 | 43.46 | 97.90 |
| | 49 | 34.09 | 131.99 |
| | 50 | 46.17 | 178.16 |
| | 51 | 46.12 | 224.28 |
| | 52 | 57.91 | 282.19 |
| Crown's Heart / 52 | 53 | 15.88 | 15.88 |
| | 54 | 43.71 | 59.59 |
| | 55 | 38.70 | 98.29 |
| Extension of the same Heart run | 56 | 55.01 | 153.30 |
| | 57 | 53.84 | 207.14 |
| | 58 | 51.37 | 258.51 |
| | 59 | 66.66 | 325.16 |
| | 60 | 70.28 | 395.45 |

Outer Wood: **282.19 minutes**, 1,018 kills, `hc1`–`hc10` completed, no deaths (40.31 minutes per level average).
Crown's Heart to 55: **98.29 minutes**, 352 kills, `ch1`–`ch7` completed, no deaths (32.76 average). Continuing
that same hero to 60: **395.45 minutes**, 1,405 kills, `ch1`–`ch10` completed, one death. The early quest burst is
faster than the ~45-minute target, as in the Barrowfields; the last two levels take about 67 and 70 minutes,
approaching the ~75-minute late target. No XP tuning was applied: the curve, previous chapter and existing XP
formulas are unchanged. This one-class, no-talents, seeded sample is a baseline; other builds, party play and
real travel to vendors will differ. Claude's cap-60 raid retune remains separate from T23.
Re-measured at cap 60 after T23 (2026-10-09, same sim, rare gear at 60): good calls or Raid Leader 11-13 min with no
wipes (Seraveth 190-225 s against the 240 s enrage); Auto without Raid Leader: warrior and rogue clear in ~12 min, a
healer hero wipes about 4 times and clears in ~24 min as the raid learns. No retune needed.

## The guild as built (2026-10-09)

`js/21-guild.js`. Founding: level 40, in town, 5 g, five signatures (other characters + companions at Friend). Members:
all characters, plus invited adventurers (Friend+), keyed `adv:<hero>:<npc>` and still living in their hero's
companion list. Mood 0-100 (starts 60): in your party +6/h, on a job +2/h up to 85, benched -1/h, at most 24 hours
counted at once; loot +10, a dungeon clear together +8, a raid boss +6; below 30 a warning, below 10 they leave;
70+ works 10% faster, below 30 20% slower. Jobs: adventurers mine, gather, guard (12 guild XP a watch, a watch every
15 min); characters can also quest. Guild XP: quest 10, dungeon clear 60, raid boss 150. Levels at 0/600/1800/4200/8400
guild XP (1-5): +2% XP per level for every character, job slots 3/3/4/4/5/6. Not yet: a walkable guild hall (the world
kit), guild-wide raid rosters and longer personal stories. First member requests are built below.


### First member requests (Codex, 2026-10-07)

A small first favor for every adventurer in the guild, under Evan's lunch-session development authorization.
The Guild tab shows the member's request in their existing personality's voice. Warrior and Rogue ask for one
repair kit, Mage for six ore for a practice-focus stand, Priest for one healing potion for a returning guard,
Hunter for four herbs for the animals. Materials come only from the account's shared supply bank. Bring them to
a town and return the member from any job before handing them over; any of your heroes may help any guild member.

Each favor gives +10 mood (capped at 100), +3 affinity and 15 guild XP, plus a companion memory and hero journal
entry. The supplies are consumed; these gifts do not change gear, jobs, damage, healing or quest XP. There is no
expiry or daily reset. A one-time account ledger, S.guild.requests[memberKey], stores the title and completion
time. It survives dismissal, mood departure, re-invitation and hero switching, so favor rewards cannot be farmed
by recruiting again. Older founded-guild saves default the ledger to an empty object in migrate(); pre-guild
saves remain unchanged. New guilds start with an empty ledger. This is a first supply favor, not a new personal
quest chain; larger stories and the world-kit hall remain separate work.
kit), guild-wide raid rosters, members' requests and personal stories.


## Guild-wide raid rosters (Codex, 2026-10-07; awaiting PR review)

A founded guild adds invited adventurers from every hero to the existing ten-person Hollow Throne pool.
They remain in their owning hero's companion list: level is that hero's level plus the existing offset, capped
at 60, with the same level-58 minimum and Acquaintance requirement as local raiders. Each adventurer appears
once, using the guild's existing owner-qualified member key; local companions retain their numeric ids.
Heroes who are in a dungeon, their adventurers, and members reserved by another saved raid are unavailable.
The Hollow Key, two-tank/two-healer requirement, encounters, raid size, calls and loot balance are unchanged.

Gathering pays all whole units earned on the selected raiders' jobs and stops those jobs before entry.
Members cannot take jobs or be dismissed while their saved raid is open, including when you switch heroes.
Leaving or finishing restores the leader's previous party and frees the members; jobs stay stopped until
you assign them again. Raid friendship, memories and mood write to the original adventurer, so a different
guild hero's run is remembered after saving and reloading. No extra save fields or migration are needed.
