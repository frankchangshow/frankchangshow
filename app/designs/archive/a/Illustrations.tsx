/* Monoline ink illustrations for design A. Strokes use currentColor so they
   sit on the ink color; spot fills use the theme's coral and amber. */

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function DeskScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className}
      role="img"
      aria-label="Line drawing of a desk with a laptop, microphone, notebook and a mug, in front of a window looking out on rolling hills."
    >
      {/* spot fills */}
      <circle cx="150" cy="54" r="17" fill="var(--accent-2)" />
      <ellipse cx="68" cy="224" rx="36" ry="20" fill="var(--accent)" opacity="0.9" />
      <ellipse cx="428" cy="232" rx="44" ry="9" fill="var(--accent-2)" opacity="0.35" />

      {/* window */}
      <g {...line}>
        <rect x="28" y="22" width="160" height="118" rx="4" />
        <path d="M108 22v118M28 81h160" />
        <path d="M28 116c26-18 52-20 76-8 22 10 52 8 84 2" />
        <path d="M28 130c32-12 62-10 92 0 24 8 46 6 68-2" />
        <path d="M18 142h180" />
        {/* plant on the sill */}
        <path d="M60 142v-12h20v12" />
        <path d="M70 130c0-8-5-13-10-16M70 130c0-10 6-14 12-18M70 130c1-11 1-17 0-22" />
      </g>

      {/* wall clock */}
      <g {...line}>
        <circle cx="430" cy="72" r="22" />
        <path d="M430 58v14l9 6" />
        <circle cx="430" cy="72" r="1.4" fill="currentColor" stroke="none" />
      </g>

      {/* desk */}
      <g {...line}>
        <path d="M14 238h452" />
        <path d="M44 238v78M436 238v78M44 294h392" />
      </g>

      {/* mug with steam */}
      <g {...line}>
        <rect x="52" y="206" width="32" height="32" rx="3" />
        <path d="M84 214c14 0 14 18 0 18" />
        <path d="M62 196c-4-6 4-9 0-15M74 196c-4-6 4-9 0-15" strokeWidth="1.3" />
      </g>

      {/* closed notebook with a pencil on top */}
      <g {...line}>
        <rect x="104" y="222" width="66" height="16" rx="2" />
        <path d="M112 222v16" strokeWidth="1.2" />
        <path d="M110 218l52-8 6 4-52 8z" />
        <path d="M162 210l6 4M170 213l8-3-2-4z" strokeWidth="1.2" />
      </g>

      {/* microphone on a boom arm */}
      <g {...line}>
        <path d="M214 238v-58" />
        <path d="M214 180l20-22" />
        <rect x="230" y="136" width="14" height="32" rx="7" transform="rotate(-26 237 152)" />
        <path d="M237 170l4 8" />
        <path d="M204 238h20" />
      </g>

      {/* laptop */}
      <g {...line}>
        <rect x="262" y="146" width="128" height="84" rx="5" />
        <path d="M252 238l12-10h124l12 10" />
        <path d="M278 166h60M278 178h90M278 190h48M278 202h76" strokeWidth="1.2" />
        <circle cx="326" cy="154" r="1.6" fill="currentColor" stroke="none" />
      </g>

      {/* potted plant on the desk */}
      <g {...line}>
        <path d="M410 238v-20h34v20" />
        <path d="M427 218c-2-14-10-20-18-24M427 218c0-14 8-22 16-26M427 218c2-16 0-24-2-32" />
        <path d="M409 224h36" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function Spot({
  children,
  label,
  blob = "accent",
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  blob?: "accent" | "accent-2";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 96 96" className={className} role="img" aria-label={label}>
      <path
        d="M22 58c-8-18 6-40 28-42 20-2 38 10 36 30-2 22-20 34-40 32-14-2-20-10-24-20z"
        fill={`var(--${blob})`}
        opacity={blob === "accent" ? 0.85 : 0.7}
        transform="translate(6 4)"
      />
      <g {...line}>{children}</g>
    </svg>
  );
}

