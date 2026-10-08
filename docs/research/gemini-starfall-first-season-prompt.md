# Gemini prompt: Starfall Guild's first expedition and first season

Requested by Evan; prepared by Codex, 2026-10-07. Copy below into Gemini Deep Research. Save the full sourced report as `docs/research/starfall-first-season-research.md`. Research does not unpark implementation.

---

Research onboarding and design for Starfall Guild, an original small single-player adventuring-guild management game. The fantasy is caring about adventurers, recruiting a complementary party, preparing it, watching expeditions and bringing accomplishments home. We want a lively guild rather than a spreadsheet, but management decisions must remain easy to read.

Current browser implementation has seven classes, party combinations, recruitment, shops/facilities, relic choices, earned staff, regions and Renown/season resets. A fresh game supplies a Swordsman named Ren and begins the simulation. Hall of Legends can retain selected members while resetting their level. Narrative careers, specializations, two simultaneous expeditions, rival guilds and a richer town are planned, not implemented. Feature development is parked; this is research to guide a later approved slice, not permission to build a new mode. No ads, spending, mandatory daily chores or punitive waiting loops.

Investigate:
1. How relevant games teach the difference between managing a roster and directly controlling one hero. Consider Dungeon Village, Wildermyth, Darkest Dungeon, Battle Brothers and suitable autobattlers, but compare specific early decisions and explain mismatched tone or scope. Do not copy signature mechanics simply because a comparator has them.
2. The first expedition: how to introduce Ren, the first recruitment decision, roles/combos, one preparation choice, a readable battle outcome and a useful next action. Separate observing from meaningful intervention. What is too much to show before the first result?
3. Member attachment: names, distinctive behaviors, small memories, relationships and useful niches. How can a modest authored system create attachment without endless biography generation? How can rare recruits avoid making beloved common members worthless?
4. Economy clarity: teach spending, facilities, recovery, loot and tradeoffs without too many currencies or meters. Make one purchase change the next expedition visibly. Distinguish short-term survival choices from long-term upgrades.
5. Seasons and carryover: explain exactly what is reset, what remains and why restarting is desirable. Compare campaign continuity and prestige structures, including their failure modes. No irreversible retirement or loss without clear warning and owner approval. Avoid confusing a numeric prestige loop with a narrative season.
6. Presentation and automation: a living guild hall and return report versus a dashboard, routine news batching versus decisions that deserve attention, staff delegation versus skipped play. Readable formations, animation, audio, large text, reduced motion, phone controls and ultrawide layout.
7. First-session failure: bad recruiting, misunderstood combinations, unaffordable purchases, defeat, loss of identity at reset and wondering what to do next. Propose recovery paths and ways to test whether players understand causes, not just outcomes.

Use sourced primary evidence: developer talks, manuals, official documentation and direct gameplay observations identified as such. Treat review anecdotes as corroboration, not proof of mechanics or a universal preference. Give dates/versions, identify uncertainties, and state when you have not inspected or played our game. Separate existing Starfall features from new proposals.

Deliver a proposed first 10–20 minutes and a later first-season arc, three alternative teaching approaches, a ranked ten-item table with effort/dependency/acceptance tests, and a lightweight newcomer playtest script. Identify what should stay hidden until useful, what should be teachable through one expedition, and what should wait. Do not recommend building every future career or region before validating a small slice. End with no more than five genuine owner decisions.

---