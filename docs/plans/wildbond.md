# Wildbond development plan

Status: proposed sequencing for owner/Claude review, 2026-10-06. T11/T7b/T13 remain Claude-owned; no Wildbond gameplay changes were made for this research. [Research](RESEARCH.md#wildbond-attachment-team-strategy-and-a-ranch-with-purpose); [portfolio plan](README.md).

## The experience to protect

Explore with creatures that become individuals through care, battles and bloodlines. Battling and the story form the main journey. Racing, ranch work and contests provide another reason to value a companion rather than replace it whenever something stronger appears. The world should feel inhabited, with named people, places and discoveries.

The reviewed main contains 33 species, three biome definitions, command battles, capture, evolution, ranch schedules, breeding, dialogue, sound and two implemented art styles. It still has a level-20 cap and only awards the Thorn Badge; Emberfall's Tide gate has no ordinary award path. The three biomes are definitions, not proof of a complete three-badge journey. Refresh Claude's latest branch before editing anything.

## Staged development

| Stage | Concrete scope | Completion gate | Dependency |
|---|---|---|---|
| W0: connect what exists | T11 pacing: badge awards, caps, XP settings and learning levels agree; Saltmarsh leads into Emberfall; explain the next story goal. Add a supported save backup/restore path as its own bounded ticket. | A fresh save reaches all implemented areas through normal play; a previous save resumes; backup/restore preserves individual creatures. | Claude's current code and pacing work |
| W1: one world you can walk | T7b: Larkhaven, one route and Thornwood's challenge on one map model; town/ranch entrances and deliberate encounters; auto-explore follows the same map. | Keyboard and touch navigate; trainers/grass/story triggers do not double-fire; auto and manual travel reach the same destinations. | Map/trigger spec, independent of art |
| W2: make care consequential | One rookie race circuit with contrasting tracks; a few clear ranch jobs; training/rest choice and a creature history panel. | Different existing creatures have useful roles; racing is affected by track/strategy; care choices have readable costs and outcomes. | Approved race/job rules and current ranch model |
| W3: make breeding discovery | Carefully expand inherited moves, hint-driven hybrids, gentle retirement and repeatable competition. | A player can intentionally pursue a bloodline without perfect-parent grind; retirement preserves a valued companion's role/history. | Genes and balance spec; bounded inheritance rules |
| W4: finish the regional journey | More Wardens/regions only after earlier ones work; rematches, older-area discoveries, contests, league and focused postgame challenges. | Returning to an old area has a purpose; badges measure progression; optional activities do not become compulsory chores. | Stable W0–W3 loop |
| W5: progress through presentation eras | T13: Pocket/16-bit parity first, then an HD-2D experiment and a small diorama renderer. Modern 3D is later feasibility work; VR is parked and not a requirement. | Identical map positions, story flags, battle results and creature identities survive every style switch; low-end device fallback works. | Renderer contract and performance budget |

A racing circuit is preferable to another pile of species once the existing journey is connected. Start with three deliberately different track profiles and a small rival ladder; those counts are a prototype proposal, not a final content requirement.

## First proposed content/system experiment after W0/W1

**One creature, three uses.** Pick an existing non-legendary species and prove that a player can use the same individual in a story battle, a track suited to its temperament, and one ranch role. Give it a simple history: first capture, meaningful wins and parentage. Compare two training schedules over the same simulated days; one should not dominate every use.

Show a reason for each command and outcome: element relation, terrain effect, fatigue or a bond opportunity. Use cheap retraining or a move relearner to support experimentation, subject to the pacing spec. A player should not need to discard an attachment merely to solve the next area's strategy.

## Learn from the references

Monster Sanctuary suggests understandable synergy and viable favorite creatures; Cassette Beasts suggests presentation and fusion can reinforce identity, but movement and encounter friction matter. Pocket Stables validates the raising/racing fantasy Evan likes while its review warns that repeated train-to-threshold gates can become thin. These are design interpretations, not promises that copying a feature will work here.

Give creatures ordinary ranch jobs and let human NPCs be mentors, specialists or story characters if that distinction is approved. The current design contains both human automation staff and creature labor proposals; settle which does which before implementing two overlapping chore systems.

## Groundwork and later capabilities

Keep species/learnsets, individual state, map collision/triggers, battle simulation and drawing separate. A 3D scene must consume the same location/creature IDs instead of creating a second game. One small renderer benchmark should precede a full era conversion. Pin any approved renderer dependency and document why the current no-build approach remains adequate or needs reconsideration.

The existing design's suggestion that VR is reachable with no engine change is an aspiration, not a validated implementation plan. MDN documents limited WebXR browser availability and secure-context requirements [R22 in research]. Test an actual target browser/headset and ordinary screen fallback before committing to VR.

## Owner choices to settle

Confirm battle is still the main spine and whether racing is the first side activity. Is creature aging/retirement enjoyable if no companion dies? Should art eras unlock with story while all earlier looks remain selectable? Which phone/browser should be the minimum target? VR needs no owner decision now. Do not assume Evan's 4090 defines what everyone else's device can handle.

## Updated control direction

Manual exploration, battles, care and breeding choices should each be delegatable independently, eventually supporting an unattended journey under chosen policies. Existing manual-only capture or manual unlock requirements need a reviewed compatibility decision; this plan does not change them silently. Full automation must handle ordinary story progression without needing a frequent confirmation click. Any pause for a major choice is a user-selected policy. Desktop and phone are the acceptance devices; no headset is required.
