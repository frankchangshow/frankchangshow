import type { Metadata } from "next";
import Link from "next/link";
import { site, socials, x } from "@/lib/site";
import { findPortrait, Portrait } from "./Portrait";

export const metadata: Metadata = {
  title: "Frank Chang",
  description: "Frank Chang.",
};

const bio = [
  "I make videos about building things and about money, and I keep the numbers in the open.",
  "Most of what I share is the process, not the highlight reel.",
  "This is my home on the internet.",
];

const sections = [
  { label: "Exclusives", href: "/designs/photo/exclusives" },
  { label: "Daily Digest", href: "/designs/photo/digests" },
  { label: "Money Dashboard", href: "/designs/photo/dashboard" },
];

export default function PhotoCandidate() {
  const portrait = findPortrait();
  const year = new Date().getFullYear();

  return (
    <div className="theme theme-photo flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-14 sm:px-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-24">
          <div className="mx-auto w-full max-w-[320px] md:mx-0 md:max-w-none">
            <Portrait src={portrait} />
          </div>

          <div className="md:pt-2">
            <h1 className="display text-4xl leading-none sm:text-5xl">{site.name}</h1>

            <div className="mt-8 max-w-[34rem] space-y-4 text-[1.125rem] leading-8 text-(--ink-2)">
              <p>{bio[0]}</p>
              <p>
                {bio[1]} {bio[2]}
              </p>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="link"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-12 max-w-[34rem] text-[0.95rem] leading-7 text-(--muted)">
              I also do a little one-on-one coaching. If that would help,{" "}
              <a href={x.href} target="_blank" rel="noopener noreferrer" className="link">
                message me on X
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 pb-10 sm:px-10">
        <div className="flex flex-col gap-3 border-t border-(--rule) pt-6 text-sm text-(--muted) sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {sections.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="link">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            © {year} {site.name}
          </p>
        </div>
      </footer>
    </div>
  );
}
