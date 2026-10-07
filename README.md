# Idle Arcade

A stable of idle and progression browser games. Each game saves on its own in the browser,
and the hub page shows where you left off in every one.

**Design rule:** automation (managers, staff, instincts) is always earned by playing, never sold.

## Games

| Game | Status | What it is |
|---|---|---|
| [Primordial](games/primordial/) | Playable | Evolution idle game: cell to Leviathan, mutation drafts, niche fights, extinction resets |
| [Starfall Guild](games/starfall-guild/) | Prototype | Kairosoft-style adventurer guild: recruit, class combos, dungeon autobattle, town, staff, seasons |
| [Realmbound](games/realmbound/) | Prototype | Classic-MMO-inspired adventure: two factions, 5 classes including a pet-taming Hunter, levels 1–40, quests, loot, Focus/Auto play, addons as automation ([design](docs/realmbound-design.md)) |
| Diamond Career | In design | Baseball: create a player, earn a contract, spend it; later manage the club |
| Otherworld | Idea | Anime isekai: status window, evolving skills, story arcs, guild ranks F to S, reincarnation |

Design plans live in [docs/](docs/): [Realmbound](docs/realmbound-design.md), [idea backlog](docs/ideas.md).

## Layout

```
index.html            the hub (the "stable")
shared/engine.js      saves, export/import, number formatting, hub progress cards
games/<name>/         one folder per game, plain HTML + JS, no build step
serve.ps1             local test server: http://localhost:8765/
```

## Run locally

```
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```
then open http://localhost:8765/

## Picking up the work

Anyone continuing this project (any AI assistant or person): open [START-HERE.md](START-HERE.md).

## Changelog

- **2026-10-10** — **The Studio** (`studio.html`, not linked anywhere so players never see it; bookmark it): Evan's game-master tools. Turn on GM mode
  and every game gets a GM panel (Ctrl+Shift+G): give gold, coins, items and creatures, set levels and badges, teleport,
  change the time of day and the weather, heal, grant the Hollow Key, add supplies and guild experience, reset raid
  lockouts. Saves are backed up automatically before the first change, every action is logged, and the Studio can
  back up, download, import and restore saves.
- **v1.0.0 (2026-10-10)** — **Version numbers and a Feedback button in every game** (built by Jules, Google's coding
  agent, its first contribution). Each game and the homepage shows its version, and a Feedback button opens "Share
  feedback", "Report a bug" or "Suggest an idea", with the game, version and where you are already filled in.
- **2026-10-09 (evening)** — **Light and shadow, inspired by WoW: Forever.** A new shared light engine: the sun and
  moon cross the sky with each game's clock, and every hero, creature, tree, lamp post and building casts its own
  silhouette as a shadow that swings and stretches through the day (long and golden at dawn and dusk, faint under the
  moon, and away from torches and lit doors at night). Shadows carry colour from the sky and ground instead of flat
  black. Each zone and area has its own fog you move through (thick in the Fens, golden in the Hollow Crown, smoky on
  Ashen Ridge, cloud in Cloudglass Pass) with light scattering through it, low sun throws light shafts, the colour of
  the hour grades every scene, and bright lights bloom softly. Realmbound's header has a Graphics High/Low button.
  Also new: `docs/PROJECTS.md`, the master list of everything planned, and `docs/CREATIVE.md`, the ground rules.
- **2026-10-07** — Wildbond area 7: Sunthread Commons (62–68), reached from Hollowecho Hills with the Echo Badge.
  Nine new species, Clovercolt evolving into Bloomcourser at 64, Wren's gathering rematch, Meadowmantle guarding
  the nursery, and Warden Halen's Loom Badge (cap 70). Winding meadow paths, a meeting hall, two route trainers,
  three supplies and Pell visiting the gathering; clear mornings and sudden rain, an original zone tune, and
  meadow hills with drifting leaves behind battles.

