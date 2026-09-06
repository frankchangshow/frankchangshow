"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { designs } from "@/lib/designs";

export function DesignSwitcher() {
  return (
    <Suspense fallback={null}>
      <SwitcherBar />
    </Suspense>
  );
}

// Only shown on the retired A/B/C archive routes. The live candidate at
// /designs/photo renders without any preview chrome.
function SwitcherBar() {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const match = pathname.match(/^\/designs\/archive\/([abc])(?:\/|$)/);
  if (!match) return null;
  if (searchParams.get("shot") === "1") return null;

  const current = match[1];
  const design = designs.find((d) => d.id === current);

  return (
    <nav
      aria-label="Retired design switcher"
      className="design-switcher flex items-center gap-1 rounded-full border border-white/10 bg-[#141516]/92 p-1 text-[13px] text-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur"
    >
      <Link
        href="/designs/photo"
        className="rounded-full px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        Candidate
      </Link>
      <span className="h-4 w-px bg-white/15" aria-hidden />
      {designs.map((d) => {
        const active = d.id === current;
        return (
          <Link
            key={d.id}
            href={`/designs/archive/${d.id}`}
            aria-current={active ? "page" : undefined}
            title={`${d.letter} · ${d.name} (retired)`}
            className={
              "flex h-7 w-7 items-center justify-center rounded-full font-semibold transition " +
              (active
                ? "bg-white text-[#141516]"
                : "text-white/70 hover:bg-white/10 hover:text-white")
            }
          >
            {d.letter}
          </Link>
        );
      })}
      <span className="hidden pl-2 pr-3 text-white/60 sm:inline">
        Retired · {design?.name}
      </span>
    </nav>
  );
}
