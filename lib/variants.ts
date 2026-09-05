export const VARIANTS = ["ivory", "forest", "slate"] as const;
export type Variant = (typeof VARIANTS)[number];

export function isVariant(value: string): value is Variant {
  return (VARIANTS as readonly string[]).includes(value);
}

export type VariantMeta = {
  slug: Variant;
  name: string;
  mood: string;
  description: string;
  swatches: string[];
  typeSample: string;
  /** Structural choices that differ between directions. */
  heroAlign: "left" | "center";
  listStyle: "rules" | "cards" | "numbered";
};

export const VARIANT_META: Record<Variant, VariantMeta> = {
  ivory: {
    slug: "ivory",
    name: "Ivory",
    mood: "Editorial · warm · literary",
    description:
      "Ivory paper, ink type, a bronze accent. Fraunces serif headlines with hairline rules and sharp corners. Feels like a well-made book — quiet, considered, selective.",
    swatches: ["#f6f1e8", "#1b1813", "#8a5a2b", "#ddd4c4"],
    typeSample: "Fraunces + Inter",
    heroAlign: "left",
    listStyle: "rules",
  },
  forest: {
    slug: "forest",
    name: "Forest",
    mood: "Grounded · dark · intimate",
    description:
      "Deep forest green with cream type and a soft gold accent. Instrument Serif italics against Manrope. Feels like a late-evening conversation — private, steady, unhurried.",
    swatches: ["#0f1a15", "#eee7d7", "#d2b073", "#29392f"],
    typeSample: "Instrument Serif + Manrope",
    heroAlign: "center",
    listStyle: "numbered",
  },
  slate: {
    slug: "slate",
    name: "Slate",
    mood: "Modern · cool · precise",
    description:
      "Cool grey canvas, near-black type, one cobalt accent. Geist throughout with pill buttons and soft cards. Feels like a modern practice — clear, direct, professional.",
    swatches: ["#f4f5f7", "#0e1320", "#2b4bee", "#ffffff"],
    typeSample: "Geist",
    heroAlign: "left",
    listStyle: "cards",
  },
};
