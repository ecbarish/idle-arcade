# Diamond Career: the first call-up and first payday

T34 / D0 + the first D1 slice. Codex, 2026-10-08. This is a browser prototype, not a complete baseball career or a
physics simulation. The club, players, art and two shared-engine tunes are original. All dollars are game currency.

## Design

The Brackenport Lanterns play at Lamplight Field, under evening light with a crowd, a pitcher and a batter. Coach
Iona Vale introduces the six-game development series. A locker room separates the games; a home and garage give
the first payday a visible destination. No borrowed teams, images, music or new dependencies.

The creator asks for a name, batting hand and a look. **Timing** batting uses Space/Enter or a swing button when
the ball reaches the plate. Ready starts each pitch deliberately; results wait for Continue. **Tactical** batting
lets you read the release, guess a fastball/curve/change-up and choose Patience, Contact or Power. Settings can
switch styles without changing the count, pitch or seeded random state. Settings, save tools and hidden tabs pause
the timing clock. Reduced motion stops crowd/flag motion and contact flight; the essential timing indicator remains.

Contact helps put the ball in play; Power increases extra bases; Eye helps Patience judge the zone. Fatigue lowers
Contact. One free preparation before each game offers +2 to a skill or a full rest. Preparation survives reload.
Two key at-bats per development game are playable; the rest uses the same pitch matchup model. Good manual reads
or timing improve probabilities, with no guaranteed hits or homers. Pitch animation shows the model's outcome.

## Baseball boundaries

Four balls walk a batter; three strikes make an out; a foul cannot be strike three. Three outs clear the bases
and change sides. Both halves advance the inning, with nine innings, ties going to extras, skipped bottom ninth
for a home lead and walk-offs ending at the winning run (all runners score on a home run).
Reference: [MLB's official rules](https://img.mlbstatic.com/mlb-images/image/upload/mlb/ub08blsefk8wkkd2oemz.pdf).

This first model only generates clean outs with runners holding, walks, and one-, two-, three- or four-base hits.
Hit advancement is fixed. There are no steals, errors, double plays, sacrifices, bunts, dropped third strikes,
pitching careers, fielding controls or team management. Those events are excluded from the outcome generator,
rather than displayed with incorrect rules. The notebook and at-bat help state this limit.

## Advancement and the paid week

The coach's visible senior call-up gate is **5 hits OR .300 on-base** over the six games. On-base is
(hits + walks) / plate appearances. Missing it offers a paid development place, not a dead end; the next series
can earn a senior place against the same gate. Successful Contact and Power builds are covered in the checks.

| Offer | Signing bonus | Calendar salary | Playable key at-bats per game |
|---|---:|---:|---:|
| Copperbank Rivets, Rotation batter | $320 | $240 on days +2, +4, +6 | 1 |
| Alder Quay Terns, Everyday batter | $180 | $170 on days +2, +4, +6 | 3 |

Games and quiet days advance the calendar. Every bonus/payment has a stable ledger ID; crossing dates catches up
payments without duplicating them on reload. This slice contains one signed contract with three salary payments;
repeat practice series are possible, but later contracts and full seasons are not built yet.

A **$300 apartment** brings a sofa, warm window and club shirt into the home scene. A **$420 car** appears in
the garage. Both are permanent, cosmetic purchases; no upkeep, expiry, debt, stat purchases or club-budget mixing.

## Validation

`tests/diamond.html` checks count/runner/inning/walk-off rules, 400 complete seeded games, both batting styles,
multiple six-game careers, two viable builds, preparation replay safety, actual contract playing time, calendar
pay, purchases, real shared saves/backups, old/empty/malformed saves and escaped names. Its iframe and test save,
hub progress and their automatic backups are removed/restored in `finally`, including after an injected exception.

The 400-game sample (seeds `i * 293`, default 58 Contact / 50 Power / 55 Eye, alternating fictional pitchers):

| Measure | Result |
|---|---:|
| Combined runs per game | 6.0275 |
| Batting average | .2864 |
| Walks / plate appearances | 1.891% |
| Strikeouts / plate appearances | 23.533% |
| Home runs per game, both teams | 1.41 |
| Highest single-team score | 14 |
| Games going to extras | 56 / 400 |

These are toy-model calibration results, not a claim of MLB realism. Walk frequency is low in unattended batting;
manual Patience and taking an out-of-zone pitch matter. Future balancing should examine that with real players.

Real UI playthrough: creator → keyboard timed swing → reload result → switch in Settings → all six games →
contract → calendar salary → both purchases → reload. Touch and reduced-motion controls tested separately.
375×812, 1366×768, 1920×1080 and 3440×1440 have no horizontal overflow; larger text checked at phone width.
Desktop keeps the world within the window while the career notebook scrolls; phone keeps a readable scene above
the controls. Shared sound starts off. Save download/import/automatic backups use the existing shared tools.

Review images: [before cabinet](screenshots/diamond-career/cabinet-before.png),
[after cabinet](screenshots/diamond-career/cabinet-after.png),
[phone at-bat](screenshots/diamond-career/park-phone.png),
[ultrawide at-bat](screenshots/diamond-career/park-ultrawide.png),
[home and garage](screenshots/diamond-career/home-desktop.png).

## An idea

Next, let Iona's scouting notebook remember two or three decisions—a patient walk, an over-eager swing, a recovery
day—and turn those into short personal coaching beats. Keep the actual call-up rule visible, rather than adding
hidden roster gates. That gives the career a voice before adding an entire league calendar.
