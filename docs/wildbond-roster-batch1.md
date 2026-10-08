# W11: creature roster batch one

## Design

Twelve species fill ten family/element pairs absent from the current 81-species roster. Existing bodies, moves, growth, breeding and battle systems do the work. Basic forms total 300 base points, the two adults and Hearthlaugh total 420, and the reserved unique Veilmote totals 540. Hearthlaugh stays itself at every level: speed, Wits and Spirit plus Howl/Regrowth give a single-form partner a useful support identity without a new move or evolution system.

The dex lines describe creatures doing ordinary things together: sheltering hatchlings, holding riverbanks, reading currents, testing ledges and sharing dew. They do not explain the fading or create another guardian. New names and text are original. Browser art reuses the ten existing body plans; the richer Godot shapes/conditions are Claude's work.

| Species | Family / element | How to find it | Evolution |
|---|---|---|---|
| Fernruff | wolf / Grove | Thornwood, weight 6 | Briarwatch at 18 |
| Briarwatch | wolf / Grove | Raise Fernruff | Adult |
| Poolkit | cat / Tide | Saltmarsh, weight 6 | Rilllynx at 24 |
| Rilllynx | cat / Tide | Raise Poolkit | Adult |
| Hearthlaugh | hyena / Radiant | Emberfall, rare weight 2 | Never evolves; 420 base points |
| Cairnclasp | lizard / Stone | Emberfall, weight 6 | Single form |
| Bogbough | croc / Grove | Thornwood, weight 5 | Single form |
| Tumbletusk | boar / Gale | Cloudglass, weight 6 | Single form |
| Slatehoof | horse / Stone | Cloudglass, weight 6 | Single form |
| Kilnchirp | bird / Ember | Emberfall, weight 6 | Single form |
| Dewspinner | spider / Tide | Saltmarsh, weight 5 | Single form |
| Veilmote | sprite / Shade | Reserved unique definition, not yet obtainable | Single form |

Veilmote follows T6's unique-species-outside-the-wild-table rule. It has no new story or special encounter in this data-only batch. The eight guardian events remain exactly as before. A later authored encounter is needed before it can be bonded in ordinary play; the Wilddex includes the definition now.

Existing spawn entries and weights remain unchanged. Adding ordinary choices changes relative probabilities: Thornwood and Saltmarsh totals rise from 103 to 114, Emberfall 103 to 117 and Cloudglass 105 to 117. Existing low-weight species stay rare; Hearthlaugh is rarer than Glowmote. No biome ranges, story teams, caps, XP, starter choices or rewards change. Existing Randomizer seeds deterministically use the expanded pool, so their future wild assignment changes (the existing system reconstructs its shuffle from the current tables); saved partners are unchanged.

## Shared catalogue handoff

shared/catalogue/wildbond-batch1.json is data for proposed cross-world habitats, not a second list of combat stats. It points by ID to Wildbond's authoritative SPECIES definitions. The existing exporter carries those definitions to Godot. Realmbound's Thornvale, Greywater Fens, Ashen Ridge, Frostmere and Barrowfields are possible habitats, explicitly marked proposed: none of its monsters or encounters change here. No game imports this manifest yet; consolidation of the entire roster remains a later step.

No Godot, Realmbound runtime, renderer, UI or shared engine files change. There are no new save fields or schema changes. Existing species are byte-for-data identical, including moves, evolution and stats. Existing saves retain partners, genes, names, variant looks, story progress and money.

## Validation

- Seven browser test pages pass on this independent branch from main 4801a19: Wildbond 1354 (100 additional checks: 62 generic data checks and 38 batch scenarios), Realmbound 4407, Diamond 83, Starfall 48, sound 21, offline 15 and Otherworld 38. PRs #49/#50 are separate review work, not regressions missing from this branch.
- New scenarios exercise real weighted encounter selection, both level evolutions, default and custom names, genes/bond/variants, breeding back to young forms, Hearthlaugh through level 100, unique breeding/Randomizer exclusions, all three existing 2D body renderers, and an old save. No uncaught browser errors; isolated test save/hub restoration passes.
- Actual game battle views checked at 375x812, 1366x768, 1920x1080 and 3440x1440, with no horizontal overflow. The before encounter uses the existing Cindercub; after uses the new Fernruff with the same player fixture. The renderer sheet shows all twelve in the current 16-bit art; it is a QA image, not a new menu.
- The actual tools/godot-export.html output contains all 93 species (90 ordinary definitions plus three existing hybrids), including all twelve additions. Habitat IDs and all original data/spawn weights verified. No generated Godot files written.
- Own clone and isolated profiles use the serve.ps1 server on 8766, routing localhost test URLs to it. Claude's checkout, 8765 server and player saves untouched. No version or cache bumps.

## An idea

Before the next batch, decide which environments are missing a creature role as well as a family/element pair. A riverbank defender and a travelling support partner feel more distinct than another damage dealer with a new colour. Give Veilmote a small, optional nesting-place encounter when the shared catalogue is integrated, rather than an extra Warden or unexplained ninth guardian.