import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      
      <div className="relative">
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
          <div className="mx-auto max-w-5xl">
            <div className="animate-fade-in-up text-center">
              <h1 className="text-7xl font-bold tracking-tight sm:text-8xl lg:text-9xl">
                Frank Chang
              </h1>
              <p className="mt-6 text-xl text-zinc-400 sm:text-2xl">
                Browser-based games and interactive experiences
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <Link
                  href="/work"
                  className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
                >
                  View Work
                </Link>
                <Link
                  href="/watch"
                  className="rounded-full border border-zinc-700 px-8 py-3 text-sm font-medium transition-colors hover:bg-zinc-900"
                >
                  Watch Content
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800/50 px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="group">
                <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                  Game Development
                </h3>
                <p className="mt-4 text-zinc-300">
                  Building browser-based games with Three.js, WebGPU, and procedural generation
                </p>
              </div>
              <div className="group">
                <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                  Real-time Graphics
                </h3>
                <p className="mt-4 text-zinc-300">
                  Specializing in procedural worlds and zero-asset rendering techniques
                </p>
              </div>
              <div className="group">
                <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                  Interactive Web
                </h3>
                <p className="mt-4 text-zinc-300">
                  Creating immersive experiences that run directly in the browser
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
