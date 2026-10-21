import { openEdgeTiles } from "./sim";
import type { Actor, Game, Structure, ToolId } from "./types";

let lightCanvas: HTMLCanvasElement | null = null;

function lightContext(width: number, height: number) {
  if (typeof document === "undefined") return null;
  if (!lightCanvas) lightCanvas = document.createElement("canvas");
  if (lightCanvas.width !== width || lightCanvas.height !== height) {
    lightCanvas.width = Math.max(1, width);
    lightCanvas.height = Math.max(1, height);
  }
  const context = lightCanvas.getContext("2d");
  if (!context) return null;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, lightCanvas.width, lightCanvas.height);
  return context;
}

function nightLevel(g: Game) {
  if (g.phase === "night" || g.phase === "gameover") return 1;
  if (g.phase === "dawn") return Math.max(0, Math.min(1, g.dawnT / 4.4));
  return 0;
}

function fillRound(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function cracks(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, ratio: number) {
  if (ratio > 0.72) return;
  ctx.strokeStyle = "rgba(40, 24, 16, 0.55)";
  ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.beginPath();
  ctx.moveTo(x + s * 0.3, y + s * 0.35);
  ctx.lineTo(x + s * 0.48, y + s * 0.52);
  ctx.lineTo(x + s * 0.4, y + s * 0.7);
  if (ratio < 0.4) {
    ctx.moveTo(x + s * 0.62, y + s * 0.3);
    ctx.lineTo(x + s * 0.7, y + s * 0.58);
  }
  ctx.stroke();
}

function drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
  ctx.fillStyle = "rgba(20, 30, 10, 0.2)";
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, flash: boolean) {
  drawShadow(ctx, x + s * 0.5, y + s * 0.84, s * 0.28, s * 0.1);
  ctx.fillStyle = flash ? "#e7c39a" : "#6a4328";
  fillRound(ctx, x + s * 0.42, y + s * 0.48, s * 0.16, s * 0.34, s * 0.04);
  ctx.fillStyle = flash ? "#d2f0a8" : "#1e5c2c";
  ctx.beginPath();
  ctx.arc(x + s * 0.5, y + s * 0.4, s * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = flash ? "#e7ffc4" : "#2f8a3e";
  ctx.beginPath();
  ctx.arc(x + s * 0.34, y + s * 0.46, s * 0.2, 0, Math.PI * 2);
  ctx.arc(x + s * 0.66, y + s * 0.44, s * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.arc(x + s * 0.4, y + s * 0.32, s * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawRock(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, flash: boolean) {
  drawShadow(ctx, x + s * 0.5, y + s * 0.78, s * 0.26, s * 0.09);
  ctx.fillStyle = flash ? "#ffffff" : "#8e98a1";
  ctx.beginPath();
  ctx.ellipse(x + s * 0.48, y + s * 0.58, s * 0.26, s * 0.18, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = flash ? "#f4f7f8" : "#c5ced6";
  ctx.beginPath();
  ctx.ellipse(x + s * 0.58, y + s * 0.5, s * 0.16, s * 0.12, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(60,70,80,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + s * 0.4, y + s * 0.5);
  ctx.lineTo(x + s * 0.55, y + s * 0.62);
  ctx.stroke();
}

function drawWall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  stone: boolean,
  struct: Structure,
) {
  const flash = struct.flash > 0;
  ctx.fillStyle = stone ? (flash ? "#f7fbff" : "#7d8b96") : flash ? "#f0d7b0" : "#7a4e2d";
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = stone ? (flash ? "#ffffff" : "#d5dee6") : flash ? "#fff1d4" : "#e0b070";
  ctx.fillRect(x, y, s, Math.max(4, s * 0.28));
  ctx.strokeStyle = stone ? "rgba(50, 60, 70, 0.35)" : "rgba(70, 36, 16, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (stone) {
    ctx.moveTo(x, y + s * 0.55);
    ctx.lineTo(x + s, y + s * 0.55);
    ctx.moveTo(x + s * 0.5, y + s * 0.28);
    ctx.lineTo(x + s * 0.5, y + s * 0.55);
  } else {
    ctx.moveTo(x + s * 0.33, y);
    ctx.lineTo(x + s * 0.33, y + s);
    ctx.moveTo(x + s * 0.66, y);
    ctx.lineTo(x + s * 0.66, y + s);
  }
  ctx.stroke();
  cracks(ctx, x, y, s, struct.hp / struct.maxHp);
}

function drawDoor(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, struct: Structure) {
  ctx.fillStyle = "#4e3424";
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = struct.flash > 0 ? "#f4d7a8" : "#a56b3c";
  ctx.fillRect(x + s * 0.16, y + s * 0.08, s * 0.68, s * 0.84);
  ctx.fillStyle = "#f2d48a";
  ctx.beginPath();
  ctx.arc(x + s * 0.7, y + s * 0.55, Math.max(2, s * 0.06), 0, Math.PI * 2);
  ctx.fill();
  cracks(ctx, x, y, s, struct.hp / struct.maxHp);
}

function drawWindow(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, struct: Structure) {
  drawWall(ctx, x, y, s, false, struct);
  ctx.fillStyle = "#9fd7e8";
  fillRound(ctx, x + s * 0.32, y + s * 0.36, s * 0.36, s * 0.28, 2);
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + s * 0.5, y + s * 0.36);
  ctx.lineTo(x + s * 0.5, y + s * 0.64);
  ctx.moveTo(x + s * 0.32, y + s * 0.5);
  ctx.lineTo(x + s * 0.68, y + s * 0.5);
  ctx.stroke();
}

function drawBed(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, struct: Structure) {
  drawShadow(ctx, x + s * 0.5, y + s * 0.8, s * 0.32, s * 0.1);
  ctx.fillStyle = struct.flash > 0 ? "#f8e2c4" : "#a56b3c";
  fillRound(ctx, x + s * 0.16, y + s * 0.28, s * 0.68, s * 0.5, 4);
  ctx.fillStyle = "#f4efe4";
  fillRound(ctx, x + s * 0.22, y + s * 0.4, s * 0.56, s * 0.3, 3);
  ctx.fillStyle = "#c4394a";
  fillRound(ctx, x + s * 0.22, y + s * 0.52, s * 0.56, s * 0.18, 3);
  ctx.fillStyle = "#fffaf3";
  fillRound(ctx, x + s * 0.26, y + s * 0.32, s * 0.22, s * 0.14, 3);
  if (struct.hp < struct.maxHp) cracks(ctx, x, y, s, struct.hp / struct.maxHp);
}

function drawSpike(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = "#6b4428";
  for (let i = 0; i < 3; i++) {
    const px = x + s * (0.28 + i * 0.22);
    ctx.beginPath();
    ctx.moveTo(px, y + s * 0.72);
    ctx.lineTo(px + s * 0.08, y + s * 0.4);
    ctx.lineTo(px + s * 0.16, y + s * 0.72);
    ctx.fill();
  }
}

function drawTurret(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, struct: Structure) {
  drawShadow(ctx, x + s * 0.5, y + s * 0.8, s * 0.24, s * 0.08);
  ctx.fillStyle = struct.flash > 0 ? "#f0d7b0" : "#6d5438";
  fillRound(ctx, x + s * 0.28, y + s * 0.42, s * 0.44, s * 0.34, 4);
  ctx.save();
  ctx.translate(x + s * 0.5, y + s * 0.48);
  ctx.rotate(struct.aim);
  ctx.fillStyle = "#c4553a";
  fillRound(ctx, 0, -s * 0.06, s * 0.34, s * 0.12, 3);
  ctx.restore();
}

function drawRoof(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = "rgba(176, 72, 48, 0.72)";
  ctx.fillRect(x, y, s, s);
  ctx.strokeStyle = "rgba(90, 28, 18, 0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i <= 3; i++) {
    const yy = y + (s * i) / 4;
    ctx.moveTo(x, yy);
    ctx.lineTo(x + s, yy);
  }
  ctx.moveTo(x + s * 0.5, y);
  ctx.lineTo(x + s * 0.5, y + s);
  ctx.stroke();
}

function drawActor(ctx: CanvasRenderingContext2D, actor: Actor, tile: number, tool: ToolId, phase: Game["phase"]) {
  const s = tile;
  const x = actor.x * s;
  const y = actor.y * s;
  const bob = Math.sin(actor.anim) * s * 0.04;
  const down = actor.stun > 0;
  ctx.save();
  ctx.translate(x, y + bob);
  if (down) ctx.rotate(Math.PI / 2.4);
  drawShadow(ctx, 0, s * 0.16, s * 0.22, s * 0.08);

  const flash = actor.flash > 0.04 && Math.floor(actor.flash * 24) % 2 === 0;
  const enemy = actor.kind !== "player";
  const cloth = flash ? "#ffffff" : enemy ? (actor.kind === "bruiser" ? "#6a3a32" : "#8d2f2f") : "#3c74e0";
  const scale = actor.kind === "bruiser" ? 1.18 : 1;
  ctx.scale(scale, scale);

  const leg = Math.sin(actor.anim) * s * 0.08;
  ctx.strokeStyle = "#3a2a22";
  ctx.lineWidth = Math.max(2, s * 0.06);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-s * 0.06, s * 0.02);
  ctx.lineTo(-s * 0.08 - leg, s * 0.16);
  ctx.moveTo(s * 0.06, s * 0.02);
  ctx.lineTo(s * 0.08 + leg, s * 0.16);
  ctx.stroke();

  ctx.fillStyle = cloth;
  fillRound(ctx, -s * 0.13, -s * 0.16, s * 0.26, s * 0.24, s * 0.08);

  ctx.fillStyle = flash ? "#fff" : "#f0c7a0";
  ctx.beginPath();
  ctx.arc(0, -s * 0.24, s * 0.11, 0, Math.PI * 2);
  ctx.fill();

  if (!enemy) {
    ctx.fillStyle = "#e6c36a";
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.3, s * 0.16, s * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c4553a";
    fillRound(ctx, -s * 0.045, -s * 0.4, s * 0.09, s * 0.1, 2);
  } else {
    ctx.fillStyle = "#241c20";
    ctx.beginPath();
    ctx.arc(0, -s * 0.26, s * 0.13, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#f2d48a";
    ctx.fillRect(-s * 0.045, -s * 0.25, s * 0.03, s * 0.03);
    ctx.fillRect(s * 0.02, -s * 0.25, s * 0.03, s * 0.03);
  }

  const aim = actor.facing;
  ctx.save();
  ctx.rotate(aim);
  const reach = s * (0.18 + actor.attack * 0.5);
  if (!enemy && (phase === "night" || phase === "dawn" || phase === "gameover")) {
    ctx.strokeStyle = "#d7b27a";
    ctx.lineWidth = Math.max(2, s * 0.045);
    ctx.beginPath();
    ctx.moveTo(s * 0.05, 0);
    ctx.lineTo(reach, 0);
    ctx.stroke();
  } else if (!enemy && tool === "axe") {
    ctx.strokeStyle = "#6b4428";
    ctx.lineWidth = Math.max(2, s * 0.04);
    ctx.beginPath();
    ctx.moveTo(s * 0.04, s * 0.04);
    ctx.lineTo(reach, -s * 0.02);
    ctx.stroke();
    ctx.fillStyle = "#c5ced6";
    ctx.beginPath();
    ctx.moveTo(reach, -s * 0.08);
    ctx.lineTo(reach + s * 0.1, -s * 0.02);
    ctx.lineTo(reach, s * 0.04);
    ctx.fill();
  } else if (actor.kind === "bruiser") {
    ctx.strokeStyle = "#6b4428";
    ctx.lineWidth = Math.max(3, s * 0.07);
    ctx.beginPath();
    ctx.moveTo(s * 0.04, 0);
    ctx.lineTo(reach + s * 0.08, 0);
    ctx.stroke();
  } else if (actor.kind === "thrower") {
    ctx.fillStyle = "#ff9a3c";
    ctx.beginPath();
    ctx.arc(reach, 0, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  } else if (enemy) {
    ctx.strokeStyle = "#d7d3cc";
    ctx.lineWidth = Math.max(2, s * 0.04);
    ctx.beginPath();
    ctx.moveTo(s * 0.02, 0);
    ctx.lineTo(reach, 0);
    ctx.stroke();
  }
  ctx.restore();

  if (actor.hp < actor.maxHp) {
    const w = s * 0.36;
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(-w / 2, -s * 0.52, w, s * 0.06);
    ctx.fillStyle = actor.kind === "player" ? "#e2554f" : "#f0d48a";
    ctx.fillRect(-w / 2, -s * 0.52, w * Math.max(0, actor.hp / actor.maxHp), s * 0.06);
  }
  ctx.restore();
}

function drawShot(ctx: CanvasRenderingContext2D, shot: Game["shots"][number], tile: number) {
  const x = shot.x * tile;
  const y = shot.y * tile;
  if (shot.kind === "torch") {
    ctx.fillStyle = "rgba(255, 154, 60, 0.35)";
    ctx.beginPath();
    ctx.arc(x, y, tile * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffd29a";
    ctx.beginPath();
    ctx.arc(x, y, tile * 0.07, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const angle = Math.atan2(shot.vy, shot.vx);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = "#f4efe4";
  ctx.lineWidth = Math.max(1.5, tile * 0.035);
  ctx.beginPath();
  ctx.moveTo(-tile * 0.16, 0);
  ctx.lineTo(tile * 0.08, 0);
  ctx.stroke();
  ctx.fillStyle = "#e7e2d6";
  ctx.beginPath();
  ctx.moveTo(tile * 0.12, 0);
  ctx.lineTo(0, tile * 0.045);
  ctx.lineTo(0, -tile * 0.045);
  ctx.fill();
  ctx.restore();
}

function paintGaps(ctx: CanvasRenderingContext2D, g: Game, s: number) {
  const gaps = openEdgeTiles(g);
  if (gaps.length === 0) return;
  const pulse = 0.62 + Math.sin(g.time * 6) * 0.18;
  ctx.save();
  for (const gap of gaps) {
    const x = gap.c * s;
    const y = gap.r * s;
    ctx.fillStyle = `rgba(255, 48, 32, ${pulse})`;
    ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
    ctx.strokeStyle = "#fff7e8";
    ctx.lineWidth = Math.max(2, s * 0.08);
    ctx.strokeRect(x + 3, y + 3, s - 6, s - 6);
    ctx.strokeStyle = "#2a0604";
    ctx.lineWidth = Math.max(2, s * 0.07);
    ctx.beginPath();
    ctx.moveTo(x + s * 0.32, y + s * 0.32);
    ctx.lineTo(x + s * 0.68, y + s * 0.68);
    ctx.moveTo(x + s * 0.68, y + s * 0.32);
    ctx.lineTo(x + s * 0.32, y + s * 0.68);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGhost(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.hoverC < 0 || g.tool === "axe") return;
  if (g.phase !== "day" && g.phase !== "night" && g.phase !== "dawn") return;
  const s = g.tile;
  const x = g.hoverC * s;
  const y = g.hoverR * s;
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = g.previewOk ? "rgba(143, 206, 107, 0.35)" : "rgba(226, 85, 79, 0.35)";
  ctx.fillRect(x + 2, y + 2, s - 4, s - 4);
  ctx.globalAlpha = 0.85;
  const fake: Structure = {
    kind: g.tool === "floor" || g.tool === "roof" ? "wall" : g.tool,
    hp: 1,
    maxHp: 1,
    flash: 0,
    cooldown: 0,
    aim: 0,
  };
  if (g.tool === "floor") {
    ctx.fillStyle = g.previewOk ? "rgba(215, 178, 122, 0.7)" : "rgba(226, 85, 79, 0.45)";
    ctx.fillRect(x + 3, y + 3, s - 6, s - 6);
  } else if (g.tool === "roof") {
    drawRoof(ctx, x, y, s);
  } else if (g.tool === "wall") drawWall(ctx, x, y, s, false, fake);
  else if (g.tool === "stone") drawWall(ctx, x, y, s, true, fake);
  else if (g.tool === "door") drawDoor(ctx, x, y, s, fake);
  else if (g.tool === "window") drawWindow(ctx, x, y, s, fake);
  else if (g.tool === "bed") drawBed(ctx, x, y, s, fake);
  else if (g.tool === "spike") drawSpike(ctx, x, y, s);
  else if (g.tool === "turret") drawTurret(ctx, x, y, s, fake);
  ctx.restore();
}

function drawDarkness(ctx: CanvasRenderingContext2D, g: Game) {
  const amount = nightLevel(g);
  if (amount < 0.03) return;
  const lctx = lightContext(g.worldW, g.worldH);
  if (!lctx || !lightCanvas) return;
  lctx.fillStyle = `rgba(5, 8, 22, ${0.82 * amount})`;
  lctx.fillRect(0, 0, g.worldW, g.worldH);
  lctx.globalCompositeOperation = "destination-out";
  const punch = (x: number, y: number, radius: number, strength: number) => {
    const gradient = lctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
    gradient.addColorStop(0, `rgba(0,0,0,${strength})`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    lctx.fillStyle = gradient;
    lctx.beginPath();
    lctx.arc(x, y, radius, 0, Math.PI * 2);
    lctx.fill();
  };
  const s = g.tile;
  punch(g.player.x * s, g.player.y * s, s * 3.4, 1);
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const tile = g.tiles[r * g.cols + c];
      if (tile.struct?.kind === "window") punch((c + 0.5) * s, (r + 0.5) * s, s * 2.1, 0.9);
      if (tile.struct?.kind === "bed" && tile.roof) punch((c + 0.5) * s, (r + 0.45) * s, s * 1.7, 0.75);
    }
  }
  for (const enemy of g.enemies) {
    if (enemy.kind === "thrower") punch(enemy.x * s, enemy.y * s, s * 1.5, 0.85);
  }
  for (const shot of g.shots) {
    if (shot.kind === "torch") punch(shot.x * s, shot.y * s, s * 1.35, 0.9);
  }
  lctx.globalCompositeOperation = "source-over";
  ctx.drawImage(lightCanvas, 0, 0);
}

function drawGround(ctx: CanvasRenderingContext2D, g: Game) {
  const s = g.tile;
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const tile = g.tiles[r * g.cols + c];
      const x = c * s;
      const y = r * s;
      const grass = tile.variant > 0.66 ? "#87b84e" : tile.variant > 0.33 ? "#74a842" : "#6a9a3b";
      ctx.fillStyle = grass;
      ctx.fillRect(x, y, s + 0.5, s + 0.5);
      if (tile.floor) {
        ctx.fillStyle = "#c9a36c";
        ctx.fillRect(x, y, s, s);
        ctx.fillStyle = "#d7b27a";
        const plank = s / 4;
        for (let i = 0; i < 4; i++) ctx.fillRect(x + 1, y + i * plank + 1, s - 2, plank - 2);
      }
      if (!tile.floor && tile.variant > 0.82) {
        ctx.fillStyle = "rgba(50, 90, 30, 0.35)";
        ctx.fillRect(x + s * 0.2, y + s * 0.62, s * 0.12, s * 0.08);
      }
      if (tile.flower && !tile.struct && !tile.floor) {
        const colors = ["#fffaf3", "#f2d48a", "#e07a8a"];
        ctx.fillStyle = colors[tile.flower - 1] ?? "#fff";
        ctx.beginPath();
        ctx.arc(x + s * 0.7, y + s * 0.68, Math.max(1.5, s * 0.05), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  let minC = g.cols;
  let minR = g.rows;
  let maxC = -1;
  let maxR = -1;
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      if (!g.tiles[r * g.cols + c].guide) continue;
      minC = Math.min(minC, c);
      minR = Math.min(minR, r);
      maxC = Math.max(maxC, c);
      maxR = Math.max(maxR, r);
    }
  }
  if (maxC >= 0) {
    ctx.save();
    ctx.strokeStyle = "rgba(244, 239, 228, 0.45)";
    ctx.setLineDash([s * 0.22, s * 0.16]);
    ctx.lineWidth = Math.max(1, s * 0.045);
    ctx.strokeRect(minC * s + 3, minR * s + 3, (maxC - minC + 1) * s - 6, (maxR - minR + 1) * s - 6);
    ctx.restore();
  }

  ctx.strokeStyle = "rgba(20, 40, 10, 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let c = 1; c < g.cols; c++) {
    ctx.moveTo(c * s, 0);
    ctx.lineTo(c * s, g.rows * s);
  }
  for (let r = 1; r < g.rows; r++) {
    ctx.moveTo(0, r * s);
    ctx.lineTo(g.cols * s, r * s);
  }
  ctx.stroke();
}

export function render(ctx: CanvasRenderingContext2D, g: Game) {
  const family = typeof window === "undefined" ? "sans-serif" : getComputedStyle(ctx.canvas).fontFamily || "sans-serif";
  ctx.clearRect(0, 0, g.viewW, g.viewH);
  ctx.fillStyle = "#121a10";
  ctx.fillRect(0, 0, g.viewW, g.viewH);
  ctx.save();
  if (!g.reduceMotion && g.shake > 0.4) {
    ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
  }
  ctx.translate(g.offsetX, g.offsetY);
  ctx.beginPath();
  ctx.rect(0, 0, g.worldW, g.worldH);
  ctx.clip();

  drawGround(ctx, g);

  const s = g.tile;
  type Stamp = { y: number; paint: () => void };
  const stamps: Stamp[] = [];

  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const tile = g.tiles[r * g.cols + c];
      const x = c * s;
      const y = r * s;
      if (tile.struct?.kind === "spike") drawSpike(ctx, x, y, s);
      if (!tile.struct || tile.struct.kind === "spike") continue;
      const struct = tile.struct;
      stamps.push({
        y: y + s,
        paint: () => {
          if (struct.kind === "tree") drawTree(ctx, x, y, s, struct.flash > 0);
          else if (struct.kind === "rock") drawRock(ctx, x, y, s, struct.flash > 0);
          else if (struct.kind === "wall") drawWall(ctx, x, y, s, false, struct);
          else if (struct.kind === "stone") drawWall(ctx, x, y, s, true, struct);
          else if (struct.kind === "door") drawDoor(ctx, x, y, s, struct);
          else if (struct.kind === "window") drawWindow(ctx, x, y, s, struct);
          else if (struct.kind === "bed") drawBed(ctx, x, y, s, struct);
          else if (struct.kind === "turret") drawTurret(ctx, x, y, s, struct);
        },
      });
    }
  }

  const actors: Actor[] = [g.player, ...g.enemies];
  for (const actor of actors) {
    stamps.push({
      y: actor.y * s,
      paint: () => drawActor(ctx, actor, s, g.tool, g.phase),
    });
  }
  stamps.sort((a, b) => a.y - b.y);
  for (const stamp of stamps) stamp.paint();

  if (!g.hideRoofs) {
    for (let r = 0; r < g.rows; r++) {
      for (let c = 0; c < g.cols; c++) {
        if (g.tiles[r * g.cols + c].roof) drawRoof(ctx, c * s, r * s, s);
      }
    }
  }

  for (const shot of g.shots) drawShot(ctx, shot, s);

  for (const particle of g.particles) {
    const alpha = Math.max(0, particle.life / particle.max);
    ctx.globalAlpha = alpha;
    if (particle.text) {
      ctx.fillStyle = particle.color;
      ctx.font = `700 ${Math.max(11, s * 0.28)}px ${family}`;
      ctx.textAlign = "center";
      ctx.fillText(particle.text, particle.x * s, particle.y * s);
    } else {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x * s, particle.y * s, Math.max(1, particle.size * s), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (g.phase === "day" && g.wood < 2 && g.status.floorCount === 0) {
    let best = 999;
    let tx = -1;
    let ty = -1;
    for (let r = 0; r < g.rows; r++) {
      for (let c = 0; c < g.cols; c++) {
        if (g.tiles[r * g.cols + c].struct?.kind !== "tree") continue;
        const d = Math.hypot(c + 0.5 - g.player.x, r + 0.5 - g.player.y);
        if (d < best) {
          best = d;
          tx = c;
          ty = r;
        }
      }
    }
    if (tx >= 0) {
      const pulse = 0.35 + Math.sin(g.time * 5) * 0.15;
      ctx.strokeStyle = `rgba(240, 212, 138, ${pulse + 0.35})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(tx * s + 4, ty * s + 4, s - 8, s - 8);
    }
  }

  if (g.phase === "day" || g.phase === "dawn") paintGaps(ctx, g, s);
  drawDarkness(ctx, g);
  drawGhost(ctx, g);
  ctx.restore();
}
