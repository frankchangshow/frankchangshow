import {
  BUILD_REACH,
  CHOP_REACH,
  DRAG_TOOLS,
  ENEMIES,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  REPAIR_REACH,
  TOOL_BY_ID,
  structHp,
  waveFor,
} from "./content";
import type {
  Actor,
  EnemyKind,
  Game,
  HouseStatus,
  Hud,
  Input,
  Phase,
  StructKind,
  Structure,
  Tile,
  ToolId,
} from "./types";
import { COLS, ROWS } from "./types";

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

export function blankInput(): Input {
  return {
    up: false,
    down: false,
    left: false,
    right: false,
    primary: false,
    primaryPressed: false,
    secondary: false,
    secondaryPressed: false,
    shoot: false,
    repair: false,
    repairPressed: false,
    gather: false,
    removePressed: false,
    pointerX: COLS / 2,
    pointerY: ROWS / 2,
    pointerInside: false,
    defendPressed: false,
    confirmDefend: false,
    cancelDefend: false,
    start: false,
    restart: false,
    pausePressed: false,
    tool: null,
    hideRoofsPressed: false,
    mutePressed: false,
  };
}

function hash(n: number): number {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function makeStruct(kind: StructKind, hp = structHp(kind)): Structure {
  return { kind, hp, maxHp: hp, flash: 0, cooldown: 0, aim: 0 };
}

function makePlayer(id: number): Actor {
  return {
    id,
    kind: "player",
    x: 11.5,
    y: 7.5,
    hp: 100,
    maxHp: 100,
    radius: PLAYER_RADIUS,
    facing: 0,
    cooldown: 0,
    stun: 0,
    iframe: 0,
    flash: 0,
    anim: 0,
    path: [],
    pathAge: 0,
    slow: 0,
    spikeT: 0,
    attack: 0,
  };
}

export function createGame(best = 0): Game {
  const tiles: Tile[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const dist = Math.max(Math.abs(c - 11), Math.abs(r - 7));
      const n = hash(r * COLS + c + 1);
      const guide = c >= 8 && c <= 14 && r >= 5 && r <= 9;
      let struct: Structure | null = null;
      if (dist >= 5) {
        const treeCut = dist >= 7 ? 0.62 : dist >= 6 ? 0.48 : 0.22;
        const rockCut = treeCut + (dist >= 6 ? 0.1 : 0.07);
        if (n < treeCut) struct = makeStruct("tree");
        else if (n < rockCut) struct = makeStruct("rock");
      }
      tiles.push({
        floor: false,
        roof: false,
        struct,
        variant: hash(r * 90 + c * 7 + 3),
        flower: n > 0.86 && !struct && dist <= 6 ? 1 + Math.floor(hash(c * 13 + r) * 3) : 0,
        guide,
      });
    }
  }

  return {
    cols: COLS,
    rows: ROWS,
    tile: 48,
    tiles,
    player: makePlayer(1),
    enemies: [],
    shots: [],
    particles: [],
    wood: 40,
    stone: 10,
    phase: "title",
    paused: false,
    night: 0,
    tool: "axe",
    time: 0,
    shake: 0,
    banner: "",
    bannerT: 0,
    status: emptyStatus(),
    stats: { kills: 0, placed: 0, nights: 0 },
    best,
    overReason: "",
    dawnT: 0,
    spawnQueue: [],
    spawnT: 0,
    nextId: 2,
    blackouts: 0,
    chopT: 0,
    repairT: 0,
    shootT: 0,
    lastPlaceC: -1,
    lastPlaceR: -1,
    hoverC: -1,
    hoverR: -1,
    previewOk: false,
    previewReason: "",
    tip: "Build a house. When you're ready, defend it.",
    input: blankInput(),
    events: [],
    worldW: COLS * 48,
    worldH: ROWS * 48,
    offsetX: 0,
    offsetY: 0,
    viewW: COLS * 48,
    viewH: ROWS * 48,
    reduceMotion: false,
    muted: false,
    hideRoofs: false,
    confirmOpen: false,
    waveKills: 0,
    gapCount: 0,
  };
}

function emptyStatus(): HouseStatus {
  return {
    bed: false,
    floors: false,
    floorCount: 0,
    roof: false,
    roofCount: 0,
    closed: false,
    ready: false,
  };
}

export function layout(g: Game, viewW: number, viewH: number) {
  const tile = Math.max(8, Math.floor(Math.min(viewW / g.cols, viewH / g.rows)));
  g.tile = tile;
  g.worldW = g.cols * tile;
  g.worldH = g.rows * tile;
  g.offsetX = Math.floor((viewW - g.worldW) / 2);
  g.offsetY = Math.floor((viewH - g.worldH) / 2);
  g.viewW = viewW;
  g.viewH = viewH;
}

export function snapshot(g: Game): Hud {
  return {
    wood: g.wood,
    stone: g.stone,
    hp: g.player.hp,
    maxHp: g.player.maxHp,
    phase: g.phase,
    paused: g.paused,
    night: g.night,
    tool: g.tool,
    banner: g.banner,
    showBanner: g.bannerT > 0,
    status: g.status,
    kills: g.stats.kills,
    placed: g.stats.placed,
    nights: g.stats.nights,
    best: g.best,
    overReason: g.overReason,
    confirmOpen: g.confirmOpen,
    tip: g.tip,
    enemies: g.enemies.length,
    queued: g.spawnQueue.length,
    hideRoofs: g.hideRoofs,
    muted: g.muted,
    stun: g.player.stun,
    gapCount: g.gapCount,
  };
}

export function resetGame(g: Game) {
  const prev = g.input;
  const muted = g.muted;
  const reduceMotion = g.reduceMotion;
  const best = Math.max(g.best, g.stats.nights);
  const fresh = createGame(best);
  Object.assign(g, fresh);
  g.input.up = prev.up;
  g.input.down = prev.down;
  g.input.left = prev.left;
  g.input.right = prev.right;
  g.input.primary = prev.primary;
  g.input.secondary = prev.secondary;
  g.input.shoot = prev.shoot;
  g.input.repair = prev.repair;
  g.input.gather = prev.gather;
  g.input.pointerX = prev.pointerX;
  g.input.pointerY = prev.pointerY;
  g.input.pointerInside = prev.pointerInside;
  g.muted = muted;
  g.reduceMotion = reduceMotion;
  g.phase = "day";
  g.banner = "A new plot. Chop, build, and defend it when you're ready.";
  g.bannerT = 4;
}

function idx(g: Game, c: number, r: number) {
  return r * g.cols + c;
}

function inBounds(g: Game, c: number, r: number) {
  return c >= 0 && r >= 0 && c < g.cols && r < g.rows;
}

