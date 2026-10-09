# Art and sound (what we use, where to find more, how to make our own)

Written 2026-10-09 by Claude after Evan asked: "either build assets for the game or find us more free assets that fit
our aesthetic for now. Eventually I want to have our own but while we build it I will accept using free ones."
Read this before adding any picture, sound or tune to a game. CREDITS.md stays the record of every outside asset;
this page is the how and the why.

## The look we're matching
Both Godot games are 16-pixel-tile pixel art at 384 by 216, scaled up with crisp (nearest) pixels, with dark outlines
and warm, slightly soft colours. The ground, trees and houses come from **Ninja Adventure** (Pixel-boy and AAA, CC0);
people and creatures are our own, drawn in code (`scripts/figures.gd`), with real proportions and legs. Evan rejected
the pack's people on 2026-10-08 (big heads, no legs), so **never use the pack's `Actor` folder** for people or
creatures. Anything new should look as if it came from the same box: the same pixel size, outlines and colours.

**The palette:** the pack ships its 53 colours. They're in [art/arcade-palette.gpl](art/arcade-palette.gpl) (opens in
Aseprite, LibreSprite, Pixelorama, GIMP and Krita) and as a picture in
[art/ninja-adventure-palette-large.png](art/ninja-adventure-palette-large.png). Drawing our own art in these colours
is what lets it sit beside the pack today and replace it piece by piece later.

## What the games use now
| Game | Folder | What | From |
|---|---|---|---|
| Wildbond, Starfall | `assets/env/` | Ground, paths, trees, flowers, houses | Ninja Adventure tilesets |
| Wildbond, Starfall | `assets/music/` | One tune per place, the evening tune | Ninja Adventure music |
| Wildbond | `assets/ambience/` | Waves, wind, river under the music (OGG) | Ninja Adventure ambient sounds |
| Wildbond | `assets/fx/` | One animated effect per element in battle | Ninja Adventure FX/Elemental |
| Wildbond, Starfall | `assets/sfx/` | Sound effects (since 2026-10-09; table below) | Ninja Adventure sounds and jingles |
| Wildbond, Starfall | `assets/emote/` | Feeling bubbles over heads (since 2026-10-09) | Ninja Adventure UI emotes |
| Everything else | code | People, creatures, buildings we designed, the battle screen, the book | Our own |

**Sound effects** are named by what they mean, not by the file they came from, so any one can be swapped (or replaced
by our own) by dropping in a file with the same name. `scripts/sfx.gd` plays them; a missing name is silent rather than
an error, and each game's checks fail if code asks for a sound that has no file. N turns effects on or off; M is
music. Very short sounds are WAV; anything near a second or longer is OGG (web-and-shipping.md).

| Name | Plays when | Pack file |
|---|---|---|
| talk | a line of dialogue moves on (soft) | Sounds/Menu/Move1 |
| open, close, pick | the board, the plans, the shelf or the book opens; a notice comes down; a choice is made | Menu5, Cancel, Accept3 |
| coin | a meal, a drink, a tonic or gear is paid for; coins found; a tip | Sounds/Bonus/Coin |
| warn | a spill at the tap; a bond that breaks free; a trainer spots you; not enough coins at the shop | Sounds/Alert/Alert2 |
| success | a good pour, fine gear, a good day, a battle won | Jingles/Success1 |
| levelup | Starfall's rank rises; a creature grows a level in battle | Jingles/LevelUp1 (OGG) |
| clang, tink | a good or poor strike at the anvil (Starfall) | Hit & Impact/Hit5, Impact |
| pour, brew, build | the tap, the apothecary's pot, Hob's crew (Starfall) | Elemental/Water3, Bubble2, Hit & Impact/Impact3 |
| sad | a hard day (Starfall) | Jingles/GameOver (OGG) |
| hit, slash, whoosh | a plain hit; a battle opening or a lure thrown (Wildbond) | Hit1, Slash, Whoosh |
| ember, tide, grove, stone, gale, shade, radiant | an element's hit lands (Wildbond) | Elemental/Fire, Water1, Grass, Explosion; Magic & Skill/Magic1, Spirit, Heal2 |
| heal, bond, faint, secret | healing or a berry; a creature chooses you; a lost battle; a badge (Wildbond) | Heal, Bonus/PowerUp1, Jingles/GameOver, Jingles/Secret1 |

