# Starfall: six people finding their place

SF2.4a / T52, Codex, 2026-10-09. Requested in COMMS. Additive writing for Claude, kept outside his Godot project
because Evan's no-Godot-edit instruction remains authoritative. **These stories are not integrated or playable yet.**
The earlier Starfall Guild plan's parked/monolithic-source description is historical; the live village plan,
DEVELOPMENT-PATH and main.gd define the current game.

## The arcs

| Member | New beats after completed jobs | Thread | Choice that can go poorly |
|---|---|---|---|
| Kaito, archer | 2, 5 (Smithy), 9 | A singing bow, asking for help, teaching a newcomer | Encouraging him to hide his practice leaves him less confident |
| Hana, knight | 2, 5 (Training Yard), 9 | Protection becomes listening and finding her place | Telling her simply to lead leaves her concern unheard |
| Sora, monk | 2, 5 (Healer's Hut), 9 | A perfect lesson becomes attention to a real person | Repeating advice rather than listening unsettles him |
| Aki | 10, third beat | Coming home becomes something to teach, not something to prove | Earlier outcomes remain intact; both closing choices welcome growth |
| Ren | 9, third beat | Other people's corrections belong beside his own map marks | Neither closing choice assumes that he bought paper or became a mapper |
| Yuna | 9 (Healer's Hut), third beat | Receiving care is part of caring | Neither closing choice assumes that she accepted Ama's earlier teaching |

The newcomers have three beats each; Aki, Ren and Yuna each get one appended third beat. Town people share small
problems without borrowing Wildbond's fading, inventing a shared-world geography or requiring another game's story.
Kaito's bow follows Garrick's existing remark that he made Kaito a bow that sings. No new faction, death, romance,
plot revelation or automatic departure is introduced. There are twelve invitations with two meaningful replies each.

## Integration contract: append, never replace

`starfall-member-stories.json` is a **patch**, not a replacement for `starfall-godot/data/stories.json`.
Its only root keys are the six exact member names. Arrays for Kaito, Hana and Sora contain their complete new arcs;
arrays for Aki, Ren and Yuna contain only the new closing beat. Preserve `_about` and every existing beat.
Before applying, compare against current main: if Claude has already added a member's beats, reconcile them rather
than appending duplicates. Do not automate this into the game at launch or tie it to a save migration.

Every beat uses existing `after_jobs`, optional `needs`, `lines` and `options` fields. Options use `text`, `lines`,
`morale` and optional `trait`. All speakers are their own member, all characters are plain Latin/ASCII, and choices
are short enough for the existing one-line town overlay. No new effect handler, save key, class or building is needed.
The second newcomer beats require already implemented `smithy`, `yard`, `healer`; the closing Yuna beat requires
`healer` too. Mood and time together retain the existing readiness rules: in town, spirits at least four, enough
completed jobs, and any required building finished. The marker and conversation stay on the person in the street.

There are no coin grants or charges in this patch. A newcomer gains at most one of the existing four traits:
Kaito Steady/Bold, Hana Steady/Bold, Sora Healer/Steady. No second stacking reward or new permanent punishment.
The three poor replies reduce spirits by one and say plainly what the member heard. Meals and successful jobs can
restore spirits through the existing village loop; the next beat is never conditional on a particular trait or
past reply. All later replies are supportive. These are modest consequences supported by today's schema, not a
claim of branch-specific memory, an automatic absence or a recoverable new relationship state.

## Reading and acceptance

Read each conversation beside the actual member, then both replies. Kaito starts embarrassed and ends generous;
Hana moves from orders to questions; Sora loses certainty and gains curiosity. Aki's humor is familial, Ren's
precision leaves space for another witness, and Yuna learns that care includes herself. No scene assumes a
previous option was picked: Ren's sketches work with charcoal or bought paper, and Yuna can visit Ama even if she
declined lessons. Their older choices and traits must remain exactly as chosen.

Claude's acceptance: merge the patch once, compare the original six beats, run Godot's checks, test all 24 replies,
insufficient spirits and unfinished buildings, an old save at each earlier beat, trait duplicate protection and
both first-beat choices followed by each later choice. Look at the speech bubbles and choice overlay at phone,
desktop and ultrawide. Regenerate the web preview only from Claude's project after integration. This handoff does
not alter Godot, the browser game or the playable previews.

## Validation before handoff

640 source/schema/all-choice-path checks pass: twelve added beats, existing members and buildings, strictly
increasing job thresholds, supported traits, no coin effects, bounded spirits, supportive closures and every
binary path through the merged candidate. All six original beats compare exactly. The path check explicitly
models existing care between conversations: a meal or successful job restores the single lost spirit to the
readiness floor. It does not claim that the engine will automatically heal a relationship while you do nothing.
Bold options explicitly ask for harder work, so the player can understand the risk behind that specialization.

A disposable project outside the repo uses installed Godot's real default font and Label wrapping to measure all
48 speech lines and all 24 choices against the current 384x216 surface. Choices fit the 292-pixel inner width
(widest: 133 pixels); speech fits the existing 228-pixel bubble width and leaves room in the world. The actual
main.gd speech and choice code was read, not changed. This is a layout measurement, not an in-engine playthrough
or a claim that these people already speak the new lines. Full scene previews remain Claude's integration check.

All eight browser pages pass on serve.ps1: Realmbound 8,425, Wildbond 2,221, Starfall 48, sound 21, offline 15,
Diamond 122, Otherworld 1,895, runner safety 35. Browser code, saves, Godot files and playable previews are untouched.
