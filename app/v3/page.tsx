import { projects, socials } from "@/lib/site";

const channels = socials.filter((item) => item.name !== "GitHub");

export default function PosterVariant() {
  return (
    <div className="min-h-screen bg-void px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl border border-line">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="text-xs tracking-[0.22em] text-signal uppercase">
            Variant D · Poster
          </p>
          <p className="text-xs tracking-[0.18em] text-mute uppercase">
            Belmont, CA · @frankchangshow
          </p>
        </div>

        <div className="border-b border-line px-5 py-10 md:px-8 md:py-14">
          <p className="text-xs tracking-[0.24em] text-mute uppercase">
            The show
          </p>
          <h1 className="mt-4 font-display text-[16vw] leading-[0.78] font-bold tracking-tighter md:text-[9vw]">
            FRANK
            <br />
            CHANG
          </h1>
          <p className="mt-8 max-w-lg text-lg text-mute">
            Browser games. Procedural worlds. No install.
          </p>
        </div>

        <div className="grid border-b border-line md:grid-cols-[1.1fr_1.4fr]">
          <section className="border-b border-line px-5 py-10 md:border-r md:border-b-0 md:px-8">
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-signal uppercase">
              About
            </h2>
            <p className="mt-5 leading-relaxed text-mute">
              I make games that run in a tab. Shooters, racers, a space RTS.
              Three.js, WebGPU, Babylon.js, vanilla JavaScript. Public work on
              GitHub.
            </p>
            <div className="mt-8 flex flex-col gap-2">
              {channels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl font-bold hover:text-signal"
                >
                  {channel.name}
                </a>
              ))}
            </div>
          </section>

          <section className="px-5 py-10 md:px-8">
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-signal uppercase">
              Public repos
            </h2>
            <ol className="mt-5">
              {projects.map((project, index) => (
                <li key={project.href} className="border-b border-line last:border-b-0">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-baseline justify-between gap-4 py-3 hover:text-signal"
                  >
                    <span className="font-display text-lg font-bold">
                      {project.title}
                    </span>
                    <span className="shrink-0 text-xs text-mute">
                      {String(index + 1).padStart(2, "0")} · {project.stack}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 text-xs tracking-[0.16em] text-mute uppercase">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-signal"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
