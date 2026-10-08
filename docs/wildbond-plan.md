# Wildbond: the plan (the one to follow)

Rewritten 2026-10-07 from Evan's first three play sessions. This page replaces the scattered plans; the older docs stay
for detail: [wildbond-opening.md](wildbond-opening.md) (his first notes, the premise), [wildbond-immersive.md](wildbond-immersive.md)
(the all-game-world idea), [proposals/creature-growth.md](proposals/creature-growth.md) (baby forms), [VISION.md](VISION.md)
(the arcade's direction), [lore/wildbond.md](lore/wildbond.md) (canon).

## What Wildbond is now

A creature-bonding adventure in a faded land. You pick a partner, meet Wren, and travel eight regions to the league,
earning badges, bonding with wild creatures and filling Maren's Wilddex; every bond helps the world remember its colour.
Content is complete (eight areas, the league, the Champion, the Lighthouse Spire). What it needs is **feel**: Evan's
first play found it hard to read, too fast, too menu-driven and too small. This plan fixes that, then grows it.

## Principles (from Evan's notes; every change follows these)
1. **All game world.** The screen is the world. Menus are things you hold (a field book, a journal), opened with an
   animation; never a web page beside the game.
2. **Physical interactions.** You walk to the inn, the shop counter, the feeding trough, the breeding stall, the
   Warden. No buttons that skip the world.
3. **Features arrive with the story.** Each system is introduced by a person, in a scene, when it matters; nothing is
   shown before you can use it.
4. **Readable.** Full words, roles in plain language (Tank, Bruiser...), every move and stat explained, results that
   wait for you, a character you can always find. Turn-based battles by default.
5. **Earned quality of life, not autopilot.** Autopilot and Auto-explore are off (v1.5.2); conveniences are earned.
6. **Unhurried.** A day lasts an hour of play (v1.5.2).
7. **Never small.** Bigger characters and places now; bigger regions and, one day, 3D and first person (VISION §10).
8. **Old soul, modern craft.** Pixel art and classic structure with modern light, motion and comfort.
9. **Learn from the classics, don't copy them.** Pokémon's first hour (a person, a choice, a rival, a goal) is the
   model for clarity; our bonding, faded world and ranch are our own.

## The phases (each ships playable; Claude builds 1-5 and 7, ChatGPT takes 6)

**Done (v1.4.0-v1.5.2):** pick-then-confirm start, story names, challenge modes after Champion, Maren's Wilddex goal,
turn-based battles, faded colour instead of four greens, no world-skipping buttons, roles and stat help on cards,
results that wait, a visible tamer, ranch and breeding revealed by the story, hour-long days, autopilot off.

**Phase 1: the screen is the world** (Claude, next). Full-window scene on every screen size; a thin overlay HUD (place,
time and weather, partner portraits with health rings, coins); dialogue as boxes and speech bubbles near the speaker;
a satchel icon and keys for your things; Esc for a pause menu (Settings, Feedback, save, back to the arcade); larger
characters; your tamer with a soft shadow and a brief glow when you stop.

**Phase 2: the opening, alive** (Claude). A short narrated prologue over the faded land. The cart arrives; Maren
walks up and talks to you in the world, with creatures around her; a **character creator** (W13: body type, skin,
hair, outfit, name) framed as Maren's ranch register; you meet the three partners in her barn and choose one by
walking up ("Choose Ripplet?"); Wren runs in; the first battle teaches itself; Maren hands you the Wilddex; the first
wild bond is guided. The Wilddex shows "N of 106 recorded" with Maren's research rewards at milestones.

**Phase 3: battles on the field** (Claude). A transition into a classic layout over the whole screen (foe top right,
your partner bottom left, health beside them, a command box: Fight / Bond / Bag / Run, then moves with descriptions);
a summary that waits (XP, level ups, new moves, the bond growing).

**Phase 4: menus you hold** (Claude). The Wilddex as a field book with page turns and sketches; your team standing
together in a little scene; the Journal as a leather book with the region map, the badge case and your titles.

**Phase 5: the ranch as a place** (Claude). A walkable ranch: the feeding trough, training posts and resting meadow
(set each creature's day by talking to it), Maren's breeding stall, the egg nest, pens where your creatures wander, a
shop counter with a shopkeeper. Maren's daily letter replaces the Ranch tab.

**Phase 6: variety and delight** (ChatGPT, in parallel). **Creature variants** (W14, ticket T33: shimmering colours,
sizes, markings, cosmetic only); then baby forms (W9/W10, on the proposal's defaults), contests and races (W4), a
larger roster (W11).

**Phase 7: a bigger world** (Claude, after Launch). Larger connected regions loaded in pieces, real height (cliffs,
stairs, bridges), a closer 3D camera, then the Modern 3D era (W6) and, one day, first person (VISION §10).

## Lessons from the research (docs/research/creature-games-ux.md, 2026-10-07)
Adopted, by phase:
- **Phase 2 (opening):** the opening is an *event*, not a menu (Ruby's dropped bag, Scarlet's cliff); you **paint
  yourself into** the faded world in the character creator; your partner **follows you from the first moment**; the
  first bond is guided and **bursts colour into the tiles around it**, teaching the core loop without words; tall
  grass is introduced by Maren stopping you at its edge.
- **Phase 3 (battles):** classic geometry, the command box in a corner leaving the centre for animation, a **visible
  turn-order queue** (our battles are speed-based already; show who acts next), a grey-fog transition with no
  flashing, a results screen that shows growth. Later, worth trying: **element chemistry** (fire on a tide creature
  makes steam) and **stamina** instead of cooldowns (polls first).
- **Phase 4 (menus):** the Wilddex as a sketchbook (a charcoal sketch on first sight, watercolour on bonding); the
  **map inks itself in** as you explore; the bag as pouches; a tamer's licence with your portrait and pinned badges.
- **Phase 5 (ranch):** the ranch becomes a **Sanctuary** that starts grey and blooms as creatures live there (water
  creatures restore the fountain, plant creatures wake the trees); you pet, feed and play by walking up to them;
  creatures work stations that suit their element (with W5, ranch jobs).
- **Phase 6 (variety):** variants glow into the faded world so you spot them from afar; a later pigment-mixing
  craft raises the odds for a while. Whether variants are only cosmetic or a little stronger is a **poll**.
- **Phase 7 (bigger world):** **overworld abilities** from creatures (push, swim, glide, cut vines) that open paths
  you saw hours earlier; that, more than map size, makes a world feel big.
- **Every phase:** one pixel scale for everything (sprites, UI and text on the same grid) and whole-number scaling
  only, so the art stays crisp on every screen. This weighs on the platform question below.

## Open question for Evan: browser or a standalone game?
Evan (2026-10-07): "the more I see we can do the more I feel it needs to be its own game rather than browser."
Options and a recommendation are in the session notes and START-HERE's Questions for Evan; until he decides, phases
that are mostly design and content (the opening's story, the Sanctuary's design, the data) go ahead, and the big
screen rebuild (phases 1, 3, 4) waits so it's built once.

## Art and animation (Evan, 2026-10-08, after the Godot trial)
"It feels like Pitfall or some very old game; even the first Pokémon felt more advanced." The trial's figures are drawn
pixel by pixel in code, which caps how alive they can look. The bar: **better than the classic handhelds**: four-way
walking with at least four frames, idle animations (breathing, looking around, creatures sniffing and playing),
battle animations, and lively scenery (grass that sways when you walk through it, smoke, water, birds). That needs
**real sprite art**: either drawn sprite sheets (by an artist, or AI-generated and then cleaned up), or licensed
packs that fit our look (CC0 or CC-BY; recorded in CREDITS.md). Godot plays sprite-sheet animations natively. First
step: choose an art direction and a base sprite size (likely 16x16 tiles with 16x24 characters, or 32x32), then make
one character and one creature properly as the template.

**Decided 2026-10-08 (Evan):** use the free CC0 **Ninja Adventure** pack (16x16, four-way walk animations, 60+
monsters, tilesets, effects; CREDITS.md) as placeholder art to move fast, while building **our own original assets**
over time for a recognisable identity. The Godot trial now uses its tamer, Maren and a partner (the Racoon).

## How we'll know it works
Evan replays the first hour after each phase. A new player should be able to say, within ten minutes: who Maren and
Wren are, why the world is faded, how to bond with a creature, what the Wilddex is for, and where to go next, without
reading a menu. Playtesters vote where we're unsure (docs/VOTES.md).
