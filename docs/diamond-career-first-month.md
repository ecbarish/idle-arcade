> T36 follow-up: the first-month accounting below stays unchanged. The deliberate second-month road chapter and the in-world UI are now documented in [Diamond Career: the world and the road](diamond-career-world.md).

# Diamond Career: the second contract and first month

Lane A4b / D1, Codex, 2026-10-08. Builds on [the first-payday slice](diamond-career-first-payday.md) and the approved [sports-career direction](plans/sports-careers.md). The same batter-versus-pitcher stats model and both batting styles remain authoritative; no physics engine, new sport, club management or unattended career mode.

## A playable month

After the six development games, the first paid term remains six calendar days with six possible daily games. Its original two offers, three salaries and signing bonus are unchanged. At its end the player chooses a second contract, staying or changing clubs. Both offers explicitly show actual bonus, installment dates, stated value, role and term end.

| Second offer | Signing bonus | Four installments | Total stated value | Playable key at-bats/game |
|---|---:|---:|---:|---:|
| Copperbank Rivets, rotation batter | $400 | $260 each, days +6/+12/+18/+24 | $1,440 | 1 |
| Alder Quay Terns, everyday batter | $240 | $190 each, same dates | $1,000 | 3 |

The renewal lasts 24 calendar days, with two six-game series. Finishing each game advances two days, including time between matches. A player can choose quiet days instead; salary is guaranteed by its dates, not hits. Every contract choice is manual. Playing each opportunity gives 18 professional games across the first 30-day month, plus the six opening development games. After the first renewal series, Begin another six-game series resets only that series's evaluation record. Career totals, month totals, money and possessions persist. Each completed six-game evaluation can earn the same transparent senior target; resting alone does not promote a development renewal.

With no quiet-day substitutions and first signing on day 7: first-term games fall on days 7–12 and first salaries on 9/11/13; the second contract starts day 13, games on 13/15/17/19/21/23 and 25/27/29/31/33/35, salaries on 19/25/31/37. Day 37 closes the played days 7–36. Those dates describe calendar advancement, not a promise about real play time.

The month closes on a personal recap: actual games and wins, hits, walks, batting average/on-base rate, total career income and remaining cash. Home and car remain visible, permanent and purchasable with earned cash. This bounded chapter ends there, without automatically inventing another month or third contract. There is no upkeep or wall-clock calendar. Club and personal budgets remain separate; there is no club budget yet.

Iona reacts to actual game hits/walks or a hitless game. Her notebook keeps up to six short memories of real manually earned patient walks, early timed swings and resting tired legs, at most one per kind/day. These are feedback, not hidden promotion requirements or paid stat bonuses.

## Save and salary safety

The save key and schema remain unchanged. Optional fields are month, contracts (the first completed term), notes and contract.generation. Raw old saves remain valid; migration defaults the arrays and the original term generation. The original signing and salary-0/1/2 ledger IDs stay intact. The second signing and four installments use contract-1-* IDs. Repeated signing, date catch-up, renders and reloads cannot pay an existing event twice. No money, record, active pitch, purchases or old history is rewritten.

An original prototype save with an existing paid contract begins its tracked month on its current saved day, preserving even a previously unbounded calendar date. This avoids retroactively inventing monthly stats. The original salary schedule still follows its original signing day. An expired original term offers renewal; a migrated month with spare days after the second term can be closed deliberately without playing another game. Invalid optional fields are rejected by the existing shared validator. Purchases and records survive the close.

## Validation

- All seven pages pass: Diamond 83 (27 new checks), Realmbound 4173, Wildbond 1254, Starfall 48, sound 21, offline 15, Otherworld 38. This branch starts from main 1662841; Realmbound's independent onboarding PR #47 adds its own 234 checks when merged.
- All four first/second contract combinations complete a fresh six-game opening and full 18-game professional month, with exact stated cash and recorded stats. Actual role opportunities, installment/next-pay dates, quiet-day expiry, no duplicate signing/salary, no third term, mid-pitch migration, month close, permanent purchases and malformed field rejection checked.
- UI renewal selection, real training/at-bat buttons, touch Take, real style Settings, pitch-preserving reload, controlled calendar completion, purchases and final reload checked at 375x812, 1366x768, 1920x1080 and 3440x1440. Default muted, reduced motion, no horizontal overflow or page errors. Synthetic milestone setup accelerates these tests; they are not a human newcomer study.
- [Before/after screenshots](screenshots/diamond-career-month/phone-offers.png) include baseline main's exhausted first-payday screen, the new offers and the month recap. Isolated browser profiles and the own-clone serve.ps1 server on 8766 leave Claude's checkout, 8765 server and player saves untouched. Existing Otherworld test backup behavior is unchanged.

## An idea

Next, have a teammate remember one of these recorded choices in a short scene after a series. Build relationships from actual shared games before adding an entire league-management layer.

Combined browser validation also served PR #47's Realmbound sources alongside this branch without a Git merge: all seven runners passed together (Diamond 83, Realmbound 4407).