function tileAt(g: Game, c: number, r: number): Tile | null {
  if (!inBounds(g, c, r)) return null;
  return g.tiles[idx(g, c, r)];
}

function blocksMove(kind: StructKind | null, forPlayer: boolean) {
  if (!kind || kind === "spike") return false;
  if (kind === "door" && forPlayer) return false;
  return true;
}

function blocksSight(kind: StructKind | null) {
  return kind === "wall" || kind === "stone" || kind === "door" || kind === "window" || kind === "tree" || kind === "rock" || kind === "turret";
}

function isBuilding(kind: StructKind) {
  return kind !== "tree" && kind !== "rock";
}

export function findBed(g: Game): { c: number; r: number } | null {
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      if (g.tiles[idx(g, c, r)].struct?.kind === "bed") return { c, r };
    }
  }
  return null;
}

function exposedFromEdge(g: Game, bed: { c: number; r: number } | null) {
  const seen = new Uint8Array(g.cols * g.rows);
  const queue: number[] = [];
  const push = (c: number, r: number) => {
    if (!inBounds(g, c, r)) return;
    const i = idx(g, c, r);
    if (seen[i]) return;
    if (bed && c === bed.c && r === bed.r) {
      seen[i] = 1;
      queue.push(i);
      return;
    }
    const struct = g.tiles[i].struct;
    if (struct && struct.kind !== "spike") return;
    seen[i] = 1;
    queue.push(i);
  };
  for (let c = 0; c < g.cols; c++) {
    push(c, 0);
    push(c, g.rows - 1);
  }
  for (let r = 0; r < g.rows; r++) {
    push(0, r);
    push(g.cols - 1, r);
  }
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q];
    const c = i % g.cols;
    const r = Math.floor(i / g.cols);
    push(c + 1, r);
    push(c - 1, r);
    push(c, r + 1);
    push(c, r - 1);
  }
  return seen;
}

export function openEdgeTiles(g: Game) {
  const bed = findBed(g);
  const hasHouse = bed !== null || g.tiles.some((tile) => tile.floor);
  if (!hasHouse) return [] as { c: number; r: number }[];
  const exposed = exposedFromEdge(g, bed);
  const gaps: { c: number; r: number }[] = [];
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const i = idx(g, c, r);
      if (!exposed[i]) continue;
      const tile = g.tiles[i];
      if (tile.floor) continue;
      if (tile.struct && tile.struct.kind !== "spike") continue;
      let touches = false;
      for (const [dc, dr] of DIRS) {
        const next = tileAt(g, c + dc, r + dr);
        if (!next) continue;
        if (next.floor || next.struct?.kind === "bed") touches = true;
      }
      if (touches) gaps.push({ c, r });
    }
  }
  return gaps;
}

export function bedIsEnclosed(g: Game, bedC: number, bedR: number) {
  if (bedC === 0 || bedR === 0 || bedC === g.cols - 1 || bedR === g.rows - 1) return false;
  const seen = exposedFromEdge(g, { c: bedC, r: bedR });
  return seen[idx(g, bedC, bedR)] === 0;
}

export function analyzeHouse(g: Game): HouseStatus {
  let floorCount = 0;
  let roofCount = 0;
  let bed: { c: number; r: number } | null = null;
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const tile = g.tiles[idx(g, c, r)];
      if (tile.floor) {
        floorCount += 1;
        if (tile.roof) roofCount += 1;
      }
      if (tile.struct?.kind === "bed") bed = { c, r };
    }
  }
  const bedRoof = bed ? g.tiles[idx(g, bed.c, bed.r)].roof : false;
  const floors = floorCount >= 6;
  const roof = Boolean(bed && bedRoof && floorCount > 0 && roofCount / floorCount >= 0.6);
  const closed = bed ? bedIsEnclosed(g, bed.c, bed.r) : false;
  return {
    bed: Boolean(bed),
    floors,
    floorCount,
    roof,
    roofCount,
    closed,
    ready: Boolean(bed) && floors && roof && closed,
  };
}

function say(g: Game, text: string, seconds = 1.6) {
  g.banner = text;
  g.bannerT = seconds;
}

function burst(g: Game, x: number, y: number, color: string, count: number, speed = 1.6) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = speed * (0.35 + Math.random());
    g.particles.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      life: 0.35 + Math.random() * 0.3,
      max: 0.65,
      color,
      size: 0.08 + Math.random() * 0.08,
    });
  }
  if (g.particles.length > 420) g.particles.splice(0, g.particles.length - 420);
}

function floatText(g: Game, x: number, y: number, text: string, color: string) {
  g.particles.push({
    x,
    y,
    vx: 0,
    vy: -0.55,
    life: 0.8,
    max: 0.8,
    color,
    size: 0.3,
    text,
  });
}

function updateTip(g: Game) {
  const status = g.status;
  if (g.phase === "night") {
    g.tip = "Left click or Space shoots. Right click builds. F repairs. Keep them off the bed.";
    return;
  }
  if (g.phase === "dawn") {
    g.tip = "They're gone. Patch holes, then start the next night when you're ready.";
    return;
  }
  if (g.phase !== "day") {
    g.tip = "Build a house. When you're ready, other people come for it.";
    return;
  }
  if (g.wood < 1 && status.floorCount === 0 && !status.bed) {
    g.tip = "Walk up to a tree and chop it. Press E, or left click with the axe.";
    return;
  }
  if (status.floorCount < 6) {
    g.tip = g.wood < 1
      ? "Out of wood. Walk up to a tree and press E."
      : "Select Floor (2) and paint a room on the chalk square. Six floors make a house.";
    return;
  }
  if (!status.closed) {
    g.tip = g.wood < 1
      ? "Out of wood. Walk up to a tree and press E, then cover every red tile."
      : "Red tiles are open. Put a wood wall (3) or a door (5) on every red tile.";
    return;
  }
  if (!status.roof || !status.bed) {
    g.tip = "Roof the floors (7) and put a bed inside (8). The bed is what they come for.";
    return;
  }
  g.tip = "The house is ready. Press I'm ready when you want to defend it.";
}

function consumeEdges(input: Input) {
  input.primaryPressed = false;
  input.secondaryPressed = false;
  input.repairPressed = false;
  input.removePressed = false;
  input.defendPressed = false;
  input.confirmDefend = false;
  input.cancelDefend = false;
  input.start = false;
  input.restart = false;
  input.pausePressed = false;
  input.tool = null;
  input.hideRoofsPressed = false;
  input.mutePressed = false;
}

function hoverOf(g: Game) {
  if (!g.input.pointerInside) return null;
  const c = Math.floor(g.input.pointerX);
  const r = Math.floor(g.input.pointerY);
  if (!inBounds(g, c, r)) return null;
  return { c, r };
}

