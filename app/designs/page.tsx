import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { designs } from "@/lib/designs";

export const metadata: Metadata = {
  title: "Homepage candidate",
};

export default function DesignsIndex() {
  return (
    <div className="theme theme-photo flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-10 md:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-(--muted)">
          frankchangshow.com · draft
        </p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">Homepage candidate</h1>
        <p className="mt-4 max-w-[34rem] text-[1.125rem] leading-8 text-(--ink-2)">
          One design: a portrait, a short bio, and links. The photo slot is
          empty until Frank drops a file in.
        </p>

        <Link
          href="/designs/photo"
          className="mt-10 block overflow-hidden rounded-[3px] border border-(--rule) bg-(--frame) transition-colors hover:border-(--accent)"
        >
          <Image
            src="/previews/photo.png"
            alt="Screenshot of the photo and short bio homepage candidate"
            width={1440}
            height={900}
            className="h-auto w-full"
            priority
            unoptimized
          />
        </Link>
        <p className="mt-4">
          <Link href="/designs/photo" className="link">
            Open the candidate →
          </Link>
        </p>

        <div className="mt-16 border-t border-(--rule) pt-6 text-sm leading-7 text-(--muted)">
          <p>
            Retired after review: the three illustrated directions. Kept in the
            repo for reference only.
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-5">
            {designs.map((d) => (
              <li key={d.id}>
                <Link href={`/designs/archive/${d.id}`} className="link">
                  {d.letter} · {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
