import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { VARIANTS, isVariant } from "@/lib/variants";

export const dynamicParams = false;

export function generateStaticParams() {
  return VARIANTS.map((variant) => ({ variant }));
}

export default async function VariantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  if (!isVariant(variant)) notFound();

  return (
    <div data-theme={variant} className="theme-root theme-page flex min-h-screen flex-1 flex-col">
      <Nav variant={variant} />
      <main className="flex-1">{children}</main>
      <Footer variant={variant} />
    </div>
  );
}
