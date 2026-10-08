# Copies a browser game's content (creatures, moves, maps, story...) into its Godot version as JSON, so both versions
# share one source of truth. Needs the local server running (serve.ps1) and Microsoft Edge (built into Windows).
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File tools\godot-export.ps1 [-Game wildbond]
param([string]$Game = 'wildbond')
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { Write-Error 'Microsoft Edge was not found.'; exit 1 }
$tmp = Join-Path $env:TEMP "godot-export-profile"
$html = & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$tmp" --virtual-time-budget=15000 --dump-dom "http://localhost:8765/tools/godot-export.html?game=$Game" 2>$null | Out-String
if ($html -notmatch '<pre id="out"[^>]*>([A-Za-z0-9+/=]+)</pre>') { Write-Error 'No data came back. Is serve.ps1 running?'; exit 1 }
$json = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Matches[1]))
$dir = Join-Path $root "$Game-godot\data"
New-Item -ItemType Directory -Force $dir | Out-Null
$out = Join-Path $dir "$Game.json"
[IO.File]::WriteAllText($out, $json, (New-Object Text.UTF8Encoding $false))
if ($html -match '<p id="status">([^<]*)</p>') { Write-Output $Matches[1] }
Write-Output "Saved $out"
