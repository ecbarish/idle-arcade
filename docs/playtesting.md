# Tester build notes (F4)

The hub's **What to try** link opens `playtest.html`. It is a static page, with no scripts, save reads, save
writes or outside assets. New and returning players have different starting points, so nobody has to reset a
long-running adventure or finish a whole game to help. Realmbound and Wildbond take priority; the parked
prototypes have short optional checks only.

## On each release

- Match each game version to both its header and `js/99-boot.js`. Primordial currently has no displayed version:
  call it a playable prototype rather than inventing one.
- Add the next version's section above its predecessor. Preserve older notes with their version anchors in an
  **Earlier releases** details section, so a shared link still makes sense. The initial page is the baseline:
  Wildbond 1.1.0, Realmbound 1.0.0 and Starfall Guild 1.0.0.
- Name only features merged into the release. Keep new-player routes short and late-game routes optional. State
  prerequisites in words. Read the game code and design/lore docs to verify names, gates and controls.
- Ask for one enjoyable moment and one rough edge. The game's Feedback menu provides version/place context;
  the page's static links open the existing feedback and bug forms without reading or attaching saves.
- Keep local links relative for GitHub Pages. Check them, keyboard focus, readable layout at 375, 1366, 1920
  and 3440 px, and unchanged storage. Run all four existing browser test pages.

The notes describe what is on main. playtest.html and credits.html are in the offline worker's `PAGES` list; nothing
needs bumping when the notes change (updates arrive online first, see docs/offline.md).
