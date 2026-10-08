# Depth, a world that knows where things are, and one day first person (proposal, 2026-10-08)

Evan, 2026-10-08, after seeing Maren drawn over the player: *"they can be below you but we should know where things are
in relation to the environment so physics and objects operate like the real thing. ... maybe [the colour] goes from 2d
to 3d. I would love for this game to have a first person mode, maybe further down the road the way pokemon got the
voxel mod ... we have the unique opportunity to get ahead of it and prepare for it."*

Status: **proposal**. Parts 1 and 3 are building rules we can follow now at no cost; part 2 is lore for Evan to approve.

## 1. A world that knows where things are (now)
The Godot trial already keeps the world and the picture apart: every person and creature has a tile, a facing and a
position, and figures are drawn lowest-on-screen last, so someone below you stands in front of you, as in real life.
To make it behave like a real place, every new thing follows these rules:
- **Everything has a footprint and a height.** A person stands on one tile and is about two tiles tall; a fence is
  waist-high; a barn wall is taller than anyone. Whether you can see over, walk under or hide behind something comes
  from these numbers, not from how it happens to be drawn.
- **Ground has height too.** Cliffs, the barn loft, river banks and bridges get a height per tile (Emberfall and
  Cloudglass already have cliffs drawn; next they get real heights). Climbing, falling, ledges you jump down and
  spotting someone from above all come from that.
- **Things happen where they are.** Sound comes from where its source is (louder close by), light falls from the barn
  windows and lanterns onto whatever is under it, creatures smell or see you from where they stand, and an egg sits in
  a nest at a real spot. Nothing is just a button.
- **Maps are data, never pictures.** The tile maps, heights and objects are the truth; the 2D painting is one view of
  them. This is the single most important rule for part 3.

## 2. Where the colour went: the valley lost a dimension (lore, for Evan to decide)
Canon so far (docs/lore/wildbond.md, multiverse.md): the fading was a casualty of the wild bond fighting something
that was draining the land. The proposal: the drain didn't only take colour, it took **depth**. The valley was flattened
into a picture of itself: grey, then flat. Restoring it happens in steps, and each is visible:
1. **Faded and flat** (the start; already in the game).
2. **Colour returns** (your bond, then each restored area; already in the game).
3. **Depth returns** late in the journey: shadows grow long, light falls through things, the land gains height.
4. **The wild bond**, fusing with a fully trusted creature at the edge of defeat, is the moment you first see the
   valley **through its eyes, in first person**, briefly. After the story ends, that view stays as a way to explore:
   first person becomes the reward for restoring the world, not a separate mode bolted on.

The five art eras already in the browser game fit this naturally as stages of the restoration.

## 3. Getting ahead of first person (prepare now, build later)
Like the fan-made voxel Pokemon games, a 3D view can be **generated from the same world** instead of being a second
game to build, as long as part 1 is followed:
- Maps with heights become blocks (voxels) directly; trees, fences and houses become a small kit of block models.
- Creatures and people are already described by shape and colours (`scripts/figures.gd`), which a simple 3D rig can
  read (the README already mentions a 3D rig as a later step).
- Game logic (battles, the ranch, the story) never depends on the camera, so it works the same from any view.

**When:** after the 2D game is finished, as Evan said. The only work now is following part 1. A small later test (one
map, Larkhaven, viewed in Godot 3D, walk around in first person) would show how close it is, likely a few sessions.
