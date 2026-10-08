# Research brief: the big open decisions (2026-10-08)

## Direction (Evan, 2026-10-08, evening): every game will likely move to a game engine

Evan: "I'm pretty sure we'll likely have to move all to the game engine, but a web version works too because it gives
access everywhere." Godot exports to the browser as well as desktop and phones, so moving keeps the web version. What
this means now:
- **Keep content as data apart from the code** in every game (Wildbond's `tools/godot-export.ps1` is the model), so a
  later move rebuilds screens rather than rewriting the game.
- **Big screen rebuilds wait for the move** (for example Realmbound's "everything in the game window", QUEUE B6b): do
  them once, in Godot, unless a game is staying in the browser. Small fixes and content continue in the browser.
- **The walk-in arcade (PROJECTS V11) is the natural next Godot project after Wildbond**, run on the website through
  the web export.
- Order of moves and timing are still open; Wildbond's trial decides how well it works first.
## Decided (Evan, 2026-10-08): Diamond Career and Otherworld start now, in the browser

Evan: "I want to work on the sports game and the anime game as well, I dont know why we ignore them?" They had been
parked by the earlier finish-and-launch-first decision (below), which this replaces for these two games. Answers to
the plans' open owner questions:
- **Platform:** "path of least resistance": both start in the browser (both assistants can build and test there; they
  join the arcade launcher), following docs/wildbond-plan.md's "games feel like games" principles from day one. A game
  that outgrows the browser can move to Godot like Wildbond.
- **Diamond Career:** batting offers **both** a timing mode and a tactical mode, switchable; batter first.
- **Otherworld:** the player **chooses the world they are reborn into from a list** of very different worlds (tones and
  stories differ the way anime worlds do), with branching choices and consequences, for replayability. Rebirth happens
  **both** by choice (after finishing a life) and on death.
- **Owners:** ChatGPT builds Diamond Career (T34); Claude designs and builds Otherworld's first life (docs/otherworld-design.md).

## Decided (Evan with Claude, 2026-10-07): finish and launch before starting a new game

Evan asked whether the games are "full games" yet, and what comes next: another game, lore and wiki pages, a better
launcher, or more improvement. Claude's read: Wildbond and Realmbound are **content complete** (whole story, end
game, post-game) but not **launch ready** (no onboarding, settings, save safety, full balance pass, phone and
accessibility polish, guides). So the next phase is **Launch**: the launch checklist in docs/QUEUE.md, which already
includes the lore/wiki pages (guides, T8) and the arcade launcher (L8). At Launch both games become version 2.0.
Content keeps flowing behind it (contests, guild stories, roster). A new game starts only after Launch; Evan picks
which one then.

## Decided (Evan, 2026-10-08: "go with your recommendations, and yes to the shared universe where it makes sense")

1. **Wildbond:** the main story ends near level 70. Badge caps: 15, 25, 35, 45, 55, 60, 65, 70 for 0–7 badges, 75 with
   all 8; the Champion around 72–75; the post-game opens the rest of the way to 100. Areas 5–8: 52–60, 58–64, 62–68,
   66–72.
2. **Realmbound:** kill XP splits across the group with classic bonuses (×1, ×1, ×1.166, ×1.3, ×1.4 for 1–5); quest XP
   stays whole.
3. **Realmbound:** a journey length setting (Breezy / Classic / Long Road).
4. **Realmbound:** 3 job slots growing to 5–6 with guild level, never 8; jobs keep running, one return report.
5. **Realmbound:** first raid for 10, a 20 tier later only if wanted, no 40; raid loot every 3 days, practice any time;
   DKP by default with a loot-council override. The other T1 owner questions take their defaults (hands-on raids with
   planning, keep classic friction with ways to earn it away, keep the new names).
6. **Shared systems** in this order: dialogue scenes → sound/music → roster and jobs → the world kit.
7. **A light shared multiverse, where it makes sense:** recurring characters across games, Otherworld's lives visiting
   the other games' worlds, and possibly Primordial as the deep past of the creatures. Every game stays playable on
   its own. Canon record: `docs/lore/multiverse.md`.

Written by Claude for Evan. For each open decision: what comparable games did, what players said, and what I
recommend for Idle Arcade. Numbers from well-documented games are facts; recommendations are opinions to accept or
change. Sources are at the end of each section. The earlier broad survey of 19 games is `docs/plans/RESEARCH.md`.

---

## 1. Wildbond: where does the main story end, level 70 or 95?

**What Pokémon does.** The final battle of the main story sits in the 50s–60s in every generation: the Kanto
Champion's team is level 56–57 in Let's Go (Elite Four 51–55); Galar's Champion Leon is level 62–65; Johto's last gym
leader is around 40. Level 100 is never needed for the story: it's for the post-game (battle facilities, rematches,
competitive play). Main stories take **25–45 hours** (Red/Blue 25–30, Gold/Silver and Emerald 30–35, Diamond/Pearl
40–45). Pokémon Gen 1 also had badge-based obedience caps for traded Pokémon (30, 50, 70, then all).
**Fan games:** Radical Red caps your level at the next gym leader's ace; players like that it keeps every battle a
fair, plannable challenge and stops idling past the content. Its "hard cap" option gives no XP at the cap.

