# Wildbond: the turning year, content handoff

WS3 / T50, Codex, 2026-10-09. Requested in COMMS; [four-seasons plan](../proposals/seasons-and-holidays.md).
This is exported content for Claude's calendar, not a browser calendar implementation. Classic continues to use
its original encounter tables and conversations. No new species, level, reward, save field or seasonal lock.

## A small change in company

Every existing regional map has four complete copied encounter tables. A pair of ordinary residents shifts by
two relative-weight units each season: nesting and new shoots in spring, open air in summer, fallen leaves and
windfall in autumn, shelter and careful returns in winter. The actual data is in 11-maps.js, not this prose.
Four existing uncommon visitors become a little easier to meet in their favored season:

| Visitor | Area | Favored season | In / outside season |
|---|---|---|---|
| Sunspark | Thornwood | Summer | 6 / 2 |
| Glassbill | Stillreed Basin | Spring | 6 / 2 |
| Chimespark | Hollowecho Hills | Autumn | 6 / 2 |
| Fogsail | Cloudglass Pass | Winter | 6 / 2 |

These are relative weights, not percentages or guaranteed sightings. All remain in their existing area and are
available in every season. No guardian joins the ordinary wild table. Every existing wild entry remains in the
same order; evolution and chosen-partner rules are unchanged. At most three weight units change per entry and
regional total stays within ten percent of the baseline. Fogsail retains its existing catalogue evolution route.
No important progress, clue or useful creature is obtainable only in a season.

## Export contract (plain JSON in the existing 39 tables)

- `MAPS[area].seasonal[season].wild`: complete `[speciesId, relativeWeight]` array. Areas are the eight existing
  region IDs; season IDs are `spring`, `summer`, `autumn`, `winter`. Do not add these to baseline weights again.
- `SPECIES[id].seasonal`: `favoredSeason`, `areas`, `inSeasonWeight`, `outOfSeasonWeight`. Metadata explains
  the four visitors; the regional seasonal table is the encounter authority. It adds no required capture rule.
- Ordinary map NPCs have `bySeason[season] = [[speakerId, text]]`. All 24 route residents, including trainers,
  have one line per season. League actors are excluded: their scripted finale is WB4, not ordinary chatter.
- The existing exporter already includes MAPS and SPECIES. No new top-level table or exporter change is needed.
  SEASONAL_SHIFTS and SEASONAL_VOICES are construction helpers, not an additional integration dependency.

Claude should select one full seasonal table only for ordinary regional wild encounters. Missing/invalid season
or field falls back to the existing `BIOMES[area].wild`; never turn an unknown season into an empty encounter
pool. Preserve the existing night/weather rules, badges, level ranges and story thresholds. The four settings
that hold a season still work because the other visitors remain available. A real-calendar setting creates no
new daily deadline. This content does not set the calendar pace or dates.

For a person: retain shared dialogue and the existing badge replacement and heritage recognition, then append
one seasonal observation when appropriate. Seasonal chatter must not mask a clue, interrupt a trainer battle,
repeat a reward, or play as a separate remote panel. Maren knits a small partner's cover in winter; Pip notices
tiny new tracks; Tobin gives a partner the dry seat; Pell gives Brisket the shade and two blankets. Voices remain
short, local and useful rather than explaining encounter percentages. Festivals use a separate `byFestival`
field in WS6; don't treat festival names as season IDs or mix their dates into these tables.

## Faded places and the ledger

The proposal's faint seasons fit the **decided visual premise**: bonds restore colour, and the fading also took
depth. Existing plants, animals, rain and ordinary daily life still function. Therefore blossom, falling leaves,
warmth, cold and new tracks can exist as muted surface observations before colour returns; restored colour can
make the same seasonal details vivid. Keep visible paths and faces legible in both states.

This is a presentation compatibility judgment, not a new explanation of the fading. It does **not** assert that
the year stopped, seasons caused the fading, the world regrows at a bond, or seasonal weather restores depth.
Do not make seasonal plants return lost cliffs, expose the old pair, identify the watcher or vindicate the
Unbound account. The old painted inlet and carved steps remain observations with several explanations.
No seasonal line here introduces a mystery clue, inherited verse or changed testimony; the ledger records that
scope. Surface decorations use the existing map, collisions and heights. Calendar or appearance integration,
including snow effects, belongs to Claude's WS1/WS2/WS4, not this data PR.

## Checks and limits

526 new browser checks cover all 32 tables, positive weights, modest shifts, exact species retention, no
ordinary guardians, four visitors year-round, all 96 attributed ASCII lines and the original clue/payoff/heritage
shapes. All eight browser pages pass: Wildbond 2,132; Realmbound 8,425 or 8,441 (generated fixtures), Starfall 48,
sound 21, offline 15, Diamond 122, Otherworld 1,895, runner safety 35.
A source comparison strips only the new seasonal fields and finds all seven baseline data tables unchanged.
The actual localhost export contains all new fields in its 39 tables with no missing/dropped-code warning.
Shared portrait-scene previews read all 96 lines at 375x812, 1366x768, 1920x1080 and 3440x1440 in isolated saves;
this checks the writing surface, not a claim that Godot has integrated seasonal encounters or conversations.

Claude's acceptance after integration: select each season and all eight areas, hold one season, try missing
season data, retain night/weather weighting and guardian retries, speak before and after each badge, switch
season without losing shared clues, reload an old save, and test the actual Godot scenes at all four widths.