# The development path (every game, to launch and beyond)

Written 2026-10-08 by Claude at Evan's request: "flesh out a full development path or set up a system where other AIs
can figure it out ... we have a lot to still do but ChatGPT said it had finished its tickets." This page is both:
**the path** (milestones for every game, broken into deliverables of about one pull request each) and **the system**
(how any assistant turns the path into its next ticket without waiting for anyone). Read docs/PROJECTS.md
"Read first" before using it; it holds the decisions and lessons this path follows.

## Part 1: the system (read this when your lane is empty)

### The ticket factory
When your lane in docs/QUEUE.md has no `open` task, **do not stop and do not report "finished"**. Instead:

1. **Reviews first** (Claude): merge waiting PRs. **Bugs first** (everyone): open GitHub issues and anything Evan
   reported.
2. **Find your next deliverable here:** go to the earliest milestone (M1 before M2) of any game that has an unticked
   deliverable **with your owner tag** (`[Claude]`, `[ChatGPT]`, `[any]`, `[local]`) and no `(claimed ...)` note.
   Prefer the game with the fewest open PRs, so work spreads out.
3. **Write the ticket** into docs/ROADMAP.md using the template below, add a row to your lane in QUEUE.md, and mark
   the deliverable here `(claimed: <you>, <date>, <branch>)`. Push that as the branch's first commit.
