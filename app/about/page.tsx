export default function About() {
  return (
    <article className="min-h-screen px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-signal">
            02 / About
          </p>
          <h1 className="mt-6 font-display text-6xl leading-none tracking-[-0.03em] md:text-8xl">
            Frank
            <br />
            Chang
          </h1>
        </div>

        <div className="max-w-xl space-y-8 text-base leading-relaxed text-ink/90 md:text-lg">
          <p className="font-display text-3xl leading-snug italic md:text-4xl">
            I make games that run in a tab.
          </p>
          <p>
            Procedural worlds. Real-time graphics. No art pipeline, no download,
            no account. Shooters, racers, a space RTS. All of it opens in the
            browser.
          </p>
          <p>
            The public work lives on GitHub under frankchangshow. Three.js,
            WebGPU, Babylon.js, and vanilla JavaScript.
          </p>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute">
            Belmont, CA
          </p>
        </div>
      </div>
    </article>
  );
}
