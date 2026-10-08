# Wildbond research: Codex's assessment

Requested by Evan, 2026-10-07. Read alongside [Gemini's summarized report](creature-games-ux.md), [the current plan](../wildbond-plan.md) and [the trial README](../../wildbond-godot/README.md). This document is a review and recommendation, not a replacement plan or instruction to change Claude's work. The stored report is Claude's summary of Gemini, not the full sourced research output; individual game-specific claims still need verification before they become design requirements.

## My recommendation

Continue the Godot trial, with one complete and polished opening as the next proof. Evan has already played it and said it feels much better. That is stronger evidence about this project's direction than a broad comparison of engines. Keep the browser game as the working reference and preserve its data, story, balance and saves while evaluating the new experience. Do not interpret enthusiasm for the trial as permission to redesign combat or migrate every game at once.

I checked the installed executable: `C:/Users/evanb/Godot/Godot_v4.7.2-stable_win64_console.exe` reports `4.7.2.stable.official.ed1daf0bf`. A short headless startup of the trial in Codex's own clone completed without reported errors when run with an explicit temporary log path and normal filesystem access. The first sandboxed attempt could not write its user log or read the system certificate store. This verifies startup, not the blocked gate, visual quality, exports or a playable end-to-end opening. No Godot files were edited.

## Ideas I would keep

**The first bond restores colour.** It makes the premise an action the player witnesses. Keep a clear physical gesture between creature and tamer before the effect, then let the player stand still and look. Colour should communicate a relationship, not merely a reward animation. Clarify eventually whether colour spreads locally, permanently, or by story milestones; the trial's circles are not yet a complete persistence rule.

**Painting yourself in.** Strong when framed as Maren helping the traveler take their place in the world. Let the player see their choices on the actual character at world scale. Keep names, contrast and body options readable; avoid making the customization metaphor a long mandatory tutorial.

**A sketchbook Wilddex.** It distinguishes seeing from bonding and fits Maren's research. Keep a quick way to compare moves and roles, and a reduced-motion option for page/colour effects. An object-like menu still needs efficient navigation.

**The Sanctuary.** The most promising longer-term idea: the creatures visibly change a shared home, and care has a place and a face. Start with one water creature changing one fountain, or one plant creature waking one tree. Validate the feeling before building a large job economy or daily care checklist. Evan's no-chore-traps rule still applies.

**Returning to earlier paths.** A remembered obstacle can make the world feel larger than extra empty acreage. Offer more than one compatible species for each required traversal ability, and avoid permanent softlocks or a compulsory party slot. This needs its own design step after the opening is solid.

## Ideas I would separate from the migration

Chemistry, stamina, changed-element variants and stronger rare variants are gameplay redesigns, not prerequisites for making Wildbond immersive. The current T33 variants are explicitly cosmetic. A research suggestion or poll cannot silently override that requirement. Preserve current combat first, then try a small optional experiment if Evan authorizes it.

A visible turn-order indicator should represent Wildbond's actual turn rules, including speed changes and ties. Do not copy a claimed feature from another game's summary without checking it, or display a guaranteed future sequence the combat code cannot guarantee.

More creatures will not address a blocked gate or lifeless walking. Content is already plentiful; a few appealing partners and a world that reacts to them can sell the opening better than expanding the roster during the port.

## What Godot solves, and what it does not

Godot supplies sprite-animation tools, scene composition and export workflows. It does not supply a coherent palette, expressive silhouettes, walk cycles, unobstructed routes, good dialogue staging or a pleasant battle rhythm. Claude's fixes to Maren's position, fence connections and movement are the right immediate work. I will leave them to him.

The next quality leap is a small **art and animation specification**, followed by one complete character and one partner. Define silhouettes, facing directions, foot contact, idle poses, interaction gestures, shadows and animation timing. Give creature families different motion: a cub should not share a bird's gait. Art can be handcrafted, procedural or generated and then cleaned; judging frame consistency matters more than the source. Credit and license outside assets.

Do not promote the 316-line trial into the full game simply by adding every system to `main.gd`. For the next slice, separate content definitions, world/movement, dialogue flow, battle rules, presentation and saves where that creates clear ownership. Avoid building an elaborate universal engine before one loop is enjoyable.

## Crisp pixels and modern comfort

The research's insistence on one pixel grid is useful for world art but too absolute as a rule for all UI. Compare a pixel-scaled world with a separate readable UI layer, particularly for large text, localization and accessibility. High-resolution text need not imply blurry world sprites. This is a visual choice to test, not a demand to change the trial today.

The trial currently uses a 384x216 design size, `canvas_items`, integer scale and `keep` aspect. Integer scale protects pixel consistency; keeping 16:9 produces borders on an ultrawide. By the configured scaling arithmetic, a 3440x1440 screen fits a 6x image of 2304x1296. That is a layout prediction, not a measured screenshot. A wider camera viewport or a carefully composed alternative could use the remaining space without stretching characters. Compare approaches on Evan's actual screen before deciding.

A higher base resolution alone does not create better animation or larger characters. Character size, camera framing, silhouette detail and motion need to be designed together.

## The migration proof I would ask for

One portable opening: arrival, customization, three partners in the barn, choice, first field battle, first bond, sketchbook entry, save, close, reopen. Keep the original quest/species identifiers. Import a small representative subset from a defined content export rather than maintaining hand-copied rules in two games. Test that stats and outcomes match the browser reference where intended.

Browser localStorage does not automatically become a native save. Plan an explicit, backed-up import with schema checks and clear unsupported-field handling before claiming old journeys transfer. No automatic overwrite. Native persistence and exports need their own testing.

Choose Windows as the first tested build because it is Evan's current machine. Godot's export options are not proof that phone/web builds will meet performance, input or layout goals. Evaluate those separately later. Do not promise a full-port date from the time spent on this trial.

## Next research topic

[Gemini prompt: Godot art, animation and a safe content migration](gemini-godot-production-prompt.md). This complements the first report: it asks how to deliver the desired quality with a small team, how to preserve the existing game, and what to test before committing to a full port. It does not duplicate Claude's current code fixes.

## Verified technical references

- [Godot: multiple resolutions](https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html): stretch mode, aspect and integer scaling; layout options rather than one universal pixel rule.
- [Godot: 2D sprite animation](https://docs.godotengine.org/en/stable/tutorials/2d/2d_sprite_animation.html): built-in animation approaches; expressive assets remain our responsibility.
- [Godot: saving games](https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html): explicit serialization and storage; browser saves still need a migration contract.
- [Godot: exporting projects](https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html): export setup is separate from proving a target's playability.

These support the technical discussion. The creative priorities above are my judgment, informed by Evan's play feedback and the project's pillars.