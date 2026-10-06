# Sports careers, wealth and management

Status: owner's direction recorded 2026-10-06; the mechanics below are proposed specifications, not implemented features. This expands Diamond Career into a multi-sport development direction. Evan is comfortable with one game or separate sport games, wants player through team-management play, meaningful contract income and a range from fully manual to fully automated. Desktop and phone are the targets; VR is low priority.

## Recommended structure

Build a shared sports-career framework with separate sport modules, starting with baseball. A single Sports hub can offer careers without requiring one enormous monolithic game. We can keep each sport at its own page or combine navigation later; this does not require deciding the final branding now.

Share athlete identity, career history, contracts, personal assets, sponsorships, presentation conventions, control policies and save tooling where the first two modules actually use them. Each sport owns its rules, positions, stats, match simulation, input, training and calendar. A baseball inning should not be squeezed into football's play model. Diamond Career is the first module, not the boundary of the whole sports ambition.

Start with a wallet per career and portfolio-wide cosmetic/trophy records only. Sharing spendable wealth between athletes or sports needs a separate decision, because an established star could otherwise trivialize another sport's beginner economy. Do not build that transfer before it is requested.

## The progression loop

Play or simulate matches → improve and earn a role → negotiate an offer with real tradeoffs → receive salary/bonuses over the contract → choose how to use the money → gain comfort, identity, access or a long-term asset → face the next sporting/career challenge.

Money is a parallel form of progress, not just the price of another +1 stat. The player's home, garage, belongings and milestones should visibly change as the career develops. This captures the part of the GTA/sports combination Evan described without requiring an open-world city or driving engine in the first version.

## What salary can buy

| Purchase | Why it matters | First implementation | Later growth |
|---|---|---|---|
| Home | A lasting career milestone and customizable place | A home scene/card with rooms, furnishings and a trophy shelf; bounded comfort benefit if approved | Several neighborhoods, visiting characters, walkable home |
| Cars | A collectible reward that makes a better contract tangible | Original car designs displayed in a garage; appearance and collection milestones | Optional travel scenes, driving as its own later feature |
| Personal training/recovery access | Lets the player specialize how they prepare | A few services with explicit benefits, limits and opportunity costs | Own a training facility and mentor younger players |
| Clothing and equipment | Identity and sport-specific preparation | Cosmetic wardrobe plus clearly distinguished performance equipment | Sponsorship collections and deeper equipment choices |
| Experiences and relationships | Uses money to create events and choices | A few optional trips/activities with authored scenes | A larger career-social world |
| Academy or business stake | Connects a playing career to a later role | A long-term goal with a finite acquisition cost | Coaching/ownership income and management decisions |
| Club ownership stake | A major late-career objective | A visible milestone, initially outside the first prototype | A separate team-management mode with its own budget |

For the first slice implement a modest home upgrade, a car and one training/recovery choice. Validate that the player can save for a milestone and feel the difference between two contracts. Luxury items can be worthwhile for identity and collection; they need not all grant combat/sport stats. Keep their purchases permanent through ordinary season changes. Do not dissolve them into recurring repair chores just to drain the wallet.

A bigger house should not make an athlete instantly outperform everybody. Sporting improvement still comes from practice, decisions and role fit. Lifestyle costs should leave discretionary money at intended progression rates. Optional expenses can be controlled by a budget policy. Do not build a complicated household/tax/investment simulator before the core career works.

## Contracts that change decisions

A draft offer has term, salary schedule, signing bonus, performance bonuses, expected role and an explanation of the team's needs. One offer might pay more but provide fewer opportunities; another provides a starting role and better access to development. Exact guaranteed/conditional payment rules and injury consequences belong in the approved game spec, not assumptions about real-world sports law.

Show total stated value, scheduled payments, already-earned money and the next payment date. Compare role opportunity and pay side by side. Pay installments when simulated calendar events happen, not whenever a reward screen is reopened. Store a payment/event identity so reload, replay and time skipping cannot duplicate salary. Test bonuses against the actual recorded achievements.

