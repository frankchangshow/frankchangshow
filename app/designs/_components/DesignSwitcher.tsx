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

function SwitcherBar() {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const match = pathname.match(/^\/designs\/([abc])(?:\/|$)/);
  const current = match?.[1];
  const design = designs.find((d) => d.id === current);

  // `?shot=1` hides the preview chrome so screenshots show only the design.
  if (searchParams.get("shot") === "1") return null;

  return (
    <nav
      aria-label="Design preview switcher"
      className="design-switcher flex items-center gap-1 rounded-full border border-white/10 bg-[#141516]/92 p-1 text-[13px] text-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur"
    >
      <Link
        href="/designs"
        className="rounded-full px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        All
      </Link>
      <span className="h-4 w-px bg-white/15" aria-hidden />
      {designs.map((d) => {
        const active = d.id === current;
        return (
          <Link
            key={d.id}
            href={`/designs/${d.id}`}
            aria-current={active ? "page" : undefined}
            title={`${d.letter} · ${d.name}`}
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
      {design ? (
        <span className="hidden pl-2 pr-3 text-white/60 sm:inline">
          {design.name}
        </span>
      ) : (
        <span className="pl-2 pr-3 text-white/60">Draft preview</span>
      )}
    </nav>
  );
}