These were picked by name and length, not by ear (the cloud session can't listen). **Evan: if any sounds wrong, say
which and it gets swapped**; the pack has 188 sounds to choose from.

## What's still unused in the pack (and where it fits)
The whole pack is on Evan's PC at `C:\Users\evanb\Godot\NinjaAdventure` (CC0). Claude can copy files from it into a
game through the folder tools, with no new download. Mapped to the path (docs/DEVELOPMENT-PATH.md):

| In the pack | Fits |
|---|---|
| `Backgrounds/Tilesets/Interior` (furniture, interior floors, simple walls) | WB2.4 homes in Larkhaven; Starfall's buildings opening up (the inn, the tavern) |
| `TilesetDesert`, `TilesetDungeon`, `TilesetVillageAbandoned`, `TilesetRelief` | WB2.2 cliffs and heights; SF4.1 the wilds past the gate, camps and ruins |
| `Backgrounds/Animated/Waterfall`, `WaterMill`, `MillPropeller`, `Flag` | WB2.3 waterfalls; a mill at a farm; SF3.4 festival flags over the square |
| `Items/Potion`, `Food`, `Resource`, `Tool` (small item pictures) | SF2.5 the apothecary's shelf and its bottles; the inn's and tavern's menus; the smithy's bars and tools; Wildbond's satchel |
| `FX/Magic` (aura, shield, boost), `FX/Particle` (rain, leaves, clouds) | Battle orders (Guard, Rally); WS4 snow and rain |
| `Audio/Sounds/Ambient` (rain, storm) | WS4 weather |
| 28 unused tunes (Temple, Mystical, Dream, Road, Ruins, Manor, Dark Forest, Crypt, Melancholia, Tension, Lament, Sad Theme, ...) | The league's courts, the Spire, the Unbound, Starfall's seasons and the wilds |
| `Ui/Dialog` boxes | Not needed: our dialogue boxes are drawn to match the arcade |
| `Actor` (characters and monsters) | **No** (Evan rejected their proportions) |

Already tried and rejected: the pack's water ripples (they're opaque tiles, so they hide the water drawn under them).

## Finding more free assets
Only these licences: **CC0** (best: no conditions), **CC-BY** (fine: credit the author in CREDITS.md), or a
**free-for-games** licence that allows selling a game. Avoid **share-alike** (CC-BY-SA, GPL art: it would bind our own
work to the same licence) and **non-commercial** (NC: it would block ever selling a game). Record every asset in
CREDITS.md and credits.html, with its source and licence, and keep the licence file beside it.

Good places, best fit first (none checked against our look yet; check before using):
- **Kenney** (kenney.nl, CC0): huge, consistent sound packs (Interface Sounds, RPG Audio, Impact Sounds) for footsteps,
  doors, cloth, coins. Its art is a different style from ours; use the sound, not the art.
- **OpenGameArt** (opengameart.org; filter by CC0): for example Juhani Junkala's "512 sound effects (8-bit style)", CC0.
- **Freesound** (freesound.org; filter by CC0): real-world ambience (rain on a roof, a crowded tavern, a forge's fire).
- **itch.io** (search "CC0" or "free for commercial use" in game assets): many 16-pixel packs; check the licence on
  each page, as they vary.

**How downloads happen:** the cloud sessions can't reach these sites (their network allows GitHub, not asset sites),
so a download is done on Evan's PC. Downloads need Evan's OK (PROJECTS.md "Read first"); then Claude copies the files
in through the folder tools, as with Ninja Adventure.

## Adding an asset (every time)
1. Check the licence (above) and that it fits the look (same pixel size, outlines, palette).
2. Copy only the files used, renamed by meaning, into the game's `assets/<kind>/`, with the licence file beside them.
3. Let Godot import it, and commit the `.import` file with it (godot-practices.md). Pictures stay crisp on their own
   (the projects use nearest filtering); never enlarge a picture before importing it.
4. Sounds: WAV for very short effects, OGG for anything longer (`ffmpeg -i in.wav -c:a libvorbis -q:a 4 out.ogg`).
5. Record it in CREDITS.md and credits.html; add a check if code depends on it (both games check every sound).
6. Add a line to DEVELOPMENT-PATH.md Part 4 if it taught us something.

## Making our own (the long-term goal)
Evan wants the arcade's own art and sound in the end. The plan, so free assets are a bridge rather than a dead end:
- **Name by meaning, swap by file.** Sounds and feeling bubbles are already looked up by meaning, so an original
  replaces a pack file without touching code. Do the same for anything new.
- **Signature pieces first.** What makes a game recognisable is worth making ourselves before the background is:
  Wildbond's creature cries (a short cry per species, made in a sound generator), each game's menu sounds, the arcade's
  own jingles, then Starfall's buildings and the people's portraits.
- **Free tools:** [jfxr](https://jfxr.frozenfractal.com) or sfxr (retro sound effects from sliders, in the browser);
  [BeepBox](https://www.beepbox.co) (chiptune tunes in the browser); **Pixelorama** (a free, open-source pixel editor,
  itself made in Godot) or LibreSprite for pixel art. Aseprite is the favourite of pixel artists but costs money: ask
  Evan first.
- **AI-generated assets** are allowed (CLAUDE.md) and credited in CREDITS.md like any other.
- Draw in the arcade palette ([art/arcade-palette.gpl](art/arcade-palette.gpl)) so originals and pack art mix.
