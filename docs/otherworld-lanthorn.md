# Lanthorn: three days before the tide (T35)

The first Asterhold life now passes through Lanthorn's square before going out, on returning, and on the last morning. Food and fear are small bounded qualities chosen by authored events. Reading slowly, closing the game and time offline do not consume either. Each new day consumes one food and adds two fear; flour, shared bread and reassurance can change that. The square shows stocked or empty bread stalls, open or closed shutters and the well queue. Dialogue reflects those same qualities. Bread costs two silver normally, three when people are frightened, four when supplies are scarce. Helpers need both supplies and confidence.

Hesta supplies six silver at registration, once. Every gift has a consequence:

- Appraisal involuntarily reads Ressa's hunger. She closes her private hearth invitation and will not personally rally for you. Selling bread, helping Bren and saving the town remain open.
- Pocket Space draws Corvin's demand to hide relief flour. Accepting earns four silver while reducing supplies and trust; refusal costs three silver for the reserved cart or an afternoon's labor if you keep your coin. The return visit can retrieve the flour and return Corvin's payment. None of this removes the original story's endings.
- The Sword Saint's Instinct draws the blade at Oldroot and visibly closes the gentle options, making the already-described inability to hold back real.

Choices keep their order. Every unmet requirement is visible with an authored reason beside its disabled button. Mouse, touch, number keys and the story callback all check the current requirement. Tab/Enter activate the focused enabled choice; Enter outside a choice selects the first available one. Escape skips narration to the choices, without choosing for the player. Uses the existing shared portrait dialogue; shared files are unchanged.

## Save contract

The existing `otherworld-save-v1` key stays. Each life gains `town` and an `entered` node record. Legacy lives retain their flags, purse and memories, receive a default town at the appropriate story day, and mark their current scene as already entered. New node effects only run on the first entry, so reloading cannot repeat registration pay, decay or a choice. An ending-in-progress is saved and resumes its epilogue, preventing the player from choosing a different ending after a reload. Completed soul memories and life records keep their original shape. The Archivist has one authored response for each of the six existing memories.

## Validation

- Otherworld: 831 checks, including all 64 memory subsets × three gifts × four town states, every original ending reachable, no dead ends, costs and relief routes, locked clicks/keys, price changes, exact reload behavior, legacy saves, epilogue resume and stale callbacks.
- All eight browser pages pass: Realmbound 7,713, Wildbond 1,354, Diamond Career 102, Starfall 48, sound 21, offline 15, Otherworld 831 and runner safety 35. Seeded saves, hub progress and recovery backups restored byte for byte, zero page errors.
- Actual browser play at 375×812, 1366×768, 1920×1080 and 3440×1440: a locked choice stays put, focused Enter buys the intended bread, Mira's route reaches its original ending, the council reload is identical, and calm/struggling town scenes differ. Reduced-motion mode checked; no overflow, dialogue stays inside the window.
- Before/after capture uses the same stampede scene: O0 hides two options, T35 shows them and their reasons. Other screenshots show the actual new square.

Images: [before](screenshots/otherworld-lanthorn/before-hidden-1366.png), [after](screenshots/otherworld-lanthorn/after-reasons-1366.png), [phone](screenshots/otherworld-lanthorn/locked-375.png), [well-stocked square](screenshots/otherworld-lanthorn/fed-1920.png), [struggling square](screenshots/otherworld-lanthorn/struggling-1920.png).

Scope: Otherworld game files, its checks, this record and task/changelog/session metadata. No Godot, shared engine, other games or game version changes. Claude owns the version bump on review, per QUEUE's rule.