import Link from "next/link";
import type { ReactNode } from "react";
import type { Variant } from "@/lib/variants";

export function href(variant: Variant, path: string) {
  return `/${variant}${path === "/" ? "" : path}`;
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  kind?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

export function Button({
  href,
  children,
  kind = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-[transform,background-color,color,border-color] duration-200 active:scale-[0.98]";
  const sizes = size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm";
  const kinds =
    kind === "primary"
      ? "bg-accent text-accent-fg hover:brightness-110"
      : "border border-line text-ink hover:border-ink";
  return (
    <Link href={href} className={`${base} ${sizes} ${kinds} ${className}`}>
      {children}
    </Link>
  );
}

export function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Section({
  children,
  className = "",
  tone = "canvas",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "canvas" | "surface";
  id?: string;
}) {
  const bg = tone === "surface" ? "bg-surface" : "";
  return (
    <section id={id} className={`py-20 sm:py-28 ${bg} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="display mt-4 text-3xl leading-[1.1] sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>
      ) : null}
    </div>
  );
}

export function Rule() {
  return <hr className="border-0 border-t border-line" />;
}
