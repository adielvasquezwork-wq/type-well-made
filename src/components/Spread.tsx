import type { CSSProperties } from "react";
import { Frame } from "@/components/Frame";

/**
 * Resting geometry, left to right. The angles are small on purpose — a few
 * degrees reads as work that has been set down, and anything past about six
 * starts to read as a fan of playing cards. The vertical offsets don't repeat,
 * which is what keeps the row from settling into a visible zig-zag.
 *
 * Widths vary too: printed work is not all one size, and a row of identical
 * rectangles at different angles looks like a template. They are `max()` and
 * not `clamp()` for the same reason the rails are — the widths add up past
 * 100vw at every viewport size, so the spread always runs off both edges
 * rather than stopping short on a wide monitor.
 */
const layout = [
  { rot: "-3.5deg", dy: "10px", w: "w-[max(9rem,18vw)]" },
  { rot: "1.5deg", dy: "-6px", w: "w-[max(7.5rem,14vw)]" },
  { rot: "-1.5deg", dy: "4px", w: "w-[max(10rem,20vw)]" },
  { rot: "3deg", dy: "-9px", w: "w-[max(8rem,16vw)]" },
  { rot: "-2.5deg", dy: "8px", w: "w-[max(9.5rem,19vw)]" },
  { rot: "2deg", dy: "-4px", w: "w-[max(7.5rem,14vw)]" },
  { rot: "-4deg", dy: "6px", w: "w-[max(9rem,18vw)]" },
];

/** One piece. A dead image costs it its art and nothing else. */
function Piece({ src, index }: { src: string; index: number }) {
  const { rot, dy, w } = layout[index];

  return (
    <div
      style={{ "--rot": rot, "--dy": dy, "--z": index } as CSSProperties}
      className={`${w} image-edge relative -mx-3 aspect-[4/5] shrink-0 overflow-hidden rounded-inset bg-placeholder shadow-card sm:-mx-4`}
    >
      <Frame src={src} alt="" className="size-full object-cover" />
    </div>
  );
}

/**
 * The playground spread.
 *
 * Loose pieces laid out edge to edge, running off both sides of the page —
 * the point is that there is more of it than fits. Pointing at one straightens
 * and lifts it while the rest drain of colour; that behaviour lives in the
 * `spread` utility and is gated behind `hover: hover`, so on touch this is
 * simply a static composition.
 *
 * Hidden from assistive tech. It carries nothing the sections around it don't
 * already say in words.
 */
export function Spread({ pieces }: { pieces: string[] }) {
  return (
    <div aria-hidden className="spread flex items-center justify-center">
      {pieces.slice(0, layout.length).map((src, i) => (
        <Piece key={src} src={src} index={i} />
      ))}
    </div>
  );
}

/**
 * The marks in the margin. Hand-drawn ticks radiating from a point, the kind
 * you scribble next to something you want to come back to. Purely decorative,
 * and the one place on the page where a line isn't straight.
 */
export function Ticks({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className={className}
    >
      <path d="M2 14c14 6 24 18 29 33" strokeDasharray="1 7" />
      <path d="M6 44c13 1 24 7 32 17" strokeDasharray="1 7" />
      <path d="M3 74c14-4 27-3 39 3" strokeDasharray="1 7" />
      <path d="M12 104c12-9 24-14 37-15" strokeDasharray="1 7" />
    </svg>
  );
}