**Personal money and club money are separate.** Managing a team does not allow buying a personal car from its transfer budget. Buying a club stake is an explicit transaction from personal assets into ownership. An owner salary/dividend, if later included, is a defined transfer, not unrestricted access to both wallets.

## Different roles, different gameplay

| Role | Manual play | Delegated/automated play |
|---|---|---|
| Athlete | Control the sport's actor/actions, train deliberately, negotiate and select purchases | AI plays the athlete, follows a training schedule and selects offers/spending within policies |
| Player-coach, where a sport supports it | Play an athlete while also choosing tactics/lineup responsibilities | Delegate either layer independently |
| Coach/team manager | Select lineups, tactics, substitutions, development and recruitment; watch/direct matches | Assistant handles approved responsibilities, with reports and selectable objectives |
| General manager/owner | Build a roster/club, allocate budgets, improve facilities and set long-term direction | Staff follow contracts, budgets and sporting priorities |

Offer a management start later as well as a career transition; players should not have to finish a twenty-year athlete story just to try management. The first player prototype does not claim to be that complete management mode.

## Sport modules and distinct control

Baseball first proves the framework. Later module order is an owner decision; American football, hockey, basketball and soccer are included in the ambition, with other sports possible.

| Sport | Manual gameplay to investigate | Management decisions |
|---|---|---|
| Baseball | Batting, pitching, fielding and baserunning; first prototype is one at-bat | Lineups, pitching rotations, bullpen use, development and recruitment |
| American football | Role-specific passing/running/receiving or defense; touch controls need their own design | Playbooks, substitutions, depth charts and roster construction |
| Hockey | Skating/positioning, passing, shooting and goalie role | Lines, special teams, stamina and player development |
| Basketball | Movement, passing, shooting and defense | Rotations, matchups, play calls and roster balance |
| Soccer | Movement, passing/shooting and defending | Formation, roles, substitutions, recruitment and academy |

A series of highlights is a valuable early playable slice, but it is **not** proof of fully manual full-match control. Progress toward manual matches is a named milestone. Tactical management is its own form of manual play and should not be falsely presented as direct athlete control.

## Stages and acceptance gates

1. **First payday prototype:** one baseball batter, a short series, one explicit contract, salary ledger, one home upgrade and car, and at-bat/manual versus simulated match moments. Done when salary affects a purchase choice and the first purchase survives save/reload.
2. **Complete baseball career slice:** a season, transparent promotion/roles, several meaningful offers, useful training, homes/garage and configurable career assistance. Done when both an active and an unattended test career can progress and the economy preserves discretionary spending.
3. **Manual match and management proof:** complete baseball controls in bounded stages, plus a small team-manager mode sharing the league model but owning a separate club budget. Done when both roles create distinct decisions and delegation can be chosen independently.
4. **Second sport validates reuse:** choose the next sport with Evan; implement its own manual/sim rules and reuse the proven salary/lifestyle components. Done when differences are substantive and neither sport's schema is distorted to fit the other.
5. **Career world and ownership:** richer home/garage scenes, sponsorship stories, facilities and club ownership; only then optional movement/driving experiments. Done when the new layer gives purpose to career wealth without overshadowing playing/managing sports.

## Comparison lessons

New Star Soccer is the closest researched match to the salary/lifestyle idea: its review describes wages spent on houses and other lifestyle items [R23]. A later review complains that energy costs, expiring staff and degrading purchases consumed the rewards [R24]. Keep the attractive loop and test that net income actually funds lasting milestones.

New Star Manager shows that control of match moments can coexist with team management [R25]. Another reviewer reports a repeatable scoring exploit and lack of defensive control [R26]; manual play should offer counterplay and both attacking/defending agency as the module grows. NBA 2K25's critic describes a compelling career/social world constrained by the paid stat economy [R27]. Our contract money should make life progression tangible while earned skill and gameplay remain meaningful.

## Remaining owner decisions

Which sport follows baseball? How much should homes/cars influence play versus function as collectible personal progress? Should personal wealth eventually cross sports/athletes, or should each career stay financially independent? How much direct on-field control does Evan want first? These decisions refine the next prototype, not permission to build all sports simultaneously. All implementation remains parked under the current roadmap until explicitly authorized.
