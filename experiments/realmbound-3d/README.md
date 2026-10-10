# Realmbound third-person trial

A separate walkable inn: original procedural 3D models, solid furniture, a follow/orbit camera, real shadows and the shared portrait dialogue. No player save reads/writes; no gameplay conversion yet.

Serve the repository, then open `/experiments/realmbound-3d/` (Codex's independent server is http://localhost:8766/). WASD/arrows walk relative to the camera, drag looks, wheel zooms; E or Interact talks near Merran and enters/exits near the door. On phones hold the arrow buttons and drag the world to look. Reset view restores camera framing.

Uses the same MIT-licensed three.js r134 CDN as Wildbond's Diorama, plus existing shared/dialogue.js. An uncached first load needs the internet. No paid/downloaded art: all models, textures and fire geometry are original code.

Plan and limits: [conversion outline](../../docs/proposals/realmbound-3d.md). Checks: `node tests/realmbound-3d.cjs http://localhost:8766` with Playwright and Chrome available.