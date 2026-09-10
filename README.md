# DARYL: THE VIDEO GAME

A browser game about trying to close one deal while a house closing, a wedding,
and two dogs happen at you simultaneously. Daryl works from a spare bedroom at
his mother-in-law's, on a folding table, next to four weeks of boxes.

**Play it:** https://mrolfes7861.github.io/Daryl-The-Video-Game/

## The day

Nine in the morning to five in the afternoon, compressed into about four minutes.
Four things can end it early:

| Meter | You lose when |
|---|---|
| Deal progress | it is not at 100% when the day ends |
| House closing anxiety | it reaches 100% |
| Wedding harmony | it reaches zero |
| Composure | it reaches zero |

Work cards arrive on the right and expire on a timer. The personal phone rings
with the realtor, the lender, the inspector, and the realtor again. Ignoring it
is allowed and it costs you. The fiancée appears in the doorway with a question
that has one good answer and one catastrophic one. The dogs bark, and a barking
dog drains composure until you click it three times. Occasionally one walks
across the keyboard.

Michael turns up on Teams to take things off your plate. Those cards are free
points. The correct answer to any technical question is to loop him in.

## Changing the names

Everything personal lives in one block at the top of `game.js`:

```js
const CONFIG = {
  hero:    'DARYL',
  fiancee: 'THE FIANCEE',
  dogs:    ['BARLEY', 'MOOSE'],
  helper:  'MICHAEL',
  arr:     '$47,000',
};
```

Edit, commit, push. GitHub Pages redeploys on its own in a minute or so.

## Running it locally

There is no build step. It is one HTML file and one JS file. Open `index.html`
in a browser and it works, including from `file://`.

## Poking at it

The console exposes a debug harness:

```js
daryl.state              // live game state
daryl.skipTo(0.9)        // jump to late afternoon
daryl.win()              // go straight to the ending
daryl.sim(0.7)           // play a full day headlessly at a given skill level
daryl.bench(0.7, 20)     // run that 20 times and tally the endings
```

`sim` models a person rather than a script: each thing that appears gets a
reaction delay, some are never noticed, and only one thing can be clicked at a
time. It is what the difficulty was tuned against.
