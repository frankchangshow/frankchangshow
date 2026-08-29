export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:py-32">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            About
          </h1>
          
          <div className="mt-12 space-y-8 text-lg leading-relaxed text-zinc-300">
            <p>
              I build browser-based games and interactive experiences that push the boundaries of what&apos;s possible on the web.
            </p>
            
            <p>
              My work focuses on procedural generation, real-time graphics, and creating immersive worlds without relying on traditional art assets. From first-person shooters to racing simulators to space RTS games, everything runs directly in your browser with zero downloads.
            </p>
            
            <p>
              I work with Three.js, WebGPU, Babylon.js, and vanilla JavaScript to craft experiences that are immediate, accessible, and technically ambitious.
            </p>

            <div className="pt-8">
              <h2 className="text-2xl font-semibold text-white">Technical Focus</h2>
              <ul className="mt-4 space-y-2 text-zinc-400">
                <li>• Procedural world generation and rendering</li>
                <li>• Real-time 3D graphics in the browser</li>
                <li>• Zero-asset game development</li>
                <li>• WebGPU and custom shader programming</li>
                <li>• Multiplayer networking architecture</li>
              </ul>
            </div>

            <div className="pt-8">
              <p className="text-base text-zinc-400">
                Based in Belmont, CA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
