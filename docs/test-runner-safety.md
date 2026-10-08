# Otherworld browser-runner save safety

The old Otherworld runner restored its primary save and hub progress but kept recovery backups made from test lives. It also allowed another click to start a second test frame before the first finished. This could contaminate the player's recovery choices even though the 38 game checks passed.

The runner now snapshots raw storage bytes for **otherworld-save-v1**, **arcade-index-v1** and recovery keys beginning **arcade-backup:otherworld-save-v1:** or **arcade-backup:arcade-index-v1:**. It starts with those keys cleared so tests cannot load a player's recovery save. Its finally block removes the temporary game first, clears only that scope, then restores every original key exactly. Other games' saves and backups remain untouched. Repeated clicks are blocked; game-load errors and a 20-second load timeout reach the same restoration path.

Run [tests/runner-safety.html](../tests/runner-safety.html) on localhost. It exercises the real Otherworld runner with real checks, an explicitly failed check, a scenario exception, a missing debug hook, a frame-load error, a timeout and an initially empty store. These faults occur only in temporary frames. The outer regression page also restores its caller's original storage even if an assertion fails. All 35 checks pass; the original main runner fails the overlap regression. Earlier before/fix verification also observed the original runner's test backups remaining after successful checks.

All eight browser pages pass: run, wildbond, starfall, sound, offline, diamond, otherworld and runner-safety. The isolated browser verification compares the entire storage snapshot after each page, with no special exception for Otherworld. Phone, laptop, desktop and ultrawide checks show no horizontal overflow. Close other Otherworld and hub tabs first: another tab writing these same keys during a test cannot safely be reconciled with a snapshot restoration.

No production game, shared engine or Godot source changes. Pictures under [screenshots/runner-safety](screenshots/runner-safety) show the old runner's failure and the completed phone result.
