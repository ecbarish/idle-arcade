$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot 'Results.ps1')
$taskCount=0
function Assert-Reject($name,$events){
 $taskRejected=$false
 try{Get-LocalAgentReport -Events $events | Out-Null}catch{$taskRejected=$true}
 if(-not $taskRejected){throw "FAIL: $name accepted"}
 $script:taskCount++
}
$taskText=[pscustomobject]@{type='text';part=[pscustomobject]@{messageID='final';text='Verified one file.'}}
$taskFinish=[pscustomobject]@{type='step_finish';part=[pscustomobject]@{messageID='final';reason='stop'}}
$taskProgress=[pscustomobject]@{type='text';part=[pscustomobject]@{messageID='earlier';text='Unverified progress.'}}
$taskPartTwo=[pscustomobject]@{type='text';part=[pscustomobject]@{messageID='final';text='No executable checks run.'}}
$taskReport=Get-LocalAgentReport @($taskProgress,$taskText,$taskPartTwo,$taskFinish)
if($taskReport -ne "Verified one file.`n`nNo executable checks run."){throw 'FAIL: final report includes progress or drops final parts'};$taskCount++
Assert-Reject 'empty event log' @()
Assert-Reject 'missing finish event' @($taskText)
Assert-Reject 'unfinished tool sequence' @($taskText,[pscustomobject]@{type='step_finish';part=[pscustomobject]@{messageID='final';reason='tool-calls'}})
Assert-Reject 'token limit' @($taskText,[pscustomobject]@{type='step_finish';part=[pscustomobject]@{messageID='final';reason='length'}})
Assert-Reject 'missing final report' @($taskProgress,$taskFinish)
Assert-Reject 'agent error despite exit zero' @([pscustomobject]@{type='error'},$taskText,$taskFinish)
Assert-Reject 'tool error despite final apology' @([pscustomobject]@{type='tool_use';part=[pscustomobject]@{state=[pscustomobject]@{status='error'}}},$taskText,$taskFinish)
$taskTokens=$null;$taskErrors=$null
[System.Management.Automation.Language.Parser]::ParseFile((Join-Path $PSScriptRoot 'Run-LocalAgent.ps1'),[ref]$taskTokens,[ref]$taskErrors)|Out-Null
if($taskErrors.Count){throw ($taskErrors|Out-String)};$taskCount++
foreach($taskReadOnly in @($false,$true)){
 $taskSerialized=Get-LocalAgentPermission -ReadOnly:$taskReadOnly | ConvertTo-Json -Compress
 $taskPolicy=$taskSerialized | ConvertFrom-Json -AsHashtable
 if(@($taskPolicy.Keys)[0] -ne '*'){throw 'FAIL: catch-all denial must precede explicit rules'};$taskCount++
 if($taskPolicy['*'] -ne 'deny'){throw 'FAIL: unspecified tools must be denied'};$taskCount++
 if($taskPolicy.read -ne 'allow' -or $taskPolicy.glob -ne 'allow' -or $taskPolicy.grep -ne 'allow'){throw 'FAIL: read tools must work after catch-all denial'};$taskCount++
 $taskExpectedEdit=if($taskReadOnly){'deny'}else{'allow'}
 if($taskPolicy.edit -ne $taskExpectedEdit){throw 'FAIL: wrong edit permission for task mode'};$taskCount++
 foreach($taskTool in @('bash','external_directory','task','webfetch','websearch')){if($taskPolicy[$taskTool] -ne 'deny'){throw "FAIL: $taskTool must stay denied"}};$taskCount++
}
Write-Host "PASS: $taskCount runner checks."
