# The local AI helper: what it can do for us (Claude's test, 2026-10-08)

ChatGPT set it up on Evan's PC on 2026-10-08 (`C:\Users\evanb\Local-AI\`, its README explains it): **Ollama** running
**Qwen3-Coder 30B** locally (as `arcade-coder`, a 16,384-token working memory), working in a **separate clone** of the
repo whose push is disabled, so nothing it does reaches GitHub without review. No tokens, no cloud, no cost beyond
electricity.

## What Claude measured
- **Speed:** Evan's RTX 4090 runs it at about 200 tokens a second once loaded (about 10 seconds to load). Fast.
- **The queue runner doesn't work yet:** `Run Queued Tasks` drives the model through the Codex tool, and the model
  can't use Codex's tools (`unsupported call: run_command`), so tasks end at once with an apology. The **OpenCode**
  agent in the same folder does work: it read files and finished in 1.4 minutes. Fix: switch `Run-LocalAgent.ps1` to
  call `opencode\opencode.exe run` with `OPENCODE_CONFIG=opencode-local.json` (ChatGPT built the runner, so it's
  ChatGPT's to change; Lane D below).
- **Quality:** on a judgement task (compare the Otherworld guide with the game's data, report mismatches) its report
  was muddled and wrong: it said the guide's gifts don't match the game, when they do, and contradicted itself about
  which worlds are playable. It also ran out of working memory partway (16K tokens is small for our big files). On the
  setup benchmark (fix a small function, run its check) it succeeded.

## Verdict: good for small, checkable jobs; not for judgement or review
Use it where a wrong answer is caught automatically or by a glance:
- **Drafting for a person to pick from:** ten name ideas, five versions of a sign or an NPC line, dex lines in a set
  style. Claude or ChatGPT chooses and edits.
- **Mechanical edits with a check as the gate:** rename a field, add a default to old saves, write test boilerplate
  for a function, convert a table to data, where an existing test page proves it worked.
- **Searches and lists:** every string in a file that breaks the player-text rules (lowercase names, symbols), every
  link in a guide, every species missing a dex line, as a list someone checks.
- **Long, boring batches overnight:** reformatting, spell-checking text files, generating screenshots' captions.

Not for: reviewing ChatGPT's work, design, story, balance, anything spanning many big files, or anything merged
without a person (or Claude) checking it. Never pointed at Claude's folder or the Godot projects.

## Lane D (docs/QUEUE.md)
Small tasks of the kinds above, read-only first. Its results go in `C:\Users\evanb\Local-AI\logs\`; anything useful is
brought into a normal `codex/` branch by ChatGPT or Claude after review.
