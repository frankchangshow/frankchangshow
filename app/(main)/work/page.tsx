import { projects } from "@/lib/site";

export default function Work() {
  return (
    <div className="bg-panel px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium tracking-[0.18em] text-mute uppercase">
          Work
        </p>
        <h1 className="mt-3 text-center font-display text-5xl font-bold md:text-[60px]">
          Public <span className="mark">repos</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-center text-mute">
          Titles and descriptions from GitHub. Open a card to read the repo.
        </p>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.href}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="flex h-44 items-end rounded-xl bg-void p-5">
                <span className="font-display text-xs font-bold tracking-[0.16em] text-signal uppercase">
                  {project.stack}
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold leading-snug group-hover:text-signal">
                {project.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                {project.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
