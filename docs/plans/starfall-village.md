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

## SF3.3 / T57: four chapters in the same village

Codex, 2026-10-09. **Outlines for Claude's Godot build, not implemented events or final dialogue.**
The village loop above overrides the older browser plan's parked status, reset assumptions and full-automation proposal.
Keep the six existing adventurers' stories and traits; these chapters make circumstances for their lives, not replacement biographies.

### Calendar contract and progression

Use `wildbond-godot/scripts/calendar.gd` unchanged when Claude implements SF3.1/SF3.4:

| Chapter mood | Festival ID / name | World-calendar days | Real-calendar dates |
|---|---|---|---|
| Spring | planting / Planting Day | 10-12 | March 20-22 |
| Summer | longlight / the Long Light | 15-17 | June 20-22 |
| Autumn | lanterns / the Harvest Lanterns | 20-22 | October 28-31 |
| Winter | midwinter / the Midwinter Hearth | 24-28 | December 20-31 |

That calendar has 30 days per season, 300 active-play seconds per calendar day, and world/real/held-season modes.
**Starfall currently uses a separate 150-second service/wage day** (`main.gd DAY_SECONDS`); do not silently double wages,
halve service, or equate the two clocks. Timing integration belongs to Claude. Festival IDs/dates are shared; town customs are its own.
Held-season modes return no festival. Real dates retain their existing festival mapping, including the southern-hemisphere setting.

Chapters follow one another through completed work and conversations, independently of the display season. A winter-looking new
save still begins with the first village problem; weather changes presentation, not the meaning of recorded accomplishments.
Nothing essential waits for a festival, changes the PC clock, or expires when a date passes. Each chapter has a private end-of-work
meal at the Inn whenever it is resolved. On the appropriate dates, the named festival adds decorations, a public supper and optional
local conversation. The private meal is not falsely labelled an out-of-date festival. Returning next year can revisit a custom,
not duplicate a recruit, reward or completed chapter. Festival visitors must not crowd the counter, board, doors or adventurers' paths.

Readiness uses **existing** completed jobs, successful service, recovery and the people/buildings already present. No forced new
buildings to see the story: the basic Inn/board version always works, with optional Smithy/Apothecary/Healer/Tavern staging.
Numbers below are suggested narrative thresholds for implementation review, not new economic settings. Rewards are ordinary
job pay and what customers actually buy. Newcomers use existing classes and normal recruit rules; no free star multiplier,
permanent bonus, starting cash pile or staffing job is bestowed by a festival.

### Chapter 1: A place to come back to

**Threat:** spring rain makes the gate road difficult; returning adventurers are hurt and hungry while the clearing's existing
Slime jobs go neglected. The problem is whether the guild looks after people after sending them out, not a new disaster meter.
Show muddy boots at the Inn, a damp notice on the board and one familiar adventurer waiting to eat. Keep paths walkable.

**Active work:** after roughly six completed jobs, Bryn asks the guildmaster to notice who is still resting. Post a manageable
existing job, serve the returning people at the actual counter and leave somebody time to recover. Ama can comment if the
Healer's Hut stands; building it is not compulsory. Aki's desire to prove himself and Ren's care can be recognised without
overwriting their personal decisions or making them ask again.

**Newcomer:** Pella, a Cleric, has come to see whether Starfall means its promise of a safe return. She carries a patched satchel
and remembers who offered a seat. After the work is done, she may join by the ordinary recruitment rules; she is not an instant
replacement for Ren or an automatically hired healer.

**Decision / recovery:** hold the next demanding job while the hurt member recovers, or keep that job on the board and trust
adventurers to judge it. The first leaves a resident disappointed about the delayed road work; the second can produce a worried
conversation if somebody returns hurt. Neither commands an adventurer to take a job. A later safe return and personal apology
close the disagreement. The risk uses existing job difficulty/injury, not a secretly guaranteed punishment.

**Festival:** Planting Day. Hob invites everyone to plant one ordinary flower by the square and set a cup beside an empty chair
for those still resting. One walk-up planting interaction and an Inn meal, not a gardening production chain. Bryn serves only
if already earned/hired; otherwise the guildmaster still works the counter.

**Visible ending:** a dry board and a occupied place at supper; the patched satchel is beside Pella's chair if she joined.
No compulsory financial windfall. The next chapter starts from this same town and roster.

### Chapter 2: Leave the light on

**Threat:** longer working days draw more people to the gate, but the existing Wolf jobs and overambitious postings leave
adventurers exhausted. The town can look busy while quietly becoming less kind. Show late footsteps, one turned-away glance
at a shut Tavern and tired people choosing the Inn.

**Active work:** after the first chapter and several further returns (suggestion: six more jobs), prepare good kit at the Smithy
if present, or offer a manageable job and a meal if it is not. Serve a short evening at the Tavern if built; don't require it.
Kaito can bring his existing lesson about asking for help; Hana can point out someone the guildmaster overlooked.

**Newcomer:** Odrin, an Archer, arrives late with a bow wrapped in cloth. He likes a busy frontier but wants to know whether
there is room to stop. His role differs from Kaito through voice and later job preferences, not an invented new combat class.
Offer the ordinary recruitment opportunity after a safe return, with a later visit if declined.

**Decision / recovery:** make the guild's next evening a quiet rest, or keep the invitation to travellers open. A quiet evening
means fewer ordinary sales; an open evening means the guildmaster must serve and prepare people responsibly. Odrin may wait
for a calmer day if neglected. He returns; closing early is not a permanent reputation stain. Tamsin runs the Tavern only after
the existing mastery/hiring conditions, never as the chapter's free reward.

