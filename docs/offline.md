# Install and offline play (L5)

One installable arcade starts at the hub and includes Primordial, Starfall Guild, Realmbound and Wildbond. Visit
the hub online and wait for **Ready for offline play** before disconnecting. Use **Install arcade** when the
browser offers it, or its install / Add to Home Screen menu. Installation is optional; offline browser tabs work too.
HTTPS is needed on a hosted site; localhost works for development. The manifest and worker paths are relative,
including GitHub Pages' `/idle-arcade/` scope. The cabinet icon is original procedural artwork.

The hub prepares one complete release of local pages, scripts and styles. Dependencies come from those pages,
so a newly split script is picked up automatically. Credits and license links are followed when present. Tests,
Studio and arbitrary links are excluded. External Google fonts use system fallbacks offline. Wildbond's external
three.js library is not cached: a fresh offline Diorama session falls back to the existing HD-2D renderer.

No saves, hub progress, sound choices or other localStorage keys are changed by installation. Saves still belong
to the same browser profile and origin. There is no account, cloud sync or cross-device transfer in this feature.

## Releasing cached files

**Bump `CACHE_VERSION` in `sw.js` for every release that changes a cached page, script, style or asset**,
including changes to any of the four games. Keep it unique (date plus counter is enough). Do this in the final
release commit after combining PRs; do not reuse a version. Reusing a live cache version rejects the update.

Preparation requests bypass both the HTTP cache and the previous worker. A failed preparation removes its partial
cache and retains the last working release. The new worker waits until every tab under this arcade scope closes;
it never swaps scripts underneath a running game. When the hub says **Update ready**, close all arcade tabs and
installed app windows, then reopen. Activation deletes old releases for this scope only. No forced reload button.

The hub registers the worker; a player who goes straight to a game before ever visiting the hub has not prepared
offline play. Browser storage may be cleared or evicted: revisit the hub online to prepare again. If initial
preparation fails, online play remains available and the hub says to reopen online to retry.

## Checks

Run `serve.ps1`, open `tests/offline.html` and click **Run checks**. The page runs the real worker source
against isolated memory fixtures, without registering it or changing browser caches or saves. Also run the four
existing game/sound pages. Actual worker integration was checked in a fresh Chrome profile: all four games offline,
the GitHub Pages subpath, directory/query navigation, a waiting update, activation and a deliberately failed update.
Hub layouts were checked at 375, 1366, 1920 and 3440 px. Browser-managed native installation was not automated.

Lifecycle references: [MDN service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers),
[service worker lifecycle](https://web.dev/articles/service-worker-lifecycle).
