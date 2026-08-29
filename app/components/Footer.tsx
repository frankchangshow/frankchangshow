export function Footer() {
  const socials = [
    { name: 'YouTube', href: 'https://www.youtube.com/@frankchangshow' },
    { name: 'Instagram', href: 'https://www.instagram.com/frankchangshow' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@frankchangshow' },
    { name: 'GitHub', href: 'https://github.com/frankchangshow' },
  ];

  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-8">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {social.name}
              </a>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-zinc-500">
              @frankchangshow
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Belmont, CA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
