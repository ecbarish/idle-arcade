param(
 [string]$Godot = 'C:\Users\evanb\Godot\Godot_v4.7.2-stable_win64_console.exe',
 [string]$Node = 'node',
 [string]$Output = 'docs/measurements/wildbond-late-pacing.json'
)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path $PSScriptRoot -Parent
$taskProject=Join-Path ([IO.Path]::GetTempPath()) ('wildbond-pacing-'+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path (Join-Path $taskProject 'scripts') | Out-Null
try {
 [IO.File]::WriteAllText((Join-Path $taskProject 'project.godot'), '[application]'+"`n"+'config/name="Wildbond isolated pacing diagnostic"')
 foreach($name in @('rules','battle','figures')) {Copy-Item -LiteralPath (Join-Path $repoRoot "wildbond-godot/scripts/$name.gd") -Destination (Join-Path $taskProject "scripts/$name.gd")}
 Copy-Item -LiteralPath (Join-Path $repoRoot 'tests/wildbond-late-pacing.gd') -Destination (Join-Path $taskProject 'pacing.gd')
 Copy-Item -LiteralPath (Join-Path $repoRoot 'wildbond-godot/data/wildbond.json') -Destination (Join-Path $taskProject 'wildbond.json')
 Copy-Item -LiteralPath (Join-Path $repoRoot 'wildbond-godot/data/evolution.json') -Destination (Join-Path $taskProject 'evolution.json')
 Push-Location $repoRoot
 try { & $Node 'tests/wildbond-late-pacing-fixtures.cjs' $taskProject; if($LASTEXITCODE -ne 0){throw 'Data/fixture verification failed.'} } finally {Pop-Location}
 & $Godot --headless --path $taskProject --script res://pacing.gd
 if($LASTEXITCODE -ne 0){throw 'Godot pacing diagnostic failed.'}
 $result=Join-Path $taskProject 'results.json'
 if(!(Test-Path -LiteralPath $result)){throw 'Diagnostic did not write its results.'}
 $data=Get-Content -Raw -LiteralPath $result | ConvertFrom-Json
 if($data.failures.Count -gt 0){throw 'Numeric parity or diagnostic invariant failures.'}
 $hashes=[ordered]@{}
 foreach($name in @('rules','battle','figures')){$hashes["scripts/$name.gd"]=(Get-FileHash -LiteralPath (Join-Path $taskProject "scripts/$name.gd") -Algorithm SHA256).Hash.ToLowerInvariant()}
 foreach($name in @('wildbond','evolution')){$hashes["data/$name.json"]=(Get-FileHash -LiteralPath (Join-Path $taskProject "$name.json") -Algorithm SHA256).Hash.ToLowerInvariant()}
 $data | Add-Member -NotePropertyName sourceHashes -NotePropertyValue $hashes
 $target=if([IO.Path]::IsPathRooted($Output)){$Output}else{Join-Path $repoRoot $Output}
 $parent=Split-Path $target -Parent
 if(!(Test-Path -LiteralPath $parent)){New-Item -ItemType Directory -Path $parent | Out-Null}
 [IO.File]::WriteAllText($target,($data | ConvertTo-Json -Depth 100)+"`n",[Text.UTF8Encoding]::new($false))
 Write-Output "Results: $target"
} finally {
 # One native shell end to end; verify the generated absolute path before recursive cleanup.
 $tempBase=[IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\')+'\'
 $resolved=[IO.Path]::GetFullPath($taskProject)
 if(!$resolved.StartsWith($tempBase,[StringComparison]::OrdinalIgnoreCase) -or (Split-Path $resolved -Leaf) -notmatch '^wildbond-pacing-[a-f0-9]{32}$'){throw 'Unsafe diagnostic cleanup path.'}
 if(Test-Path -LiteralPath $resolved){Remove-Item -LiteralPath $resolved -Recurse -Force}
}
