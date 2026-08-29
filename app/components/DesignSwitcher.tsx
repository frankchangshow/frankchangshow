"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { designs } from "@/lib/designs";

export function DesignSwitcher() {
  const pathname = usePathname();

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-full border border-line bg-void/95 px-3 py-2 shadow-lg backdrop-blur-md">
      <p className="mb-1 px-1 text-[10px] tracking-[0.18em] text-mute uppercase">
        Designs
      </p>
      <div className="flex items-center gap-1">
        {designs.map((design) => {
          const active =
            design.href === "/"
              ? pathname === "/" ||
                pathname === "/about" ||
                pathname === "/work" ||
                pathname === "/watch"
              : pathname === design.href;
          return (
            <Link
              key={design.href}
              href={design.href}
              className={`rounded-full px-3 py-1.5 font-display text-xs font-bold ${
                active ? "bg-signal text-white" : "text-mute hover:text-white"
              }`}
            >
              {design.label}{" "}
              <span className="hidden sm:inline font-sans font-medium">
                {design.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
