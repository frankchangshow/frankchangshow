import type { Metadata } from "next";
import { Button, Container, Eyebrow, Section, SectionHeader, href } from "@/components/ui";
import { coaching, cta } from "@/lib/content";
import { VARIANT_META, type Variant } from "@/lib/variants";

export const metadata: Metadata = {
  title: "Coaching",
  description: coaching.intro,
};

export default async function CoachingPage({
  params,
}: {
  params: Promise<{ variant: Variant }>;
}) {
  const { variant } = await params;
  const { listStyle } = VARIANT_META[variant];
  const isCards = listStyle === "cards";

  return (
    <>
      <section className="hero-glow">
        <Container className="py-20 sm:py-28">
          <div className="rise max-w-3xl">
            <Eyebrow>{coaching.eyebrow}</Eyebrow>
            <h1 className="display mt-5 text-4xl leading-[1.05] sm:text-6xl md:text-[4.25rem]">
              {coaching.headline}
            </h1>
            <p className="rise rise-delay-1 mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              {coaching.intro}
            </p>
          </div>
        </Container>
      </section>

      <Section tone={isCards ? "canvas" : "surface"}>
        <SectionHeader eyebrow={coaching.process.eyebrow} title="Four steps, no surprises." />
        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {coaching.process.steps.map((step, i) => (
            <li
              key={step.title}
              className={
                isCards
                  ? "rounded-card border border-line bg-surface p-7"
                  : "border-t border-line pt-6"
              }
            >
              <p className="display text-accent text-lg">0{i + 1}</p>
              <p className="display mt-3 text-2xl">{step.title}</p>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeader
            eyebrow={coaching.principles.eyebrow}
            title="A few things you can count on."
          />
          <ul className="divide-y divide-line border-y border-line">
            {coaching.principles.items.map((item) => (
              <li key={item.title} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
                <p className="display text-xl">{item.title}</p>
                <p className="leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone={isCards ? "surface" : "canvas"} className={isCards ? "" : "border-t border-line"}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeader eyebrow={coaching.investment.eyebrow} title={coaching.investment.title} />
          <p className="self-center text-lg leading-relaxed text-muted">{coaching.investment.body}</p>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow={coaching.faq.eyebrow} title="Before you ask." />
        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {coaching.faq.items.map((item) => (
            <div key={item.q}>
              <dt className="display text-xl">{item.q}</dt>
              <dd className="mt-3 leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="surface">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="display text-3xl leading-tight sm:text-4xl">
            Ready to start the conversation?
          </h2>
          <Button href={href(variant, "/apply")} size="lg">
            {cta.primary}
          </Button>
        </div>
      </Section>
    </>
  );
}
