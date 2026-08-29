export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <main className="flex flex-col items-center gap-8 py-16 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Frank Chang
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            @frankchangshow
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Belmont, CA
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a href="https://www.youtube.com/@frankchangshow" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-6 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">YouTube</a>
          <a href="https://www.instagram.com/frankchangshow" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-6 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">Instagram</a>
          <a href="https://www.tiktok.com/@frankchangshow" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-6 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">TikTok</a>
        </div>
      </main>
    </div>
  );
}
