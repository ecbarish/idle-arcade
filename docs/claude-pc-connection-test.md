# Phone-to-PC Claude connection test

Paste this into a fresh Claude session you can launch from your phone. A prompt verifies access; it cannot establish a remote connection by itself. This test stays read-only so it cannot duplicate an existing Claude session's work.

```text
This is a connection test for Evan's idle-arcade project.

Can you execute commands on my Windows PC, rather than only in a cloud environment?

If yes, report the computer name and inspect this repository:
C:\Users\evanb\OneDrive\Desktop\idle-arcade

Report its current branch, Git status and latest commit. Read START-HERE.md, AGENTS.md, HANDOFF.md and docs/QUEUE.md.

Do not edit files, switch branches, pull, merge, start servers, install anything or interrupt another Claude session. Preserve all existing work. If possible, check whether another Claude session is active without interrupting it; say clearly if you cannot determine that.

Finish with PC CONNECTED or NO PC ACCESS, and explain the safest next step for continuing Claude's Lane B without duplicating work. If this session is cloud-only or cannot reach that folder, do not imply it is connected to the PC.
```

After a successful test, Evan can explicitly ask that session to continue Lane B. Read the latest queue first: Codex's Lane A PRs are separate work, and neither assistant should duplicate the other's claim.
