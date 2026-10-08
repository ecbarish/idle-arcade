# Guild members' personal stories (R4)

Codex, 2026-10-08. Built on the guild, companions, the existing portrait scenes and hall. No release version bump.

Each of the 32 faction adventurers has three short moments: a confidence, a decision, and its aftermath. Ten arcs now have choices that can hurt trust, with an immediate portrait response and an optional fourth, make-amends conversation. The other 22 keep two gentle alternatives. Choices and repairs remain remembered in the hearth book. These are personal accounts and hall customs, not new combat quests, physical hall props, factions or regions. No story removes a companion. Existing low-mood departures remain the guild's original rule.

## Unlocks and play route

- Become Friends with an adventurer and invite them to a founded guild. Their generated race, class, hair and personality remain unchanged. Portraits use that member's own faction/race, class colour and hair, even when another hero listens.
- First confidence: 5 cumulative minutes together and mood 40. Decision: 15 minutes and mood 55. Aftermath: 30 minutes and mood 70. The hearth book explains missing conditions, current minutes, mood and completed moments.
- Only visible, simulated party time on the road (seeking, fighting, resting or collecting loot) counts. A fallen companion, an absent member, alternate player characters, town time, conversations, jobs and offline gains do not. Guild companions visiting another hero's raid count under their owner-qualified key. Time caps at 30 minutes; reloads preserve it.
- Meet in the physical guild hall, returning them from a job or saved raid first. Members speak in the world through shared portrait scenes. Ask Registrar Mott for the hearth book there; it is opened over the hall and cannot be opened from an outside-town menu. The Guild tab contains only records of already-heard moments, never future story text or conversation buttons. Use Focus to listen. A ready hall member speaks their personal story before their favor; the Guild tab keeps the supply favor independently available.
- Skip reveals the choices; Another time grants nothing. Stories pause game time, and the shared dialogue adapter prevents Auto from choosing even if Auto is toggled after opening the scene.
- Ordinary remembered moments give +2 affinity and +2 mood once. A new hurt decision gives no affinity and costs 8 mood instead; making amends restores 8 mood once without a reward or extra story gate. No bank supplies, money, gear, quest XP or guild XP are granted. There is no deadline, random failure or repeat reward. An apology is always available at the hearth after a hurt decision, regardless of mood, friendship or time, so recovery is not a compulsory grind.
- Remember replays completed lines and the chosen path without changing progress. Unavailable replay buttons explain where to meet. Hero switching, booting and dismissal clear a pending scene without choosing.

## Saves and integration

Optional account ledger: S.guild.stories[memberKey] = {seconds, done, choice}, with reaction (hurt/trusted) and repaired added only when a new consequential decision is made. Existing decisions without reaction keep their original scripts and never receive a retroactive penalty. The member key is the existing adv:<heroId>:<npcId>; identically named companions on different heroes never share progress. It stays when a member leaves and rejoins. Existing founded-guild saves receive an empty ledger; malformed optional fields are clamped, and a missing decision returns to the choice instead of inventing an ending. New guilds start empty. Existing favors, jobs, characters, dungeon records and rewards keep their state.

The hall has eight seats; when the book calls a member from the larger roster, they take an existing seat beside the hearth. This is a runtime guest, not a new save field. Their portrait and in-world person use the same generated identity. Guild records survive that member leaving, but replay and new conversations still require meeting in the hall.

Reading the book pauses game time; choosing Listen closes it to reveal the world portrait. Deferring, finishing and replaying return to the book when that is where you started.

Story data and helpers live in js/27-member-stories.js. Small hooks load it, migrate the optional ledger, tick present party time, invalidate the memory-record cache, open hall conversations, pause/clear scenes, and protect choices from Auto. Phone-only story-row styling leaves full width for text and puts buttons beneath it. Opening scrolls the portrait into view without animation; while a story is open, the phone scene grows to fit the full portrait and choices.

## Canon arcs

The existing lore hooks now have playable personal accounts, still independent of generated class/race/personality. Exact dialogue and both aftermaths are in the data file.

