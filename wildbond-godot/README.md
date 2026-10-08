# Wildbond in Godot: the trial

Evan (2026-10-07) wondered whether Wildbond should become a standalone game rather than a browser game. This folder is
a small trial in the free **Godot 4** engine to find out how it feels and how well the assistants work in it, before
deciding (START-HERE.md "Questions for Evan" 1; docs/wildbond-plan.md).

## Play it
Double-click **Play Wildbond trial.bat** (Godot is unzipped in `C:\Users\evanb\Godot`). Arrow keys or WASD to walk;
Enter, Space, E or a click to continue a conversation and to bond. To edit it, run the Godot program, choose
**Import**, and pick this folder's `project.godot`.

## What's in the trial
- Faded Larkhaven on the real map (from games/wildbond/js/11-maps.js), drawn in code on a 384x216 pixel canvas that
  scales by whole numbers, so it stays crisp on every screen (the research's advice).
- An opening that happens in the world: a short narration, Maren walking out of her barn up to you, her words in
  speech bubbles over her head.
- **Maren's ranch register** (the character creator): an open book with you walking and turning on the left page;
  name (type it or pick one), body (broad or narrow), skin, hair style and colour, top, bottom and outfit on the right.
  Arrow keys or the mouse. **Signing paints you in:** you are drawn in colour on your own layer, the one bright thing
  in the faded valley. Your choices are remembered for next time (user://register.json).
- **Choosing your partner in Maren's barn:** Maren leads you to her barn (the big wooden one, top right). Inside, three
  young creatures in their stalls (Cindercub, Ripplet, Mosshog), each with its own body and habits: Cindercub
  pounces at a moth, Ripplet blows bubbles, Mosshog roots in the straw with a finch on its back. Walk up and press Enter
  to open its page (element, role, stats, first moves, matchups, what Maren thinks of it), then **Choose** or **Not
  yet**. The bond floods the barn with colour; your partner follows you out, and the colour has spilled into town.
- **One source of truth:** creatures, moves and matchups come from the browser game (`data/wildbond.json`, made by
  `tools/godot-export.ps1`), so both versions always agree.
- **The paddock pup** (Maren's ranch pup) wanders the paddock, sniffs the grass, sits with its tail curled, and stalks
  and pounces at a butterfly; when you come near it stops and watches you, ears up and tail going.
- The first bond: the young creature chooses you and **colour floods back** into the world around it
  (shaders/fade.gdshader), then it follows you.

## How it's built (for assistants)
- `scripts/figures.gd`: people and creatures built from parts, drawn by any node (the world, the register, later
  other games and a 3D rig). `scripts/register.gd`: the ranch register. `scripts/card.gd`: a creature's page.
- `data/wildbond.json`: the browser game's content (creatures, moves, maps, story). Refresh it after changing the
  browser game: run serve.ps1, then `powershell -File toolsgodot-export.ps1` (uses Edge, built into Windows).
- `scenes/main.tscn` (the camera, the fade layer, the text layer), `scripts/main.gd` (map, walking, people, dialogue,
  the bond), `shaders/fade.gdshader` (the faded world with restored circles).
- Check it without a window: `Godot_v4.7.2-stable_win64_console.exe --headless --path wildbond-godot --quit-after 120`.
  See it: add `--write-movie <folder>/f.png --fixed-fps 10 --quit-after 200 -- --demo` (the demo plays the opening by
  itself) and look at the frames.
- **Checks:** `Godot_v4.7.2-stable_win64_console.exe --headless --path wildbond-godot --script res://tests/run_tests.gd`
  plays the opening by itself and must stay all-pass (38 checks on 2026-10-08).
- **Builds for sharing:** `tools/godot-build.ps1` (web: play/wildbond/, Windows: export/Wildbond-trial-windows.zip),
  once Godot's export templates are installed (Editor > Manage Export Templates > Download and Install).
- Click or tap anywhere to walk there; tap a creature in the barn to walk up and meet it.
- The `.godot/` folder is Godot's cache and isn't saved in git.

## Evan's verdict (2026-10-08)
"This feels much better." Fixed after his first play: Maren no longer blocks the paddock gate, fences join up and
down, people face the way they walk (front, back, side) with stepping feet and a breath when standing, and the cub
wags and trots. His bar for animation is "better than the first Pokémon": see docs/wildbond-plan.md "Art and
animation" (real sprite art is the next step).

## Next, if Evan likes it
A battle on the field, the
Wilddex sketchbook, and the rest of docs/wildbond-plan.md, carrying over all creatures, maps and story as data.
