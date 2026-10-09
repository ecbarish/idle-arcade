# Games for everyone: a toddler and a 1980s arcade kid (Claude, 2026-10-09)

Evan, 2026-10-09: "I want to have games for kids like my daughter who is almost 3 and maybe some retro games for people
like my dad who grew up with atari and other games like that. He graduated highschool in 1987 I would love to have
something for everyone."

This page pitches games for those two players, judged with the pitch card in
[new-game-ideas.md](new-game-ideas.md). **Nothing here is built.** Starting a game is Evan's call; where a yes lands in
the build order is set in [docs/PRIORITIES.md](../PRIORITIES.md).

## The short version

1. **For his daughter: Little Ranch** (17/18). A tap-and-play toy for ages 2 to 4: baby creatures from Wildbond's
   catalogue to feed, bathe, play peekaboo with and tuck into bed. No words to read, no way to lose, no timers, no
   links or purchases, and a bedtime scene that ends each visit gently. The baby creature drawings it needs are the
   same ones Wildbond's baby forms need (W9/W10), so the work is shared.
2. **For his dad: the Arcade Cabinets** (17/18). A row of small, original single-screen games in the style of 1978 to
   1985: one stick, one button, a high score table with three initials, games that get faster until you lose. Each
   cabinet is one small browser game, and later the same cabinets can stand in the walk-in arcade (V11) and in our
   games' inns.
3. **Wait:** an NES-style side-scrolling adventure (13/18), the game Evan's dad would have moved on to in 1986-87. Much
   bigger than a cabinet; revisit if the cabinets are loved.
4. **Folded in, not separate games:** a colour-and-music toy and a peekaboo game become rooms in Little Ranch; a
   two-player "take turns" mode goes in every cabinet.

## How these were judged

The pitch card's question 2 ("does it fit what Evan wants?") was written for Evan's own deep games. For these two
players it is scored against what he asked for here, a game *that* person would love, while his standing rules still
apply: nothing sold, nothing that plays itself, everything in the game window.

| Idea | Proven | Fits | Two birds | Different | Buildable | Short sessions | Score | Verdict |
|---|---|---|---|---|---|---|---|---|
| Little Ranch (ages 2-4) | 3 | 3 | 3 | 3 | 2 | 3 | **17** | Pitch to Evan |
| The Arcade Cabinets | 3 | 3 | 2 | 3 | 3 | 3 | **17** | Pitch to Evan |
| NES-style side-scroller | 3 | 3 | 1 | 2 | 1 | 3 | **13** | Wait |
| Colour and music toy | 3 | 2 | 2 | 3 | 3 | 3 | 16 | A room in Little Ranch |
| Peekaboo and matching | 3 | 2 | 2 | 2 | 3 | 3 | 15 | A room in Little Ranch |

## Little Ranch (for ages 2 to 4): 17/18

**The pitch.** A sunny corner of the Wildbond ranch, scaled for small hands. A baby Cindercub tumbles out to say hello.
Tap the food bowl and it eats with happy crunching; drag the sponge and it gets bubbly; tap a bush and something
peeks out ("Boo!"); press the big flowers and each one sings a note. When it yawns, the sky turns orange, the baby
curls up, a lullaby plays, and the visit is over: a gentle, built-in ending that helps parents with screen time.
Other babies (a Pebblit, a Glowmote) arrive over many visits, so there is always a new friend.

**What a toddler needs (and what the design does about it).**
- **No reading:** every choice is a picture, every action has a sound and an animation. Creatures' names are spoken
  (the browser's built-in voice to start, recorded voices later).
- **Taps and simple drags only:** children this age manage taps and short drags well; pinches and precise gestures
  frustrate them. Huge targets, nothing near the screen edge, and stray taps never do anything bad.
- **Cause and effect, no failing:** every touch makes something happen; there are no scores, timers, lives or wrong
  answers. Open-ended "toy" play, the approach behind Sago Mini and Toca Boca, is the most trusted style for this age.
- **Safe by design:** no links out, no purchases, no ads, no feedback button, no data collected. The way out (and
  any settings) sits behind a grown-up lock (hold a corner for three seconds), so a toddler can't wander into other
  games.
- **Made to share:** the American Academy of Pediatrics advises a limited amount of high-quality media for ages 2 to 5,
  ideally used *with* a parent. Little Ranch suits sitting together: a parent can name colours and count bubbles,
  and the bedtime ending keeps visits short (about 5 to 10 minutes).
- **Tablet and phone first,** in the browser so it opens anywhere, and it works offline once loaded (the arcade
  already installs as an app).

**Two birds.** The baby drawings (big heads, short legs, made from each species' normal art with different
proportions, as docs/proposals/creature-growth.md plans) are exactly what Wildbond's baby forms need. Its sounds and
lullaby extend shared/sound.js. And it gives Evan's daughter her own door into the same world he is building, which
she can grow into.

**Cost and risk.** Small in code but demanding in feel: animations, sounds and timing are the whole game, and the only
real test is a toddler. The plan relies on Evan trying each step with his daughter.

**Smallest test (one PR).** One baby creature, three things to do (feed, bubbles, peekaboo), and the bedtime ending,
in the browser. If his daughter asks for it again, write the full plan.

**Later, as she grows:** a 4-to-6 mode with counting, colours and shapes woven into the same ranch.

## The Arcade Cabinets (for the 1980s arcade kid): 17/18

**The pitch.** A short row of original arcade games, each on one screen, each learned in 30 seconds and played for
years. They feel like 1981: one stick and one button, a demo that plays until you press start, a score that only goes
up, three initials on the high score table, the game speeding up until it beats you, and "player 2, get ready" for
taking turns on the couch. A "Modern" switch per cabinet adds today's touches (smoother speed-ups, combo bonuses,
a short timed mode), the trick that made *Pac-Man Championship Edition* a hit, while "Classic" stays pure.

