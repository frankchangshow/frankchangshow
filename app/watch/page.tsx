export default function Watch() {
  const platforms = [
    {
      name: 'YouTube',
      handle: '@frankchangshow',
      href: 'https://www.youtube.com/@frankchangshow',
      description: 'Game development, technical breakdowns, and project showcases',
    },
    {
      name: 'Instagram',
      handle: '@frankchangshow',
      href: 'https://www.instagram.com/frankchangshow',
      description: 'Behind-the-scenes and visual updates',
    },
    {
      name: 'TikTok',
      handle: '@frankchangshow',
      href: 'https://www.tiktok.com/@frankchangshow',
      description: 'Quick clips and experiments',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:py-32">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Watch
          </h1>
          <p className="mt-6 text-xl text-zinc-400">
            Follow along on social platforms
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {platforms.map((platform, index) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-8 transition-all hover:border-zinc-700 hover:bg-zinc-900/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {platform.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {platform.handle}
                    </p>
                    <p className="mt-3 text-zinc-400">
                      {platform.description}
                    </p>
                  </div>
                  <svg
                    className="h-5 w-5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-zinc-800 bg-zinc-950/30 p-8">
          <p className="text-center text-sm text-zinc-500">
            Content includes game development processes, technical deep dives, and interactive demos
          </p>
        </div>
      </div>
    </div>
  );
}
