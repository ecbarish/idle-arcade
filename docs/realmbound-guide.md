# Realmbound guide (T8 / Lane A3)

The Realmbound portion of T8 is in guides/realmbound.html, about 2800 words. Lore first; a fifteen-minute route, every current system, earned automation, concrete tips and a closed spoiler section. Plain static HTML/CSS, system fonts and 16px phone gutters; no JavaScript, network assets, analytics or save access. The hub's Realmbound card links to it. Other guides remain open, and Wildbond waits for its screen redesign. T8 explicitly says to change no game files, so no game-header link was added.

The optional Node script scripts/update-realmbound-guide.cjs reads trusted game data in a separate context without game startup, saves, DOM or network. It regenerates marked HTML reference tables for races, five classes/trees, eight zones, five dungeons/bosses and seven earned addons. Run it after data edits; --check detects stale tables. Reading the booklet never requires Node, a build or a server-side generator.

Facts follow 00-core, 01-world, 03-talents-abilities, 04-creatures, 05-mounts, 06-npcs, 07-dungeons, 08-inventory-quests, 09-dungeon-runs, 10-state, 11-combat, 12-tabs, 15-events, 18-supplies, 19-raid and 21-guild. Lore follows docs/lore/realmbound.md. Future crafting and other proposals are excluded; solo/Auto timing and a universal best build are not invented.

Validation: --check passes; local links and section anchors return valid destinations; the spoiler remains closed until opened; the page has no scripts or horizontal overflow at 375×812, 1366×768, 1920×1080 and 3440×1440. Reading leaves seeded Realmbound storage unchanged. The hub's actual Guide link opens the booklet. All five game pages pass (Wildbond 1254, Realmbound 4173, Starfall 48, sound 21, offline 15), restore save/hub storage and have zero page errors.

Screens: [phone](screenshots/realmbound-guide-375.png), [laptop](screenshots/realmbound-guide-1366.png), [desktop](screenshots/realmbound-guide-1920.png), [ultrawide](screenshots/realmbound-guide-3440.png). New page, so there is no before screenshot. No gameplay, shared engine, offline/cache or version changes.

T32 is deferred with the concrete selector proposal in docs/proposals/wildbond-area-air.md: three requested town/interior profiles cannot be selected by the existing biome-only lookups while the revised queue permits only profile values. Work moved on without shipping dead profile keys or an incomplete lighting pass.

## An idea

When the launcher gets physical game boxes, present this booklet from the box's back while preserving its ordinary HTML link. A small “start here” bookmark could guide newcomers directly to the first-fifteen-minutes section.

Opening follow-up: [first-ten-minutes audit and implementation brief](realmbound-first-ten-minutes.md). Four isolated creator/combat browser diagnostics confirmed immediate Focus fallback, the skipped first request and ready objectives awaiting manual reward choice. The guide now explains those existing behaviors; no gameplay changes were made.
