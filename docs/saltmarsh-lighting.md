# Saltmarsh Coast lighting

G2 one-area pass, Codex, 2026-10-07. Branch: `codex/wildbond-saltmarsh-light`; PR #38.

The coast should feel open and wind-washed. The existing mist layer and tall fog overlapped, whitening paths and reeds; this pass makes the sea mist lower and more translucent. Sky blue and pale sand carry into shadows. Warm player and door lamps keep their contrast at night. No map, weather schedule, encounter, combat, save or shared-engine changes.

## Profile

| Setting | Before | After |
|---|---|---|
| Fog start (fraction of scene height) | 0.20 | 0.58 |
| Clear fog density | 0.20 | 0.17 |
| Extra fog in mist | 0.35 | 0.26 |
| Extra fog at sunrise | 0.08 | 0.05 |
| Weather mist veil | 1.30 | 0.85 |
| Fog colour | #e0ecf0 | #d4e5e4 |
| Night fog mix colour | #1a2040 | #23394c |
| Grade amount | 0.90 | 0.72 |
| Shaft strength | 1.00 | 0.48 |
| Bounce sky / ground | biome sky / fallback grass | #9cbecb / #c8c5a0 |

The optional settings live in `AREA_AIR` in `games/wildbond/js/06-scene.js`. All other areas retain the previous fallback values. Shadows retain the shared sun/moon vector and strength. The lighter weather veil applies only in lit art eras; Pocket, Pixel and 16-bit keep their previous weather appearance. The pass tunes the HD-2D light and the existing overlay in Diorama; three.js world lighting is still the separate G5 project. Battle backdrops are unchanged.

## Validation

18 new browser checks inspect actual fog, grade, shaft and ambience calls, verify clock/save state is not changed by drawing, preserve early-era mist, compare every other area's bounce model and check representative fog fallbacks. All four pages pass: Wildbond 1141, Realmbound 1519, Starfall 48, sound 21; each runner restores saves and hub storage, with no page errors.

Visual checks used a frozen ranch clock and seeded creature generation for consistent comparisons against `origin/main` (d5c7274). Clear, mist and night scenes were rendered at 375x844, 1366x768, 1920x1080 and 3440x1440, with both Low/High graphics and reduced motion on/off. No horizontal overflow. All five art eras render, including actual three.js Diorama. A real save made through the main renderer reloads with its creatures, ranch, badges, story, position, coins, titles and clock intact. The isolated clone is served using `serve.ps1` on port 8766 to avoid Claude's server; the browser check URLs on 8765 are intercepted and fulfilled only from 8766. No requests reach Claude's server.

| Scene | Before | After |
|---|---|---|
| Clear noon, laptop | [Before](screenshots/saltmarsh-noon-before.png) | [After](screenshots/saltmarsh-noon-after.png) |
| Mist, phone | [Before](screenshots/saltmarsh-mist-before.png) | [After](screenshots/saltmarsh-mist-after.png) |
| Night, desktop | [Before](screenshots/saltmarsh-night-before.png) | [After](screenshots/saltmarsh-night-after.png) |

[Ultrawide mist](screenshots/saltmarsh-mist-3440.png). Comparisons use the same view distance, time, weather and fallback fonts.

## Review coordination

Shipped as Wildbond 1.3.1 (merged on top of the post-game's 1.3.0 by Claude, 2026-10-07).
