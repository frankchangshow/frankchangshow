import { socials } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-10 md:px-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-mute">
            @frankchangshow
          </p>
          <p className="mt-2 font-display text-3xl italic">Belmont, CA</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute transition-colors hover:text-signal"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
