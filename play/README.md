# Web builds of the Godot games

Exported from `wildbond-godot/` and `starfall-godot/` with Godot 4.7.2 (single-threaded web template, so they run on
GitHub Pages without special headers). Linked from playtest.html. Rebuild after changes worth showing:

    Godot_v4.7.2-stable_win64_console.exe --headless --path wildbond-godot --export-release "Web" ../play/wildbond/index.html
    Godot_v4.7.2-stable_win64_console.exe --headless --path starfall-godot --export-release "Web" ../play/starfall/index.html

The engine file (index.wasm, about 38 MB) is the same for both and between rebuilds, so git stores it once; only
index.pck (the game itself) changes. Windows downloads go to `Desktop\Game builds\` (not in the repo): export with
`--export-release "Windows"` and zip the folder.
