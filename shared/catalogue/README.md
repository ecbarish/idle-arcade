# Creature catalogue: first habitat batch

W11 begins the catalogue with a JSON habitat manifest, wildbond-batch1.json. IDs point to Wildbond's SPECIES definitions, which remain the single source for names, family, element, colours, stats, learnsets and dex text. The existing tools/godot-export.html exporter includes those definitions unchanged; this manifest adds proposed cross-world habitats without duplicating combat stats.

No game imports this manifest yet. It is a handoff for the shared-catalogue consolidation, not a second save format or a claim that Realmbound already has these creatures. Realmbound habitat entries are explicitly proposed, and use current zone IDs. Browser evolution still follows evo.at/evo.to; branching, trust/weather conditions, gear and Godot body work remain Claude's lane.

Ten of the twelve new species have no evo field: two are adults, seven are ordinary single-form species (including the stronger Hearthlaugh), and Veilmote is a reserved unique encounter. Veilmote has no ordinary spawn or implemented story event; it does not become an extra region guardian. Its eventual encounter should be designed separately. Existing creatures and saves are not migrated by this metadata.
