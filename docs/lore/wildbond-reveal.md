# Wildbond: the evidence and the remembered world

T58 / WB4.4b part 2. Codex, 2026-10-09. [Writing pack](wildbond-reveal.json).
**Approved-account writing handoff, not implemented scenes or a runtime patch.** Claude owns placement in Godot.

The design is a table with three objects on it before it is a speech: coercion, damage already underway, a friend
turned against friends. Toren revises his own mountain story; Isolde connects the evidence. The partner walks away
and comes back without an order. That small action carries the answer before anyone names it.

## Contract for the builder

- Plain JSON only. `inspection`, `ownerLines`, `tell`, `reveal.lines`, `depthRestoration.lines` and `wardenAfter`
  use `[speaker, text]` pairs; empty speaker means truthful narration. Speakers are existing CAST IDs.
  `status: writing-handoff` prevents confusing this reference pack with placed gameplay. No exporter entry added.
- After discovering the wild bond, uncover the three objects in order: Orri's rubbing in Hollowecho Hills, Ceryn's
  survey in Farwatch Reach, Sivet's paired ferry leaf in Stillreed Basin. The existing browser NPC anchors are
  Orri `[5,5]`, Ceryn `[18,3]`, Sivet `[10,6]`; they are references, not replacement Godot coordinates. Put an
  inspectable object beside each person, off the path. Keep ordinary, bell/ferry and Champion conversations intact.
- Every heritage can inspect **all** evidence and copies. No season, weather, origin, species, faction allegiance,
  capture, payment, timed visit or consumable is required. Optional owner/Maren/Wren lines follow inspection and
  add perspective only. The documents remain re-readable; a notebook record can recall what was actually seen.
- `reveal` follows all three inspections, the league ending and the Champion returns. The current Godot
  `story_done["leagueEnding"]` marks the league ending; it alone is insufficient for this scene. The builder must
  also record the actual wild-bond discovery, inspected evidence and completed Champion-return staging. This pack
  defines requirements, not invented save-field names. Migrate any integration fields safely in the engine PR.
- Use Hollowecho's warm pocket: the mountain is where Toren's account can change in person. Isolde brings copies;
  the sleeping watcher remains undisturbed. Player and partner have separate footprints. Toren and Isolde stand
  beside, never on, the player or the exit. Partner approaches the open hand, steps aside, returns voluntarily.
- Dialogue waits for the reader. An interrupted scene can resume or replay safely; it never doubles rewards,
  replays the league, changes team or forces a bond. No choices decide whether evidence or the truth is available.
- `depthRestoration` is the one late return of depth, after the reveal. Narration describes a visual event:
  **play it only when the engine can actually show that event**. A ridge has distance, a stone has sides,
  shadows follow the ground. Do not reintroduce Classic's early lightReturns/solidReturns or promise first-person
  controls here. Honour reduced motion: the completed view and all text must carry the same meaning without a sweep.
- The eight Warden lines follow the completed depth moment, append to their ordinary welcome rather than replace
  it, and give no repeat badges, money or battle rewards. Toren's line does not wake the watcher or open WB5.4.

## What each object proves

| Object | Observation | Connection in the reveal | What it does not decide |
|---|---|---|---|
| The Unanswered Command | Explicit refusal of a bond; restraint ring, unlike the open-hand rubbing | The older order tried to make creatures serve | A new faction name, all guardians participating, shelter ropes being shackles |
| Before the Joined Shadow | Loss recorded before the approaching pair join; last local pallor recorded afterwards | Ceryn and Rysa both preserve true parts of the same night | The pair causing the loss; live memory-erasure today |
| The Friend Between Them | Freely visiting watcher, later restrained with a separate spreading shape; joining stops its spread | The entity turned their friend; the bond stopped it; four copies explain partial inherited tales | The old pair's fate, extinction of every fragment, a new family tree |

The canonical origin of the entity is explained by Isolde using Evan's chosen account. The artifacts give a careful
player its fair physical lead-up; they do not pretend a drawing can prove what every ancient person felt.
The modern Unbound are distinct from the older order; their opposition to captivity remains fair. No modern leader
is declared secretly evil. Veilmote's nests and Tobin's earlier sighting remain explicitly unanswered.

## Acceptance when placed

1. A new journey and an old Champion journey both reach the shared objects through every heritage. Check all four,
   including no rare partner, no season and no Unbound membership. Completing a minor Orri/Sivet errand is not required.
2. Read objects in the required order; revisit them after the reveal. No dialogue says the truth was already revealed
   while it is still pending. Maren/Wren reactions must be tied to the corresponding inspected object.
3. Replay interruptions between lines and around the depth moment. The ledger truth and one-time completion survive;
   the player never loses evidence or needs to clear the league again. No new rewards or stat changes.
4. Inspect short portrait lines at phone, desktop and ultrawide sizes using the actual Godot font. The long physical
   inspection descriptions can use several bubble lines; do not shrink the text to squeeze them into a single card.
5. Before/after views show the depth event, leave the warm pocket accessible, and keep the sleeping watcher asleep.
   Each Warden's new line is available only afterwards. Reduced motion gives the same evidence and conclusion.

Writer validation is recorded in the PR: JSON/schema and source IDs, complete shared coverage, every line previewed
in the shared browser portrait system, and all ten suites. Browser previews are writing/layout checks, **not proof
of Godot placement, its font metrics or an implemented depth return**. Claude performs those acceptance checks.