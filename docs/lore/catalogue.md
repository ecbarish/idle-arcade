# The shared creature catalogue: batch 2

T37, Codex, 2026-10-08. The browser roster now has **107 species** (93 plus 14). This is data and lore for the shared catalogue, not a Realmbound conversion or a change to either world's history. Each game keeps its own combat, levels and relationship with creatures. Source: games/wildbond/js/00-data.js; Reach inventory: games/realmbound/js/01-world.js.

## New Wildbond entries

All fourteen use established family bodies and moves. Young forms have 300 base points, middle and single forms 420, final long-line forms 510; none is a guardian or a legendary. Their dex entries name their habitat and describe care, shelter or finding a way home. They add eight previously empty family/element pairs.

| ID | Name | Family / element | Browser encounter or growth |
|---|---|---|---|
| `flintpup` | Flintpup | wolf / Stone | emberfall |
| `cairnhound` | Cairnhound | wolf / Stone | cloudglass |
| `ridgewarden` | Ridgewarden | wolf / Stone | Raised from Cairnhound |
| `seedpip` | Seedpip | bird / Grove | thornwood |
| `hedgelark` | Hedgelark | bird / Grove | Raised from Seedpip |
| `boughchorus` | Boughchorus | bird / Grove | sunthread |
| `saillet` | Saillet | lizard / Gale | saltmarsh |
| `draftscale` | Draftscale | lizard / Gale | cloudglass |
| `stormfrill` | Stormfrill | lizard / Gale | Raised from Draftscale |
| `sunfrill` | Sunfrill | lizard / Radiant | sunthread |
| `fogsail` | Fogsail | lizard / Shade | cloudglass |
| `cinderstitch` | Cinderstitch | spider / Ember | emberfall |
| `laughrill` | Laughrill | hyena / Tide | stillreed |
| `fordfoal` | Fordfoal | horse / Tide | stillreed |

## Growth and the engine handoff

Three complete browser growth lines use the existing level evolution and recursive breeding ancestry:

- Flintpup → Cairnhound at 18 → Ridgewarden at 36.
- Seedpip → Hedgelark at 16 → Boughchorus at 34.
- Saillet → Draftscale at 18 → Stormfrill at 36.

Cinderstitch, Laughrill and Fordfoal never evolve. Their dex says why remaining themselves serves their companions; each has an adult-sized stat budget and a useful support move.

**The Saillet branch is authored Godot data, not new browser logic.** Once it reaches 18, the first matching option is Fogsail in Cloudglass Pass, Sunfrill at Devoted trust (bond 3), then ordinary Draftscale. Mist takes priority when both conditions hold, matching Poolkit's existing ordering. Each option has a readable Maren hint. The browser continues its existing automatic level evolution to Draftscale; Fogsail and Sunfrill can also be met directly in their habitats. Do not advertise trust/place evolution as playable in the browser.

The options live on SPECIES.saillet.catalogueEvos, so the existing exporter carries them with the species. A ready-to-merge copy is in [catalogue-evolution.json](catalogue-evolution.json). Claude should:

1. Review this PR, then run tools/godot-export.ps1 from his current main.
2. Merge only the new evos.saillet entry into wildbond-godot/data/evolution.json. Keep the existing Pyremane, Deeptide, Elderthorn and Poolkit entries. Export alone does not activate catalogueEvos.
3. Preserve the Godot choice to say Not yet, and verify its actual evolution, hint, team-companion and save checks. No Godot files or exporter were changed by this PR.

No new revelation about the fading, wild bond or Toren's watcher is asserted. These dex entries are everyday natural history; no mystery clue needs adding to the thread ledger.

## The Reach: proposed bodies, unchanged identities

The following covers **every kind:beast entry in all eight current Realmbound zones (31 entries)**. Humanoid foes, undead constructs and dungeon/raid bosses are outside this zone-beast pass. Do not turn the Diggers, Gloomfin people, trolls, treants or Wayfolk into catalogue animals.

These are **future visual catalogue correspondences**, not runtime substitutions. An element here describes the Wildbond species and palette; it does not grant Realmbound a new damage type. Keep every existing mob ID, name, level, quest target, drop, encounter frequency, pet tier and elite flag. Named beasts are individuals, not rename targets. Local coats and proportions can differ between regions; no sea crossing or contact between the peoples is established.

