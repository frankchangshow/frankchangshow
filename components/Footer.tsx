import Link from "next/link";
import { Container, href } from "@/components/ui";
import { nav, site } from "@/lib/content";
import type { Variant } from "@/lib/variants";

export function Footer({ variant }: { variant: Variant }) {
  return (
    <footer className="border-t border-line">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.5fr_1fr_1fr] sm:py-16">
        <div>
          <p className="display text-2xl">{site.name}</p>
          <p className="mt-2 text-sm text-muted">
            Private coaching · {site.location}
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-4">Site</p>
          <ul className="space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={href(variant, item.href)}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={href(variant, "/apply")}
                className="text-muted transition-colors hover:text-ink"
              >
                Apply
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-2.5">
            {site.social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Frank Chang. All rights reserved.</p>
        <Link href="/" className="transition-colors hover:text-ink">
          Compare design directions
        </Link>
      </Container>
    </footer>
  );
}
