# Wildbond: all game world (the immersive overhaul)

Evan, 2026-10-07, after his first real play: "I want my screen to be mostly game if not all game world and all my
interactions happen in there. There is room for the Wilddex and journal ... but I would love if we made an animation
and brought up a unique screen that makes you feel more immersed instead of like a basic flash game." And: "Features
should intentionally be shown to us through the story and playing the game and we unlock them as we progress." And:
"I do not want to click food stores or breeding barn ... I want these to be physical interactions in the world."

This is the biggest change to Wildbond since the walkable world. It's planned in parts so each one ships playable.

## Part 1: the screen is the world (layout)
- The scene fills the window (phone to 3440x1440 ultrawide). The side panels and button rows go.
- A thin overlay HUD: where you are, time and weather, your partners as small portraits with health rings, coins.
  Messages appear as dialogue boxes and small speech bubbles over the scene, not text in a panel.
- A satchel icon (and keys) opens your things; Esc opens a pause menu (Settings, Feedback, save, back to the arcade).
- Your character is always easy to find: a contrasting outfit (done in v1.5.1), a soft shadow and a brief glow when
  you stop, and a closer default view (done).

## Part 2: battles on the field
- A transition (screen wipe and a cry), then the battle is drawn over the whole scene in the classic layout: the foe
  top right, your partner bottom left, health bars beside them, a command box at the bottom (Fight / Bond / Bag /
  Run, then the move list with descriptions). Turn-based by default (v1.5.0).
- Every result waits for you, with a short summary (XP, level ups, what was learned, the bond growing).

## Part 3: menus as places in your hands
- **Wilddex**: a field book that opens with a page turn; sketches for seen creatures, full pages for bonded ones,
  habitat, time, weather, the "N of 106 recorded" goal and Maren's research rewards.
- **Team**: your partners standing together in a little scene; tap one for its page (role, stats in words, moves).
- **Journal**: a leather journal with the story so far, the map of the region, badges in a case, your titles.
- Opening and closing are animated (slide, page turn, sound), so it feels like reaching into your bag, not a web page.

## Part 4: the ranch is a place you visit
- Larkhaven's ranch becomes a walkable area: the feeding trough (walk up, choose a sack of food), training posts and
  a resting meadow where you set each creature's day by talking to it, Maren's breeding stall, the egg nest, and the
  pens where your creatures wander. The shop is a counter with a shopkeeper and a shelf.
- The Ranch tab goes; a small "ranch report" letter from Maren arrives each ranch day instead.

## Features arrive with the story (progressive unlocks)
| When | What opens | How it's shown |
|---|---|---|
| Start | Your partner, walking, talking, battles | Maren and Wren, the first battle |
| After Wren | The Wilddex and its goal | Maren hands you her old field book (v1.4.0) |
| First bond | The ranch (pens, trough) | Maren's tour when you bring a creature home (v1.5.1: the Ranch opens then) |
| Thorn Badge | Colour, running boots, autopilot and Auto-explore, the breeding stall | Isolde's scene, then Maren |
| Tide Badge | Light and depth, weather, visible wild creatures | Existing scene |
| Ember Badge | Riding, fast travel to places you've been, the Diorama (3D) look | Existing scene |
| Champion | Challenge modes for the next journey, the Spire | Existing |

## Is the first zone 3D? Will everything feel small?
Today the 3D "Diorama" look unlocks with the third badge and draws the same tile maps as blocks; the maps are small
(about 30 by 14 tiles), so in 3D they do feel like tabletop models. Two answers:
1. In Part 1 the camera and sprites get bigger in every look (a closer default view, larger characters).
2. The planned Modern 3D era (W6) is where Wildbond gets bigger, more detailed places built for 3D, with a camera
   behind your shoulder. That's a large project for after launch; the walkable 2D world stays the base.

## Evan's third round of notes (2026-10-07)
- **Autopilot and Auto-explore are off for now** (v1.5.2); they come back later as a deliberate unlock if they earn a place.
- **A day lasts an hour** (v1.5.2), not five minutes: day and night are slow enough to enjoy, and night encounters and
  lighting still come round in a play session. The ranch day is the same hour (eggs take two hours, not ten minutes).
- **Characters present in the intro:** Maren walks up and talks to you in the world, shows off creatures, Wren runs in
  (opening part 2, queue B3b). Speech appears over the scene near the speaker, not only in a box at the bottom.
- **A character creator** (W13) and **creature variants** like shinies, sizes and markings (W14).
- **Bigger worlds, first person one day** (docs/VISION.md §10).
