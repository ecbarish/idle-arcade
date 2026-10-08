# One creature catalogue, richer evolution, gear and tamer abilities

Evan, 2026-10-08: build a larger creature catalogue and use the creatures as enemies in Realmbound too, "so no asset
goes wasted"; evolution with different types and conditions (Eevee's branches, single and triple lines, creatures that
never evolve like Hitmonlee); armour for creatures; abilities on the tamer that enhance or interact with the creature.
Claude's plan below; Evan can change any of it.

## Where we are (checked 2026-10-08)

Wildbond has 81 species in ten families (wolf, cat, hyena, lizard, croc, boar, horse, bird, spider, sprite). **Only 10
evolve, all the same way** (one step at a level: Cindercub becomes Blazefang at 14). Three hybrids come from breeding
(cat + wolf = Lynxhound). Eight are unique guardians. Every creature in the Godot version is drawn from parts by family
(`wildbond-godot/scripts/figures.gd`), and the creature rules are shared in `shared/creatures.js`.

## 1. One catalogue for the arcade

- **One list of creatures** (`shared/catalogue`: names, family, element, looks, lore, where they live in each world),
  exported for Godot like Wildbond's data today. Wildbond is its first user; **Realmbound's beasts come from it** (wolves,
  boars, drakes and spiders in its zones become catalogue creatures drawn in Realmbound's style), and Otherworld and
  Starfall can borrow from it later.
- Fits the shared universe (docs/lore/multiverse.md): the same kinds of creature live in several worlds, a deliberate
  link; each game keeps its own rules (a tamer bonds with them, a Realmbound hero fights them).
- Bodies built from parts mean a new creature is mostly data (colours, proportions, horns, wings, patterns), so a large
  catalogue is affordable.
- **Target:** grow Wildbond from 81 to about 150 over several batches (ChatGPT's W11 starts this), filling every family
  and element.

## 2. Evolution with shapes and conditions

**Shapes** (each line is one of these):
- **Stays itself:** never evolves, and is stronger or stranger for it (higher base stats or a signature move).
- **Two stages** (today's kind) and **three stages** (a long journey with a creature).
- **Branching:** one young creature, several possible adults, chosen by how you raise it (the Eevee kind).
- **Late bloomer:** looks plain for a long time, then changes dramatically under one rare condition.

**Conditions** (a line can use any, and several can combine):
- Level (as now), **trust** (bond level), **time of day** or **weather** (both already exist), **place** (beside
  Emberfall's springs), an **item or gear** worn, **how it fought** (won a battle in the rain, guarded its team often),
  **what it ate** at the ranch, or **its partner** (raised beside a certain creature).
- **Readable, not secret:** once you've seen a creature, the Wilddex records what you've learned ("Maren thinks it
  changes when it trusts you completely"), and people in the world drop hints.
- **Never forced:** when a creature is ready you can say "not yet".

## 3. Gear for creatures

Harnesses, light armour, charms and bands, made at the ranch or found. Each piece does one thing (shrug off burns, a
first strike in the rain, calmer when bonding) and **shows on the creature** (the parts system can draw it). Some
evolutions need a piece of gear worn at the right moment.

## 4. Tamer abilities

The tamer already gives orders in battle (Guard, Rally). Grow that into the tamer's own abilities:
- **Learned from people and Wardens** (Toren teaches Steady: calm a frightened creature mid-battle) and from your
  **heritage** (a coastfolk tamer reads the tide).
- **In battle:** a few orders that help your creatures in your own way, charged by what happens in the fight.
- **In the world:** creatures you trust help you (a strong creature moves a boulder, a water creature carries you across
  a stream), earned through bond rather than taught by a machine.

## Order

1. Evolution shapes and conditions in the Godot rules, with the first branching line and the first three-stage line
   (Claude, with checks), then convert the existing ten.
2. The catalogue file and W11 batches (ChatGPT: data and lore; Claude: bodies and checks).
3. Creature gear at the ranch (after the ranch becomes a place).
4. Tamer abilities with heritages.
5. Realmbound's beasts from the catalogue (when Realmbound moves to Godot, or sooner for the data).
