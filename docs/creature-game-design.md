# Wildbond (working title): creature game design

Catch, raise, train, breed, race and battle creatures on a frontier ranch. Roots: the WoW hunter fantasy,
Pokemon, and Kairosoft's horse-racing stables. Depth over breadth: every creature is an individual with a
story, and raising one well is the game.

## Pillars
1. **Every creature is an individual.** Genes, temperament, traits, history, parents. No two Ashen Wolves alike.
2. **Raising is the game.** Catching starts it; feeding, training, resting and bonding make a champion.
3. **Breeding is discovery.** Bloodlines improve over generations; the right pairs make hybrids nobody has seen.
4. **Many ways to use a creature:** battle, race, ride, or work on the ranch.
5. **Automation is earned:** ranch staff join once you've done their job by hand. Active play beats Auto.

## It must feel like a real game (Evan, 2026-10-08)
Not a puzzle game, not a dashboard. Wildbond should feel like Pokemon or Palworld: a world you live in.
- **A world, not a menu.** A region map of places to walk between (towns, routes, caves, the coast), each with
  its own scene, music mood, people and secrets. Exploring reveals the map.
- **People with faces and voices.** Dialogue boxes with portraits, named characters with their own wants:
  the rival Wren, the Wardens, ranch hands, a researcher studying hybrids, a mysterious rival group.
- **Lore you uncover.** Why creatures bond with people, where the elements come from, what the legendaries guard.
  Told through dex entries, ruins, NPC stories and the main plot, not walls of text.
- **Battles with life.** Move animations and hit effects per element, creatures reacting, screen shake on big hits,
  victory poses.
- **Sound.** Simple chiptune music per area and battle, plus sound effects (generated in the browser).
- **Depth that compounds:** every system (raising, breeding, jobs, battles) feeds the others.

## Next layers (inspired by Palworld, Dragon Quest Monsters, Monster Rancher, Cassette Beasts)
- **Creatures work the ranch (Palworld).** Each creature has job aptitudes from its family and element: Ember
  cooks and smelts, Tide waters crops, Grove farms, Stone mines, Gale hauls and scouts, Shade guards at night,
  Radiant lights and heals. Assign them to ranch buildings; they produce food, materials and coins over time.
  This replaces human staff as the automation layer, and it makes every creature useful, not just the strong ones.
- **Skill inheritance (Dragon Quest Monsters).** Children can inherit a move from each parent, so building a
  dream creature takes planned generations. Some moves only exist through breeding.
- **Careers (Monster Rancher, softened).** Creatures peak, then slow down and eventually retire to the ranch,
  where they keep working and become prized breeding stock. No death; a gentle arc that gives choices weight.
- **Fusion (Cassette Beasts).** A Bonded pair can fuse in battle into a combined form for a few turns, with a
  look and moveset drawn from both.
- **A real region and plot.** Several towns and routes, eight Wardens, a rival group with motives, legendaries
  tied to the plot, and a post-game.

## Core loop
Explore a biome → find and capture → raise on the ranch → compete (battle league, races) → earn money,
reputation and rare items → breed better creatures → unlock deeper biomes and higher leagues.

## Creatures
- **Families** (shared with Realmbound): wolf, boar, cat, hyena, lizard, crocolisk, spider, plus new ones:
  strider (horse-like runner), raptor-bird, serpent, drake, golem, sprite. Family sets body shape, base stats,
  diet, and which abilities it can learn.
- **Elements** (7, on a wheel for battle advantage): Ember, Tide, Grove, Stone, Gale, Shade, Radiant.
- **Stats** (6): Power, Guard, Speed, Stamina, Wits, Spirit.
  Each creature has a hidden **potential** per stat (genes, shown as grades F to S once you can read them)
  and a **trained** value that rises with training and level, capped by potential.
- **Temperament:** Bold, Calm, Skittish, Proud, Playful, Lazy. Changes training gains, race strategy and how
  it reacts to commands.
- **Rarity:** Common, Uncommon, Rare, Epic, Legendary, Mythical. Rarer means higher potential floors and more
  trait slots. Rare color variants and named unique wilds (one per biome per season).
