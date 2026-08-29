"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { SocialIcons } from "./SocialIcons";

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
      <header className="sticky top-0 z-40 border-b border-line bg-void">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            Frank Chang
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-1 text-[15px] transition-colors ${
                  pathname === item.href
                    ? "text-white after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-signal"
                    : "text-mute hover:text-signal"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <SocialIcons />
          </div>

          <button
            type="button"
            className="text-sm text-mute md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-30 bg-panel px-5 pt-24 md:hidden">
          <nav className="flex flex-col gap-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-display text-3xl font-bold ${
                  pathname === item.href ? "text-signal" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10">
            <SocialIcons />
          </div>
        </div>
      ) : null}
    </>
  );
}
