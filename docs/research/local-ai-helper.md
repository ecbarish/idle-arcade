# The local AI helper: what it can do for us (Claude's test, 2026-10-08)

ChatGPT set it up on Evan's PC on 2026-10-08 (`C:\Users\evanb\Local-AI\`, its README explains it): **Ollama** running
**Qwen3-Coder 30B** locally (as `arcade-coder`, a 16,384-token working memory), working in a **separate clone** of the
repo whose push is disabled, so nothing it does reaches GitHub without review. No tokens, no cloud, no cost beyond
electricity.

## Runner update (Codex, 2026-10-08, PR #66)

D0 is implemented and installed: Run Queued Tasks now calls OpenCode, attaches Claude's `primer.md` and
`lessons.md`, and reads the model name from `tools.json`. It derives the context limit from the selected model's
Ollama `num_ctx` (optional `tools.json.contextLength` override); it no longer forces a 16K server setting.
Reviewable runner source and parser regressions are in `tools/local-ai/`. The runner stops on process/tool errors,
truncated answers, missing final reports, invalid task modes and changes awaiting review. Final reports exclude
progress/compaction text. Normal queued tasks still cannot execute shell commands; Claude/Codex run game checks.

The installed runner completed a bounded Otherworld guide lookup with both context files attached, returning the
correct title and the three gift names. Source locations were independently checked; the helper clone stayed clean.
Nine parser/syntax regressions pass. This verifies transport and completion handling, not broad reasoning quality.
The earlier incorrect guide audit remains unapproved. Claude's original observations below are preserved.

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

## Making it better (Evan asked, 2026-10-08)
"Teaching" a model usually doesn't mean retraining it. In order of value for effort:

1. **A bigger working memory.** It has 16,384 tokens, and ran out partway through one guide check. Evan's RTX 4090
   (24 GB) can hold about 64,000 if Ollama stores its memory compactly (two Ollama settings:
   `OLLAMA_FLASH_ATTENTION=1`, `OLLAMA_KV_CACHE_TYPE=q8_0`, plus a model variant with `num_ctx 65536`). No download.
2. **Teach it with what it reads, not by retraining:** a one-page project primer it loads on every task (our rules in
   brief, where things are, the test commands), two or three worked examples of a good answer for each kind of task,
   and a `lessons.md` that grows every time a reviewer catches a mistake ("the guide's gifts are paraphrased; that is
   not a mismatch"). This is how it improves week to week.
3. **Let it check its own work:** allow it to run the Node checks (`node tests/realmbound-smoke.cjs` and similar) and
   simple scripts, so "done" means "the check passed", not "I think so".
4. **Try models built for agent work** and keep whichever scores best on our own five-task benchmark (real tasks with
   known answers, kept in Local-AI/benchmark): `gpt-oss:20b` (about 14 GB, strong at using tools, long memory) and
   Devstral Small (about 14 GB, made for coding agents). Downloads need Evan's OK.
5. **Fix the runner** (Lane D0) so queued tasks actually run through OpenCode.
6. **Real fine-tuning** (training it on our code) is possible on a 4090 with free tools, but needs hundreds of
   good examples and a lot of care for a modest gain. Not worth it yet; revisit if the helper becomes a daily tool.

## Results (Claude, 2026-10-08 evening)
- **Benchmark** (five real tasks with known answers, `Local-AI\benchmark-tasks`): `arcade-coder` (Qwen3-Coder 30B)
  **80%** with the primer and lessons attached (60% before); `gpt-oss:20b` **40%**. Devstral and a 64K test were cut
  short (below); run `Run-Benchmark.ps1 -Models @('arcade-coder-32k:latest','devstral:latest')` to finish them.
- **The model is now `arcade-coder-32k`** (tools.json): twice the working memory, same speed (about 5,800 tokens a
  second reading, 180 writing, entirely on the GPU). Settings kept: `OLLAMA_FLASH_ATTENTION=1`,
  `OLLAMA_KV_CACHE_TYPE=q8_0` (they cost nothing in speed).
- **64K does not fit** on a 24 GB card next to Windows: it spills into slow memory (under 20 tokens a second).
- **Restarting Ollama safely:** stop `ollama serve` **and every `llama-server.exe`**; old runners left behind keep
  their GPU memory and make the next model run half on the CPU (this is what made the first tests look slow).
- **Lessons that mattered:** the config's permission order ("*": "deny" first, or the agent gets no tools and pretends);
  the model still invents findings when it cannot read a file (lesson recorded). Keep it to checkable jobs.
