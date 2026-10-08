# Wildbond: the opening, the premise and the goal

Evan's first-play notes (2026-10-07), the answers, and the plan. Read with docs/lore/wildbond.md and docs/VISION.md.

## What Evan found in the first minute

1. Clicking a starter started the journey at once: no highlight, no details, no confirm, and the name was skipped.
2. The default name was "Tamer"; he wants story names (like the classics), a custom name and a random button.
3. Challenge modes (Nuzlocke and the rest) on the very first screen: they work in Pokémon because players already
   know the game. For a newcomer they're noise; make them unlockable.
4. There's no clear goal: Pokémon says "there are 150 out there, go see them and fill the book". Wildbond needs its
   own version: a reason to explore, catch and evolve.
5. Pick the starter in the world: walk up to them, like the Poké Balls on the professor's table.
6. How do we keep creatures with us, and how do we catch them? Magic? Technology? It must be laid out clearly.

## Fixed now (Wildbond v1.4.0)

- **Choose, then confirm.** Tapping a partner selects it and shows its Wilddex page (stat bars, first moves, what
  it's strong and weak against). Nothing starts until **Begin with ___**.
- **Names.** Four story names (Rowan, Juniper, Briar, Sorrel: plants, like the region's people), a 🎲 random
  button with more, or type your own. Leaving it empty uses Rowan.
- **Challenge modes unlock when you become Champion** (and right away for anyone who already is). The first screen
  shows a locked line instead, so new players aren't asked about rules they don't know yet.
- **The goal, in Maren's words** after the first battle: three partners travel with you, the rest live at her
  ranch; she gives you her old **Wilddex**: "every creature you meet gets a sketch, every one that bonds with you gets
  its whole page. Nobody has ever filled one. Over a hundred kinds live between here and the far coast."
- Bug fixed: a missing comma had swallowed two of Maren's opening lines (including the one about the faded colour).

## The premise, plainly (canon in docs/lore/wildbond.md; to be shown in the game, not just written here)

- **The world is faded.** Long ago the region lost its colour. The guardians remember it; **every bond a tamer earns
  helps the land remember**, which is why colour returns badge by badge (Pocket greens → colour → depth → 3D). The
  art eras *are* the story.
- **Nobody owns a creature.** No balls, no cages, no machines. You **earn a bond**: watch a wild creature, tire it in
  a friendly battle, offer a **lure** (a scented treat), and keep it calm. If it trusts you, it chooses to come home.
- **Where they live.** Three walk with you; the rest live at **Maren's ranch**, where you feed, train and breed them.
  A bonded creature always finds its way back to its tamer (the bond itself, not a device: that's the magic).
- **The goal.** Earn the eight Wardens' badges and stand before the league's Champion; fill the **Wilddex**; and,
  through it all, bring the colour back.

## Part 2 (next, Claude): the opening as a place

- **A short prologue** (V1): a narrator over the faded region, a guardian's silhouette, the colour flickering back
  for a heartbeat; then the supply cart arriving in Larkhaven. Skippable.
- **Pick your partner in the world.** Maren's barn has three pens; walk up to each creature to see its page; choose
  in a dialogue ("Choose Ripplet?" Yes / Keep looking). The menu stays as a fallback for accessibility.
- **The Wilddex as a goal you can see:** a counter on the Wilddex tab ("27 of 106 recorded"), Maren's research
  rewards at milestones (10, 25, 50, 75 seen and bonded: lures, rare foods, a ranch upgrade, a title, a hat), hints
  for rare ones ("only in rain", "at night"), and the regional total revealed as you travel.
- **Teach by doing:** the first wild creature is a scripted bond with Maren talking you through lure and calm.
- A tester poll on the starting look (faded Pocket start vs. starting in colour), per docs/VISION.md §2.
