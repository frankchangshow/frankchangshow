import Link from "next/link";
import { designs } from "@/lib/designs";

const notes = {
  "/": "Current media layout. Centered hero, cards, red buttons.",
  "/v1": "Split studio. Name stays on the left. Work is a running index.",
  "/v2": "Show reel. Giant type, then a long vertical cut of every repo.",
  "/v3": "Poster. One framed sheet. About and work share a printed grid.",
} as const;

export default function Variants() {
  return (
    <div className="min-h-screen bg-black px-5 py-16 md:px-10">
      <p className="text-xs tracking-[0.22em] text-signal uppercase">
        Choose a design
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">
        Same brand. <span className="mark">Four layouts.</span>
      </h1>
      <p className="mt-4 max-w-xl text-mute">
        Colors and fonts stay. Pick the structure you want.
      </p>
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {designs.map((design) => (
          <Link
            key={design.href}
            href={design.href}
            className="border border-line bg-panel p-8 transition-colors hover:border-signal"
          >
            <p className="font-display text-sm font-bold text-signal">
              {design.label}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              {design.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              {notes[design.href]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
