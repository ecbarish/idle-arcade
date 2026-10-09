# Four seasons and holidays (proposal, Claude, 2026-10-09)

Evan asked (2026-10-09): "Can we add 4 seasons to the game and maybe holiday decorations when they get to the
holidays?" Yes. It's doable in the Godot games without new tools, and it serves what Evan wants: a living world with
reasons to come back, things that change while you play, and decorations you see in the world rather than in a menu.

## Which games
- **Wildbond (Godot) first.** It has no clock yet, so seasons start from scratch: a calendar, four looks for every
  area, seasonal creatures, and one festival per season.
- **Starfall (Godot) second.** Its path already has "seasons as chapters" (SF3.1); this uses the same calendar
  rules and adds festival decorations to the town square.
- **Browser games later, if at all.** Realmbound could get world events once the Godot games prove the idea.

## The calendar (shared rules, so the two Godot games feel alike)
- **The world keeps its own calendar by default.** A season lasts about **two to three hours of play** (tunable), so a
  year passes over a normal journey and every area is seen in more than one season. Time only moves while you play.
- **A setting: "Follow the real calendar".** Then the season matches the real month (northern hemisphere by
  default, with a southern option), and the winter festival lands in late December. This is how "holiday decorations
  when they get to the holidays" works for players who want the real holidays.
- **Players choose the pace:** a setting to hold one season (always summer, say), as with journey length.
- **The season shows in the field book's date line** ("Late Spring, day 12"), in full words.

## What changes with the seasons (Wildbond)
- **Looks:**
  - **Spring:** blossom on some trees and fresh flowers.
  - **Summer:** the current look.
  - **Autumn:** orange and red trees, fallen leaves on paths.
  - **Winter:** snow on roofs and ground, bare trees, frozen ponds (walkable edges stay readable), breath in the air.
  - Done as tints and a few extra tiles over the same maps, so it costs no new maps.
- **The faded world:** in faded places the seasons barely show; colour coming back brings the season with it. This
  is a story hook for ChatGPT to weigh against the thread ledger before it becomes canon.
- **Creatures:**
  - A few species only appear in certain seasons, and wild-encounter weights shift a little.
  - Nothing important is locked to one season. Anything seasonal also appears rarely at other times, so no one is
    forced to wait.
- **People:** townsfolk get a seasonal line or two. Maren knits in winter.
- **Weather:** snow in winter and more rain in spring, building on the existing weather plans (G6).
- **Music:** unchanged at first; a winter variation of the town tune later, if an asset fits.

## Holidays: the world's own festivals, one per season
Each is a real event in the world, not just a banner. The square is decorated, people say festival lines, there is
one small thing to do, and there is a keepsake.
- **Spring, the Planting Day:** ribbons on fences and seed swaps. Plant a flower at the ranch that stays.
- **Summer, the Long Light:** lanterns along the paths at dusk, and a friendly race at the ranch (ties to WB5.2).
- **Autumn, the Harvest Lanterns:** carved lanterns and a shared supper. Feed everyone's creatures at the trough.
- **Winter, the Midwinter Hearth:**
  - Evergreen garlands, coloured lights on the houses, snow and a big tree in the Larkhaven square.
  - Gifts to give townsfolk.
  - In "Follow the real calendar" mode it falls in late December. This is the "holidays" Evan means: a festive
    world without naming any real religion's holiday.

Festivals last a few in-game days, come back every year, and their keepsakes are cosmetic (no stat power, nothing
for sale).

## Starfall
- The same four seasons as chapters (SF3.1).
- Each festival decorates the square, brings a visitor, and changes the day's work: a festival supper at the inn, a
  gift stall.
- The winter festival hangs lights and garlands on every building you've built.
- The bunting already built for good days (SF2.2) is the first piece of this.

## How hard
Medium.
- **Wildbond's calendar and looks:** about two to three sessions for Claude (the tinting is shared code; snow and
  leaves are drawn like the existing mist and fruit).
- **Festivals:** one session each.
- **Data and writing for ChatGPT:** seasonal creature weights, festival lines and keepsake names, in the browser data
  so the exporter carries them.
- Free: no paid assets are needed. CC0 winter or holiday tiles can be added from the Ninja Adventure pack or similar
  if they fit, and credited.

## Open choices (defaults chosen; Evan can change them)
1. **Calendar:** the world's own by default, with a "real calendar" setting. The alternative is the real calendar by
   default.
2. **Holidays:** the world's own festivals, with a December-timed winter festival in real-calendar mode. Named
   real-world holidays are the alternative.
3. **Season length:** two to three hours of play.
