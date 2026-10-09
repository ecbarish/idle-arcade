# Wildbond: four festivals, writing handoff

WS6 / T51, Codex, 2026-10-09. Companion to [The turning year](wildbond-seasons.md) and the approved
[four-seasons proposal](../proposals/seasons-and-holidays.md). This is exported writing, not implemented
activities or reward delivery. Claude owns the calendar, decorations and in-world integration.

## Traditions

| Calendar ID | Festival | Small action | Cosmetic keepsake |
|---|---|---|---|
| planting | Planting Day | Plant a flower together at the ranch; the patch remains | Seed Basket Ribbon |
| longlight | The Long Light | Take part in a friendly partner race, then rest together | Long Light Pennant |
| lanterns | The Harvest Lanterns | Fill the trough for every partner and share the supper | Supper Lantern |
| midwinter | The Midwinter Hearth | Give something small and handmade, chosen for its recipient | Handmade Hearth Star |

Planting Day makes space for another living thing. The Long Light leaves time for play and rest, with a pennant
for participating rather than winning. The Harvest Lanterns invite shy partners to the same table. The Midwinter
Hearth asks the giver to notice a person, without a price or an expected gift in return. These are present-day
local customs, not secret ancient rites or proof of what caused the fading. Keep decorations legible when faded;
the warmth of a conversation does not restore lost depth.

## Plain-JSON contract

`MAPS.larkhaven.festivals` is keyed by Claude's existing calendar IDs: `planting`, `longlight`, `lanterns`,
`midwinter`. Each entry contains `name`, `season`, `tradition`, a `keepsake` with `id`, `name`, `description`,
and an `activity` with `id`, `name`, `invite`, `complete`. Dialogue uses existing `[speakerId, text]` pairs.
Maren and Pip, the two ordinary Larkhaven residents, also have `byFestival[id]` arrays in the same shape as
`bySeason`. No new speaker, table, exporter, calendar date or save field is needed. Full names have normal title
capitalization; calendar IDs retain their existing spelling.

Preserve baseline, badge and heritage conversations. Append a festival observation where appropriate in a shared
portrait scene inside the world; do not replace a clue or replay a reward just because somebody speaks. A missing
festival or field falls back to normal dialogue. If ordinary seasonal chatter also plays, keep the conversation
short rather than delivering both full appendices every time. All eight resident lines and sixteen activity lines
are optional and contain no essential clue, league requirement or story revelation.

## Implementation boundaries for Claude

- Calendar dates and recurrence remain entirely in `calendar.gd`; these entries never define another schedule.
- `activity.invite` is offered only when its action is actually available. `complete` is spoken only after that
  action succeeds. The friendly race depends on the future ranch activity work (WB5.2); do not promise a race
  from these lines while it is unavailable. Planting, feeding and gifts similarly need their real handlers.
- Keepsakes are proposed cosmetic mementos, with no stats, currency, sales, badge benefit or paid requirement.
  Participation earns the pennant; speed is not a condition. Giving expects no returned gift. A gift can be
  handmade without a purchase, and feeding must accommodate the whole current ranch group.
- Handle completion/reloads deliberately: talking alone must not duplicate keepsakes or plant patches. Persistence
  and any annual replay policy are integration decisions, not new save behavior in this content PR.
- No required species, useful upgrade, mystery clue or campaign progress depends on a date. A held season and
  either calendar mode must remain comfortable choices; no missed-day penalty or streak. Keep the traditions
  repeatable when a player next visits rather than turning a modest celebration into a timed obligation.

The flower remaining and the lantern being usable after the festival follow the approved cosmetic tradition;
this PR does not add furniture, planting, racing or feeding code to Classic. Existing browser gameplay and all
seven baseline data tables remain unchanged after stripping the new festival fields. Godot presentation and
acceptance testing belong to Claude.

## Validation

89 new browser checks cover the four existing calendar IDs, local attributed dialogue, cosmetic-only keepsake
shapes, participation rather than victory, a flower that remains, and gifts without debt. All eight pages pass:
Wildbond 2,221; Realmbound 8,425 (generated fixture count may vary), Starfall 48, sound 21, offline 15,
Diamond 122, Otherworld 1,895, runner safety 35. Stripping only `festivals` and `byFestival` makes all seven
source data tables identical to T50. The actual 39-table export preserves every new field. All 24 lines fit
shared portrait scenes at 375x812, 1366x768, 1920x1080 and 3440x1440 (96 previews in isolated saves).
Frames in docs/screenshots/wildbond-festival-writing/ show the real browser dialogue surface, not an integrated
Godot festival. Claude still needs to test the actions, completion persistence and his in-engine dialogue.
