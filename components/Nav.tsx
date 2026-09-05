import Link from "next/link";
import { Container, href } from "@/components/ui";
import { cta, nav, site } from "@/lib/content";
import type { Variant } from "@/lib/variants";

export function Nav({ variant }: { variant: Variant }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link
          href={href(variant, "/")}
          className="display text-lg tracking-tight sm:text-xl"
        >
          {site.name}
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={href(variant, item.href)}
              className="rounded-btn px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={href(variant, "/apply")}
            className="ml-1 inline-flex h-9 items-center rounded-btn bg-ink px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-85 sm:ml-2"
          >
            <span className="sm:hidden">Apply</span>
            <span className="hidden sm:inline">{cta.primary}</span>
          </Link>
        </nav>
      </Container>
    </header>
  );
}
