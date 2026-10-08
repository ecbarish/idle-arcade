# Realmbound: the first ten minutes

Codex, 2026-10-07. Lane A8 documentation work while PRs #43 and #44 await review. This supports the guide in PR #44 and prepares L4/V1; it does not claim their implementation, change gameplay, or touch Wildbond/Godot. Claude owns the Godot trial and its gate, fence and animation fixes.

## What the browser currently does

Checked against main d194bd4, with the guide branch's documentation and cosmetic Wildbond variants present. Those additions do not change Realmbound.

- The creator explains factions, starting regions, races, classes and journey lengths. Journey length can change later. Its final button is **Enter the world**.
- Creating a hero calls `accept()` for the first quest directly. Farmer Aldous's **Wolves at the Fence** or Elder Ugra's **Lizards in the Water** is active immediately. Their request scene never opens on this path, although manually accepting later quests uses `questOffer()` and the shared portrait dialogue.
- The hero starts in **Focus**, but `freshC()` sets `lastInput: -99`. `aiOn()` is already true: the 15-second inactivity condition has already elapsed. This is intentional fallback code, but an unexplained first impression for someone expecting to control their first fight.
- The quest log says the hero follows the first unfinished quest. It shows objective counts and reward choices, but an active quest's original request text is absent. A new player has missed the spoken request and has to infer the stakes from the title and objective.
- Abilities are buttons with tooltips and numbered keys. The mode hint explains taking over and the Engaged XP bonus. Corpses have a loot button and the **L** shortcut; earned AutoLoot is separate from combat autopilot.
- Completing the kill objective is not the same as completing the quest. The player must choose a reward to turn it in. A ready quest does not automatically start its successor without earned QuestHelper.
- Town is already a walkable place with services, a quest giver and a gate. A tutorial can use it without inventing another movement system.

Source: `games/realmbound/js/10-state.js` (`newHero`); `15-events.js` (create, ability, loot and turn-in handlers); `11-combat.js` (`freshC`, `aiOn`, `engaged`, `aiEff`, `step`); `12-tabs.js` (Quests); `16-scenes.js` (offers and thanks); `22-town.js` (towns).

## Browser experiment

Fresh isolated Chrome contexts, one hero per context; real creator buttons selected each faction and class. No existing player profile or save was opened. The trial advanced the actual combat `step(.1)` 6,000 times and called `checkAddons()` once per simulated second. No ability presses, manual loot, quest turn-ins or equipment changes were supplied after creation. This is an accelerated **untouched opening diagnostic**, not ten minutes of human play or an estimate of normal leveling speed. Randomness was not seeded; each row is one observation, not an average or guaranteed outcome. Timer-driven UI, offline rewards, and human reading/walking time are not modeled by the accelerated loop.

| Faction / class | Starting quest | Initial autopilot | Level after 600 simulated seconds | Kills | Deaths | Objective | Quests turned in |
|---|---|---|---:|---:|---:|---|---:|
| Concord / Warrior | t1 | Active in Focus | 4 | 41 | 0 | 8/8, ready | 0 |
| Concord / Mage | t1 | Active in Focus | 4 | 38 | 0 | 8/8, ready | 0 |
| Wildclans / Warrior | r1 | Active in Focus | 4 | 40 | 0 | 8/8, ready | 0 |
| Wildclans / Mage | r1 | Active in Focus | 4 | 36 | 1 | 8/8, ready | 0 |

All four began without a dialogue scene. All four ended with the hint “Autopilot is covering for you (55%). Press any ability to take over.” No browser page errors occurred. The Mage death is one randomized unattended result; it does not establish a class or faction balance problem.

To reproduce the diagnostic, use a fresh browser profile with no player saves, serve this clone, and create the hero through the UI on localhost. Read `H().quests.active`, `RTALK`, `C.lastInput` and `aiOn()` before advancing; then run the loop above in the development console and inspect `H().stats`, `H().quests.prog` and `qState(ALLQ[H().quests.active[0]])`. Dispose of that isolated profile afterward. Never run the accelerated loop against a player's real save.

## Proposed next playable step: a person gives the first errand

This is an L4/V1 implementation brief, not shipped behavior. Keep it independent of the Wildbond engine decision. No new combat, quest or cinematic framework is needed.

**Arrival:** a short optional prologue uses existing region art, ambience, music and shared dialogue. Three beats: the damaged crossing; two communities trying to keep their homes supplied; the ordinary person whose small problem begins this hero's road. No claim that the Sundering created dungeon inhabitants, no new war, no early revelation of the Hollow Throne. Offer Skip immediately, and replay from a deliberate control. Do not require spoken audio; text must carry every beat.

Draft narrator lines, derived from `docs/lore/realmbound.md`:

> Before the roads broke, a traveler counted the Reach by the fires where they could sleep.
>
> Stone roads in the west. Witnessed promises on the steppe. Different ways to keep a neighbor safe.
>
> Your road begins with a small request. Someone is waiting for help.

**First request:** show Aldous or Ugra and their existing quest text before the first fight. Preserve automatic acceptance for compatibility rather than introducing a second acceptance rule; the dialogue acknowledges an already active errand. Continue advances to the world, and Skip returns there immediately. Returning saves must not replay the introduction unexpectedly. Decide how to store “seen” during implementation, with defaults and legacy-save checks.

**First fight:** explain one usable ability and the hero's resource in context. Let the player dismiss the hint. Explain that automatic basic combat/fallback continues and manual abilities take over; do not silently change Auto or Focus rules as part of a tutorial. A future V8 automation review is a separate task. Avoid advice that tells a level-one Warrior to spend unavailable rage, or a Mage to press a locked spell.

**First corpse:** a brief contextual hint points to Loot / L. Keep it out of the action's way and dismiss after manual looting. Explain that items in Bags are not equipped merely because they were found.

**First reward:** once the objective is ready, point to its reward choice in Quests. The giver's existing thanks scene provides the emotional response. Do not manufacture extra XP or a replacement tutorial quest.

**First visit home:** invite a town visit when useful, without forcing an expensive repair or a special inventory state. The smithy teaches selling junk and repairing; the inn demonstrates rest; the gate returns to the road. Keep the first tour short. Guild founding, jobs, dungeons and talent builds belong to later milestones.

These are event-based milestones, not timers. Players can read, skip, fight or wander at their own pace. “Ten minutes” describes the amount to introduce, not a countdown or a promise to finish every milestone in that time.

## Acceptance checks for the implementation PR

- Both factions and all five classes get the correct current quest giver, objective and usable action; Skip works with mouse, touch and keyboard.
- A new hero receives the opening quest exactly once. A loaded hero retains quests, gear, money, location and mode; older saves have safe defaults for any optional introduction fields.
- No fight starts behind an arrival scene if the scene is intended to pause play. Any pause behavior must be explicitly scoped and tested; timers must resume after both Continue and Skip.
- The loot hint does not promise AutoLoot before 60 manual loots. The turn-in hint disappears after choosing a reward. No tutorial grants earned addons early.
- Town instructions match actual movement and service controls. A full bag, insufficient repair money, death or leaving the zone cannot trap the introduction.
- Reduced motion, muted sound and larger text remain usable. Check 375px phone, 1366x768 laptop, 1920x1080 desktop and 3440x1440 ultrawide with before/after captures.
- All five browser runners pass and restore game saves, backups and hub progress. Test returning heroes separately from fresh heroes.

## An idea

Make the prologue end on the same person who gives the first quest. That turns a broad history into one immediate relationship, and lets the guide's “first fifteen minutes” act as a reminder rather than the only place a new player learns what matters.