- **Traits:** the Realmbound list (Ferocious, Swift, Keen, Loyal, Hardy…) plus racing and ranch traits
  (Sure-footed, Iron Lungs, Early Riser, Gentle). Inherited through breeding.

## Capture
Find creatures on expeditions to a biome. Weaken one in battle **or** calm it (Druid path), then throw a
lure or net. Chance depends on rarity, its health and mood, your tools, and your tamer path.
**Active play:** a short "calm" timing meter during the throw raises the odds. Auto expeditions only catch
commons, at a lower rate. Failure means it flees; uniques may vanish until next season.

## Tamer paths (who you are matters)
Pick one at the start; learn a second later.
- **Hunter:** better capture and battle damage with beasts; tracks rare spawns.
- **Druid:** calms instead of weakening; bonds fastest; Grove and Tide creatures favor them.
- **Rider:** racing and mount bonuses; stamina training is stronger.
- **Breeder:** reads potential grades; better mutation and hybrid odds.
Your ancestry (race) gives a small affinity to one element.

## Raising (the heart of it)
The ranch runs in **days** (about 5 real minutes each). Each day you schedule each creature:
- **Feed:** diet shapes growth (meat → Power, grain → Stamina, fish → Speed…). Hunger hurts mood.
- **Train:** Sprint, Weights, Swim, Sparring, Puzzles, Meditation. Each raises stats and adds fatigue.
- **Rest and groom:** recover fatigue, raise mood and bond.
Overtraining risks injury (days off). Mood multiplies gains. Bond grows with care and shared wins:
Wary → Friendly → Loyal → Devoted → Bonded. Bond unlocks commands, combo moves and riding.

## Battle
3-vs-3 teams with front and back rows. Abilities come from family plus element; positions matter.
Auto-battle by default. **Active play:** call commands at the right moment (a special move, swap, guard),
like Realmbound's reactive openings. Ladder: wild encounters → Rookie League → regional cups → endless
Champion tiers. Rival tamers use Realmbound's NPC system: personalities, friendship, rematches.

## Racing (the Kairosoft fantasy)
Tracks vary by distance and terrain (turf, sand, swamp, mountain). Strategy (front-runner, stalker, closer)
comes from temperament and your orders. Speed, Stamina and Wits decide most races.
**Active play:** one well-timed "urge" burst per race. Prize money, reputation, seasonal cups; retired
champions become prized breeding stock.

## Breeding and hybrids
Pair two compatible creatures in the breeding barn.
- **Genes:** each stat potential is drawn between the parents' values, with a small chance to beat both.
- **Traits:** each parent's traits pass on by chance; rare new traits can appear.
- **Color genes** for variants. **Pedigree** tracked as a family tree.
- **Hybrids:** specific cross-family pairs make new species (e.g. wolf × cat → Lynxhound, lizard × raptor-bird →
  Drakelet). Recipes are discovered, not listed.
- **Mythical:** hybrids of two Legendaries, or special conditions (a season, an element, both parents Bonded).

## Ranch and automation
Buildings: stalls (capacity), training yard, track, breeding barn, kitchen, infirmary. Staff join once you've
done their job by hand: Stablehand (feeding, after 50 feeds), Trainer (follows a schedule), Scout
(auto-expeditions), Breeder's assistant (suggests pairs), Jockey (runs races). Staff never beat a player who
is paying attention.

## Long-term and roguelike
- **Frontier expeditions:** seasonal, randomized biome maps with events and a limited number of days.
  The best source of uniques and rare traits.
- **Seasons:** the league resets each in-game year with bigger cups; Hall of Fame bloodlines carry over and
  boost future breeding.
- **Endless:** higher leagues, deeper biomes, the pursuit of a perfect Mythical bloodline.

## Sharing with Realmbound
Build the creature system once as `shared/creatures.js`: species registry, individual generation (genes,
rarity, traits), stat math, bond, breeding, rarity rolls, and the beast drawer. Realmbound pets and mounts
move onto it later. Because every game runs on the same site, a creature raised here could be adopted by a
Realmbound Hunter.

