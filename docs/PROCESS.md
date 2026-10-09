# How work gets done: claim, build, submit, merge (every AI, every thread)

Evan, 2026-10-09: "make a clear process and rule for when AIs claim work and when they submit it, and a clear process
for pushing their own PRs." This page is that process. It is the only rulebook for it; QUEUE.md and CONTRIBUTING.md
point here.

## The five steps

| Step | When | What you do | What everyone else sees |
|---|---|---|---|
| **1. Pick** | You're free | Take the first task in [QUEUE.md](QUEUE.md) your lane may take (helpers: "Heavy lifting", then "The road ahead", then "Lane X") whose ID **no open pull request title names**. Nothing free? Use QUEUE.md "When the road is empty". | Nothing yet |
| **2. Claim** | **Before you write any code** | Make a branch (`codex/<topic>`, `claude/<topic>`, `guest/<topic>`), push one small commit (the `(claimed: <who>, <date>)` mark on the task in DEVELOPMENT-PATH), and **open a draft pull request at once whose title starts with the ID** ("WD3: battles with real choices"). | A draft PR with the ID: the task is taken |
| **3. Build** | While the draft is open | Build in small commits and push at least once a day (a claim with no commits for **2 days** is stale; anyone may take it after one comment on it). Keep to the files the task names. One task per pull request. | Commits appearing on the draft |
| **4. Submit** | When it's done and tested | Run the checks the task names (Godot: `node tools/run-all-checks.cjs`; browser: its test page), add screenshots for anything visual, write in plain words what changed and how you tested it, then **mark the pull request "Ready for review"**. Then go back to step 1. | A ready PR with a green "checks" tick |
| **5. Merge** | See "Who merges" below | Merge with a merge commit, add a line to START-HERE's Session log, tick the task in DEVELOPMENT-PATH. | The change is live |

**Stopping early:** close your draft with a comment "released: <why>". **Two drafts with the same ID:** the older
keeps it, the newer moves on.

## Who merges (in this order, whichever comes first)

1. **A Claude reviewer** (lane R) or **Evan**, any time the PR is ready and green.
2. **Another AI, after 2 hours:** if no Claude reviewer has commented on or merged a ready PR for **2 hours**, any
   *other* AI (Evan's dad's AIs, ChatGPT/Codex) may merge it after checking it as in "What a merger checks".
3. **Never the author.** Nobody merges their own pull request. While yours waits, pre-review someone else's (a
   comment starting "Pre-review OK" or listing problems) and pick up the next task.

Whoever merges under rule 2 leaves one comment: "Merged under PROCESS.md rule 2: <what was checked>". A Claude
reviewer reads every such merge on its next sweep and fixes or reverts anything wrong.

## What a merger checks (every merge, every rule)

- The "checks" tick is green on the latest commit, and it merges with no conflicts.
- The task's own tests pass; **old saves still load**; anything visual has a screenshot.
- It is ready (not a draft) and has no unanswered "changes requested" comment.
- Commits use a GitHub noreply email; no passwords, keys or personal details.
- It stays in its task's files.

## Never

- Never push straight to `main`.
- Never merge a pull request that changes `.github/`, CONTRIBUTING.md or this page without Evan or a Claude reviewer.
- Never skip or switch off a test to get a green tick.
- Never bump game version numbers outside lane R (the Claude reviewer does that on merge).
