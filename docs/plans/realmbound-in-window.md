# Realmbound in the game window

T38, Codex, 2026-10-08. Reference: Evan's in-window rule, docs/wildbond-plan.md, Wildbond Godot's field book and Starfall's guild board (images/play/). The world is the main screen; paperwork opens deliberately over it. Keep the current browser game, combat, prices, journey pacing and saves. This is not a Godot migration.

## Every feature has a home

| Current feature | Home in the world | Part 1 |
|---|---|---|
| Quest log, accept, abandon and reward selection | A Quest Journal held over the scene; givers continue speaking in portrait scenes | Same quest controls in a closable journal |
| Bags, equipment, pet food, vendor sale/repair | A Satchel; vendor services remain at the Smithy | Same item and transaction controls in a closable satchel |
| Character and attributes | An equipment page in the Field Kit | Existing page reachable inside the notebook |
| Friends, party, dungeons and raid | People on the road and an expedition roster; formation over the scene | Existing Friends page in the Field Kit; group/raid dialogs retained |
| Mounts and pets | Stable keeper and companion pages | Existing pages in the Field Kit; Hunter-only Pet page retained |
| Talents | Trainer's lesson book | Existing page in the Field Kit |
| Addons | Earned tools you carry | Existing toggles in the Field Kit; unlock rules unchanged |
| Guild, jobs board, bank and commissions | Guild Hall, physical board and Hearth Book | Existing Guild page in the Field Kit; walk-in Hall/story/commission scenes retained |
| Travel and hunt target | Folded road map | Existing zone buttons and hunt select on the map |
| Road guide and replay arrival | Optional road note; people still give the first request | Note opened over the scene; arrival controls stay beside narration |
| Journal, journey pace, save tools and account settings | Travel diary and pause menu | Existing Journal page in the Field Kit; Settings/Characters/Graphics/Sound/Feedback in Options |
| Health, resources, target, pet, party and XP | Thin overlay in the world | Keep real frames and action bar; world grows behind them |
| Combat log | A folded battle record | Open over scene on demand |
| Loot, encounters, dungeon rewards and character creator | World overlays | Preserve every existing action and dialog |

## Part 1 behavior

The canvas fills the viewport with scene-native unit frames and action bar. Quest Journal (J), Satchel (B), Map, Road note, Battle Record and Field Kit form a small dock. All old pages remain reachable in the notebook; the original page builders and delegated actions remain the authority. This first step relocates them, not a completed physical redesign of every page.

Opening the notebook pauses the world, including town walking and combat timers, until Put away or Escape. Reading does not silently spend health. Choice scenes replace the notebook so the giver can be seen. Book state is transient, never a new save field; hero switches, imports and reload close it. Existing portrait scenes, character/group dialogs and Settings take priority. Keyboard focus is contained in the open notebook, then restored to its opener. Combat keys cannot fire through the notebook. Touch uses the same labeled controls.

Phone (375x812), laptop (1366x768), desktop (1920x1080) and ultrawide (3440x1440) get the whole scene. The paper has a bounded, scrolling reading area rather than expanding the world beyond the screen. Header utilities fold into Options; the dock scrolls on small screens. Respect shared text size, reduced motion and default-off sound. No gameplay, balance, release or service worker changes.

## Follow-ups

Each later step should replace a notebook page with its planned physical interaction only when that interaction is ready. Never remove the old route before its replacement exists. Full-screen layout alone does not turn the existing auto-combat road into a free-roaming world. Realmbound's possible Godot move remains Evan's open decision.

## Implementation and verification

Part 1 is ready in PR #62, stacked on #61 (Claude's recovered plan). New field-window.css and js/29-field-window.js own the viewport and transient paperwork. Small hooks in combat/town pause reading, boot clears the book, and existing town labels use the HUD. Road figures retain their pixel renderer; their scale is bounded by viewport width and a 600px scene-height reference so a phone does not create a giant figure. Every transaction still calls its existing handler. Guild adventurers' delegated jobs keep their real-clock accounting; the paused book does not mint or delete supplies.

All eight browser test pages pass: Realmbound 7,738 scenarios in the final run (NPC fixtures can vary the baseline by 16), Wildbond 1,485, Diamond Career 122, Otherworld 831, Starfall 48, sound 21, offline 15 and runner safety 35. Twenty-five new scenarios cover transient state, saved-data preservation, every page, input ownership, combat pause in Focus and Auto, hero changes and dialog priority. Runners preserve saves, hub and recovery backups exactly.

Actual Chrome mouse/keyboard UI checks at 375x812, 1366x768, 1920x1080 and 3440x1440: full canvas, Journal, no ability keys through reading, Satchel equipment, Map hunt selection, portrait quest acceptance, every page, reload with exact gear/bag/money/quest/hunt preservation, town walking blocked through the Satchel, and Smithy choices. These use isolated prepared saves, not an unassisted full campaign playtest. Default sound remains off.

Before/after and the Journal, Satchel, quest giver, town and Smithy at all four widths live in docs/screenshots/realmbound-window/. No Godot, shared engine, game version or service worker changes. Current notebook tabs are a migration bridge; making every menu a distinct physical interaction is still follow-up work.
