/* Flat-shape illustrations for design C. Peach, sand, olive, terracotta,
   cocoa. Playful shapes, adult restraint. */

type Props = { className?: string };

const c = {
  peach: "var(--bg-2)",
  sand: "var(--bg)",
  cream: "var(--bg-3)",
  olive: "var(--accent-2)",
  terracotta: "var(--accent)",
  amber: "var(--accent-3)",
  cocoa: "var(--ink)",
  rule: "var(--rule)",
};

export function LivingRoom({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 560 420"
      className={className}
      role="img"
      aria-label="Flat illustration of a cozy living room: an armchair, a floor lamp, a plant, a side table with a mug, and a window with the sun."
    >
      {/* blob backdrop */}
      <path
        d="M78 96C120 18 262 4 372 30c108 26 178 92 172 190-6 100-96 176-224 182C186 408 60 352 40 260 28 200 48 150 78 96z"
        fill={c.cream}
      />

      {/* rug */}
      <ellipse cx="290" cy="372" rx="210" ry="30" fill={c.peach} />
      <path d="M110 372c40-8 80-8 120 0M330 372c40-8 80-8 120 0" stroke={c.terracotta} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* window */}
      <rect x="318" y="60" width="150" height="130" rx="24" fill={c.peach} />
      <rect x="330" y="72" width="126" height="106" rx="16" fill="#fbead8" />
      <circle cx="366" cy="106" r="20" fill={c.amber} />
      <path d="M330 150c22-16 46-18 68-8 20 8 40 6 58-4v40H330z" fill={c.olive} opacity="0.75" />
      <path d="M330 162c24-10 50-10 74-2 18 6 36 4 52-2v20H330z" fill={c.olive} />

      {/* framed picture */}
      <rect x="120" y="84" width="72" height="56" rx="10" fill={c.cocoa} />
      <rect x="128" y="92" width="56" height="40" rx="6" fill="#fbead8" />
      <path d="M128 124c12-10 26-10 34-2 8 6 16 4 22-2v12h-56z" fill={c.terracotta} />
      <circle cx="170" cy="104" r="5" fill={c.amber} />

      {/* floor lamp */}
      <path d="M92 120h74l14 40H78z" fill={c.olive} />
      <rect x="126" y="160" width="6" height="176" rx="3" fill={c.cocoa} />
      <ellipse cx="129" cy="340" rx="30" ry="8" fill={c.cocoa} />
      <ellipse cx="129" cy="200" rx="46" ry="14" fill={c.amber} opacity="0.25" />

      {/* armchair */}
      <rect x="196" y="196" width="150" height="120" rx="26" fill={c.terracotta} />
      <rect x="180" y="248" width="46" height="86" rx="22" fill="#b25a3e" />
      <rect x="316" y="248" width="46" height="86" rx="22" fill="#b25a3e" />
      <rect x="214" y="268" width="114" height="52" rx="16" fill="#d98a6e" />
      <rect x="230" y="218" width="82" height="44" rx="14" fill={c.amber} />
      <rect x="196" y="330" width="14" height="24" rx="4" fill={c.cocoa} />
      <rect x="332" y="330" width="14" height="24" rx="4" fill={c.cocoa} />

      {/* side table with a mug */}
      <rect x="386" y="272" width="90" height="12" rx="6" fill={c.cocoa} />
      <rect x="398" y="284" width="8" height="66" rx="4" fill={c.cocoa} />
      <rect x="456" y="284" width="8" height="66" rx="4" fill={c.cocoa} />
      <rect x="416" y="242" width="30" height="30" rx="8" fill={c.cream} stroke={c.cocoa} strokeWidth="3" />
      <path d="M446 252c12 0 12 14 0 14" fill="none" stroke={c.cocoa} strokeWidth="3" strokeLinecap="round" />
      <path d="M424 232c-3-4 3-7 0-12M436 232c-3-4 3-7 0-12" fill="none" stroke={c.cocoa} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

      {/* plant */}
      <path d="M470 352h56l-6 32h-44z" fill={c.terracotta} />
      <rect x="464" y="342" width="68" height="14" rx="7" fill="#b25a3e" />
      <path d="M498 342c-4-40-30-56-56-58 14 30 30 44 56 58z" fill={c.olive} />
      <path d="M498 342c4-40 30-56 56-58-14 30-30 44-56 58z" fill="#7f8f54" />
      <path d="M498 342c-4-46 0-66 6-84 8 30 4 60-6 84z" fill={c.olive} />
    </svg>
  );
}

function SpotBlob({ children, label, className = "", fill = c.peach }: Props & {
  children: React.ReactNode;
  label: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={label}>
      <path
        d="M24 66C10 40 30 10 62 12c30 2 50 22 48 50-2 30-26 48-54 46C30 106 30 84 24 66z"
        fill={fill}
      />
      {children}
    </svg>
  );
}

