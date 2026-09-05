import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { Container, Eyebrow } from "@/components/ui";
import { apply, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Apply",
  description: apply.intro,
};

export default function ApplyPage() {
  return (
    <section className="hero-glow">
      <Container className="py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="rise">
            <Eyebrow>{apply.eyebrow}</Eyebrow>
            <h1 className="display mt-5 text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              {apply.headline}
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-muted">{apply.intro}</p>

            <div className="mt-12 border-t border-line pt-8">
              <p className="eyebrow">{apply.next.title}</p>
              <ol className="mt-5 space-y-4">
                {apply.next.steps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="display text-accent w-6 shrink-0">{i + 1}</span>
                    <span className="leading-relaxed text-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-10 text-sm text-muted">
              Prefer email?{" "}
              <a href={`mailto:${site.email}`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                {site.email}
              </a>
            </p>
          </div>

          <div className="rise rise-delay-1 self-start rounded-card border border-line bg-surface p-6 sm:p-10">
            <ApplyForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
