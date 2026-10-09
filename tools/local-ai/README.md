# Local helper runner

Reviewable source for the helper installed in `C:/Users/evanb/Local-AI/`. This is not a game runtime dependency.
Ollama, its model, OpenCode and the separate helper clone are already installed outside the arcade checkout.

The runner requires PowerShell 7. Copy `Run-LocalAgent.ps1` and `Results.ps1` together into Local-AI; the existing
Desktop shortcuts use that runner. Alternatively run this source with `-LocalRoot C:/Users/evanb/Local-AI`.
Keep the installed `tools.json`: its `opencode`, `ollama`, `node` and `model` values select the binaries and model.
The selected model's Ollama num_ctx controls the provider context limit; tools.json.contextLength can override it.
Do not overwrite Claude's primer, lessons, model settings or benchmark files. Attachments are required;
`primer.md` and `lessons.md` belong to Claude and are passed with `opencode run -f` on every task.

- `-Mode Ask`: one task; add `-ReadOnly` to deny edits.
- `-Mode Queue`: sorted `queue/*.json`, each with `prompt` and `mode` (`read-only` or `edit`).
- `-Mode Status`: installed/loaded models and workspace.
- `-Mode StopModel`: unload only the selected model.

Local inference uses only the Ollama provider; no cloud fallback, sharing or automatic updates. Both task modes
deny shell, web, subagents and external-directory tools. Edit mode permits file edits in the helper clone;
read-only denies them. These are OpenCode tool permissions, not an OS sandbox. The root config denies shell
commands too: the temporary benchmark's `node check.cjs` allowance does not carry into normal queued work.

An exclusive lock prevents overlapping queue runs. Dirty clones, invalid tasks, process errors, failed tools,
truncated answers and missing reports stop the queue without moving the task into completed. Every run writes
prompt/event/error logs. A completed entry means a report is available for review, not that its claims are correct.
After edits, the queue stops for a human to inspect the diff. Never change the clone's disabled push URL.
Executable game checks are run by Claude/Codex before accepting an edit; the starter helper cannot run them.

Run `Check-Results.ps1` with PowerShell 7 for event-parser regressions. The installed benchmark demonstrated a
small arithmetic fix with all five independent cases passing. Its broad Otherworld audit was wrong; do not use
this helper for design, balance or review approval. See `docs/research/local-ai-helper.md` for current findings.
