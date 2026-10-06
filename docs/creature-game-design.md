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
- **v1:** racing (tracks, strategies, the urge burst), a second biome, the first staff.
- **v2:** Frontier expeditions, seasons and the Hall of Fame.
- **v3:** Realmbound bridge: shared module, pets and mounts move onto it, creature adoption.

## Who builds what
- **Claude:** `shared/creatures.js` (genes, breeding, stats, bond), capture and battle feel, the raising
  schedule, balance.
- **ChatGPT:** species and biome data written to this spec, rival tamer dialogue, race tracks, tests.

## Open questions for Evan
1. Name: Wildbond, or something else?
2. Which hook first in v0: battling (as planned) or racing?
3. Battle style: auto-battle with timed commands (planned), or fully turn-based?
4. Art: the same chunky pixel look as Realmbound?
