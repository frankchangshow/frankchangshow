import { projects, socials } from "@/lib/site";

const channels = socials.filter((item) => item.name !== "GitHub");

export default function SplitVariant() {
  return (
    <div className="lg:flex lg:min-h-screen">
      <aside className="border-b border-line bg-black px-6 py-10 lg:sticky lg:top-0 lg:h-screen lg:w-[38%] lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-10 lg:py-12">
        <p className="text-xs tracking-[0.22em] text-signal uppercase">
          Variant B · Split
        </p>
        <h1 className="mt-8 font-display text-5xl font-bold leading-none md:text-6xl">
          Frank
          <br />
          <span className="mark">Chang</span>
        </h1>
        <p className="mt-6 text-sm tracking-[0.16em] text-mute uppercase">
          Belmont, CA
        </p>
        <p className="mt-8 max-w-sm text-base leading-relaxed text-mute">
          Games that run in a tab. Procedural worlds. No install. Public repos
          under frankchangshow.
        </p>
        <nav className="mt-10 flex flex-col gap-3 text-sm">
          <a href="#work" className="text-white hover:text-signal">
            Work
          </a>
          <a href="#watch" className="text-white hover:text-signal">
            Watch
          </a>
        </nav>
        <div className="mt-12 flex flex-col gap-2">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-mute hover:text-signal"
            >
              {social.name}
            </a>
          ))}
        </div>
      </aside>

      <div className="flex-1 bg-void px-6 py-12 lg:px-14 lg:py-16">
        <section id="work">
          <p className="text-xs tracking-[0.22em] text-mute uppercase">
            Public repos
          </p>
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {projects.map((project, index) => (
              <li key={project.href}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-2 py-6 md:grid-cols-[3rem_1fr_8rem]"
                >
                  <span className="text-sm text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold group-hover:text-signal md:text-2xl">
                      {project.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">
                      {project.description}
                    </p>
                  </div>
                  <span className="text-xs tracking-[0.14em] text-mute uppercase">
                    {project.stack}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section id="watch" className="mt-20 pb-16">
          <p className="text-xs tracking-[0.22em] text-mute uppercase">
            Watch · @frankchangshow
          </p>
          <div className="mt-6 flex flex-wrap gap-8">
            {channels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-3xl font-bold hover:text-signal"
              >
                {channel.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
