import { useState, type CSSProperties } from "react";

export type Print = {
  /** The frame itself. Optional — a print can be a flat cover instead. */
  src?: string;
  /** The colour under the image. Also what's left if the image never loads. */
  tint: string;
  /** Set on the flat covers, which carry the project's name instead of art. */
  title?: string;
  ink?: "light" | "dark";
};

/**
 * Resting geometry, left to right. Angles alternate and the vertical offsets
 * don't repeat, which is what keeps a row of tilted rectangles from settling
 * into a visible zig-zag. Cards overlap left over right, the way a spread of
 * prints falls when you push it apart.
 */
const layout = [
  { rot: "-8deg", dy: "16px" },
  { rot: "4.5deg", dy: "-8px" },
  { rot: "-3deg", dy: "10px" },
  { rot: "7deg", dy: "-14px" },
  { rot: "-5.5deg", dy: "4px" },
  { rot: "2.5deg", dy: "14px" },
  { rot: "-7deg", dy: "-6px" },
  { rot: "5deg", dy: "9px" },
];

/** One print. Its own state, so a dead image only costs that card its art. */
function Card({ print, index }: { print: Print; index: number }) {
  const [broken, setBroken] = useState(false);
  const { rot, dy } = layout[index];

  return (
    <div
      style={
        { "--rot": rot, "--dy": dy, "--z": index, backgroundColor: print.tint } as CSSProperties
      }
      /*
       * The width is `max()` rather than `clamp()` on purpose: a ceiling would
       * let the deck stop short of the viewport on a wide monitor, and the
       * whole point of this row is that there is more of it than fits.
       */
      className="image-edge relative -mx-3 aspect-[3/4] w-[max(9rem,15vw)] shrink-0 overflow-hidden rounded-inset shadow-card"
    >
      {print.title ? (
        <span
          className={`display absolute inset-0 grid place-items-center px-3 text-center text-[clamp(1rem,2vw,1.5rem)] ${
            print.ink === "light" ? "text-background" : "text-foreground"
          }`}
        >
          {print.title}
        </span>
      ) : null}

      {print.src && !broken ? (
        <img
          src={print.src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
          className="relative size-full object-cover"
        />
      ) : null}
    </div>
  );
}

/**
 * The playground deck.
 *
 * Loose frames and covers laid out edge to edge, running off both sides of
 * the page. Pointing at one straightens and lifts it while the rest fall
 * back; the behaviour lives in the `card-deck` utility and is gated behind
 * `hover: hover`, so on touch this is simply a static composition.
 *
 * Hidden from assistive tech — it carries nothing the sections around it
 * don't already say in words.
 */
export function CoverStrip({ prints }: { prints: Print[] }) {
  return (
    <div aria-hidden className="card-deck flex items-center justify-center">
      {prints.slice(0, layout.length).map((print, i) => (
        <Card key={print.src ?? print.title ?? i} print={print} index={i} />
      ))}
    </div>
  );
}

/**
 * The marks in the margin. Hand-drawn ticks radiating from a point, the kind
 * you scribble next to something you want to come back to. Purely
 * decorative, and the one place on the page where a line isn't straight.
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
