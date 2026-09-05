import type { Metadata } from "next";
import { Button, Container, Eyebrow, Section, href } from "@/components/ui";
import { about, cta } from "@/lib/content";
import type { Variant } from "@/lib/variants";

export const metadata: Metadata = {
  title: "About",
  description: about.paragraphs[0],
};

function Portrait() {
  // Placeholder until a photograph is supplied. Swap for <Image> when ready.
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-surface-2"
    >
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_25%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--ink)_18%,transparent),transparent)]" />
      <span className="display absolute bottom-6 left-6 text-6xl text-ink/70 sm:text-7xl">
        FC
      </span>
    </div>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ variant: Variant }>;
}) {
  const { variant } = await params;

  return (
    <>
      <section className="hero-glow">
        <Container className="py-20 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
            <div className="rise order-2 lg:order-1">
              <Eyebrow>{about.eyebrow}</Eyebrow>
              <h1 className="display mt-5 text-5xl leading-none sm:text-7xl">
                {about.headline}
              </h1>
              <div className="mt-10 space-y-6 text-lg leading-relaxed sm:text-xl">
                {about.paragraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? "text-ink" : "text-muted"}>
                    {p}
                  </p>
                ))}
              </div>
              <p className="display mt-10 text-2xl">{about.closing}</p>
              <div className="mt-8">
                <Button href={href(variant, "/apply")} size="lg">
                  {cta.primary}
                </Button>
              </div>
            </div>
            <div className="rise rise-delay-1 order-1 lg:order-2 lg:pt-12">
              <div className="mx-auto max-w-sm lg:max-w-none">
                <Portrait />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="surface" className="border-t border-line">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.facts.map((f) => (
            <div key={f.label} className="border-t border-line pt-5">
              <dt className="eyebrow">{f.label}</dt>
              <dd className="display mt-3 text-xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