function distToCell(x: number, y: number, c: number, r: number) {
  return Math.hypot(x - (c + 0.5), y - (r + 0.5));
}

function occupiedByActor(g: Game, c: number, r: number) {
  const actors = [g.player, ...g.enemies];
  for (const actor of actors) {
    if (actor.hp <= 0) continue;
    const hit = circleHitsRect(actor.x, actor.y, actor.radius * 0.85, c, r, c + 1, r + 1);
    if (hit) return true;
  }
  return false;
}

function circleHitsRect(x: number, y: number, radius: number, left: number, top: number, right: number, bottom: number) {
  const cx = Math.max(left, Math.min(x, right));
  const cy = Math.max(top, Math.min(y, bottom));
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy < radius * radius;
}

export function placeResult(g: Game, c: number, r: number, tool: ToolId): { ok: boolean; reason: string } {
  const tile = tileAt(g, c, r);
  if (!tile) return { ok: false, reason: "That's off the plot." };
  if (distToCell(g.player.x, g.player.y, c, r) > BUILD_REACH) {
    return { ok: false, reason: "Too far. Step closer." };
  }
  const cost = TOOL_BY_ID[tool];
  if (g.wood < cost.wood || g.stone < cost.stone) {
    const need: string[] = [];
    if (g.wood < cost.wood) need.push(`${cost.wood - g.wood} more wood`);
    if (g.stone < cost.stone) need.push(`${cost.stone - g.stone} more stone`);
    return { ok: false, reason: `Need ${need.join(" and ")}.` };
  }
  if (tool === "floor") {
    if (tile.floor) return { ok: false, reason: "Already a floor." };
    if (tile.struct) return { ok: false, reason: "Clear that first." };
    return { ok: true, reason: "" };
  }
  if (tool === "roof") {
    if (!tile.floor) return { ok: false, reason: "Roofs sit on floors." };
    if (tile.roof) return { ok: false, reason: "Already roofed." };
    if (tile.struct && (tile.struct.kind === "tree" || tile.struct.kind === "rock")) {
      return { ok: false, reason: "Clear that first." };
    }
    return { ok: true, reason: "" };
  }
  const kind = tool as StructKind;
  if (tile.struct) return { ok: false, reason: "Something is already there." };
  if ((kind === "bed" || kind === "turret") && !tile.floor) {
    return { ok: false, reason: "Put a floor down first." };
  }
  if (occupiedByActor(g, c, r)) return { ok: false, reason: "Someone is standing there." };
  return { ok: true, reason: "" };
}

function refundOf(kind: "floor" | "roof" | StructKind): { wood: number; stone: number } {
  if (kind === "floor") return { wood: 1, stone: 0 };
  if (kind === "roof") return { wood: 1, stone: 0 };
  const tool = TOOL_BY_ID[kind as ToolId];
  if (!tool) return { wood: 0, stone: 0 };
  return { wood: tool.wood, stone: tool.stone };
}

function tryPlace(g: Game, pressed: boolean) {
  const hover = hoverOf(g);
  if (!hover) return;
  const { c, r } = hover;
  if (!pressed && !DRAG_TOOLS.has(g.tool)) return;
  if (!pressed && g.lastPlaceC === c && g.lastPlaceR === r) return;
  const tool = g.tool;
  if (tool === "axe") return;
  const result = placeResult(g, c, r, tool);
  if (!result.ok) {
    if (pressed) say(g, result.reason);
    return;
  }
  const cost = TOOL_BY_ID[tool];
  g.wood -= cost.wood;
  g.stone -= cost.stone;
  const tile = g.tiles[idx(g, c, r)];
  if (tool === "floor") tile.floor = true;
  else if (tool === "roof") tile.roof = true;
  else {
    if (tool === "bed") {
      const old = findBed(g);
      if (old) {
        const refund = refundOf("bed");
        g.wood += refund.wood;
        g.stone += refund.stone;
        g.tiles[idx(g, old.c, old.r)].struct = null;
      }
    }
    tile.struct = makeStruct(tool as StructKind);
  }
  g.stats.placed += 1;
  g.lastPlaceC = c;
  g.lastPlaceR = r;
  g.events.push("place");
  burst(g, c + 0.5, r + 0.5, tool === "stone" ? "#c5ced6" : "#e0b070", 6, 1.1);
}

function tryRemove(g: Game) {
  const hover = hoverOf(g);
  if (!hover) return;
  const tile = g.tiles[idx(g, hover.c, hover.r)];
  if (distToCell(g.player.x, g.player.y, hover.c, hover.r) > BUILD_REACH) {
    say(g, "Too far. Step closer.");
    return;
  }
  if (tile.roof) {
    tile.roof = false;
    const refund = refundOf("roof");
    g.wood += refund.wood;
    g.stone += refund.stone;
    g.events.push("remove");
    return;
  }
  if (tile.struct && isBuilding(tile.struct.kind)) {
    const refund = refundOf(tile.struct.kind);
    g.wood += refund.wood;
    g.stone += refund.stone;
    tile.struct = null;
    g.events.push("remove");
    return;
  }
  if (tile.floor && !tile.struct) {
    tile.floor = false;
    const refund = refundOf("floor");
    g.wood += refund.wood;
    g.stone += refund.stone;
    g.events.push("remove");
    return;
  }
  if (g.input.removePressed || g.input.secondaryPressed) say(g, "Nothing of yours to take back.");
}

function nearestResource(g: Game) {
  let best: { c: number; r: number; d: number } | null = null;
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const kind = g.tiles[idx(g, c, r)].struct?.kind;
      if (kind !== "tree" && kind !== "rock") continue;
      const d = distToCell(g.player.x, g.player.y, c, r);
      if (d > CHOP_REACH) continue;
      if (!best || d < best.d) best = { c, r, d };
    }
  }
  return best;
}

