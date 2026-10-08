# Review: Gemini's Diamond Career report, checked against the real game

Claude, 2026-10-08. The report: [diamond-first-contract-research.md](diamond-first-contract-research.md). Checked against
`games/diamond-career/` as merged today (v0.2.0: the first payday plus the first month, PR #45 and #48).

## The short version

Gemini never saw the game (it says so), so it wrote general advice for a big licensed-style baseball game: 162-game
seasons, 3D cameras, salary caps, free agency. Most of that doesn't apply to Diamond Career, which is a small career
about one batter. **What it gets right, the game mostly does already** (playing only your own key at-bats, Contact
versus Power, a pitch guess, transparent targets). Three things are worth taking: **Timing mode should show Contact or
Power** (a real gap I found while checking), **say why a swing missed or became an out**, and **a five-person newcomer
test** (free, with friends).

## Each claim, against the code

| Gemini says | In the game today | Verdict |
|---|---|---|
| Newcomers need a forgiving Contact swing and a riskier Power swing | Tactical has Patience / Contact / Power (`03-ui.js`; Power costs 12 points of contact for more extra bases, `01-baseball.js` resolvePitch). **Timing mode has no picker: it silently reuses the last Tactical choice** (`S.stance`, default Contact) | **Take it, small:** show Contact / Power in Timing too |
| Tell the player exactly why a swing failed | Says early / late / on time, or the wrong pitch read, then miss / foul / out / hit. It does **not** say when a pitch was outside the zone (a hidden 19-point contact penalty), and "the fielder makes a clean out" doesn't say whether the contact was good | **Take it, small:** add "it was off the plate" and good-contact-but-caught wording |
| "Sit on a pitch": guess and be rewarded (Ambush hitting) | Tactical's pitch guess does this (right read: quality .88, wrong: .30), with a fallible cue (truthful 78%) | Already there |
| Take pitches; walks matter | Patience uses your Eye stat to judge the zone; walks count toward the call-up target (.300 on-base) and Iona notes patient walks | Already there |
| Play only your own moments, simulate the rest ("Player Lock", "Playable Highlights") | Exactly the design: 1-3 key at-bats per game, the rest simulated pitch by pitch with the same model | Already there |
| A 162-game season you can finish in 10 hours | The game is a short career: six development games, then a 30-day month of 18 games | **Reject** for now; a season is a later owner decision |
| Earn tokens and spend them on attributes | One preparation per game (Contact, Power or Eye +2, or Rest); you choose, and it's earned by playing | Already the same idea; no token currency needed |
| Upgrades should be *felt*, not just numbers (e.g. better pitch recognition slows the ball) | Stats change odds only; nothing visible changes | **Worth trying later:** e.g. a higher Eye makes the pitch cue more honest, shown in the notebook |
| Salary cap, free agency "Big Board", coaching credits | You are one player, not a club; personal money is kept apart from any future club budget (docs/plans/diamond-career.md) | **Reject now;** belongs to the much later club-management stage, if ever |
| Camera closer to the pitcher; catcher defense; power pitching | No 3D, no pitching or fielding career yet | Not applicable |
| "Manager Moments" for relatedness | Iona's notebook and reactions exist; Codex proposed a teammate who remembers a choice | Good fit for the next Diamond slice |
| Test with 5 people, think aloud, fix between players (RITE), score with SUS | No human test yet | **Take it,** but unpaid (friends and family), not $30-40 each |

## Corrections

- **Budget:** the ~US$200 is Evan's cash ceiling for the *whole project*, not a usability budget. The newcomer test
  should cost nothing: ask friends to play while talking out loud.
- **"Physics engine":** Diamond Career deliberately has none; outcomes come from the stats model and animation shows
  them (Evan's decision, 2026-10-08).
- **"Simulated statistics closely mirror real-world averages"** is not a goal we have set; the toy model's numbers are
  in the original prompt, and any target needs a real source.
- The SUS grade bands and the "5 users find 85%" figure are well-known rules of thumb (Nielsen and Landauer); the
  share page showed no citations, so treat the exact percentages as approximate.

## Proposed next Diamond Career ticket (for ChatGPT, after A5)

**D1c: swings you understand.** (1) Timing mode shows the Contact / Power choice before each pitch (Patience stays a
Tactical-only read), so no hidden carried-over stance. (2) Result text says when you swung at a pitch off the plate,
and separates "good contact, caught" from "weak contact". (3) One visible effect of Eye growth (for example the cue's
honesty rising from 78% toward 88%, written in Iona's notebook). Checks for each; no save changes beyond defaults.

## A newcomer test anyone can run (free)

Five people who haven't played, one at a time, about 15 minutes each, on the live site. Say only: "Make a player and
play your first game. Please think out loud." Don't help. Write down where they hesitate or misread something.
Afterwards ask: what does Eye do, why did your good swing turn into an out, and which contract would you pick and why?
Fix anything that stopped someone before the next person plays. (The 10-question SUS survey is optional.)
