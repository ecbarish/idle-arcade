# Wildbond: final-truth clue audit

T55 / WB4.4b part 1. Codex, 2026-10-09. Reviewed against main `f48aa1d`.
**Writer proposal for Claude's review, not placed dialogue or additional canon.**

## Finding

The chosen account at the top of [the thread ledger](wildbond-threads.md) fits the shared physical clues and the deliberately partial family accounts. I found no placed omniscient statement naming a different cause of the fading. Two chronology risks need attention before the reveal: Rysa's ordering of the joining and the colour loss, and Classic's early depth-return scenes. There is also one unresolved identity relationship the reveal must avoid deciding accidentally.

Keep the distinction between observed events and their explanation. The modern Unbound really preserve a joining and subsequent pallor in their account; that does not establish that the joining caused the loss. The older order's refusal of friendship and the present faction's refusal of any bond are different errors. Present-day concern about captivity remains fair; do not turn every visitor into a secret member of the ancient order.

The observations below would supply evidence of coercion, damage already underway, and a friend turned against the pair. They do not need a new villain name, creature species, ancient faction hierarchy or date. The final conversation can connect those facts without adding a surprise fourth piece of evidence.

## Coverage and source trail

Reviewed the ledger's six threads and every later placement group against `games/wildbond/js/00-data.js` and `11-maps.js`: SPECIES dex descriptions, all map signs, map residents' base/badge/heritage/season/festival lines, STORY introductions/wins/heritage/Champion returns and SCENES. The exported content is these source tables; Godot-specific opening and family accounts were separately checked in `wildbond-godot/scripts/main.gd`. This is a text/canon audit, not a new Godot playthrough or proof that every optional line dispatches in the engine. Addresses below use NPC `who` IDs rather than unstable array positions. The keyword inventory was a navigation aid, not the coverage test.

| Ledger group / exact source family | Fit and boundary |
|---|---|
| Early fading and remembered colour: SCENES.intro, colorReturns; STORY.warden.win | Narration describes pallor and recovery; Isolde attributes recovery to bonds and guardians remembering. Neither names the original enemy. Fits memory eaten and freely earned bonds restoring it. |
| Toren's watcher: STORY.warden3.win; warden3.byHeritage | Old warmth and a pre-Warden vigil fit the sleeping watcher. Toren's lack of an identity is honest at this point; do not change it into omniscient knowledge. |
| Stillreed's three shared clues: MAPS.stillreed.signs['12,7']; sivet.lines; STORY.warden5.lines | Side-by-side prints, crossing/rescue alternatives and opposite family directions fit the pair and incomplete viewpoints. The rope complaint belongs to an Unbound visitor, not narration. No demand to bind creatures is endorsed. |
| Hollowecho's four shared clues: MAPS.hollowecho.signs['7,5']; orri.lines; STORY.warden6.lines | Flat steps, survey ledge and a partner avoiding a missing drop support lost depth. Two hands and a paw suggest care; they do not identify the turned friend. Warm pocket fits the watcher's rest. The third-bell attribution is explicitly hearsay. |
| Sunthread's four shared clues: MAPS.sunthread.signs['27,4']; nesla.lines; STORY.warden7.lines | Four ties sharing a knot support common roots, not yet a genealogy. The quoted founding copy is an inference from a partial account. Halen's returned creatures and frightened youngster preserve the case for freedom with a place to stay. |
| Farwatch's four shared clues: MAPS.farwatch.signs['14,5']; ceryn.lines; STORY.warden8.lines | Incomplete shadow record and obscured witness preserve what the pair faced as unknown. Lower painted shore supports lost depth but allows erosion. Empty-mooring light does not establish survival. See chronology risk below. |
| Four small answers: sivet.byBadge.reed, orri.byBadge.echo, nesla.byBadge.loom, ceryn.byBadge.horizon | Rope: Rillwhisk nest. Bell: Dripdart/runoff. Ribbons: Ribbonstride. Mooring: Watchlight helping Keeljaw. These are ordinary present-day payoffs. None identifies the watcher, the entity or the old pair. Keep them solved. |
| T40, all 16 later heritage reactions: those four residents' byHeritage | Shared marks, overlapping verses, missing endings and different viewing directions fit one night transmitted differently. The visitor who helps is not proof of correct doctrine. A Wanderer's interpretation of the rubbing is attributed, not an identity fact. |
| T45, all 60 early reactions: MAPS residents maren/pip/bram/lise/tobin/cato/marit/orsk/sela/ilka/teodor; STORY warden/warden2/warden3/warden4.byHeritage | Care, an open latch and gently tested rope fit symbiosis. Lise's ledge, Cato's shallow carving, Sela's waterline and Teodor's chart support lost depth. Hums/knots imply transmission. Glare, sleeping, vigil and two blankets are explicitly incomplete accounts; no new identity or fate follows. |
| Godot HERITAGES.{farm,coast,highland,wander}, HERITAGE_TALK, HERITAGE_ARRIVE | Every origin tale is introduced as family speech or what people say. Tired land and incoming water are local observations; blaming sleep or joining is interpretation. Preserve that attribution, especially the Wanderer tale's judgement that joining was wrong. Shared late evidence must be available without selecting any particular heritage. |
| Veilmote and Tobin: SPECIES.veilmote.dex; MAPS.saltmarsh.tobin.lines | Guarded abandoned nests are factual ecology; their ownership stays open. Tobin's own unusual tide sighting is not established as the old night. Do not age him a century or make him an eyewitness to the pair's fight. Other species' nest/shore/guardian descriptions add ecology, not an ancient culprit. |
| WS3/WS6: MAPS seasonal tables, residents' bySeason/byFestival and larkhaven.festivals | Ordinary current care and customs, not eyewitness material or an ancient ritual. Pip's tracks are made now. No essential proof may depend on a festival date. |
| T53/T54: league STORY, SCENES.leagueEnding/leagueAfter; eight Wardens' byStory.leagueEnding; wildbond-finale.json | League resolves earned Champion recognition and colour recovery. It explicitly leaves the older reason for the fading outside that ceremony. Return conversations preserve unresolved history. Existing optional homecoming adds no testimony. Do not dispatch the deep reveal at the title ceremony. |

