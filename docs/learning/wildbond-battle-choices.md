# Wildbond battle choices (WD3)

The shared catalogue has sixty moves. Each creature remembers six to eight, with one signature for its family. Maren's workbench chooses up to four to bring; resting a move does not erase it. Godot's Practice button is beside equipment, with arrows or partner buttons to change creatures. Classic has four selectors per partner in the ranch. A valid loadout includes an attack, including poison. New creatures and evolution cannot leave a partner with only support moves.

Older saves without a move selection keep their original four. Chosen moves survive the existing JSON save. A new lesson fills an empty place but never replaces one of four chosen moves. Earned badges supply the new Warden orders when an old save loads. There is no save-version change.

Battle units hold soaked, scorched, rooted, asleep and exposed timers. Creatures and saves never hold those effects. Scorch burns for two percent of maximum health per running battle second and weakens physical hits by a quarter. Roots slow turn meters by 35 percent. Sleep stops turns, ends on a hit or expiry, and grants five seconds of protection against another sleep. An exposed foe takes a quarter more damage on its next hit. Steam Burst consumes soaked; rooted and sleep follow-ups consume their setup. Cleansing removes these effects, poison and slowness. All timers wait while the player chooses, like existing cooldowns.

Boar charges break guard; bird dives bypass it without removing it. Godot Wardens score readiness, healing, cleansing, elemental matchups, guard and partner setups. They favor shelter, setup, patient play, rush or an adaptive plan. Every Warden teaches an order; the order list has pages reachable by arrows or Previous/Next buttons. Existing heritage orders remain available. The party still fights together in the existing ATB system.

The level formula remains twelve even-level single-foe wild wins per level on Classic pace; trainer and journey multipliers remain unchanged. The Godot checks exercise each status, every creature's move count and old-save choice, JSON round trips, attack defaults, family guard effects, the complete level curve and thirty-two actual Warden-controller runs. Pacing runs use mirrored teams, four deterministic seeds per Warden and automatic tactical choices; they check completion and at least three different useful moves, not that every player team must win.

Screen review runs Godot under a virtual display and captures the whole window at 375×812, 667×375, 1366×768, 1920×1080 and 3440×1440. The capture fixture disables the opening fade and never reads a player's save. Main's normal Checks workflow imports both Godot projects with an explicit editor exit before the existing thirteen suites, avoiding a ten-minute import timeout for each project.

## Review evidence

The first complete build passed all thirteen suites: 3,254 Classic Wildbond checks, 1,202 Godot Wildbond checks and 130 Godot Starfall checks, plus the other ten suites. The thirty-two mirrored Warden runs completed in 17.8–70.2 simulated seconds and selected five to eleven different moves per run. These are controller checks; time spent choosing is deliberately excluded. Checks include direct practice-key input and every new order.

Classic's practice selectors were operated at all five review sizes: choosing a different move changed the team, a duplicate selection was rejected, and no horizontal overflow appeared. Fifteen Godot captures cover practice, a soaked foe and Steam Burst, and the last order page. Four additional before pictures come from a separate checkout of the PR base, not recreated old behavior. The existing integer scaling and phone letterboxing remain; responsive battle layouts belong to their separate task.
