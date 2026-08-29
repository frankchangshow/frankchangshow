export default function Work() {
  const projects = [
    {
      title: 'Claude-of-Duty',
      description: 'A Call of Duty-quality FPS in Three.js, built from a single prompt.',
      href: 'https://github.com/frankchangshow/Claude-of-Duty',
      tags: ['Three.js', 'FPS', 'Procedural'],
    },
    {
      title: 'Starfall',
      description: 'A Homeworld-style, universe-scale space RTS in the browser. Procedural hulls, planets and effects with no image assets.',
      href: 'https://github.com/frankchangshow/starfall',
      tags: ['Three.js', 'RTS', 'Space'],
    },
    {
      title: 'Snowflow Demo',
      description: 'Real-time procedural snow rendering with WebGPU, Babylon.js and hand-written WGSL. GPU-generated terrain, snow deformation, and atmospheric effects.',
      href: 'https://github.com/frankchangshow/snowflow_demo',
      tags: ['WebGPU', 'Babylon.js', 'WGSL'],
    },
    {
      title: 'Kart Royale',
      description: 'A Mario Kart-style racer in the browser with zero art assets. Every texture, mesh, material and sound is generated in code.',
      href: 'https://github.com/frankchangshow/kart-royale',
      tags: ['Three.js', 'Racing', 'Procedural'],
    },
    {
      title: 'APEX FORMULA 2026',
      description: 'An original browser-based open-wheel racing simulator.',
      href: 'https://github.com/frankchangshow/apex-formula-2026',
      tags: ['Racing', 'Simulation'],
    },
    {
      title: 'Cinder Ops',
      description: 'Browser first-person shooter in Three.js. Procedural world with zero external assets.',
      href: 'https://github.com/frankchangshow/cinder-ops',
      tags: ['Three.js', 'FPS', 'Procedural'],
    },
    {
      title: 'Sakura Crossing',
      description: 'An explorable Japanese suburban railway-crossing neighbourhood on a small planet, rendered 3D-to-2D as a cel-shaded anime background.',
      href: 'https://github.com/frankchangshow/sakura-crossing',
      tags: ['Three.js', '3D-to-2D', 'Cel-shading'],
    },
    {
      title: 'Pastel Nuketown',
      description: 'Browser-based multiplayer FPS with pastel-styled Nuketown arena, host-authoritative WebSocket networking, AI bots, and LAN play.',
      href: 'https://github.com/frankchangshow/pastel-nuketown',
      tags: ['Three.js', 'Multiplayer', 'FPS'],
    },
    {
      title: 'Der Koloss CE',
      description: 'A browser-based round-based zombie survival game built as a tribute to Der Riese. Three.js, no engine, no install, no build step.',
      href: 'https://github.com/frankchangshow/der-koloss-ce',
      tags: ['Three.js', 'Survival', 'Zombies'],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Work
          </h1>
          <p className="mt-6 text-xl text-zinc-400">
            Selected projects and experiments
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-full rounded-lg border border-zinc-800 bg-zinc-950/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/50">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800/50 px-3 py-1 text-xs text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
