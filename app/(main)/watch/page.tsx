import { socials } from "@/lib/site";

const channels = socials.filter((item) => item.name !== "GitHub");

export default function Watch() {
  return (
    <div className="bg-black px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium tracking-[0.18em] text-mute uppercase">
          Watch
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold md:text-[60px]">
          Same handle <span className="mark">everywhere</span>
        </h1>
        <p className="mt-5 text-mute">@frankchangshow</p>
      </div>

      <ul className="mx-auto mt-16 max-w-3xl space-y-4">
        {channels.map((channel) => (
          <li key={channel.name}>
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-panel px-6 py-6 transition-colors hover:bg-void"
            >
              <span className="font-display text-2xl font-bold md:text-3xl">
                {channel.name}
              </span>
              <span className="font-display text-xs font-bold tracking-[0.16em] text-signal uppercase">
                Open
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
