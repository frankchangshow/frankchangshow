export const socials = [
  { name: "YouTube", href: "https://www.youtube.com/@frankchangshow" },
  { name: "Instagram", href: "https://www.instagram.com/frankchangshow" },
  { name: "TikTok", href: "https://www.tiktok.com/@frankchangshow" },
  { name: "GitHub", href: "https://github.com/frankchangshow" },
] as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/watch", label: "Watch" },
] as const;

export const projects = [
  {
    title: "Claude-of-Duty",
    description:
      "A Call of Duty-quality FPS in Three.js, built from a single prompt.",
    href: "https://github.com/frankchangshow/Claude-of-Duty",
    stack: "Three.js",
  },
  {
    title: "Starfall",
    description:
      "A Homeworld-style, universe-scale space RTS in the browser. Procedural hulls, planets and effects. No image assets.",
    href: "https://github.com/frankchangshow/starfall",
    stack: "Three.js",
  },
  {
    title: "snowflow_demo",
    description:
      "Real-time procedural snow with WebGPU, Babylon.js, and hand-written WGSL. GPU terrain, snow deformation, atmosphere.",
    href: "https://github.com/frankchangshow/snowflow_demo",
    stack: "WebGPU / WGSL",
  },
  {
    title: "kart-royale",
    description:
      "A Mario Kart-style racer in the browser. Every texture, mesh, material and sound is generated in code.",
    href: "https://github.com/frankchangshow/kart-royale",
    stack: "Three.js",
  },
  {
    title: "apex-formula-2026",
    description: "An original browser-based open-wheel racing simulator.",
    href: "https://github.com/frankchangshow/apex-formula-2026",
    stack: "Browser",
  },
  {
    title: "cinder-ops",
    description:
      "Browser first-person shooter in Three.js. Clear Ashline Block, then extract. Procedural world, zero external assets.",
    href: "https://github.com/frankchangshow/cinder-ops",
    stack: "Three.js",
  },
  {
    title: "sakura-crossing",
    description:
      "An explorable Japanese suburban railway-crossing neighbourhood on a small planet, rendered 3D-to-2D as a cel-shaded anime background.",
    href: "https://github.com/frankchangshow/sakura-crossing",
    stack: "Three.js",
  },
  {
    title: "pastel-nuketown",
    description:
      "Browser multiplayer FPS. Pastel Nuketown arena, host-authoritative WebSocket networking, AI bots, LAN play.",
    href: "https://github.com/frankchangshow/pastel-nuketown",
    stack: "Three.js / WS",
  },
  {
    title: "der-koloss-ce",
    description:
      "Round-based zombie survival as a tribute to Der Riese. Three.js, no engine, no install, no build step.",
    href: "https://github.com/frankchangshow/der-koloss-ce",
    stack: "Three.js",
  },
] as const;
