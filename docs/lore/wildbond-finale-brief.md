# Wildbond: the league, the return, and the unfinished page

WB4.4a / T53, Codex, 2026-10-09. For Claude's WB4.1/WB4.3 work. **Writing handoff only; no Godot changes.**
[Script pack](wildbond-finale.json), [thread ledger](wildbond-threads.md), [writer decisions](../proposals/wildbond-final-reveals.md).

## What this ending can promise

The Returning Light League concludes the badge journey. Wren recognizes your work and her own disappointment;
the four courts test listening, shelter, shared work and honest records; Avenne recognizes the whole team.
The existing ending restores colour and leaves the reason for the fading as an older story. That is a complete
emotional ending for the journey, but **not** the resolution of every mystery or proof that depth has returned.
The deeper finale requires WB4.2 and the ledger's still-open truths. Do not turn winning a battle into defeating
an unidentified ancient opponent. The league is a place of earned recognition, not the missing historical witness.

## Pack and source authority

`encounters` copies all six current `STORY` league entries verbatim, including teams, dialogue, victory lines,
IDs and order. `ending` copies `SCENES.leagueEnding` verbatim. Source main revision: `3d56651`; no browser data
was edited. These tables already survive the existing exporter. This pack is a review reference, not a new
runtime table or replacement for Claude's current export. Reconcile against current main before integration.

`optionalScenes.homecoming` contains four new lines for Maren and Wren in Larkhaven: rest, wrong turns, space for
corrections, and choosing the next road together. They introduce no mystery clue. `optionalScenes.correctedClosing`
is a proposed replacement for the old final narration that says more post-league adventures are coming. Classic
already has the Spire and daily rematches, but Godot may not: the proposed line promises only revisiting roads
and the ranch. It does not announce any unbuilt Godot feature. Neither optional scene is integrated here.

## Place the people, not a lecture

| Order | Source ID / speaker | League map position | Story purpose |
|---|---|---|---|
| Before the courts | leagueWren / Wren | 3,12 | Keep friendship and rivalry together; her notebook belongs in her hands |
| Between encounters | Nelva | 4,15 | A dry bench, water and counted partners; genuine rest |
| Court 1 | league1 / Edrin | 7,6 | Listen while the plan changes |
| Court 2 | league2 / Maela | 14,6 | Strength leaves a safe place for another |
| Court 3 | league3 / Corven | 21,6 | Different partners share work without becoming alike |
| Court 4 | league4 / Liora | 28,6 | Corrections belong where the next reader can see them |
| Terrace | leagueChampion / Avenne | 35,6 | The title belongs to a tamer; the journey belongs to the team |
| Existing ending | Wren, Maren, Isolde | At the league entrance, per narration | Welcome every partner back; guardian calls, answering lanterns, colour |
| Optional homecoming | Maren, Wren | Larkhaven ranch approach, staging proposal | Set down the bag before choosing the next road |

Classic arrival from Farwatch is [3,16]; the south return lands in Farwatch [12,1]. Keep all eight badges as the
entry condition. Map coordinates above are existing data anchors, not a demand to put the Godot characters on
exactly those pixels. Leave standing space and a clear approach; nobody occupies a narrow path or another person.
Avenne's Soundhowl is level 76, despite the player's eight-badge cap being 75: preserve this authored opponent
rather than silently rebalancing while moving text. The three starters and rival placeholder keep their current
resolution, not an invented fixed rival team.

## Completion is a conversation callback

Read the Classic contract in `04-world.js` before porting: Wren first, four rooms in order, rest between rooms,
then Champion. `leagueVictory()` prepares `b.win.concat(SCENES.leagueEnding)` for the Champion and attaches
`completeLeagueEnding`. The ending flag/title are completed after dialogue, not merely because a fight ended.
A won-Champion save without the completed ending can resume it. Keep the result scene and callback safe through
skip, replay, reload and failure; title delivery is once-only. These are port acceptance requirements, not new
save behavior introduced by this PR. Actual Godot progression implementation belongs to Claude.