4. **Build it, test it, open the PR** (QUEUE.md "The loop"), and go straight back to step 2.
5. **When a whole milestone is ticked**, write the next one's deliverables if they aren't listed yet (a short
   proposal in `docs/proposals/` if it's new design; see "Ask Evan first" below), then continue.
6. **If everything you own is blocked**, take an `[any]` deliverable, or a "Standing work" item (Part 3).

### The ticket template
```
### T<number>: <Game>, <deliverable name> (<deliverable ID>)
Why: <the player-facing reason, in one or two sentences; cite Evan or the plan doc>.
Read first: <the plan or design docs, lore ledger entries>.
Branch: `codex/<topic>` (or claude/ for Claude when not on main).
- <what to build, as concrete behaviour the player sees>
- <what must not change: old saves load, other games untouched, the game window rule>
- Checks: <which test page or Godot test, what new checks prove it>; README changelog entry; screenshots if visual.
```
Ticket numbers: take the next free `T` number in docs/ROADMAP.md.

### Ask Evan first (everything else, go ahead)
Open a `docs/proposals/<topic>.md` with a recommended default, mark the deliverable `blocked: needs Evan`, and move on,
when a deliverable would: start a new game or unpark one; spend money or need an account; download large files;
change canon already decided (docs/lore/, the "Decided" list in docs/research/decisions.md); remove a feature
players use; add an AI service at play time; or touch another assistant's area (Godot projects and play/ are
Claude's). Questions for Evan live in START-HERE "Questions for Evan", each with a default so work never waits.

### The quality bar (every deliverable)
Feels like a game (docs/wildbond-plan.md principles); everything in the game window; the world's words, readable;
no windfalls; earned automation; old saves load; all test pages pass (eight browser pages, plus the Godot checks for
Claude); one README changelog line; Claude bumps versions on merge.

### Owners
- **Claude:** reviews and merges; the Godot games (`wildbond-godot/`, `starfall-godot/`) and their web previews
  (`play/`); shared design calls; keeping this page, PROJECTS, QUEUE and START-HERE current.
- **ChatGPT/Codex:** the browser games (Realmbound, Diamond Career, Otherworld, browser Wildbond and Starfall Guild),
  data and lore that feed the Godot games (species, maps, lines), guides, research write-ups.
- **[any]:** whoever gets there first. **[local]:** small checkable jobs for the local helper (Lane D).

## Part 2: the path

Tick a box when the deliverable is merged (`- [x]`, with the date). IDs are stable; tickets reference them.

### Wildbond (Godot): the new Wildbond, to version 2.0
**WB-M1: the start of the journey (done 2026-10-08).**
- [x] The opening, register and heritages, the barn, Wren; Thornwood, Saltmarsh, Emberfall, Cloudglass; wild
  bonding; trainers and Wardens; the ranch as a place (nursery, trough, workbench, gear); evolution; music; saving;
  web preview.

**WB-M2: who you are and where you stand.**
- [x] WB2.1 [Claude] Tamer abilities with heritages (WG1): done 2026-10-08 (Orders menu: Rally, a family order, Toren's Steady).
- [ ] WB2.2 [Claude] Depth step 1 (WG6): ground heights, object footprints and heights (part 1 done 2026-10-08: the colour layer drawn in true depth order, people in front of you faded as the world is). Left: ground heights, footprints and heights on objects, tree canopies in front of you.
- [ ] WB2.3 [Claude] Variety pass (WG7) (done 2026-10-08: an animated effect per element in battle; waves and wind under the music. Tried the pack's water ripples: opaque tiles, rejected). Left: waterfalls, edge
  tiles.
- [ ] WB2.4 [Claude] Interiors: the inn, the shop and two homes in Larkhaven, walkable (inn and shop done 2026-10-08, with Old Ned and Juniper; homes left).
- [x] WB2.5 [Claude] Maren's letter and the field book's "where next" hint (WG8): done 2026-10-08.
- [ ] WB2.6 [ChatGPT] (claimed: Codex, 2026-10-08, codex/wildbond-early-heritages; T45) Lore: a heritage line for every Warden and townsperson in areas 1-4 (data in the browser game,
  exported to Godot), recorded in the thread ledger.
- [ ] WB2.7 [Claude] Bring T37's fourteen creatures into Godot (bodies, export) (WG9).

**WB-M3: the rest of the valley (areas 5-8).**
- [ ] WB3.1 [Claude] Stillreed Basin in Godot (map, ferry, trainers, Warden), with its own furniture, sound and music.
- [ ] WB3.2 [Claude] Hollowecho Hills.
- [ ] WB3.3 [Claude] Sunthread Commons.
- [ ] WB3.4 [Claude] Farwatch Reach.
- [ ] WB3.5 [ChatGPT] For each area before Claude builds it: a short "area brief" in docs/lore/ (places, people,
  clues from T40, creatures, one memorable moment) so the Godot build has everything in one page.
- [ ] WB3.6 [ChatGPT] Trainer teams and a pacing sim for areas 5-8 using the Godot rules (rules.gd matches the browser).
- [ ] WB3.7 [Claude] The Unbound appear (WG5): first encounters, a choice to help or oppose; reputation begins.

**WB-M4: the ending.**
- [ ] WB4.1 [Claude] The league: Wren at the gate, four courts, Champion Avenne.
- [ ] WB4.2 [Claude] The wild bond's
  discovery (WG4) and the first-person glimpse.
- [ ] WB4.3 [Claude] The homecoming ending, colour and depth restored.
- [ ] WB4.4 [ChatGPT] The ending's text and every thread's payoff, written from the ledger, for Claude to place.

**WB-M5: life after the league.**
- [ ] WB5.1 [Claude] The Lighthouse Spire and rematches.
- [ ] WB5.2 [Claude] Contests and races at the ranch (W4).
- [ ] WB5.3 [Claude] Ranch jobs: creatures help (W5/WG8).
- [ ] WB5.4 [Claude] Roaming legendaries (W3 part 2).
- [ ] WB5.5 blocked: needs Evan (baby forms, W9/W10; default: the proposal's recommendations).
- [ ] WB5.6 [ChatGPT] Catalogue batch 3 and 4 (12-15 creatures each, data and lore).

**WB-M6: version 2.0, ready for everyone.**
- [ ] WB6.1 [Claude] Phone controls (WG10).
- [ ] WB6.2 [Claude] Settings in the game window (sound, music, text size,
  battle speed).
- [ ] WB6.3 [Claude] Import a browser Wildbond save into the new version.
- [ ] WB6.4 [any] A Wildbond guide (first steps, the element chart, the ranch), now that systems are settling.
- [ ] WB6.5 [Claude] A Wildbond trailer and store-style page; Windows build and web build published.
- [ ] WB6.6 blocked: needs Evan (what "launch" means; START-HERE question 1).

**WB-M7 (later): first person.** WG11: a 3D view generated from the same maps (docs/proposals/depth-and-first-person.md).

### Starfall (Godot): the village
**SF-M1: the working town (done 2026-10-08).**
- [x] Board, adventurers, the counter and Bryn, plots and Hob, healer,
yard, smithy and Garrick, apothecary and prices, ranks and newcomers, music, detail, web preview.

**SF-M2: people and stakes.**
- [x] SF2.1 [Claude] Members' stories (SV1): done 2026-10-08 (two beats each for Aki, Ren and Yuna; data/stories.json).
- [ ] SF2.2 [Claude] Failing and excelling, visible (SV3).
- [ ] SF2.3 [Claude] The tavern you serve at, and placement that matters a little (SV4).
- [ ] SF2.4 [ChatGPT] Story text for SF2.1 (the system is built; extend `starfall-godot/data/stories.json`: arcs for Kaito, Hana and Sora, and a third beat for Aki, Ren and Yuna; keep its format and the four traits): three short arcs per adventurer (choices that can go either way), in a
  data file Claude wires in (`starfall-godot/data/stories.json`; ChatGPT may write that one data file).
- [ ] SF2.5 [Claude] Hire the apothecary's apprentice once you've brewed enough (the same "master it, then hire" rule).

**SF-M3: seasons.**
- [ ] SF3.1 [Claude] Seasons as chapters (SV2), the first one ending in a festival.
- [ ] SF3.2 [Claude] Travelling merchants and visitors from other games (the shared universe, lightly).
- [ ] SF3.3 [ChatGPT] Season 1 to 4 outlines in docs/plans/starfall-village.md (a threat, a festival, a newcomer each).

**SF-M4: the wilds.**
- [ ] SF4.1 [Claude] Expeditions you can see (SV5): the wilds past the gate, camps, catalogue
creatures as monsters.
- [ ] SF4.2 [Claude] Phone controls and settings; Starfall guide [any]; trailer.

### Realmbound (browser)
**RB-M1: in the game window.**
- [x] Part 1 (T38).
- [ ] RB1.2 [ChatGPT] Part 2: pages become places (T41). (queued: Lane A16)
- [ ] RB1.3 [ChatGPT] Part 3: the road between towns as a walkable stretch at key points (an inn on the road, a
  camp), keeping auto-combat where it already lives.
- [ ] RB1.4 [ChatGPT] Phone pass for the new layout (L3 part 2).

**RB-M2: what the raid set up.**
- [ ] RB2.1 [ChatGPT] Battlegrounds plan in docs/proposals/ (R3; new system: Evan
approves).
- [ ] RB2.2 [ChatGPT] Second raid tier (R7), data and encounters.
- [ ] RB2.3 [ChatGPT] The catalogue reaches Realmbound (T43). (queued: Lane A18)

**RB-M3: a living world.**
- [ ] RB3.1 [ChatGPT] Simulated adventurers in the zones (V5 part 1: questing, groups,
asking for help; rules only).
- [ ] RB3.2 [ChatGPT] Camps that grow into villages (V7 part 1).
- [ ] RB3.3 [any]
Realmbound's Godot question answered by Evan, then a plan (START-HERE question 2).

### Diamond Career (browser)
**DC-M1: the first season (D1, done through v0.4.0).**
- [x] At-bats, contracts, payday, home, the first month, the
game window, the road trip.
**DC-M2: a professional career (D2).**
- [ ] DC2.1 [ChatGPT] A full season with standings, roles that change with
form, and an end-of-season review.
- [ ] DC2.2 [ChatGPT] Relationships: a few teammates and a rival with their own
arcs.
- [ ] DC2.3 [ChatGPT] Awards and big-moment at-bats (playoffs).
- [ ] DC2.4 [ChatGPT] Purchases with small,
honest effects (needs Evan: START-HERE; default: comfort only, no stat boosts).
**DC-M3: beyond playing (D3).**
- [ ] DC3.1 [ChatGPT] Retirement and a coaching or front-office path on the same
league history. **DC-M4:**
- [ ] DC4.1 blocked: needs Evan (the second sport).

### Otherworld (browser)
**OW-M1: three lives (done through v0.3.0).**
- [x] The Between, Asterhold with Lanthorn, Hearthmere, the Ashen Throne.
**OW-M2: memories and a systemic world.**
- [ ] OW2.1 [ChatGPT] Memories that matter across lives (T42). (queued: Lane A17)
- [ ] OW2.2 [ChatGPT] Skills that grow through use (O1 in docs/plans/otherworld.md).
- [ ] OW2.3 [ChatGPT] People
with wants, grudges and debts that persist across a life, in every world.
- [ ] OW2.4 [ChatGPT] A fourth world
proposal (Evan picks the theme).
**OW-M3: the AI storyteller experiment.**
- [ ] OW3.1 blocked: needs Evan (an AI voicing characters inside the
rules; free local model first, as docs/otherworld-design.md says).

### The arcade (everything shared)
**AR-M1: friends can play (done 2026-10-08).**
- [x] Come Play, previews, trailer, Windows builds.
**AR-M2: polish for everyone.**
- [ ] AR2.1 [ChatGPT] Accessibility (T44, L10). (queued: Lane A19)
- [ ] AR2.2 [ChatGPT] The
launcher shows the Godot previews as games (cards, covers, links).
- [ ] AR2.3 [any] Game boxes (V3).
- [ ] AR2.4 [local] Link and image check across guides and pages (Lane D3).
- [ ] AR2.5 [ChatGPT] Studio text
browser (E4).
**AR-M3: the walk-in arcade and friends.**
- [ ] AR3.1 [Claude] Walk-in arcade steps 1-2 (V11).
- [ ] AR3.2 [any]
No-server sharing: trade and battle codes, ghost teams (V6 part 1).

### Parked (Evan decides when)
Card shop (CS1), Main Street (MS1), Primordial beyond light polish, a second sport. Proposals welcome; no builds.

## Part 3: standing work (always available, any assistant)
- **A playtest pass:** play one game for its first 20 minutes as a newcomer, file what's confusing or broken as
  GitHub issues (or a short report in docs/playtests/).
- **Player-text sweep** of one game against docs/CREATIVE.md "Writing for players".
- **Keep Come Play current** (playtest.html): versions, pictures, what's new.
- **Research prompts** for Evan's Gemini reports (docs/research/gemini-prompts.md), then review the reports against
  the game.
- **Small local-helper jobs** (Lane D), checked by a person.
