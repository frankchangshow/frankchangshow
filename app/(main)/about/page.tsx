export default function About() {
  return (
    <article className="bg-black px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium tracking-[0.18em] text-mute uppercase">
          About
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold md:text-[60px]">
          Frank <span className="mark">Chang</span>
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-mute">
          I make games that run in a tab. Procedural worlds. Real-time graphics.
          No art pipeline, no download, no account.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-mute">
          Shooters, racers, a space RTS. All of it opens in the browser. The
          public work lives on GitHub under frankchangshow. Three.js, WebGPU,
          Babylon.js, and vanilla JavaScript.
        </p>
        <p className="mt-8 font-display text-sm font-bold tracking-[0.16em] text-signal uppercase">
          Belmont, CA
        </p>
      </div>
    </article>
  );
}