function tryChop(g: Game) {
  if (g.chopT > 0 || g.player.stun > 0) return;
  const hover = hoverOf(g);
  let target: { c: number; r: number } | null = null;
  if (hover) {
    const kind = g.tiles[idx(g, hover.c, hover.r)].struct?.kind;
    if ((kind === "tree" || kind === "rock") && distToCell(g.player.x, g.player.y, hover.c, hover.r) <= CHOP_REACH) {
      target = hover;
    }
  }
  if (!target) {
    const near = nearestResource(g);
    if (near) target = near;
  }
  if (!target) {
    if (g.input.primaryPressed) say(g, "Get closer to a tree or a rock.");
    return;
  }
  const tile = g.tiles[idx(g, target.c, target.r)];
  const struct = tile.struct;
  if (!struct) return;
  g.chopT = 0.3;
  struct.hp -= 12;
  struct.flash = 0.1;
  g.player.facing = Math.atan2(target.r + 0.5 - g.player.y, target.c + 0.5 - g.player.x);
  g.player.attack = 0.18;
  if (struct.kind === "tree") {
    g.wood += 2;
    burst(g, target.c + 0.5, target.r + 0.35, "#6b442c", 7, 1.4);
    floatText(g, target.c + 0.5, target.r, "+2 wood", "#f0d7a4");
  } else {
    g.stone += 2;
    burst(g, target.c + 0.5, target.r + 0.4, "#b7c0c6", 7, 1.3);
    floatText(g, target.c + 0.5, target.r, "+2 stone", "#e4e8ec");
  }
  g.events.push("chop");
  if (struct.hp <= 0) tile.struct = null;
}

function tryRepair(g: Game) {
  if (g.repairT > 0) return;
  let best: { c: number; r: number; d: number; struct: Structure } | null = null;
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const struct = g.tiles[idx(g, c, r)].struct;
      if (!struct || !isBuilding(struct.kind) || struct.hp >= struct.maxHp) continue;
      const d = distToCell(g.player.x, g.player.y, c, r);
      if (d > REPAIR_REACH) continue;
      if (!best || d < best.d) best = { c, r, d, struct };
    }
  }
  if (!best) {
    if (g.input.repairPressed) say(g, "No damaged walls in reach.");
    return;
  }
  if (g.wood < 1) {
    if (g.input.repairPressed) say(g, "Repair costs 1 wood.");
    return;
  }
  g.wood -= 1;
  best.struct.hp = Math.min(best.struct.maxHp, best.struct.hp + 48);
  best.struct.flash = 0.12;
  g.repairT = 0.22;
  g.events.push("repair");
  floatText(g, best.c + 0.5, best.r, "+repair", "#b7e3a1");
  burst(g, best.c + 0.5, best.r + 0.4, "#d7b27a", 5, 1);
}

function tryShoot(g: Game) {
  if (g.shootT > 0 || g.player.stun > 0) return;
  if (g.phase !== "night" && g.phase !== "dawn") return;
  const angle = g.player.facing;
  const speed = 12;
  g.shots.push({
    x: g.player.x + Math.cos(angle) * 0.45,
    y: g.player.y + Math.sin(angle) * 0.45,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    damage: 22,
    friendly: true,
    life: 1.05,
    kind: "arrow",
  });
  g.shootT = 0.28;
  g.player.attack = 0.12;
  g.events.push("shoot");
}

function moveActor(g: Game, actor: Actor, dx: number, dy: number, forPlayer: boolean) {
  actor.x += dx;
  actor.y += dy;
  resolveCircle(g, actor, forPlayer);
}

function resolveCircle(g: Game, actor: Actor, forPlayer: boolean) {
  actor.x = Math.max(actor.radius, Math.min(g.cols - actor.radius, actor.x));
  actor.y = Math.max(actor.radius, Math.min(g.rows - actor.radius, actor.y));
  for (let pass = 0; pass < 3; pass++) {
    const c0 = Math.floor(actor.x - actor.radius);
    const c1 = Math.floor(actor.x + actor.radius);
    const r0 = Math.floor(actor.y - actor.radius);
    const r1 = Math.floor(actor.y + actor.radius);
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (!inBounds(g, c, r)) continue;
        const kind = g.tiles[idx(g, c, r)].struct?.kind ?? null;
        if (!blocksMove(kind, forPlayer)) continue;
        const left = c;
        const top = r;
        const right = c + 1;
        const bottom = r + 1;
        const closestX = Math.max(left, Math.min(actor.x, right));
        const closestY = Math.max(top, Math.min(actor.y, bottom));
        let dx = actor.x - closestX;
        let dy = actor.y - closestY;
        let d2 = dx * dx + dy * dy;
        if (d2 >= actor.radius * actor.radius) continue;
        if (d2 === 0) {
          dy = -1;
          dx = 0;
          d2 = 1;
        }
        const d = Math.sqrt(d2);
        const push = actor.radius - d + 0.001;
        actor.x += (dx / d) * push;
        actor.y += (dy / d) * push;
      }
    }
  }
}

function updatePlayer(g: Game, dt: number) {
  const player = g.player;
  player.cooldown = Math.max(0, player.cooldown - dt);
  player.iframe = Math.max(0, player.iframe - dt);
  player.flash = Math.max(0, player.flash - dt);
  player.attack = Math.max(0, player.attack - dt);
  player.stun = Math.max(0, player.stun - dt);
  if (player.stun > 0) return;

  let x = (g.input.right ? 1 : 0) - (g.input.left ? 1 : 0);
  let y = (g.input.down ? 1 : 0) - (g.input.up ? 1 : 0);
  const moving = x !== 0 || y !== 0;
  if (moving) {
    const len = Math.hypot(x, y) || 1;
    x /= len;
    y /= len;
    const slow = player.slow > 0 ? 0.55 : 1;
    moveActor(g, player, x * PLAYER_SPEED * slow * dt, y * PLAYER_SPEED * slow * dt, true);
    player.anim += dt * 10;
    if (!g.input.pointerInside) player.facing = Math.atan2(y, x);
  }
  player.slow = Math.max(0, player.slow - dt);
  if (g.input.pointerInside) {
    player.facing = Math.atan2(g.input.pointerY - player.y, g.input.pointerX - player.x);
  }
  if (g.phase === "day") {
    player.hp = Math.min(player.maxHp, player.hp + dt * 8);
  }
}

function stepCost(kind: StructKind | null) {
  if (!kind || kind === "spike") return 1;
  if (kind === "tree" || kind === "rock") return 40;
  if (kind === "door") return 2;
  if (kind === "window") return 3;
  if (kind === "wall") return 8;
  if (kind === "turret") return 10;
  if (kind === "stone") return 14;
  if (kind === "bed") return 2;
  return 8;
}

