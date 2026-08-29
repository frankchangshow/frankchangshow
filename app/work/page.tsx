import { projects } from "@/lib/site";

export default function Work() {
  return (
    <div className="min-h-screen px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <div className="flex flex-col gap-4 border-b border-line pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-signal">
            03 / Work
          </p>
          <h1 className="mt-4 font-display text-6xl leading-none tracking-[-0.03em] md:text-8xl">
            Public
            <br />
            <span className="italic">repos</span>
          </h1>
        </div>
        <p className="max-w-xs font-mono text-[11px] leading-relaxed tracking-[0.08em] text-mute uppercase">
          Titles and descriptions from GitHub. Open a row to read the repo.
        </p>
      </div>

      <ol className="divide-y divide-line">
        {projects.map((project, index) => (
          <li key={project.href}>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-3 py-8 md:grid-cols-[4rem_minmax(0,1fr)_10rem] md:items-baseline md:gap-8 md:py-10"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-mute">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-3xl leading-none tracking-[-0.02em] transition-colors group-hover:text-signal md:text-5xl">
                  {project.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute md:text-base">
                  {project.description}
                </p>
              </div>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute transition-colors group-hover:text-ink">
                {project.stack}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
