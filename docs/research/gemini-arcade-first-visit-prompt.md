# Gemini prompt: the arcade's first visit and reusable playtesting

Unanswered. Rewritten by Claude, 2026-10-08, with Evan's walk-in arcade idea (PROJECTS V11) and the in-game-window rule. Save the full sourced response as `docs/research/arcade-first-visit-research.md`. Copy everything below the divider.

---

Research the first visit to a small, original game arcade, and one idea in particular: walking into it. You will not be able to open our website or code (earlier research runs could not), so rely on the description below, say clearly that you did not see it, and keep facts about our arcade separate from your suggestions.

THE ARCADE TODAY (facts): a free website (plain HTML and JavaScript, no build step, hosted on GitHub Pages) with six original games:
- Wildbond: a creature-bonding adventure in a faded valley that regains colour as creatures trust you; eight areas, a league, a ranch. It is moving to the free Godot engine (a trial plays the first three areas); the Godot version will also run in the browser on the same site.
- Realmbound: a one-hero adventure inspired by classic online RPGs, levels 1-60, dungeons, a guild, a raid.
- Diamond Career: a baseball career as one batter: key at-bats, contracts, a first paid month, a home.
- Otherworld: a story RPG; choose a world to be reborn into, a gift with a cost, live a life, keep memories into the next.
- Starfall Guild: prepare an adventuring party for dungeons. Primordial: an evolution idle game (low priority).
The home page already has three styles players vote on: a living world (a scene that follows the real clock), a road (a character walks past a stop for each game) and a hall (walkable arcade cabinets). Saves are per game in the browser, with automatic backups. Wildbond's Godot trial has a character creator (name, body, skin, hair, clothes) drawn from parts, the same parts its people are drawn from.

THE OWNER'S IDEA (decided direction, not yet built): you make your avatar once, then walk as that avatar into a virtual arcade and through a door or portal into each game's world, and each game shows you as that avatar where it makes sense. Owner rules for every game: everything happens inside the game window (people, places, things you hold, a thin overlay), never a small game window with panels of information beside it; games feel like games, not dashboards; automation and conveniences are earned, never paid for. Budget: about US$200 cash for the WHOLE project; free tools and freely licensed assets; no subscriptions or paid services. Desktop and phone both matter.

Research, with direct links per claim (developer talks, manuals, documented examples; label anecdotes as anecdotes):
1. Walk-in hubs that worked and ones that annoyed players: e.g. Super Mario 64's castle paintings, Astro's Playroom / Astro Bot hubs, Spyro's homeworlds, Banjo-Kazooie's lair, Nintendo's Mii Plaza and Wii channels, PlayStation Home, Roblox and Fortnite lobbies, Rec Room, VRChat. What makes walking to a game a pleasure the first time and not a chore the tenth time (shortcuts, remembered position, fast travel, a direct Play button)?
2. Carrying one avatar across different games: Nintendo Miis, Xbox avatars, cross-game avatar services and why some shut down. How do games with different art styles and rules (a creature tamer, a fantasy hero with a race and class, a baseball batter, a reincarnated soul) show the same person without breaking their own world? What should the avatar hold (face, colours, name) and what each game should own?
3. The first five minutes: make the avatar (how short can a good creator be?), arrive in the arcade, understand what each door leads to (signs, a glimpse through the door, a short trailer), enter one, get a clear first goal, come back and see your progress in the hall.
4. Doors and portals as presentation: how the door itself can show what kind of game is behind it and how far you've got (a box on a shelf, a lit window, trophies), within the in-game-window rule. Phone controls for walking (tap to walk, joystick), keyboard and screen-reader access, reduced motion, ultrawide screens.
5. Technical fit, briefly and only with sources: one browser site where some games are plain JavaScript and one is a Godot web export; sharing an avatar between them (same-site browser storage); loading time of the Godot web build on phones; what to do for a downloaded desktop version.
6. A free newcomer playtest for the arcade: what to watch, what to ask, how to turn notes into small tasks.

Deliver: three first-visit risks and a cheap test for each; three small versions of the walk-in arcade (from "the hall we have, with your avatar" to a fuller hub), each with what it costs in effort; a ranked five-change table with acceptance tests; a 20-minute playtest sheet; and at most three real questions for the owner. Do not recommend rebuilding every game in one engine, paid services, or accounts and servers.