# Showing the games to friends, more variety, and a card shop (Claude, 2026-10-08)

Evan, 2026-10-08: he'd like a playable demo of the most complete games to send for testing, or a trailer, or material
to promote them to friends: showing **what the games do now, what our goals are, and what gameplay to expect**. He
worries the games may feel repetitive and wants detail work (grass and plots not filling in around buildings), more
assets used or improved, early-game help for friends (not full guides yet, since systems are still changing), a clear
element chart, a frame of reference for stat bars, and he floated a card shop game with our own creatures.

## Done today
- **The Come Play page** (playtest.html, linked from the arcade): per game, what it is today, what you'll do, your
  first minutes, "if you're lost" tips and pictures; the arcade's goals in three lines; the Wildbond element chart; how
  to send feedback. Pictures in `images/play/` (re-record with the flags below).
- **Stat bars with a yardstick:** every creature page (browser and Godot) measures against the strongest creature known
  in the valley (120) and prints the number.
- **Detail:** Starfall's finished buildings stand on grass with doorstep stones and one thing of their own beside them
  (a real, solid tile); Wildbond's partner comes round to stand beside you instead of peeking over your head.
- **Music** in the Godot Wildbond: a tune per place and for battles; Larkhaven's comes back with its colour.

## A playable demo of the Godot versions (done 2026-10-08: play/wildbond/ and play/starfall/ on the site; Windows zips in the Desktop folder Game builds)
Friends can play the browser versions now. The Godot versions (the new Wildbond, Starfall's town) need Godot's **export
templates** to build a Windows download and a web version we can host on the arcade's site. That's a one-time download
from Godot's official GitHub release (about 1 GB): either Evan installs them (Godot editor: Editor menu, Manage Export
Templates, Download and Install) or he tells Claude to download them. After that Claude can publish a web build of each
on the site, so a link is all a friend needs.

## A trailer (made 2026-10-08: images/play/trailer.mp4, 56 seconds; cut by tools/trailer/make-trailer.ps1)
The games can record themselves: `--write-movie` with `--demo` (the opening plays itself), `--photo` (no pop-ups mid
shot) and `--colour` (an area with its colour back). A 45 to 60 second trailer, in order: the faded valley, choosing a
partner (the colour floods out), a battle, the coast and the highlands in colour, the nursery and gear, Starfall's town
growing, a Realmbound road, a Diamond Career pitch, then the Come Play link. Turning the recordings into one video
needs a video tool: Clipchamp (free, already on Windows 11) for Evan, or ffmpeg (free) if Evan says Claude may download
it, in which case Claude cuts it all.

## Variety without cheap repetition
We have the whole Ninja Adventure pack locally (CC0) and use only a few tiles. Unused and fitting: 41 music tracks and
jingles (level up, secrets, success), hundreds of sounds, animated water ripples, waterfalls, flowers, a mill, flags,
interior tiles for houses, desert, dungeon and abandoned-village tilesets, rock and relief tiles for cliffs, effects
for elements (fire, water, leaves, rock), and items. Plan, area by area:
- **Each area gets its own furniture and sound:** Saltmarsh: animated water, boats, a pier, gull calls; Emberfall: the
  pack's elemental fire, steam and relief cliffs; Cloudglass: waterfalls and mist; Thornwood: denser undergrowth and
  mushrooms; faded areas use the abandoned-village tiles until restored.
- **Battle effects per element** from the pack's FX (a tide splash, an ember burst), replacing the plain sparks.
- **Interiors:** the cottages open (Evan wants physical places): the inn, the shop, homes, from the interior tiles.
- **Edges done properly:** path ends, plot edges and the ground under every building blend (the remaining hard-edged
  squares, such as the end of Cloudglass's path, get edge tiles).
- **Our own look stays ours:** people and creatures stay drawn in code; packs fill the world. Over time, as Evan said,
  we take what we use and improve it into the arcade's own art. More CC0 sources if needed (Kenney, OpenGameArt): ask
  Evan first, then credit in CREDITS.md.

## Early help for friends (not full guides yet)
The Come Play page covers the first minutes and the most common ways to get lost for each game. Full guides wait until
the big system changes settle, as Evan said. In-game, the Godot Wildbond should add Maren's hint for "where next?" in
the field book (Evan's "everything in the game window").

## Idea: a card shop, with our own creatures (parked, for Evan)
A cosy shop game in the shared universe: you run a card shop in a town (perhaps Starfall's market town, or Main Street,
the parked business idea). The cards are creatures from the shared catalogue, with our own art and lore on each card,
so collecting them teaches the world. Open packs, price singles, run Friday tournaments for regulars (played with a
simple card battle built on Wildbond's element chart), trade with characters who have their own stories. It fits
"two birds with one stone": the catalogue, the card art and the element rules are shared with Wildbond and Realmbound.
Recorded as a parked project (PROJECTS.md); Evan decides when.
