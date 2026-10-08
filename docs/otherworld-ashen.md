# Otherworld: the Ashen Throne (OW0c)

Codex, 2026-10-08. PR #65, stacked on #64 (which includes Hearthmere in #63).
This is the third authored browser life in the approved Otherworld design. No game version bump.

## Design

Veyrin is a capital during a plague. You wake as a servant in House Ardel, whose crest will be taken down.
Kael, the Knight Without a House, refused to shut its door on families. Lady Isera has to decide what her house
means without its name; Rulvek keeps its records; Emmet lights the quay. Their crisis is answered through food,
shelter, truthful records and a safe crossing. Taking down a crest does not cure the city.

Three authored days advance with scenes, never a clock. The house, store and quay change with your choices:
open doors, waiting families, carried sacks, a public record and the missing crest. Dialogue and locked choices
stay over the world. The original code-drawn art uses candlelight and ash, with reduced-motion support.

| Gift | Opens | Costs and recovery |
|---|---|---|
| Return | Death rewinds to the servant's bed; what you learned stays with you. | The pain is remembered in dialogue. Supplies, work and friendships reset. After returning, you can deliberately leave this dawn. |
| Blood Oath | Your spoken shelter promise binds another house oath at the store. | Closing the lower rooms breaks it: carrying beds and the shelter ending close. Directing families to the boats remains available; the epilogue lets the thread loosen through smaller promises. |
| Silence | You see the hidden record and can keep lamps lit on closed streets. | Kael forgets your face. Work beside him and say your name to recover recognition, or accept an unnamed life tending the lamps. |

No gift requires death or a bad ending. Shelter and river rescue remain reachable with each fresh gift.
The text tells you why a closed choice is closed. A scoped Otherworld style also keeps the first disabled
choice readable when the shared dialogue's first-button highlight loads later.

## Outcomes and knowledge

Five final outcomes: The House With No Crest (hopeful), The Record in Daylight (bittersweet), Lanterns Across
the Water (hopeful), The Unnamed Lamplighter (strange) and A Dawn You May Leave (bittersweet, Return's voluntary
exit). The Closed Passage is a sixth end node: a normal death for Oath/Silence, a rewind for Return.

The two new soul memories are the quay bell code and Kael's mercy. Each ending has an explicit keep list,
shown by the existing rebirth preview. Bell knowledge opens a real additional approach to Puddle in Hearthmere;
Hearthmere's broth opens an Ashen shelter route and its thaw memory adds recognition of safe water.
No memory grants a blanket stat upgrade. No romance or skill-XP system is implied by this slice.

Return's local knowledge is separate from soul memories. Reading the store record survives a rewind and lets
you place a public copy next time; touching the store mark during a death learns only its location.
A rewind retains identity, gift, carried memories and learned local knowledge. It resets flags, entry receipts,
silver, Status access, day and ending. It neither records a completed life nor grants a new soul memory.
Saving during the death scene resumes that one rewind. Saving after it resumes the new dawn. A stale callback
cannot rewind a replacement life. Return has no gameplay limit on attempts; only the displayed counter is bounded.

## Scope and validation

Production changes: new js/05-ashen.js, one script tag and a scoped disabled-choice style in Otherworld.
No shared engine, save-key, hub schema, Godot, preview-build, sound or version changes. Existing lives/history
load with defaults. This is a compact authored life, not the later systemic skill progression in the long-term plan.

Browser checks exercise all gifts with representative carried memories and all finite authored branches;
dedicated runtime checks exercise repeated Return cycles, pending-death reload and voluntary exit. The graph
traversal treats end nodes as endpoints; it does not pretend to enumerate infinitely repeated dawns.
All eight test pages must pass, with exact save/hub restoration and no page errors.
Actual portrait/button playthroughs cover three fresh-gift shelter endings, broken-Oath rescue, both Silence
recognition outcomes, Return death/reload/exit and the cross-world Puddle option at 375x812, 1366x768,
1920x1080 and 3440x1440. Screenshots: screenshots/otherworld-ashen/ (before/after world picker, gift costs,
final choices, broken oath and returned dawn at each size).

## An idea

A later life could remember a person you helped, not just the fact you learned: recognize Kael's way of holding
a door in someone from another world. Keep it a small choice with a human response, without establishing a
single cosmic explanation for every world or turning repeat lives into a power grind.
