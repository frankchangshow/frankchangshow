import type { Game, StructKind, Structure } from "./types";
import { structHp } from "./content";

export function makeStruct(kind: StructKind): Structure {
  const hp = structHp(kind);
  return { kind, hp, maxHp: hp, flash: 0, cooldown: 0, aim: 0 };
}

export function ringAround(game: Game, c: number, r: number) {
  for (const tile of game.tiles) {
    if (tile.struct && (tile.struct.kind === "tree" || tile.struct.kind === "rock")) tile.struct = null;
  }
  const spots = [
    [c - 1, r - 1],
    [c, r - 1],
    [c + 1, r - 1],
    [c - 1, r],
    [c + 1, r],
    [c - 1, r + 1],
    [c, r + 1],
    [c + 1, r + 1],
  ];
  for (const [sc, sr] of spots) {
    const tile = game.tiles[sr * game.cols + sc];
    tile.struct = makeStruct(sc === c && sr === r - 1 ? "door" : "wall");
    tile.floor = false;
  }
}
