# Launcher preview doors (T46 / AR2.2)

The launcher now offers Wildbond and Starfall Guild as early previews, first on the shelf and at their primary landscape places. Wildbond Classic and Starfall Guild Classic remain separate cards and destinations on the road and in the hall. The hall's eight cabinet targets no longer overlap.

Existing recorded frames (images/play/wb-barn.png and sf-town.png) show the actual previews. Their current exported scope and controls come from the game READMEs and play/README.md. Wildbond's latest source has Stillreed, but its current web export predates that addition; the card describes the first four regions until Claude rebuilds it. No game engine is downloaded by opening the launcher. Choosing a preview navigates directly to its existing play/ page.

Preview IDs have no browser save/reset keys and never borrow arcade-index-v1 progress, even if an entry with that ID appears. Classic progress, Continue and Reset retain their existing IDs and keys. No migration or save bridge is implied. First-load guidance recommends a computer and explains the internet requirement. Offline help now distinguishes Classic games from previews. Missing screenshot requests reveal the existing illustrated canvas cover. The online-first worker is unchanged and discovers launcher/games.js through its existing HTML dependency scan; no cache-version bump.

## Verification

Serve with serve.ps1 (this clone used localhost:8766 to avoid Claude's server). With Playwright available, run node tools/launcher-checks.cjs; ARCADE_TEST_ORIGIN overrides the origin, and CHROME_PATH overrides the installed Chrome path. Fresh browser contexts isolate every check from player saves.

174 checks pass at 375x812, 1366x768, 1920x1080 and 3440x1440 with reduced motion: eight cards; images load; exact preview and Classic URLs; progress isolation; reset cancellation; unchanged saves; keyboard destinations stay in view; scene/road/hall counts; nonoverlapping hall targets; no horizontal overflow; no wasm/pck requests or page errors. Failed-image fallback and Enter navigation are also checked. The navigation destination is intercepted to avoid downloading the engine; this is not a fresh Godot gameplay test.

The existing 164 accessibility checks pass. All eight browser test pages pass after merging main: recorded counts below in the PR. Reference captures are in images/qa/launcher-previews/. Screenshots use synthetic Classic progress and fresh contexts. Godot, play exports, service worker, version numbers and game saves are untouched.

## An idea

A future shared look record could put your actual tamer or guild keeper outside their door, with a small last-played glow. That needs a deliberate Godot export hook; these doors do not infer a character or progress from Classic data.
