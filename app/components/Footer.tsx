import Link from "next/link";
import { nav } from "@/lib/site";
import { SocialIcons } from "./SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-line bg-void">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-lg font-bold">Frank Chang</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">
            Browser games. Procedural worlds. Belmont, CA.
          </p>
          <div className="mt-5">
            <SocialIcons />
          </div>
        </div>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Pages
          </p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-mute transition-colors hover:text-signal"
                >
                  <span className="mr-2 text-signal">&gt;</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Watch
          </p>
          <p className="mt-4 text-sm text-mute">@frankchangshow</p>
        </div>
      </div>
    </footer>
  );
}
