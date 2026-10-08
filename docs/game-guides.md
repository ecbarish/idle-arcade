# Illustrated field guides (A6b)

The shelf at guides/index.html now opens Realmbound, its separate tips booklet, Diamond Career and Otherworld. Wildbond waits for the Godot version. Pages are static HTML with the existing shared booklet style; they never execute game code or read saves. Spoilers stay in closed details.

Four PNGs in guides/images are real Chrome captures from the running browser games, using isolated demonstration characters, not art mockups or evidence of an unassisted human playthrough. Source facts were checked against Realmbound's existing data, onboarding and member-story code; Diamond Career's 00-data through 03-ui and 99-boot; Otherworld's 00-data, 01-game and 99-boot. The guides separate current chapters from future worlds and avoid invented features. Diamond describes both batting styles, paid development after a missed call-up, contract dates, fatigue and the bounded first month. Otherworld describes Asterhold, gifts, scene controls, endings and remembered knowledge.

Validation: all links, section anchors and images resolve; keyboard skip links work; spoilers begin closed; no horizontal overflow at 375×812, 1366×768, 1920×1080 and 3440×1440; reading leaves seeded saves unchanged. Realmbound's generated tables pass scripts/update-realmbound-guide.cjs --check. All seven browser runners pass: Realmbound 6683, Wildbond 1354, Diamond 102, Starfall 48, sound 21, offline 15, Otherworld 38, with zero page errors. The pre-existing Otherworld runner retains automatic test backups, while restoring its primary save and hub progress.

Before/after phone and current phone/ultrawide captures: docs/screenshots/game-guides/. No gameplay, engine, cache or version changes.
