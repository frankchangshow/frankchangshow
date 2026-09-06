import type { Metadata } from "next";
import Link from "next/link";
import { copy, site, socials, youtube } from "@/lib/site";
import { SocialIcon } from "@/app/designs/_components/SocialIcon";
import { laneHref, laneLinkProps } from "@/app/designs/_components/lanes";
import {
  HeroGraphic,
  IconArrow,
  IconArticle,
  IconCalendar,
  IconChat,
  IconDashboard,
  IconExternal,
  IconHome,
  IconPlay,
  IconWrench,
  Monogram,
} from "./Icons";

export const metadata: Metadata = {
  title: "Design B · Clean Modern Product",
};

const laneIcons = {
  watch: IconPlay,
  exclusives: IconArticle,
  digests: IconCalendar,
  dashboard: IconDashboard,
} as const;

const aboutIcons = [IconHome, IconWrench, IconPlay];

const navItems = [
  { label: "Watch", href: "#watch" },
  { label: "About", href: "#about" },
  { label: "Around here", href: "#around" },
  { label: "Say hi", href: "#hello" },
];

export default function DesignB() {
  const year = new Date().getFullYear();

  return (
    <div className="theme theme-b flex-1">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-(--rule) bg-(--bg)/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/designs/archive/b" className="flex items-center gap-2.5 font-bold tracking-[-0.02em]">
            <Monogram className="h-8 w-8" />
            <span>Frank Chang</span>
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 text-sm font-semibold text-(--ink-2)">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="pill px-3.5 py-2 transition-colors hover:bg-(--accent-3) hover:text-(--accent)"
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
            className="btn-primary pill inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          >
            <IconPlay className="h-4 w-4" />
            YouTube
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Hero */}
        <section className="grid items-center gap-12 py-14 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6">
            <span className="pill inline-flex items-center gap-1.5 bg-(--accent-2) px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-(--accent)">
              @{site.handle}
            </span>
            <h1 className="display mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl">
              Hi, I&apos;m Frank.
              <br />
              <span className="text-(--accent)">I make things</span> and explain them plainly.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-(--ink-2)">{copy.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={youtube.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary pill inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                <IconPlay className="h-4.5 w-4.5" />
                Watch on YouTube
              </a>
              <Link
                href="/designs/archive/b/exclusives"
                className="btn-ghost pill inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                Read the Exclusives
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-(--muted)">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex items-center gap-2 transition-colors hover:text-(--accent)"
                  >
                    <SocialIcon id={s.id} variant="line" className="h-4.5 w-4.5" />
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6">
            <HeroGraphic className="w-full" />
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-8 md:py-12">
          <div className="card grid gap-8 p-7 sm:p-10 md:grid-cols-3">
            {copy.about.map((para, i) => {
              const Icon = aboutIcons[i];
              return (
                <div key={i}>
                  <span className="pill inline-flex h-11 w-11 items-center justify-center bg-(--accent-3) text-(--accent)">
                    <Icon className="h-5.5 w-5.5" />
                  </span>
                  <p className="mt-5 leading-relaxed text-(--ink-2)">{para}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Around here */}
        <section id="around" className="py-12 md:py-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--accent)">Around here</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Four things I keep up.</h2>
            </div>
            <p className="max-w-sm text-sm text-(--muted)">
              Videos, longer pieces, a daily note, and the money dashboard.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.lanes.map((lane) => {
              const Icon = laneIcons[lane.id];
              return (
                <li key={lane.id} id={lane.id === "watch" ? "watch" : undefined}>
                  <a
                    href={laneHref("b", lane)}
                    {...laneLinkProps(lane)}
                    className="card group flex h-full flex-col p-6 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-24px_rgba(14,94,91,0.35)]"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-(--accent-2) text-(--accent)">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="display mt-6 text-xl">{lane.title}</h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-(--ink-2)">{lane.body}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-(--accent)">
                      {lane.cta}
                      {lane.external ? (
                        <IconExternal className="h-4 w-4" />
                      ) : (
                        <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Soft coaching lane */}
        <section id="hello" className="pb-16 pt-4 md:pb-24">
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-(--accent) p-8 text-white sm:p-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <span className="pill inline-flex h-11 w-11 items-center justify-center bg-white/15">
                <IconChat className="h-5.5 w-5.5" />
              </span>
              <h2 className="display mt-6 text-3xl sm:text-4xl">{copy.coaching.title}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">{copy.coaching.body}</p>
            </div>
            <div className="flex flex-col items-start gap-3 md:col-span-4 md:items-end">
              <a
                href={copy.coaching.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pill inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-(--accent) transition hover:bg-(--accent-2)"
              >
                <SocialIcon id="x" className="h-4 w-4" />
                {copy.coaching.cta}
              </a>
              <p className="text-sm text-white/70">Or Instagram, if that&apos;s where you are.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-(--rule) bg-(--bg-2)">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <Monogram className="h-9 w-9" />
            <div>
              <p className="font-bold">Frank Chang</p>
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
                  className="btn-ghost pill inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold"
                >
                  <SocialIcon id={s.id} variant="line" className="h-4 w-4" />
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-8 text-xs text-(--muted) sm:px-8">
          © {year} Frank Chang · Draft B, retired
        </p>
      </footer>
    </div>
  );
}
