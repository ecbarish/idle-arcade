# Wildbond launch pacing audit (L7a / W8)

Codex, 2026-10-07. Baseline: main `89ade09` (`00-data.js` blob `ab0aa26`).
The final comparison uses the same player policy, seed and game systems before and after tuning.

## What changed

Only wild/trainer level data changes in the game:

| Encounter | Before | After |
|---|---|---|
| Stillreed wild range | 52-60 | 46-60 |
| Stillreed Wren | 52 / 54 / 55 | 46 / 48 / 50 |
| Stillwake | 57, legendary | 50, legendary |
| Evren route trainer | 52 / 53 | 48 / 49 |
| Tavil route trainer | 54 / 55 / 56 | 52 / 53 / 54 |
| Olan | 54 / 55 / 57 | 53 / 54 / 55 |
| Senna | 60 / 61 / 63 | 58 / 59 / 60 |
| Halen | 65 / 66 / 68 | 63 / 64 / 65 |
| Rysa | 69 / 70 / 72 | 68 / 69 / 70 |

Cloudglass's Warden ace is 44. Stillreed originally began eight levels higher; a cautious player had to
train in Cloudglass first. Its entry now starts two levels above that ace. Wren and the first route trainer
introduce the new band before Olan tests the incoming cap of 55. Stillwake retains its species, rarity,
capture rules and story. Lowering only the wild floor made the early guardian an even larger jump;
the final comparison includes its corresponding level adjustment.

The last four Wardens originally exceeded the player's incoming caps (55 / 60 / 65 / 70).
Their aces now meet those caps, so choosing Hard cap does not put every late badge opponent above
the player's ceiling. Species, moves, evolution thresholds, XP and coin rates, weather, maps, dialogue,
save structure, league rules, Spire rules, versions and online-first caching are unchanged.

## Reproduce

Start `serve.ps1` from your own clone. With an **existing** Node, Playwright and Chrome installation, run
`node tests/wildbond-pacing-run.cjs` from the repository root. It does not install anything.
`PACE_URL` overrides the localhost game URL; `PACE_CHROME` overrides Chrome's path;
`PACE_OUTPUT` selects the JSON output file. `PACE_JOURNEYS` and `PACE_MODES` accept comma-separated
subsets. Defaults run all three journeys and Normal / Nuzlocke / Randomizer / Solo / Hardcore.

The runner creates and closes a fresh browser context per case. It never connects to the player's profile.
It loads `tests/wildbond-pacing.js` only into these diagnostic contexts; the game and normal check page
do not load that script. Both global `Math.random` and the game's captured random helper use seed 42
(installed before scripts load). Every case starts with Ripplet, default Soft cap and XP share off.

Every simulated step calls **worldTick(0.1)**, including real-speed walking, tall-grass finds, battles,
ranch days, food costs, fatigue, injury, training, XP, rival/guardian/route-trainer fights and result delays.
The player buys supplies with earned coins, takes free rests outside locked attempts, challenges Wardens
near their aces and trains in the previous area if the next wild floor is more than two levels above the team.
It catches two partners and uncaught guardians with the real lure/meter/chance rules, then uses the existing
Ranch/Team click handlers to replace a weaker partner when the captured creature's stat score is 15% higher.
Solo keeps its starter. It uses Focus, telegraph Guard and Rally (never Rally in Hardcore), with perfect
meter timing. It trains to 75 before the league and uses the actual league and Spire functions and rests.
No wins, badges, titles, HP, XP, money, genes, traits or capture rolls are granted by the simulator.

Presentation timers, rendering, sound, saving and dialogue reading are suppressed. Scenes are skipped
through the actual callbacks. Times are **simulated active play**, excluding reading, menu decisions and
human reaction delays; they are not promises of a human completion time. One seed, one starter and one
policy do not cover every matchup or combined challenge. This policy retries difficult story fights rather
than fleeing them, which particularly inflates Solo losses. A failed Nuzlocke is recorded even when Maren's
normal second-chance journey subsequently reaches the ending. Those continuations are not Nuzlocke wins.

