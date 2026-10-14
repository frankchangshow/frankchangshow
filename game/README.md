# Murder Mystery 2 X

A third-person round on Ashwick Estate. One murderer, one sheriff, and the rest innocent. The murderer is secret until the round ends.

## Run

```bash
cd game
npm install
npm run dev
```

Open http://localhost:5173

## Play

Click **Enter the estate**, then click the view to look around.

- WASD to walk, Shift to sprint
- Arrow keys also turn and tilt the view
- LMB or F attacks if you are the sheriff (gun) or the murderer (strike)
- Q raises a short shield that stops the next hit, then goes on cooldown
- R is the ultimate: the sheriff fires a rapid volley, the murderer lunges in a short burst
- Innocents have no weapon
- Everyone has three lives, shown as hearts
- The sheriff fights back only after they see someone attack
- The round ends when the murderer is down, or when the murderer downs everyone else
- The end screen names the murderer, then **Play again** deals new roles