export function SpotTelevision(p: Props) {
  return (
    <SpotBlob {...p} label="Small illustrated retro television">
      <rect x="28" y="40" width="64" height="48" rx="12" fill={c.cocoa} />
      <rect x="36" y="48" width="40" height="32" rx="8" fill="#fbead8" />
      <path d="M52 56v16l12-8z" fill={c.terracotta} />
      <circle cx="84" cy="58" r="3" fill={c.amber} />
      <circle cx="84" cy="70" r="3" fill={c.olive} />
      <path d="M46 40l10-14M74 40l-10-14" stroke={c.cocoa} strokeWidth="3" strokeLinecap="round" />
      <rect x="40" y="88" width="40" height="6" rx="3" fill={c.cocoa} />
    </SpotBlob>
  );
}

export function SpotBooks(p: Props) {
  return (
    <SpotBlob {...p} label="Small illustrated stack of books" fill="#f6e4c8">
      <rect x="30" y="70" width="60" height="16" rx="5" fill={c.olive} />
      <rect x="36" y="54" width="52" height="16" rx="5" fill={c.terracotta} />
      <rect x="32" y="38" width="48" height="16" rx="5" fill={c.amber} />
      <path d="M40 46h20M44 62h20M42 78h24" stroke="#fbead8" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 86h56" stroke={c.cocoa} strokeWidth="3" strokeLinecap="round" />
    </SpotBlob>
  );
}

export function SpotMugNote(p: Props) {
  return (
    <SpotBlob {...p} label="Small illustrated mug beside a note">
      <rect x="54" y="34" width="40" height="52" rx="6" fill="#fbead8" stroke={c.cocoa} strokeWidth="3" transform="rotate(6 74 60)" />
      <path d="M64 50h20M64 60h20M64 70h12" stroke={c.olive} strokeWidth="3" strokeLinecap="round" transform="rotate(6 74 60)" />
      <rect x="24" y="56" width="30" height="30" rx="8" fill={c.terracotta} />
      <path d="M54 66c10 0 10 12 0 12" fill="none" stroke={c.terracotta} strokeWidth="4" strokeLinecap="round" />
      <path d="M32 48c-3-4 3-7 0-12M42 48c-3-4 3-7 0-12" fill="none" stroke={c.cocoa} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </SpotBlob>
  );
}

export function SpotJar(p: Props) {
  return (
    <SpotBlob {...p} label="Small illustrated glass jar with a few coins" fill="#f6e4c8">
      <rect x="36" y="38" width="48" height="52" rx="12" fill="#fbead8" stroke={c.cocoa} strokeWidth="3" />
      <rect x="42" y="28" width="36" height="12" rx="5" fill={c.olive} />
      <ellipse cx="60" cy="78" rx="16" ry="5" fill={c.amber} />
      <ellipse cx="60" cy="70" rx="16" ry="5" fill="#f0c063" />
      <ellipse cx="60" cy="62" rx="16" ry="5" fill={c.amber} />
      <path d="M44 46v20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </SpotBlob>
  );
}

export function TwoMugs({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 320 180"
      className={className}
      role="img"
      aria-label="Two illustrated mugs on a small table, steam rising."
    >
      <ellipse cx="160" cy="150" rx="140" ry="12" fill="#5b6a3c" />
      <rect x="40" y="132" width="240" height="14" rx="7" fill="#fbf3e8" />
      <rect x="88" y="80" width="54" height="52" rx="12" fill={c.terracotta} />
      <path d="M142 94c20 0 20 26 0 26" fill="none" stroke={c.terracotta} strokeWidth="7" strokeLinecap="round" />
      <rect x="178" y="80" width="54" height="52" rx="12" fill={c.amber} />
      <path d="M232 94c20 0 20 26 0 26" fill="none" stroke={c.amber} strokeWidth="7" strokeLinecap="round" />
      <path d="M104 66c-5-8 5-12 0-22M122 66c-5-8 5-12 0-22M194 66c-5-8 5-12 0-22M212 66c-5-8 5-12 0-22" fill="none" stroke="#fbf3e8" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function SunMark({ className = "h-8 w-8" }: Props) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="8" fill={c.amber} />
      <g stroke={c.terracotta} strokeWidth="2.4" strokeLinecap="round">
        <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.1 6.1l2.8 2.8M23.1 23.1l2.8 2.8M6.1 25.9l2.8-2.8M23.1 8.9l2.8-2.8" />
      </g>
    </svg>
  );
}

export function Wave({ className = "", fill = c.sand, flip = false }: Props & { fill?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d="M0 30C180 0 360 0 540 30s360 30 540 0 240-30 360 0v30H0z" fill={fill} />
    </svg>
  );
}
