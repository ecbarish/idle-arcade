# R9: Rootrot and Heartwood Heroic loot review

Codex, 2026-10-07; Lane A2, branch `codex/realmbound-heroic-review`. Reviewed against main f1fc533.

## Decision

Keep the current dungeon data and runtime. Rootrot Hollow and The Heartwood Vault already share Sanctum and Foundry's earned Heroic ladder, three bosses with 2 / 2 / 3 drops, rare gear on earlier bosses and a final-boss Epic roll. There is no missing tier or missing loot table to repair. The higher-level item generator keeps increasing stats beyond level 60 while using its existing final name tier; a player-level cap does not truncate earned item levels.

## Normal rewards and difficulty

Health and damage below are the final boss's unmodified values. Encounter packs retain their own counts; no new names, encounters or mechanics are introduced.

| Dungeon | Entry level | Boss levels | Rare item levels | Final Epic level | Final HP | Final damage per swing |
|---|---|---|---|---|---|---|
| The Drowned Sanctum | 17 | 20 / 20 / 21 | 21 / 21 / 22 | 25 | 7416 | 128.25 |
| The Cindervein Foundry | 27 | 28 / 29 / 30 | 29 / 30 / 31 | 34 | 10440 | 180.00 |
| Rootrot Hollow | 49 | 50 / 51 / 52 | 51 / 52 / 53 | 56 | 18575 | 318.76 |
| The Heartwood Vault | 56 | 57 / 58 / 60 | 58 / 59 / 61 | 64 | 23085 | 380.70 |

Rootrot's boss health/damage multipliers (8.5 / 9.5 / 12.5 and 2.3 / 2.4 / 2.6) match the Silent Barrows' structure. Heartwood increases these to 9 / 10 / 13.5 and 2.4 / 2.5 / 2.7 for the level-56-to-60 finale. Sanctum and Foundry use 8 / 9 / 12 and 2.2 / 2.3 / 2.5. The higher bands consequently ask for more preparation without changing their reward count.

## Heroic rewards

Each tier multiplies enemy health and damage by `1.3^tier`, before the existing modifier effects. Tier 0 has no modifier, tiers 1-3 have one, and tier 4 onward has two distinct modifiers. Fortified adds 30% pack health; Tyrannical adds 30% boss health and 15% boss damage. The existing Raging/Tidal mechanics are unchanged.

Rare item level is boss level + 1 + 2 per tier. A final-boss Epic has three extra item levels. Its roll is per item, not one roll for all three drops: 15% plus three percentage points per tier, effectively capped at 100% by the random comparison. The raw threshold passes one at tier 29. Earlier bosses remain rare.

| Tier | Base health/damage multiplier | Modifiers | Rootrot final rare / Epic | Heartwood final rare / Epic | Final Epic chance per item |
|---|---|---|---|---|---|
| 0 | 1.000 | 0 | 53 / 56 | 61 / 64 | 15% |
| 1 | 1.300 | 1 | 55 / 58 | 63 / 66 | 18% |
| 4 | 2.856 | 2 | 61 / 64 | 69 / 72 | 27% |
| 10 | 13.786 | 2 | 73 / 76 | 81 / 84 | 45% |
| 28 | 1550.293 | 2 | 109 / 112 | 117 / 120 | 99% |
| 29 | 2015.381 | 2 | 111 / 114 | 119 / 122 | 100% |
| 40 | 36118.865 | 2 | 133 / 136 | 141 / 144 | 100% |

Enemy difficulty grows exponentially while item levels grow linearly. This is the existing endless challenge ladder, not a promise that every tier can be cleared at the hero level cap. No XP, currency, equipment budget or difficulty changes are made in this review.

## Browser verification

The scenarios exercise the real `startDungeon`, `spawnDungeon`, `dunKill`, loot panel and `afterDungeonPull` code. Rootrot and Heartwood run every tier 0-30 and tier 40; comparison runs cover Sanctum and Foundry at 0, 1, 4, 10, 28, 29 and 40. Checks cover skipped-tier rejection, earned-tier entry, distinct modifier counts, actual health/damage, no trash gear, exact 2/2/3 boss drops, rarity/item levels, valid generated equipment beyond level 60, the guaranteed-Epic boundary, collection before clear credit and once-per-run progress. A saved hero retains independent dungeon records and earned gear after migration. Random choices remain real; assertions cover every permitted outcome rather than requiring a lucky roll.

All five browser pages pass: **Realmbound 4150, Wildbond 1194, Starfall 48, sound 21, offline 15**. This adds **2613** Realmbound checks to main's 1537. Runners restore game saves and hub storage; no page errors. Served from the isolated clone using `serve.ps1` on port 8766; localhost:8765 test requests are intercepted and fulfilled from this server. Claude's checkout and server are untouched.

These are reward and progression checks, not full combat playthroughs or pacing measurements; they do not establish which party/gear can clear a tier. A later L7 combat balance pass can measure that separately. No visual changes, version bumps or cache-version changes.
