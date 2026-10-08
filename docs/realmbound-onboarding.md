# Realmbound: the first request and the road

Lane A4, L4 + V1; Codex, 2026-10-08. This is the browser onboarding slice from the five-step plan in [the research review](research/realmbound-first-hour-review.md), using the existing portrait scene system. It does not migrate Realmbound to Godot.

## What players see

Creating a hero accepts the same first quest exactly once, then shows a short arrival ending on Farmer Aldous or Elder Ugra's existing request. Continue, Enter/Space, or tapping the dialogue advances it. A visible Skip arrival button and Escape end it immediately. Only this arrival (including deliberate replay) pauses combat and its runtime clock; neither waiting nor skipping grants anything. Watch arrival replays it without changing quests or progress.

The optional Road guide appears beside the world controls at relevant milestones, with Got it and relevant menu links. It explains a currently usable ability or the actual resource restriction, automatic basic attacks and the existing 15-second Focus fallback, manual loot and Bags, objective readiness versus reward choice, a free inn/longhouse rest and optional repairs, and an actual encountered or grouped adventurer's role. It never creates a companion, forces a paid service, equips an item, chooses a reward or grants an addon. A full bag retains the normal failed-turn-in behavior and the guide explains how to make space. Advice is event-based; there is no tutorial countdown or promised completion time.

The first town invitation follows the real quest turn-in. Visit between fights using Town; move with arrows/WASD or tap the ground. Existing inn, smith and gate behavior is authoritative. Companion advice waits for an existing encounter or party member; strangers' normal recruitment probabilities and departure rules remain intact. A real newcomer test is still needed to measure whether players understand these steps without help.

## Save compatibility and controls

New heroes have one optional field: onboarding {arrival:false,hints:{}}. Finishing or skipping arrival marks it seen; dismissing advice records its milestone. Existing multi-hero and historical single-hero saves receive onboarding:null, preserving progression and avoiding a surprise introduction. Road help explicitly opts a returning hero into guidance, or resets dismissed hints for a new hero. Legacy arrival replay is read-only. Malformed optional guidance is ignored. Switching heroes clears the active arrival; an unfinished introduction remains pending for that hero.

Gameplay inputs cannot attack or loot behind the arrival. Modal Close still works, including an offline-report overlay. Sound remains off by default and existing motion/text settings apply. Version 1.0.3 remains unchanged for Claude's release, following Evan's no-version-bump instruction despite the older queue note.

## Validation

- tests/run.html: 4,407 scenario checks, including 234 new faction/class, pause/resume, legacy, resource, loot, full-bag, reward, town and companion assertions.
- Other six runners pass: Diamond 56, Wildbond 1,254, Starfall 48, shared sound 21, offline 15, Otherworld 38. Realmbound runner restores saves, backups and hub progress after removing its iframe. The pre-existing Otherworld runner restores its primary save and hub but leaves automatic test backup entries; this task does not alter it.
- Isolated Chromium UI route through creation, Skip, real ability button, paused replay keyboard guard, Loot all, Bags, reward choice, dismissal/reset and reload at 375x812, 1366x768, 1920x1080 and 3440x1440. Reduced motion enabled, default muted audio, no horizontal overflow or page errors. Synthetic combat/quest setup only accelerates test milestones; this is not a human usability result.
- Before/after screenshots are in [screenshots/realmbound-onboarding](screenshots/realmbound-onboarding/phone-arrival.png). Before frames load origin/main source in the same isolated browser; after frames use this branch. No player profile is opened. serve.ps1 runs this clone on 8766 to leave Claude's 8765 server alone.

## An idea

Give a future guild companion a short memory of this first local errand, once the player has actually helped them. Earn that callback through the existing affinity/notes system rather than assigning an automatic starter party.
