# Starfall Guild grows into a village (plan)

Evan, 2026-10-08: yes, Starfall becomes the village builder, "as long as it doesn't make it like a game within a game";
it could have elements of both the village builder and the business manager, but not overly technical, "a game within
a game within a game". "Whatever is the most tasteful." Fallen adventurers recover or get treatment, the way they do in
anime. It should be possible to fail and possible to do exceptionally well. No windfalls (no "watch an ad for $100"
leaps that skip the game): it should feel intentional and rewarding.

Research behind it: docs/research/village-and-business-review.md. Existing plan: docs/plans/starfall-guild.md.

## One game, one loop

**You are the guildmaster of a small frontier town that grows around your guild.** Everything serves one loop:

> adventurers take your bounties, go out, come back with loot and injuries, rest and spend in your town, and grow;
> the town grows because they do, and you grow the town so they can.

There is no separate tycoon screen and no separate builder mode. The **business** side is simply that the town's
places are yours to run (the inn, the smithy, the apothecary, the tavern), and the **builder** side is that you decide
what stands where. Both happen in the same street, with the same people, at the same time.

## What you do (all in the town, walking)

- **Post bounties** on the guild board (what to hunt, where, the reward). Adventurers read it and choose for
  themselves, by their skills and nerve (Majesty-style indirect control). You never drive them like puppets.
- **Build and place:** walk to a plot, choose a building, watch it go up. Placement matters a little (an inn by the
  gate gets more travellers, a smithy beside the training yard is busier), never a fiddly puzzle.
- **Run your places by hand first:** serve at the tavern counter, set prices at the apothecary, work the forge in a
  short hands-on moment. Each place has **one** simple thing you do there, not a mini-game stack.
- **Hire people once you've mastered a job:** after you've run the tavern well for a while, a barkeep can take over;
  you watch them do the work you used to do. Hired people have personalities (a fast but clumsy barkeep).
- **Care for the hurt:** returning adventurers limp in. They rest at the inn, get treated at the infirmary or the
  healer's, soak in a spring if you build one. Serious wounds take days and good care; nobody dies from a bad roll in
  the normal game (a hard mode can change that).

## Failing and doing exceptionally

- **You can fail:** send adventurers out under-prepared and they come back badly hurt and lose faith in you; price too
  high and the tavern empties; overspend and you can't pay wages, so people leave. A failing place can close. The town
  can shrink. All of it is visible in the street (empty tables, a shuttered window, a quieter board).
- **You can recover:** nothing is lost forever by one mistake; a closed place can reopen, people can come back.
- **You can excel:** a well-run town draws rarer adventurers, travelling merchants, festivals, a rival guild's respect,
  and the town's rank rises (a hamlet, a village, a town, a city), each with new places to build.
- **No windfalls, ever:** rewards come from what you and your people did. No lump sums that skip ahead, no timers to
  wait out or pay past. Offline time is a small, capped delivery or a short report, never more than playing.

## Keeping it tasteful (what we won't do)

- No separate business sim, no factory chains, no stock market, no spreadsheet screens.
- Numbers stay small and shown in the world (five logs look like five logs).
- One hands-on activity per place, kept short; the people and the town are the point.
- One report at the end of a day instead of interruptions for every sale or level.

## The story and the shared universe

The seasons become chapters (docs/plans/starfall-guild.md G4). The town's people have their own stories, like
Realmbound's guild members (choices that can go either way). Light links to the other games where they fit (a
Realmbound merchant passing through; creatures from the shared catalogue as monsters and as town animals).

## Where it is built

In Godot after Wildbond (docs/research/decisions.md), reusing Wildbond's walking, people from parts, dialogue and
save. The current browser Starfall keeps working meanwhile. First slice: the guild board, one inn you run by hand,
three adventurers who take bounties, come back hurt and recover, and hiring your first barkeep.
