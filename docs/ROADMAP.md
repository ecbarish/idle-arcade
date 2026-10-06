# Roadmap

Shared plan for every contributor (Claude, ChatGPT/Codex, or a person). One ticket per session.
Mark a ticket done in the same PR that finishes it.

## Priorities
1. **Realmbound** is the flagship. Everything else is parked until it reaches level 60.
2. **The creature system** is next: built once as a shared module, used by Realmbound pets/mounts and by a
   standalone creature game (capture, raise, breed hybrids, race and battle; common to mythical).
3. Parked: Primordial, Starfall Guild, Diamond Career (baseball), Otherworld (isekai). See docs/ideas.md.

## Who does what
- **Claude:** specs and design decisions, new systems with tricky game feel (creatures, raids, guilds),
  balance passes, anything that changes the save format, reviewing and merging PRs.
- **ChatGPT/Codex:** refactors with no behavior change, content written to a spec (zones, quests, enemies,
  items, dialogue), test tooling, bug fixes from the list below.

## Tickets
- [x] **T0: Split Realmbound into small files** (ChatGPT). No behavior change. See HANDOFF.md.
- [ ] **T1: Specs for levels 30-60, raids and the guild** (Claude).
- [x] **T2: Creature game spec + shared creature module plan** (Claude). See docs/creature-game-design.md.
- [ ] **T3: Content for levels 30-40** (ChatGPT, after T0 and T1).
- [ ] **T4: Creature module + creature game v0** (Claude, after T0 and T2).

## Bugs and feedback
Add one line per issue: what happened, where (zone or screen), and the character's level/class.
