# Realmbound research: review and next decisions

Codex, 2026-10-07. [Gemini's supplied report](realmbound-first-hour-research.md) is preserved as received, byte-for-byte before Git normalization. Evan also supplied three source panels: [1](realmbound-sources-1.png), [2](realmbound-sources-2.png), [3](realmbound-sources-3.png). They confirm that sources were supplied; exact links and claim attribution are often not visible. The report is research input, not an approved build spec or instruction to install tools.

Read alongside [the prompt](gemini-realmbound-first-hour-prompt.md), [our actual opening audit](../realmbound-first-ten-minutes.md), [owner direction](owner-direction-2026-10-07.md) and the existing game/lore. Latest main a2ddc69 is integrated in Codex's branch, including Claude's Godot gate/fence/animation fixes, transform-only snapping and recorded owner direction. No trial or Realmbound gameplay edits were made in this review.

## My assessment

The useful center is people, readable goals, helpful companions and observation of actual players. But the report spends too much effort prescribing an engine and new systems instead of solving the observed first-hour problems. It treats Realmbound as an unbuilt Godot game and repeats creature-game concepts that do not belong to its current rules. Do not adopt it wholesale.

The first investment should be the existing first quest: hear who needs help, understand what the hero does automatically, make one deliberate combat decision, loot, recognize that an objective is ready, choose its reward and visit town. A short, satisfying relationship can establish the world without an hour-long bespoke origin for every class.

## What is useful

- A visible local landmark and a human reason for the first task. Keep navigation and goals legible; a contained starting space is an option, not a requirement to redesign all maps.
- Introduce companions as competent people with understandable roles. A named ally's brief reaction or memory is a plausible small improvement; a fully adaptive inclination/tactics ecosystem is much larger.
- Give routine party actions sensible behavior while preserving the hero's meaningful play. FFXIV's official Duty Support manual confirms NPC-supported duties; that is evidence for companion assistance, not proof the player's whole adventure should run itself. [Official manual](https://na.finalfantasyxiv.com/game_manual/dutysupport/)
- Separate useful reference information from optional lore. An in-world book can work, but readability and navigation matter more than page-turn decoration.
- Observe behavior as well as what testers say. Ask neutral questions and record confusion rather than explaining it away. A firsthand usability-playtest article in the source panel discusses questioning and moderation. [Practitioner article](https://www.gamedeveloper.com/business/asking-the-right-questions---moderating-a-great-usability-playtest)
- Keep backups and recoverable writes in a future native save design. This is future work only; the browser currently uses the shared save engine.

## What should not become requirements

| Report recommendation | Assessment |
|---|---|
| Realmbound is built in Godot 4 | Incorrect project assumption. It remains an HTML/JavaScript game. Wildbond alone has a Godot trial; engines remain open. |
| Mostly automated combat is a necessity | Conflicts with Evan's current preference for meaningful active play and earned convenience. It also shifts the hero fantasy toward Starfall's management fantasy without approval. |
| Plastic/poison chemistry, Updraft, fertility, SV/TV breeding and powerful rare variants | Creature-game material, not existing Realmbound systems. Do not add human companion breeding/cloning or a new element game because the report describes another title. |
| Restore colour in the starting region | This is Wildbond's established identity, not an approved Realmbound premise. Realmbound can show useful change through people, a safe road or a repaired service without copying the same hook. |
| One unique hour-long origin per class/background | A large content commitment before proving the first five minutes. An optional short arrival is the smaller candidate. |
| Adaptive inclinations, programmable tactics, party banter webs, rumors and companion traversal | Interesting separate proposals with architecture and testing costs. None is needed to explain the first quest. Choose a small existing-system extension only after the opening works. |
| Deterministic outcome forecasts remove all uncertainty | An estimate needs to reflect randomness, unknown enemy actions and player choices. Explain threats and roles first; do not promise an exact result the simulation cannot guarantee. |
| Encrypt saves on commercial release to discourage editing | No demonstrated player benefit for this passion project. Validated saves, backups and honest import/export are the priority; no anti-editing or commercial-release requirement is adopted. |
| Mandatory GDUnit4 and AI playtest plugin | Evaluate tools for an actual engine/task. Existing browser tests remain relevant; no dependency was installed. |

## Technical claims to correct

The report repeats the snapping and MSDF mistakes from the Wildbond report: Godot discourages combining transform and vertex snapping; MSDF cannot use font hinting and can be less legible at small sizes. These are reasons to compare results, not guarantees that one settings recipe fixes every scene. [ProjectSettings](https://docs.godotengine.org/en/stable/classes/class_projectsettings.html#class-projectsettings-property-rendering-2d-snap-snap-2d-transforms-to-pixel), [FontFile](https://docs.godotengine.org/en/stable/classes/class_fontfile.html#class-fontfile-property-multichannel-signed-distance-field)

The resolution table incorrectly marks 384x216 as not an integer fit for 4K: 3840/384 and 2160/216 are both 10. Increasing resolution does not inherently cause exponential overhead: 640x360 has four times 320x180's pixel count, and 384x216 has 1.44 times the count. These are arithmetic comparisons, not GPU benchmarks or estimates of art-production time. The table itself shows 640x360 fitting all its listed standard targets, undermining the claim that only 320x180 is sound. Ultrawide suitability still needs a real layout test.

“Completely secure” JSON is an overstatement: malformed data, schema errors, excessive sizes, unsafe downstream handling and failed writes still need attention. FileAccess supports object decoding as an option and warns against it for untrusted input. Use plain validated data; do not turn on object decoding for imported saves. [FileAccess](https://docs.godotengine.org/en/stable/classes/class_fileaccess.html#class-fileaccess-method-get-var)

GDUnit4 is a real maintained framework supporting Godot tests; its repository is visible in Evan's sources and was independently opened. That establishes existence/capabilities, not universal superiority or suitability for a browser game. We did not verify the separate AI-playtest plugin's identity from the cropped screenshot title, install it or expose a TCP control service. [GDUnit4 repository](https://github.com/godot-gdunit-labs/gdUnit4)

Specific Dragon's Dogma learning claims and Guild Wars skill-order claims need version-specific primary support before becoming behavioral requirements. The screenshots include community discussions and assorted game versions; do not treat those as a verified implementation specification. This review does not attempt to verify every cited article.

## What the brief asked for but did not get

The report does not provide the requested three alternative openings, a concrete event-based first 5/15/60 minutes, a ranked ten-item effort/risk/acceptance table, or a reproducible moderator script. It barely applies the supplied evidence about the skipped first quest scene, immediate Focus fallback and manual reward choice. It promises a broad architecture instead of testing those specific friction points.

A source list is valuable, but sources about another game's chemistry cannot establish that our game needs it. Technical sources likewise do not approve a migration. Retain citations, verify important claims and separate research evidence from owner decisions.

## Proposed next slice, using the current game

| Order | Small candidate | Evidence of success |
|---|---|---|
| 1 | Give Aldous/Ugra's existing first request a visible introduction | A newcomer can say who asked for help and what they need; the quest is accepted once; Skip/returning saves work. |
| 2 | Explain Focus/fallback and one currently usable action in context | Player makes a deliberate action and can explain what remains automatic; each class's resource limitations are clear. |
| 3 | Connect corpse loot, bags and the ready quest's reward choice | Player can distinguish objective completion from turn-in and claim a reward without help; no early addon grant. |
| 4 | Invite one useful town visit and meet its services | Player can find a service and return to the road; lack of repair money or a full bag does not trap them. |
| 5 | Introduce one existing companion when relevant | Player knows the ally's role and why to group, without a programmable tactics tutorial. |

These are implementation candidates for L4/V1, not changes shipped by this intake. Existing quests, class rules and saves remain authoritative. Do not require a first quest to finish at a fixed minute; Classic/Breezy/Long Road and time spent reading differ.

## Human testing: do not leave someone stranded

Use the report's neutral observation advice, but soften its absolute non-intervention rule. Before a session agree a duration, consent to any recording and a way to stop. If someone is stuck, record the last understood step and time/help needed; offer a neutral hint or end that task rather than making frustration the price of useful data. Record the intervention so independent completion is not overstated. Think-aloud can be helpful but continuous narration is not mandatory for every person.

Suggested exploratory tasks: enter the world; explain the immediate goal; make one deliberate action; collect a corpse; choose a quest reward when ready; find a town service; leave and return to the save. Ask what the player expects before they act, and compare it with what happened. No developer commands or accelerated simulation count as human task completion. Test both faction starts and representative resources, then repeat with new participants after fixes.

## Optional Gemini follow-up

Please refocus this report on the supplied Realmbound first-hour brief. Realmbound is currently HTML/JavaScript, not Godot; no engine migration is approved. Remove imported creature chemistry, Plastic/Poison, fertility/breeding, SV/TVs, colour restoration and mandatory mostly automated combat. Preserve the hero-adventure fantasy and earned quality of life. Use the actual observed issues: first quest accepted without giver dialogue, Focus fallback active immediately, and ready objectives awaiting manual reward choice. Deliver three alternative openings, an event-based first 5/15/60-minute sequence for different class resources, a ranked ten-item table with effort/risk/acceptance tests, keep/change/defer decisions and a humane reproducible newcomer script. Cite primary evidence beside relevant claims, separate game versions, and label suggestions. Correct 384x216 at 4K (10x), the exponential-overhead claim, combined pixel snapping, MSDF hinting and absolute save-security claims. Avoid a new architecture or programmable AI prerequisite for onboarding. The budget is approximately $200 total and platforms remain open; research should reduce risk and scope, not create a new mandatory system list.