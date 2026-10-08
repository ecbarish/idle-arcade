# Gemini deep research: Wildbond's Godot production slice

Prepared by Codex for Evan, 2026-10-07. This complements the creature-game UX report and does not authorize gameplay changes. Save the result as `docs/research/godot-production-slice.md`; preserve its sources and distinguish reported facts from recommendations. Claude owns the current trial code; this prompt researches the next production decisions.

Copy the prompt below into Gemini Deep Research:

---

We are building Wildbond, an original creature-bonding adventure in a faded world where bonds restore colour. We already have a working browser game: roughly 106 species, eight regions, story, battles, breeding, a league, a Champion and post-game. The player meets Maren, chooses a partner, travels with Wren and records creatures in the Wilddex. We want old-soul RPG structure with modern animation, lighting and comfort, not a dashboard or deliberately primitive retro graphics.

A small Godot 4.7.2 standard-edition trial runs on Windows: faded Larkhaven on the existing tile map, Maren walks up and speaks in bubbles, the player bonds with a cub, colour spreads around it and it follows. The trial draws procedural art at a 384x216 design size with 16px tiles, nearest filtering, integer scaling, canvas_items stretch and keep aspect. It is proof of feel, not a finished game. There is no creator, battle, menu or save system in the trial. The owner liked it substantially more than the browser version but found a gate blocked by Maren, badly connected vertical fences, and animation that felt much too primitive. Another developer is fixing those three problems now; do not spend this report solving those particular bugs.

Research a practical production plan for the NEXT polished slice: arrival, painting yourself into the world, choosing among three partners in the barn, one field battle, first bond, one Wilddex sketchbook page, saving and reopening. Two AI coding assistants work in separate Git clones; a human owns creative approval and reviews changes. The browser game must remain playable throughout. We are not redesigning combat or adding stronger rare variants: existing variants stay cosmetic.

Please investigate:

1. **Art direction and animation.** What makes small 2D characters feel expressive rather than primitive? Give an actionable specification for player/Maren and one cub: silhouette, approximate sprite-size alternatives, facing directions, idle/walk/trot/interact frames, timing, foot contact, tail/ear motion, shadows and creature-family differences. Compare handcrafted pixel sprites, procedural drawing, and AI-assisted assets cleaned by hand. Explain consistency, licensing and workload. Recommend a tiny reusable asset set, not 106 fully animated creatures at once.
2. **Presentation.** Compare fixed low-resolution rendering, an expanding viewport and a pixel world with independently scaled readable UI. Explain actual Godot stretch/filter/camera settings and tradeoffs. Evaluate 1366x768, 1920x1080 and especially 3440x1440 ultrawide; cover phone layout as a later target. Preserve crisp art while allowing larger text. Do not assume all UI must share the world's pixel grid.
3. **Modern craft without clutter.** Prioritize lighting, contact shadows, environmental animation, audio, dialogue staging and battle transitions that improve this slice. Include reduced motion, no flashing, clear collision boundaries and readable faded colours. Separate quick procedural wins from quality that needs proper assets.
4. **Safe migration.** Propose a small architecture separating content, rules and presentation. Compare JSON and Godot Resources for existing species/maps/story. Define stable IDs, validation, one source of truth, browser-to-native save import, backups and versioning. Describe how to compare combat/stat outcomes between JavaScript and GDScript. Do not claim existing data or saves transfer automatically.
5. **Testing and collaboration.** Recommend headless checks, deterministic battle fixtures, route/interaction checks, save-reload cases, recorded-frame review and Git file ownership. Explain what automated playback cannot prove about player agency, pathfinding or visual quality.
6. **Delivery decisions.** Windows-first slice, then separately evaluated web/mobile exports. Identify dependencies and unknowns. Give effort ranges with assumptions, not a promise that a full port takes one or two sessions. Identify anything requiring a human artist or manual playtest.

Use current primary sources for technical claims: official Godot documentation, maintained project documentation, developer talks/postmortems and first-party asset licenses. Give links, publication/version information when available, and mark unverified claims. Use game examples only when they demonstrate a transferable technique; do not recommend copying their art, music, names or signature UI.

End with: (a) five highest-value choices to make now, (b) a ranked table of ten tasks with benefit, effort, dependency and acceptance test, (c) a concrete definition of a convincing 15–20-minute slice, (d) what to postpone, and (e) no more than five questions requiring the owner's decision. Label suggestions as suggestions, not approved requirements. If repository files are not available to you, say so and do not pretend to have inspected them.

---