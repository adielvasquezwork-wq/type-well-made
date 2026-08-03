/**
 * One icon set, one stroke weight. Everything is drawn on a 16px grid at
 * 1.5px, which is the optical weight that sits correctly beside regular-weight
 * text. Colour always comes from `currentColor` so states are pure CSS.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Closes the gallery. */
export function Close({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m4.5 4.5 7 7" />
      <path d="m11.5 4.5-7 7" />
    </svg>
  );
}

/**
 * The mark that precedes a named link in prose. Drawn as six strokes through
 * a common centre rather than as a typed asterisk: the character sits on the
 * cap line in most faces, which would hang it above the words it belongs to.
 */
export function Asterisk({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 2.75v10.5" />
      <path d="m3.45 5.375 9.1 5.25" />
      <path d="m3.45 10.625 9.1-5.25" />
    </svg>
  );
}
