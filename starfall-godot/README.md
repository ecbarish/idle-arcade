# Starfall in Godot: the guild's town

Starfall Guild growing into a village (docs/plans/starfall-village.md; Evan, 2026-10-08). You are the guildmaster of a
small frontier town. This is the first slice.

## Play it
Double-click **Play Starfall.bat** (Godot is unzipped in `C:\Users\evanb\Godot`). Arrow keys or WASD to walk, or click
and tap where to go. Enter, Space or E to talk and to use things. Click or tap the board or the counter to walk up and
use it.

## What's in it
- **The town:** the Guild Hall, the Lantern Inn with its counter (a striped awning and a pot of stew), the guild board,
  and the east gate to the wilds. Built from the same free tiles and parts-built people as Wildbond's Godot version.
- **The guild board:** three requests from the farms each day (Easy, Risky, Dangerous, Deadly). Pin up to two. Your
  adventurers (Aki the Swordsman, Ren the Mage, Yuna the Cleric) choose for themselves by their level and their nerve; a
  bold one may take a job a step too hard.
- **Jobs:** they walk out through the gate, and come back later with the guild's share of the reward (three coins in
  ten), or without it if it went badly. Hurt either way; badly hurt ones wear a bandage. **Nobody dies:** a disastrous
  job means being carried home for a long rest.
- **The inn's counter, by hand:** hungry adventurers come straight to the counter. Stand behind it and serve them (eight
  coins a bowl). Keep them waiting too long and they give up, grumbling.
- **Bryn:** after you've served ten meals yourself, Bryn the cook offers to take the counter for ten coins a day. She
  serves on her own from then on. Can't pay at the end of a day, and she goes back to her own kitchen.
- **Rest:** fed adventurers go up to bed at the inn (a lit window for each) and come back out when they're well.
- **Building on the plots:** two staked-out plots (west and east). Walk up to one for Hob's plans: **the Healer's Hut**
  (120 coins: badly hurt adventurers go to Ama, and mend twice as fast) or **a Training Yard** (150 coins: adventurers
  with nothing to do practise there and slowly gain experience). Hob's crew put it up behind scaffolding while you watch.
- **The town's rank:** Hamlet, then Village (a building and six jobs done), then Town. Each new rank brings a newcomer
  through the gate looking for the guild (Kaito the Archer, then Hana the Knight). The rank shows at the top.
- **The end of each day:** a short report at the foot of the screen (jobs done or gone badly, meals, coins), wages, and
  new requests on the board in the morning. No interruptions during the day.
- **Saving:** the town saves itself every few seconds and when you close the window (user://starfall.json).

## For assistants
- `scripts/main.gd`: the whole town (map, people, adventurers' decisions, the counter, Bryn, the board, saving).
  `scripts/figures.gd` is copied from wildbond-godot (keep them in step until shared code has its own home).
- **Checks:** `Godot_v4.7.2-stable_win64_console.exe --headless --path starfall-godot --script res://tests/run_tests.gd`
  (51 checks on 2026-10-08). Run the game with `-- --no-save` to try it without touching the real town (add `--built`
  to start with the hut built and the yard going up).
- Next slices (docs/plans/starfall-village.md): more places to run by hand (the smithy, the apothecary), more plots as
  the town grows, guild members' stories, seasons as chapters.