The optional Larkhaven conversation must not duplicate the title, add an extra compulsory battle, move everyone
home unexpectedly, or make replayed story a source of rewards. Do not start it just because the player returned
with seven badges. Place it after an actual completed finale in the player's chosen pace. Avoid assuming the
player captured every guardian: some guardians choose to remain at home, and the existing narration allows that.

## Payoff map: every thread, no false answers

| Thread | Existing shared evidence | What the league can pay off | What remains to decide/place |
|---|---|---|---|
| 1: Fading and depth | Pale world; Isolde's memory; flat carved steps, old lower inlet, Senna's survey | Colour and care, as the existing ending says | Opponent/cause and actual depth restoration; never manufacture the latter with prose |
| 2: Wild bond | Ferry prints and tally, two hands around a paw, two figures/one shadow | Trust and choosing to stand together | Discovery of the player's wild bond, old pair identities and fate; no fusion in this league pack |
| 3: Unbound | Sivet's visitor, Halen's opened pen, Nesla's quoted founding text and the returned ribbons | Care without a cage; a creature may stay or leave | Founder misread the fight is decided, but the revealing evidence and present leader's motive are not supplied by a Champion title |
| 4: Watcher | Toren's older watcher, Orri's warm pocket, disputed mountain accounts | Leave an honest unanswered page | Watcher identity; Dripdart's bell is not that answer |
| 5: Heritage tales | Split-loop border, common shelter knot, families with different accounts | All four routes share an ending; perspectives can coexist | Common ancestry/same-event revelation is decided, but place shared confirming evidence before stating it as proven |
| 6: Small questions | Blue rope, third bell, nursery ribbons, empty mooring | Existing byBadge answers: Rillwhisk, Dripdart, Ribbonstride, Watchlight/Keeljaw | Veilmote's nests and Tobin's older sighting are still open; don't equate them with the watcher or old pair |

This table is a writer's checklist, not player-facing text. Essential evidence and the eventual true account must
remain reachable by every heritage, without capturing a particular creature, taking a seasonal visit, selecting a
particular Unbound response or repeating the league. Heritage lines add perspective; they are not the only source
of proof. Keep narration truthful even where people disagree. The new homecoming only pays off the companionship
thread; it does not silently choose among the ledger's candidates.

## Light, sound and silence

Proposed staging: a warm entrance bench, cooler terrace air, and the ordinary sounds of partners returning. Let
Wren's shout be one moment, then leave room for Maren's welcome. Show answering lights and guardians only where
Claude's scene machinery can stage them; don't suggest that every guardian is in the player's team. Rest has its
own visible pause. Colour can be a visual echo of the first bond, with reduced-motion and sound-off alternatives;
no flashes or mandatory sweeping camera. Depth waits for actual WB4.2/WB4.3 implementation and approved context.

## Claude's integration acceptance

- Eight badges required; Farwatch return available; Wren and all five courts reachable and ordered.
- Keep every base line, source team and rival selection; healer's rest and retry never skip or repeat a court.
- Champion loss followed by a win records one victory, one title and one completed ending; resume an interrupted
  ending, skip it, revisit it, and load an old Champion save. Do not award completion before its callback.
- Inspect speaker placement, readable dialogue and scenery at phone, desktop and 3440x1440; partners stay visible.
- All four heritage routes reach the same essential truth; no guardian capture or festival date is required.
- Classic post-game text and Godot availability remain distinct. No league line claims a mystery reveal or depth
  restoration that is not implemented. Read the decision map before writing WB4.4's remaining final revelations.

## Verified handoff

271 source/export/path/layout checks pass: exact source entries and ending, existing cast and team species,
ordered IDs, all seven NPC approaches reachable, clean 39-table export, and 37 lines at four screen sizes
(148 shared portrait text/width/bottom previews). Frames in docs/screenshots/wildbond-finale-writing/ show the optional welcome
on the real Classic dialogue surface, in isolated browser saves. Those initial previews did not check the whole card against the scene top; longer original Classic lines may clip the portrait heading on phones. T54 tightens that check for its new lines. This is writing validation, not a Godot league
playthrough. All eight browser pages pass; no runtime, save, export tool, Godot, preview or version change.
Latest main's seasonal/festival integration and Starfall story integration were preserved through the merge.
