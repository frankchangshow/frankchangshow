"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 border-b border-line/80 bg-void/70 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-5 md:h-16 md:px-8">
          <Link
            href="/"
            className="font-mono text-[11px] tracking-[0.28em] uppercase"
          >
            FCS
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-[11px] tracking-[0.22em] uppercase transition-colors ${
                  pathname === item.href
                    ? "text-signal"
                    : "text-mute hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-index"
          >
            {open ? "Close" : "Index"}
          </button>
        </div>
      </header>

      {open ? (
        <div
          id="site-index"
          className="fixed inset-0 z-30 flex flex-col justify-end bg-void px-5 pb-16 md:hidden"
        >
          <nav className="flex flex-col gap-2">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-display text-6xl leading-none ${
                  pathname === item.href ? "italic text-signal" : "text-ink"
                }`}
              >
                <span className="mr-4 font-mono text-xs tracking-widest text-mute">
                  0{index + 1}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