- **2026-10-09 (later)** — **Realmbound's hubs get their own character.** Wildclan hubs are now camps: hide tents
  around a great firepit with real flames and smoke, torches, a palisade and a painted totem (the Longhouse, Forge,
  Guild lodge and Corral). Thornvale's inn is the Abbey, with a bell tower. **You can walk into your guild hall:** a
  long room with a red rug, long tables, banners, candles and a roaring hearth, where your guild adventurers gather;
  talk to them for their mood, give them their favor right there, and use the chest and jobs board. Wildbond's walking
  now runs on the same shared engine as Realmbound's towns.
- **2026-10-07** — Realmbound guild raids can draw adventurers from all your heroes, at their owners' levels.
  Gathering pays and stops their jobs; raiders stay reserved across hero switches and reloads, then are free
  when the run ends. Friendship and memories stay with the original companion. Existing raid gates and balance remain.

- **2026-10-09 (late night)** — **Realmbound's towns are places now.** Arriving in town, the scene turns into the hub,
  seen in HD-2D like Wildbond: walk around with the arrow keys or WASD or by tapping, and talk with Enter. The Inn
  heals everyone, the Smithy buys your junk and repairs, the Trainer, the Stable and the **Guild hall** open their
  tabs, the quest giver offers the next quest in a scene, Pip lights the lamps at night, and now and then Pell the
  peddler and his mule Brisket come through selling healing potions. Windows and lamps glow at night, and the town
  gets the zone's weather. On Auto your hero strolls to the smithy and out of the gate. This runs on a new shared
  world kit, and Wildbond's HD-2D view now draws through the same engine.
- 2026-10-07: Wildbond Hollowecho Hills (58–64): nine species, Wren's listening rematch, Undertone and Warden Senna's Echo Badge (cap 65), a winding map beyond Stillreed with two trainers, mist and an original tune.
- 2026-10-07: Wildbond's Journal shows current weather and the next two periods for unlocked routes after the Tide Badge, with notes on which creatures favor each condition.
- 2026-10-07: Wildbond battles in 16-bit and later styles keep their region's scenery, weather and night: woods, coast water, highland stone, cloud peaks and basin reeds. Combat and earlier art styles are unchanged.
- 2026-10-07: Wildbond challenge titles now display four original pennants in the Ranch tab. Existing earned titles work immediately; these decorations give no stat bonuses.
- 2026-10-07: Quiet rain sound follows the weather in Wildbond and Realmbound through the shared sound engine. Off by default; fades between conditions and stops on hidden pages or sound off. Shared sound checks: tests/sound.html.
- 2026-10-07: Realmbound guild adventurers can ask a first supply favor in their own voice. Help in town from the shared bank for mood, friendship and guild XP; each favor is recorded once, even after dismissal and re-invitation.

- **2026-10-07** — Wildbond area 5: Stillreed Basin (52–60), beyond Cloudglass Pass. Nine new species include
  Reedlet's evolution into Ferrycrest and the guardian Stillwake. Wren helps free a ferry rope before the rematch;
  ferryman Warden Olan awards the Reed Badge, raising the existing cap to 60. Walk the reed banks, board crossings
  and orchard, meet two route trainers, find three supplies, and hear an original basin tune between rain showers.

- **2026-10-09 (late)** — **Realmbound: found a guild.** At level 40, in town, buy a charter (5 gold) and gather five
  signatures from your other characters and companions who are your Friends. One guild for your whole account: every
  character is a member and you can invite the adventurers you trust. Adventurers have a **mood**: group with them,
  give them loot and clear dungeons together and they're happy (and work faster); leave them benched too long and
  they'll tell you, then leave. Members can work the jobs board, including the new **Guard duty**. The guild levels up
  from quests, dungeon clears, raid bosses and guard duty: up to +10% experience for every character and six job slots.
  The Supplies tab is now the **Guild** tab.
- **2026-10-09 (late)** — Wildbond's opening now explains its faded green look: the world lost its colour long ago,
  and it comes back with the first badge. (Evan saw green sprites on a fresh start and took it for a bug.)
- **2026-10-09 (night)** — Realmbound's quest log now tells you when an attunement quest is waiting: "will offer this
  once you have cleared the Silent Barrows and Rootrot Hollow". The raid was re-tested at the new level cap of 60.