| Adventurer | Story | Decision paths |
|---|---|---|
| Brienne | The road worth telling | Lead with our own names / Give the roadkeepers equal credit |
| Aldous | Behind the request | Read the named account at supper / Return it to them privately |
| Merrin | The second crossing | Share the uncertain details / Make a short, cautious guide |
| Tobias | One more bowl | Keep a place for their name / Welcome someone else |
| Elowen | The way back | Hear the return route before leaving / Leave the briefing for later |
| Garrett | The bent handle | Keep the repaired tool on the bench / Clear it onto the scrap pile |
| Isla | Room to disagree | Make a listening circle / Make room for a pause |
| Corwin | The maker behind the mark | Put the maker first / Show the chain of learning |
| Hazel | A road in another season | Make a seasonal calendar / Keep a page for surprises |
| Rhys | What stayed kept | Celebrate promises kept / Record repairs as well |
| Maeve | The quieter account | Book the reading at the main feast / Arrange the quiet audience they asked for |
| Dorian | The name beneath the damage | Show all three names / Lead with the local name |
| Wynn | The next warm door | Mark doors that consent / Mark people who can help |
| Celeste | When the watch rests | Give a spoken welcome / Leave a quiet place |
| Bram | The last arrival | Ask at each rest / Agree on a private signal |
| Odette | The letter and its silence | Read the chosen lines / Tell the journey around it |
| Kesh | A useful escape | Tell the escape with its mistakes / Keep only the bold parts |
| Ruk | Ground worth holding | Put the question over the door / Carry it in our road notes |
| Ugra | A welcome with water | Name a willing host / Keep a shared welcome table |
| Thrak | Who is not here yet | Keep the missing names visible / Name the news carriers |
| Zula | A verse that leaves room | Replace the camp verses with our refrain / Learn the different verses together |
| Vash | When the old path fails | Keep the correction visible / Make a dated survey |
| Nokka | Returned with thanks | Return the tool with its account / Keep the loan on our lending bench |
| Grom | The person behind the rescue | Tell their side of the rescue / Practice asking first |
| Sira | Care on the quiet days | Make a care journal / Invite the keepers to supper |
| Drogo | A promise far from home | Keep a witness in the hall / Send the account onward |
| Kaja | Before the good food spoils | Cook together at the hearth / Copy it for the road |
| Tusk | What the trophy leaves out | Display the trophy on its own / Display the recovery notes beside it |
| Vela | A landmark after dusk | Draw the dusk silhouettes / Add measured distances |
| Morg | The argument that ended | Record the repair without a verdict / Name a winner in the hall account |
| Ishara | More than the word welcome | Ask what would help / Offer an evening companion |
| Brakka | Before the warning grows | Mark what was actually seen / Teach a clear call and reply |

## Validation

Browser scenario coverage exercises all 32 arcs, both outcomes, every gate, defer/Skip/replay, duplicate and stale responses, actual combat-step time, hidden tabs, remote guild raiders, job/raid reservations, dismissal/rejoin, legacy/malformed saves and real save/load. Isolated Chrome UI checks at 375×812, 1366×768, 1920×1080 and 3440×1440 click the actual story buttons, toggle Auto while choices wait, finish an arc, reload it and replay it. Prepared level-45 guild fixtures accelerate these checks; this is not a human pacing playtest.

All seven pages pass: Realmbound 6,683, Wildbond 1,254, Starfall 48, shared sound 21, offline 15, Diamond 83 and Otherworld 38. No uncaught page errors.

Run the repository's serve.ps1 and all seven pages. Codex used an in-memory port 8766 copy of that same script so Claude's 8765 server and saves stayed untouched; isolated browser requests for localhost:8765 were routed to this checkout. Phone/ultrawide before-and-after images are in docs/screenshots/realmbound-member-stories/.

## An idea

Later, let completed accounts appear as small selectable keepsakes near the actual hearth. The narrative text is ready; physical props would be a separate art task, not a hidden dependency of these stories.