### Thornvale

| Current beast (ID) | Catalogue species | Local form to preserve |
|---|---|---|
| Young Wolf (`wolf`) | Flintpup (`flintpup`), wolf / Stone | Keep its current level and local coat. |
| Thornback Boar (`boar`) | Thornback (`thornback`), boar / Grove | Keep Thornback Tusk and its current level. |
| Grizzlemaw (`grizzle`) | Cairnhound (`cairnhound`), wolf / Stone | Named individual; preserve its title, size, rarity and tameability. |

### Redsand Steppe

| Current beast (ID) | Catalogue species | Local form to preserve |
|---|---|---|
| Sun Lizard (`lizard`) | Sunfrill (`sunfrill`), lizard / Radiant | Keep its current level and local coat. |
| Dust Hyena (`hyena`) | Screegrin (`screegrin`), hyena / Stone | Keep Hyena Mane and its current level. |
| Razorhide Boar (`razor`) | Flintroot (`flintroot`), boar / Stone | Keep Razorhide Pelt and its current level. |
| Kraska Duneclaw (`duneclaw`) | Dunepounce (`dunepounce`), cat / Stone | Named individual; preserve its title, size, rarity and tameability. |

### Greywater Fens

| Current beast (ID) | Catalogue species | Local form to preserve |
|---|---|---|
| Bog Lurker (`lurker`) | Bogbough (`bogbough`), croc / Grove | Keep its current level and local coat. |
| Fen Spider (`spider`) | Duskweaver (`duskweaver`), spider / Shade | Keep Bog Silk and its current level. |

### Ashen Ridge

| Current beast (ID) | Catalogue species | Local form to preserve |
|---|---|---|
| Cinderfang Wolf (`ashwolf`) | Blazefang (`blazefang`), wolf / Ember | Keep Cinderfang Pelt and its current level. |
| Obsidian Boar (`ridgeboar`) | Flintroot (`flintroot`), boar / Stone | Keep Obsidian Tusk and its current level. |
| Slagscale Lizard (`slagscale`) | Ashskip (`ashskip`), lizard / Ember | Keep Heatproof Scale and its current level. |
| Coalmaw, the Living Furnace (`coalmaw`) | Kilntusk (`kilntusk`), boar / Ember | Named individual; preserve its title, size, rarity and tameability. |

### Frostmere

| Current beast (ID) | Catalogue species | Local form to preserve |
|---|---|---|
| Rimecoat Wolf (`rimewolf`) | Soundhowl (`soundhowl`), wolf / Tide | Winter coat and frost breath; keep its current level and pelt. |
| Snowroot Boar (`snowboar`) | Orchardroot (`orchardroot`), boar / Grove | Keep Snowroot Tusk and its current level. |
| Driftstalker Cat (`driftcat`) | Shalecat (`shalecat`), cat / Stone | Keep Driftstalker Pelt and its current level. |
| Hushfang, the White Vigil (`hushfang`) | Soundhowl (`soundhowl`), wolf / Tide | Named individual; preserve its title, size, rarity and tameability. |

### The Barrowfields

| Current beast (ID) | Catalogue species | Local form to preserve |
|---|---|---|
| Gravebreath Wolf (`gravewolf`) | Cairnhound (`cairnhound`), wolf / Stone | Keep Gravebreath Pelt and its current level. |
| Stoneweft Spider (`barrowspider`) | Moorweft (`moorweft`), spider / Stone | Keep Stoneweft Silk and its current level. |
| Paleweft, the Lamp-Eater (`paleweft`) | Pallweaver (`pallweaver`), spider / Stone | Named individual; preserve its title, size, rarity and tameability. |

### The Hollow Crown