**First three cabinets** (original games in loved shapes, set in our world):
- **Lighthouse Watch** (the *Missile Command* shape): storm sparks fall on the Saltmarsh harbour; aim the
  lighthouse beam to burst them before they hit the boats.
- **Brisket's Crossing** (the *Frogger* shape): help Pell's mule Brisket cross busy roads and a log-jammed river to
  deliver the lanterns.
- **Ember Bricks** (the *Breakout* shape): knock sparks into a forge wall, brick by brick, at Garrick's smithy.

**Why it is right for Evan's dad.** Born around 1969, he was the right age for the Atari 2600 (1977), the arcade
golden age (*Pac-Man* 1980, *Donkey Kong* 1981) and the NES arriving in 1985-86. These games ask nothing new of him:
no tutorials, no menus, no inventory. *Atari 50: The Anniversary Celebration* was widely praised in 2022, showing
there is a real, happy audience for these games played the old way.

**Rules that keep it ours and legal.** Game *ideas and rules* can't be owned, but a game's look and feel can: a US
court found *Mino* infringed *Tetris* by copying its look closely (Tetris Holding v. Xio, 2012). So every cabinet is
original in its names, art, sounds and layout; the shape of the game is the only thing borrowed. No real company or
game names on screen.

**Comfort for older eyes and hands.** Big, sharp numbers; a text-size setting that really enlarges the score; arrow
keys plus space, or a USB gamepad (the browser reads most of them); an optional, mild screen-curve and scanline look
that can be turned off.

**Two birds.** Each cabinet is one small browser page using the shared sound and settings; the same cabinets become
playable machines in the walk-in arcade (V11) and in our games' inns and taverns (a cabinet in Larkhaven's inn, a
cameo for Pell and Brisket), which makes those places feel lived in.

**Smallest test (one PR).** Lighthouse Watch with its demo, high score table and two-player turns. If his dad plays
it twice, build the next cabinet.

## Waits: an NES-style side-scroller (13/18)

Running, jumping and secrets, the way *Super Mario Bros.* (1985) changed everything for kids his age. A strong idea,
but it is a full game, not a cabinet, and it needs level design and tuning on a much bigger scale. Revisit if the
cabinets win him over.

## Sources

- American Academy of Pediatrics guidance for ages 2 to 5:
  [Michigan Medicine summary](https://www.michiganmedicine.org/health-lab/aap-when-your-kids-should-and-shouldnt-use-digital-media),
  [Children's Hospital Los Angeles](https://www.chla.org/blog/rn-remedies/new-guidelines-screen-time-kids)
- Touch design for young children: [Design considerations for little fingers](https://uxdesign.cc/design-considerations-for-little-fingers-ad2a19ed3816),
  [Frontiers in Psychology on how toddlers learn from touchscreens](https://www.frontiersin.org/news/2017/05/09/touchscreens-frontiers-psychology-how-do-toddlers-learn-best-from-touchscreens)
- Toy-style apps for young children: [Sago Sago on developing for preschoolers (Kidscreen)](https://kidscreen.com/2015/04/09/sago-sago-dishes-on-developing-for-the-preschool-market),
  [Sago Mini's letter to parents](https://sagomini.com/article/sago-mini-letter-to-parents/)
- Atari 50: [OpenCritic](https://opencritic.com/game/13967/-/reviews),
  [Time Extension's review round-up](https://www.timeextension.com/news/2022/11/round-up-heres-what-reviewers-are-making-of-atari-50-the-anniversary-celebration)
- Pac-Man Championship Edition: [Wikipedia](https://en.wikipedia.org/wiki/Pac-Man_Championship_Edition)
- Tetris Holding v. Xio: [Loeb & Loeb summary](https://www.loeb.com/en/insights/publications/2012/06/tetris-holding-llc-v-xio-interactive-inc)

Evidence is from published guidance, reports and reviews, not hands-on testing; the real test of both games is the
two people they are for.
