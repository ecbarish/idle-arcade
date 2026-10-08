# Gemini prompt: the arcade's first visit and playtest loop

Requested by Evan; prepared by Codex, 2026-10-07. Copy below into Gemini Deep Research. Save the report with sources as `docs/research/arcade-first-visit-research.md`.

---

Research the first visit to a small independent game arcade and its feedback loop. We have a browser hub containing Wildbond (creature bonding), Realmbound (single-player MMO-style RPG) and Starfall Guild (adventuring-guild management), plus planned games. The launcher currently has living-world/road/hall presentations; games have save tools, settings, credits and feedback access. Wildbond is also testing a separate Godot Windows trial. Native games and browser games may coexist. Do not assume all games will migrate or that a launcher's presentation solves their onboarding.

The owner struggled with Wildbond's opening despite automated tests passing. We need an inviting way to choose a game, understand what kind of play it offers, get into it quickly and report a specific difficulty without losing progress. We want premium craft, optional sound, readable controls, a light shared universe, and no ads, purchase pressure or chore traps.

Investigate:
1. Successful discovery patterns from console home screens, indie collections, game manuals and launcher/store experiences. Separate browsing an existing collection from acquiring a new game; explain which techniques fit three small games and which are needless platform infrastructure.
2. How to communicate each game's fantasy, controls, approximate session shape and manual/assisted options before entering, without a wall of text or misleading feature promises. Differentiate playable games, trials and concepts clearly.
3. Immersion versus access: compare a walkable hall/road with a direct accessible game list. Prevent movement, a cinematic, audio activation or a confusing camera from becoming a gate to choosing a game. Address keyboard, screen readers, phone and 3440x1440 ultrawide.
4. Browser/native coexistence: clear launch/download expectations, safe return to the hub, save ownership and import limits. Never assume browser saves automatically appear in a native game. Treat security/account/distribution requirements as explicit uncertainties rather than hiding them under “just wrap it.”
5. First impressions: loading, responsive controls, readable text, restrained animation, optional sound, offline/error states and clear progress feedback. Prioritize actual behaviors rather than a vaguely “premium” skin.
6. Newcomer testing and feedback: task-based observation, issue severity, capturing the last understood step, collecting device/input context, privacy, distinguishing bugs from preferences, and verifying improvements with fresh testers. Explain why developer walkthroughs, demos and passing scenario tests cannot demonstrate discoverability.

Use current primary sources and specific documented examples. Identify personal recommendations and unverified claims; include dates/versions. Do not invent research subjects or completion rates. Deliver three launcher approaches with tradeoffs; a five-minute first-visit journey; a ranked table of ten changes with acceptance tests; a reusable 20-minute cross-game playtest script; a severity rubric; and a practical way to turn findings into small reviewable tickets. Keep analytics optional and minimal, with no collection of save contents or personal identifiers by default. We are researching, not authorizing a platform rebuild.

---