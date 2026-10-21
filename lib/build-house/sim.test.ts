import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createGame, findBed, openEdgeTiles, placeResult, resetGame, step } from "./sim";
import { makeStruct, ringAround } from "./test-helpers";

describe("build a house", () => {
  it("starts on a meadow with trees and a clear plot", () => {
    const game = createGame();
    assert.equal(game.phase, "title");
    assert.equal(game.player.x, 11.5);
    const trees = game.tiles.filter((tile) => tile.struct?.kind === "tree").length;
    const guideBlocked = game.tiles.filter((tile) => tile.guide && tile.struct).length;
    assert.ok(trees > 8);
    assert.equal(guideBlocked, 0);
  });

  it("spends wood to lay a floor and refunds it", () => {
    const game = createGame();
    game.phase = "day";
    game.wood = 3;
    game.tool = "floor";
    game.input.pointerInside = true;
    game.input.pointerX = 11.5;
    game.input.pointerY = 8.5;
    game.input.primaryPressed = true;
    step(game, 1 / 60);
    assert.equal(game.tiles[8 * game.cols + 11].floor, true);
    assert.equal(game.wood, 2);

    game.input.pointerInside = true;
    game.input.pointerX = 11.5;
    game.input.pointerY = 8.5;
    game.input.secondaryPressed = true;
    step(game, 1 / 60);
    assert.equal(game.tiles[8 * game.cols + 11].floor, false);
    assert.equal(game.wood, 3);
  });

  it("chops a nearby tree into wood", () => {
    const game = createGame();
    for (const tile of game.tiles) tile.struct = null;
    game.phase = "day";
    game.wood = 0;
    game.tool = "axe";
    game.player.x = 11.5;
    game.player.y = 7.5;
    game.tiles[6 * game.cols + 11].struct = makeStruct("tree");
    game.input.pointerInside = true;
    game.input.pointerX = 11.5;
    game.input.pointerY = 6.5;
    for (let hit = 0; hit < 3; hit++) {
      game.input.primaryPressed = true;
      step(game, 1 / 60);
      for (let frame = 0; frame < 20; frame++) step(game, 1 / 60);
    }
    assert.equal(game.wood, 6);
    assert.equal(game.tiles[6 * game.cols + 11].struct, null);
  });

  it("refuses a floor you cannot afford", () => {
    const game = createGame();
    game.phase = "day";
    game.wood = 0;
    const result = placeResult(game, 11, 8, "floor");
    assert.equal(result.ok, false);
  });

  it("treats a ring of walls and a door as closed", () => {
    const game = createGame();
    ringAround(game, 11, 7);
    game.tiles[7 * game.cols + 11].struct = makeStruct("bed");
    game.tiles[7 * game.cols + 11].floor = true;
    game.tiles[7 * game.cols + 11].roof = true;
    for (let r = 6; r <= 8; r++) {
      for (let c = 10; c <= 12; c++) {
        const tile = game.tiles[r * game.cols + c];
        tile.floor = true;
        tile.roof = true;
      }
    }
    step(game, 1 / 60);
    assert.equal(game.status.closed, true);
    assert.equal(game.status.ready, true);
    game.tiles[6 * game.cols + 11].struct = null;
    step(game, 1 / 60);
    assert.equal(game.status.closed, false);
  });

  it("paints a red edge on open grass beside the floors", () => {
    const game = createGame();
    for (const tile of game.tiles) tile.struct = null;
    game.tiles[7 * game.cols + 11].floor = true;
    const gaps = openEdgeTiles(game).map((gap) => `${gap.c},${gap.r}`);
    assert.ok(gaps.includes("11,6"));
    assert.ok(gaps.includes("11,8"));
    assert.ok(gaps.includes("10,7"));
    assert.ok(gaps.includes("12,7"));
    for (const [c, r] of [
      [11, 6],
      [11, 8],
      [10, 7],
      [12, 7],
    ]) {
      game.tiles[r * game.cols + c].struct = makeStruct("wall");
    }
    game.tiles[7 * game.cols + 11].struct = makeStruct("bed");
    game.tiles[7 * game.cols + 11].roof = true;
    assert.equal(openEdgeTiles(game).length, 0);
  });

  it("asks before defending an open house", () => {
    const game = createGame();
    for (const tile of game.tiles) tile.struct = null;
    game.phase = "day";
    game.tiles[7 * game.cols + 11].struct = makeStruct("bed");
    game.tiles[7 * game.cols + 11].floor = true;
    game.tiles[7 * game.cols + 11].roof = true;
    for (let i = 0; i < 6; i++) {
      game.tiles[7 * game.cols + (8 + i)].floor = true;
      game.tiles[7 * game.cols + (8 + i)].roof = true;
    }
    game.input.defendPressed = true;
    step(game, 1 / 60);
    assert.equal(game.confirmOpen, true);
    assert.equal(game.phase, "day");
    game.input.confirmDefend = true;
    step(game, 1 / 60);
    assert.equal(game.phase, "night");
  });

  it("keeps the player from walking through a wall", () => {
    const game = createGame();
    for (const tile of game.tiles) tile.struct = null;
    game.phase = "day";
    game.player.x = 11.5;
    game.player.y = 7.5;
    game.tiles[6 * game.cols + 11].struct = makeStruct("wall");
    game.input.up = true;
    for (let i = 0; i < 90; i++) step(game, 1 / 60);
    assert.ok(game.player.y > 7.2);
  });

  it("lets the player walk through their own door", () => {
    const game = createGame();
    for (const tile of game.tiles) tile.struct = null;
    game.phase = "day";
    game.player.x = 11.5;
    game.player.y = 7.5;
    game.tiles[6 * game.cols + 11].struct = makeStruct("door");
    game.input.up = true;
    for (let i = 0; i < 90; i++) step(game, 1 / 60);
    assert.ok(game.player.y < 6.2);
  });

  it("ends the game when the bed is destroyed", () => {
    const game = createGame();
    for (const tile of game.tiles) tile.struct = null;
    game.phase = "night";
    game.night = 1;
    game.spawnQueue = [];
    game.spawnT = 0;
    const bed = makeStruct("bed");
    bed.hp = 20;
    game.tiles[7 * game.cols + 11].struct = bed;
    game.tiles[7 * game.cols + 11].floor = true;
    game.enemies.push({
      id: 9,
      kind: "runner",
      x: 11.5,
      y: 8.5,
      hp: 80,
      maxHp: 80,
      radius: 0.26,
      facing: -Math.PI / 2,
      cooldown: 0,
      stun: 0,
      iframe: 0,
      flash: 0,
      anim: 0,
      path: [],
      pathAge: 10,
      slow: 0,
      spikeT: 0,
      attack: 0,
    });
    let over = false;
    for (let i = 0; i < 400; i++) {
      step(game, 1 / 30);
      if ((game.phase as string) === "gameover") {
        over = true;
        break;
      }
    }
    assert.equal(over, true);
    assert.match(game.overReason, /house/);
    assert.equal(findBed(game), null);
  });

  it("closes a 3 by 2 cottage", () => {
    const game = createGame();
    for (const tile of game.tiles) tile.struct = null;
    const floors = [
      [10, 7],
      [11, 7],
      [12, 7],
      [10, 8],
      [11, 8],
      [12, 8],
    ];
    for (const [c, r] of floors) {
      const tile = game.tiles[r * game.cols + c];
      tile.floor = true;
      tile.roof = true;
    }
    for (const [c, r] of [
      [10, 6],
      [11, 6],
      [12, 6],
      [10, 9],
      [12, 9],
      [9, 7],
      [9, 8],
      [13, 7],
      [13, 8],
    ]) {
      game.tiles[r * game.cols + c].struct = makeStruct("wall");
    }
    game.tiles[9 * game.cols + 11].struct = makeStruct("door");
    game.tiles[8 * game.cols + 10].struct = makeStruct("bed");
    step(game, 1 / 60);
    assert.equal(game.status.ready, true);
    assert.equal(openEdgeTiles(game).length, 0);
  });

  it("starts a night when the house is ready", () => {
    const game = createGame();
    ringAround(game, 11, 7);
    const bedTile = game.tiles[7 * game.cols + 11];
    bedTile.struct = makeStruct("bed");
    for (let r = 6; r <= 8; r++) {
      for (let c = 10; c <= 12; c++) {
        const tile = game.tiles[r * game.cols + c];
        tile.floor = true;
        tile.roof = true;
      }
    }
    game.phase = "day";
    step(game, 1 / 60);
    assert.equal(game.status.ready, true);
    game.input.defendPressed = true;
    step(game, 1 / 60);
    assert.equal(game.phase, "night");
    assert.equal(game.night, 1);
    assert.ok(game.spawnQueue.length >= 5);
  });

  it("remembers the best night when you build again", () => {
    const game = createGame(2);
    game.stats.nights = 4;
    game.input.restart = true;
    step(game, 1 / 60);
    assert.equal(game.best, 4);
    assert.equal(game.phase, "day");
    assert.equal(game.stats.nights, 0);
  });

  it("can reset without dropping held movement", () => {
    const game = createGame();
    game.input.up = true;
    resetGame(game);
    assert.equal(game.input.up, true);
    assert.equal(game.phase, "day");
  });
});
