# First-play research across the arcade

Evan, 2026-10-07: Wildbond's play session showed that we need to understand what works in other games before new players struggle with the opening. These are research briefs, not authorizations to build new systems, migrate every game or start parked games. Claude's Godot trial stays separate.

## Run these next

The Godot report has arrived: [supplied text](godot-production-slice.md), preserved as received, and [Codex review/corrections](godot-production-slice-review.md). It contains useful leads but unsupported mandates and invented project rules; it is not adopted as the build plan. Keep that thread separate so its technical decisions do not swallow the other games' design questions.

| Order | Research brief to copy into Gemini | Report destination | What it should help decide |
|---|---|---|---|
| 1 | [Realmbound: first hour](gemini-realmbound-first-hour-prompt.md) | `realmbound-first-hour-research.md` | Arrival, first quest/fight/loot/reward, clear agency, first companion and town visit |
| 2 | [Starfall: first expedition and season](gemini-starfall-first-season-prompt.md) | `starfall-first-season-research.md` | One meaningful party decision, understandable results, member attachment and honest reset expectations |
| 3 | [Arcade: first visit and playtesting](gemini-arcade-first-visit-prompt.md) | `arcade-first-visit-research.md` | Choosing a game without friction; reusable newcomer observation and feedback |

**Realmbound report received:** [supplied report](realmbound-first-hour-research.md), [review and proposed next decisions](realmbound-first-hour-review.md), with all three source screenshots preserved. Useful companion/playtesting ideas are separated from unsupported Godot, creature-chemistry and full-Auto assumptions. Nothing is adopted as a build requirement.

All destinations are inside `docs/research/`. Preserve complete sources in the returned report, not just a summary. The older [Gemini prompts](gemini-prompts.md) remain useful for broad genre questions; these briefs narrow the work to entry, agency, recovery and testable decisions. These are prompts prepared for research, not completed research findings.

## My perspective

A genre's memorable features are not necessarily its teaching methods. A player may love the idea of a guild yet not understand recruiting; understand a quest yet not know that its completed objective still needs a reward choice; enjoy a living launcher yet fail to find the game. Each report should identify concrete actions, cues and recovery paths, not just describe appealing features.

The Realmbound [opening audit](../realmbound-first-ten-minutes.md) gives that report specific questions. Its accelerated untouched combat checks do not establish that a human understands the opening. Likewise, a Godot demo reaching the bond does not prove that a player can find the paddock. Scenario tests protect behavior; fresh-player observation checks whether that behavior is understandable.

We cannot guarantee the first design will be right. We can reduce expensive mistakes by testing an inexpensive slice before expanding it. Research should end in alternatives and acceptance tests rather than a claim that a successful comparator's whole design belongs in our game.

## How to use the reports

1. Check evidence. Separate source facts, direct observation, review anecdotes and the researcher's recommendations. Flag claims that could not be verified. A report must say if it could not inspect our repository.
2. Translate lessons. For each candidate: player problem → evidence → original adaptation → smallest test → what would disprove it. Match tone and scope; an MMO's real social world cannot simply be replaced by calling NPCs “bots.”
3. Record **keep / try / defer / reject**, with reasons, in a separate decision note. “Try” means an experiment, not an adopted system. Follow CREATIVE.md for approval of new core mechanics or major save changes.
4. Prototype only the next meaningful opening. Do not add ten tutorial panels to compensate for an unclear layout. Reveal controls and systems when they are useful; help is skippable and replayable.
5. Observe a fresh player before a major phase is declared complete. Give a goal, avoid coaching, note the last step they understood, and intervene only when needed. Record that intervention. Optional think-aloud comments help, but they are not a substitute for observing actions.
6. Fix friction, then retest with a fresh save and preferably someone who did not see the earlier version. Repeating a walkthrough with its developer mostly measures familiarity.

## First-play completion gate

Before calling an opening ready, collect evidence that a newcomer can:

- Identify their character or role, immediate goal and a plausible next action.
- Perform one deliberate action and explain its visible result.
- Tell what the game is doing automatically and what remains their decision.
- Finish one complete loop, including claiming the reward or reading the return report.
- Recover from an ordinary mistake without developer commands, a restart or lost progress.
- Save, leave and return knowing whether progress was kept.

Include keyboard/mouse and touch where supported, readable text and reduced motion. Test desktop and ultrawide as actual layouts. Use a small exploratory sample to discover problems; do not turn a handful of sessions into a universal success percentage. Separate difficulty the player chose from confusion the interface caused. Finding an issue is successful testing, not a failed player.

No telemetry service is required for this gate. An observation sheet and explicit opt-in notes are enough to start. Record anonymous context, actions, hesitation, help and outcome; do not include personal details or full save contents.

## Parked games: research before implementation

These short briefs are optional later research. Copy one complete paragraph block below into Gemini Deep Research when that game's direction is useful to explore. They do not activate a parked game. Each asks for sourced evidence and a small playable proof rather than an expansive feature list.

### Otherworld — save as `otherworld-first-life-research.md`

Research the first hour of an original single-protagonist fantasy RPG: arrival in an unfamiliar world, an unusual gift, skills that grow through use, one companion and a short first-life story. Rebirth and skill merging are future concepts, not implemented mechanics. The fantasy is living an adventure, not managing a guild roster. Compare specific openings and skill/companion teaching in relevant games using primary developer/documentation evidence. Explain genre expectations without recommending copied anime plots or arbitrary unlimited magic. Propose three small first-life approaches, each with one place, two viable build choices, one companion and a satisfying short arc. Address choice overload, clear skill effects, a safe first failure, story pacing and what the player should understand before any rebirth. Finish with a ranked task table, acceptance tests, a newcomer playtest script and unresolved owner decisions. Distinguish researched facts from recommendations and disclose lack of access to our files. This is research only; no approved engine, save system or rebirth rules exist.

### Diamond Career — save as `diamond-first-contract-research.md`

Research the first playable session of an original stylized baseball career game, starting with one player's first contract and one understandable at-bat before a full season or eventual management career. Manual timing and slower tactical choices are alternatives to evaluate, not settled controls. Investigate how documented baseball games teach the count, contact, outs, baserunning, performance feedback and believable career advancement. Distinguish licensed professional simulation expectations from what a small original indie can deliver. Recommend three tiny opening approaches, clear feedback for a miss or out, an understandable promotion/contract goal, touch/keyboard accessibility and a first meaningful purchase that is not mandatory upkeep. Explain accuracy versus stylization tradeoffs and how to test whether players understand outcomes. Give primary sources, identify unverified claims, include task/acceptance tables and a newcomer script, and ask only the necessary owner decisions. Do not promise a full physics engine, real leagues or an open-world city. The game remains parked; research is not permission to build it.

### Primordial — save as `primordial-first-cycle-research.md`

Research the first session of an original evolution-themed progression game: a simple organism, environmental pressure, a visible adaptation choice and one complete early survival/progression cycle. The project is on the back burner; these are intended experiences, not claims about a finished simulation. Compare documented evolution games and readable progression/idle games. Identify which biology concepts can become clear decisions without presenting a deterministic ladder as scientific evolution. Explore three small opening loops; visible cause/effect for adaptations; understandable setbacks; how manual and assisted play differ; and a reason to continue beyond a number increasing. Avoid adding many resources, prestige layers or a complete ecosystem at the start. Provide primary sources, clearly label scientific simplifications and design speculation, and do not fabricate repository inspection. Finish with a ranked task table, acceptance tests, a first-session playtest script and owner decisions needed before implementation. Research alone does not unpark the game.