import { Arrow, Button, Container, Eyebrow, Section, SectionHeader, href } from "@/components/ui";
import { cta, home, site } from "@/lib/content";
import { VARIANT_META, type Variant } from "@/lib/variants";

function Headline({ text }: { text: string }) {
  // Emphasise the final two words ("move forward.") in the display face.
  const words = text.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");
  return (
    <>
      {head} <em>{tail}</em>
    </>
  );
}

function Hero({ variant }: { variant: Variant }) {
  const meta = VARIANT_META[variant];
  const centered = meta.heroAlign === "center";

  return (
    <section className="hero-glow relative overflow-hidden">
      <Container
        className={`flex min-h-[78vh] flex-col justify-center py-24 sm:py-32 ${
          centered ? "items-center text-center" : ""
        }`}
      >
        <div className={`rise ${centered ? "max-w-3xl" : "max-w-4xl"}`}>
          <Eyebrow>{home.eyebrow}</Eyebrow>
          <h1 className="display mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            <Headline text={home.headline} />
          </h1>
          <p
            className={`rise rise-delay-1 mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl ${
              centered ? "mx-auto" : ""
            }`}
          >
            {home.subhead}
          </p>
          <div
            className={`rise rise-delay-2 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center ${
              centered ? "justify-center" : ""
            }`}
          >
            <Button href={href(variant, "/apply")} size="lg">
              {cta.primary}
            </Button>
            <Button href={href(variant, "/coaching")} kind="ghost" size="lg" className="group">
              {cta.secondary} <Arrow />
            </Button>
          </div>
          <p className="rise rise-delay-3 mt-10 flex items-center gap-2.5 text-sm text-muted">
            <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {home.availabilityNote}
            <span className={centered ? "hidden" : "hidden sm:inline"}>· {site.location}</span>
          </p>
        </div>
      </Container>
    </section>
  );
}

function WhoFor({ variant }: { variant: Variant }) {
  const { listStyle } = VARIANT_META[variant];
  const { whoFor } = home;

  return (
    <Section tone={listStyle === "cards" ? "canvas" : "surface"}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeader eyebrow={whoFor.eyebrow} title={whoFor.title} />

        {listStyle === "rules" ? (
          <ul className="divide-y divide-line border-y border-line">
            {whoFor.items.map((item) => (
              <li key={item.title} className="grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <p className="display text-xl">{item.title}</p>
                <p className="leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {listStyle === "numbered" ? (
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {whoFor.items.map((item, i) => (
              <li key={item.title}>
                <p className="display text-accent text-lg">0{i + 1}</p>
                <p className="display mt-3 text-2xl">{item.title}</p>
                <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {listStyle === "cards" ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {whoFor.items.map((item) => (
              <li key={item.title} className="rounded-card border border-line bg-surface p-7">
                <p className="display text-xl">{item.title}</p>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
}

function WorkOn({ variant }: { variant: Variant }) {
  const { listStyle } = VARIANT_META[variant];
  const { workOn } = home;
  const marker =
    listStyle === "rules" ? (
      <span aria-hidden="true" className="mt-3 h-px w-6 shrink-0 bg-accent" />
    ) : (
      <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-accent" />
    );

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeader eyebrow={workOn.eyebrow} title={workOn.title} intro={workOn.intro} />
        <ul className="grid gap-x-10 gap-y-5 self-center sm:grid-cols-2">
          {workOn.items.map((item) => (
            <li key={item} className="flex gap-4 text-lg leading-snug">
              {marker}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Sessions({ variant }: { variant: Variant }) {
  const { listStyle } = VARIANT_META[variant];
  const { sessions } = home;
  const isCards = listStyle === "cards";

  return (
    <Section tone={isCards ? "surface" : "canvas"} className={isCards ? "" : "border-t border-line"}>
      <SectionHeader eyebrow={sessions.eyebrow} title={sessions.title} />
      <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {sessions.items.map((item, i) => (
          <li
            key={item.title}
            className={
              isCards
                ? "rounded-card bg-canvas p-8"
                : "border-t border-line pt-6"
            }
          >
            {listStyle === "numbered" ? (
              <p className="display text-accent text-lg">0{i + 1}</p>
            ) : null}
            <p className="display mt-2 text-2xl">{item.title}</p>
            <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Availability({ variant }: { variant: Variant }) {
  const { listStyle } = VARIANT_META[variant];
  const { availability } = home;

  return (
    <Section>
      <div
        className={`grid gap-10 rounded-card p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:p-16 ${
          listStyle === "cards"
            ? "bg-ink text-canvas"
            : listStyle === "numbered"
              ? "border border-accent/40 bg-surface"
              : "border-y border-line"
        }`}
      >
        <div>
          <p className={`eyebrow ${listStyle === "cards" ? "text-canvas/60!" : ""}`}>
            {availability.eyebrow}
          </p>
          <h2 className="display mt-4 text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
            {availability.title}
          </h2>
        </div>
        <div className="flex flex-col justify-between gap-8">
          <p className={`leading-relaxed ${listStyle === "cards" ? "text-canvas/75" : "text-muted"}`}>
            {availability.body}
          </p>
          <div>
            <Button
              href={href(variant, "/apply")}
              size="lg"
              className={listStyle === "cards" ? "bg-canvas! text-ink!" : ""}
            >
              {cta.primary}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ variant: Variant }>;
}) {
  const { variant } = await params;
  return (
    <>
      <Hero variant={variant} />
      <WhoFor variant={variant} />
      <WorkOn variant={variant} />
      <Sessions variant={variant} />
      <Availability variant={variant} />
    </>
  );
}
