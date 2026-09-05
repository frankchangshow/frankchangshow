import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

// Frank drops a 3:4 portrait at one of these paths and the frame fills in
// on the next build. Until then the frame renders as an empty slot.
const PORTRAIT_CANDIDATES = [
  "photo/frank.jpg",
  "photo/frank.jpeg",
  "photo/frank.png",
  "photo/frank.webp",
];

export function findPortrait(): string | null {
  for (const rel of PORTRAIT_CANDIDATES) {
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) {
      return `/${rel}`;
    }
  }
  return null;
}

export function Portrait({ src }: { src: string | null }) {
  return (
    <figure className="w-full">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[3px] border border-(--rule) bg-(--frame)">
        {src ? (
          <Image
            src={src}
            alt="Frank Chang"
            fill
            sizes="(min-width: 768px) 380px, 100vw"
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div
            role="img"
            aria-label="Empty portrait slot. A photo of Frank goes here."
            className="flex h-full w-full flex-col items-center justify-center text-center"
          >
            <span className="text-sm font-medium text-(--muted)">Add photo</span>
            <span className="mt-1 text-xs text-(--muted)/80">3 : 4 portrait</span>
          </div>
        )}
      </div>
      {!src && (
        <figcaption className="mt-3 text-xs leading-relaxed text-(--muted)">
          Drop the file at <code className="font-mono">public/photo/frank.jpg</code>.
        </figcaption>
      )}
    </figure>
  );
}
