# Idle Arcade credits

Player page: [credits.html](credits.html). Project direction and playtesting: Evan. Development contributions: Claude, ChatGPT/Codex and Jules; [repository contributors](https://github.com/ecbarish/idle-arcade/graphs/contributors).

## Art and sound

The arcade's creature art, landscapes, portraits and covers are drawn in code. Its game tunes and effects use the shared Web Audio sound engine. No externally sourced image or audio files were found in the runtime asset audit of main ef770d7 on 2026-10-07. Review screenshots in docs are evidence, not game assets.

## Fonts

These families are requested unchanged through Google Fonts. Each is under the SIL Open Font License 1.1. The linked local notices include each family's copyright and full license. Browser/system fallback fonts are supplied by the player's device.

| Family | Used in | Copyright notice | Source notice | Local notice |
|---|---|---|---|---|
| Bungee | Hub; Realmbound promo | Copyright 2023 The Bungee Project Authors (https://github.com/djrrb/Bungee) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/bungee/OFL.txt) | [OFL 1.1](licenses/bungee-OFL.txt) |
| Figtree | Hub; Primordial | Copyright 2022 The Figtree Project Authors (https://github.com/erikdkennedy/figtree) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/figtree/OFL.txt) | [OFL 1.1](licenses/figtree-OFL.txt) |
| Instrument Serif | Hub; Primordial | Copyright 2022 The Instrument Serif Project Authors (https://github.com/Instrument/instrument-serif) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/instrumentserif/OFL.txt) | [OFL 1.1](licenses/instrumentserif-OFL.txt) |
| DotGothic16 | Hub; Starfall Guild | Copyright 2020 The DotGothic16 Project Authors (https://github.com/fontworks-fonts/DotGothic16) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/dotgothic16/OFL.txt) | [OFL 1.1](licenses/dotgothic16-OFL.txt) |
| JetBrains Mono | Primordial | Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/jetbrainsmono/OFL.txt) | [OFL 1.1](licenses/jetbrainsmono-OFL.txt) |
| M PLUS Rounded 1c | Starfall Guild | Copyright 2016 The Rounded M+ Project Authors. | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/roundedmplus1c/OFL.txt) | [OFL 1.1](licenses/roundedmplus1c-OFL.txt) |
| IM Fell English SC | Realmbound; Realmbound promo | Copyright (c) 2010, Igino Marini (mail@iginomarini.com) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/imfellenglishsc/OFL.txt) | [OFL 1.1](licenses/imfellenglishsc-OFL.txt) |
| Alegreya Sans | Realmbound; Realmbound promo | Copyright 2013 The Alegreya Sans Project Authors (https://github.com/huertatipografica/Alegreya-Sans) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/alegreyasans/OFL.txt) | [OFL 1.1](licenses/alegreyasans-OFL.txt) |
| Fredoka | Wildbond; Wildbond promo | Copyright 2016 The Fredoka Project Authors (https://github.com/hafontia/Fredoka-One) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/fredoka/OFL.txt) | [OFL 1.1](licenses/fredoka-OFL.txt) |
| Nunito | Wildbond; Wildbond promo | Copyright 2014 The Nunito Project Authors (https://github.com/googlefonts/nunito) | [Google Fonts source](https://raw.githubusercontent.com/google/fonts/5e8a3ba899557829a76cfdac30fa512bda91d7ca/ofl/nunito/OFL.txt) | [OFL 1.1](licenses/nunito-OFL.txt) |

Google Fonts source revision: `5e8a3ba899557829a76cfdac30fa512bda91d7ca` (notices retrieved 2026-10-07). The existing Google Fonts CSS URLs select the font files at runtime; this document records the source notices, not pinned font binaries.

## Renderer

**three.js r134**, copyright © 2010–2021 three.js authors, MIT License. Wildbond's Diorama loads the unmodified library from [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js); its offline fallback is the existing HD-2D renderer. [Version-specific source notice](https://raw.githubusercontent.com/mrdoob/three.js/r134/LICENSE) · [Full local MIT notice](licenses/three-r134-MIT.txt).

## Maintaining the credits

Before adding an outside asset or library, record its name, author/copyright, exact source, version where applicable, use in the arcade, license and any changes here. Copy the supplied notice into licenses/ and update credits.html. Keep attribution required by the asset's license; CREATIVE.md sets the permitted-source rules. Third-party notices describe those components only; they do not grant a license for the entire arcade.

## Wildbond (Godot trial): Ninja Adventure asset pack

**Ninja Adventure - Asset Pack** by **Pixel-Boy** and **AAA** ([itch.io](https://pixel-boy.itch.io/ninja-adventure-asset-pack)),
CC0 1.0 (public domain dedication; attribution not required, given with thanks). Downloaded 2026-10-07 (update #8,
March 2026). Used in `wildbond-godot/assets/ninja/` (the tamer: *Boy*; Maren: *OldWoman*; the first partner:
*Racoon*; their face portraits). **Removed the same day:** Evan didn't like its chibi proportions (big heads, no visible
legs) and preferred our own code-drawn figures. **Environment in use since 2026-10-08:** Evan liked the pack's
structures and nature, so `wildbond-godot/assets/env/` holds its *TilesetFloor* (as floor.png: grass, dirt paths),
*TilesetNature* (nature.png: trees, bushes, flowers) and *TilesetHouse* (house.png: the cottages), unchanged, with the
pack's licence file beside them. People and creatures stay our own. Evan, 2026-10-08: free packs are
placeholders to save time; the goal is the arcade's own original art and identity. **Music since 2026-10-08:** `wildbond-godot/assets/music/` holds nine of the pack's tracks, unchanged and renamed by
place: *Lost Village* (faded.ogg), *Calm Village* (larkhaven.ogg), *Peaceful* (barn.ogg), *Clearing* (thornwood.ogg),
*Sunny* (saltmarsh.ogg), *Adventure* (emberfall.ogg), *Ascension* (cloudglass.ogg), *Fight* (wild.ogg) and the second
*Fight* (trainer.ogg). Starfall's Godot town uses the same pack's tiles (`starfall-godot/assets/env/`) and two tracks in `starfall-godot/assets/music/`: *Good Time* (town.ogg) and *Chill* (evening.ogg).
