# New game ideas: pitched, researched and judged (Claude, 2026-10-09)

Evan, 2026-10-09: "lets make a thread that thinks of new fun games and researches them and decides if theyre worth it
and should be added to our development path." This page is that thread's output: the pitch card for new games (used by
docs/PRIORITIES.md, which holds the one ranking system), and the ideas judged so far with research and a verdict each. **Nothing here is built or unparked.** Starting a
new game is Evan's call (DEVELOPMENT-PATH "Ask Evan first"); the order of work belongs to
docs/PRIORITIES.md and docs/DEVELOPMENT-PATH.md. This page only says which ideas have earned a place in that discussion.

## The short version

1. **Best new game: the Card Shop** (the parked CS1, with Main Street folded into it). Highest score, proven fun,
   and it makes Wildbond and the shared catalogue better instead of competing with them. Recommended as the *next*
   new game once Evan says go, starting with a one-PR toy to prove the loop.
2. **Two ideas are better as features than as games**, and are worth adding to the path now:
   **creature races and contests** at the Wildbond ranch (W4, moved to Godot), and **fishing on the Saltmarsh Coast**.
3. **One idea gives Starfall its missing half:** a **first-person delve**, where you lead guild members into the wilds
   past the gate on a grid. It is Starfall's expeditions (SV5) and the cheapest real step toward first person (V10).
4. **Wait:** a second sport (American football, if Evan picks one), and a sailing game across the sea between the
   Reach and Wildbond's valley. Good ideas, wrong time.
5. **No:** a farm sim, a survivors-style auto-shooter, puzzle or detective games, survival crafting, anything online
   or gacha. Reasons below.

## The pitch card for new games

This card is for whole new games only; features and improvements use the scorecard in
[docs/PRIORITIES.md](../PRIORITIES.md) (section 2), and where a game lands in the build order is decided there.

Each line scores 1 (weak), 2 (fair) or 3 (strong). 15 or more out of 18 earns a pitch to Evan; 12-14 waits; under 12
is a no unless Evan loves it anyway (his taste outranks the sum).

| # | Question | What a 3 looks like |
|---|---|---|
| 1 | **Is the fun proven?** | Comparable games found an audience and players name the same loop as the reason |
| 2 | **Does it fit what Evan wants?** | A world to be *in*, lore, earned automation, everything in the game window, nothing plays itself |
| 3 | **Does it make other games better?** ("two birds") | Uses and improves the shared catalogue, world kit, element rules or a shared universe thread |
| 4 | **Is it different from what we have?** | Not a re-skin of Wildbond, Realmbound, Starfall, Diamond Career or Otherworld |
| 5 | **Can we build it well?** | Fits Godot or the browser, free or our own assets, a first playable slice in a few PRs |
| 6 | **Does it suit short sessions?** | Fun in 10 minutes at work, and still deep over months ("bored at work or even at home") |

Plus one test before the score: **could this be a feature of a game we already have?** If yes, it goes in as a
feature unless being its own game makes it clearly better, and is then re-scored as a feature with PRIORITIES' card.

## The ideas

| Idea | Proven | Fits | Two birds | Different | Buildable | Short sessions | Score | Verdict |
|---|---|---|---|---|---|---|---|---|
| A. The Card Shop (with Main Street) | 3 | 3 | 3 | 3 | 2 | 3 | **17** | Next new game, when Evan says go |
| B. Ranch races and contests | 3 | 3 | 3 | 2 | 3 | 3 | **17** | Feature of Wildbond (W4) |
| C. Saltmarsh fishing | 3 | 3 | 2 | 2 | 3 | 3 | **16** | Feature of Wildbond |
| D. Starfall delves (first person, on a grid) | 3 | 3 | 3 | 3 | 2 | 2 | **16** | Feature of Starfall (SV5), prototype first |
| E. A second sport: American football | 3 | 2 | 2 | 3 | 2 | 3 | **15** | Wait for Evan's choice of sport |
| F. The Crossing (sail between the worlds) | 2 | 3 | 2 | 3 | 1 | 1 | **12** | Wait; revisit after two Godot games ship |
| G. Shop by day, dungeon by night | 2 | 2 | 2 | 1 | 2 | 2 | **11** | No as a game; its lesson goes to A and Starfall |

### A. The Card Shop (CS1, absorbing Main Street MS1): score 17, recommended next new game

**The pitch.** You take over a run-down card shop on a market street. The cards are the shared creature catalogue,
each with our own art and a line of lore, so collecting teaches the world. Open boxes, sort and price singles, haggle
with customers who have names and stories, and run Friday night tournaments with a quick card battle on Wildbond's
element chart. Grow the shop, then (this is Main Street) buy the empty shop next door: a café, a repair stall, a
second branch, each with staff you hire and train to run the parts you have mastered.

