# Diamond Manager, playtest 1 (DM2)

Claude (Playtester thread), 2026-10-09, v0.1.0. I started from a fresh save at desktop (1280x800) and phone
(390x844) size, played the first games by hand, then played two full seasons through the real buttons. To check
the balance I also simulated 24 seasons with the game's own functions: six leagues, two seasons each, once as a
hands-off manager and once as an active one. The scorecard and bar are in [../PLAYTEST.md](../PLAYTEST.md).

## Score against the bar

| What | How | Loop | See | Fun | Phone | Total |
|---|---|---|---|---|---|---|
| 3 | 3 | 3 | 2 (was 1) | 2 | 2 | **15: passes** |

Compared with Diamond Career (9), this is a different game. Iona's welcome explains the job in four lines, "Play ball
(Space)" is always the big button, the play-by-play reads like a radio call, and Iona explains each result
("Our weakest bat is Lena Marsh (overall 46). A trade or a free agent could help"). A newcomer can finish a game in
two clicks and a season in a few minutes.

## The first five minutes: what was unclear

1. **The players on the field were specks** (about 17 pixels tall on a 1280-pixel screen), the same scale problem
   Diamond Career had. *Fixed:* people now grow with the park, so they're about 2.5 times bigger on a computer and
   unchanged on a phone ([watching-after-fix.png](diamond-manager-1/watching-after-fix.png)).
2. **Nothing said there was money to spend.** You start about $2.5M under the owner's budget, but only the Roster page says
   so. *Fixed:* Iona's welcome now gives the room in dollars and points to the Free agents page.
3. The trade page lists 16 players a side with checkboxes, and a first-timer doesn't know what's fair. Iona's answer
   ("Not quite...") helps. Left as is; a "suggest a fair trade" button would help later.

## Numbers that felt wrong

- **Batting averages and records look like baseball.** Season leaders hit .300 to .380 and the weakest regulars .100
  to .180. Club records ranged from 4-26 to 25-5. No .400 hitters, no 29-1 clubs.
- **The real problem: what you do barely changes the results in two seasons.** Hands-off, the Lanterns averaged
  10.8 wins out of 30. An active manager (sign the best free agents that fit, let Iona set the order, build the park)
  averaged 10.2 when it also accepted every trade offer, and 10.3 when it declined them. Every one of the 24 seasons
  finished 3rd to 6th. Three causes:
  - The budget is $7.5M against rivals' $13.5M, and the owner raised it only after a *winning* season, which a
    losing club can't reach. *Fixed:* a season with more wins than the last now earns a $200K raise (a winning
    season stays at $300K), with a check in `tests/diamond-manager-checks.js`.
  - Free agents are generated around overall 50, about the same as the players you already have, so signing them
    is a sideways step.
  - Building the park spends the cash, but seats and lights pay back slowly, and training adds only one point a
    season.

The raise alone won't make managing feel powerful. That's a design call for the sports thread (ticket below), not
something to tune blind.

## Fixed in this pass

| Fix | Files |
|---|---|
| People on the field scale with the park | `games/diamond-manager/js/field.js` |
| Iona's welcome shows the room under the budget and points to free agents | `games/diamond-manager/js/ui.js` |
| The owner rewards a better losing season ($200K), with a check | `games/diamond-manager/js/league.js`, `tests/diamond-manager-checks.js` |

All ten browser suites pass (`node tools/run-all-checks.cjs`; the Godot suites were skipped because Godot isn't
installed here).

## Handed to the sports thread (a ticket for docs/plans/sports-management.md)

**DM-B: make the general manager's choices visibly matter.** Target: across simulated seasons, a sensible active
manager should finish about 3 to 5 wins a season ahead of a hands-off one, and reach the final by about season 3.
Options to weigh: one or two standout free agents each offseason (overall 58 to 62, asking real money); faster
growth for young players with training rooms; the AI's trade offers shown with Iona's opinion ("this helps us" or
"this helps them"). Re-run this playtest after it lands.

On a phone: the game plays, the field is small but readable, and the roster table scrolls sideways inside its box.
That's fine for a test version.
