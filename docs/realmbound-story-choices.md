# Guild choices that matter: R4 follow-up

## Design

Ten of 32 adventurers, five per faction, now have personal decisions that can hurt trust. Their own words state the boundary before choosing. Story scenes use only the world’s language; the Hearth Book’s rule summary shows the eight-mood cost and immediate repair route. There is no hidden die roll or moral alignment label. The other branch preserves trust and the ordinary +2 friendship/+2 mood reward.

The immediate aftermath is a portrait conversation in the guild hall, with the member's generated appearance and a sad or happy expression. Hurt members speak differently when approached. An optional fourth conversation offers a concrete apology/correction, restores eight mood once, and leaves the original choice remembered. No member is forcibly dismissed, loses equipment, blocks a quest or becomes permanently unavailable. Existing mood affects guild work rates as before. Ordinary guild mood drift/departures remain the old rules, not a new consequence.

Repair has no friendship, mood or shared-time gate, costs no money/supplies, and can be deferred. It still requires Focus, the physical hall, and returning the member from a job/raid. The hearth book offers Make amends over the world; the Guild tab remains a read-only record. All story, reaction and repair scenes pause simulation and cannot be picked by Auto. Replay never earns a reward; repeat/stale responses cannot farm mood.

## The ten decisions

| Member | A decision | Other decision | What repair means |
|---|---|---|---|
| Brienne | Lead with our own names | Give the roadkeepers equal credit | We will correct the account together and give the roadkeepers equal space. |
| Aldous | Read the named account at supper | Return it to them privately | We will take the named copy down and ask permission before sharing any account again. |
| Elowen | Hear the return route before leaving | Leave the briefing for later | We will gather the group before departing and let you finish the return briefing. |
| Garrett | Keep the repaired tool on the bench | Clear it onto the scrap pile | We will retrieve the handle and give you the choice of where it belongs. |
| Maeve | Book the reading at the main feast | Arrange the quiet audience they asked for | We will apologize to the teller and arrange a smaller reading only if they want it. |
| Kesh | Tell the escape with its mistakes | Keep only the bold parts | We will tell the missing part together and practice the safer approach. |
| Zula | Replace the camp verses with our refrain | Learn the different verses together | We will restore the camp verses and ask their singers to teach us. |
| Nokka | Return the tool with its account | Keep the loan on our lending bench | We will return the loan, explain the delay and ask before borrowing it again. |
| Tusk | Display the trophy on its own | Display the recovery notes beside it | We will put the recovery account beside the trophy and let you tell its full cost. |
| Morg | Record the repair without a verdict | Name a winner in the hall account | We will remove the verdict and invite both people to approve the repair account. |

## Compatibility and scope

New reaction/repaired fields exist only for a newly chosen consequential branch. A save whose decision was already made, including one awaiting its third beat, keeps its old text, branch and mood. Forgiveness does not clear reaction or choice. Data remains account/member-keyed and survives dismissal, rejoining and reload; malformed optional reaction fields do not invent a repair.

Runtime changes are limited to js/27-member-stories.js, the memberTalk hook in js/22-town.js, and the existing phone story-scene height in style.css. Shared dialogue, battle balance, economy, versions, service worker and other games are unchanged. This PR stacks on guide PR #52 for overlapping task/session metadata; retarget to main after that PR merges.

## Validation

All seven browser pages pass: Realmbound 6935, Wildbond 1354, Diamond 102, Starfall 48, sound 21, offline 15, Otherworld 38; zero page errors. Existing Otherworld automatic test backups are still retained by its runner; primary save and hub are restored.

The Realmbound suite checks all 32 original arcs and both branches, plus all ten new harms, trustworthy alternatives, immediate portrait consequences, legacy decisions, deferred/repeated repairs, low mood/affinity recovery, save normalization, dismissal/rejoin, stale listener/account callbacks and world-only records. Real UI checks use Registrar Mott, the hearth book, choice buttons and Make amends at 375×812, 1366×768, 1920×1080 and 3440×1440, including a real reload and Auto waiting. Screens are in docs/screenshots/realmbound-story-choices/; fixtures are prepared demonstration saves, not an unassisted human playthrough.

## An idea

A later engine version could keep a corrected account or returned tool physically visible by the hearth. This implementation remembers the event in conversations and records; it does not pretend those hall props already exist.

Review polish (2026-10-08): rebased onto main 24f346b, preserving Claude’s Guild Hall title fixes. Removed numerical rules narration from decision, reaction and apology scenes; mechanics remain in the Hearth Book summary. The speaker and personal response remain visible on phone and desktop.
