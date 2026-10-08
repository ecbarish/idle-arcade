# Review: Gemini's Otherworld report, checked against the real game

Claude, 2026-10-08. The report: [otherworld-first-life-research.md](otherworld-first-life-research.md). Checked against
`games/otherworld/` (v0.1.0) as it is on main today.

## The short version

Gemini couldn't open our links (it says so first), so its picture of the game is a guess. Its big idea, **storylets**
(small scenes, each with conditions for when it can happen and effects on the world; Emily Short and Failbetter's
"quality-based narrative"), is sound and is in fact **how Otherworld is already built**: every choice has a `need`
(condition) and an `fx` (effect) on the life's flags, and soul memories already open new choices rather than giving
number bonuses. What the game lacks, and Gemini is right about: **a world that moves on its own** (needs that change
over time, people who react), **locked choices you can see** (today they are hidden), and **gift costs that actually
bite** (only one of three does).

## Each claim, against the code

| Gemini says | In the game today | Verdict |
|---|---|---|
| Use storylets: content + conditions + effects on state | `NODES` in `00-data.js`: choices with `need(life)` and `fx(life)` on `life.flags`, `life.silver`, `life.mem` | Already the shape; extend it rather than rebuild |
| Soul memories should be keys that open things, not stat buffs; earned by living, not grinding | `MEMORIES` (e.g. `tide`, `oldroot`, `guildmaster`) unlock choices and lines in later lives; earned from endings | Already there |
| Endings should close the life you made | Eight endings plus `EPILOGUES` chosen from what you did | Already there |
| Show a locked choice and *why* ("Blocked by your gift's cost") | `choicesOf()` in `01-game.js` **hides** any choice whose condition fails, so players never see what a gift or memory could have opened | **Take it:** show it greyed with a reason in words (no raw numbers) |
| A gift's cost must change what you can do | Sword Saint's cost bites (you can't hold back at the heart of the Deepwood). **Appraisal's and Pocket Space's costs are only text**; nothing uses them | **Take it:** each cost bites at least once in Asterhold |
| A small systemic experiment: one place, two needs that change over time, people who react, no AI | Nothing changes unless you choose; there is no time or need system | **Take it,** set in Lanthorn (see the ticket) |
| A way back from a bad situation ("relief valve": after repeated blocks, a costly way out appears) | Every path reaches an ending; no soft-locks today | Keep in mind once the world has needs |
| First life ends in a scripted, unavoidable death as the tutorial | Lives end through your choices | **Reject:** it would make the first life disposable and predetermined, both against the design |
| Local AI narration (WebLLM) and local voices (Kokoro, ~92 MB download) | No AI; a browser speech voice is an option in VISION V1 | **Defer:** language models are gigabytes and need a strong GPU; Kokoro is plausible later for the Archivist only. The claim about which models run in the browser wasn't checked |
| Defer Hearthmere and the Ashen Throne until the systemic idea is proven in Asterhold | Both are "coming" cards in the Between | Agree |
| Storylets as cards over a living background, inside the game window | Already a full-window scene with an overlay (`02-scene.js`) | Already there |

## The three owner questions, with defaults

1. *How much of the hidden numbers to show?* **Default:** show reasons in words ("You'd need to have seen the truth of
   him"), never raw numbers. Fits "readable, in full words".
2. *Should the Archivist react to the memories you carry?* **Default:** yes, lightly: a written line per memory, no
   hostility system.
3. *How many tracked qualities per life?* Not an owner question; Claude keeps it small (a handful per world).

## Proposed ticket: O1, a living Lanthorn (Claude, Lane B0b)

1. **Locked choices show.** Greyed, with a one-line reason written for each (`why` beside `need` in the data).
2. **Every gift's cost bites once.** Appraisal: someone feels you reading them and shuts a door that would otherwise
   open. Pocket Space: Corvin asks you to carry something you shouldn't, and refusing has a price.
3. **The town moves.** Lanthorn tracks two needs over the days before the tide (food and fear). People's lines, prices
   and who will help change with them, and your choices push them up or down. Authored lines, chosen by the state; no AI.
4. Checks in `tests/otherworld.html` for each; old saves load.

## A newcomer test (free)

Gemini's script is fine with one change: don't say "simulation" or "systems". Say only: "Pick a world and live a life.
Please think out loud." Afterwards ask: what did your gift cost you, and what do you think your memory will do next
life?
