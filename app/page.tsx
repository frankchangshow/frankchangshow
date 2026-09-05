import Link from "next/link";
import { home } from "@/lib/content";
import { VARIANTS, VARIANT_META } from "@/lib/variants";

const PAGES = [
  { label: "Home", path: "" },
  { label: "Coaching", path: "/coaching" },
  { label: "About", path: "/about" },
  { label: "Apply", path: "/apply" },
];

export default function DirectionsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-8 sm:py-24">
      <p className="eyebrow">frankchangshow.com</p>
      <h1 className="display mt-4 max-w-2xl text-4xl leading-[1.05] sm:text-5xl">
        Three design directions for the coaching site.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        Same pages and copy in each. Pick the one that feels most like you and the
        others fall away. Every direction includes Home, Coaching, About and Apply,
        and is fully mobile-responsive.
      </p>

      <ul className="mt-14 grid gap-6 lg:grid-cols-3">
        {VARIANTS.map((slug, i) => {
          const v = VARIANT_META[slug];
          return (
            <li
              key={slug}
              data-theme={slug}
              className="theme-root flex flex-col overflow-hidden rounded-xl border border-line"
            >
              <Link href={`/${slug}`} className="block p-7 transition-opacity hover:opacity-90 sm:p-8">
                <p className="eyebrow">Direction {i + 1}</p>
                <p className="display mt-3 text-4xl">{v.name}</p>
                <p className="mt-1 text-sm text-muted">{v.mood}</p>
                <div className="mt-8 border-t border-line pt-6">
                  <p className="display text-2xl leading-tight">
                    {home.headline.replace("move forward.", "")}
                    <em>move forward.</em>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{home.subhead}</p>
                  <span className="mt-5 inline-flex h-10 items-center rounded-btn bg-accent px-4 text-sm font-medium text-accent-fg">
                    Apply for coaching
                  </span>
                </div>
              </Link>
              <div className="mt-auto border-t border-line bg-surface p-7 sm:p-8">
                <div className="flex items-center gap-2">
                  {v.swatches.map((c) => (
                    <span
                      key={c}
                      className="size-6 rounded-full border border-line"
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                  <span className="ml-auto text-xs text-muted">{v.typeSample}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{v.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {PAGES.map((p) => (
                    <Link
                      key={p.path}
                      href={`/${slug}${p.path}`}
                      className="rounded-btn border border-line px-3 py-1.5 text-xs text-ink transition-colors hover:border-ink"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
