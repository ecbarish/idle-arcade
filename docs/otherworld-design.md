# Otherworld: design (the plan to follow)

Evan, 2026-10-08: "Give the player the option to choose from a list of options and have the game have branching changes
and effects. Worlds greatly differ across anime, why not have it happen here; that also improves replayability and the
desire to engage." Rebirth happens both by choice and on death. Built in the browser first (docs/research/decisions.md).
Background: docs/plans/otherworld.md (stages O0-O5) and its research. Principles: docs/wildbond-plan.md (games feel
like games; they apply to every game) and docs/VISION.md §9 (choices that matter).

## Not predetermined (Evan, 2026-10-08): systemic first, an AI storyteller later
"I worry an anime game is too hard to tackle because it would more benefit from an AI token interaction where things
can change rather than be scripted or planned ... I do not want things to be pre-determined by any means."
Direction (Claude's recommendation, pending Evan's nod):
1. **A systemic world.** Like Dwarf Fortress, RimWorld, Crusader Kings and Wildermyth: people with traits, goals,
   relationships and memories; factions, places and needs; events that grow out of that state (a rival remembers, a
   saved town prospers, a companion with a grudge may turn). Gifts change rules, not just unlock scenes. The
   authored Asterhold story becomes the seed and the tutorial life, not the whole game.
2. **An AI storyteller on top, as an experiment.** A language model voices characters and narration inside the
   rules (the rules decide what is true; the model only describes and converses), with authored lines as the
   fallback. Try a free in-browser model first (runs on the player's computer: free, private, a large download,
   weaker); a paid API needs a server or the player's own key and requires Evan's approval before any cost. No paid AI service is used in these authored lives.

## The experience
Your old life ends. You wake in **the Between**, a quiet place outside every world, where a keeper of souls (the
**Archivist**, warm, a little tired, very curious about you) offers you a new life. You choose **which world** to be
born into and **one gift** to carry. You live that life: arrive, find your feet, meet a companion, make a few choices
that truly branch, and reach an ending that belongs to the choices you made. Then you return to the Between, keeping
some **soul memories**, and choose again: a different world, or the same world walked differently. Each world is its
own anime genre, with its own tone, rules and people; what you learned in one life can open doors in another.

## The worlds (a list that grows)
Each world is a complete short story (a life of about 20-40 minutes at first), with its own tone, threat, companion,
gifts and endings. The Archivist offers three at a time; more appear as you live more lives.
| World | Tone (anime it echoes) | The life | Companion | Its gifts (each a strength with a cost) |
|---|---|---|---|---|
| **Asterhold** | Adventurous fantasy (Mushoku Tensei, Konosuba's guild life, Frieren) | Register at the adventurers' guild at rank F; a beast tide is coming to the frontier town of Lanthorn | Mira, a sharp-tongued apprentice mage who needs a partner for her guild test | Appraisal (see the truth of things; people find it unsettling), Pocket Space (carry anything; you can't refuse a job), Sword Saint's Instinct (fight like a master; you can't hold back) |
| **Hearthmere** | Cozy slice of life (Ascendance of a Bookworm, Restaurant to Another World) | Inherit a shuttered lakeside inn in a village of spirits; a long winter will close the passes | Puddle, a shy water-spirit who lives in the inn's well | Hearth Cooking (food that heals hearts; it takes time), Spirit Speech (talk to spirits; the living find you odd), Green Thumb (anything grows; weeds too) |
| **The Ashen Throne** | Dark and dramatic (Re:Zero, Overlord, Berserk's grimness without its cruelty) | Wake in a dying empire's capital during a plague, as a servant in a noble house about to fall | Kael, a disgraced knight with his own reasons | Return (when you die you wake at dawn with your memories; the world remembers nothing, but it hurts), Blood Oath (bind a promise; break it and pay), Silence (be unseen; be forgotten) |
| Later | The Seven Towers academy, the Endless Tower dungeon climb, the Sky Archipelago, reborn as a monster (a slime, a spider), a game-like world with a status screen everyone can see | | | |

## A life, step by step (the same shape in every world)
1. **The Between:** the Archivist, the list of worlds (with a one-line feel and a picture of each), a gift draft for
   the chosen world (three offered, pick one), a name and a look.
2. **Arrival:** a scene that sets the world's tone in the first minute (Asterhold: waking in a hay cart outside the
   frontier town as a guild bell rings; Hearthmere: a key on a string and an inn full of dust; Ashen Throne: the toll
   of plague bells and a mistress shouting your name).
3. **Finding your feet:** a few places you walk between (a small map), people with their own lives, a home base.
4. **Three choices that branch:** each changes what happens next and is remembered (who you trust, what you protect,
   what you give up). Your gift opens options others don't have, and its cost closes some.
5. **The climax:** the world's threat comes due; how it plays depends on your choices and your gift.
6. **An ending** (at least three per world: hopeful, bittersweet, strange), then a short epilogue of the people you met.
7. **Back to the Between:** see what your soul remembers; choose the next life.

## Rebirth (both ways, as Evan chose)
- **By choice:** after an ending, return to the Between and keep a few **soul memories** (knowledge, not power: the
  name of a traitor, a recipe, a song a spirit taught you) that open new options in later lives, plus one small
  echo of your gift.
- **On death:** dying ends the life early. You return to the Between with fewer memories, but death itself teaches
  something (the Archivist notes how you fell). The Ashen Throne's *Return* gift is the exception: death sends you
  back to that life's dawn instead.
- A preview always shows what you keep and what you lose before a chosen rebirth.

## Presentation (games feel like games)
- Scenes drawn in code in each world's own style: soft greens and lantern light for Hearthmere, bright banners for
  Asterhold, ash and candlelight for the Ashen Throne; the Between as a starlit library of drifting lives.
- People speak in the scene with portraits (shared/dialogue.js), choices are moments in the scene, not forms.
- The **status window** (the blue screen of isekai stories) is a real thing in some worlds: in Asterhold your gift
  shows it; in others you only have your journal. Diegetic, and a joke the genre will recognise.
- Walk between a few places on a small map; the shared world kit (shared/world.js) can make towns walkable later.

## First build (O0, Claude)
1. The Between: the Archivist, the world list (all three shown; Asterhold playable first, the others "still being
   woven" until built), the gift draft, name and look.
2. **Asterhold, one complete life:** arrival, the guild and Lanthorn, Mira, three branching choices, the beast tide, at
   least three endings, the epilogue, soul memories and rebirth both ways.
3. Then Hearthmere and the Ashen Throne as their own complete lives (O0b, O0c), then soul memories that matter
   across worlds (O2).
Save key `otherworld-save-v1`; checks in tests/otherworld.html (every gift and branch reaches an ending, no dead ends,
save and reload around choices, rebirth keeps exactly what the preview promised).

## Open questions for Evan (defaults in brackets)
- Can the player be reborn as something other than a human (beastfolk, elf, a monster)? [Later worlds, yes.]
- Romance: companions can become close; romance between adult characters, written tastefully (VISION §9)? [Yes, later.]
- How long should one life be? [20-40 minutes now; longer lives as worlds grow.]

## Third browser life, ready for review (2026-10-08)

Hearthmere is ready in PR #63; the Ashen Throne is ready in PR #65. All three approved worlds now have complete authored lives on the stacked branch. See [the Ashen implementation record](otherworld-ashen.md) for canon, gift costs, Return save semantics, outcomes and validation. These compact lives establish the narrative loop; systemic skill progression and walkable exploration remain later work.
