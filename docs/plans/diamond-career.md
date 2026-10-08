# Diamond Career: first sports module

**Unparked 2026-10-08:** batter first, timing and tactical batting both (switchable); browser first. ChatGPT builds
**No physics engine (Evan's worry, 2026-10-08):** like Retro Bowl, New Star Soccer and Baseball Superstars, outcomes
come from a statistics model (batter vs pitcher, weighted rolls); the player acts in short readable moments (timing or
a tactical read); animation only shows the result. The rest of each game simulates. This is T34's approach.
part 1 (docs/ROADMAP.md T34).

Status: planned concept only; no playable game directory. Implementation remains parked until explicitly authorized. See [the expanded sports-career plan](sports-careers.md) for the owner's multi-sport, player-to-management and salary/lifestyle direction. Baseball is the first module, not the limit of the project. [Research](RESEARCH.md#diamond-career-understandable-advancement-short-playable-moments); [portfolio plan](README.md).

## The experience to protect

Live a player's career: earn a place, make decisions in consequential at-bats, train for a role, receive a contract and decide what to do with its money. Most of a season can simulate; the player steps into meaningful moments. Club management is a later career destination, not the opening screen.

The backlog specifies creating a player, earning/spending a contract and eventually managing the club. We have no agreed baseball simulation, progression model or roster data yet. Start with original fictional clubs and players. Nothing requires licensed teams, real player likenesses or an MLB-sized calendar.

## Staged development

| Stage | Concrete scope | Completion gate |
|---|---|---|
| D0: an at-bat worth playing | One original player role, readable count/outs/base state, simple pitch cues and contact/power/patience choices; a short fictional series. | A tester understands why a swing or take succeeded/failed; the count and scoring are correct; keyboard and touch work. |
| D1: the first contract arc | A short minor-league season, a few training/rest decisions, salary, a home/garage purchase and coach feedback; explicit promotion evaluation. | Stats and feedback agree; at least two viable player builds can earn promotion; a save resumes mid-season. |
| D2: a professional career | More roles and opponent styles, contracts with actual tradeoffs, relationships, awards and meaningful series moments. | Choosing a contract changes opportunity or training access; progression is not just overall rating gates; simulated games remain credible. |
| D3: a career beyond playing | Retirement, mentoring and optional club management using the same fictional league history. | A career's accomplishments survive retirement; ownership/management has a distinct loop instead of more player-career menus. |
| D4: stronger presentation | Stadium scenes, pitch/contact animation, commentary snippets and optional richer camera views. | Art clarifies the play; mobile performance and input fairness remain acceptable; simulations do not depend on rendering. |

D0 should be one player position and one style of active moment. Pitcher careers, fielding and full team management can wait until batting plus career progression earns another mode.

## First proposed prototype

**First call-up.** One batter starts on a fictional development club. A compact series offers a few leverage situations; the rest simulates from the same player/opponent model. Between games choose a training focus or recovery. At the series end, the coach explains the evaluation using visible thresholds and a role opportunity.

A working starting rule can combine contact performance, discipline and current roster needs, but exact values must be specified before code. Explain any roster blockage: performing well does not create an empty roster spot, yet the player deserves to know the opportunity and alternatives. Narrative messages must be based on the actual results.

The first experiment should support both timing-based batting and a slower decision-oriented mode if the owner wants that accessibility. Manual success may improve odds; it should not guarantee a home run. Seeded simulations should make active-vs-sim comparison possible without pretending they represent real league statistics.

## Apply the comparison lessons

Road to the Show provides the career fantasy, but the reviewed uncertainty around promotions is an explicit problem to avoid. Baseball Superstars supplies the smaller career/overworld pattern, while its reviewed limits warn against too many care meters. Super Mega Baseball demonstrates that understandable traits and stylized players can support depth; its Franchise mode is inspiration for the eventual manager phase, not evidence of a ready-made single-player career design.

Salary should fund lasting homes, cars, personal style and opportunities alongside equipment/training. The first contract arc includes a modest home upgrade and car in a visible home/garage scene. Keep personal and club budgets distinct, and make two offers change what the player can afford and how much they get to play. Do not require endless upkeep or a full open-world city to make a purchase matter. Bad slumps should lead to understandable adjustments and meaningful recovery choices rather than generic negative dialogue regardless of performance.

## Validation and groundwork

Separate baseball rules, matchup probabilities, season scheduling, career state and drawing. Test strikeouts/walks, count limits, outs, advancement/scoring, inning completion, active choices, simulation totals and season rollover. Start with a small named set of stats that visibly affect outcomes. Keep an event record for the current match and the player's career milestones.

Later technical upgrades could add more direct batting/fielding control, but require input latency and device checks. Multiplayer and a complete physics engine are not initial requirements. Reuse generic formatting/save helpers while giving the baseball game its own progression model.

## Owner decisions

Batter first or pitcher first? Should batting primarily test timing, tactical choices, or offer both? How stylized versus simulation-heavy should results feel? Does Evan want a short career he can replay, or one player he develops over many weeks? These are the decisions needed to turn D0/D1 into an approved spec; code remains parked until then.

## Control range and device target

Evan confirmed fully manual through fully automated modes for every game. This initial at-bat prototype is a limited manual slice; later pitching, fielding, baserunning and full-match control are explicit milestones. Career decisions and manager responsibilities need separate delegation switches, not a single “simulate match” toggle. Desktop keyboard/mouse and phone touch are required; VR is deferred. Follow [the common control contract](README.md#manual-through-fully-automated-play).