## Risks to resolve in the handoff

1. **Rysa's sequence** (`STORY.warden8.lines[2]`): the witness places two figures becoming one *before* the colour went. Evan's account has memory loss beginning before the pair stop the entity. These can coexist if the witness saw a final/local loss after damage had already begun. That is a possible interpretation, not a fact already proved. Observation 2 should show earlier damage. If the intended chronology instead puts every last loss before joining, mark this witness's ordering as a mistaken recollection in the later discussion; do not make narration repeat it as fact or silently repair the old quotation. Nesla's founding copy and the Wanderer tale have the same causal trap, but are clearly attributed.
2. **Early Classic depth** (`SCENES.lightReturns`, `solidReturns`): after badges two and three, Nerys describes depth and narration makes the scene solid and walkable. That is a genuine mismatch with a *late-only* depth restoration if carried straight into the new campaign. It is inherited Classic presentation, not evidence of a different original cause. Current Godot main directly dispatches rival1/rival1Win/leagueEnding/leagueAfter, not these two scenes. Keep their export separate from the new depth payoff; Claude should not port those lines unchanged as pre-discovery history. Do not certify late depth merely because colour returns at the league.
3. **Watcher and turned friend:** the top canon identifies the watcher as a ritual target who slept rather than serve, and the turned guardian as the pair's friend at the ritual's centre. It does not explicitly say whether these are the same creature or different ones, nor when sleep followed the fight. Neither model is established by the current warmth/bell evidence. Keep the proposed artifacts below identity-neutral; Claude should settle that relationship against Evan's wording before the reveal names it. Do not invent a second guardian to patch it.
4. **Historical writer notes:** ledger sections below the dated final-truth entry still list candidates and a fight that was lost; older proposal/finale briefs also say undecided. Those are dated planning history, not placed player testimony. The new top entry governs: the pair stopped the entity after damage had occurred. Part 2 should label old alternatives superseded when linking them, not reopen the decided cause or turn modern Unbound into the older order.

## Exactly three proposed shared late observations

