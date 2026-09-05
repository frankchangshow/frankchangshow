import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { designs } from "@/lib/designs";

export const metadata: Metadata = {
  title: "Three design directions",
};

export default function DesignsPicker() {
  return (
    <div
      className="flex-1 bg-[#f7f6f2] text-[#161513]"
      style={{ fontFamily: "var(--font-manrope), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a766e]">
            frankchangshow.com · draft preview
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Three directions, one voice.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#4a473f]">
            Same copy, same tone, same links. Each direction has its own brand
            color system, type, and custom graphics. Open one, scroll it on your
            phone, then pick.
          </p>
        </header>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {designs.map((d) => (
            <li
              key={d.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-[#e4e1d8] bg-white shadow-[0_20px_50px_-36px_rgba(22,21,19,0.35)]"
            >
              <Link
                href={`/designs/${d.id}`}
                className="group relative block aspect-[4/3] overflow-hidden border-b border-[#e4e1d8] bg-[#efede6]"
                aria-label={`Open design ${d.letter}: ${d.name}`}
              >
                <Image
                  src={`/previews/design-${d.id}.png`}
                  alt={`Screenshot of design ${d.letter}, ${d.name}`}
                  width={1280}
                  height={960}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                  unoptimized
                />
                <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#161513] text-sm font-bold text-white">
                  {d.letter}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-2xl font-bold tracking-[-0.02em]">{d.name}</h2>
                <p className="mt-1 text-[#7a766e]">{d.tagline}</p>
                <p className="mt-4 leading-relaxed text-[#4a473f]">{d.description}</p>

                <ul className="mt-6 flex gap-2" aria-label={`Palette for design ${d.letter}`}>
                  {d.palette.map((c) => (
                    <li key={c.hex} className="flex-1">
                      <span
                        className="block h-10 rounded-lg border border-black/5"
                        style={{ background: c.hex }}
                        title={`${c.name} ${c.hex}`}
                      />
                      <span className="mt-1.5 block truncate text-[11px] text-[#7a766e]">
                        {c.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 space-y-2 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-[#7a766e]">Type</dt>
                    <dd>{d.type}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-[#7a766e]">Graphics</dt>
                    <dd>{d.graphics}</dd>
                  </div>
                </dl>

                <Link
                  href={`/designs/${d.id}`}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#161513] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#33312c]"
                >
                  Open design {d.letter}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <footer className="mt-14 max-w-2xl text-sm leading-relaxed text-[#7a766e]">
          <p>
            Draft only. The current public homepage is untouched until a direction
            is picked. Exclusives, Daily Digest, and the Money Dashboard routes
            inside each design are layout stubs; the real content is wired in
            afterwards.
          </p>
        </footer>
      </div>
    </div>
  );
}
