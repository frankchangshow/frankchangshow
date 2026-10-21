import type { EnemyKind, StructKind, ToolId } from "./types";

export interface ToolDef {
  id: ToolId;
  name: string;
  key: string;
  wood: number;
  stone: number;
  blurb: string;
}

export const TOOLS: ToolDef[] = [
  { id: "axe", name: "Axe", key: "1", wood: 0, stone: 0, blurb: "Chop trees and mine rocks" },
  { id: "floor", name: "Floor", key: "2", wood: 1, stone: 0, blurb: "Wooden floorboards" },
  { id: "wall", name: "Wood wall", key: "3", wood: 1, stone: 0, blurb: "Fills a tile and stops people. 100 HP" },
  { id: "stone", name: "Stone wall", key: "4", wood: 0, stone: 2, blurb: "Tough wall. 220 HP" },
  { id: "door", name: "Door", key: "5", wood: 1, stone: 0, blurb: "You can walk through. They can't." },
  { id: "window", name: "Window", key: "6", wood: 1, stone: 1, blurb: "Lets light out. Breaks faster." },
  { id: "roof", name: "Roof", key: "7", wood: 1, stone: 0, blurb: "Cover the floors" },
  { id: "bed", name: "Bed", key: "8", wood: 2, stone: 0, blurb: "The heart of the house" },
  { id: "spike", name: "Spikes", key: "9", wood: 1, stone: 1, blurb: "Hurts anyone who steps on them" },
  { id: "turret", name: "Turret", key: "0", wood: 3, stone: 2, blurb: "Shoots people who get close" },
];

export const TOOL_BY_ID: Record<ToolId, ToolDef> = Object.fromEntries(
  TOOLS.map((tool) => [tool.id, tool]),
) as Record<ToolId, ToolDef>;

const KEY_TO_TOOL: Record<string, ToolId> = {
  Digit1: "axe",
  Digit2: "floor",
  Digit3: "wall",
  Digit4: "stone",
  Digit5: "door",
  Digit6: "window",
  Digit7: "roof",
  Digit8: "bed",
  Digit9: "spike",
  Digit0: "turret",
};

export function toolFromCode(code: string): ToolId | null {
  return KEY_TO_TOOL[code] ?? null;
}

export function costLabel(id: ToolId): string {
  const tool = TOOL_BY_ID[id];
  if (tool.wood === 0 && tool.stone === 0) return "Gather";
  const parts: string[] = [];
  if (tool.wood) parts.push(`${tool.wood} wood`);
  if (tool.stone) parts.push(`${tool.stone} stone`);
  return parts.join(" · ");
}

export function structHp(kind: StructKind): number {
  switch (kind) {
    case "tree":
    case "rock":
      return 36;
    case "wall":
      return 100;
    case "stone":
      return 220;
    case "door":
      return 140;
    case "window":
      return 70;
    case "bed":
      return 160;
    case "spike":
      return 48;
    case "turret":
      return 90;
  }
}

export interface EnemyDef {
  hp: number;
  speed: number;
  radius: number;
  structure: number;
  player: number;
  windup: number;
  range: number;
}

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  runner: { hp: 44, speed: 2.7, radius: 0.26, structure: 12, player: 9, windup: 0.85, range: 0 },
  bruiser: { hp: 120, speed: 1.45, radius: 0.34, structure: 26, player: 16, windup: 1.1, range: 0 },
  thrower: { hp: 56, speed: 2.05, radius: 0.26, structure: 18, player: 14, windup: 1.35, range: 5.4 },
};

export function waveFor(night: number): EnemyKind[] {
  const runners = Math.min(12, 4 + night);
  const bruisers = night < 2 ? 0 : Math.min(5, night - 1);
  const throwers = night < 3 ? 0 : Math.min(4, Math.floor((night - 1) / 2));
  const wave: EnemyKind[] = [];
  const specials: EnemyKind[] = [
    ...Array.from({ length: bruisers }, () => "bruiser" as const),
    ...Array.from({ length: throwers }, () => "thrower" as const),
  ];
  let special = 0;
  for (let i = 0; i < runners; i++) {
    wave.push("runner");
    if (special < specials.length && (i + 1) % 2 === 0) {
      wave.push(specials[special]);
      special += 1;
    }
  }
  while (special < specials.length) {
    wave.push(specials[special]);
    special += 1;
  }
  return wave;
}

export const DRAG_TOOLS: ReadonlySet<ToolId> = new Set([
  "floor",
  "wall",
  "stone",
  "roof",
  "spike",
]);

export const PLAYER_SPEED = 3.85;
export const PLAYER_RADIUS = 0.28;
export const CHOP_REACH = 2.6;
export const BUILD_REACH = 5.2;
export const REPAIR_REACH = 4.2;
export const BEST_KEY = "build-a-house-best-nights";
