# Wildbond creature variants (T33 / W14)

## Design

Gleaming creatures carry a quiet dawn colour and two small stars: a hint of the faded world's remembered light. The term describes a look, not rarity or strength. Tiny (85%) and huge (115%) stay modest enough for the existing maps and portraits. Cats, hyenas, spiders and birds carry seven individual seeded spots/short stripes, masked onto the body so faces remain readable. The seed survives evolution; a new egg has a new pattern. Missing variant means ordinary, forever: old creatures are not rerolled.

Wild rolls: Gleaming 1/200; tiny and huge each 1/25, mutually exclusive. Colour and size roll independently. Each eligible newborn gets a pattern. Breeding first rolls the ordinary chances, then each parent's colour/size feature can echo at 10% after choosing one variant parent. Thus a Gleaming parent has about a 10.45% Gleaming child chance, not a guaranteed inheritance. Spire milestone eggs also roll cosmetic looks. Fixed-rarity starters, trainer creatures, story guardians and second-chance partners stay ordinary.

## Integration for the screen rebuild

19-variants.js owns rules, labels, records, marking generation and drawing adapters. The existing factory and breeding/roamer entry points are adapted once; gameplay functions still run once. No changes to shared/creatures.js, stat formulas, rarity, capture odds, XP, costs, speed, hit boxes or save keys.

Optional c.variant is persisted with the creature; S.variantDex defaults to an empty object and stores per-species seen/bonded look categories, not thousands of marking seeds. The roamer's stored look is copied into the encountered creature, so its appearance does not change on approach. Evolution retains the individual look and records the evolved species.

The screen files have only the ticket's tiny integration hooks: a script tag in index.html, portrait metadata plus label/helper calls in 05-ui.js, and a species adapter for roamers in 06-scene.js. No layout or CSS changes. fresh/load gain the record default in 02-state.js; 14-diorama.js adds the look to its geometry cache key. Claude can reuse variantLabel(c), variantDexHTML(id), variantSpecies(c) and variantPortrait(canvas) in the rebuilt screens.

All eras use the same rules. Pocket keeps its four inks; colour differences there are subtle and stars identify Gleaming. Reduced motion makes stars steady, and drawing never consumes random rolls. Diorama's world builds the variant's actual voxel silhouette; battles retain its existing HD-2D rendering. A reusable scratch canvas avoids per-frame canvas allocations.

## Validation

29 new browser checks: 50000 encounter rolls, 10000 inheritance rolls, cosmetic-only stats/moves/traits, ordinary starters/guardians, old saves, real save/load, breeding/egg hatch, seen versus bonded records, persistent roamer appearance, five-era pixels, native Pocket inks and reduced motion. All five pages pass: Wildbond 1254, Realmbound 4173, Starfall 48, sound 21, offline 15. Save/hub storage restored; zero page errors.

Checked 375×812, 1366×768, 1920×1080 and 3440×1440: no horizontal overflow and labels present. Actual three.js Diorama loads without errors. Gallery is a diagnostic fixture, not a new game screen; its Diorama row is battle art, with the separate world capture covering WebGL.

[Ordinary gallery](screenshots/wildbond-variants-before.png) · [Variant gallery](screenshots/wildbond-variants-after.png) · [Phone](screenshots/wildbond-variants-375.png) · [Laptop](screenshots/wildbond-variants-1366.png) · [Desktop](screenshots/wildbond-variants-1920.png) · [Ultrawide](screenshots/wildbond-variants-3440.png) · [Diorama world](screenshots/wildbond-variants-diorama.png).

No version/cache bump or merge. All art is drawn procedurally from the existing original sprites; no external asset.

## An idea

When Claude builds Maren's field book, give each bonded individual a small sketch with its pattern and nickname. Keep the species completion goal separate so cosmetic discovery is a delight rather than a required grind.
