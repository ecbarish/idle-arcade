# Diamond Career D1c: swings you understand

## Design

Choose Contact or Power on a small overlay inside Lamplight Field before a Timing pitch. Contact favours getting aboard; Power keeps the existing trade of fewer contacts for more extra bases. Patience stays Tactical-only. Moving from Tactical Patience to Timing visibly selects Contact, preserving the pitch, count, bases and seed. Swing choice locks at release. The ballpark result waits for Continue; the old side panel retains a copy as a record while the larger screen rebuild waits for the engine move (docs/research/decisions.md).

A swung pitch outside the zone says it was off the plate and harder to reach, whether it becomes a miss, foul, out or hit. An out distinguishes good contact caught by a fielder from weak contact. Good means the existing quality measure is at least 0.7 (Timing within 0.1 of arrival; a correct Tactical read). It does not imply a guaranteed hit or invent a batted-ball trajectory. The underlying contact, hit, power, runner and scoring formulas are unchanged.

## Eye and honest cues

The old 78% truthful roll was not the actual cue accuracy: its fallback picked among all three pitches, including the true one. Actual baseline accuracy was 78% + 22% / 3 = 85.33%.

The truthful roll now uses clamp(0.78 + (Eye - 50) * 0.002, 0.68, 0.88). Including the fallback, Eye 50 yields 85.3% correct cues, the fresh Eye 55 yields 86.0%, and the training cap of 80 yields 89.3%. These are probabilities across pitches, not promises about this pitch. This small improvement changes recognition on future manual pitches; it does not slow the ball, change its actual type or zone, or alter salaries and training costs. Simulation keeps the original default cue model (simulated actions judge the zone, not the hint).

Iona explains the actual before/after chance in a portrait scene in the clubhouse/home after Eye preparation, and records it in her existing notebook. Capped training reports no growth. One preparation per game still applies. New pitches store an optional cueChance snapshot. Old saved pitches retain their existing hint, seed, count and baseline probability without rerolling; old saves and the schema/key remain compatible.

## Validation

- Seven browser runners pass: Diamond 102 (19 new), Realmbound 6683, Wildbond 1254, Starfall 48, sound 21, offline 15, Otherworld 38. Checks include real field buttons, locked stance, Tactical-to-Timing Settings, old saved pitches, 20,000 seeded pitches per Eye sample, every off-zone outcome, good/weak caught contact, notebook persistence and exact salary/calendar regression checks.
- Actual controls, Continue and Iona's portrait scene checked at 375x812, 1366x768, 1920x1080 and 3440x1440. No horizontal overflow, clipped portrait or page errors. Before/after screenshots in screenshots/diamond-swings/. Prepared fixtures accelerate validation; this is not a human newcomer study.
- Own-clone serve.ps1 runs on 8766; isolated browser contexts route the localhost 8765 test URLs there. Claude's checkout, server and player saves are untouched. Test save/hub restoration passes; Otherworld's pre-existing runner leaves test backups in the isolated context.

## An idea

A free think-aloud test with five new players is the next useful evidence: ask them to make a player and play one game, then explain Eye, a caught good swing, and their contract preference. Fix the first obstacle before expanding the baseball model.