## Build order
- **v0:** one biome, 12 species across 6 families and 3 elements, capture, a ranch with 6 stalls, daily
  feed/train/rest scheduling, bond, 3v3 auto-battles with commands, a Rookie League with 5 rival tamers,
  breeding with genes and 3 hybrid recipes.
- **v0 story:** a starter creature, a rival tamer, the first biome's story beat and challenge.
- **v1:** racing (tracks, strategies, the urge burst), contests, a second biome, the first staff.
- **v2:** Frontier expeditions, seasons and the Hall of Fame.
- **v3:** Realmbound bridge: shared module, pets and mounts move onto it, creature adoption.

## Who builds what
- **Claude:** `shared/creatures.js` (genes, breeding, stats, bond), capture and battle feel, the raising
  schedule, balance.
- **ChatGPT:** species and biome data written to this spec, rival tamer dialogue, race tracks, tests.

## Decisions (Evan, 2026-10-07)
- **Name: Wildbond.**
- **Several gameplay loops, with battling as the main one.** Like Pokemon, the spine is exploration plus a
  story (regions, a rival, a league to climb), and other activities sit beside it: racing, and **contests**
  (show off a creature's looks, temperament and tricks for prizes) like Pokemon's contests.
- **Battles: auto-battle with timed commands.**
- **Art: chunky pixel style for now;** the art direction may change later, so keep drawing code isolated in
  one place (the beast drawer) so it can be swapped.

## Story spine (to flesh out in v0)
A frontier region opens up: you arrive with one starter creature, meet a rival tamer who starts the same
day, and work through the biomes toward the region's league. Each biome has a story beat, a unique creature
and a gym-like challenge. Contests and races are side paths with their own ladders and rewards.

## Contests (new loop)
Categories judge different things: **Grace** (Speed, Wits), **Might** (Power, Guard), **Charm** (Spirit,
bond, variant colors), **Tricks** (abilities learned through training). Temperament and mood matter; grooming
and practice routines raise appeal. **Active play:** time a creature's showcase move to the crowd's
excitement. Ribbons and titles are cosmetic plus small breeding value.

## Pacing, level caps and journey settings (planned 2026-10-06)
Evan's direction: the journey and the grind are the fun part, but the player should choose how long it takes.
Replayability and reasons to revisit older content matter. Ideas drawn from what fans love in Pokemon fan games
(Radical Red, Run & Bun, Unbound, Rejuvenation, Insurgence, Reborn).

**Measured problem (v0):** on Auto from a fresh save, the team hit level 12 in 15 minutes and the level-20 cap in
about 2 hours, before the first badge. Far too fast.

**Built in T11 (2026-10-06):** levels 1-100; journey length Breezy/Classic/Long Road (XP 0.36/0.13/0.08 of the old
rate, coins 1.5/1/0.8, rarity boost +0.15/0/-0.3); Auto-explore earns 0.8x XP; badge caps 15 + 10 per badge (soft:
5% XP above the cap; hard; off); XP share gives ranch creatures 25%; Warden Nerys and the Tide Badge in Saltmarsh
(explore 24, team 21/22/24). Measured on Auto from a fresh save with a sim player who catches two partners and
challenges a Warden when about level with its ace: first badge at ~49 min (Breezy), ~140 min (Classic), ~208 min
(Long Road); Breezy's second badge ~3.5 h. Still to do: challenge modes, rematches, the remaining QoL items.
**Re-measured after the walkable world (T7b, tall-grass steps at real walking speed, route trainers on):** first
badge ~62 min (Breezy) and ~170-200 min (Classic) on Auto; active play earns 1.25x the XP, so Classic lands at about
2.3-2.6 h when played. A find comes every 8-16 tall-grass steps (`WK.grassN` in 12-walk.js) at 5 tiles a second.
Simulations must call `worldTick(0.1)` in a loop; walking then runs at the real speed.

**Decided 2026-10-08:** the main story ends near level 70; badge caps 15, 25, 35, 45, 55, 60, 65, 70, then 75 with all
eight; post-game to 100 (see `docs/research/decisions.md`).

**Full 1-100 range.** About eight areas, each with a level band (Thornwood ~2-12, Saltmarsh ~12-22, Emberfall
~22-32, ...). Eight badges carry you to about 70; the post-game takes you to 100.

**Journey length, chosen at the start and changeable at the Larkhaven inn** (Rejuvenation lets you change difficulty
at a tent in town):
- *Breezy:* more XP and coins, for a quick story run (first badge in about an hour of play).
- *Classic:* the intended pace (first badge in about 2-3 hours, main story 30-50 hours).
- *Long Road:* less XP, rarer finds, for players who want the grind.
Idle/Auto always earns less than active play on every setting.

**Level caps tied to badges** (the most-loved fan-game feature: Run & Bun, Radical Red). Each badge raises the cap.
Options: *Soft* (default: XP drops to a trickle above the cap, so you can't over-level an area by idling),
*Hard* (no XP above the cap), *Off*.

**Challenge modes, picked at a new game** (Insurgence builds these in so players don't track rules by hand):
*Nuzlocke* (a fainted creature is released; only the first encounter per area can be caught), *Randomizer* (wild
tables shuffled), *Solo Run* (one creature only), *Hardcore* (smarter opponents, no Rally). Completing a mode earns
a title and a ranch cosmetic.

**Ranch cosmetics as built (Codex, 2026-10-07):** the Ranch tab displays Homeward Leaf (Nuzlocke Survivor),
Crossing Paths (Wanderer of Shuffled Wilds), One Bright Star (One and Only), and Warmstone Promise (Hard as
Hearthstone). These original static pennants use the existing saved titles, display automatically once earned,
and give no bonuses. Unfinished challenges show locked pennants. Earned titles stay honored when more badges
are added; no extra currency, equipped-cosmetic field or daily reward was introduced.

**Reasons to revisit old areas:**
- Rematches: Wardens and Wren can be rebattled at higher tiers that scale to your level (Radical Red lets you
  rebattle gym leaders), with better rewards each tier.
- Rare spawns that only appear in older areas at certain times, weather or after later badges (new variants of old
  creatures, colour variants).
- Area mastery: stars for completing an area's Wilddex, beating its rematch tiers and finding its secrets.
- Ranch jobs and breeding need materials and creatures that live only in specific areas.

**Quality of life** (fan games keep proving these matter): a team-wide XP share toggle, a move relearner in town,
temperament changing (an item, like mints), visible potential grades (already in), reusable lures as a late unlock,
battle speed-up.

**Post-game:** a battle tower with streaks, the region's legendaries, a Hall of Fame record, Champion rematches.

## Eras you walk through: from Game Boy to modern 3D (planned 2026-10-06)
Inspired by the 2026 Pokemon Red/Blue "Gen 1 Recompilation" voxel mod by Dramatic Shape: it keeps the original maps,
events and rules and only changes how the world is drawn and where the camera sits (tilted 3D diorama, third-person,
first-person, and PC VR through OpenXR). The lesson for us: **game logic on a tile map, renderers swappable.**
Our `ART[era]` registry already works this way; the walkable world (T7b) must too.

**The look and the camera grow with the story** (each era unlocked by progress, any unlocked era selectable):
| Era | Look and camera | Mechanics that arrive with it (matching that generation) |
|---|---|---|
| Pocket (start) | Top-down, 4 shades of green, Game Boy feel | Simple: walk, tall grass, trainers who spot you, small bag |
| 16-bit | Top-down full color, shading | Running shoes, day/night clock, berries, ranch |
| HD-2D | Pixel sprites in a lit 3D world, tilted camera, depth of field | Weather, your lead creature follows you, visible wild creatures instead of random grass |
| Diorama | Voxel 3D world built from the same map (like the mod), orbitable camera | Ride creatures, open wild areas, camera control |
| Modern 3D | Third-person camera, full 3D | Big open zones, raids on wild legendaries |
| First-person / VR | Walk it yourself; WebXR headset support as a post-game extra | Photo mode, Wilddex research by observing |

**How it's built (no new tools needed):** one tile map per area, rendered by 2D canvas for the early eras and by
three.js (from cdnjs) for the 3D ones. Creatures in 3D start as our pixel sprites extruded into voxels (the mod's own
trick), so every species works in every era from day one; hand-made models can replace them later. Browsers support
WebXR, so VR is reachable without an engine change.

**In the story:** the region was "faded" long ago; each guardian you befriend restores a layer of the world (color,
then light, then depth). People notice and joke about it:
- Maren: "In my day the world had four colors and we liked it."
- A kid in Larkhaven: "Mom, the corners are round now."
- Wren: "Is it me, or can you see further than you could yesterday?"
- An old fisher who refuses to admit anything changed.
This ties the art upgrades to the plot instead of being a settings menu, and gives each era a story moment.


## T31 as built: the Lighthouse Spire and league rematches (Wildbond v1.3.0)

The league ending opens a west path to a walkable coastal training terrace. `17-postgame.js` owns the Spire
state and trainer themes; it calls the existing battle, dialogue, rematch and ranch egg functions. Floors
use `min(100, 74 + N)`; early/middle/late floor bands cover all eight areas. Named regulars return every ten floors.
Five cleared floors bring a healing rest and two explicit choices. Auto starts subsequent fights but waits
at those choices. Losing, fleeing or leaving ends the climb and keeps earned rewards and best floor.

Save addition: `S.tower = { best: 0, floor: 0, active: false, rest: false, claimed: [], serial: 0 }`, with fresh
and old-save defaults and bounded numeric normalization. A reload retries an unfinished floor with saved health,
or resumes a completed floor's rest; completed rewards cannot replay. The team stays together until the run
ends, including when eggs hatch. A run serial rejects stale callbacks/results. Existing save keys are unchanged.

Floor reward: `180 + 20*N` coins and 2 lures; Auto receives 60% coins (rounded down), 1 lure and the existing
Auto XP multiplier. Tower battles omit the ordinary trainer coin payout, so the reduction applies to the whole
floor reward. Auto use during a fight remains recorded even if switched off before the result. Every tenth
floor grants its first-completion food, title and rare egg once, with identical milestone gifts for Auto.
Lantern seed trains ordinary Wits and costs 90 coins in the existing food controls. Eggs use the ranch's
existing two-day hatch queue. The Journal records best/current floor and explains the existing cap choices.

Each league trainer and Avenne uses the existing `S.rematch` and `S.rematchDay` dictionaries, team evolution
and tier scaling. The day's attempt is saved at battle start, so reloading or losing cannot replay it.
The Spire reuses the league tune and coastal battle backdrop in every existing art era; no shared engine or
art-era changes. No cap change: hard 75 / soft trickle / existing No cap to 100 remain player choices.

Validation: all four browser runners pass, including floor locks/levels, reward accounting, rest healing,
loss/flee/leave, once-only gifts and two-day hatch, Auto reductions, daily rematches, old-save defaults and
unchanged caps. A real command-driven max-level three-creature team completed 30 floors; this verifies the
full run and milestone transitions, rather than pacing for a newly crowned level-75 team. Checked all five
art eras (actual three.js renderer included), phone/laptop/desktop/ultrawide, and existing maps: only the dry
league connection changes outside the new Spire. See docs/lore/wildbond.md for the new names and dialogue.

Entry smoke check: a level-75 Tidewyrm/Bloomcourser/Hushmane team with rarity 1, potential 16, no traits or training, and No cap cleared floors 1-3 before losing on 4 using Focus/Guard/Rally. Its earned rewards and best floor were kept. This is one untrained entry fixture, not a pacing or balance conclusion; stronger ranch-raised teams and a full player playthrough remain part of L7.


### Saltmarsh lighting pass (G2, 2026-10-07)

Saltmarsh's lit eras use a lower, lighter sea-mist layer, cool sky bounce and pale sand bounce, with softer shafts and colour grading. The shared day/night clock still controls shadow direction; player and door lamps stay warm at night. Early art eras retain their existing weather appearance. This is an atmosphere pass, with no changes to weather schedules, encounters, maps or saves. Profile values and comparisons: [Saltmarsh lighting](saltmarsh-lighting.md).
