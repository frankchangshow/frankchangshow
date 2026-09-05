export const site = {
  name: "Frank Chang",
  handle: "frankchangshow",
  location: "Belmont, California",
  shortLocation: "Belmont, CA",
  url: "https://frankchangshow.com",
} as const;

// Public accounts already on brand. Do not add accounts that are not live.
export const socials = [
  {
    id: "x",
    name: "X",
    label: "@frankchangshow on X",
    href: "https://x.com/frankchangshow",
    handle: "@frankchangshow",
  },
  {
    id: "youtube",
    name: "YouTube",
    label: "frankchangshow on YouTube",
    href: "https://www.youtube.com/@frankchangshow",
    handle: "@frankchangshow",
  },
  {
    id: "instagram",
    name: "Instagram",
    label: "frankchangshow on Instagram",
    href: "https://www.instagram.com/frankchangshow",
    handle: "@frankchangshow",
  },
  {
    id: "tiktok",
    name: "TikTok",
    label: "frankchangshow on TikTok",
    href: "https://www.tiktok.com/@frankchangshow",
    handle: "@frankchangshow",
  },
] as const;

export type SocialId = (typeof socials)[number]["id"];

export const youtube = socials.find((s) => s.id === "youtube")!;
export const x = socials.find((s) => s.id === "x")!;
export const instagram = socials.find((s) => s.id === "instagram")!;

// Shared copy. Same voice across all three designs: warm, plain, short.
export const copy = {
  intro:
    "I make videos, write the occasional long-form piece, and keep a public weekday money dashboard. This is my home on the internet.",
  about: [
    "Dad in Belmont. I like building things and explaining them plainly.",
    "Most of what I share is the process, not the highlight reel. If it worked, I show it. If it didn't, I show that too.",
    "You'll find me on YouTube most often. The site is where the longer pieces and the numbers live.",
  ],
  lanes: [
    {
      id: "watch",
      title: "Watch",
      body: "Videos about building things, money in the open, and life on the Peninsula.",
      cta: "YouTube channel",
      href: youtube.href,
      external: true,
    },
    {
      id: "exclusives",
      title: "Exclusives",
      body: "Long-form pieces that go with the videos. The full story, with the details that don't fit in ten minutes.",
      cta: "Read the Exclusives",
      href: "exclusives",
      external: false,
    },
    {
      id: "digests",
      title: "Daily Digest",
      body: "A short note most days. What I looked at, what I learned, what's next.",
      cta: "Browse the Digest",
      href: "digests",
      external: false,
    },
    {
      id: "dashboard",
      title: "Money Dashboard",
      body: "A public weekday look at how things are going. Real numbers, updated on weekdays, no spin.",
      cta: "Open the dashboard",
      href: "dashboard",
      external: false,
    },
  ],
  coaching: {
    title: "Want to talk it through?",
    body: "I do a small amount of one-on-one coaching for people building something on the side. No program, no pitch. If that sounds useful, send me a message and we'll see if it's a fit.",
    cta: "Say hi on X",
    href: x.href,
  },
  footer: "Made in Belmont, California.",
} as const;

export type Lane = (typeof copy.lanes)[number];
