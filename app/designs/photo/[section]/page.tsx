import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sectionMeta, sections, type SectionId } from "@/lib/designs";
import { site } from "@/lib/site";

type Params = { section: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return sections.map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { section } = await params;
  const meta = sectionMeta[section as SectionId];
  return meta ? { title: meta.title } : {};
}

export default async function PhotoSectionStub({
  params,
}: {
  params: Promise<Params>;
}) {
  const { section } = await params;
  const meta = sectionMeta[section as SectionId];
  if (!meta) notFound();

  return (
    <div className="theme theme-photo flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-14 sm:px-10 md:pt-24">
        <Link href="/designs/photo" className="link text-sm text-(--muted)">
          ← {site.name}
        </Link>
        <h1 className="display mt-10 text-4xl sm:text-5xl">{meta.title}</h1>
        <p className="mt-4 max-w-[34rem] text-[1.125rem] leading-8 text-(--ink-2)">{meta.note}</p>
        <p className="mt-12 max-w-[34rem] border-l-2 border-(--rule) pl-4 text-sm leading-7 text-(--muted)">
          Layout stub. The real {meta.title} content lives on Origin
          (frankchangshow-com) and is wired in after the design is picked.
          Nothing here is real content.
        </p>
      </main>
    </div>
  );
}
