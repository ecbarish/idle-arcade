# Contributing to Idle Arcade (for guests and their AI helpers)

Welcome. Idle Arcade is Evan's set of games, built by Evan with several AI assistants. This page is for anyone outside
that group who wants to help, for example a family member working with their own AI (ChatGPT, Claude, Gemini or
another). You don't need to know how to program: your AI does the work, and this page tells it the rules.

## 1. Get set up (once)

1. Make a free GitHub account at github.com if you don't have one, and tell Evan your GitHub name.
2. Open https://github.com/ecbarish/idle-arcade and press **Fork** (top right). That makes your own copy to work in;
   nothing you do there can break Evan's games.
   (If Evan has added you as a collaborator, you can skip the fork and work on a branch in the main repo instead.)
3. Give your AI access to your fork (or let it read the repo's web pages if it can't connect to GitHub).

## 2. Paste this to your AI to start every session

```
You are helping with github.com/ecbarish/idle-arcade as a guest contributor (lane X).
Read, in this order: CONTRIBUTING.md, START-HERE.md, docs/PRIORITIES.md, docs/QUEUE.md ("Who works where",
"Claiming work" and "Lane X"), docs/CREATIVE.md and docs/COMMS.md.
Take the first open task in QUEUE.md "Lane X" that no open pull request already names. Claim it by opening a
draft pull request (from my fork or branch) whose title starts with the task's ID, before building. Keep to the
files that task names. Run the checks the task names, then mark the pull request ready and explain in plain words
what changed and how you tested it. Never merge, never bump version numbers, never touch other lanes' files.
Explain everything to me in plain words; I'm not a programmer.
```

## 3. How your work reaches the games

1. Your AI builds the task on a branch named `guest/<topic>` in your fork.
2. It opens a **pull request** to `ecbarish/idle-arcade` `main`. The pull request is how Evan's side sees the work.
3. GitHub runs the automatic checks. (On a first pull request from a new person, GitHub asks Evan to approve the
   checks once; that's normal.)
4. Evan's review assistant (lane R) reads the change, tests it and merges it when it's good, or leaves a comment
   saying what to change. Ask your AI to answer the comments and push the fixes to the same branch.
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