**Recommendation:** the main story should end around **level 70** (the league), not 95. Change the badge caps from
"15 + 10 per badge" to a table that flattens toward the end: **15, 25, 35, 45, 55, 60, 65, 70** for 0–7 badges, 75
with all 8, the Champion at about 72–75, then the post-game opens the rest of the way to 100 (rematch tiers, the
battle tower, legendaries). The first four badges stay exactly as they are today, so nothing already built changes.
Areas 5–8 get narrower level bands (52–60, 58–64, 62–68, 66–72). Classic pacing's 30–50 hours fits Pokémon's range.

Sources: [Bulbapedia: Kanto Elite Four](https://bulbapedia.bulbagarden.net/wiki/Elite_Four_(Kanto)),
[PokéBase: Johto gym levels](https://pokemondb.net/pokebase/369650/what-are-the-recommended-levels-for-each-gym-leader-in-johto),
[ConsolePulse: Pokémon playtime guide](https://consolepulse.com/nintendo/pokemon/guides/pokemon-mainline-games-playtime-guide),
[Reborn forums: level caps](https://www.rebornevo.com/forums/topic/61537-what-exactly-are-the-level-caps/),
[TheGamer: Radical Red facts](https://www.thegamer.com/pokemon-radical-red-rom-hack-facts/).

---

## 2. Realmbound: should group kills split XP?

**What classic WoW does** (documented): kill XP is divided among the party, then multiplied by a group bonus: none for
2 players (split by level), **×1.166 for 3, ×1.3 for 4, ×1.4 for 5**. Elites give double XP; rested XP doubles kill XP.
So in a full group each player gets 1.4 ÷ 5 = **28% of the solo XP per kill**, but kills come much faster and
elites become possible. Players' experience: grouping was a bit faster and much safer, never 5× faster; the real
reason to group was elite quests and dungeons.

**What we measured (T1-B):** a hero with four companions levels **about 5× faster** than solo, because companions add
lots of damage and the hero keeps all the XP. That makes soloing pointless once you have friends.

**Recommendation:** adopt the classic rule for kills: XP per kill = solo XP × group bonus (1, 1, 1.166, 1.3, 1.4 for
1–5) ÷ group size. Expected result: groups level about **1.2–1.5× faster** than solo, and safer. Quest XP stays
whole (it already is per quest). Keep a reward for befriending adventurers: affinity, combo attacks, and doing elite
quests and dungeons at all. This touches levels 1–40 too, so re-run the pacing sim for a few bands after the change
(the sim method is in `docs/realmbound-40-60.md`).

Sources: [warcraft.wiki.gg: Mob experience](https://warcraft.wiki.gg/wiki/Mob_experience),
[warcraft.wiki.gg: Experience point](https://warcraft.wiki.gg/wiki/Experience_point),
[Blizzard forums: group leveling viability](https://us.forums.blizzard.com/en/wow/t/group-leveling-viability/132819).

---

## 3. Realmbound: how fast should 1–60 be?

**Classic WoW:** typical players took **10–14 days of /played time (240–340 hours)** to reach 60; efficient levelers
4–5 days; world-first 3 days 6 hours. At 10 hours a week that's five and a half months.
**Us:** roughly 40–60 hours to 60 at today's pace (levels 40–45 measured at 2¼–3½ hours of active play).

**Recommendation:** don't copy WoW's length (that was a subscription game played socially), but give players the
choice, as Wildbond does: a **journey length setting** for Realmbound (Breezy / Classic / Long Road) that scales kill
and quest XP. Classic stays as today; Long Road roughly doubles it for players who want the grind; Breezy halves it.
Evan's direction already says the player picks the pace, and this is cheap to build (one multiplier, like Wildbond's).

Sources: [Warcraft Tavern: how long to 60](https://warcrafttavern.com/wow-classic/guides/how-long-to-60),
[Warcraft Tavern: an objective look](https://www.warcrafttavern.com/news/how-long-does-it-take-to-get-to-level-60-in-wow-classic-an-objective-look/).

---

## 4. Realmbound: how many heroes should work at once?

**Legends of IdleOn** (the inspiration): up to 11+ characters, each set to grind a mob or resource while you're away.
It's the core of the game, and players love the account economy, but the common complaint is the **daily chore load**:
logging into every character to collect, reset and reassign. Community advice is to do quests on one character and
only what you can "afford" on the others. **Melvor Idle** is praised for making many skills feel "stress-free and zen"
because each one is a single click to start and runs on its own; complaints arise when new requirements force tedious
gathering.

**Recommendation:** start with **3 job slots**, growing to **5–6** with guild levels, never all 8. Jobs keep running
until you change them (no daily resets), everything returns in **one report** when you come back, and every job has
a sensible default so a player who ignores the roster still progresses. The hero you're playing always earns the most.

Sources: [Steam discussions: IdleOn characters](https://steamcommunity.com/app/1476970/discussions/0/4331979151043872533),
[Steam: IdleOn discussion](https://steamcommunity.com/app/1476970/discussions/0/3167694551647775610/?ctp=3),
[Vaporlens: Melvor Idle review summary](https://vaporlens.app/app/1267910/melvor_idle.md),
[Steam: Melvor Idle](https://store.steampowered.com/app/1267910/melvor_idle).

---

## 5. Realmbound: raid size, lockouts and loot

**WoW's history:** 40-player raids were the classic standard, but the main complaints were that a core group carried
"a group that was just along for the ride", and that 40 people meant loot couldn't feel fair even with DKP (guilds
ended up using loot councils anyway). The Burning Crusade moved to 25 because gathering 25 people was "infinitely
easier", Wrath added 10-player versions, and Cataclysm made 10 and 25 give the same loot. Raids used weekly lockouts.
**Idle Champions** builds its fights around formations of tank, healer, damage and support roles with set positions,
which reviewers enjoyed; its weak point was sudden difficulty walls that forced long farming.

**Recommendation:** **10 raiders** for the first raid (2 tanks, 2–3 healers, the rest damage), a **20-player** tier
later only if the roster feels too small, and **no 40**. In an idle game the "40 people show up on time" problem is
gone, but the "too many people to care about" and loot-fairness problems remain. Loot lockout **every 3 days** of
play, practice runs any time; points (DKP) by default with a loot-council override that costs mood, as the T1 plan
says. Avoid hard walls: each Heroic tier should be beatable with gear from the tier below plus preparation.

Sources: [Ten Ton Hammer: the evolution of raiding capacity](https://www.tentonhammer.com/articles/the-evolution-of-raiding-capacity-in-world-of-warcraft),
[warcraft.wiki.gg: raid lockout](https://warcraft.wiki.gg/wiki/Raid_ID),
[Game Developer: Idle Champions review](https://www.gamedeveloper.com/design/champions-of-the-forgotten-realm-review).

---

## 6. Working smarter: shared systems and a shared universe

Evan's question: can one graphics or gameplay system upgrade every game at once, or can the games share a world so
effort pays off several times?

**What others do.** **Kairosoft** builds dozens of management games on the same formula and look, and threads
recurring characters through them (Kairobot, the mascot, appears in many games in different roles; Sally Prin and
Pumpkin Products recur as late unlocks and shopkeepers). Players treat finding them as a small delight, and the
studio gets a recognisable "universe" almost for free. Small studios that share an engine report it forces them to
tidy and improve the shared parts, which then benefit every game. Shared-universe projects (the "RemedyVerse", the
Killemony games) reward players for continuity, for example progress or purchases that count across games.

**What we already share:** `shared/engine.js` (saves, export/import, number formatting, the hub's progress cards)
and `shared/creatures.js` (genes, rarity, traits, bond, breeding), built so Realmbound's pets could use it later.

**Opportunities, ranked by benefit for the effort:**

| # | Shared piece | What it upgrades | Effort |
|---|---|---|---|
| 1 | **Dialogue scenes** (Wildbond's portraits + typewriter text, `09-dialogue.js`) → `shared/dialogue.js` | Story scenes with portraits in every game: Realmbound quest givers, Starfall recruits, baseball coaches | Small |
| 2 | **Sound and music** (Wildbond's chiptune engine, `10-sound.js`) → `shared/sound.js` | Effects and per-place music in every game | Small |
| 3 | **Roster and jobs** (needed for Realmbound's guild anyway) → `shared/roster.js` | Realmbound's guild jobs, Starfall Guild's adventurers, Diamond Career's team, Wildbond ranch jobs: assign members to jobs, get one return report | Medium (we're building it anyway) |
| 4 | **The world kit** (Wildbond's tile maps, walking, towns, people, and the era renderers) → `shared/world/` | Walkable towns and zones in Realmbound, a walkable guild town in Starfall Guild, Otherworld's world; every era (HD-2D, Diorama) for free in each | Large, biggest visual upgrade |
| 5 | **Arcade-wide rewards** in the hub (`engine.js`): titles and cosmetics earned in one game show up in another | Reasons to play the whole arcade | Small–medium |

**A shared universe** (the lore side) could make each game feel bigger with little extra work. Options, from light to
deep: (a) **recurring characters**, Kairosoft style, such as a travelling merchant or a wandering bard who appears in
every game; (b) **one world, several eras or places**: Starfall Guild runs an adventurers' guild in Realmbound's
Sundered Reach, Wildbond's region lies across the sea, and **Otherworld's reincarnations land in the other games'
worlds** (each life a different arcade world, which fits an isekai perfectly); (c) **Primordial as the deep past**:
the evolution game becomes the origin story of the creatures that Wildbond and Realmbound's hunters tame, which might
make it more exciting without needing much new work. Keep every game playable on its own; crossovers are bonuses.

**Recommendation:** do 1 and 2 soon (cheap, every game benefits), build 3 as part of Realmbound's guild so it's
reusable from day one, and plan 4 as the big visual upgrade once Realmbound reaches 60. Decide (b) now in principle,
because it shapes the lore of every game written from here on: I'd suggest **one shared multiverse, light touch**
(recurring characters plus Otherworld visiting the other worlds), leaving each game's own lore intact.

Sources: [Kairosoft wiki: recurring characters](https://kairosoft.wiki.gg/wiki/Recurring_characters),
[Kairosoft wiki: Kairobot](https://kairosoft.wiki.gg/wiki/Kairobot),
[MCV: why Stoic shares The Banner Saga's engine](https://www.mcvuk.com/why-stoic-games-is-sharing-the-banner-sagas-game-engine/),
[eXputer: gaming needs more shared universes](https://exputer.com/exputer/gaming-shared-universes-remedyverse/),
[Roblox devforum: the Killemony universe](https://devforum.roblox.com/t/games-by-killemony/2956990).

---

## Decisions for Evan, in one list

1. Wildbond's story ends near level 70 with the flattened cap table (15, 25, 35, 45, 55, 60, 65, 70, 75)? **[Recommend yes]**
2. Realmbound kill XP splits across the group with classic bonuses (groups ~1.2–1.5× faster, not 5×)? **[Recommend yes]**
3. Realmbound gets a journey length setting (Breezy / Classic / Long Road)? **[Recommend yes]**
4. 3 job slots growing to 5–6, never 8, no daily chores? **[Recommend yes]**
5. First raid for 10, a 20 tier later if wanted, no 40; loot every 3 days? **[Recommend yes]**
6. Shared systems in the order dialogue → sound → roster → world kit? **[Recommend yes]**
7. A light shared multiverse (recurring characters, Otherworld visits the other worlds, maybe Primordial as the deep
   past)? **[Your call: it's taste, not data]**
