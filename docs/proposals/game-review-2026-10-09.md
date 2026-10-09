# Game review: what to improve in the games we have (2026-10-09)

Written by Claude at Evan's request (2026-10-09): "We need one that reviews the games we have and thinks of updates or
improvements to what we have." This page is that review. It does **not** set the order of work: the "Priorities and
direction" thread owns the ordering and the main roadmap, and gets this list to fold in. Each proposal has an ID
(`GR-<number>`) so it can be turned into a ticket with the template in docs/DEVELOPMENT-PATH.md.

## How the review was done

- **Played what could be run from the cloud:** the Godot Wildbond and Starfall (screenshots from the real game at
  several places, plus each project's checks: Wildbond **273 passed**, Starfall **116 passed**, 0 failed), and the
  opening of every browser game and the arcade page in Chromium (no script errors on any page).
- **Read the data the games run on:** creatures, moves, maps and people in `wildbond-godot/data/wildbond.json`, the
  Starfall README and scripts, and the size of each game's code.
- **Compared against what Evan asked for** in CLAUDE.md, docs/VISION.md and docs/wildbond-plan.md: real games, the
  screen is the world, depth like Pokemon and classic WoW, earned automation, nothing plays itself.
- **Limits:** I only saw the first minutes of the browser games, not their middle or end, and I couldn't sit and play
  the Godot games for an hour by hand. Where a point is inferred from data rather than seen, it says so.

Pictures from this review are in `docs/screenshots/game-review-2026-10-09/`.

## The short version

The games have a lot of **story, places and systems**, built very fast. What they lack most is **variety you can see
and depth you can feel while playing**: in Wildbond the creatures mostly look alike and battles have few choices, the
eight areas are each about one screen, and the two Godot games share one town layout so they look like the same
place. Players aren't telling us anything yet (no GitHub issues at all), so we're guessing what to fix.

The five improvements I'd put first:

1. **GR-1 Creatures that look different from each other** (Wildbond). The biggest gap for a creature game.
2. **GR-2 Battles with real choices** (Wildbond): more moves, signature moves, a reason to switch.
3. **GR-3 Areas you can explore** (Wildbond): each area a route, a settlement and a hidden pocket, not one screen.
4. **GR-5 Starfall its own place** (Starfall): a frontier town that doesn't reuse Larkhaven's layout.
5. **GR-9 Hearing from players** (all games): a one-click "tell us" in every game, and a short playtest script.

## What I found, game by game

### Wildbond (Godot): the flagship

Playable start to finish: the opening, eight areas, the league and the homecoming, seasons and festivals, a ranch.
The writing is warm and the faded-colour idea reads well on screen (see `wildbond-larkhaven.png`).

What holds it back:

- **The creatures look alike.** There are 107 species but they are drawn from **10 body shapes** (bird, lizard,
  sprite, wolf, horse, boar, cat, croc, spider, hyena) in different colours. On the Wilddex page the silhouettes
  repeat row after row (`wildbond-wilddex.png`), and Poolkit, a water creature, is a blue dog. In a creature game,
  wanting to meet the next one *is* the game, and right now the next one is usually a recolour.
- **Battles have few choices.** The whole game has **22 moves**, and each species knows about **4**. Seven elements,
  a cooldown on most moves. Orders (Rally, family orders) are a good idea and should grow. Inferred from the data: by
  the mid game most fights come down to the same one or two best moves.
- **The world is small.** Each area is a single map of **30 by 14 tiles** (a screen and a quarter); Larkhaven is 24 by
  14. Two to four people per area. So the journey from the barn to the league is about nine screens. There's little
  room to explore, get lost, find a hidden grove or come back later for something.
- **On-screen numbers.** The top-right line "Badges 6 Lures 5 Berries 0 Coins 120 Wilddex 2/112 (J: book)" is the
  rules' words on screen, which the "screen is the world" rule says to avoid. The area name at top left is pale grey
  and hard to read over a faded area (`wildbond-sunthread.png`).
- **The code is getting big in one file:** `scripts/main.gd` is 3,593 lines. That makes every change slower and riskier
  (also flagged for the best-practices thread).

### Starfall (Godot): the village

The town works: the board, adventurers choosing jobs, the counter then Bryn, the smithy then Garrick, the apothecary,
the tavern, stories, failing and excelling. The "master it, then hire" rule is the best expression of earned
automation in the arcade.

What holds it back:

- **It looks like Larkhaven.** Same building pieces in the same places: the cottage top left, the big barn top right,
  the cross of paths, the trees round the edge (compare `starfall-town.png` with `wildbond-larkhaven.png`). A friend
  playing both will think it's the same place.
- **It's all one screen.** The town fits in the window and four plots fill it. The wilds past the gate, where all the
  jobs happen, are never seen (that's SF4.1, still far down the path).
- **Not much to do with your hands between chores** once Bryn and Garrick take over (inferred from the README: after
  the hires, the player mostly watches). The next "by hand" jobs keep the day lively.
- `figures.gd` is a copy of Wildbond's; the two will drift apart.

### Realmbound (browser, v1.6 to 1.8)

The biggest browser game: two factions, five classes, 1 to 60, dungeons, a guild, a raid, now with walkable road
places. The first minute is clear: a farmer, a quest, the ability bar.

What holds it back:

- **Autopilot steps in after 15 seconds,** even at level 1 while you're reading the farmer's first line
  (`realmbound-first-minute.jpg`: "Autopilot is covering for you (55%)"; `games/realmbound/js/13-world-ui.js` line 95).
  "Nothing plays itself" says the game should wait for a new player, at least until their first fight is done.
- **Creating your hero is a form** (cards for faction, race, class, journey length) rather than a place. The rest of
  the game now happens in the world.
- **The sky has stray blocks:** square clouds and a blocky sun sit behind the title and the health frame. Small, but
  it's the first thing you see.

### Diamond Career, Otherworld (browser)

Only their openings were seen. Both now open in the game window with a person speaking (the coach; the Archivist in
a library of stars), which is right. Their next steps are already on the path (DC2, OW2) and I'd keep them there.
Small fix: START-HERE says Otherworld v0.3.0 and Diamond Career v0.4.0, but the games show v0.4.0 and v0.4.1.

### Starfall Guild and Primordial (old browser games)

Both are still dashboards (numbers, buy buttons, "click the pool"). Starfall Guild is being replaced by the Godot
village; Primordial is parked as "light". I'd stop spending time on either, and show them on the arcade page as
"Classic" so first-time visitors meet the real games first.

### The arcade page

It still says "A stable of idle and progression games", and the "Which homepage do you like best?" vote is still
running (`arcade-hub.jpg`). Evan's direction since 2026-10-07 is "real games, not dashboards"; the front door should
say so, and lead with the two Godot games.

## The proposals

Owner tags follow docs/DEVELOPMENT-PATH.md: `[Claude]` for Godot work, `[ChatGPT]` for browser games and data,
`[any]`. Size: S an afternoon, M a day, L several days. "Path" says where it fits in the existing path, or "new".

### Wildbond (Godot)

**GR-1 Creatures that look different from each other.** L. [Claude] for drawing, [ChatGPT] for the data. Path: new
(fits WB-M2's variety pass, WB2.3).
- Give every species a few **look features** in the data: ears or horns, tail type, a crest or fins, a pattern
  (spots, stripes, bands), size, and one signature detail (a lantern tail, moss on the back). ChatGPT writes them per
  species from the dex lines; Claude draws them as parts on the body shapes in `figures.gd`.
- Add **four or five new body shapes** where the roster most needs them (a serpent, a turtle, a moth, a fish, a
  tree-folk), so whole families stop sharing a silhouette.
- Look for licensed creature sprites that fit (CC0 or CC-BY, recorded in CREDITS.md) for the starters, the Wardens'
  aces and the legendaries first; original art stays the long-term goal.
- Check: the Wilddex page should show no two species in a row with the same outline and colour family.

**GR-2 Battles with real choices.** L. [ChatGPT] for moves and balance data, [Claude] to place them. Path: new (pairs
with WB3.6's pacing sim).
- Grow the moves from 22 to about 60, so each species learns 6 to 8 over its life and chooses 4 to keep (asked at the
  workbench or by Maren, in the world).
- **A signature move per family** (the boar's charge that breaks guards, the bird's dive that ignores them).
- **Reasons to switch:** a few status effects that matter (soaked, scorched, rooted), and moves that set up a partner.
- Orders grow with the story: one new order taught by each Warden.
- Check with the pacing sim: in a Warden fight, at least three different moves should be the best choice at some point.

**GR-3 Areas you can explore.** L per area, done one area at a time. [ChatGPT] writes the maps as data (maps are
data, never pictures), [Claude] builds them. Path: extends WB-M3.
- Each area becomes **three connected maps:** the route in, the settlement (the Warden's town), and **one hidden
  pocket** (a cave, a grove, a sunken garden) with a rare creature and a story clue.
- Things to come back for: a ledge you can only climb with a Stone creature, a pond you can only cross with Tide.
  These turn the team you've built into the key to the map (Pokemon's oldest trick, and a good one).
- Start with Thornwood, the first area, so every new player feels it.

**GR-4 The numbers off the screen.** S. [Claude]. Path: WB6.2 (settings in the game window).
- Remove the top-right count line. Coins and lures show when you open your satchel or the shop; the Wilddex count is
  in the field book. Badges hang on the player's bag or show in the book.
- Area name: show it large for a few seconds on arrival, with a dark outline so it reads on faded ground, then fade it.

**GR-6 Post-game reasons to stay** (already WB-M5). Keep it, but put **WB5.1 the Spire and rematches** ahead of
contests, because it reuses everything already built and gives a reason to raise a second team.

### Starfall (Godot)

**GR-5 Starfall its own place.** M. [Claude]. Path: new (before SF3.1 seasons).
- A **frontier look:** a log stockade with the gate as its heart, a watchtower, a well, stone and timber instead of
  Larkhaven's thatch, and a darker, cooler palette with forest edging in.
- A **different layout:** the town grows along a road from the gate rather than around a cross.
- A **map that scrolls** so the town can grow past one screen (more plots unlock with each rank).
- Check: put a Starfall and a Larkhaven screenshot side by side; nobody should mistake one for the other.

**GR-7 See the wilds sooner.** M. [Claude]. Path: brings SF4.1 forward in a small form.
- A first step of SF4.1: a short stretch past the gate where you can **walk out and watch** a party at a job (a
  clearing, a creek, the farm fences), and meet them on the way home. No new combat system yet.

**GR-8 Something to do by hand every day.** M. [Claude]. Path: new, follows "master it, then hire".
- After Bryn and Garrick, the next places to run by hand: **the tavern's evening** (already built), **the gate watch**
  at night (a lantern round), and **the training yard** (spar with a member to raise their nerve). Each with its own
  hire later.

**GR-11 Shared Godot code.** S. [Claude]. Path: new; coordinate with the best-practices thread.
- Move `figures.gd` and the calendar into one shared folder that both Godot projects use, and split Wildbond's
  `main.gd` into pieces (map, people, ranch, story, saving). No change players can see; makes every later step faster.

### Realmbound (browser)

**GR-10 Wait for the player.** S. [ChatGPT]. Path: new (a fix).
- Autopilot never covers while a dialogue is open, and not until the player has finished their first fight. After
  that, keep the 15 seconds.
- Clean the stray blocks in the sky behind the title and frames.
- Later (M): create your hero **in a place**, as the other games now do: the abbey for the Concord, the steppe camp
  for the Wildclans, choosing class by who you talk to.

### The arcade (shared)

**GR-9 Hearing from players.** S. [any]. Path: new; feeds AR-M2.
- Every game (browser and Godot web previews) gets a small "Tell us" in its settings that opens a prefilled GitHub
  issue (game, version, where you are) or the feedback page for friends without accounts.
- A **ten-minute playtest script** on Come Play: "play until X, then answer three questions". Friends are already
  testing; this turns their play into issues we can act on.

**GR-12 The front door.** S. [ChatGPT]. Path: AR-M2.
- New line under the title: real games you can play in your browser, not "idle".
- Close the homepage vote (take the winner, or Evan picks), lead with the Godot Wildbond and Starfall, and move
  Starfall Guild and Primordial to a "Classic" shelf.
- Fix the version numbers in START-HERE (Otherworld 0.4.0, Diamond Career 0.4.1).

## Suggested order (for the priorities thread to decide)

| Rank | ID | Why now |
|---|---|---|
| 1 | GR-9 Hearing from players | Small, and every other choice gets better with real feedback. |
| 2 | GR-10 Realmbound waits for you | Small fix to a rule Evan cares about ("nothing plays itself"). |
| 3 | GR-1 Creatures that look different | The biggest gap in the flagship; data and drawing can run in parallel. |
| 4 | GR-5 Starfall its own place | Before seasons and festivals are built on the old layout. |
| 5 | GR-11 Shared Godot code | Makes GR-1, GR-3 and GR-5 cheaper; no player-facing risk. |
| 6 | GR-2 Battles with real choices | Needs the pacing sim (WB3.6) alongside. |
| 7 | GR-3 Areas you can explore | Biggest job; start with Thornwood. |
| 8 | GR-4, GR-12 | Small polish, any time. |
| 9 | GR-7, GR-8 | Starfall's next depth. |
| 10 | GR-6 | Post-game, after the above. |

## What I'd stop or slow down

- **More festival and season content** before the creatures, battles and maps are deeper: it's lovely, but it
  decorates a world that's still small.
- **Old browser Starfall Guild and Primordial:** fixes only.
- **New writing for areas that are one screen big:** each area's story needs room to happen in.

## Keeping this going

A review like this is worth repeating. Suggestion: each time a milestone closes (WB-M3, SF-M2 and so on), any
assistant plays the game for twenty minutes as a newcomer and adds a dated section here or a new
`docs/proposals/game-review-<date>.md`, with screenshots. That's the "playtest pass" in DEVELOPMENT-PATH Part 3,
with a page to land in.