**Festival:** the Long Light. People hang ribbons along the square and share a last drink before putting the lantern out.
Use the existing pour/serve interaction once for the public meal; there is no mandatory race, timing competition or separate
party management game. Hurt members can sit, and an unbuilt Tavern moves supper to the Inn.

**Visible ending:** a lit window and people departing for bed together. The town remembers whether this year's evening was
quiet or bustling in one short later remark. Good management remains something the player did, not an event that auto-completes service.

### Chapter 3: What we promised

**Threat:** before the cold, the existing Boar and Web jobs compete with gathering supplies. The guild has promised ordinary
work to its neighbours while its own people need rest and supplies. Show a partly repaired sack at the board and herbs actually
arriving from completed jobs; don't conjure a pantry or add storage bookkeeping.

**Active work:** after chapter two and further completed work (suggestion: eight more jobs), choose a sensible mix of existing
jobs, brew at the Apothecary if built and make one ordinary sale/service. Garrick works only if previously hired; hand forging
remains available. Yuna notices the returning route, while Sora's advice can be heard without deciding their personal traits again.

**Newcomer:** Veren, a Thief who maps paths, follows a damaged road marker to Starfall. His interest is whether the guild keeps
promises when nobody glamorous is watching. He can join normally after the work, with an existing mapper trait only if the
reviewed recruit/story rules award it; the outline does not grant one for free.

**Decision / recovery:** honour the longer road job now with a suitably prepared volunteer, or tell the waiting neighbour it
must wait while the guild recovers. Honesty leaves a delayed delivery and a cool greeting; a rushed attempt risks normal
injury. Later complete the job and speak to the neighbour in the square to repair the relationship. No permanent blacklist,
scripted death or forced loss follows either answer.

**Festival:** the Harvest Lanterns. Each household brings one small light to the Inn's supper. One lantern on an empty table
stands for someone still resting, not someone declared dead. A short walk-up placement makes the street brighter; no collection
quota, loot roll or missed-date chapter lock.

**Visible ending:** the neighbour's sack is mended and their seat is occupied again. Veren's road sketch can hang inside the
Guild Hall as a record of the route, not a new off-screen management panel. The winter problem grows from promises kept.

### Chapter 4: The open door

**Threat:** winter makes the frontier quieter. Existing difficult jobs remain tempting when trade is slower and staff still
need their normal wages. Show a shuttered neglected building or a steadily tended hearth according to the actual town state;
never fabricate a closure or deduct an extra crisis charge just to force drama.

**Active work:** after chapter three and several safe returns (suggestion: six more jobs), tend ordinary meals, jobs and wages.
Speak to a discouraged member in the street and give recovery time. Optional hired staff make this familiar work visible; they
are earned convenience, not people the player must unlock again for winter. Hob and Bryn notice what is actually still standing.

**Newcomer:** Selka, a Knight, comes in from the road leading another traveller to warmth. She asks whether the welcome can
outlast one good evening. Offer normal recruitment after consistent care; no minimum of four buildings or perfect profit is
necessary to hear her story. Hana keeps her own identity and place in the roster.

**Decision / recovery:** make one modest open supper now from normal service, or first reopen/tend a neglected place and
invite everyone afterwards. The first recognises people immediately but does not pay unpaid wages; the second leaves somebody
feeling overlooked until the later invitation. Both have an achievable follow-up through ordinary work. Warmth never magically
fixes an insolvent town, but nobody becomes permanently unhireable because a festival was small.

**Festival:** the Midwinter Hearth. A handmade garland, a shared table and a small welcome for a traveller: the square and
built buildings can wear lights, but a hamlet still celebrates at the Inn. Use one existing meal/serve action, not gift-shop
currency or repeated daily attendance. No purchased premium decorations.

**Visible ending:** the newcomer joins the same lived-in village; an Inn wall keeps four small pictures of what happened.
Next spring revisits people and consequences, not a prestige reset, emptied roster or identical setup chores. Later chapters
can explore the wilds, but this outline promises no unbuilt expedition mode.

### Smallest build and acceptance handoff

Implement chapter one first: one new shared problem, three short in-world conversations, one recoverable decision, one normal
recruit opportunity and the two distinct celebrations (ordinary resolution meal versus correctly dated festival). Reuse member
conversation/choices and end-of-day reporting; keep other members autonomous. Only after that is readable and recoverable should
Claude reuse the pattern for the other three. SF3.4's decorations are separate from essential chapter progress.

For each chapter, implementation checks should cover: old-save defaults without resetting members/staff/stories; completion and
recruitment once; declined recruit returning; both decisions and their recovery; no duplicated pay/reward at year rollover;
no game-clock advance offline beyond current rules; full paths to the board/Inn/counter with festival crowds; absent optional
buildings; hired and manual service; actual injuries/closures rather than invented ones. World, real, southern and held-season
modes must all allow the essential story and keep dates honest. Read the short portrait scenes in the engine at phone, desktop
and ultrawide before shipping. Routine bookkeeping belongs in one existing evening report, not a string of interruption boxes.

This is a planning handoff only. Chapter flags, visitor persistence and any numeric morale/recruit changes need Claude's concrete
implementation ticket and old-save checks. No script, preview, economy, roster or player-save change ships with these outlines.
