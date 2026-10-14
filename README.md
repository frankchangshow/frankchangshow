# Murder Mystery 2

Playable browser social-deduction game: open top-down map, secret roles, and AI bots so you can play solo.

## How to run

**Option A — open the file**

Open `game/index.html` in a modern browser (Chrome, Firefox, Edge).

**Option B — local server**

```bash
npm start
```

Then visit [http://localhost:3000](http://localhost:3000).

## How to play

1. Click **Begin Night** — you are randomly assigned **Murderer**, **Sheriff**, or **Innocent**.
2. Move with **WASD** or **arrow keys**.
3. Act with **Space** or **mouse click**:
   - **Murderer** — knife anyone in melee range; win by killing everyone else.
   - **Sheriff** — shoot toward the cursor; win by eliminating the Murderer (avoid innocents).
   - **Innocent** — no weapon; survive until the Murderer falls.
4. Seven AI bots fill the other roles. HUD shows your role, living players, and win/lose.

## Controls

| Input | Action |
| --- | --- |
| WASD / Arrows | Move |
| Space / Click | Attack (knife) or shoot |
| Enter | Start / restart from menus |
