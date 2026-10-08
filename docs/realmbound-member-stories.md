# Guild members' personal stories (R4)

Codex, 2026-10-08. Built on the guild, companions, the existing portrait scenes and hall. No release version bump.

Each of the 32 faction adventurers has three short moments: a confidence, a decision, and its aftermath. Both decisions are kind, valid ways forward; the chosen ending is remembered and visible in the hearth book. These are personal accounts and hall customs, not new combat quests, physical hall props, factions or regions. No story removes a companion. Existing low-mood departures remain the guild's original rule.

## Unlocks and play route

- Become Friends with an adventurer and invite them to a founded guild. Their generated race, class, hair and personality remain unchanged. Portraits use that member's own faction/race, class colour and hair, even when another hero listens.
- First confidence: 5 cumulative minutes together and mood 40. Decision: 15 minutes and mood 55. Aftermath: 30 minutes and mood 70. The hearth book explains missing conditions, current minutes, mood and completed moments.
- Only visible, simulated party time on the road (seeking, fighting, resting or collecting loot) counts. A fallen companion, an absent member, alternate player characters, town time, conversations, jobs and offline gains do not. Guild companions visiting another hero's raid count under their owner-qualified key. Time caps at 30 minutes; reloads preserve it.
- Meet in any town or the walkable guild hall, returning them from a job or saved raid first. The story index is a hearth book opened over the world, not another information panel: ask Registrar Mott for it in the hall, or use the legacy Guild tab shortcut while Claude rebuilds that screen. Use Focus to listen. A ready hall member speaks their personal story before their favor; the Guild tab keeps the supply favor independently available.
- Skip reveals the choices; Another time grants nothing. Stories pause game time, and the shared dialogue adapter prevents Auto from choosing even if Auto is toggled after opening the scene.
- Each remembered moment gives +2 affinity and +2 mood once. No bank supplies, money, gear, quest XP or guild XP are granted. There is no deadline, random failure, repeat reward or compulsory chore.
- Remember replays completed lines and the chosen path without changing progress. Unavailable replay buttons explain where to meet. Hero switching, booting and dismissal clear a pending scene without choosing.

## Saves and integration

Optional account ledger: S.guild.stories[memberKey] = {seconds, done, choice}. The member key is the existing adv:<heroId>:<npcId>; identically named companions on different heroes never share progress. It stays when a member leaves and rejoins. Existing founded-guild saves receive an empty ledger; malformed optional fields are clamped, and a missing decision returns to the choice instead of inventing an ending. New guilds start empty. Existing favors, jobs, characters, dungeon records and rewards keep their state.

Reading the book pauses game time; choosing Listen closes it to reveal the world portrait. Deferring, finishing and replaying return to the book when that is where you started.

Story data and helpers live in js/27-member-stories.js. Small hooks load it, migrate the optional ledger, tick present party time, invalidate the Guild shortcut cache, open hall conversations, pause/clear scenes, and protect choices from Auto. Phone-only story-row styling leaves full width for text and puts buttons beneath it. Opening scrolls the portrait into view without animation; while a story is open, the phone scene grows to fit the full portrait and choices.

## Canon arcs

The existing lore hooks now have playable personal accounts, still independent of generated class/race/personality. Exact dialogue and both aftermaths are in the data file.

| Adventurer | Story | Decision paths |
|---|---|---|
| Brienne | The road worth telling | Sign it together / Leave room for the roadkeepers |
| Aldous | Behind the request | Read their story here / Return it in private |
| Merrin | The second crossing | Share the uncertain details / Make a short, cautious guide |
| Tobias | One more bowl | Keep a place for their name / Welcome someone else |
| Elowen | The way back | Walk everyone through it / Let each person trace a route |
| Garrett | The bent handle | Keep the old tool working / Retire it with its story |
| Isla | Room to disagree | Make a listening circle / Make room for a pause |
| Corwin | The maker behind the mark | Put the maker first / Show the chain of learning |
| Hazel | A road in another season | Make a seasonal calendar / Keep a page for surprises |
| Rhys | What stayed kept | Celebrate promises kept / Record repairs as well |
| Maeve | The quieter account | Read with their permission / Make a quiet audience |
| Dorian | The name beneath the damage | Show all three names / Lead with the local name |
| Wynn | The next warm door | Mark doors that consent / Mark people who can help |
| Celeste | When the watch rests | Give a spoken welcome / Leave a quiet place |
| Bram | The last arrival | Ask at each rest / Agree on a private signal |
| Odette | The letter and its silence | Read the chosen lines / Tell the journey around it |
| Kesh | A useful escape | Practice the safer approach / Tell the honest account |
| Ruk | Ground worth holding | Put the question over the door / Carry it in our road notes |
| Ugra | A welcome with water | Name a willing host / Keep a shared welcome table |
| Thrak | Who is not here yet | Keep the missing names visible / Name the news carriers |
| Zula | A verse that leaves room | Keep each camp verse / Invite new verses |
| Vash | When the old path fails | Keep the correction visible / Make a dated survey |
| Nokka | Returned with thanks | Send the account to its owner / Start a lending book |
| Grom | The person behind the rescue | Tell their side of the rescue / Practice asking first |
| Sira | Care on the quiet days | Make a care journal / Invite the keepers to supper |
| Drogo | A promise far from home | Keep a witness in the hall / Send the account onward |
| Kaja | Before the good food spoils | Cook together at the hearth / Copy it for the road |
| Tusk | What the trophy leaves out | Display it with the recovery notes / Keep the lesson, put it away |
| Vela | A landmark after dusk | Draw the dusk silhouettes / Add measured distances |
| Morg | The argument that ended | Let both accounts be heard / Record the agreed repair |
| Ishara | More than the word welcome | Ask what would help / Offer an evening companion |
| Brakka | Before the warning grows | Mark what was actually seen / Teach a clear call and reply |

## Validation

Browser scenario coverage exercises all 32 arcs, both outcomes, every gate, defer/Skip/replay, duplicate and stale responses, actual combat-step time, hidden tabs, remote guild raiders, job/raid reservations, dismissal/rejoin, legacy/malformed saves and real save/load. Isolated Chrome UI checks at 375×812, 1366×768, 1920×1080 and 3440×1440 click the actual story buttons, toggle Auto while choices wait, finish an arc, reload it and replay it. Prepared level-45 guild fixtures accelerate these checks; this is not a human pacing playtest.

All seven pages pass: Realmbound 6,681, Wildbond 1,254, Starfall 48, shared sound 21, offline 15, Diamond 83 and Otherworld 38. No uncaught page errors.

Run the repository's serve.ps1 and all seven pages. Codex used an in-memory port 8766 copy of that same script so Claude's 8765 server and saves stayed untouched; isolated browser requests for localhost:8765 were routed to this checkout. Phone/ultrawide before-and-after images are in docs/screenshots/realmbound-member-stories/.

## An idea

Later, let completed accounts appear as small selectable keepsakes near the actual hearth. The narrative text is ready; physical props would be a separate art task, not a hidden dependency of these stories.
