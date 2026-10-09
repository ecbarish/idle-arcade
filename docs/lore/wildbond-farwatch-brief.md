# Farwatch Reach: build brief for Godot

WB3.5 part 2 / T49, 2026-10-09. For Claude's WB3.4 build. Existing browser/exported canon with proposed staging;
no new league, island route, encounter, clue or explanation of the fading. Sunthread's companion brief is
[wildbond-sunthread-brief.md](wildbond-sunthread-brief.md).

## The feeling and the promise

The gathering gives way to an exposed bluff, then a harbor where people count returning partners before putting
the lanterns down. Farwatch is the last area before the league. The nearly finished journey should be present in
Wren's corrected notebook and Rysa's willingness to change her own tide estimate. Confidence becomes something
you can share responsibly. Fog asks people to answer one another; it is not permission to hide the route.

Source of truth: [Area 8 canon and finale](wildbond.md), [T40 clue ledger](wildbond-threads.md#areas-58-clue-placement-t40-codex-2026-10-08),
[00-data.js](../../games/wildbond/js/00-data.js), [11-maps.js](../../games/wildbond/js/11-maps.js),
[12-walk.js](../../games/wildbond/js/12-walk.js), [10-sound.js](../../games/wildbond/js/10-sound.js) and
[06-scene.js](../../games/wildbond/js/06-scene.js). Import exported rows and exact lines rather than this prose.

## Route and places: the exported contract

Map ID `farwatch`, **Farwatch Reach**, 30 columns by 14 rows. Zero-based tiles. The rows contain a stone-framed
lookout, ledger-side buildings, sandy harbor and pier in solid water. Distant islands remain scenery.

| Anchor | Source location / destination | Preserve |
|---|---|---|
| Arrival | `[1,9,'right']` | From Sunthread with Loom; visible main trail |
| West exit | local `[0,9]`; destination Sunthread `[28,9]`, left | Ordinary two-way return |
| Lookout recorder | Delka `[9,6]` | Friendly battle and corrected records |
| Return recorder | Ceryn `[18,3]` | Shared witness accounts, four heritage lines, Horizon payoff |
| Warden | Rysa `[20,3]` | Physical approach to the ledger; room for both teams |
| Harbor keeper | Sivren `[20,8]` | Practice beside harbor; dry bench and returning lantern |
| Lookout sign | `[14,5]` | Route guidance, crossed-out note and incomplete copied account |
| Harbor sign | `[23,8]` | Answer the lantern; rest; islands are not a marked route |
| North exit | local `[12,0]`; destination League `[3,16]`, up | All eight badges, not just Horizon |
| Supplies | `fw1` `[3,4]`: 8 lures; `fw2` `[12,10]`: 8 fish; `fw3` `[26,10]`: 8 berries | Existing one-time IDs, including pier pickup |

Do not confuse destination arrivals with local exit tiles. In particular `[3,16]` is in the League, outside
Farwatch's 14 rows. Preserve the data's north connection rather than guessing that the pier opens onward.
The east water is solid and has no island exit.

**Staging suggestion, not new canon:** distinguish the exposed lookout, record-keeping corner and protected
harbor by silhouette and light. Put a visible open ledger by Rysa and a dry bench near Sivren. Mooring cloth,
low shore lanterns and a short pier make the return leg recognisable. Give objects footprints, correct heights
and contact shadows; keep Ceryn and Rysa separated. A painted inlet can illustrate Ceryn's existing account if
staged later, but a painting is not a traversable lower coast or evidence of who caused the fading. No new inn
service or island travel follows from the description.

## People and their voices

| Person / ID | Voice / existing interaction | Preserve |
|---|---|---|
| Delka / `delka` | Recorder, learns from changing plans; trainer | Chartwing checks wind, Moorweft footing; a place for corrections |
| Sivren / `sivren` | Harbor keeper, counts every partner; trainer | Rest for teams going to and returning from the league |
| Ceryn / `ceryn` | Careful witness keeper; refuses a convenient conclusion | Three shared accounts, Horizon replacement and four heritage perspectives |
| Wren / `wren` | Competitive friend, candid about mistakes | Shares corrected route notes and recalls Larkhaven; intends to win |
| Rysa / `rysa` | Welcoming recorder, leads by admitting error | Corrects her own estimate, tests responsibility, awards eighth badge |

Keep `{name}` and after-battle dialogue. Ceryn is not another trainer. Conversations happen beside world
positions, with records in the book afterward. Rysa's lines already set up the league; do not promise a
playable Godot finale before its build exists.

## Encounters and pacing: preserve the implemented teams

`BIOMES.farwatch.lv = [66,72]`, prerequisite `loom`. Seven badges give cap 70; winning `warden8` grants
`horizon`, completing eight badges for cap 75. Story thresholds retain the existing local exploration rules.

| Encounter | Local explores | Team / result |
|---|---:|---|
| `rival9` | 6 | Chartwing 68, Inkwhisk 69, `$rival` 70; existing rival partner substitution |
| `watchlight` | 14 | Wild tuple `['watchlight',71,4]`; unique guardian |
| `warden8` | 24 | Keeljaw 68, Moorweft 69, Soundhowl 70; Horizon Badge |
| Delka | Route trainer, sight 2 | Chartwing 68, Moorweft 69 |
| Sivren | Route trainer, sight 2 | Keeljaw 69, Buoyglint 70, Shoalpup 70 |

**Stale lore:** Area 8's older Rysa paragraph gives 69/70/72. Actual browser/export data is **68/69/70**.
Preserve that team; intentional retuning needs a separate balance decision. The original post-game Farwatch
proposal toward 100 was superseded by area 8 at 66-72. Do not resurrect it while porting this route.

The older area paragraph also calls the League/post-game future work. Subsequent T30 and post-game sections
record the already-built **Classic** finale. That does not mean the Godot finale is ready. Preserve Farwatch's
existing League link and all-eight-badge condition; if that destination is not yet built in Godot, explain its
availability honestly and leave ordinary return paths open. This brief does not port League battles.

Watchlight retains existing lure/calm, uniqueness and knockout retry. The tuple's final number is existing
metadata, not an instruction to invent a rarity rule. It stays outside the ordinary wild table.

## Species: nine represented, seven ordinary wild entries

| ID / name | Element / family | Current encounter route |
|---|---|---|
| `shoalpup` Shoalpup | Tide / wolf | Weight 24; evolves to Soundhowl at 68 |
| `soundhowl` Soundhowl | Tide / wolf | Evolution and Rysa; no ordinary wild entry |
| `keeljaw` Keeljaw | Tide / croc | 18 |
| `chartwing` Chartwing | Gale / bird | 18 |
| `moorweft` Moorweft | Stone / spider | 16 |
| `inkwhisk` Inkwhisk | Shade / cat | 16 |
| `buoyglint` Buoyglint | Radiant / sprite | 14 |
| `isleglimmer` Isleglimmer | Radiant / sprite | 3; uncommon, not unique |
| `watchlight` Watchlight | Radiant / sprite | Unique large guardian, story only |

Weights are relative table entries, not percentages. Keep the ecology about safe returns: waiting paws, planks
nudged to shallows, a bird checking air, silk catching loose pebbles, a cat following corrected ink and light
marking sheltered landing. These observations do not add a required field ability or a harbor management system.

## Thread checklist: a page left blank

Already placed in T40; reuse exact exported lines and retain their attribution. No new clue is added here.

1. Sign `[14,5]`: TWO FIGURES / ONE SHADOW is a copied incomplete account. Missing lines are deliberately left
   blank; it does not establish fusion, the opponent or the order of cause and effect.
2. Ceryn base 1: some say a circling dusk light waits for the lost pair. Ceryn counts boats before endorsing it.
3. Ceryn base 2 and Rysa's appended introduction: the witness stood behind the shadow and the page ends before
   describing what the pair faced. A flash might hide rescue or a blow. Keep those interpretations open.
4. Ceryn base 3: unbroken old paint shows a lower shore. Coastal change and lost depth are both possible;
   a picture does not identify a culprit or restore traversable depth.
5. Ceryn `byBadge.horizon`: Watchlight guided a Keeljaw tangled in torn mooring cloth; keepers free it, answering
   the circling-light question. The lost pair remains a separate, unresolved account.

Ceryn's existing `farm`, `coast`, `highland`, `wander` lines append with Godot's once-per-person heritage pattern.
Farm compares the next morning with a shore account ending at a flash; Coast questions whether the split-loop
mark names the reader; Highland suggests differently facing witnesses; Wander preserves an unfinished copy
alongside an attributed invented ending. Perspective is recognition, not proof or a locked route to essential
facts. Delka and Sivren have no new Farwatch heritage lines in the current data.

The fading's opponent, old pair identities, watcher identity and Unbound leader's intent remain undecided.
Watchlight's name and light must not turn it into Toren's watcher by implication. Winning Horizon solves a small
harbor problem without requiring guardian capture or answering the larger mystery.

## A memorable moment: answer before coming ashore

**Recommended staging of existing scenes:** establish shore lanterns visibly, then let Watchlight wait above
the inlet until the returning team answers. Harbor keepers count every partner before lowering the lights.
Only then does the guardian invite the player's team closer. Later, Rysa's plainly crossed-out estimate echoes
Wren's corrected notebook. After a bond, the keepers continue lighting the approach themselves: community care
does not disappear because its guardian walks with you. This stages existing narration, without new timed
signals, mandatory sound cues, boat controls or a reward puzzle. Scenes wait for the player; reduced motion
avoids forced camera sweeps and flashes.

## Light, sound and weather

Palette: sky `#8caebe` / `#dce5db`, hills `#748b88`, ground `#aab29a`. Weather is
`['clear','mist','clear','mist']`; keep faces, signs and walking edges readable in fog. Warm lamps gather around
mooring posts; cool open air marks the bluff. Existing battle backdrop: ruins/stones, water true, fog `.35`.
Browser original `TRACKS.farwatch`: 86 BPM triangle, spacious D-major phrases over D-Bm-G-A. Godot may use a
licensed track from its inventory with the same room for sea and answering lights; credit it. No download or new
music accompanies this brief. Sound off remains usable; no puzzle requires seeing through unreadable fog.

## Build acceptance and verification

- Loom permits arrival; west return, north approach, both signs, supplies, Ceryn, trainers and Rysa are reachable.
  Water stays solid, pier stays connected, decorations/partner never cover narrow approaches.
- North requires **all eight badges**, preserves destination `[3,16]`, and explains a pending League build honestly.
- Nine species, seven weights, three story IDs/thresholds, trainer/Warden teams and cap match current export.
- All essential clues remain shared; four recognition variants and Horizon replacement survive reload once-only.
- The small mooring answer leaves the lost pair open; Watchlight does not become the watcher or fading's cause.
- People count returns visibly with sound off. Keeper lights remain after the guardian joins; no guardian capture
  is required for normal progression or the eventual finale.
- Claude should play from a seven-badge save, retry guardian/Warden, return west and reload, then inspect phone,
  laptop, desktop and 3440x1440. This document does not claim those Godot checks have run.

The read-only isolated localhost inventory confirmed map/coordinates, people/teams, signs, supplies, both exits,
wild table, exact story IDs/thresholds, appended clues, all four heritage keys, weather, track and backdrop.
All eight browser pages pass. Browser data, engine, exporter, Godot, save data and versions are unchanged.
The real 39-table export matched the live inventory exactly, with no missing or dropped-code warning. Seventy-three handoff checks across both briefs verify source tables, documented IDs/species and actual shortest-path reachability to people, signs, supplies and exits. No Godot JSON was written.