function findPath(g: Game, fromC: number, fromR: number, goals: Set<string>) {
  if (!inBounds(g, fromC, fromR)) return [] as { c: number; r: number }[];
  const total = g.cols * g.rows;
  const key = (c: number, r: number) => r * g.cols + c;
  const dist = new Float64Array(total);
  dist.fill(Number.POSITIVE_INFINITY);
  const prev = new Int16Array(total);
  prev.fill(-1);
  const goalSet = new Uint8Array(total);
  for (const goal of goals) {
    const comma = goal.indexOf(",");
    const c = Number(goal.slice(0, comma));
    const r = Number(goal.slice(comma + 1));
    if (inBounds(g, c, r)) goalSet[key(c, r)] = 1;
  }
  const start = key(fromC, fromR);
  dist[start] = 0;
  const heap: number[] = [start];
  const heapD: number[] = [0];
  const swap = (a: number, b: number) => {
    const node = heap[a];
    heap[a] = heap[b];
    heap[b] = node;
    const weight = heapD[a];
    heapD[a] = heapD[b];
    heapD[b] = weight;
  };
  const push = (node: number, weight: number) => {
    heap.push(node);
    heapD.push(weight);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heapD[parent] <= heapD[i]) break;
      swap(parent, i);
      i = parent;
    }
  };
  const pop = () => {
    const node = heap[0];
    const weight = heapD[0];
    const last = heap.pop();
    const lastW = heapD.pop();
    if (heap.length > 0 && last !== undefined && lastW !== undefined) {
      heap[0] = last;
      heapD[0] = lastW;
      let i = 0;
      while (true) {
        let smallest = i;
        const left = i * 2 + 1;
        const right = left + 1;
        if (left < heap.length && heapD[left] < heapD[smallest]) smallest = left;
        if (right < heap.length && heapD[right] < heapD[smallest]) smallest = right;
        if (smallest === i) break;
        swap(i, smallest);
        i = smallest;
      }
    }
    return { node, weight };
  };

  let found = -1;
  while (heap.length > 0) {
    const { node, weight } = pop();
    if (weight !== dist[node]) continue;
    if (goalSet[node] && node !== start) {
      found = node;
      break;
    }
    const c = node % g.cols;
    const r = Math.floor(node / g.cols);
    for (const [dc, dr] of DIRS) {
      const nc = c + dc;
      const nr = r + dr;
      if (!inBounds(g, nc, nr)) continue;
      const next = key(nc, nr);
      const kind = g.tiles[next].struct?.kind ?? null;
      const nd = weight + stepCost(kind);
      if (nd < dist[next]) {
        dist[next] = nd;
        prev[next] = node;
        push(next, nd);
      }
    }
  }
  if (found === -1 || found === start) return [];
  const path: { c: number; r: number }[] = [];
  let cur = found;
  let guard = 0;
  while (cur !== start && cur !== -1 && guard < total) {
    path.push({ c: cur % g.cols, r: Math.floor(cur / g.cols) });
    cur = prev[cur];
    guard += 1;
  }
  path.reverse();
  return path;
}

function hasLineOfSight(g: Game, x0: number, y0: number, x1: number, y1: number) {
  let c = Math.floor(x0);
  let r = Math.floor(y0);
  const gc = Math.floor(x1);
  const gr = Math.floor(y1);
  const dx = Math.abs(gc - c);
  const dy = Math.abs(gr - r);
  const sx = gc >= c ? 1 : -1;
  const sy = gr >= r ? 1 : -1;
  let err = dx - dy;
  while (c !== gc || r !== gr) {
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      c += sx;
    }
    if (e2 < dx) {
      err += dx;
      r += sy;
    }
    if (c === gc && r === gr) return true;
    const kind = tileAt(g, c, r)?.struct?.kind ?? null;
    if (blocksSight(kind)) return false;
  }
  return true;
}

function cellFree(g: Game, c: number, r: number) {
  const kind = tileAt(g, c, r)?.struct?.kind ?? null;
  return blocksMove(kind, false) === false && inBounds(g, c, r);
}

function enemyGoals(g: Game): Set<string> {
  const bed = findBed(g);
  const goals = new Set<string>();
  if (!bed) {
    goals.add(`${Math.floor(g.player.x)},${Math.floor(g.player.y)}`);
    return goals;
  }
  const around = [
    [bed.c + 1, bed.r],
    [bed.c - 1, bed.r],
    [bed.c, bed.r + 1],
    [bed.c, bed.r - 1],
    [bed.c, bed.r],
  ];
  const open = around.filter(([c, r]) => inBounds(g, c, r) && cellFree(g, c, r) && !(c === bed.c && r === bed.r));
  const chosen = open.length > 0 ? open : around.filter(([c, r]) => inBounds(g, c, r));
  for (const [c, r] of chosen) goals.add(`${c},${r}`);
  return goals;
}

function hurtPlayer(g: Game, amount: number) {
  const player = g.player;
  if (player.iframe > 0 || player.stun > 0 || g.phase === "gameover") return;
  player.hp -= amount;
  player.iframe = 0.6;
  player.flash = 0.16;
  g.shake = Math.max(g.shake, 5);
  g.events.push("hurt");
  floatText(g, player.x, player.y - 0.4, `-${amount}`, "#ffb4a8");
  if (player.hp <= 0) {
    player.hp = 36;
    player.stun = 3.4;
    g.blackouts += 1;
    say(g, "You're down. Get up before they reach the bed.", 2.2);
    burst(g, player.x, player.y, "#f0c7a0", 8, 1.2);
  }
}

function destroyStructure(g: Game, c: number, r: number, struct: Structure) {
  const tile = g.tiles[idx(g, c, r)];
  tile.struct = null;
  g.events.push("break");
  burst(g, c + 0.5, r + 0.45, "#e7d3b0", 12, 1.8);
  if (struct.kind === "tree") g.wood += 1;
  if (struct.kind === "rock") g.stone += 1;
  if (struct.kind === "bed") endGame(g, "They broke in and took your house.");
}

function damageStructure(g: Game, c: number, r: number, amount: number) {
  const struct = tileAt(g, c, r)?.struct;
  if (!struct || struct.kind === "spike") return;
  struct.hp -= amount;
  struct.flash = 0.14;
  floatText(g, c + 0.5, r + 0.2, `-${amount}`, "#ffd0c2");
  g.events.push("hit");
  if (struct.hp <= 0) destroyStructure(g, c, r, struct);
}

function attackStructure(g: Game, enemy: Actor, c: number, r: number) {
  if (enemy.cooldown > 0) return;
  const struct = tileAt(g, c, r)?.struct;
  if (!struct || struct.kind === "spike") return;
  const stats = ENEMIES[enemy.kind as EnemyKind];
  enemy.cooldown = stats.windup;
  enemy.attack = 0.22;
  enemy.facing = Math.atan2(r + 0.5 - enemy.y, c + 0.5 - enemy.x);
  damageStructure(g, c, r, stats.structure);
}