**Sequence:** after WB4.2's actual wild-bond discovery, before the explanatory reveal. Each is a physical inspection plus an optional conversation, using ordinary maps/story scenes. These are proposed new artifacts, not claims about objects already in the game. No capture, rare species, ancestry selection, faction allegiance, festival, real-world date or perfect choice is required. Revisits remain possible. A companion or Wren can offer a short route hint; the evidence itself stays in the world, with a record only after inspection.

### 1. The order's broken restraint record — Hollowecho, Orri's survey table

An older stone rubbing, supplied alongside Orri's existing tool roll, pairs a no-bond order mark with command/restraint instructions for powerful creatures. The same split-loop border used by the ferry tally distinguishes its provenance from the modern freeing copy. A broken fastening is drawn with a creature pulling away, not two friends joining. Show the artifact rather than have Orri explain the whole ritual.

**Narrowing:** the original human practice was coercion, not the modern doctrine of freeing everything. The older order existed before the joining account. This is evidence of an attempt, not proof that restraints actually worked or that every powerful guardian participated. The record must use unmistakable commands rather than a knot alone: present-day shelter ties are not shackles.

**Access:** ordinary walk-up inspection for everyone; Orri's repaired-bell conversation remains separate. This observation establishes the artifact vocabulary used by the third without identifying a species or naming the watcher.

### 2. The shore that was already missing — Farwatch, beside Ceryn's painted-inlet copy

Compare the painting with a newly proposed, independently kept survey sheet from the same night. Consecutive entries record a remembered shore contour and colour disappearing while the pair are still approaching, before the joined-shadow witness entry. Physical measuring marks remain while the remembered shape is lost. Keep the original incomplete witness page incomplete: the survey is another observer, not a miraculous restored ending.

**Narrowing:** joining cannot have started all the damage. It separates memory/depth loss from ordinary coastal erosion by the simultaneous lost contour and retained material marks. It does not alone prove the entity's maker or the pair's victory; two differently placed witnesses can still record the final local pallor at different moments. The relative ordering must be visibly recorded, not supplied only by a new expert's assertion.

**Access:** Ceryn shares both records with any heritage. Inspection has no clock requirement. This is historical damage, not a live demonstration of something eating memories now: an active erasure would decide the intentionally open question of surviving entity fragments.

### 3. The friend in the centre — Stillreed, Sivet's dry ferry ledger

A proposed surviving paired leaf uses the tally's existing border: an earlier ordinary crossing shows a tamer and partner sharing food and shelter with a guardian that approaches freely. A later entry repeats those recognisable figures at the restraint circle; a separate consuming shape interrupts the guardian's response. It repeats the joining mark at the point that shape ceases, then the account stops. Four later witness copies preserve different segments of this same continuous leaf; their folds align with the four shelter ties' shared knot.

**Narrowing:** the pair faced someone they had cared for, with something behind its change, rather than simply attacking an inherently evil guardian. Matching the ritual notation from observation 1 and the damage sequence from 2 supports the entity account. The joined response stops the consuming shape; it does not prove the pair survived or what followed. The shared originals explain the four inherited perspectives; the copies are transmission evidence, not a complete family tree invented for the reveal.

**Access:** all four copy segments are shown to everyone, not one per heritage. No exclusive family verse is needed. Keep guardian and watcher identity unlabelled until the relationship above is settled. Do not identify Veilmote's nests, the warm pocket's later occupants or Tobin's sighting from this leaf.

## Acceptance before part 2

Claude reviews these three proposals before any new reveal dialogue. Confirm the watcher/friend relationship and choose the treatment of Rysa's chronology; then place the evidence in the ledger as implemented observations, with shared access checks. The eventual reveal connects coercion, memory loss, the turned friend, joining and common roots, while leaving the old pair's fate, surviving entity fragments, Veilmote's nests and Tobin's earlier sighting open. No runtime, Godot, exporter, save, version or cache changes are part of T55.

Validation: 56 source-reference/structure checks and all eight isolated Chrome test pages pass (Realmbound 8,425; Wildbond 2,290; Starfall 48; sound 21; offline 15; Diamond 122; Otherworld 1,895; runner-safety 35). This confirms the unchanged browser baseline, not the proposed observations' future implementation.
