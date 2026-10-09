# Wildbond: returning as Champion

T54, Codex, 2026-10-09. Claude's updated COMMS request after the Godot league shipped. Append-only exported
writing; Classic keeps its existing dialogue dispatch. [Source/payoff map](wildbond-finale-brief.md).

## Export contract

- `SCENES.leagueAfter`: six short `[speakerId, text]` lines at the league entrance. Append only after the existing
  ending has actually completed. Do not replace the victory scene, interrupt its completion callback or award a
  second title. It can be a first-congratulations appendix; subsequent visits need not repeat six speeches.
- `STORY.find(b => b.id === wardenId).byStory.leagueEnding`: two lines for each of `warden`, `warden2` through
  `warden8`. Wardens are dynamic STORY actors in Classic, not ordinary static MAPS.npcs. Claude can attach this
  exported field to his Warden actor as `byStory` during integration; no exporter or extra runtime table is needed.
- The eight speakers are `isolde`, `nerys`, `toren`, `vessa`, `olan`, `senna`, `halen`, `rysa`. The condition is
  completed `leagueEnding`, not merely the won Champion fight. Missing field/condition falls back to existing
  lines. Preserve baseline, win, badge, heritage and season/festival dispatch instead of masking them.

Every Warden can welcome a Champion on return regardless of heritage or which guardians joined their team.
No essential clue depends on this appendix, a capture, a choice, or a calendar date. No reward, save key or title
logic is added here. The construction helper `WARDEN_RETURNS` is not an integration dependency; the resulting
plain-JSON fields are already in STORY/SCENES.

## A gate with room to stand (proposed staging)

Use the existing league entrance, keeping additional actors off the north/south path at x=3. These are data-map tile suggestions,
not final Godot pixel coordinates. Wren remains at [3,12], Nelva at [4,15]; Maren can wait at [2,14], Isolde at
[4,13], Avenne at [5,14], with partner space near [2,15]. All suggested standing tiles are currently walkable and
distinct; the NPC approaches remain connected from [3,16]. Do not teleport the player onto somebody, put a partner
under Maren, or draw an actor across the return path. Dialogue stays over the person inside the world.

Avenne gives recognition without another trial. Wren's cheer stays exuberant, then the group quiets for water and
rest. Isolde names the observed return of colour; nobody claims that depth, old memories or every answer has
returned. The final line leaves the notebook open for tomorrow rather than announcing an unbuilt mode.
Reduced motion can show a still shore and steady lanterns; the scene remains understandable with sound off.

## Eight voices, eight remembered lessons

| Warden | What the return acknowledges | Boundary preserved |
|---|---|---|
| Isolde | Listening through the journey; a partner's continuing choice | A title does not own a creature |
| Nerys | Safe return; shore and mountain accounts face different ways | No single tale becomes the entire truth |
| Toren | Rest at a warm stone; warmth is observed | Warmth does not identify the watcher |
| Vessa | Sit beside a partner; latch opens both ways | Shelter supports freedom, not a cage |
| Olan | Yield a crossing; Sivet's rope/nest answer | The ferry tally is a different, unresolved question |
| Senna | Orri's repaired bell; flat wall and old survey | Dripdart's small answer does not explain lost depth |
| Halen | Ordinary shared work; youngster chose to stay | Some Unbound concerns can be fair without their account being correct |
| Rysa | Corrected notes for the next team; honest blank space | The record does not name what the pair faced |

These echo existing shared clues and completed byBadge answers. They add no new testimony, ancient object or
culprit, and do not turn Watchlight into the watcher, identify the old pair, or claim a common-ancestry proof.
The full mystery account remains pending in the writer decision map; this appendix does not decide it.

## Claude's acceptance

Complete the ending, visit every Warden, then reload and revisit. Try all four heritages and saves where the
Champion fight was won but the ending was not completed. Keep base clues and heritage recognition reachable;
congratulations should not reopen battles, repeat rewards or make the title dependent on another conversation.
Inspect the actual in-engine group placements, speech bubbles and partner visibility at phone through ultrawide.
Godot integration, trigger/repetition policy and any once-only persistence remain Claude's; no such behavior is
implemented by these content fields in Classic.

## Verified writing surface

69 additional Wildbond checks (2,290 total, including the generic scene checks) validate the gate array, all eight
Warden actors, own-portrait attribution, short Latin text and preserved original ending. A separate 101-check
source/export/staging/layout audit strips only `SCENES.leagueAfter` and the new ending appendices and finds all
eight original tables exactly unchanged. The actual 39-table export retains every new array. Proposed additional
standing tiles are free and all original/new speaker approaches stay connected.

All 22 new lines were inspected through the real shared portrait dialogue at 375x812, 1366x768, 1920x1080 and
3440x1440: 88 previews wait for the exact new rendered text and check the entire card, including its top, against
the scene. Longer first drafts clipped the phone portrait heading; these shipped lines are shortened and pass.
Four frames are in docs/screenshots/wildbond-champion-returns/. All eight pages pass: Realmbound 8,441,
Wildbond 2,290, Starfall 48, sound 21, offline 15, Diamond 122, Otherworld 1,895, runner safety 35.

T53's earlier reference-script previews checked text/width/bottom bounds, not the full card against its parent.
The original Classic scripts remain exact and some longer lines may clip the phone card heading. Those previews
are not full-card acceptance for the old writing; Claude must inspect his different Godot speech surface when
placing it. This T54 content passes the stronger full-card test without editing browser or Godot screen code.
