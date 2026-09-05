export type DesignId = "a" | "b" | "c";

export type Design = {
  id: DesignId;
  letter: string;
  name: string;
  tagline: string;
  description: string;
  palette: { name: string; hex: string }[];
  type: string;
  graphics: string;
};

export const designs: Design[] = [
  {
    id: "a",
    letter: "A",
    name: "Soft Editorial",
    tagline: "Paper, ink, and a coral pencil.",
    description:
      "Magazine typography on cream stock. Hairline rules, numbered sections, and hand-drawn line illustrations. Quiet, literate, warm.",
    palette: [
      { name: "Cream", hex: "#F6F1E7" },
      { name: "Ink", hex: "#1F1D1A" },
      { name: "Charcoal", hex: "#4A4640" },
      { name: "Coral", hex: "#D95D45" },
      { name: "Amber", hex: "#D9A441" },
    ],
    type: "Fraunces + Instrument Sans",
    graphics: "Monoline ink illustrations with coral and amber spot fills",
  },
  {
    id: "b",
    letter: "B",
    name: "Clean Modern Product",
    tagline: "Airy, crisp, deep teal.",
    description:
      "White and light gray with rounded cards and generous space. Deep teal primary, crisp geometric SVG icons. Calm and organized, never corporate.",
    palette: [
      { name: "Mist", hex: "#F3F6F6" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Deep Teal", hex: "#0E5E5B" },
      { name: "Sea Glass", hex: "#CDE7E2" },
      { name: "Slate", hex: "#17292B" },
    ],
    type: "Manrope",
    graphics: "Crisp two-tone SVG icon set and layered geometric hero",
  },
  {
    id: "c",
    letter: "C",
    name: "Warm Living Room",
    tagline: "Peach, sand, olive. Pull up a chair.",
    description:
      "A cozy palette with soft blob shapes, wavy dividers, and a playful illustrated living room. Friendly and grown-up at the same time.",
    palette: [
      { name: "Peach", hex: "#F7D8C2" },
      { name: "Sand", hex: "#F3E7D3" },
      { name: "Olive", hex: "#6C7A46" },
      { name: "Terracotta", hex: "#C8694A" },
      { name: "Cocoa", hex: "#42322B" },
    ],
    type: "Gabarito + Nunito Sans",
    graphics: "Flat-shape living room scene, sun and plant spot art",
  },
];

export const designIds = designs.map((d) => d.id);

export function getDesign(id: string): Design | undefined {
  return designs.find((d) => d.id === id);
}

export const sections = ["exclusives", "digests", "dashboard"] as const;
export type SectionId = (typeof sections)[number];

export const sectionMeta: Record<
  SectionId,
  { title: string; kicker: string; note: string }
> = {
  exclusives: {
    title: "Exclusives",
    kicker: "Long-form",
    note: "Long-form pieces released alongside the videos.",
  },
  digests: {
    title: "Daily Digest",
    kicker: "Most days",
    note: "A short note most days: what I looked at, what I learned, what's next.",
  },
  dashboard: {
    title: "Money Dashboard",
    kicker: "Weekdays",
    note: "A public weekday look at how things are going. Updated on weekdays.",
  },
};
