# Realmbound launch pacing audit

Codex, 2026-10-07. Lane A3 / L7b / R8. Review proposal, not a launch sign-off.

## Finding and proposed adjustment

The fresh-account Classic runs took only 9.53–10.93 hours from 40 to 60, against the design's roughly 20-hour target. Completed quest chains front-loaded XP; the last level took only about three minutes. Barrowfields, Hollow Crown and Crown's Heart now award 60% of their previous hero kill/quest XP from hero level 40 onward. Earlier zones and early entry at 38 retain their XP. No global XP curve, combat stats, item ladder, group split, journey choice or save format changes.

This is a substantial zone balance proposal for Claude to accept or revert. Classic now takes 19.91–23.77 hours from 40 to 60. The endpoint still has quest-driven bursts: the target is not achieved uniformly at every level. A 50% trial overshot the band (roughly 24–31 hours) and is not the proposed setting.

## Repeatable method

Serve the clone with serve.ps1. With an existing Node/Playwright and Chrome runtime (no install or build step):

```powershell
node tests/realmbound-pacing-run.cjs
```

PACE_URL defaults to http://localhost:8765/games/realmbound/; PACE_CHROME, PACE_OUTPUT, PACE_CLASSES and PACE_JOURNEYS can override defaults. This audit used the isolated clone on port 8766. The runner creates a fresh browser context per case and never writes a real player's save. The diagnostic core is not loaded by the game or the normal check page.

Seed 230045, Human Concord hero, each class, all three journeys. Actual step(.1), document actions, quests, fights, Focus abilities/reactive windows, gear drops, talent spending, travel, shops, companion invitations, hunter taming/feeding, supply jobs and guild founding. Five fresh benched workers supply the legal founding signatures and jobs; companions join naturally. Game time advances Date.now so jobs and guild mood really run. Quests are completed before leaving their zone. Normal dungeons use the existing LFG, then Rootrot and Heartwood Heroic 1 are cleared with earned gear. Successful automatic LFG requeues are left after their clear is recorded. No XP, money, equipment, levels, HP or wins are granted by the policy.

Presentation timers, rendering, sound, dialogue reading and saves are suppressed. This is one deterministic strategy with ideal input, companions and workers; not a human playtime forecast, a solo balance test, every talent build, or a rested/offline/raid audit. “Every system on” means naturally earned systems available during 1–60; the post-cap raid is unlocked, not cleared. Rested XP starts at zero in this continuous playthrough.

## Results (hours)

“Complete” additionally requires ch14 and Heroic 1 clears of Rootrot and Heartwood; to-60 can precede that endpoint.

| Journey | Class | 1–40 | 40–60 | To 60 | Complete | Deaths |
|---|---|---:|---:|---:|---:|---:|
| breezy | warrior | 5.78 | 10.12 | 15.90 | 15.97 | 0 |
| breezy | priest | 6.54 | 12.46 | 19.00 | 19.06 | 0 |
| breezy | mage | 6.43 | 12.13 | 18.56 | 18.62 | 0 |
| breezy | rogue | 5.53 | 10.43 | 15.97 | 16.02 | 0 |
| breezy | hunter | 5.92 | 10.31 | 16.23 | 16.28 | 0 |
| classic | warrior | 10.51 | 19.91 | 30.43 | 30.49 | 0 |
| classic | priest | 12.30 | 23.77 | 36.07 | 36.14 | 0 |
| classic | mage | 11.83 | 21.91 | 33.74 | 33.80 | 0 |
| classic | rogue | 10.96 | 19.92 | 30.88 | 30.94 | 0 |
| classic | hunter | 11.07 | 20.17 | 31.24 | 31.29 | 0 |
| long | warrior | 19.95 | 36.95 | 56.90 | 56.95 | 0 |
| long | priest | 22.27 | 41.65 | 63.92 | 64.00 | 0 |
| long | mage | 21.07 | 38.82 | 59.88 | 59.94 | 0 |
| long | rogue | 20.28 | 36.09 | 56.37 | 56.42 | 4 |
| long | hunter | 20.61 | 37.24 | 57.85 | 57.91 | 0 |

All 15 finish all 76 quests, all five normal dungeons and both required Heroic 1 clears. Long Road rogue dies four times and still completes. All other cases have no deaths. Heroic records show two clears, best tier 1; four runs include two immediately left LFG requeues. Hunter earns its pet, feeds it, and all cases earn riding, talent points, addons, guild members and supplies.

## Classic before/after and endpoint minutes

| Class | 40–60 before (h) | After (h) | 40→41 after (min) | 59→60 after (min) |
|---|---:|---:|---:|---:|
| warrior | 9.53 | 19.91 | 26.40 | 37.42 |
| priest | 10.93 | 23.77 | 30.90 | 49.30 |
| mage | 10.60 | 21.91 | 31.94 | 41.19 |
| rogue | 9.90 | 19.92 | 28.32 | 36.79 |
| hunter | 9.59 | 20.17 | 28.20 | 37.62 |

Raw records: [before (five Classic)](measurements/realmbound-launch-before.json), [after (15 cases)](measurements/realmbound-launch-after.json). Per-level times, gear, addons, party, jobs, guild, pets, quests and dungeon records are retained. The checked-in portable runner reproduced the Breezy warrior record byte-for-byte.

## Checks and remaining review

23 new browser checks cover every zone at levels 38/40, party/guild/journey composition, whole quest awards, rested consumption after scaling, and preservation of old earned XP. Three pre-existing save-resumption fixtures now grant the actual award needed for their intended one-level advance. R9's 2613 Heroic/loot checks remain in place; see [the Heroic review](realmbound-heroic-review.md). This audit additionally exercises real combat and earned loot through Heroic 1 for each class.

All five check pages pass: Realmbound 4173, Wildbond 1213, Starfall 48, sound 21, offline 15. Save and hub state are restored, with zero browser page errors. No game version, cache version or offline file changed. Manual Auto, solo, alternate builds and longer Heroic combat still need review; broadening those is preferable to claiming the launch balance is finished.
