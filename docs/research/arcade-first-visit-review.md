# Review: Gemini's walk-in arcade report

Claude, 2026-10-08. The report: [arcade-first-visit-research.md](arcade-first-visit-research.md). Checked against the
launcher (`index.html`, `launcher/launcher.js`), `wildbond-godot/export_presets.cfg` and Evan's clarification of V11.

## The short version

Good, usable report. Its central warning is the right one: **walking must be a pleasure the first time and never a
chore the tenth** (Fable 3's walk-to-the-menu rooms, PlayStation Home's load times), so the hall remembers where you
were, puts you outside the door you last used, and keeps a quick way in. Its "Avatar DNA" idea (a small record of
looks that each game draws in its own style, like Miis, rather than one picture forced everywhere) fits Evan's
clarified version even better than the one it was written for: **each game saves a small look record of its own
character, and the hall draws whichever one belongs to the door you are at.**

## Against what we have and what Evan said

| Gemini says | Our situation | Verdict |
|---|---|---|
| One avatar made in the arcade, each game interprets it | Evan (same evening): the hall shows the character of the game you're entering or leaving | **Adapt:** each game writes `arcade-look:<game>` (name, skin, hair, colours, outfit; race and class for Realmbound) when it saves; the hall reads it. No global creator needed |
| Remember the last position; spawn by the last door; an earned or simple shortcut | The hall exists (walkable cabinets) but forgets where you were | **Take it** |
| Doors that show progress: light, banners, objects (Otherworld's mirror with past lives) | Cards show progress as text | **Take it:** progress shown on and around each door |
| Tap-to-walk plus keys; reduced motion; focusable hidden links over the doors for screen readers | Launcher already has tap and keys, reduced motion via shared settings | **Take it:** add the hidden focusable door links |
| Godot web needs single-threaded export for GitHub Pages | Already set (`variant/thread_support=false`) | Done |
| Godot web builds can be 40 MB; shrink with wasm-opt, compression | Not measured yet (no build until templates are installed) | **Measure first** after tonight's build; wasm-opt needs an install (against the no-installs rule) and is only worth it if the build is too big for phones |
| Wrap the site with Tauri for a desktop version | Godot's own Windows export already makes a desktop game | **Reject:** needs a Rust toolchain; not needed |
| Spend the $200 commissioning one background or music piece | Evan's budget call | Noted for Evan; not assumed |
| A blank tap test on a phone for browser gestures | Cheap and useful | **Take it** when the hall changes |

## Gemini's owner questions, with defaults

1. *How exactly should other games copy a Wildbond look?* No longer needed: each game shows its own character.
2. *Where do destructive actions live (deleting saves) with no menus?* Default: the save tools and the Studio stay
   separate pages; a sensible exception to the in-window rule.
3. *What happens with more games?* Default: the hall is a corridor that can grow a wing; doors are data.

## Plan: V11 in steps

1. **Look records:** each game writes `arcade-look:<game>` beside its save (Wildbond from the register; Realmbound from
   the current hero; Diamond Career from the player; Otherworld from the current life). Small, safe, useful later.
2. **The hall in the browser, improved** (Gemini's version 1-2, `launcher/launcher.js`): you appear by the last door you
   used, as that game's character; walking to another door changes you into that game's character; progress shown on
   the doors; a "last played" door glows for a one-tap return.
3. **Later, in Godot** (decisions.md): the full walk-in hub with doors you walk through, after Wildbond.
4. A free newcomer test with the 20-minute sheet in the report.