function separateEnemies(g: Game) {
  const actors = g.enemies;
  for (let i = 0; i < actors.length; i++) {
    for (let j = i + 1; j < actors.length; j++) {
      const a = actors[i];
      const b = actors[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const min = a.radius + b.radius;
      const d2 = dx * dx + dy * dy;
      if (d2 === 0) {
        dx = 0.01;
        dy = 0;
      }
      const d = Math.sqrt(d2);
      if (d >= min) continue;
      const push = (min - d) / 2;
      const nx = dx / d;
      const ny = dy / d;
      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;
    }
  }
  for (const enemy of actors) resolveCircle(g, enemy, false);
}

function updateEnemy(g: Game, enemy: Actor, dt: number, goals: Set<string>) {
  const stats = ENEMIES[enemy.kind as EnemyKind];
  enemy.cooldown = Math.max(0, enemy.cooldown - dt);
  enemy.flash = Math.max(0, enemy.flash - dt);
  enemy.attack = Math.max(0, enemy.attack - dt);
  enemy.spikeT = Math.max(0, enemy.spikeT - dt);
  enemy.slow = Math.max(0, enemy.slow - dt);
  enemy.pathAge += dt;

  const hereC = Math.floor(enemy.x);
  const hereR = Math.floor(enemy.y);
  const here = tileAt(g, hereC, hereR)?.struct;
  if (here?.kind === "spike") {
    enemy.slow = 0.28;
    if (enemy.spikeT <= 0) {
      enemy.hp -= 14;
      enemy.spikeT = 0.42;
      here.hp -= 6;
      here.flash = 0.1;
      burst(g, enemy.x, enemy.y, "#d7d3cc", 4, 1.2);
      floatText(g, enemy.x, enemy.y - 0.3, "-14", "#f4efe4");
      if (here.hp <= 0) destroyStructure(g, hereC, hereR, here);
    }
  }

  const bed = findBed(g);
  const targetX = bed ? bed.c + 0.5 : g.player.x;
  const targetY = bed ? bed.r + 0.5 : g.player.y;
  const distPlayer = Math.hypot(enemy.x - g.player.x, enemy.y - g.player.y);

  if (enemy.kind === "thrower" && enemy.cooldown <= 0) {
    const distBed = Math.hypot(enemy.x - targetX, enemy.y - targetY);
    const seeBed = bed ? hasLineOfSight(g, enemy.x, enemy.y, targetX, targetY) : false;
    const seePlayer = hasLineOfSight(g, enemy.x, enemy.y, g.player.x, g.player.y);
    if (seeBed && distBed < stats.range && distBed > 2.2) {
      throwTorch(g, enemy, targetX, targetY);
    } else if (seePlayer && distPlayer < 4.6 && distPlayer > 1.8) {
      throwTorch(g, enemy, g.player.x, g.player.y);
    }
  }

  if (distPlayer < enemy.radius + g.player.radius + 0.08 && enemy.kind !== "thrower") {
    enemy.facing = Math.atan2(g.player.y - enemy.y, g.player.x - enemy.x);
    if (enemy.cooldown <= 0) {
      enemy.cooldown = stats.windup;
      enemy.attack = 0.2;
      hurtPlayer(g, stats.player);
    }
  }

  if (enemy.kind !== "thrower" && goals.has(`${hereC},${hereR}`)) {
    enemy.path = [];
    strikeBedIfClose(g, enemy);
    return;
  }

  const needsPath = enemy.path.length === 0 ? enemy.pathAge > 0.4 : enemy.pathAge > 0.55;
  if (needsPath) {
    enemy.path = findPath(g, hereC, hereR, goals);
    enemy.pathAge = 0;
  }

  const next = enemy.path[0];
  if (!next) {
    strikeBedIfClose(g, enemy);
    return;
  }
  if (!cellFree(g, next.c, next.r)) {
    attackStructure(g, enemy, next.c, next.r);
    enemy.pathAge = 1;
    return;
  }
  const tx = next.c + 0.5;
  const ty = next.r + 0.5;
  const dx = tx - enemy.x;
  const dy = ty - enemy.y;
  const d = Math.hypot(dx, dy) || 0.0001;
  if (d < 0.12) {
    enemy.path.shift();
    strikeBedIfClose(g, enemy);
    return;
  }
  const speed = stats.speed * (enemy.slow > 0 ? 0.55 : 1);
  enemy.facing = Math.atan2(dy, dx);
  enemy.anim += dt * 8;
  moveActor(g, enemy, (dx / d) * speed * dt, (dy / d) * speed * dt, false);
  strikeBedIfClose(g, enemy);
}

function strikeBedIfClose(g: Game, enemy: Actor) {
  const bed = findBed(g);
  if (!bed || enemy.kind === "thrower") return;
  const dx = Math.abs(enemy.x - (bed.c + 0.5));
  const dy = Math.abs(enemy.y - (bed.r + 0.5));
  const beside = (dx < 0.9 && dy < 1.25) || (dy < 0.9 && dx < 1.25);
  if (!beside) return;
  if (Math.hypot(enemy.x - (bed.c + 0.5), enemy.y - (bed.r + 0.5)) > 1.25) return;
  attackStructure(g, enemy, bed.c, bed.r);
}

function throwTorch(g: Game, enemy: Actor, x: number, y: number) {
  const stats = ENEMIES.thrower;
  const angle = Math.atan2(y - enemy.y, x - enemy.x);
  const speed = 6.2;
  enemy.facing = angle;
  enemy.cooldown = stats.windup;
  enemy.attack = 0.2;
  g.shots.push({
    x: enemy.x + Math.cos(angle) * 0.4,
    y: enemy.y + Math.sin(angle) * 0.4,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    damage: stats.structure,
    friendly: false,
    life: 1.35,
    kind: "torch",
  });
  g.events.push("shoot");
}

function updateShots(g: Game, dt: number) {
  for (const shot of g.shots) {
    shot.life -= dt;
    const steps = 3;
    for (let s = 0; s < steps; s++) {
      shot.x += (shot.vx * dt) / steps;
      shot.y += (shot.vy * dt) / steps;
      if (shot.x < 0 || shot.y < 0 || shot.x >= g.cols || shot.y >= g.rows) {
        shot.life = 0;
        break;
      }
      if (shot.friendly) {
        let hit = false;
        for (const enemy of g.enemies) {
          if (Math.hypot(shot.x - enemy.x, shot.y - enemy.y) <= enemy.radius + 0.08) {
            enemy.hp -= shot.damage;
            enemy.flash = 0.12;
            burst(g, enemy.x, enemy.y, "#ffd0c2", 5, 1.3);
            floatText(g, enemy.x, enemy.y - 0.35, `-${shot.damage}`, "#fff4ea");
            g.events.push("hit");
            shot.life = 0;
            hit = true;
            break;
          }
        }
        if (hit) break;
      } else {
        const playerHit = Math.hypot(shot.x - g.player.x, shot.y - g.player.y) <= g.player.radius + 0.05;
        if (playerHit) {
          hurtPlayer(g, ENEMIES.thrower.player);
          shot.life = 0;
          break;
        }
        const c = Math.floor(shot.x);
        const r = Math.floor(shot.y);
        const kind = tileAt(g, c, r)?.struct?.kind ?? null;
        if (kind && kind !== "spike" && kind !== "tree" && kind !== "rock") {
          damageStructure(g, c, r, shot.damage);
          shot.life = 0;
          break;
        }
        if (kind === "tree" || kind === "rock") {
          shot.life = 0;
          burst(g, shot.x, shot.y, "#ff9a3c", 4, 0.8);
          break;
        }
      }
    }
  }
  g.shots = g.shots.filter((shot) => shot.life > 0);
}

function defeatEnemy(g: Game, enemy: Actor) {
  g.stats.kills += 1;
  g.waveKills += 1;
  burst(g, enemy.x, enemy.y, "#c9b2a6", 10, 1.6);
  g.events.push("break");
}

function updateTurrets(g: Game, dt: number) {
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const struct = g.tiles[idx(g, c, r)].struct;
      if (struct?.kind !== "turret") continue;
      struct.cooldown -= dt;
      let nearest: Actor | null = null;
      let best = 5.6;
      for (const enemy of g.enemies) {
        const d = Math.hypot(enemy.x - (c + 0.5), enemy.y - (r + 0.5));
        if (d < best && hasLineOfSight(g, c + 0.5, r + 0.5, enemy.x, enemy.y)) {
          best = d;
          nearest = enemy;
        }
      }
      if (nearest) {
        struct.aim = Math.atan2(nearest.y - (r + 0.5), nearest.x - (c + 0.5));
        if (struct.cooldown <= 0) {
          struct.cooldown = 0.82;
          const speed = 10;
          g.shots.push({
            x: c + 0.5 + Math.cos(struct.aim) * 0.35,
            y: r + 0.5 + Math.sin(struct.aim) * 0.35,
            vx: Math.cos(struct.aim) * speed,
            vy: Math.sin(struct.aim) * speed,
            damage: 14,
            friendly: true,
            life: 0.9,
            kind: "arrow",
          });
          g.events.push("shoot");
        }
      }
    }
  }
}