export function SpotCamera({ className = "" }: { className?: string }) {
  return (
    <Spot label="Line drawing of a video camera" className={className}>
      <rect x="14" y="36" width="46" height="32" rx="6" />
      <path d="M60 46l18-8v28l-18-8" />
      <circle cx="36" cy="52" r="9" />
      <circle cx="36" cy="52" r="3.5" />
      <rect x="22" y="26" width="18" height="8" rx="3" />
      <path d="M26 74h22" />
    </Spot>
  );
}

export function SpotPages({ className = "" }: { className?: string }) {
  return (
    <Spot label="Line drawing of a stack of written pages" blob="accent-2" className={className}>
      <path d="M30 22h32l12 12v42H30z" />
      <path d="M62 22v12h12" />
      <path d="M38 46h28M38 54h28M38 62h18" strokeWidth="1.2" />
      <path d="M24 30v48h44" strokeWidth="1.2" />
    </Spot>
  );
}

export function SpotNote({ className = "" }: { className?: string }) {
  return (
    <Spot label="Line drawing of a daily note pad with a check mark" className={className}>
      <rect x="20" y="28" width="56" height="50" rx="5" />
      <path d="M20 40h56" />
      <path d="M32 22v10M48 22v10M64 22v10" />
      <path d="M32 58l7 7 15-16" />
    </Spot>
  );
}

export function SpotLedger({ className = "" }: { className?: string }) {
  return (
    <Spot label="Line drawing of a ledger book beside a stack of coins" blob="accent-2" className={className}>
      <path d="M18 30h30v46H18z" />
      <path d="M26 30v46" strokeWidth="1.2" />
      <path d="M32 42h10M32 50h10M32 58h10" strokeWidth="1.2" />
      <ellipse cx="64" cy="70" rx="14" ry="5" />
      <path d="M50 70v-8c0-2.8 6.3-5 14-5s14 2.2 14 5v8" />
      <path d="M50 62c0 2.8 6.3 5 14 5s14-2.2 14-5" />
      <path d="M52 54c0-2.8 5.4-5 12-5s12 2.2 12 5" />
    </Spot>
  );
}

export function TwoChairs({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      role="img"
      aria-label="Line drawing of two chairs facing each other across a small table with two cups."
    >
      <ellipse cx="160" cy="176" rx="130" ry="10" fill="var(--accent-2)" opacity="0.35" />
      <circle cx="160" cy="86" r="26" fill="var(--accent)" opacity="0.85" />
      <g {...line}>
        {/* left chair, side view, facing right */}
        <path d="M60 68c0-6 4-8 8-8h6v60" />
        <path d="M60 68v100" />
        <path d="M60 120h54v48" />
        <path d="M74 100h30v20" strokeWidth="1.3" />
        <path d="M60 120c-6 0-10 4-10 10v38" strokeWidth="1.3" />
        {/* right chair, mirrored */}
        <path d="M260 68c0-6-4-8-8-8h-6v60" />
        <path d="M260 68v100" />
        <path d="M260 120h-54v48" />
        <path d="M246 100h-30v20" strokeWidth="1.3" />
        <path d="M260 120c6 0 10 4 10 10v38" strokeWidth="1.3" />
        {/* small table with two cups */}
        <path d="M128 126h64M160 126v42M144 168h32" />
        <rect x="138" y="112" width="13" height="13" rx="2" />
        <path d="M151 115c5 0 5 7 0 7" strokeWidth="1.2" />
        <rect x="168" y="112" width="13" height="13" rx="2" />
        <path d="M181 115c5 0 5 7 0 7" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 16" className={className} aria-hidden>
      <path
        d="M2 10c10-10 20-10 30 0s20 10 30 0 20-10 30 0 18 10 26 0"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
