"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createAudio } from "@/lib/build-house/audio";
import { BEST_KEY, TOOLS, costLabel, toolFromCode } from "@/lib/build-house/content";
import { render } from "@/lib/build-house/draw";
import { createGame, layout, phaseLabel, snapshot, step } from "@/lib/build-house/sim";
import type { Game, Hud, Input } from "@/lib/build-house/types";

function readBest() {
  try {
    const value = Number(window.localStorage.getItem(BEST_KEY) ?? "0");
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function saveBest(nights: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(nights));
  } catch {
    // The game still tracks the best night for this visit.
  }
}

export default function BuildHouseGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = createGame(readBest());
    gameRef.current = game;
    const audio = createAudio();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    game.reduceMotion = reduce.matches;
    let frame = 0;
    let last = performance.now();
    let signature = "";
    let storedBest = game.best;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const bw = Math.max(1, Math.floor(cssW * dpr));
      const bh = Math.max(1, Math.floor(cssH * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      if (cssW > 20 && cssH > 20) layout(game, cssW, cssH);
      game.reduceMotion = reduce.matches;
      step(game, dt);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        render(ctx, game);
      }
      for (const event of game.events) audio.play(event, game.muted);
      game.events.length = 0;
      if (game.best > storedBest) {
        storedBest = game.best;
        saveBest(game.best);
      }
      const next = snapshot(game);
      const sig = [
        next.wood,
        next.stone,
        Math.ceil(next.hp),
        next.phase,
        next.paused ? 1 : 0,
        next.night,
        next.tool,
        next.showBanner ? next.banner : "",
        next.confirmOpen ? 1 : 0,
        next.tip,
        next.enemies,
        next.queued,
        next.hideRoofs ? 1 : 0,
        next.muted ? 1 : 0,
        next.kills,
        next.nights,
        next.best,
        next.overReason,
        next.status.ready ? 1 : 0,
        next.status.closed ? 1 : 0,
        next.status.bed ? 1 : 0,
        next.status.floors ? 1 : 0,
        next.status.roof ? 1 : 0,
        next.status.floorCount,
        next.gapCount,
        Math.ceil(next.stun * 10),
      ].join("|");
      if (sig !== signature) {
        signature = sig;
        setHud(next);
      }
      frame = requestAnimationFrame(loop);
    };

    const point = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || game.tile === 0) return;
      const x = ((clientX - rect.left) / rect.width) * game.viewW;
      const y = ((clientY - rect.top) / rect.height) * game.viewH;
      game.input.pointerX = (x - game.offsetX) / game.tile;
      game.input.pointerY = (y - game.offsetY) / game.tile;
      game.input.pointerInside =
        game.input.pointerX >= 0 &&
        game.input.pointerY >= 0 &&
        game.input.pointerX < game.cols &&
        game.input.pointerY < game.rows;
    };

    const onMove = (event: PointerEvent) => point(event.clientX, event.clientY);
    const onDown = (event: PointerEvent) => {
      point(event.clientX, event.clientY);
      if (event.button === 0) {
        game.input.primary = true;
        game.input.primaryPressed = true;
      } else if (event.button === 2) {
        game.input.secondary = true;
        game.input.secondaryPressed = true;
        event.preventDefault();
      }
    };
    const onUp = (event: PointerEvent) => {
      if (event.button === 0) game.input.primary = false;
      if (event.button === 2) game.input.secondary = false;
    };
    const onContext = (event: Event) => event.preventDefault();
    const onLeave = () => {
      game.input.pointerInside = false;
    };
    const onWindowUp = (event: PointerEvent) => {
      if (event.button === 0) game.input.primary = false;
      if (event.button === 2) game.input.secondary = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const input = game.input;
      if (event.code === "KeyW" || event.code === "ArrowUp") input.up = true;
      else if (event.code === "KeyS" || event.code === "ArrowDown") input.down = true;
      else if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = true;
      else if (event.code === "KeyD" || event.code === "ArrowRight") input.right = true;
      else if (event.code === "Space") input.shoot = true;
      else if (event.code === "KeyE") input.gather = true;
      else if (event.code === "KeyF" || event.code === "KeyR") input.repair = true;
      else if (event.code === "KeyX") input.removePressed = true;
      else if (event.code === "KeyH") input.hideRoofsPressed = true;
      else if (event.code === "KeyM") input.mutePressed = true;
      else if (event.code === "Enter") {
        if (game.confirmOpen) input.confirmDefend = true;
        else if (game.phase === "title") input.start = true;
        else if (game.phase === "gameover") input.restart = true;
        else if (game.phase === "day") input.defendPressed = true;
      } else if (event.code === "Escape") {
        if (game.confirmOpen) input.cancelDefend = true;
        else input.pausePressed = true;
      } else {
        const tool = toolFromCode(event.code);
        if (tool) input.tool = tool;
        else return;
      }
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const input = game.input;
      if (event.code === "KeyW" || event.code === "ArrowUp") input.up = false;
      else if (event.code === "KeyS" || event.code === "ArrowDown") input.down = false;
      else if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = false;
      else if (event.code === "KeyD" || event.code === "ArrowRight") input.right = false;
      else if (event.code === "Space") input.shoot = false;
      else if (event.code === "KeyE") input.gather = false;
      else if (event.code === "KeyF" || event.code === "KeyR") input.repair = false;
    };
    const release = () => {
      const input: Input = game.input;
      input.up = false;
      input.down = false;
      input.left = false;
      input.right = false;
      input.primary = false;
      input.secondary = false;
      input.shoot = false;
      input.gather = false;
      input.repair = false;
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("contextmenu", onContext);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", release);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("contextmenu", onContext);
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", release);
    };
  }, []);

  const phase = hud?.phase ?? "title";
  const playing = phase === "day" || phase === "night" || phase === "dawn";
  const hearts = hud ? Math.max(0, Math.round((hud.hp / hud.maxHp) * 5)) : 5;

  const hold = (key: "up" | "down" | "left" | "right") => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      const game = gameRef.current;
      if (game) game.input[key] = true;
    },
    onPointerUp: () => {
      const game = gameRef.current;
      if (game) game.input[key] = false;
    },
    onPointerCancel: () => {
      const game = gameRef.current;
      if (game) game.input[key] = false;
    },
  });

  const press = (apply: (input: Input) => void) => {
    const game = gameRef.current;
    if (!game) return;
    apply(game.input);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#14110e] text-[#f6efe4]">
      {playing && hud ? (
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#3a2d22] bg-[#201912] px-3 py-2">
          <Link href="/" className="text-sm text-[#d7b27a] hover:text-white">
            Home
          </Link>
          <p className="text-sm font-semibold tracking-wide" aria-label="Health">
            <span className="text-[#e2554f]">{`${"♥".repeat(hearts)}${"♡".repeat(5 - hearts)}`}</span>
            <span className="ml-2 text-[#f6efe4]">{Math.max(0, Math.ceil(hud.hp))}</span>
          </p>
          <p className="text-sm">
            <span className="text-[#d7a15e]">Wood {hud.wood}</span>
            <span className="mx-2 text-[#6d5a48]">·</span>
            <span className="text-[#c5ced6]">Stone {hud.stone}</span>
          </p>
          <p className="text-sm font-medium">{phaseLabel(hud.phase, hud.night)}</p>
          {hud.phase === "night" ? (
            <p className="text-sm text-[#f0d48a]">
              {hud.enemies + hud.queued} still coming
            </p>
          ) : null}
          <p className="text-sm text-[#c9b8a4]">Nights held {hud.nights}</p>
          <p className="ml-auto text-sm text-[#c9b8a4]">Best {hud.best}</p>
        </header>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label="Build a House meadow" />

        {playing && hud ? (
          <ul className="absolute left-3 top-3 flex flex-col gap-1 rounded-xl bg-[#201912]/90 px-3 py-2 text-sm shadow-lg">
            <Check ok={hud.status.bed} label="Bed inside" />
            <Check ok={hud.status.floors} label={`Floors ${hud.status.floorCount}/6`} />
            <Check ok={hud.status.roof} label="Roof on the house" />
            <Check ok={hud.status.closed} label={hud.status.closed ? "Closed in" : `Open sides ${hud.gapCount}`} />
          </ul>
        ) : null}

        {playing && hud?.showBanner ? (
          <p
            aria-live="polite"
            className="pointer-events-none absolute left-40 right-3 top-3 rounded-full bg-[#201912]/92 px-4 py-2 text-center text-sm font-medium shadow-lg sm:left-48"
          >
            {hud.banner}
          </p>
        ) : null}

        {hud?.stun ? (
          <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-sm font-semibold text-[#ffb4a8]">
            You are down
          </p>
        ) : null}

        <div className="absolute bottom-3 left-3 grid grid-cols-3 gap-1 lg:hidden">
          <span />
          <Pad label="Move up" {...hold("up")}>↑</Pad>
          <span />
          <Pad label="Move left" {...hold("left")}>←</Pad>
          <Pad label="Move down" {...hold("down")}>↓</Pad>
          <Pad label="Move right" {...hold("right")}>→</Pad>
        </div>

        {phase === "night" || phase === "dawn" ? (
          <button
            type="button"
            className="absolute bottom-3 right-3 rounded-full bg-[#c4553a] px-4 py-3 text-sm font-semibold lg:hidden"
            onPointerDown={(event) => {
              event.preventDefault();
              press((input) => {
                input.shoot = true;
              });
            }}
            onPointerUp={() => press((input) => {
              input.shoot = false;
            })}
          >
            Shoot
          </button>
        ) : null}

        {phase === "title" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#14110e]/55 p-4">
            <div className="w-full max-w-md rounded-3xl border border-[#5a4030] bg-[#241c16] p-8 text-center shadow-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-[#d7a15e]">A small night game</p>
              <h1 className="mt-2 text-4xl font-semibold">Build a House</h1>
              <p className="mt-3 text-[#e7d8c8]">
                Chop, raise a house, and when you are ready, defend it from the people who come for it.
              </p>
              <button
                type="button"
                className="mt-6 w-full rounded-full bg-[#e37a45] px-5 py-3 font-semibold text-[#2a140c]"
                onClick={() => press((input) => {
                  input.start = true;
                })}
              >
                Start building
              </button>
              <p className="mt-4 text-sm text-[#c9b8a4]">WASD to move. E chops. Numbers pick a piece. Enter defends.</p>
            </div>
          </div>
        ) : null}

        {hud?.paused ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#14110e]/70 p-4">
            <div className="w-full max-w-sm rounded-3xl bg-[#241c16] p-8 text-center">
              <h2 className="text-2xl font-semibold">Paused</h2>
              <button
                type="button"
                className="mt-5 w-full rounded-full bg-[#e37a45] px-5 py-3 font-semibold text-[#2a140c]"
                onClick={() => press((input) => {
                  input.pausePressed = true;
                })}
              >
                Keep building
              </button>
            </div>
          </div>
        ) : null}

        {hud?.confirmOpen ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#14110e]/75 p-4">
            <div className="w-full max-w-md rounded-3xl bg-[#241c16] p-8 text-center">
              <h2 className="text-2xl font-semibold">The house is still open</h2>
              <p className="mt-3 text-[#e7d8c8]">
                People can walk straight in to the bed. You can defend anyway, or keep building.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-full bg-[#c4553a] px-4 py-3 font-semibold"
                  onClick={() => press((input) => {
                    input.confirmDefend = true;
                  })}
                >
                  Defend anyway
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-full border border-[#6d5344] px-4 py-3 font-semibold"
                  onClick={() => press((input) => {
                    input.cancelDefend = true;
                  })}
                >
                  Keep building
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {phase === "gameover" && hud ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#14110e]/78 p-4">
            <div className="w-full max-w-md rounded-3xl bg-[#241c16] p-8 text-center">
              <h2 className="text-3xl font-semibold">They took the house</h2>
              <p className="mt-3 text-[#e7d8c8]">{hud.overReason}</p>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-[#c9b8a4]">Nights</dt>
                  <dd className="text-xl font-semibold">{hud.nights}</dd>
                </div>
                <div>
                  <dt className="text-[#c9b8a4]">Stopped</dt>
                  <dd className="text-xl font-semibold">{hud.kills}</dd>
                </div>
                <div>
                  <dt className="text-[#c9b8a4]">Best</dt>
                  <dd className="text-xl font-semibold">{hud.best}</dd>
                </div>
              </dl>
              <button
                type="button"
                className="mt-6 w-full rounded-full bg-[#e37a45] px-5 py-3 font-semibold text-[#2a140c]"
                onClick={() => press((input) => {
                  input.restart = true;
                })}
              >
                Build again
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {playing && hud ? (
        <footer className="border-t border-[#3a2d22] bg-[#201912] px-3 py-2">
          <p className="mb-2 text-sm text-[#e7d8c8]">{hud.tip}</p>
          <div className="flex items-stretch gap-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TOOLS.map((tool) => {
                const afford = hud.wood >= tool.wood && hud.stone >= tool.stone;
                const selected = hud.tool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    aria-pressed={selected}
                    title={tool.blurb}
                    onClick={() => press((input) => {
                      input.tool = tool.id;
                    })}
                    className={`min-w-24 shrink-0 rounded-xl border px-2 py-2 text-left ${
                      selected ? "border-[#e37a45] bg-[#3a271c]" : "border-[#4a382c] bg-[#2a211b]"
                    } ${afford ? "" : "opacity-50"}`}
                  >
                    <span className="block text-[10px] uppercase tracking-wide text-[#d7a15e]">{tool.key}</span>
                    <span className="block text-sm font-semibold">{tool.name}</span>
                    <span className="block text-[11px] text-[#c9b8a4]">{costLabel(tool.id)}</span>
                  </button>
                );
              })}
            </div>
            <div className="ml-auto flex shrink-0 flex-col gap-2">
              {hud.phase === "day" ? (
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    hud.status.ready ? "bg-[#8fce6b] text-[#17300c]" : "bg-[#e37a45] text-[#2a140c]"
                  }`}
                  onClick={() => press((input) => {
                    input.defendPressed = true;
                  })}
                >
                  I&apos;m ready — defend
                </button>
              ) : (
                <p className="rounded-full bg-[#3a271c] px-4 py-2 text-center text-sm">Hold the house</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[#4a382c] px-3 py-1 text-xs"
                  onClick={() => press((input) => {
                    input.hideRoofsPressed = true;
                  })}
                >
                  {hud.hideRoofs ? "Show roofs" : "Hide roofs"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#4a382c] px-3 py-1 text-xs"
                  onClick={() => press((input) => {
                    input.mutePressed = true;
                  })}
                >
                  {hud.muted ? "Sound off" : "Sound on"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#4a382c] px-3 py-1 text-xs"
                  onClick={() => press((input) => {
                    input.pausePressed = true;
                  })}
                >
                  Pause
                </button>
              </div>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li data-done={ok ? "yes" : "no"} className={ok ? "text-[#8fce6b]" : "text-[#f6efe4]"}>
      <span aria-hidden="true">{ok ? "● " : "○ "}</span>
      {label}
    </li>
  );
}

function Pad({
  label,
  children,
  ...events
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="h-11 w-11 rounded-xl bg-[#2a211b] text-lg"
      {...events}
    >
      {children}
    </button>
  );
}
