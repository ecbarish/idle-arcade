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
  speech bubbles over her head, then a walk to the paddock.
- The first bond: the young creature chooses you and **colour floods back** into the world around it
  (shaders/fade.gdshader), then it follows you.

## How it's built (for assistants)
- `scenes/main.tscn` (the camera, the fade layer, the text layer), `scripts/main.gd` (map, walking, people, dialogue,
  the bond), `shaders/fade.gdshader` (the faded world with restored circles).
- Check it without a window: `Godot_v4.7.2-stable_win64_console.exe --headless --path wildbond-godot --quit-after 120`.
  See it: add `--write-movie <folder>/f.png --fixed-fps 10 --quit-after 200 -- --demo` (the demo plays the opening by
  itself) and look at the frames.
- The `.godot/` folder is Godot's cache and isn't saved in git.

## Next, if Evan likes it
The character creator ("paint yourself in"), choosing your partner in Maren's barn, a battle on the field, the
Wilddex sketchbook, and the rest of docs/wildbond-plan.md, carrying over all creatures, maps and story as data.
