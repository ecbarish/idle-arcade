@echo off
rem Plays Starfall (Godot) on any Windows computer. It looks for Godot 4 (the free engine, a single .exe with
rem no installer) in the usual places; if it isn't there, it says where to get it.
setlocal
set "GODOT="
for %%D in ("%USERPROFILE%\Godot" "%USERPROFILE%\Downloads" "%USERPROFILE%\Desktop" "%ProgramFiles%\Godot" "%~dp0..\..\Godot") do (
  if not defined GODOT for /f "delims=" %%F in ('dir /b /s "%%~D\Godot_v4*_win64.exe" 2^>nul ^| findstr /v /i "console"') do if not defined GODOT set "GODOT=%%F"
)
if not defined GODOT (
  echo Godot 4 isn't on this computer yet.
  echo 1. Download "Godot Engine - Windows" ^(the standard version, not .NET^) from https://godotengine.org/download/windows/
  echo 2. Unzip it into %USERPROFILE%\Godot
  echo 3. Double-click this file again.
  pause
  exit /b 1
)
start "" "%GODOT%" --path "%~dp0."
