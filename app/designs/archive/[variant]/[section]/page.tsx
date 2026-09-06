import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  designIds,
  getDesign,
  sectionMeta,
  sections,
  type DesignId,
  type SectionId,
} from "@/lib/designs";
import { site } from "@/lib/site";

type Params = { variant: string; section: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return designIds.flatMap((variant) =>
    sections.map((section) => ({ variant, section })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { variant, section } = await params;
  const design = getDesign(variant);
  const meta = sectionMeta[section as SectionId];
  if (!design || !meta) return {};
  return { title: `${meta.title} · Design ${design.letter}` };
}

export default async function SectionStub({
  params,
}: {
  params: Promise<Params>;
}) {
  const { variant, section } = await params;
  const design = getDesign(variant);
  const meta = sectionMeta[section as SectionId];
  if (!design || !meta) notFound();

  const id = design.id as DesignId;
  const displayClass = "display";

  return (
    <div className={`theme theme-${id} flex-1`}>
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <Link
          href={`/designs/archive/${id}`}
          className="inline-flex items-center gap-2 text-sm text-(--muted) transition-colors hover:text-(--accent-ink)"
        >
          <span aria-hidden>←</span> Back to design {design.letter}
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-(--accent-ink)">
          {meta.kicker}
        </p>
        <h1 className={`${displayClass} mt-3 text-4xl sm:text-5xl`}>{meta.title}</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-(--ink-2)">{meta.note}</p>

        <div
          role="note"
          className="mt-12 rounded-2xl border-2 border-dashed border-(--rule) p-6 sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">
            Draft placeholder
          </p>
          <p className="mt-3 leading-relaxed text-(--ink-2)">
            This route is a layout stub for the design preview. The real{" "}
            {meta.title} content lives on Origin (frankchangshow-com) and gets wired
            in after a design is picked. Nothing on this page is real content.
          </p>
          <ul className="mt-6 space-y-3" aria-hidden>
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="h-10 w-14 shrink-0 rounded-lg bg-(--rule) opacity-70" />
                <span className="flex-1 space-y-2">
                  <span className="block h-3 w-3/5 rounded bg-(--rule)" />
                  <span className="block h-3 w-2/5 rounded bg-(--rule) opacity-70" />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-sm text-(--muted)">
          {site.name}
        </p>
      </div>
    </div>
  );
}
