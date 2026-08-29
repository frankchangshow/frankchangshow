import Link from "next/link";
import { projects } from "@/lib/site";

export default function Home() {
  const crawl = [...projects, ...projects];

  return (
    <div className="relative min-h-screen overflow-hidden pt-14 md:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(216,255,58,0.08),transparent_42%)]" />

      <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-between px-5 pb-8 md:min-h-[calc(100svh-4rem)] md:px-8">
        <div className="flex items-start justify-between pt-8 font-mono text-[10px] tracking-[0.28em] uppercase text-mute md:text-[11px]">
          <span className="rise">The show</span>
          <span className="rise" style={{ animationDelay: "80ms" }}>
            Belmont, CA
          </span>
        </div>

        <div className="rise py-10" style={{ animationDelay: "120ms" }}>
          <h1 className="font-display text-[22vw] leading-[0.78] tracking-[-0.04em] md:text-[13vw]">
            Frank
            <br />
            <span className="italic text-signal">Chang</span>
          </h1>
          <p className="mt-8 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.08em] text-mute uppercase md:text-xs">
            Browser games. Procedural worlds. No install.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/work"
              className="border border-ink bg-ink px-5 py-2.5 font-mono text-[11px] tracking-[0.22em] uppercase text-void transition-colors hover:bg-signal hover:border-signal"
            >
              Open work
            </Link>
            <Link
              href="/watch"
              className="border border-line px-5 py-2.5 font-mono text-[11px] tracking-[0.22em] uppercase text-ink transition-colors hover:border-signal hover:text-signal"
            >
              Watch
            </Link>
          </div>
        </div>

        <div className="rise border-t border-line pt-4" style={{ animationDelay: "220ms" }}>
          <p className="mb-3 font-mono text-[10px] tracking-[0.28em] uppercase text-mute">
            Public repos
          </p>
          <div className="overflow-hidden">
            <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
              {crawl.map((project, index) => (
                <span
                  key={`${project.title}-${index}`}
                  className="font-display text-2xl italic md:text-3xl"
                >
                  {project.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
