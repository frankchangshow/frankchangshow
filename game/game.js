(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const hud = document.getElementById("hud");
  const hudRole = document.getElementById("hud-role");
  const hudAlive = document.getElementById("hud-alive");
  const hudStatus = document.getElementById("hud-status");
  const helpBar = document.getElementById("help-bar");
  const actionHint = document.getElementById("action-hint");
  const startScreen = document.getElementById("start-screen");
  const endScreen = document.getElementById("end-screen");
  const endEyebrow = document.getElementById("end-eyebrow");
  const endTitle = document.getElementById("end-title");
  const endDetail = document.getElementById("end-detail");

  const ROLES = {
    murderer: {
      id: "murderer",
      label: "Murderer",
      color: "#c45c5c",
      hint: "Space / Click — knife nearby players. Kill everyone to win.",
    },
    sheriff: {
      id: "sheriff",
      label: "Sheriff",
      color: "#4a9b7a",
      hint: "Space / Click — shoot toward the cursor. Stop the Murderer.",
    },
    innocent: {
      id: "innocent",
      label: "Innocent",
      color: "#6a8fb0",
      hint: "Survive. You have no weapon — stay alert and keep moving.",
    },
  };

  const TOTAL_PLAYERS = 8;
  const PLAYER_R = 14;
  const KNIFE_RANGE = 38;
  const KNIFE_COOLDOWN = 0.85;
  const GUN_COOLDOWN = 0.55;
  const BULLET_SPEED = 420;
  const BULLET_LIFE = 0.9;
  const MOVE_SPEED = 165;
  const BOT_SPEED = 120;
  const HUNT_GRACE = 2.5; // seconds before murderer AI starts hunting

  /** @type {{x:number,y:number,w:number,h:number}[]} */
  const obstacles = [
    { x: 80, y: 70, w: 140, h: 70 },
    { x: 280, y: 50, w: 90, h: 110 },
    { x: 520, y: 80, w: 160, h: 60 },
    { x: 760, y: 55, w: 120, h: 95 },
    { x: 40, y: 250, w: 70, h: 160 },
    { x: 200, y: 280, w: 130, h: 55 },
    { x: 420, y: 240, w: 80, h: 140 },
    { x: 600, y: 300, w: 150, h: 50 },
    { x: 820, y: 260, w: 90, h: 130 },
    { x: 90, y: 480, w: 160, h: 70 },
    { x: 320, y: 500, w: 70, h: 90 },
    { x: 480, y: 460, w: 140, h: 55 },
    { x: 700, y: 490, w: 120, h: 80 },
    { x: 860, y: 450, w: 60, h: 120 },
  ];

  const keys = Object.create(null);
  let mouse = { x: W / 2, y: H / 2, down: false };
  let state = "menu"; // menu | playing | ended
  let players = [];
  let bullets = [];
  let particles = [];
  let corpses = [];
  let cameraShake = 0;
  let lastTs = 0;
  let humanId = null;
  let winnerSide = null;
  let animT = 0;

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function circleHitsRect(cx, cy, r, rect) {
    const nx = clamp(cx, rect.x, rect.x + rect.w);
    const ny = clamp(cy, rect.y, rect.y + rect.h);
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy < r * r;
  }

  function blocked(x, y, r, ignoreId) {
    if (x - r < 8 || x + r > W - 8 || y - r < 8 || y + r > H - 8) return true;
    for (const o of obstacles) {
      if (circleHitsRect(x, y, r, o)) return true;
    }
    for (const p of players) {
      if (!p.alive || p.id === ignoreId) continue;
      if (Math.hypot(p.x - x, p.y - y) < r + PLAYER_R - 2) return true;
    }
    return false;
  }

  function tryMove(ent, dx, dy, speed, dt) {
    const len = Math.hypot(dx, dy) || 1;
    const mx = (dx / len) * speed * dt;
    const my = (dy / len) * speed * dt;
    let nx = ent.x + mx;
    let ny = ent.y + my;
    if (!blocked(nx, ent.y, PLAYER_R, ent.id)) ent.x = nx;
    if (!blocked(ent.x, ny, PLAYER_R, ent.id)) ent.y = ny;
  }

  function freeSpawn() {
    for (let i = 0; i < 80; i++) {
      const x = rand(40, W - 40);
      const y = rand(40, H - 40);
      if (!blocked(x, y, PLAYER_R + 4, null)) return { x, y };
    }
    return { x: W / 2, y: H / 2 };
  }

  function assignRoles() {
    const roles = ["murderer", "sheriff"];
    while (roles.length < TOTAL_PLAYERS) roles.push("innocent");
    for (let i = roles.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    return roles;
  }

  const NAMES = [
    "Ash", "Blair", "Casey", "Drew", "Ellis", "Finn", "Gray", "Harper",
    "Indigo", "Jules", "Kai", "Lane", "Morgan", "Noel", "Quinn", "Remy",
  ];

  function startGame() {
    const roles = assignRoles();
    const usedNames = new Set();
    players = [];
    bullets = [];
    particles = [];
    corpses = [];
    cameraShake = 0;
    winnerSide = null;
    animT = 0;

    for (let i = 0; i < TOTAL_PLAYERS; i++) {
      let name;
      do {
        name = pick(NAMES);
      } while (usedNames.has(name));
      usedNames.add(name);
      const pos = freeSpawn();
      players.push({
        id: i,
        name,
        role: roles[i],
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        alive: true,
        isHuman: false,
        cooldown: 0,
        facing: rand(0, Math.PI * 2),
        wanderAngle: rand(0, Math.PI * 2),
        wanderTimer: rand(0.5, 2),
        targetId: null,
        fleeUntil: 0,
        suspicion: new Map(),
        pulse: rand(0, Math.PI * 2),
      });
    }

    const human = pick(players);
    human.isHuman = true;
    humanId = human.id;
    human.name = "You";

    state = "playing";
    startScreen.hidden = true;
    endScreen.hidden = true;
    hud.hidden = false;
    helpBar.hidden = false;
    updateHud();
    actionHint.textContent = ROLES[human.role].hint;
  }

  function living() {
    return players.filter((p) => p.alive);
  }

  function getHuman() {
    return players.find((p) => p.id === humanId);
  }

  function updateHud() {
    const human = getHuman();
    if (!human) return;
    const role = ROLES[human.role];
    hudRole.textContent = role.label;
    hudRole.className = "hud-value role-" + human.role;
    const alive = living().length;
    hudAlive.textContent = String(alive) + " / " + TOTAL_PLAYERS;

    if (state === "ended") {
      const won = didHumanWin();
      hudStatus.textContent = won ? "Victory" : "Defeat";
      hudStatus.className = "hud-value " + (won ? "win" : "lose");
    } else if (!human.alive) {
      hudStatus.textContent = "Spectating";
      hudStatus.className = "hud-value lose";
    } else {
      hudStatus.textContent = "Playing";
      hudStatus.className = "hud-value";
    }
  }

  function didHumanWin() {
    const human = getHuman();
    if (!human) return false;
    if (winnerSide === "murderer") return human.role === "murderer" && human.alive;
    if (winnerSide === "town") {
      if (human.role === "murderer") return false;
      return true; // town wins even if human died (sheriff/innocent team)
    }
    return false;
  }

  function checkWin() {
    const alive = living();
    const murdererAlive = alive.some((p) => p.role === "murderer");
    if (!murdererAlive) {
      endGame("town");
      return;
    }
    if (alive.length === 1 && alive[0].role === "murderer") {
      endGame("murderer");
      return;
    }
    // Murderer alone with only dead others
    if (murdererAlive && alive.every((p) => p.role === "murderer")) {
      endGame("murderer");
    }
  }

  function endGame(side) {
    if (state === "ended") return;
    state = "ended";
    winnerSide = side;
    updateHud();

    const human = getHuman();
    const won = didHumanWin();
    endScreen.hidden = false;
    endEyebrow.textContent = won ? "Case closed" : "The fog settles";
    if (side === "murderer") {
      endTitle.textContent = won ? "You got away with it" : "The Murderer won";
      endDetail.textContent = won
        ? "Every other soul on the grounds is gone. The night belongs to you."
        : "The Murderer was the last one standing. The town fell silent.";
    } else {
      endTitle.textContent = won ? "Justice prevails" : "The Murderer was caught — without you";
      if (human && human.role === "murderer") {
        endTitle.textContent = "You were stopped";
        endDetail.textContent = "The Sheriff's aim was true. Your killing spree ends here.";
      } else if (won) {
        endDetail.textContent =
          human && human.alive
            ? "The Murderer is down. The remaining townsfolk live to see dawn."
            : "The Murderer fell. Your sacrifice helped the town survive.";
      } else {
        endDetail.textContent = "The Murderer was eliminated, but you did not live to celebrate.";
      }
    }
  }

  function killPlayer(victim, killer) {
    if (!victim.alive) return;
    victim.alive = false;
    corpses.push({
      x: victim.x,
      y: victim.y,
      role: victim.role,
      name: victim.name,
      t: 0,
      pool: rand(0.8, 1.2),
    });
    burst(victim.x, victim.y, "#8b2020", 18);
    cameraShake = 0.35;

    // Town AI reacts to nearby death
    for (const p of players) {
      if (!p.alive || p.isHuman || p.id === victim.id) continue;
      if (dist(p, victim) < 220) {
        p.fleeUntil = animT + rand(1.5, 3.2);
        if (killer && p.role === "sheriff") {
          p.targetId = killer.id;
          p.suspicion.set(killer.id, (p.suspicion.get(killer.id) || 0) + 5);
        }
      }
    }
    updateHud();
    checkWin();
  }

  function burst(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(40, 180);
      particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(0.3, 0.7),
        max: 0.7,
        color,
        size: rand(2, 5),
      });
    }
  }

  function knifeAttack(attacker) {
    if (attacker.cooldown > 0 || !attacker.alive) return;
    attacker.cooldown = KNIFE_COOLDOWN;
    let hit = null;
    let best = KNIFE_RANGE;
    for (const p of players) {
      if (!p.alive || p.id === attacker.id) continue;
      const d = dist(attacker, p);
      if (d < best) {
        best = d;
        hit = p;
      }
    }
    if (hit) {
      killPlayer(hit, attacker);
      burst(hit.x, hit.y, "#c45c5c", 10);
    } else {
      burst(
        attacker.x + Math.cos(attacker.facing) * 22,
        attacker.y + Math.sin(attacker.facing) * 22,
        "#a09080",
        4
      );
    }
  }

  function shoot(attacker, aimX, aimY) {
    if (attacker.cooldown > 0 || !attacker.alive) return;
    attacker.cooldown = GUN_COOLDOWN;
    const ang = Math.atan2(aimY - attacker.y, aimX - attacker.x);
    attacker.facing = ang;
    bullets.push({
      x: attacker.x + Math.cos(ang) * 18,
      y: attacker.y + Math.sin(ang) * 18,
      vx: Math.cos(ang) * BULLET_SPEED,
      vy: Math.sin(ang) * BULLET_SPEED,
      life: BULLET_LIFE,
      ownerId: attacker.id,
    });
    burst(attacker.x + Math.cos(ang) * 16, attacker.y + Math.sin(ang) * 16, "#d8c890", 5);
  }

  function doAction(attacker) {
    if (!attacker || !attacker.alive || state !== "playing") return;
    if (attacker.role === "murderer") knifeAttack(attacker);
    else if (attacker.role === "sheriff") {
      const aim = attacker.isHuman
        ? mouse
        : aimForBot(attacker);
      if (aim) shoot(attacker, aim.x, aim.y);
    }
  }

  function aimForBot(bot) {
    // Prefer known/suspected murderer; else nearest living non-self
    let target = null;
    if (bot.targetId != null) {
      target = players.find((p) => p.id === bot.targetId && p.alive);
    }
    if (!target) {
      let bestScore = -1;
      for (const p of players) {
        if (!p.alive || p.id === bot.id) continue;
        const sus = bot.suspicion.get(p.id) || 0;
        const score = sus * 10 - dist(bot, p) * 0.01;
        if (score > bestScore) {
          bestScore = score;
          target = p;
        }
      }
    }
    // Only shoot if suspicious enough or very close murder scene
    if (!target) return null;
    const sus = bot.suspicion.get(target.id) || 0;
    if (sus < 2 && target.role !== "murderer") {
      // For AI we can peek at role slightly via "witness" — if murderer is close and fleeing
      if (target.role !== "murderer") return null;
    }
    // Prefer shooting murderer; avoid innocents unless high suspicion
    if (target.role !== "murderer" && sus < 4) return null;
    if (dist(bot, target) > 320) return null;
    return { x: target.x, y: target.y };
  }

  function updateHuman(dt) {
    const human = getHuman();
    if (!human || !human.alive) return;
    let dx = 0;
    let dy = 0;
    if (keys.w || keys.ArrowUp) dy -= 1;
    if (keys.s || keys.ArrowDown) dy += 1;
    if (keys.a || keys.ArrowLeft) dx -= 1;
    if (keys.d || keys.ArrowRight) dx += 1;
    if (dx || dy) {
      tryMove(human, dx, dy, MOVE_SPEED, dt);
      human.facing = Math.atan2(dy, dx);
    } else {
      human.facing = Math.atan2(mouse.y - human.y, mouse.x - human.x);
    }
    if (keys[" "] || mouse.down) {
      doAction(human);
      mouse.down = false;
      keys[" "] = false;
    }
  }

  function lineOfSight(a, b) {
    const steps = 12;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      for (const o of obstacles) {
        if (x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h) return false;
      }
    }
    return true;
  }

  function updateBot(bot, dt) {
    if (!bot.alive) return;
    bot.wanderTimer -= dt;
    bot.pulse += dt;

    // Spot corpses → raise suspicion on nearest other living player
    for (const c of corpses) {
      if (c.t > 3) continue;
      if (dist(bot, c) < 160 && lineOfSight(bot, c)) {
        let nearest = null;
        let nd = Infinity;
        for (const p of players) {
          if (!p.alive || p.id === bot.id) continue;
          const d = dist(p, c);
          if (d < nd && d < 180) {
            nd = d;
            nearest = p;
          }
        }
        if (nearest) {
          bot.suspicion.set(nearest.id, (bot.suspicion.get(nearest.id) || 0) + dt * 2);
          if (bot.role === "sheriff" && (bot.suspicion.get(nearest.id) || 0) > 3) {
            bot.targetId = nearest.id;
          }
        }
      }
    }

    // Murderer hunts isolated victims (after a short grace so the round can breathe)
    if (bot.role === "murderer") {
      const sheriff = players.find((p) => p.alive && p.role === "sheriff");
      if (sheriff && dist(bot, sheriff) < 140 && lineOfSight(bot, sheriff)) {
        tryMove(bot, bot.x - sheriff.x, bot.y - sheriff.y, BOT_SPEED * 1.15, dt);
        bot.facing = Math.atan2(bot.y - sheriff.y, bot.x - sheriff.x);
        return;
      }
      if (animT < HUNT_GRACE) {
        // Blend in: wander like an innocent at first
      } else {
        let prey = null;
        let best = Infinity;
        for (const p of players) {
          if (!p.alive || p.id === bot.id) continue;
          const d = dist(bot, p);
          let neighbors = 0;
          for (const o of players) {
            if (!o.alive || o.id === p.id || o.id === bot.id) continue;
            if (dist(o, p) < 150) neighbors++;
          }
          const score = d + neighbors * 80;
          if (score < best) {
            best = score;
            prey = p;
          }
        }
        if (prey) {
          bot.targetId = prey.id;
          tryMove(bot, prey.x - bot.x, prey.y - bot.y, BOT_SPEED * 1.02, dt);
          bot.facing = Math.atan2(prey.y - bot.y, prey.x - bot.x);
          if (dist(bot, prey) < KNIFE_RANGE - 4) knifeAttack(bot);
          return;
        }
      }
    }

    // Sheriff patrols / pursues
    if (bot.role === "sheriff") {
      const target = bot.targetId != null
        ? players.find((p) => p.id === bot.targetId && p.alive)
        : null;
      if (target) {
        tryMove(bot, target.x - bot.x, target.y - bot.y, BOT_SPEED, dt);
        bot.facing = Math.atan2(target.y - bot.y, target.x - bot.x);
        if (dist(bot, target) < 280 && lineOfSight(bot, target)) {
          const sus = bot.suspicion.get(target.id) || 0;
          // Shoot if high suspicion OR target is actually murderer and somewhat close
          if (sus >= 3 || (target.role === "murderer" && dist(bot, target) < 200)) {
            if (bot.cooldown <= 0) shoot(bot, target.x, target.y);
          }
        }
        return;
      }
      // Wander and scan for murderer-ish behavior (players near fresh corpses)
      const murd = players.find((p) => p.alive && p.role === "murderer");
      if (murd && dist(bot, murd) < 250 && lineOfSight(bot, murd)) {
        // Soft auto-detect if murderer is near a corpse
        const nearCorpse = corpses.some((c) => c.t < 4 && dist(murd, c) < 100);
        if (nearCorpse) {
          bot.suspicion.set(murd.id, (bot.suspicion.get(murd.id) || 0) + dt * 3);
          bot.targetId = murd.id;
        }
      }
    }

    // Flee if scared
    if (bot.fleeUntil > animT) {
      const nearestCorpse = corpses.reduce((best, c) => {
        const d = dist(bot, c);
        return !best || d < best.d ? { c, d } : best;
      }, null);
      if (nearestCorpse) {
        tryMove(
          bot,
          bot.x - nearestCorpse.c.x,
          bot.y - nearestCorpse.c.y,
          BOT_SPEED * 1.1,
          dt
        );
        return;
      }
    }

    // Default wander
    if (bot.wanderTimer <= 0) {
      bot.wanderAngle = rand(0, Math.PI * 2);
      bot.wanderTimer = rand(1.2, 3.5);
    }
    tryMove(bot, Math.cos(bot.wanderAngle), Math.sin(bot.wanderAngle), BOT_SPEED * 0.75, dt);
    bot.facing = bot.wanderAngle;

    // Occasional bump into wall → new direction
    if (blocked(bot.x + Math.cos(bot.wanderAngle) * 20, bot.y + Math.sin(bot.wanderAngle) * 20, PLAYER_R, bot.id)) {
      bot.wanderAngle = rand(0, Math.PI * 2);
    }
  }

  function updateBullets(dt) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      let dead = b.life <= 0 || b.x < 0 || b.x > W || b.y < 0 || b.y > H;
      for (const o of obstacles) {
        if (b.x >= o.x && b.x <= o.x + o.w && b.y >= o.y && b.y <= o.y + o.h) {
          dead = true;
          burst(b.x, b.y, "#b0a890", 4);
          break;
        }
      }
      if (!dead) {
        for (const p of players) {
          if (!p.alive || p.id === b.ownerId) continue;
          if (Math.hypot(p.x - b.x, p.y - b.y) < PLAYER_R + 3) {
            killPlayer(p, players.find((o) => o.id === b.ownerId));
            burst(p.x, p.y, "#d8c890", 8);
            dead = true;
            break;
          }
        }
      }
      if (dead) bullets.splice(i, 1);
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    for (const c of corpses) c.t += dt;
  }

  function update(dt) {
    if (state !== "playing" && state !== "ended") return;
    animT += dt;
    cameraShake = Math.max(0, cameraShake - dt);

    if (state === "playing") {
      for (const p of players) {
        if (p.cooldown > 0) p.cooldown -= dt;
      }
      updateHuman(dt);
      for (const p of players) {
        if (!p.isHuman) updateBot(p, dt);
      }
      updateBullets(dt);
    }
    updateParticles(dt);
  }

  function drawMap() {
    // Ground
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#243038");
    g.addColorStop(1, "#1a2228");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Subtle path grid
    ctx.strokeStyle = "rgba(180, 170, 140, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Fog vignette patches
    ctx.fillStyle = "rgba(20, 28, 34, 0.35)";
    ctx.beginPath();
    ctx.ellipse(W * 0.2, H * 0.7, 180, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(W * 0.75, H * 0.3, 160, 100, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Buildings
    for (const o of obstacles) {
      ctx.fillStyle = "#2e3842";
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = "rgba(200, 180, 140, 0.18)";
      ctx.lineWidth = 2;
      ctx.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
      // Roof hint
      ctx.fillStyle = "rgba(90, 70, 50, 0.35)";
      ctx.fillRect(o.x, o.y, o.w, 8);
    }

    // Border wall
    ctx.strokeStyle = "rgba(180, 160, 120, 0.35)";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, W - 8, H - 8);
  }

  function drawCorpses() {
    for (const c of corpses) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = "rgba(90, 20, 20, 0.55)";
      ctx.beginPath();
      ctx.ellipse(c.x, c.y + 4, 22 * c.pool, 12 * c.pool, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4a3030";
      ctx.beginPath();
      ctx.arc(c.x, c.y, PLAYER_R * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(200, 160, 140, 0.5)";
      ctx.font = "11px Source Sans 3, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(c.name, c.x, c.y - 20);
      ctx.restore();
    }
  }

  function drawPlayer(p) {
    if (!p.alive) return;
    const human = getHuman();
    const isSelf = p.isHuman;
    const showRole = isSelf || state === "ended";

    // Soft shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + PLAYER_R * 0.7, PLAYER_R * 0.9, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    let fill = "#8a9aaa";
    if (showRole) fill = ROLES[p.role].color;
    else if (isSelf) fill = ROLES[p.role].color;

    const pulse = 1 + Math.sin(p.pulse * 3) * 0.03;
    ctx.beginPath();
    ctx.arc(p.x, p.y, PLAYER_R * pulse, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = isSelf ? "#f0e6d0" : "rgba(20, 20, 24, 0.6)";
    ctx.lineWidth = isSelf ? 3 : 1.5;
    ctx.stroke();

    // Facing indicator / weapon
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.facing);
    if (showRole && p.role === "sheriff") {
      ctx.fillStyle = "#2a2a28";
      ctx.fillRect(8, -3, 16, 6);
      ctx.fillStyle = "#c9a227";
      ctx.fillRect(20, -2, 6, 4);
    } else if (showRole && p.role === "murderer") {
      ctx.strokeStyle = "#d0d0d0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(26, -4);
      ctx.stroke();
    } else {
      ctx.fillStyle = "rgba(240, 230, 210, 0.7)";
      ctx.beginPath();
      ctx.arc(PLAYER_R - 2, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Name
    ctx.fillStyle = isSelf ? "#f5ecd8" : "rgba(220, 210, 190, 0.75)";
    ctx.font = (isSelf ? "bold " : "") + "12px Source Sans 3, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.name, p.x, p.y - PLAYER_R - 8);

    if (showRole && isSelf) {
      ctx.fillStyle = ROLES[p.role].color;
      ctx.font = "10px Source Sans 3, sans-serif";
      ctx.fillText(ROLES[p.role].label, p.x, p.y - PLAYER_R - 20);
    }

    // Cooldown ring
    if (p.cooldown > 0 && isSelf && (p.role === "murderer" || p.role === "sheriff")) {
      const maxCd = p.role === "murderer" ? KNIFE_COOLDOWN : GUN_COOLDOWN;
      ctx.strokeStyle = "rgba(240,230,210,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, PLAYER_R + 5, -Math.PI / 2, -Math.PI / 2 + (1 - p.cooldown / maxCd) * Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawBullets() {
    for (const b of bullets) {
      ctx.fillStyle = "#f0e0a0";
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 220, 120, 0.5)";
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.vx * 0.03, b.y - b.vy * 0.03);
      ctx.stroke();
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawMinimapLegend() {
    // tiny alive dots legend bottom-left during play
    if (state === "menu") return;
    const alive = living();
    ctx.fillStyle = "rgba(10,12,16,0.55)";
    ctx.fillRect(12, H - 36, 160, 24);
    ctx.fillStyle = "rgba(220,210,190,0.8)";
    ctx.font = "11px Source Sans 3, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Alive: " + alive.map((p) => p.name).join(", "), 20, H - 20);
  }

  function render() {
    ctx.save();
    if (cameraShake > 0) {
      const m = cameraShake * 8;
      ctx.translate(rand(-m, m), rand(-m, m));
    }
    drawMap();
    drawCorpses();
    for (const p of players) drawPlayer(p);
    drawBullets();
    drawParticles();
    drawMinimapLegend();
    ctx.restore();

    // Menu idle preview
    if (state === "menu") {
      // soft animated lantern glow
      const t = performance.now() / 1000;
      ctx.fillStyle = `rgba(180, 120, 60, ${0.04 + Math.sin(t) * 0.02})`;
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.45, 120 + Math.sin(t * 1.3) * 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
    lastTs = ts;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }

  // Input
  window.addEventListener("keydown", (e) => {
    keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = true;
    if (e.key === " " || e.key.startsWith("Arrow")) e.preventDefault();
    if ((e.key === "Enter" || e.key === " ") && state === "menu") {
      startGame();
    }
    if ((e.key === "Enter" || e.key === "r") && state === "ended") {
      startGame();
    }
  });
  window.addEventListener("keyup", (e) => {
    keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = false;
  });

  function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * sx,
      y: (e.clientY - rect.top) * sy,
    };
  }

  canvas.addEventListener("mousemove", (e) => {
    const p = canvasPos(e);
    mouse.x = p.x;
    mouse.y = p.y;
  });
  canvas.addEventListener("mousedown", (e) => {
    const p = canvasPos(e);
    mouse.x = p.x;
    mouse.y = p.y;
    mouse.down = true;
    if (state === "playing") {
      const human = getHuman();
      if (human) doAction(human);
      mouse.down = false;
    }
  });

  document.getElementById("btn-start").addEventListener("click", startGame);
  document.getElementById("btn-restart").addEventListener("click", startGame);

  // Idle backdrop for menu
  function seedMenuScene() {
    players = [];
    for (let i = 0; i < 5; i++) {
      const pos = freeSpawn();
      players.push({
        id: i,
        name: "",
        role: "innocent",
        x: pos.x,
        y: pos.y,
        alive: true,
        isHuman: false,
        cooldown: 0,
        facing: rand(0, Math.PI * 2),
        wanderAngle: rand(0, Math.PI * 2),
        wanderTimer: rand(0.5, 2),
        targetId: null,
        fleeUntil: 0,
        suspicion: new Map(),
        pulse: rand(0, Math.PI * 2),
      });
    }
  }
  seedMenuScene();
  requestAnimationFrame(frame);
})();
