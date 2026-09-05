/* Crisp two-tone icon set and hero graphic for design B. 24px grid, 1.75px
   rounded strokes, teal tints via CSS variables. */

type IconProps = { className?: string };

function Base({ children, className = "h-6 w-6" }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconPlay(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3" y="5" width="18" height="14" rx="4" />
      <path d="M10 9.3v5.4l4.6-2.7L10 9.3z" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconArticle(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M6 3.5h9l4 4v13H6z" />
      <path d="M15 3.5v4h4" />
      <path d="M9 12h6M9 15.5h6M9 8.5h2" />
    </Base>
  );
}

export function IconCalendar(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconDashboard(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" stroke="none" opacity="0.9" />
    </Base>
  );
}

export function IconChat(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V16A2.5 2.5 0 0 1 4 13.5z" />
      <path d="M8.5 10h7M8.5 13h4" />
    </Base>
  );
}

export function IconPin(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </Base>
  );
}

export function IconWrench(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M14.5 4.5a5 5 0 0 0 5 8.6l-6.4 6.4a2 2 0 0 1-2.8-2.8l6.4-6.4a5 5 0 0 0-2.2-5.8z" />
      <path d="M5.5 18.5h.01" />
    </Base>
  );
}

export function IconHome(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 11l8-6.5L20 11v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" />
      <path d="M10 20.5v-6h4v6" />
    </Base>
  );
}

export function IconArrow(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Base>
  );
}

export function IconExternal(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M14 5h5v5M19 5l-8 8" />
      <path d="M17 13.5v4A1.5 1.5 0 0 1 15.5 19h-9A1.5 1.5 0 0 1 5 17.5v-9A1.5 1.5 0 0 1 6.5 7h4" />
    </Base>
  );
}

export function Monogram({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path
        d="M11 23V9h11v3h-7.4v3.2h6.2v3h-6.2V23z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function HeroGraphic({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 520 420"
      className={className}
      role="img"
      aria-label="Abstract illustration of layered rounded cards, a play button and small icon chips on a dot grid."
    >
      <defs>
        <pattern id="b-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="var(--rule)" />
        </pattern>
      </defs>
      <rect width="520" height="420" fill="url(#b-dots)" />
      <circle cx="400" cy="120" r="96" fill="var(--accent-2)" opacity="0.7" />

      {/* main card */}
      <g>
        <rect x="56" y="76" width="320" height="216" rx="26" fill="#ffffff" stroke="var(--rule)" />
        <circle cx="104" cy="124" r="20" fill="var(--accent)" />
        <path d="M97 132c1.5-5 12.5-5 14 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="104" cy="118" r="4.5" fill="#fff" />
        <rect x="136" y="112" width="120" height="10" rx="5" fill="var(--ink)" opacity="0.85" />
        <rect x="136" y="130" width="72" height="8" rx="4" fill="var(--accent-2)" />
        <rect x="84" y="168" width="264" height="8" rx="4" fill="var(--rule)" />
        <rect x="84" y="188" width="220" height="8" rx="4" fill="var(--rule)" />
        <rect x="84" y="208" width="240" height="8" rx="4" fill="var(--rule)" />
        <rect x="84" y="244" width="96" height="28" rx="14" fill="var(--accent)" />
        <rect x="190" y="244" width="96" height="28" rx="14" fill="var(--accent-3)" stroke="var(--rule)" />
      </g>

      {/* teal video card */}
      <g>
        <rect x="248" y="212" width="228" height="150" rx="26" fill="var(--accent)" />
        <circle cx="362" cy="276" r="30" fill="#ffffff" opacity="0.95" />
        <path d="M355 264v24l20-12z" fill="var(--accent)" />
        <rect x="272" y="326" width="90" height="8" rx="4" fill="#ffffff" opacity="0.8" />
        <rect x="372" y="326" width="40" height="8" rx="4" fill="#ffffff" opacity="0.45" />
      </g>

      {/* chips */}
      <g>
        <rect x="392" y="44" width="64" height="64" rx="20" fill="#ffffff" stroke="var(--rule)" />
        <path d="M411 76l8 8 16-18" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g>
        <rect x="28" y="286" width="64" height="64" rx="20" fill="#ffffff" stroke="var(--rule)" />
        <path
          d="M60 336s-13-11-13-22a13 13 0 0 1 26 0c0 11-13 22-13 22z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="60" cy="314" r="4.5" fill="var(--accent)" />
      </g>
      <g>
        <rect x="100" y="24" width="64" height="64" rx="20" fill="var(--accent-2)" />
        <rect x="118" y="46" width="28" height="22" rx="4" fill="none" stroke="var(--accent)" strokeWidth="3" />
        <path d="M118 52h28M126 42v6M138 42v6" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
