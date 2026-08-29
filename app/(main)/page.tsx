import Link from "next/link";
import { projects } from "@/lib/site";

export default function Home() {
  return (
    <div>
      <section className="bg-black px-5 py-24 text-center md:px-8 md:py-32">
        <div className="rise mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold leading-tight md:text-[60px]">
            Frank <span className="mark">Chang</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mute">
            Browser games. Procedural worlds. No install. Public work from
            @frankchangshow.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/work"
              className="bg-signal px-6 py-4 font-display text-sm font-bold tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-85"
            >
              Open work
            </Link>
            <Link
              href="/watch"
              className="border border-white/20 px-6 py-4 font-display text-sm font-bold tracking-[0.16em] text-white uppercase transition-colors hover:border-signal hover:text-signal"
            >
              Watch
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-panel px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-medium tracking-[0.18em] text-mute uppercase">
            Selected repos
          </p>
          <h2 className="mt-3 text-center font-display text-4xl font-bold md:text-5xl">
            Public <span className="mark">work</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-mute">
            Titles and descriptions from GitHub. Open a card to read the repo.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <a
                key={project.href}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex h-40 items-end rounded-xl bg-void p-5">
                  <span className="font-display text-xs font-bold tracking-[0.16em] text-signal uppercase">
                    {project.stack}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-snug group-hover:text-signal">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  {project.description}
                </p>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/work"
              className="inline-block bg-signal px-8 py-4 font-display text-sm font-bold tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-85"
            >
              See all repos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