- **2026-10-09 (evening)** — **The worlds come alive** (a new shared ambience system, inspired by a living pixel-art
  scene Evan saw). **Realmbound:** every zone has its own sky and distant scenery that scrolls past as you travel
  and sways in the wind (Thornvale's oaks, Redsand's mesas, dead trees and reeds in the Fens, glowing volcanic peaks
  on Ashen Ridge, snowy peaks and pines in Frostmere, standing stones in the Barrowfields, giant canopy trees in the
  Hollow Crown); weather that changes every few minutes, including **thunderstorms with lightning and thunder**,
  blizzards, fog, dust and ashfall; birds, bats at dusk, fireflies, grave-wisps, spores and a distant drake; a day and
  night every 24 minutes with stars, the moon and the aurora over Frostmere; a campfire when you rest, the inn's
  windows glowing at night, flickering torches in dungeons and braziers in the Hollow Throne. **Wildbond:** rain
  with splashes and thunderstorms, embers over Emberfall, glittering cloud in Cloudglass Pass, fireflies at night and
  real pools of light around you and at every door in town. **Starfall Guild:** living torches and a window on the
  night sky where a star falls now and then.
- **2026-10-07** — Realmbound: the Crown's Heart (T23) extends the journey from 52 to the level-60 cap.
  Heartwatch Camp, six ordinary threats, Aurethyn the legendary tameable drake, fourteen voiced quests and the
  Heartwood Vault (56+) lead to the Hollow Key. Its final three quests require clears of the Silent Barrows and
  Rootrot Hollow; completing the last unlocks the existing Hollow Throne raid. Includes original zone music and
  measured Focus pacing. Locked attunement quests remain hidden in the log pending a separate UI change.

- **2026-10-09 (later)** — **Realmbound's first raid: The Hollow Throne.** Ten people: you plus nine from your
  companions and your own other characters (two tanks and two healers at least). Four bosses, each with one thing to
  watch for: the Bark Warden shreds its tank (call **Swap!**), the Ashwing Brood hatches adds (**Adds!**), the
  Rootbound Choir sings two songs (**Spread!** or **Stack!**), and Seraveth does all three before an enrage. Before
  each boss you pick a plan; during the fight you make the calls (buttons or S, A, Q, W). Auto makes calls too, badly
  at first but better after each wipe, and reliably once you've cleared it (Raid Leader). Bosses stay dead for 3 days.
  Epic loot and a five-piece set for your class with set bonuses. It opens with the Hollow Key from the Crown's Heart.
- **2026-10-09** — **Realmbound: a third talent tree for every class** (Warrior Fury, Rogue Subtlety, Mage Arcane,
  Priest Discipline, Hunter Survival), each with new abilities (Bloodthirst, Death Wish, Shadow Dance, Arcane
  Missiles, Penance, Pain Suppression, Explosive Shot...) and talents that change how you play: a wider Finishing Blow
  window, repeat Backstabs, Smites that heal your party, stings that make your next shot instant. Everyone gets one
  more free talent reset. **The jobs board grew:** Herbalism (herbs brew healing potions, drunk automatically below
  30% health) and Questing (a benched hero slowly earns their own XP and gold). **Starfall Guild has sound now**
  (ChatGPT, T26): its own town, delve and boss music on the arcade's shared sound system.
- **2026-10-07** — Starfall Guild sound (T26): original town, delve and boss music through the shared sound engine,
  plus effects for recruiting, leveling, purchases, relics, boss victories, wipes and seasons. Sound starts off;
  the header cycles effects and music on, and saves the choice. Catch-up and automated actions cannot flood cues.

- **2026-10-08 (night, later)** — **Realmbound: your other characters can work for you now.** A new **Supplies** tab
  holds a supply bank shared by all your characters and a jobs board: any hero you aren't playing can go Mining (3 at
  a time; higher levels mine faster), and their ore arrives even while you're away, up to 8 hours, with one report
  when you come back. Ore makes **repair kits** that mend all your gear anywhere, and Auto uses a kit instead of
  walking back to town. Each hero keeps their own bags. Built on a new shared roster system the guild will use next.
