import { projects, socials } from "@/lib/site";

const channels = socials.filter((item) => item.name !== "GitHub");

export default function ReelVariant() {
  return (
    <div className="bg-black">
      <header className="flex items-center justify-between px-5 py-5 md:px-10">
        <p className="text-xs tracking-[0.22em] text-signal uppercase">
          Variant C · Reel
        </p>
        <nav className="flex gap-5 text-sm text-mute">
          <a href="#about" className="hover:text-white">
            About
          </a>
          <a href="#work" className="hover:text-white">
            Work
          </a>
          <a href="#watch" className="hover:text-white">
            Watch
          </a>
        </nav>
      </header>

      <section className="flex min-h-[80vh] flex-col justify-end px-5 pb-16 md:px-10">
        <h1 className="font-display text-[18vw] leading-[0.8] font-bold tracking-tight">
          FRANK
          <br />
          <span className="mark">CHANG</span>
        </h1>
        <p className="mt-8 max-w-md text-mute">
          Browser games. Procedural worlds. No install.
        </p>
      </section>

      <section
        id="about"
        className="border-t border-line px-5 py-24 md:px-10 md:py-32"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <h2 className="font-display text-4xl font-bold md:text-6xl">
            Games that run in a <span className="mark">tab</span>
          </h2>
          <div className="max-w-md space-y-5 text-lg leading-relaxed text-mute">
            <p>
              Procedural worlds. Real-time graphics. No art pipeline, no
              download, no account.
            </p>
            <p>
              Public work on GitHub under frankchangshow. Three.js, WebGPU,
              Babylon.js, and vanilla JavaScript.
            </p>
            <p className="tracking-[0.16em] text-signal uppercase">
              Belmont, CA
            </p>
          </div>
        </div>
      </section>

      <section id="work" className="border-t border-line">
        {projects.map((project, index) => (
          <a
            key={project.href}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 border-b border-line px-5 py-8 transition-colors hover:bg-panel md:flex-row md:items-baseline md:justify-between md:px-10 md:py-10"
          >
            <div className="flex items-baseline gap-5">
              <span className="text-sm text-signal">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-3xl font-bold md:text-5xl">
                {project.title}
              </h3>
            </div>
            <p className="max-w-md text-sm text-mute md:text-right">
              {project.description}
            </p>
          </a>
        ))}
      </section>

      <section
        id="watch"
        className="grid min-h-[50vh] md:grid-cols-3"
      >
        {channels.map((channel) => (
          <a
            key={channel.name}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-end border-b border-line px-5 py-16 transition-colors hover:bg-signal md:border-r md:border-b-0 md:last:border-r-0 md:px-10"
          >
            <span className="font-display text-4xl font-bold md:text-5xl">
              {channel.name}
            </span>
          </a>
        ))}
      </section>
    </div>
  );
}