function pickSpawn(g: Game) {
  const options: { c: number; r: number }[] = [];
  for (let c = 0; c < g.cols; c++) {
    options.push({ c, r: 0 }, { c, r: g.rows - 1 });
  }
  for (let r = 1; r < g.rows - 1; r++) {
    options.push({ c: 0, r }, { c: g.cols - 1, r });
  }
  const open = options.filter((spot) => {
    if (!cellFree(g, spot.c, spot.r)) return false;
    return distToCell(g.player.x, g.player.y, spot.c, spot.r) > 4;
  });
  const pool = open.length > 0 ? open : options;
  const spot = pool[Math.floor(Math.random() * pool.length)];
  const tile = g.tiles[idx(g, spot.c, spot.r)];
  if (tile.struct && (tile.struct.kind === "tree" || tile.struct.kind === "rock")) tile.struct = null;
  return spot;
}

function spawnEnemy(g: Game, kind: EnemyKind) {
  const stats = ENEMIES[kind];
  const spot = pickSpawn(g);
  const enemy: Actor = {
    id: g.nextId++,
    kind,
    x: spot.c + 0.5,
    y: spot.r + 0.5,
    hp: stats.hp,
    maxHp: stats.hp,
    radius: stats.radius,
    facing: Math.atan2(g.player.y - (spot.r + 0.5), g.player.x - (spot.c + 0.5)),
    cooldown: 0.45,
    stun: 0,
    iframe: 0,
    flash: 0,
    anim: 0,
    path: [],
    pathAge: 10,
    slow: 0,
    spikeT: 0,
    attack: 0,
  };
  g.enemies.push(enemy);
  burst(g, enemy.x, enemy.y, "#ffb089", 8, 1.2);
}

function beginNight(g: Game) {
  g.confirmOpen = false;
  g.phase = "night";
  g.night += 1;
  g.spawnQueue = waveFor(g.night);
  g.spawnT = 1.15;
  g.waveKills = 0;
  g.blackouts = 0;
  const count = g.spawnQueue.length;
  say(g, `Night ${g.night}. ${count} ${count === 1 ? "person is" : "people are"} coming for your house.`, 3.4);
  g.events.push("wave");
}

function startDawn(g: Game) {
  g.phase = "dawn";
  g.dawnT = 4.4;
  g.stats.nights = g.night;
  g.best = Math.max(g.best, g.stats.nights);
  const wood = 4 + g.night * 2 + g.waveKills;
  const stone = 1 + Math.floor(g.night / 1) + Math.floor(g.waveKills / 2);
  g.wood += wood;
  g.stone += stone;
  g.player.hp = g.player.maxHp;
  g.player.stun = 0;
  g.blackouts = 0;
  say(g, `You held the house. Night ${g.night} is over. +${wood} wood, +${stone} stone.`, 4);
  g.events.push("dawn");
  regrow(g);
}

function regrow(g: Game) {
  const spots: { c: number; r: number }[] = [];
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      const dist = Math.max(Math.abs(c - 11), Math.abs(r - 7));
      if (dist < 5) continue;
      const tile = g.tiles[idx(g, c, r)];
      if (tile.struct || tile.floor) continue;
      if (distToCell(g.player.x, g.player.y, c, r) < 3) continue;
      spots.push({ c, r });
    }
  }
  const count = Math.min(spots.length, 2 + Math.floor(g.night / 2));
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * spots.length);
    const [spot] = spots.splice(pick, 1);
    if (!spot) break;
    const kind = i === 0 && g.night % 2 === 0 ? "rock" : "tree";
    g.tiles[idx(g, spot.c, spot.r)].struct = makeStruct(kind);
  }
}

function endGame(g: Game, reason: string) {
  if (g.phase === "gameover") return;
  g.phase = "gameover";
  g.confirmOpen = false;
  g.paused = false;
  g.overReason = reason;
  g.best = Math.max(g.best, g.stats.nights);
  g.banner = reason;
  g.bannerT = 6;
  g.events.push("over");
  g.shake = Math.max(g.shake, 8);
}

