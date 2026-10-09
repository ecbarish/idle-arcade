# The web and shipping (fast downloads, a repository that stays healthy)

Written 2026-10-09. Read this before rebuilding `play/`, adding sound or art, or publishing a build.

## What a friend downloads
Opening a Godot preview downloads the engine (`index.wasm`, 38 MB, once; the browser caches it) and the game
(`index.pck`). On 2026-10-09 Wildbond's pack went from 25.3 MB to 20.0 MB; Starfall's is 2.9 MB. Nearly all of
Wildbond's is music (13 tracks of OGG at about 250 kbit/s). Phones on mobile data feel every megabyte.

**Rules for assets:**
- **Tunes and looping sounds: OGG Vorbis.** WAV only for very short effects (a click, a chime), where it costs nothing.
  Convert with `ffmpeg -i in.wav -c:a libvorbis -q:a 4 out.ogg`; set `loop = true` in code or the Import tab.
- **One file per tune.** If two places share a tune, point both at one file (Wildbond's `SAME_TUNE`) instead of copying.
- **Pictures: PNG, as small as the art allows.** Pixel art compresses well; never upscale before importing (Godot
  scales it with nearest filtering).
- **Record every outside asset in CREDITS.md** with its source and licence (CC0, CC-BY with credit, or free-for-games).
- If the music ever needs to shrink further, re-encoding at a lower quality is an option, but it is lossy-to-lossy
  and audible on good speakers: ask Evan first.

## Why the repository is getting heavy
Git keeps every version of every file forever. A rebuilt `play/wildbond/index.pck` is a new 20-25 MB file each time,
and there were 14 rebuilds in two days. On 2026-10-09 the history (`.git`) was 284 MB. GitHub recommends keeping a
repository under 1 GB, and GitHub Pages refuses to publish a site over 1 GB. Cloning (a new PC, a cloud session,
ChatGPT's tasks) gets slower with every rebuild.

**Rule from now on:** rebuild `play/` when a step is worth showing friends (a new area, a milestone, a fix they asked
for), not after every commit; say in the session log that you rebuilt it. The engine file never changes between
rebuilds, so it costs nothing.

**The better way (proposal, needs Evan):** let GitHub build the previews. The checks workflow already downloads Godot;
a deploy workflow could export both `index.pck` files and publish the site, so built packs never enter the history.
It needs one setting change by Evan (Settings, Pages, Source: "GitHub Actions") and a workflow Claude writes. Until
Evan says yes, keep committing packs at milestones.

## Publishing
- **Web previews:** `play/README.md` has the export commands (single-threaded web template, so GitHub Pages needs no
  special headers). `--export-pack "Web" ../play/<game>/index.pck` rebuilds only the pack and needs no templates.
- **Windows builds:** zipped into `Desktop\Game builds\`, never committed.
- **Before publishing anything:** all checks pass (saves-and-testing.md), then open the preview in a browser and play
  the first minute. A blank screen usually means the pack and the engine file came from different Godot versions.
