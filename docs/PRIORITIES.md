# Priorities: where the focus goes

Evan (2026-10-09): "We need to better manage prioritizing and what direction to go and where focus should be as I
have more ideas and ambitions." This page is the answer. It is short on purpose. **Every assistant reads it before
picking work**, and the ordering in docs/DEVELOPMENT-PATH.md and docs/QUEUE.md follows it. Evan's word always wins;
when he says "focus on X", change the focus table below and note the date.

## Why this exists

By 2026-10-09 the arcade had nine games or game ideas, two engines, three assistants and about 70 open deliverables.
The old rule ("take the earliest milestone of *any* game, prefer the one with fewest PRs") spreads effort evenly, so
every game moves a little and none of them gets finished. Ideas arrive faster than games ship. Two fixes:

1. **Focus slots:** only a few games are built at once; the rest wait their turn on purpose, not by accident.
2. **One scorecard:** every new game idea, improvement or feature is judged the same way, so the order is explainable.

## 1. Focus slots

| Slot | Share of build effort | What it means | Now (2026-10-09) |
|---|---|---|---|
| **Flagship** | about 60% | The game we are finishing. Its next milestone comes before anything else in Claude's lane, and ChatGPT's data and writing for it comes first in Lane A. | **Wildbond (Godot)**, toward version 2.0 |
| **Second** | about 25% | Grows steadily, one milestone at a time. | **Starfall village (Godot)** |
| **ChatGPT's own** | ChatGPT's time after flagship support | One browser game ChatGPT moves forward. | **Realmbound** (the game window, phone pass, the second raid tier) |
| **Keep alive** | about 15% | Bugs from friends, small fixes, playtests. No new systems. | Diamond Career, Otherworld, browser Wildbond (Classic), the arcade and Come Play |
| **Parked** | none | Ideas and proposals only, no builds. | Primordial, old Starfall Guild, card shop, Main Street, a second sport, walk-in arcade, the AI storyteller |