- **2026-10-07** — Realmbound: The Hollow Crown's Outer Wood (T22) extends the journey to level 52.
  Both factions share Thornmantle Camp, twelve voiced quests follow the empty throne and Ashwing claim,
  Veskareth is a legendary tameable drake, and Rootrot Hollow opens at 49 with four packs and three bosses.
  Old level-45 saves resume earning XP. Seraveth and the Crown's Heart remain ahead.

- **2026-10-08 (night)** — One sound system for the whole arcade (`shared/sound.js`). **Realmbound has sound now**
  (off by default; the header button cycles off / effects / effects + music): its own tune for every zone, from
  Thornvale's flute to the Barrowfields' lament, plus dungeon, boss and spirit-walk music, and effects for levels,
  quests, tames, rare drops, warnings, dodges, deaths and dungeon clears. Quest givers each have their own voice.
  **Wildbond sounds better too:** drums on the Warden, battle, trainer and legend themes, a light echo, and music
  that crossfades between places instead of cutting.
- **2026-10-08 (late)** — One scene system for the whole arcade (`shared/dialogue.js`): pixel portraits that blink, talk
  and show moods, more faces (braids, hoods, beards, pointed ears, tusks), and choices at the end of a scene. Wildbond's
  scenes now use it. **Realmbound's quest givers now speak in portrait scenes:** accept a quest by hand to hear the
  request and choose Accept or Not now; turn one in to hear their thanks. Every giver gets their own face, the same
  every time, drawn from their faction's peoples. QuestHelper and Auto skip the scenes.

- **2026-10-08 (night, ChatGPT)** — Starfall Guild is split into small classic scripts and its unchanged stylesheet (T25).
  Wildbond has 76 new browser checks for its newer systems (T24).
  Adds a browser check page for old saves, recruiting, combat, town purchases and seasons; gameplay and saves are unchanged.

- **2026-10-08 (night, later)** — Decisions from the research brief (`docs/research/decisions.md`). Wildbond: the main
  story will end near level 70, so badge caps now rise 10 a badge for the first four and 5 after (55, 60, 65, 70, then
  75 with all eight); nothing changes for the four badges that exist today.
  Realmbound: kill experience is now shared by the group with classic bonuses (questing with four companions is
  about 1.3× faster than solo instead of 5×), and every hero has a journey length (Breezy, Classic, Long Road) chosen
  at creation and changeable in the Journal.

- **2026-10-08 (night)** — Realmbound: the Silent Barrows' bosses now breathe **Grave Chill** (T1-B), a cold that
  stacks on your whole party and hurts every second until someone heals it off, so a healer really matters there.
  Measured how long levels 40-45 take (2¼-3½ hours of active play solo; Auto is slower for every class).

- **2026-10-08 (evening)** — Realmbound item names now progress through eight tiers (T21, ChatGPT): the original level 1–20 names,
  then new names for 21–30, 31–40, 41–50 and 51–60 across every armor material, weapon, off-hand and trinket.
  Adds ten dungeon-flavored rare-item prefixes. Existing saved items keep their names; item statistics are unchanged.

- **2026-10-08 (later)** — Wildbond area 4, Cloudglass Pass (T17): a rope gate north of Emberfall opens with the
  Ember Badge onto a misty mountain pass. Seven new wild creatures (Mistfinch evolves into Cloudharrier), the guardian
  Lanterncrest, trainers Ilka and Teodor, a Wren rematch, and Warden Vessa, whose Beacon Badge raises the cap to 55.
  Pip now notices when the Tide Badge brings light and depth back. Promo page and hub updated to four Wardens.

- **2026-10-08** — Merged ChatGPT's Realmbound chapter (T20): the Barrowfields beyond the winter road, twelve voiced
  quests about the Wayfolk and their road-stones, Paleweft the Lamp-Eater, and a third dungeon, The Silent Barrows,
  ending with the Last Wayward. The level cap is 45. Talents, part 1 (T1-A): every class gets a second tree
  (Warrior Protection, Rogue Combat, Mage Frost, Priest Holy, Hunter Marksmanship) and each tree grows to 25 ranks
  plus a capstone ability that needs 25 points in it, so you can only ever have one. Points no longer go to waste
  after level 31. Your role in dungeons follows your build: a Protection warrior tanks, a Holy priest heals. New
  talent abilities appear on your bar when you learn them. Resetting talents is free below 40 and once for
  everyone with this update, then costs a little gold.