| Current beast (ID) | Catalogue species | Local form to preserve |
|---|---|---|
| Rotgnaw Wolf (`rotgnaw`) | Briarwatch (`briarwatch`), wolf / Grove | Keep Rotgnaw Pelt and its current level. |
| Thornridge Boar (`thornridge`) | Thornback (`thornback`), boar / Grove | Keep Forked Briar Tusk and its current level. |
| Giltweb Canopy Spider (`giltweb`) | Cragskein (`cragskein`), spider / Stone | Keep Giltweb Silk and its current level. |
| Ashwing Canopy Drake (`ashwing`) | Ashskip (`ashskip`), lizard / Ember | Keep Ashwing Hoard Scale and its current level. |
| Veskareth, the Bough Sentinel (`veskareth`) | Ashskip (`ashskip`), lizard / Ember | Named individual; preserve its title, size, rarity and tameability. |

### The Crown's Heart

| Current beast (ID) | Catalogue species | Local form to preserve |
|---|---|---|
| Crownfang Wolf (`crownfang`) | Briarwatch (`briarwatch`), wolf / Grove | Keep Crownfang Pelt and its current level. |
| Hearttusk Boar (`hearttusk`) | Thornback (`thornback`), boar / Grove | Keep Heartwood Tusk and its current level. |
| Veilweft Spider (`veilweft`) | Cragskein (`cragskein`), spider / Stone | Keep Veilweft Cord and its current level. |
| Ashwing Broodguard (`broodguard`) | Ashskip (`ashskip`), lizard / Ember | Keep Broodward Scale and its current level. |
| Ashwing Gilded Elder (`elderwing`) | Ashskip (`ashskip`), lizard / Ember | Keep Hoard-Sign Scale and its current level. |
| Aurethyn, the Unbound Wing (`aurethyn`) | Ashskip (`ashskip`), lizard / Ember | Named individual; preserve its title, size, rarity and tameability. |

### Differences that must survive reuse

- **Ashwing is the Reach's existing drake lineage**, not a hybrid bred at Maren's ranch. Use Ashskip's Ember lizard body as a base with authored wings, a gold/brown canopy coat and stage-appropriate size. Do not label it Drakelet (the Wildbond hybrid) or import that hybrid's origin. Veskareth, Aurethyn and the matriarch Seraveth retain their identities and history; Seraveth is a raid boss, outside this table.
- **Rotgnaw and Crownfang** need sick green/gold woodland coats and their existing aggression. Borrowing Briarwatch's body does not erase the Hollow Crown's influence or promise its recovery.
- **Gravebreath and Paleweft** remain living beasts of the Barrowfields, not confirmed Wayfolk spirits. Preserve Gravebreath's cold exhalation and Paleweft's pale coat and lamp-hunting behavior.
- **Frostmere's winter forms** reuse silhouette families while keeping their winter ecology. Soundhowl does not make a level-30 Rimecoat into a level-68 Wildbond encounter; Orchardroot's coat becomes pale Snowroot, and Shalecat's becomes Driftstalker.
- **Giltweb and Veilweft** need gilt silk and a gold canopy coat on the established spider silhouette. Cragskein is a body/element starting point, not proof the spiders came from Emberfall.

No extra Reach-only species are necessary for this first body mapping. Regional phenotype names and unique individuals remain the Reach's catalogue aliases. Any later new species, family shape or combat conversion deserves its own reviewed task.

## Verification and existing browser limit

All eight browser pages pass: Wildbond 1,485; Realmbound 7,729 scenario checks; Diamond Career 122; Otherworld 831; Starfall 48; sound 21; offline 15; runner safety 35. The runners restore saves, hub and recovery backups exactly. Actual Wilddex inspected at 375, 1366, 1920 and 3440 widths; [phone](../screenshots/catalogue-2/wilddex-375.png) and [renderer contact sheet](../screenshots/catalogue-2/creature-sheet.png). The sheet is a test composition of the existing 16-bit renderer, not a new game screen.

Independent source comparison confirms all prior species fields and encounter weights unchanged. New encounter entries slightly dilute the old encounter percentages. No route trainers, Wardens, guardians, moves, save fields, art code or screen code were edited.

The existing browser grow() applies one evolution per XP award. Normal level-by-level journeys and both breeding ancestry steps are checked. A very large single award crossing both thresholds changes only once; another level-up is needed for the final form (impossible if that award already reaches level 100). This data-only ticket does not rewrite grow(); Claude should address that edge in the engine separately if retaining long lines in the browser. Godot evolution is reviewed separately after its handoff.
