import { socials } from "@/lib/site";

const channels = socials.filter((item) => item.name !== "GitHub");

export default function Watch() {
  return (
    <div className="min-h-screen px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-signal">
        04 / Watch
      </p>
      <h1 className="mt-4 font-display text-6xl leading-none tracking-[-0.03em] md:text-8xl">
        Same handle
        <br />
        <span className="italic">everywhere</span>
      </h1>
      <p className="mt-6 max-w-sm font-mono text-[11px] tracking-[0.08em] text-mute uppercase">
        @frankchangshow
      </p>

      <ul className="mt-16 divide-y divide-line border-y border-line">
        {channels.map((channel, index) => (
          <li key={channel.name}>
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-end justify-between gap-6 py-8 md:py-12"
            >
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-mute">
                  0{index + 1}
                </p>
                <h2 className="mt-2 font-display text-5xl leading-none transition-colors group-hover:text-signal md:text-7xl">
                  {channel.name}
                </h2>
              </div>
              <span className="mb-2 font-mono text-[11px] tracking-[0.22em] uppercase text-mute transition-colors group-hover:text-ink">
                Open
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