- **2026-10-07** — Realmbound Frostmere II (T20): The Barrowfields extends the journey to level 45 with twelve
  voiced quests, grave-cold beasts and restless Wayfolk wardens, and Paleweft, a legendary tameable spider.
  The Silent Barrows opens at level 42: four packs and three bosses ending with the Last Wayward, plus existing
  Heroic tiers. Old level-40 heroes can resume earning XP. Grave Chill and pacing measurement follow in T1-B.

- **2026-10-07 (night, later)** — Realmbound plan for levels 40-60, the guild and raids (T1): docs/realmbound-40-60.md.
  Three chapters (the Barrowfields and the Silent Barrows, then the Hollow Crown in two parts), second and third
  talent trees with roles that follow your build, item names for every level band, a guild that is your whole
  account, and a first 10-person raid, The Hollow Throne.

- **2026-10-07 (night)** — Merged ChatGPT's promo pages (T19): promo.html is up to date for Realmbound (levels 1-40,
  Frostmere), and promo-wildbond.html introduces Wildbond to friends; the hub links both.

- **2026-10-07 (evening)** — Wildbond challenges and rematches (T11b). Starting a new journey you can switch on
  challenge modes, alone or mixed: **Nuzlocke** (a creature that faints goes home to the wild, and only the first
  creature you meet in each area can be caught), **Randomizer** (wild creatures shuffled between the areas),
  **Solo Run** (just you and your first partner) and **Hardcore** (smarter opponents, no Rally). Collect every badge
  with a mode on to earn its title. Beaten Wardens now take a rematch once a day, and Wren hangs around Larkhaven
  wanting one too: each tier is tougher, scales to your team and pays better. Each area has three mastery stars
  (Journal): fill its Wilddex, beat its Warden's tier 3, and find every item and beat every trainer.

- **2026-10-07 (later)** — Merged ChatGPT's Wildbond music (T18): original tunes for Larkhaven, Emberfall, Cloudglass,
  Warden battles, night and rain, chosen by where you are and what the sky is doing; voices for the newer characters.

- **2026-10-07** — Wildbond eras, part 3 (T13): the Ember Badge makes the world solid. In the new Diorama style
  every place is a little 3D model, like a carved table-top scene: houses are blocks with red roofs, trees and rocks
  stand up, and you, the townsfolk and every creature are your pixel art pushed out into chunky 3D blocks. Drag the
  scene to turn the camera all the way around, scroll to zoom; the arrow keys follow the camera. Toren also lets you
  ride your lead creature (press R or the Ride button) for a much faster trip. Battles use the HD-2D look.

- **2026-10-07 (early)** — Merged ChatGPT's Wildbond lore bible (T14, docs/lore/wildbond.md). Wildbond eras, part 2
  (T13): the Tide Badge brings light and depth back to the world in a scene on the beach, and the new HD-2D style
  shows the same places through a tilted camera: trees, people and creatures stand up out of the ground, the
  distance fades into haze and goes soft, and warm light falls across everything. Weather arrives too (rain on the
  coast and in the woods, mist, falling ash in the highlands), and it changes which creatures come out. Wild
  creatures now show themselves in the tall grass: walk into one to battle it (they're a little more often rare).

- **2026-10-06 (night, part 4)** — Wildbond eras, part 1 (T13): a new journey now begins in a faded world, four
  shades of green like an old handheld (the Pocket style). Earning the Thorn Badge brings the color back in a short
  scene, unlocks the Pixel and 16-bit styles, and Isolde gives you Warden's boots (hold Shift to run, or tap somewhere
  far away). A day/night clock arrives too: dusk and night darken the 16-bit world, and Shade creatures come out more
  at night. Maren, Pip and Old Tobin each have something to say about the color. Existing saves keep their style
  and can try Pocket from the Journal.