**Why it is fun (evidence).** *TCG Card Shop Simulator*, a solo developer's game, was one of Steam's surprise hits
of 2024; players name pack opening, pricing and watching the shop fill as the hook, and its later update made its
own card game playable, which says players wanted to *play* the cards too, not only sell them. *Potionomics* shows
that haggling with characters, built as a small card game, gives a shop real people. *Balatro* (a solo developer,
a million copies in a month) and *Slay the Spire* (a million in early access) show a short card battle can carry
hundreds of hours.

**Why it fits.** A place you are in (a shop on a street, the regulars at the counter), not a dashboard. Automation is
earned in the most natural way: you hire a clerk only after you have done the till yourself, the Starfall "master it,
then hire" pattern. It lights up the shared catalogue: every new species from ChatGPT's batches becomes a card, and
the card battle uses the same element rules as Wildbond. Pell the peddler and the Archivist fit the street.

**Cost and risk.** Card art for every species is the big job (the creature sprites can be framed first, painted art
later). The card battle must stay small; a full trading card game is a rabbit hole. Risk of overlap with Starfall's
running-the-town side, which is why it stays one street, not a town.

**Smallest test (one PR).** A toy in Godot: one counter, a box of 20 cards, open packs, set three prices, four
customers who buy or walk out, one Friday match. If that toy is fun for 15 minutes, write the full plan.

**Recommendation.** Ask Evan to unpark it as the next new game after the Godot Wildbond reaches 2.0 (or earlier as
the toy only, if he wants something fresh to test with friends). Merging Main Street into it turns two parked ideas
into one game.

### B. Ranch races and contests (Wildbond W4): score 17, a feature

**The pitch.** Race your creatures at a ranch track and enter contests (agility, show, strength) in towns, with a
season calendar. Training at the ranch feeds race stats; the nursery and inheritance give bloodlines a reason.

**Evidence.** *Umamusume: Pretty Derby* (a raising-and-racing game) was named best mobile game at The Game Awards
2025 and was a big hit with core PC players on Steam; Kairosoft's horse-racing game is one of Evan's own references
for the raising fantasy. Pokémon Contests and Chao races are fondly remembered for the same reason: a reason to raise
a creature you love that isn't battle.

**Verdict.** Worth it, as Wildbond's ranch feature (W4 already exists; it moved with the ranch to Godot). It deepens
the ranch, gives post-game a reason to revisit, and the races are watchable in the world.

### C. Fishing on the Saltmarsh Coast: score 16, a feature

**The pitch.** A rod from a fisher in Saltmarsh. Fish by day for water creatures you can't find any other way; at
dusk the sea is stranger, and a few catches carry clues for the story's threads.

**Evidence.** *Dredge*, a fishing game with a quiet mystery, sold over a million copies in its first seven months,
well past its makers' hopes; fishing is the most-loved side activity in many games Evan grew up with.

**Verdict.** Worth it as a Wildbond activity, not its own game. It suits short sessions, uses Saltmarsh, which is
already built, and gives the woven story a new place to hide a thread (check docs/lore/wildbond-threads.md first).

### D. Starfall delves (first person, on a grid): score 16, prototype first

**The pitch.** Starfall's adventurers go past the gate (SV5). Instead of only watching them go, you can lead a party
of four of your own guild members into a delve, step by step in first person on a grid, like *Legend of Grimrock* or
*Etrian Odyssey*. What they find stocks the village; who comes back hurt goes to the Healer's Hut. Delves you have
cleared, members can run without you.

**Evidence.** *Legend of Grimrock*, made by four people, sold over 600,000 copies and recouped its cost within days;
grid crawlers have a loyal audience because they are easy to read and hard to master.

**Why it matters for us.** It is the cheapest honest step to first person (VISION §10): a grid in Godot (GridMap) is
small 3D, easy to build from data. It gives Starfall the hands-on adventure it lacks while the village stays the
heart, and it uses the shared catalogue as the monsters.

**Verdict.** Worth a one-PR prototype in `starfall-godot/` (one delve, five rooms, one fight) before it becomes SV5's
form. If it doesn't feel good in first person, SV5 stays as top-down camps.

### E. A second sport: American football: score 15, waits for Evan

**Evidence.** *Retro Bowl*, by the small New Star Games team, became a huge mobile and browser hit with short drives,
a simple play-calling touch and a career with front-office choices; it is exactly the "bored at work" shape.

**Verdict.** If and when Evan picks a second sport (an open owner question), football in the Retro Bowl shape is the
recommendation: it reuses Diamond Career's career, contract and wallet ideas, and short drives suit phones. Not to
start until he chooses.