Rules:
- **Bugs friends report jump every queue**, in any slot (GitHub issues, Evan's messages).
- **A game moves up a slot only when another moves down.** When the flagship reaches its goal (Wildbond 2.0), the
  second becomes flagship and the best-scoring waiting game (section 3) takes the second slot. A new idea never
  joins the build slots without taking a place from something.
- **Shared work counts for every game it helps** ("two birds with one stone", CLAUDE.md): a shared system that the
  flagship needs is flagship work, as long as it makes the flagship better now.
- **Keep-alive games still get their writing and research** when ChatGPT's own slot is blocked; they just don't get
  new systems until they move up.

## 2. The scorecard (for any feature, improvement or new game)

Score each question 1 (low), 2 or 3 (high). Total out of 21. Write the score next to the item.

| Question | Weight | Asks |
|---|---|---|
| **Fun now** | x2 | Does it make the game more fun to *play* the next time someone plays? (Not more content on paper.) |
| **Evan's heart** | x2 | How much does Evan care? (His words in CLAUDE.md, VISION.md, decisions.md; ask him if unsure.) |
| **Friends notice** | x1 | Will testers feel it in their first hour? (Bugs, confusion, phone play, the opening.) |
| **Moves the focus** | x1 | Does it finish a milestone of a focus-slot game, or unblock someone else's work? |
| **Cheap** | x1 | 3 = an afternoon, 2 = a day, 1 = several days or risky. |

Rough reading: **17+** do it soon; **12-16** it belongs in the path, in milestone order; **under 12** it waits on
the shelf (docs/ideas.md) and gets re-scored when the focus changes. Ties go to the flagship.

## 3. How ideas and improvements come in

Two project threads feed this page: **New game ideas** (research and pitches) and **Improve existing games** (reviews
of what we have). Anyone, Evan included, can add to either. The flow:

1. **Idea:** one line in docs/ideas.md (or a message). Costs nothing; never lost.
2. **Pitch:** new games are scored with the six-question card in
   [proposals/new-game-ideas.md](proposals/new-game-ideas.md) (out of 18; a pitch at 15+). For a new game, a one-page `docs/proposals/<game>-pitch.md`: the fantasy in one sentence, the core
   loop, two or three reference games and what we do better, what it shares with our games (catalogue, engine,
   universe), the smallest playable first slice, and its scorecard. For an improvement, a scored line is enough.
3. **Ranked:** the priorities owner (Claude) scores it and files it: improvements go into that game's milestone in
   DEVELOPMENT-PATH; new games go on the **waiting list** below.
4. **Picked:** a new game leaves the waiting list only when a focus slot opens (section 1) **and Evan says yes**.
   Starting or unparking a game is always Evan's call (DEVELOPMENT-PATH "Ask Evan first").

### Waiting list (new games and big unparks, best score first)

| Idea | Score | Pitch | Note |
|---|---|---|---|
| Card shop, absorbing Main Street (CS1 + MS1) | 17/18 | docs/proposals/new-game-ideas.md | Recommended next new game once Evan says go; first step a one-PR Godot toy (counter, 20 cards, pricing, four customers, one Friday match). Uses the catalogue and Wildbond's elements |
| A second sport: American football (DC4) | 15/18 | docs/proposals/new-game-ideas.md | Only if Evan picks a second sport; waits until Diamond Career's career mode (DC-M2) proves the framework |
| "The Crossing", sailing between the worlds | 12/18 | docs/proposals/new-game-ideas.md | Waits |
| Primordial beyond polish | 10 | docs/plans/primordial.md | Evan: lower priority |
| Walk-in arcade (AR3.1) | 10 | docs/VISION.md | Evan: the games come first |

## 4. The flagship goal, in order

**Wildbond 2.0** = the whole journey, finished and pleasant, playable on the web and on a phone, ready for friends and
then everyone (START-HERE question 1, default (a)). The game is already playable start to finish, so what is left is
what a player *feels*, in this order:

1. **Pacing and rough edges from a full playthrough** (ChatGPT's T56 pacing diagnosis, PR #83; then fixes).
2. **The ending finished** (WB4.3 with ChatGPT's WB4.4b, now that Evan chose the final truth).
3. **Phone controls and settings in the game window** (WB6.1, WB6.2): friends play on phones.
4. **The Lighthouse Spire and rematches** (WB5.1): reasons to come back.
5. **The Unbound appear** (WB3.7): the next layer of story and reputation.
6. **Polish that runs alongside:** depth (WB2.2), variety (WB2.3), Larkhaven homes (WB2.4), winter weather (WS4).
7. **Ship it:** import a browser save (WB6.3), a guide (WB6.4), trailer and builds (WB6.5).

After-league life (contests, ranch jobs, roaming legendaries, baby forms, and now Saltmarsh fishing) is WB-M5 and comes
after 2.0 unless Evan moves it up. First in WB-M5: **races and contests at the ranch** (WB5.2; scored 17/18 by the New
game ideas thread), then **Saltmarsh fishing** (WB5.7, 16/18).

**Starfall (second slot), in order:** SF2.5 the apprentice; SF3.1 seasons as chapters (with T57's outlines, PR #84);
SF3.4 festivals on the shared calendar; then SF4.1 expeditions, built as **first-person grid delves** (16/18; a
one-PR prototype first, and the cheapest step toward first person, V10).

**ChatGPT's order:** flagship support first (WB4.4b, pacing fixes data, WB3.6 trainer teams, WB5.6 catalogue only
when asked), then Realmbound (RB1.4 phone pass, RB2.2 second raid tier, RB2.1 battlegrounds proposal), then
keep-alive writing for Diamond Career and Otherworld.

## 5. When to re-rank

- When a milestone finishes, a game changes slot, or Evan gives a new direction.
- Once a week otherwise: re-score the waiting list and anything new from the two idea threads.
- Each re-rank is one dated line in the log below.

## Log

- 2026-10-09 Claude: first version. Flagship Wildbond (Godot), second Starfall village, ChatGPT's own Realmbound;
  Diamond Career and Otherworld to keep-alive until Evan says otherwise. Asked Evan to confirm the focus.
- 2026-10-09 Claude: folded in the New game ideas shortlist (PR #87): card shop absorbs Main Street and tops the
  waiting list; ranch races and contests first in WB-M5, Saltmarsh fishing added (WB5.7); Starfall expeditions as
  grid delves. Primordial and the walk-in arcade keep their places; farm sim, survivors-style, puzzle, survival
  crafting and online/gacha ideas declined there.