function handleBuildInput(g: Game) {
  const nightish = g.phase === "night" || g.phase === "dawn";
  const placePressed = g.phase === "day" ? g.input.primaryPressed : g.input.secondaryPressed;
  const placeHeld = g.phase === "day" ? g.input.primary : g.input.secondary;
  const hover = hoverOf(g);
  const hoverKind = hover ? g.tiles[idx(g, hover.c, hover.r)].struct?.kind : null;
  const clickingResource =
    g.phase === "day" &&
    (hoverKind === "tree" || hoverKind === "rock") &&
    (g.input.primary || g.input.primaryPressed);
  const wantChop =
    g.player.stun <= 0 &&
    (g.input.gather || clickingResource || (g.phase === "day" && g.tool === "axe" && (g.input.primary || g.input.primaryPressed)));
  if (wantChop) tryChop(g);
  if (g.tool !== "axe" && (placePressed || (placeHeld && DRAG_TOOLS.has(g.tool)))) {
    tryPlace(g, placePressed);
  }
  if (g.phase === "day" && (g.input.secondaryPressed || g.input.removePressed)) tryRemove(g);
  if (nightish && g.input.removePressed) tryRemove(g);
  if (g.input.repair || g.input.repairPressed) tryRepair(g);
  if (nightish && (g.input.primary || g.input.shoot)) tryShoot(g);
}

function updateParticles(g: Game, dt: number) {
  for (const particle of g.particles) {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += (particle.gravity ?? 0) * dt;
  }
  g.particles = g.particles.filter((particle) => particle.life > 0);
  if ((g.phase === "day" || g.phase === "title") && Math.random() < dt * 1.4) {
    const c = Math.floor(Math.random() * g.cols);
    const r = Math.floor(Math.random() * g.rows);
    if (!g.tiles[idx(g, c, r)].struct) {
      g.particles.push({
        x: c + Math.random(),
        y: r + Math.random(),
        vx: 0.15,
        vy: -0.12,
        life: 2.4,
        max: 2.4,
        color: g.phase === "title" ? "#f4efe4" : "#fff4c2",
        size: 0.05,
      });
    }
  }
}

function updateStructures(g: Game, dt: number) {
  for (const tile of g.tiles) {
    if (!tile.struct) continue;
    if (tile.struct.flash > 0) tile.struct.flash = Math.max(0, tile.struct.flash - dt);
  }
  if ((g.phase === "day" || g.phase === "dawn") && Math.random() < dt * 2) {
    const bed = findBed(g);
    if (bed && g.tiles[idx(g, bed.c, bed.r)].roof) {
      g.particles.push({
        x: bed.c + 0.72,
        y: bed.r + 0.28,
        vx: 0.05,
        vy: -0.28,
        life: 1.1,
        max: 1.1,
        color: "rgba(244,239,228,0.8)",
        size: 0.1,
      });
    }
  }
}

function requestNight(g: Game) {
  g.status = analyzeHouse(g);
  if (!g.status.bed) {
    say(g, "Place a bed first. That's what you're defending.");
    return;
  }
  if (!g.status.ready) {
    g.confirmOpen = true;
    g.events.push("click");
    return;
  }
  beginNight(g);
}

export function step(g: Game, dt: number) {
  const frame = Math.max(0, Math.min(0.05, dt));
  if (g.input.mutePressed) g.muted = !g.muted;
  if (g.input.hideRoofsPressed) g.hideRoofs = !g.hideRoofs;
  if (g.input.tool) g.tool = g.input.tool;

  if (g.input.restart) {
    resetGame(g);
    consumeEdges(g.input);
    g.status = analyzeHouse(g);
    updateTip(g);
    return;
  }

  if (g.input.pausePressed) {
    if (!g.confirmOpen && (g.phase === "day" || g.phase === "night" || g.phase === "dawn")) {
      g.paused = !g.paused;
    }
  }

  if (g.phase === "title") {
    g.time += frame;
    updateParticles(g, frame);
    if (g.input.start) {
      g.phase = "day";
      say(g, "This plot is yours. Chop wood, raise a house, defend it when you're ready.", 4.5);
      g.events.push("click");
    }
    consumeEdges(g.input);
    g.status = analyzeHouse(g);
    updateTip(g);
    return;
  }

  if (g.confirmOpen) {
    if (g.input.cancelDefend || g.input.pausePressed) g.confirmOpen = false;
    if (g.input.confirmDefend) beginNight(g);
  }

  if (g.paused || g.phase === "gameover") {
    if (g.phase === "gameover") g.time += frame * 0.2;
    consumeEdges(g.input);
    return;
  }

  g.time += frame;
  g.bannerT = Math.max(0, g.bannerT - frame);
  g.shake = Math.max(0, g.shake - frame * 16);
  g.chopT = Math.max(0, g.chopT - frame);
  g.repairT = Math.max(0, g.repairT - frame);
  g.shootT = Math.max(0, g.shootT - frame);

  const hover = hoverOf(g);
  g.hoverC = hover?.c ?? -1;
  g.hoverR = hover?.r ?? -1;
  if (hover && g.tool !== "axe") {
    const preview = placeResult(g, hover.c, hover.r, g.tool);
    g.previewOk = preview.ok;
    g.previewReason = preview.reason;
  } else {
    g.previewOk = false;
    g.previewReason = "";
  }

  updatePlayer(g, frame);
  if (!g.confirmOpen) handleBuildInput(g);

  if (g.phase === "day" && g.input.defendPressed && !g.confirmOpen) requestNight(g);

  if (g.phase === "night") {
    g.spawnT -= frame;
    const aliveCap = 7;
    if (g.spawnQueue.length > 0 && g.enemies.length < aliveCap && g.spawnT <= 0) {
      const kind = g.spawnQueue.shift();
      if (kind) spawnEnemy(g, kind);
      g.spawnT = 0.82;
    }
  }

  if (g.phase === "night" || g.phase === "dawn") {
    const goals = enemyGoals(g);
    for (const enemy of g.enemies) updateEnemy(g, enemy, frame, goals);
    separateEnemies(g);
    g.enemies = g.enemies.filter((enemy) => {
      if (enemy.hp > 0) return true;
      defeatEnemy(g, enemy);
      return false;
    });
    updateTurrets(g, frame);
    updateShots(g, frame);
  } else {
    g.shots = [];
  }

  updateStructures(g, frame);
  updateParticles(g, frame);

  if (g.phase === "night" && g.spawnQueue.length === 0 && g.enemies.length === 0 && g.spawnT < 0.8) {
    startDawn(g);
  }
  if (g.phase === "dawn") {
    g.dawnT -= frame;
    if (g.dawnT <= 0) {
      g.phase = "day";
      say(g, "Day again. Build until you're ready.", 2.4);
    }
  }

  g.status = analyzeHouse(g);
  g.gapCount = openEdgeTiles(g).length;
  updateTip(g);
  consumeEdges(g.input);
}

export function phaseLabel(phase: Phase, night: number) {
  if (phase === "title") return "Build a House";
  if (phase === "day") return night === 0 ? "Day" : `Day after night ${night}`;
  if (phase === "night") return `Night ${night}`;
  if (phase === "dawn") return "Dawn";
  return "Over";
}
