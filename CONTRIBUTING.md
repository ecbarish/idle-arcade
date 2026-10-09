# Contributing to Idle Arcade (for guests and their AI helpers)

Welcome. Idle Arcade is Evan's set of games, built by Evan with several AI assistants. This page is for anyone outside
that group who wants to help, for example a family member working with their own AI (ChatGPT, Claude, Gemini or
another). You don't need to know how to program: your AI does the work, and this page tells it the rules.

## 1. Get set up (once)

1. Make a free GitHub account at github.com if you don't have one, and tell Evan your GitHub name.
2. Evan invites you as a **collaborator** (Evan: on GitHub, the repo's Settings, Collaborators, Add people, type the
   name). Accept the invitation from the email GitHub sends, or at https://github.com/notifications.
3. Give your AI access to the repo. It works on its own **branch** (`guest/<topic>`), never on `main`, so nothing it
   does reaches the games until a pull request is reviewed and merged.
   (Without an invitation you can still help: press **Fork** on the repo page and work in your own copy.)

## 2. Paste this to your AI to start every session

```
You are helping with github.com/ecbarish/idle-arcade as a guest contributor (lane X).
Read, in this order: CONTRIBUTING.md, START-HERE.md, docs/PRIORITIES.md, docs/QUEUE.md ("Who works where",
"Claiming work", "Heavy lifting", "The road ahead" and "Lane X"), docs/CREATIVE.md and docs/COMMS.md.
Take the first task in QUEUE.md "Heavy lifting" (then "The road ahead", then "Lane X") that no open pull request already names;
if none is free, use "When the road is empty" in QUEUE.md (pre-review a waiting pull request, playtest, fix a bug). Claim it by opening a
draft pull request from a branch named guest/<topic> whose title starts with the task's ID, before building.
Never push to main. Keep to the
files that task names. Run the checks the task names, then mark the pull request ready and explain in plain words
what changed and how you tested it. Never merge your own pull request (the backup merging rule in QUEUE.md is the only exception, for others' pull requests), never bump version numbers, never touch other lanes' files.
Explain everything to me in plain words; I'm not a programmer.
```

## 3. How your work reaches the games

1. Your AI builds the task on a branch named `guest/<topic>`.
2. It opens a **pull request** to `ecbarish/idle-arcade` `main`. The pull request is how Evan's side sees the work.
3. GitHub runs the automatic checks (a green tick means they passed).
4. Evan's review assistant (lane R) reads the change, tests it and merges it when it's good, or leaves a comment
   saying what to change. Ask your AI to answer the comments and push the fixes to the same branch.
   If no Claude reviewer has acted for 6 hours, your AI may merge **someone else's** green pull request under
   "Backup merging" in docs/QUEUE.md; never its own.
5. Once merged, the change is live at https://ecbarish.github.io/idle-arcade/ within a few minutes.

## 4. The few rules that matter

- **One task per pull request**, small and playable. Say which files you changed.
- **Old saves must keep loading.** Players' progress is never lost.
- **Everything happens in the game window** and is written for players (docs/CREATIVE.md "Writing for players").
- **Outside art, sound or music** only with a license that allows it, recorded in CREDITS.md.
- **Your own name and email** on your commits (GitHub's private "noreply" email is fine: GitHub, Settings, Emails).
- **No passwords, keys or personal details** in anything you commit.
- **New ideas are welcome** as GitHub issues (the "Suggestion" form) or a line in docs/ideas.md; Evan decides what
  gets built (docs/PRIORITIES.md).
- **Questions:** open a GitHub issue, or ask Evan.
