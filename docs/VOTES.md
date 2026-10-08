# Player votes

Evan (2026-10-07): when a direction is undecided, build the options and let playtesters vote while they play.
`shared/votes.js` draws a small vote card anywhere (the hub, a game's Journal, a scene). A vote is kept on the
player's device and, once the form below exists, sent anonymously to a Google Form whose sheet Evan reads.

## Open polls

| Poll id | Where | Question | Choices | Opened |
|---|---|---|---|---|
| `launcher-style-1` | Hub, under the launcher | Which homepage do you like better? | The living world (`scene`), the arcade hall (`hall`), keep both (`both`) | 2026-10-07 |

When a poll is decided, write the result and the decision here (and in docs/research/decisions.md), then remove its
card or replace it with the next question. Give a changed question a new id (`-2`) so old answers don't mix in.

## Adding a poll (any assistant)

```js
Votes.card(document.querySelector('#somewhere'), { id: 'wildbond-contests-1', game: 'wildbond', version: VERSION,
  question: 'Which should come first at the ranch?', note: 'Optional one-line context.',
  options: [['contests', 'Contests'], ['races', 'Races']] });
```

Keep questions short and the choices concrete (ideally both built, so players can try them). Add the poll to the
table above. Polls never decide things Evan reserves (CREATIVE.md "Ask Evan first"); they inform him.

## Setting up the form (Evan, once; about 5 minutes)

1. Go to forms.google.com while signed in to your Google account and make a blank form called "Idle Arcade votes".
2. Add five **Short answer** questions, in this order, named exactly: `poll`, `choice`, `game`, `version`, `tester`.
   Leave them all optional. In Settings, turn **off** "Collect email addresses" and any sign-in requirement, so the
   arcade can send votes without an account.
3. Click the three dots (top right) → **Get pre-filled link**, type `p1`, `c1`, `g1`, `v1`, `t1` into the five boxes,
   click **Get link**, then **Copy link**.
4. Paste that link to Claude (or any assistant). It contains the form id and each question's `entry.<number>`; the
   assistant puts them into `shared/votes-config.js` and pushes. From then on votes arrive in the form.
5. Results: the form's **Responses** tab, or **Link to Sheets** for a spreadsheet you can sort by `poll`.

What is sent: the poll id, the choice, the game and its version, and a random tester id made on the player's
device (so one person changing their mind can be spotted). Nothing personal, no names, no email addresses.
