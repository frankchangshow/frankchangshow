export const COLS = 22;
export const ROWS = 14;

export type ToolId =
  | "axe"
  | "floor"
  | "wall"
  | "stone"
  | "door"
  | "window"
  | "roof"
  | "bed"
  | "spike"
  | "turret";

export type StructKind =
  | "tree"
  | "rock"
  | "wall"
  | "stone"
  | "door"
  | "window"
  | "bed"
  | "spike"
  | "turret";

export type EnemyKind = "runner" | "bruiser" | "thrower";

export type Phase = "title" | "day" | "night" | "dawn" | "gameover";

export type SfxEvent =
  | "chop"
  | "place"
  | "remove"
  | "shoot"
  | "hit"
  | "hurt"
  | "wave"
  | "dawn"
  | "over"
  | "break"
  | "repair"
  | "click";

export interface Structure {
  kind: StructKind;
  hp: number;
  maxHp: number;
  flash: number;
  cooldown: number;
  aim: number;
}

export interface Tile {
  floor: boolean;
  roof: boolean;
  struct: Structure | null;
  variant: number;
  flower: number;
  guide: boolean;
}

export interface Actor {
  id: number;
  kind: "player" | EnemyKind;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  radius: number;
  facing: number;
  cooldown: number;
  stun: number;
  iframe: number;
  flash: number;
  anim: number;
  path: { c: number; r: number }[];
  pathAge: number;
  slow: number;
  spikeT: number;
  attack: number;
}

export interface Shot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  friendly: boolean;
  life: number;
  kind: "arrow" | "torch";
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  text?: string;
  gravity?: number;
}

export interface Input {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  primary: boolean;
  primaryPressed: boolean;
  secondary: boolean;
  secondaryPressed: boolean;
  shoot: boolean;
  repair: boolean;
  repairPressed: boolean;
  gather: boolean;
  removePressed: boolean;
  pointerX: number;
  pointerY: number;
  pointerInside: boolean;
  defendPressed: boolean;
  confirmDefend: boolean;
  cancelDefend: boolean;
  start: boolean;
  restart: boolean;
  pausePressed: boolean;
  tool: ToolId | null;
  hideRoofsPressed: boolean;
  mutePressed: boolean;
}

export interface HouseStatus {
  bed: boolean;
  floors: boolean;
  floorCount: number;
  roof: boolean;
  roofCount: number;
  closed: boolean;
  ready: boolean;
}

export interface Game {
  cols: number;
  rows: number;
  tile: number;
  tiles: Tile[];
  player: Actor;
  enemies: Actor[];
  shots: Shot[];
  particles: Particle[];
  wood: number;
  stone: number;
  phase: Phase;
  paused: boolean;
  night: number;
  tool: ToolId;
  time: number;
  shake: number;
  banner: string;
  bannerT: number;
  status: HouseStatus;
  stats: { kills: number; placed: number; nights: number };
  best: number;
  overReason: string;
  dawnT: number;
  spawnQueue: EnemyKind[];
  spawnT: number;
  nextId: number;
  blackouts: number;
  chopT: number;
  repairT: number;
  shootT: number;
  lastPlaceC: number;
  lastPlaceR: number;
  hoverC: number;
  hoverR: number;
  previewOk: boolean;
  previewReason: string;
  tip: string;
  input: Input;
  events: SfxEvent[];
  worldW: number;
  worldH: number;
  offsetX: number;
  offsetY: number;
  viewW: number;
  viewH: number;
  reduceMotion: boolean;
  muted: boolean;
  hideRoofs: boolean;
  confirmOpen: boolean;
  waveKills: number;
  gapCount: number;
}

export interface Hud {
  wood: number;
  stone: number;
  hp: number;
  maxHp: number;
  phase: Phase;
  paused: boolean;
  night: number;
  tool: ToolId;
  banner: string;
  showBanner: boolean;
  status: HouseStatus;
  kills: number;
  placed: number;
  nights: number;
  best: number;
  overReason: string;
  confirmOpen: boolean;
  tip: string;
  enemies: number;
  queued: number;
  hideRoofs: boolean;
  muted: boolean;
  stun: number;
  gapCount: number;
}
