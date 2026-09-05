import type { Metadata } from "next";
import Link from "next/link";
import { copy, site, socials } from "@/lib/site";
import { SocialIcon } from "../_components/SocialIcon";
import { laneHref, laneLinkProps } from "../_components/lanes";
import {
  DeskScene,
  SpotCamera,
  SpotLedger,
  SpotNote,
  SpotPages,
  Squiggle,
  TwoChairs,
} from "./Illustrations";

export const metadata: Metadata = {
  title: "Design A · Soft Editorial",
};

const spots = {
  watch: SpotCamera,
  exclusives: SpotPages,
  digests: SpotNote,
  dashboard: SpotLedger,
} as const;

const navItems = [
  { label: "Watch", href: "#watch" },
  { label: "About", href: "#about" },
  { label: "Around here", href: "#around" },
  { label: "Say hi", href: "#hello" },
];

export default function DesignA() {
  const year = new Date().getFullYear();

  return (
    <div className="theme theme-a paper flex-1">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Masthead */}
        <header className="pt-6">
          <div className="rule flex items-center justify-between border-b pb-3 text-[13px]">
            <span className="smallcaps">{site.location}</span>
            <span className="smallcaps hidden sm:inline">
              A personal site · No. 1
            </span>
            <ul className="flex items-center gap-3">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-(--ink-2) transition-colors hover:text-(--accent-ink)"
                  >
                    <SocialIcon id={s.id} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 py-5 sm:flex-row sm:items-end">
            <Link href="/designs/a" className="display text-3xl leading-none sm:text-4xl">
              Frank Chang
            </Link>
            <nav aria-label="Primary">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="smallcaps link-ink">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="rule border-b-[3px]" />
          <div className="rule mt-[3px] border-b" />
        </header>

        {/* Hero */}
        <section className="grid gap-10 py-14 md:grid-cols-12 md:items-center md:py-20">
          <div className="md:col-span-7">
            <p className="smallcaps mb-5">Hi, I&apos;m Frank · @{site.handle}</p>
            <h1 className="display text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem]">
              A dad in Belmont who{" "}
              <span className="display-italic text-(--accent)">makes things</span>{" "}
              and explains them plainly.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-(--ink-2)">
              {copy.intro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a
                href={copy.lanes[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="display inline-flex items-center gap-2 text-xl underline decoration-(--accent) decoration-2 underline-offset-[6px] transition-colors hover:text-(--accent-ink)"
              >
                Watch the latest
                <span aria-hidden>→</span>
              </a>
              <a href="#around" className="smallcaps link-ink">
                Or read first
              </a>
            </div>
          </div>
          <div className="md:col-span-5">
            <DeskScene className="w-full text-(--ink)" />
            <p className="smallcaps mt-3 text-center">Desk, most mornings.</p>
          </div>
        </section>

        {/* About */}
        <section id="about" className="rule border-t py-14 md:py-16">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="smallcaps">01 — About</p>
              <Squiggle className="mt-3 h-4 w-24" />
            </div>
            <div className="md:col-span-6">
              <p className="drop text-lg leading-relaxed">{copy.about[0]}</p>
              <p className="mt-5 text-lg leading-relaxed text-(--ink-2)">{copy.about[1]}</p>
              <p className="mt-5 text-lg leading-relaxed text-(--ink-2)">{copy.about[2]}</p>
            </div>
            <aside className="md:col-span-3 md:pl-6 md:border-l rule">
              <p className="display-italic text-2xl leading-snug text-(--accent)">
                “Process, not the highlight reel.”
              </p>
              <p className="smallcaps mt-4">House rule</p>
            </aside>
          </div>
        </section>

        {/* Around here */}
        <section id="around" className="rule border-t py-14 md:py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="smallcaps">02 — Around here</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Four rooms, one house.</h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm text-(--muted) sm:block">
              Everything on this site fits in one of these.
            </p>
          </div>
          <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {copy.lanes.map((lane, i) => {
              const Spot = spots[lane.id];
              return (
                <li key={lane.id} id={lane.id === "watch" ? "watch" : undefined} className="rule flex flex-col border-t pt-6">
                  <div className="flex items-start justify-between">
                    <span className="display text-(--muted)">0{i + 1}</span>
                    <Spot className="h-20 w-20 text-(--ink)" />
                  </div>
                  <h3 className="display mt-4 text-2xl">{lane.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-(--ink-2)">{lane.body}</p>
                  <a
                    href={laneHref("a", lane)}
                    {...laneLinkProps(lane)}
                    className="link-ink mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
                  >
                    {lane.cta}
                    {lane.external && <span aria-hidden>↗</span>}
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Say hi / soft coaching lane */}
        <section id="hello" className="rule border-t py-14 md:py-16">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <TwoChairs className="w-full max-w-sm text-(--ink)" />
            </div>
            <div className="md:col-span-7">
              <p className="smallcaps">03 — Say hi</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">{copy.coaching.title}</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-(--ink-2)">
                {copy.coaching.body}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                <a
                  href={copy.coaching.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-(--ink) px-5 py-2.5 text-sm font-medium text-(--bg) transition-colors hover:bg-(--accent-ink)"
                >
                  <SocialIcon id="x" className="h-3.5 w-3.5" />
                  {copy.coaching.cta}
                </a>
                <span className="text-sm text-(--muted)">
                  Or Instagram, if that&apos;s where you are.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="rule border-t py-8">
          <div className="rule border-b-[3px]" />
          <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="display text-xl">Frank Chang</p>
              <p className="smallcaps mt-1">{copy.footer}</p>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-ink inline-flex items-center gap-2 text-sm"
                  >
                    <SocialIcon id={s.id} className="h-3.5 w-3.5" />
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="smallcaps mt-6">© {year} Frank Chang · Design A of 3, draft</p>
        </footer>
      </div>
    </div>
  );
}
