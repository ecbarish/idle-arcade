# OpenCode uses last matching rule. Emit the catch-all before explicit tool rules.
function Get-LocalAgentPermission {
 param([switch]$ReadOnly)
 return [ordered]@{
  '*'='deny'; read='allow'; glob='allow'; grep='allow'
  edit=if($ReadOnly){'deny'}else{'allow'}
  bash='deny'; external_directory='deny'; task='deny'; webfetch='deny'; websearch='deny'
 }
}
# Parse OpenCode JSONL only after its process exits successfully.
function Get-LocalAgentReport {
 param([Parameter(Mandatory)][AllowEmptyCollection()][object[]]$Events)
 if($Events.type -contains 'error'){throw 'The local agent reported an error; inspect its event log.'}
 if(@($Events | Where-Object {$_.type -eq 'tool_use' -and $_.part.state.status -eq 'error'}).Count){throw 'A tool failed; the task stays queued for review.'}
 $taskFinish=@($Events | Where-Object {$_.type -eq 'step_finish'}) | Select-Object -Last 1
 if(-not $taskFinish -or $taskFinish.part.reason -ne 'stop'){throw 'The agent did not finish normally; the task stays queued.'}
 # Keep only the final answer's text, excluding earlier progress and compaction summaries.
 $taskFinalText=@($Events | Where-Object {$_.type -eq 'text' -and $_.part.messageID -eq $taskFinish.part.messageID} | ForEach-Object {$_.part.text}) -join "`n`n"
 if([string]::IsNullOrWhiteSpace($taskFinalText)){throw 'No final report was written; inspect the event log.'}
 return $taskFinalText
}
