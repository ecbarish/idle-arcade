# Diamond Career: the world and the road (T36)

The game now fills the window. Career information lives in the Clubhouse's locker, wall calendar and Iona's notebook; your Home holds the permanent purchases and pay envelope. These are buttons anchored to the drawn objects. Opening one shows a readable sheet over the scene; Put Away or Escape returns to the world. The coach speaks through the shared portrait dialogue. Timing and Tactical both use field controls, and nothing covers the field during a timed throw. The existing save tool and Settings remain separate exceptions for those purposes.

## The second month

After the recorded first month, the player can deliberately sign a thirty-day road term in the same role. There is no signing bonus. It retains the renewal wage and playable turns:

| Role | Salary | Dates relative to signing | Term total | Key at-bats per game |
|---|---:|---|---:|---:|
| Rotation batter | $260 | +6, +12, +18, +24, +30 | $1,300 | 1 |
| Everyday batter | $190 | same | $950 | 3 |

Three original towns host six games each: **Sablebay**, with the sea and lighthouse at **Breakwater Park** (Tamsin Holt); **Fircrest**, with mountain ridges at **Switchback Field** (Oren Pike); **Brickmere**, with old downtown brick at **Foundry Square** (Della Quill). Their clubs are the Pilots, Ibex and Coppers; none is a signed home club. The baseball, pitch, count and scoring rules are unchanged. These local people introduce their parks in portrait scenes and have a different greeting if a later season returns you there; visit counts persist. Later seasons are not built in this ticket.

Each bus trip has exactly one preparation: Rest removes up to 12 fatigue; film adds three Eye for the first game, including its real pitch cues, then expires when that game is accounted; cards improve clubhouse standing by one, reflected in the team invitation and notebook. No betting, free wages or permanent stat farm. The choice is saved before the arrival dialogue. A reload cannot grant it again.

The three series start on relative days 0, 10 and 20. Each road game advances one day. Taking the next bus deliberately moves to that series's date and catches up any salary exactly once. You may substitute quiet days, miss opportunities or finish with no games; wages follow dates, never hits. With first signing on day 7 and a normal full first month, the road starts on day 37, plays on 37–42, 47–52 and 57–62, pays on 43/49/55/61/67, and closes on 67. Remaining quiet days are chosen by the player; nothing runs offline. The road recap preserves purchases, records and cash.

## Compatibility

`diamond-career-save-v1` and schema 1 stay. Optional `road` and `visits` fields have defaults; contract generation 2 is the deliberately signed road term. Existing generations, signing and salary IDs are unchanged. First-month stats are kept as their own recap, rather than overwritten. Road salaries use `contract-2-salary-*` IDs. Validator checks the new nested data; old saves, active pitches, exact RNG/reads/count/bases, old receipts and permanent purchases remain intact. No versions bumped: Claude does that on review.

The original UI render helpers are reused for creator, offers and match reports. Paperwork and routing are in the new `09-world-ui.js`; road data and state in `08-road.js`. Existing numbered files receive the small integrations. All art is original code; no installs or external assets. Godot and other games are untouched.

## Validation

- All eight browser pages pass: Diamond Career 122, Realmbound 7,713, Wildbond 1,354, Starfall 48, sound 21, offline 15, Otherworld 831 and runner safety 35. Zero page errors, exact restoration of seeded save/hub/recovery bytes.
- Full second months in both styles and both roles: 18 counted games, exact five salaries, first-month receipts/statistics unchanged; no repeated contract or bus choices, expired film, remembered local visits, date catch-up, quiet-day closure, malformed imports and old-save defaults.
- Actual browser UI at 375×812, 1366×768, 1920×1080 and 3440×1440: creator, coach training, field tap to swing, manual bus film choice, salary calendar, car purchase, exact mid-pitch reload, all three skylines and Tactical controls. Reduced motion and default mute; no overflow. The stage fills the viewport; sheets fit inside it and trap Tab focus until put away.
- Static booklet updated to the new places/road chapter and an actual Breakwater screenshot. All guide links, anchors and images work at all four widths, closed spoilers, keyboard skip link, no script/save changes.

Screens: [before panels](screenshots/diamond-career-world/before-panels-1366.png), [after world](screenshots/diamond-career-world/after-world-1366.png), [phone Clubhouse](screenshots/diamond-career-world/clubhouse-375.png), [phone bus](screenshots/diamond-career-world/bus-375.png), [ultrawide sea park](screenshots/diamond-career-world/sea-3440.png), [mountains](screenshots/diamond-career-world/mountain-1920.png), [brick park](screenshots/diamond-career-world/brick-1920.png).

## An idea

Let the next season's local recognition open one small story about that park, rather than immediately adding more clubs. Their visits already remember the player; use that to make returning feel different before expanding the league.