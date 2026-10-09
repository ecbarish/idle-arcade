# Hollowecho Hills: build brief for Godot

WB3.5 part 1 / T47, 2026-10-09. For Claude's WB3.2 build; documentation only. Stillreed is already built. This gathers existing browser/exported canon and suggests how to stage it; it does not add a story, encounter system, cave dungeon or reveal.

## The feeling and the promise

After Stillreed's open water, the trail folds between green hills and grey outcrops. You can hear a place before seeing it. Hollowecho rewards listening to your partner, and changing a tidy plan when the world disagrees. Shade is shelter here. Brightness is not a promise of safe footing.

The route should feel occupied by people caring for one another: a bell keeper who answers returning teams, a surveyor who lets a creature correct his map, a bell mender who can explain one strange noise without explaining the mountain. No timed dusk obligation, blind audio puzzle or punishment for being unable to hear. The bell's meaning comes from people and visible reactions too.

**Source of truth:** [Area 6 canon](wildbond.md); [T40 clue ledger](wildbond-threads.md#areas-58-clue-placement-t40-codex-2026-10-08); browser [00-data.js](../../games/wildbond/js/00-data.js), [11-maps.js](../../games/wildbond/js/11-maps.js), [10-sound.js](../../games/wildbond/js/10-sound.js), [12-walk.js](../../games/wildbond/js/12-walk.js) and [06-scene.js](../../games/wildbond/js/06-scene.js). Use the existing exported rows and dialogue rather than transcribing this prose into game code.

## Route and places: the exported contract

Map ID `hollowecho`, display name **Hollowecho Hills**, 30 columns by 14 rows. Coordinates below are zero-based tiles, not pixels. Rows, collisions and symbols come from `MAPS.hollowecho`; its existing art already has a hamlet corner, winding trail, irregular grass, outcrops and cave mouths. Keep a readable west-to-east main route; supplies and clues make optional short detours.

| Anchor | Source location / destination | What matters |
|---|---|---|
| Arrival | start `[1,9,'right']` | Enter from Stillreed after the Reed Badge; show the broad trail before asking for exploration |
| West return | west edge; exit arrives in Stillreed at `[28,9]` | An ordinary return route, not a one-way chapter |
| Hamlet / bell | Veslin `[6,6]`, Orri `[5,5]` | Each person has room beside the path; avoid the old paddock-blocking problem |
| Carved sign | `[7,5]` | Directions, ring/answer custom, old steps carved where the present wall is flat |
| Survey route | Narro `[16,6]` | Measuring cord and rock-framed passages; current map is revisable |
| Warden | `[23,4]` | Senna waits by a cave mouth; physical approach and room for a partner |
| East continuation | east edge; exit arrives in Sunthread at `[1,9]` | Echo Badge required; if the Godot area is not built yet, explain that honestly without consuming the badge |
| Supplies | `he1` `[3,5]`: 8 berries; `he2` `[19,10]`: 6 lures; `he3` `[27,8]`: 500 coins | Existing one-time pickups, same IDs/rewards; no daily collectible chore |

Exit coordinates describe where the player lands in the **destination** map. Do not move the west doorway to `[28,9]` in Hollowecho by confusing these with local coordinates. Cave mouths are existing scenery/route texture; a new interior is beyond this brief.

**Staging suggestion, not new canon:** make the three spaces recognisable at a glance: the hamlet has hanging bells and a tool roll; the survey passage has measuring cord and chalk; the Warden's clearing has flat resting stones. Decorative additions need footprints and heights, clear approaches and contact shadows. Use the real data map, not a background picture. Don't turn the old carved steps into newly usable stairs yet: lost depth is a clue, and its restoration belongs to the later payoff.

## People and their voices

| Person / ID | Voice and existing interaction | Content to preserve |
|---|---|---|
| Veslin / `veslin` | Warm bell keeper, thinks of supper and safe returns | Friendly trainer; one ring means someone is home, and somebody answers |
| Narro / `narro` | Practical cave surveyor; modest about being corrected | Friendly trainer; his Dripdart found safer footing, so he changed the map |
| Orri / `orri` | Bell Mender; careful about what evidence proves | Three shared clues, four heritage reactions, Echo Badge replacement conversation |
| Wren / `wren` | Competitive but willing to admit she was wrong | Her partner refuses a bright shortcut; she erases her arrow before the rematch |
| Warden Senna / `senna` | Quiet surveyor; listens before committing | A partner's warning can outweigh a good plan; Echo Badge; ring before dusk and answer others |

Show conversations beside the people in the world, using the existing portrait/speech system. The field book keeps the record; it does not become the location where these things happen. Preserve `{name}` interpolation and existing trainer after-battle lines. Don't make Orri another trainer.

## Encounters and pacing: preserve IDs and rewards

`BIOMES.hollowecho.lv = [58,64]`, prerequisite `reed`. Entering with five badges retains the existing cap 60; winning `warden6` grants `echo`, cap 65. The stated area band is not a new cap or an instruction to raise every trainer's level.

| Existing encounter | Local exploration threshold | Team / reward |
|---|---:|---|
| `rival7` | 6 | Ledgewhisk 58, Hushmane 60, `$rival` 61; existing chosen rival partner substitution |
| `undertone` | 14 | Wild tuple `['undertone',63,4]`; unique guardian, outside ordinary wild encounters |
| `warden6` | 24 | Flintroot 58, Bellmote 59, Hushmane 60; Echo Badge, cap 65 |
| Veslin | Route trainer, sight 1 | Bellmote 58, Umbrelace 59 |
| Narro | Route trainer, sight 1 | Dripdart 60, Flintroot 61, Hushmane 62 |

**Known documentation discrepancy:** the Area 6 paragraph in wildbond.md says Senna's team is 60/61/63. Live browser data and export use **58/59/60**. This brief preserves the implemented team and flags the stale paragraph instead of silently retuning it. An intentional rebalance should be a separate decision/check.

Use the existing guardian lure/calm, knock-out retry and unique-companion rules. The final number in the wild tuple is existing encounter metadata; don't invent a new rarity rule from it. Godot exploration counters are the existing way to reach these story beats; physical staging must not bypass their thresholds or replay rewards.

## Species: all nine, seven ordinary wild entries

| ID / name | Element / body family | Wild weight or other route |
|---|---|---|
| `hushpup` Hushpup | Shade / hyena | 24; evolves into Hushmane at 60 |
| `hushmane` Hushmane | Shade / hyena | Evolution and authored teams; no ordinary wild entry |
| `umbrelace` Umbrelace | Shade / spider | 18 |
| `flintroot` Flintroot | Stone / boar | 18 |
| `ledgewhisk` Ledgewhisk | Stone / cat | 18 |
| `bellmote` Bellmote | Radiant / sprite | 16 |
| `dripdart` Dripdart | Tide / lizard | 14 |
| `chimespark` Chimespark | Radiant / sprite | 3; uncommon encounter, not guaranteed on arrival |
| `undertone` Undertone | Shade / hyena | Unique, large guardian; story encounter only |

Weights are relative table entries, not percentages. Existing dex observations make the ecology specific: warning silk beside unsafe ledges, loose stone cleared before resting, a cat feeling for broad footing, a sprite lighting a homecoming bell, a lizard answering drops. Keep those behaviours in the picture when practical without adding required field abilities or species mechanics.

## Thread checklist: shared clues first, heritage perspective after

These are **already placed** in T40; no new clue text is introduced by this brief. Reuse the exact exported lines. The [ledger](wildbond-threads.md) owns their interpretations.

1. Sign `[7,5]`: older carved steps rise where today's wall is flat. Evidence of lost depth, not evidence for which opponent caused it.
2. Orri base line 1: people call the unexplained third ring the watcher; Orri explicitly declines to endorse that account. Local belief must not become narration.
3. Orri base line 2: rubbing of two hands around a paw, same split-loop border as Sivet's ferry tally. Care, an old bond and related witnesses remain possible.
4. Orri base line 3: Senna found a warm stone pocket. Neither calls it a footprint. Sleeping and keeping watch are both possible.
5. Senna introduction (T40 appended line): old survey shows a ledge; her partner steps wide of the present flat wall. Preserve the observation without explaining the memory.
6. Orri after Echo (`byBadge.echo`): a Dripdart tapped a loose bell tongue in runoff; Orri fixed it. This answers the third-ring mystery. The warm pocket is **farther in** and remains unexplained. Do not imply the repair identifies Toren's watcher.

Orri's `byHeritage` keys are `farm`, `coast`, `highland`, `wander`. Append the selected reaction using the existing once-per-person Godot heritage pattern; retain essential shared clues and the badge payoff. Farm recognises the harvest/warning loop; Coast compares a paw-between-hands verse with sea/stone variants; Highland hears disagreement about the watcher staying or sleeping; Wander offers another reading of the rubbing. These are perspectives, not four separate truths or exclusive story routes. Veslin and Narro have no Hollowecho heritage additions in the current data; don't infer missing lines from this brief.

Unresolved: the fading's opponent, the old pair's identities, the watcher's identity and the Unbound leader's intent. Hollowecho supplies observations and a small payoff, not the final answer.

## A memorable moment: the answering bell

**Recommended staging of existing events:** the arrival establishes the bell and someone answering it, with visible movement for players with sound off. Wren learns to listen at the wrong shortcut. Later Undertone's low call guides the separated group back; let each answering note coincide with a traveler moving into view. It waits for their reunion before approaching the player's partner. Orri's repaired third ring is the smaller echo of the same lesson: attend to the real creature instead of the first story someone told you.

Keep the player in control and give important beats time to be read. No flashing sound visualization, automatic battle chain, forced camera sweep with reduced motion, new reward or hidden timed input. This is staging of existing narration, not a new interactive bell puzzle or additional traveler dialogue.

## Light, sound and weather

Existing palette: sky `#7c9190` / `#c5cfb9`, hills `#657c60`, ground `#8c8c80`. Clear and mist alternate (`['clear','mist','clear']`); low lavender-grey mist stays beneath visible faces and paths. Existing battle backdrop is peaks/stones with fog; preserve the connection between field and battle. Cave shade should feel protective rather than erase navigational contrast.

Browser `TRACKS.hollowecho`: original 72 BPM pulse lead, separated calls and answering fragments. Godot may use its licensed music inventory, but should keep that roomy call-and-answer feel and credit the chosen track. A bell, drops and moving air can carry the area's personality without a constant loud loop. Respect Off / effects / music settings; no clue requires hearing a pitch. This brief supplies no new tune or downloaded asset.

## Build acceptance (Claude's engine checks and real play)

- West connection works both ways; Reed prerequisite; continuous, visible path to all three people, sign, supplies and Senna. No NPC, partner or decorative object blocks a one-tile route.
- East requires Echo; explain Sunthread's availability truthfully while its build is pending. No teleport menu replacing walking.
- All nine species retain IDs, families, evolution and guardian uniqueness; seven wild weights and encounter thresholds match the export. Existing old saves load; rewards and heritage reactions don't repeat after reload.
- All five shared clues are reachable by any heritage. Echo conversation solves the loose-bell question while retaining the warm pocket mystery. No final cause or faction motive is asserted.
- Wren's partner and returning group have visible space; people move rather than occupy each other. Undertone waits for reunion. Text stays readable with music off and reduced motion.
- Play the route from a five-badge save and return west; retry guardian/warden as existing rules allow. Check physical layout, speech and battle at phone, laptop, desktop and 3440x1440. These engine checks belong to Claude; this document does not claim they ran.

## Verification of this brief

A fresh, isolated localhost browser loaded the real data/map scripts. Its read-only inventory confirmed the 30x14 map, three NPC locations/teams, sign, destination coordinates, three supply IDs/rewards, seven wild weights, three story IDs/thresholds/teams, four heritage keys and weather. The completed document was compared against that runtime inventory, including the Senna level discrepancy. All eight browser pages pass. No browser/Godot code, exporter, save or version changed.