### F. The Crossing (sail between the worlds): score 12, wait

**The pitch.** Canon puts Wildbond's valley across the sea from the Sundered Reach. A sailing and trading game on
that sea: a ship, a crew with stories, ports from both worlds, weather and the unknown.

**Evidence.** *Sunless Sea* more than doubled its makers' sales estimates; *Sid Meier's Pirates!* is a classic. But
both are big, slow-burn games, and ours would need two finished worlds to sail between.

**Verdict.** A lovely shared-universe idea that is too big for now. Revisit after the Godot Wildbond and a second
Godot game are done; until then, a ship can appear in either game as a hint.

### G. Shop by day, dungeon by night (Moonlighter): score 11, no as its own game

*Moonlighter* is praised for the loop of selling what you found, and criticised for combat that gets repetitive. We
already have both halves: the Card Shop (A) does shopkeeping better, and Starfall's Apothecary and delves (D) do the
"sell what you brought back" loop. The lesson (watch customers react to your prices) goes into A.

## Not worth it (and why)

- **A farm and life sim (Stardew-style):** the Wildbond ranch and Hob's plots in Starfall already cover it; a third
  farm would compete with our own games.
- **A survivors-style auto-shooter (Vampire Survivors):** the character attacks by itself; Evan's rule is "nothing
  plays itself", and it has no world to be in.
- **Puzzle and detective games:** Evan asked for "real games, not dashboards or puzzles". The woven-story skill lives
  in Wildbond's threads instead.
- **Survival crafting (Palworld-scale):** far too big; its best idea (creatures doing ranch jobs) is already WG8.
- **Anything online or gacha:** online needs a server (V6 plans the free steps); gacha is a paywall in disguise and
  breaks "earned, never sold".

## How new ideas get in

One system for the whole arcade: **[docs/PRIORITIES.md](../PRIORITIES.md)** section 3. New ideas go in one line in
docs/ideas.md; new *games* are pitched with the card above (it is PRIORITIES' pitch card for new games); features and
improvements are scored with PRIORITIES' own scorecard (section 2); the waiting list, focus slots and re-ranking live
there too. This page keeps only the research and verdicts behind each pitch. A toy that isn't fun after 15 minutes is
a valid, cheap "no".

## Sources

- TCG Card Shop Simulator: [GameDiscoverCo](https://newsletter.gamediscover.co/p/tcg-card-shop-simulator-the-second),
  [the solo developer's story](https://respawn.outlookindia.com/gaming/gaming-originals/the-solo-dev-who-built-a-card-shop-game-and-watched-it-explode),
  [playable card game update](https://www.gosugamers.net/entertainment/news/78548-tcg-card-shop-simulator-confirms-ps5-and-nintendo-switch-2-release-adds-playable-tetramon-tcg)
- Potionomics: [PC Gamer review](https://pcgamer.com/potionomics-review), [OpenCritic](https://opencritic.com/game/13843/-/reviews)
- Balatro: [PCGamesN, one million copies](https://www.pcgamesn.com/balatro/one-million-copies-sold);
  Slay the Spire: [PCGamesInsider](https://www.pcgamesinsider.biz/news/67356/early-access-deck-builder-slay-the-spire-has-sold-1-million-copies)
- Umamusume: [The Game Awards 2025](https://www.anitrendz.com/news/2025/12/11/umamusume-pretty-derby-named-best-mobile-game-at-the-game-awards-2025),
  [Automaton on its Steam audience](https://automaton-media.com/en/news/umamusume-pretty-derby-highly-popular-among-core-gamers-with-over-100-games-on-steam-research-says/)
- Dredge: [80.lv, over a million copies](https://80.lv/articles/an-indie-game-dredge-has-sold-over-1-million-copies/)
- Legend of Grimrock: [Wikipedia](https://en.wikipedia.org/wiki/Legend_of_Grimrock),
  [RPG Codex, 600,000 copies](https://rpgcodex.net/article.php?id=8736)
- Retro Bowl: [PocketGamer.biz](https://www.pocketgamer.biz/news/77425/uk-based-new-star-games-takes-us-by-storm-with-retro-bowl/)
- Sunless Sea: [Wikipedia](https://en.wikipedia.org/wiki/Sunless_Sea),
  [doubled sales estimates](https://www.gamewatcher.com/2015-27-03-grim-and-engaging-exploration-curio-sunless-sea-more-than-doubles-dev-s-sale-estimates)
- Moonlighter: [RPG Site review](https://rpgsite.net/review/7210-moonlighter-review), [OpenCritic](https://opencritic.com/game/6087/-/reviews?page=3)

Evidence is from published reports and reviews, not hands-on play; sales figures are the makers' own announcements.
