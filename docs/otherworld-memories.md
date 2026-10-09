# Otherworld: memories and people (T42)

Codex, 2026-10-08. PR #69, for review; no release bump. These are authored rules inside the existing portrait story,
not an AI storyteller or a complete world simulation. The first three lives retain their endings and gifts.

## What travels

Every existing soul memory now has at least one practical use outside its original world. Knowledge travels; a seed,
a charm, a cupboard or somebody else's debt does not. Choices show why they are unavailable. Reading takes no time.

| Memory | Origin | A working use elsewhere |
|---|---|---|
| Tide | Asterhold | At Hearthmere's spring, wait for fear to settle rather than demand water; invite the spirit and share warm water. |
| Oldroot | Asterhold | Ask the cellar roots in Reedlight for shelter rather than cut them; they block the draught. They are not Oldroot. |
| Guild Master | Asterhold | Question the alleged shortage in Veyrin; a public count identifies marked grain and produces evidence. |
| Lantern | Asterhold | After finding the house record, reproduce Mira's charm to clear rot from the storehouse ropes and deliver grain. It does not cure the plague or loosen Blood Oath. |
| Seed | Asterhold | Plant Vesper's own beans beside the stove, remembering warmth. No physical seed is inherited. |
| Root Song | Asterhold | Understand Puddle in Hearthmere. It can also calm the boars in a later Asterhold life, unless the Sword Saint's Instinct has already drawn the blade. |
| Broth | Hearthmere | Cook for Lanthorn's queue or the Ashen house; existing working recipes retained. |
| Thaw | Hearthmere | Free the lower well bucket in Lanthorn, restoring water for the ovens and moving the queue. |
| Shelter | Hearthmere | Tell Isera what an open door meant; she opens her own small grain cupboard as well as the lower rooms. |
| Bell Code | The Ashen Throne | Read the answering water at Puddle's well; existing working option retained. |
| Mercy | The Ashen Throne | Stand with Hesta to bring the outer families inside before Lanthorn closes its gates. The wall ending names the rescued people. |

## People carry the current life

Two people per world have a want and a state derived from the actual choices. No relationship number is shown.

- **Ressa** wants to feed families and keep her privacy. Shared work earns kitchen help. Diverted flour hurts trust;
  returning it restores cooperation. Appraisal still closes her private kitchen in that life.
- **Bren** wants grain and people home. Unloading earns one promised cart journey, which he uses to rescue the
  outer families. Using it settles the debt.
- **Vesper** wants a hearth built together. Pantry, stove or growing work earns her willingness to share her private
  reserve. This can turn a winter with only one warm room into a shared table; warmth and willing neighbors are still needed.
- **Puddle** wants to be a guest. An invitation lets it choose to share spring water. A promise to stay at the spring
  is not redirected into compulsory kitchen work.
- **Kael** wants people safe. Closing their door hurts his willingness to vouch for you. Working beside him repairs
  that hurt; a witness still needs a real record and recognition. Silence and Blood Oath retain their costs.
- **Emmet** wants everyone across, with a witness to what happened. Help at the boats earns a return favor: carry an
  actual copy of the house seals. He cannot invent a record, and the debt settles when it is carried.

Wants and states live at `life.people`, derived from existing flags plus the new decisions' receipts. Loading an old
life derives the same relationships without replaying money or story effects. Rebirth begins with new people; Return
clears their debts and friendships at dawn while keeping only the soul's memories and the protagonist's learned Ashen knowledge.

## Validation and limits

All eight browser pages pass. Otherworld has 1,895 checks, including every single memory with every gift/world,
reachable cross-world actions, real locked/native choices, repairs, debt settlement, legacy saves and Return.
Real browser control checks at 375x812, 1366x768, 1920x1080 and 3440x1440 exercise a seed decision, reload, Puddle's
invitation, Vesper's reserve, an ending, the Between and the carried Shelter decision in a new Ashen life. Before/after
frames and the reserve choice are in `docs/screenshots/otherworld-memories/`. Wide dialogue uses 20-pixel text and
80-pixel portraits after the shared styles load. These are prepared-save checks, not a fresh-player campaign playtest.

No AI service, permanent stat bonus, new save key, gift echo, additional world, version or shared-engine change.
This is an authored first step toward the systemic direction; NPCs do not independently roam or generate events yet.