- **2026-10-06 (night, part 3)** — Merged ChatGPT's Wildbond browser checks (T16): open
  http://localhost:8765/tests/wildbond.html (via serve.ps1) and click Run checks; 314 checks of maps, story data,
  walking, gates, level caps, Wardens, old saves, the inn and the shop. Your save is backed up and restored.

- **2026-10-06 (night, part 2)** — Wildbond walkable world, part 2 (T7b): six tamers now wait along the routes
  (two per area). Walk into the line they're watching and they spot you ("!") and come over for a battle; beat them
  once and they'll chat instead. Pouches of coins, lures and ranch food lie around each area, signposts tell you
  where roads lead, and your lead creature now trots along behind you. Fixed a rare crash when a charged-up attack
  landed after your whole team had fainted.

- **2026-10-06 (later still)** — Merged ChatGPT's Emberfall Warden (T15): Warden Toren waits above the highland
  springs and tests your patience; beating him earns the Ember Badge and raises the level cap to 45.

- **2026-10-06 (late night)** — Wildbond walkable world, part 1 (T7b): Larkhaven, Thornwood, the Saltmarsh Coast and
  the Emberfall Highlands are now places you walk around, top-down, with the arrow keys/WASD or by tapping where to go.
  Wild creatures hide in the tall grass. Walk into the inn to rest, the shop for lures and Maren's barn for your
  ranch, whose creatures now roam the paddock. Wardens stand by their gates (a "!" means they're ready for you) and
  townsfolk have things to say. Gates stay shut until you've earned the badge. Auto-explore walks the grass for you.
  Works in both art styles.

- **2026-10-06 (night)** — Wildbond pacing overhaul (T11): levels now go to 100 and the journey is much longer. You pick
  a journey length with your starter (Breezy: first badge in about an hour; Classic: about two to three hours; Long
  Road: less XP and rarer finds) and can change it at the Larkhaven inn in the Journal. Badges set a level cap (15,
  then +10 per badge) as a soft cap, hard cap or off; an optional XP share teaches ranch creatures from your battles.
  Auto-explore earns a little less XP than playing yourself. New: Warden Nerys of the Saltmarsh and the Tide Badge,
  which opens the Emberfall Highlands. Saltmarsh (12-22) and Emberfall (22-32) were rescaled to fit.

- **2026-10-06 (evening)** — Merged ChatGPT's Realmbound **Frostmere: The Winter Road** (PR #7): a snowbound zone
  for levels 30-40 with Lanternrest Lodge and Whitebough Hearth, ten quests, ice trolls, three new tameable beasts
  and Hushfang, a legendary wolf elite; the level cap is now 40. Merged ChatGPT's research and staged plans for every
  game, including a broader sports direction (PR #8, docs/plans/).

- **2026-10-08 (night, later)** — Merged ChatGPT's Realmbound lore pass (PR #6): every zone has a lore paragraph (shown on its
  own line under the zone name) and every quest giver now says something when you turn a quest in. Lore bible in
  docs/lore/realmbound.md. Merged Wildbond Emberfall Highlands (PR #5). Added CLAUDE.md so any Claude session on any
  computer starts with the project's rules and current status.
- **2026-10-08 (night)** — Wildbond feels like a real game, part 1: story scenes with character portraits (Keeper Maren,
  Wren, Warden Isolde) and typewriter dialogue for every beat, from the opening cart ride to Breakwatermane; battle
  animation (teams slide in, lunges, flinches, element sparks, crit shake, fainting); chiptune sound effects and music
  for each area and battle type, made live in the browser (header button, off by default). Saltmarsh story beats.
  Legendaries you knock out now slip away and return instead of vanishing.
- **2026-10-08 (later)** — Wildbond part 2: ranch days every 5 minutes (also while away) with daily food and
  training plans, fatigue, injuries and mood; breeding barn with inherited genes, pedigree and three hidden hybrids
  (Lynxhound, Drakelet, Bramblestag); biome travel. Merged ChatGPT's 16-bit art era (PR #3).

- **2026-10-08** — Wildbond part 1 (early access): shared creature module, three starters with evolutions, rival Wren,
  Thornwood with 10 wild species, lure-and-calm capture, 3v3 auto battles with commands (Focus, Guard, Rally),
  telegraphed attacks, Elderhorn, the Thornwood Warden and the Thorn Badge, Wilddex, art-era system. Merged
  ChatGPT's Realmbound split (PR #2).

- **2026-10-07 (night)** — Hub: "Reset progress" on every game card with progress, with a confirmation step.
  Erases that game's save on this device (for Realmbound, every character).

- **2026-10-07 (evening)** — Primordial rebalance from phone playtest: breeding slowed to a fraction, milestones double at
  25/50/100/200…, first extinction at 10B (simulated ~22 min for a perfect player, ~40 real), at most 3
  mutations waiting at once. Clear "← Arcade" button in Primordial and Starfall Guild.

- **2026-10-07 (later)** — Merged ChatGPT's Ashen Ridge / level 30 / Cindervein Foundry work (PR #1) after review; 118 scenario
  checks pass. Added promo.html, a shareable pitch page for friends.

- **2026-10-06** — Realmbound: level cap 30, Ashen Ridge with two faction outposts, ten quests,
  six enemy types including the legendary Coalmaw, and the Cindervein Foundry (three bosses).
  Dungeons now keep separate Heroic unlocks; existing Sanctum saves migrate automatically.
  New bosses use Cinder Rain and Molten Rupture with the same active dodge controls.

- **2026-10-07** — Realmbound: wandering NPC adventurers with personalities and friendship, grouping,
  combo abilities, the Drowned Sanctum (3 bosses, waves, dodgeable Tidal Surge, loot sharing, infinite Heroic
  tiers), LFG Tool addon. See HANDOFF.md to continue with any tool.

- **2026-10-07** — Realmbound: mounts. Riding skills, faction mount vendors, rare reins from legendary elites,
  mounts that train as you ride them, Hunters riding their own pets. Travel between fights, to town and
  between zones is faster when mounted.

- **2026-10-06 (night)** — Realmbound: character slots (up to 8). Characters button in the top bar; each hero
  keeps their own gear, quests, pets, addons and log. Heroes you aren't playing earn rested XP while away.
  Old single-hero saves upgrade automatically.

- **2026-10-06 (evening)** — Realmbound: Hunter class and pets. Taming with wild rarity from common to
  legendary, 7 beast families, traits, bond levels that unlock Coordinated Strike and a pet that saves you,
  happiness and feeding, a 3-pet stable, PetCare addon, Beast Mastery talents. Playtested taming a common
  and a legendary elite, combat with a pet, feeding, stable swaps; other classes unaffected.

- **2026-10-06 (later)** — Realmbound v0: character creation (2 factions, 4 races, 4 classes), three zones to
  level 20, 26 quests, auto-combat with a 6-button action bar and reactive openings, Focus/Auto modes (active
  play always worth more), loot with rarities and suffixes, durability and corpse runs, town vendor, talents,
  rested XP, 5 earned addons. Playtested all four classes. Design plan in docs/realmbound-design.md. Creature
  and companion idea added to docs/ideas.md.

- **2026-10-06** — Hub and shared engine. Primordial v1 (playtested: drafts, instincts, contests,
  extinction, offline catch-up, import). Starfall Guild prototype (playtested: recruiting, leveling,
  shops, bosses and relics, staff, seasons). Fixed: drafts no longer offer mutations for locked organisms;
  Starfall heal-between-fights and crit math.

## Development checks

Serve the repository with `python -m http.server 8765` (or `serve.ps1`). With Playwright and its
Chromium browser installed, run `node tests/realmbound-smoke.cjs`. The check covers old dungeon
save migration, levels 20–30, quest chains, per-dungeon Heroic gates, save/reload, group-finder
controls and mobile layout. For a DOM-only check without Chromium, install `jsdom` in your development
environment and run `node tests/realmbound-dom.cjs`. This executes the same progression scenarios and
checks save/reload and group-finder interactions, but does not verify browser rendering or mobile layout.
The games themselves still require no dependencies or build step.