## Measurements

Total simulated hours from choosing the starter. Each row is a separately seeded fresh game.

| Journey | Mode | Champion before | Champion after | Spire 10 before | Spire 10 after | Losses before / after |
|---|---|---:|---:|---:|---:|---:|
| breezy | normal | 17.49 | 17.15 | 17.50 | 17.17 | 6 / 6 |
| breezy | nuzlocke | 17.32 | 16.93 | 17.34 | 16.94 | 0 / 0 |
| breezy | randomizer | 17.67 | 17.45 | 17.69 | 17.46 | 6 / 6 |
| breezy | solo | 28.45 | 28.40 | 28.47 | 28.42 | 321 / 319 |
| breezy | hardcore | 17.26 | 17.01 | 17.28 | 17.03 | 1 / 1 |
| classic | normal | 47.46 | 46.55 | 47.48 | 46.56 | 5 / 5 |
| classic | nuzlocke (failed; second chance) | 48.60 | 47.94 | 48.62 | 47.95 | 7 / 7 |
| classic | randomizer | 49.01 | 47.71 | 49.03 | 47.72 | 7 / 7 |
| classic | solo | 77.22 | 75.27 | 77.24 | 75.31 | 665 / 354 |
| classic | hardcore | 48.18 | 47.30 | 48.20 | 47.32 | 1 / 1 |
| long | normal | 77.77 | 76.21 | 77.79 | 76.22 | 3 / 3 |
| long | nuzlocke (failed; second chance) | 78.90 | 77.07 | 78.92 | 77.08 | 7 / 7 |
| long | randomizer | 80.20 | 78.85 | 80.21 | 78.87 | 4 / 4 |
| long | solo | 123.35 | 121.81 | 123.41 | 121.83 | 762 / 588 |
| long | hardcore | 77.80 | 76.86 | 77.81 | 76.88 | 1 / 1 |

**Nuzlocke outcome:** Breezy completes with the mode intact. Classic and Long Road lose the mode at 2.68 minutes in Thornwood in both datasets; their listed end times are Maren's normal second-chance journeys. No Nuzlocke completion is claimed for those rows.

Normal Classic reaches the fourth badge at 13.34 h in both runs; the fifth moves from 23.68 to 22.60 h, all eight from 40.22 to 39.24 h, and Champion from 47.46 to 46.55 h. This is a smoother entry and a modest reduction, not a wholesale shortening of the journey. Solo remains substantially slower and its retry-heavy loss counts are policy-sensitive.

Raw checkpoints, teams and failed challenges: [before](measurements/wildbond-launch-before.json), [after](measurements/wildbond-launch-after.json).

## Validation and remaining playtest work

All five native browser check pages pass: Realmbound 4150, Wildbond 1213, Starfall 48, sound 21,
offline 15. Every runner restored the pre-existing save/hub/backup keys and produced no page errors.
The 11 new Wildbond scenarios exercise actual Warden opponent construction at each incoming Hard cap,
the level-44 Stillreed entry encounter, adaptive wild bounds, and an older over-cap guardian save.

No soft-lock was reproduced by the final strategy. An initial pilot kept weak early partners, raised its
training target above the cap after any loss and retried the same Spire team; its long stalls were policy
failures and are excluded from the before/after measurements. Replacing captured partners cleared the
league and floor 10 through existing rules. No new battle or progression mechanic was added.

Broader items for review: the league still resets when the five-minute ranch day turns during a battle;
slow or distracted attempts can lose their room progress. The Spire still uses the player's cap choice;
Soft growth beyond 75 is a trickle and Hard prevents it. Neither rule was changed under the level/XP-only
scope. Manual runs with less trained teams, different starters/seeds, Hard/No cap and combined modes
remain useful launch playtests. The failed Classic/Long Nuzlocke starts also need a cautious human pass
before describing challenge difficulty as launch-ready.
