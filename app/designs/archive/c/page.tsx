import type { Metadata } from "next";
import Link from "next/link";
import { copy, site, socials, youtube } from "@/lib/site";
import { SocialIcon } from "@/app/designs/_components/SocialIcon";
import { laneHref, laneLinkProps } from "@/app/designs/_components/lanes";
import {
  LivingRoom,
  SpotBooks,
  SpotJar,
  SpotMugNote,
  SpotTelevision,
  SunMark,
  TwoMugs,
  Wave,
} from "./Scenes";

export const metadata: Metadata = {
  title: "Design C · Warm Living Room",
};

const spots = {
  watch: SpotTelevision,
  exclusives: SpotBooks,
  digests: SpotMugNote,
  dashboard: SpotJar,
} as const;

const navItems = [
  { label: "Watch", href: "#watch" },
  { label: "About", href: "#about" },
  { label: "Around here", href: "#around" },
  { label: "Say hi", href: "#hello" },
];

export default function DesignC() {
  const year = new Date().getFullYear();

  return (
    <div className="theme theme-c flex-1">
      {/* Hero on peach */}
      <section className="bg-(--bg-2)">
        <div className="mx-auto max-w-6xl px-5 pt-5 sm:px-8">
          <header className="cushion flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <Link href="/designs/archive/c" className="display flex items-center gap-2.5 text-lg">
              <SunMark className="h-7 w-7" />
              Frank Chang
            </Link>
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-1 text-[15px] font-bold text-(--ink-2)">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="rounded-full px-3.5 py-2 transition-colors hover:bg-(--bg-2) hover:text-(--accent-ink)"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <a
              href={youtube.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-warm inline-flex items-center gap-2 px-4 py-2 text-sm font-bold"
            >
              <SocialIcon id="youtube" className="h-4 w-4" />
              Watch
            </a>
          </header>

          <div className="grid items-center gap-10 py-14 md:grid-cols-12 md:py-20">
            <div className="md:col-span-6">
              <span className="tag bg-(--accent-2-ink) text-(--bg-3)">@{site.handle}</span>
              <h1 className="display mt-6 text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
                Come on in.
                <br />
                I&apos;m Frank.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-(--ink-2)">{copy.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-warm inline-flex items-center gap-2 px-5 py-3 text-sm font-bold"
                >
                  <SocialIcon id="youtube" className="h-4 w-4" />
                  Watch on YouTube
                </a>
                <Link
                  href="/designs/archive/c/exclusives"
                  className="btn-olive inline-flex items-center gap-2 px-5 py-3 text-sm font-bold"
                >
                  Read the Exclusives
                </Link>
              </div>
              <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-(--muted)">
                {socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-(--accent-ink)"
                    >
                      <SocialIcon id={s.id} className="h-3.5 w-3.5" />
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-6">
              <LivingRoom className="w-full" />
            </div>
          </div>
        </div>
        <Wave className="block h-10 w-full sm:h-14" />
      </section>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* About */}
        <section id="about" className="py-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-12 md:items-start">
            <div className="cushion p-7 sm:p-10 md:col-span-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--accent-2-ink)">About</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Who&apos;s home.</h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-(--ink-2)">
                {copy.about.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <aside className="md:col-span-4 md:pt-6">
              <div className="mx-auto max-w-xs -rotate-2 rounded-2xl bg-(--accent-3) p-6 shadow-[0_14px_30px_-20px_rgba(66,50,43,0.5)]">
                <p className="display text-2xl leading-snug text-(--ink)">
                  Process, not the highlight reel.
                </p>
                <p className="mt-3 text-sm font-bold text-(--ink-2)/80">House rule, stuck to the fridge.</p>
              </div>
            </aside>
          </div>
        </section>

        {/* Around here */}
        <section id="around" className="py-10 md:py-14">
          <div className="mb-8 max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--accent-2-ink)">Around here</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Four corners of the room.</h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.lanes.map((lane) => {
              const Spot = spots[lane.id];
              return (
                <li key={lane.id} id={lane.id === "watch" ? "watch" : undefined}>
                  <a
                    href={laneHref("c", lane)}
                    {...laneLinkProps(lane)}
                    className="cushion group flex h-full flex-col p-6 transition-transform hover:-translate-y-1"
                  >
                    <Spot className="h-24 w-24 transition-transform group-hover:rotate-3" />
                    <h3 className="display mt-4 text-2xl">{lane.title}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-(--ink-2)">{lane.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-(--accent-ink)">
                      {lane.cta}
                      <span aria-hidden>{lane.external ? "↗" : "→"}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      {/* Soft coaching lane on olive */}
      <section id="hello" className="mt-10 bg-(--accent-2-ink) text-(--bg-3)">
        <Wave className="block h-10 w-full sm:h-14" flip />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 sm:px-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--bg-2)">Say hi</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">{copy.coaching.title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-(--bg-3)/92">{copy.coaching.body}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={copy.coaching.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-(--bg-3) px-5 py-3 text-sm font-bold text-(--ink) transition hover:bg-(--accent-3)"
              >
                <SocialIcon id="x" className="h-4 w-4" />
                {copy.coaching.cta}
              </a>
              <span className="text-sm text-(--bg-3)/90">Or Instagram, if that&apos;s where you are.</span>
            </div>
          </div>
          <div className="md:col-span-5">
            <TwoMugs className="mx-auto w-full max-w-sm" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-(--bg)">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <SunMark className="h-8 w-8" />
            <div>
              <p className="display text-lg">Frank Chang</p>
              <p className="text-sm text-(--muted)">{copy.footer}</p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex items-center gap-2 rounded-full bg-(--bg-3) px-3.5 py-2 text-sm font-bold text-(--ink-2) transition hover:text-(--accent-ink)"
                >
                  <SocialIcon id={s.id} className="h-3.5 w-3.5" />
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-8 text-xs text-(--muted) sm:px-8">
          © {year} Frank Chang · Draft C, retired
        </p>
      </footer>
    </div>
  );
}
