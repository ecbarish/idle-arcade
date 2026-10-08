@echo off
rem Plays the Wildbond Godot trial. Godot lives in %USERPROFILE%\Godot (unzipped there on 2026-10-07).
start "" "%USERPROFILE%\Godot\Godot_v4.7.2-stable_win64.exe" --path "%~dp0."
