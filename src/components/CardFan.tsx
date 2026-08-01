import type { Work } from "@/components/ProjectCard";

/**
 * A fanned deck of the project covers.
 *
 * Decorative, and deliberately built from the real covers rather than stock
 * shapes — it is the same work shown on the index, held as a hand of cards.
 * The deck opens on hover with a per-card delay so it cascades outward from
 * the centre instead of snapping open all at once.
 *
 * Hidden from assistive tech: every project in it is already listed, in full,
 * a section above.
 */

/**
 * Resting and opened geometry per card, left to right. The cards pivot from
 * their bottom edge, so the deck splays like a hand being spread rather than
 * a row of tiles being rotated in place.
 */
const layout = [
  { rest: "translateX(-96%) rotate(-13deg)", open: "translateX(-132%) rotate(-19deg)" },
  { rest: "translateX(-32%) rotate(-4.5deg)", open: "translateX(-44%) rotate(-6.5deg)" },
  { rest: "translateX(32%) rotate(4.5deg)", open: "translateX(44%) rotate(6.5deg)" },
  { rest: "translateX(96%) rotate(13deg)", open: "translateX(132%) rotate(19deg)" },
];

export function CardFan({ items }: { items: Work[] }) {
  const deck = items.slice(0, layout.length);

  return (
    /*
     * The deck is scaled down on small screens rather than re-laid-out: its
     * spread is a fixed fraction of the card width, so at phone widths the
     * rotated corners would otherwise push past the viewport and give the
     * whole page a horizontal scrollbar.
     */
    <div
      aria-hidden
      className="group/fan relative mx-auto h-52 w-full max-w-md scale-[0.62] sm:h-60 sm:scale-100"
    >
      {deck.map((work, i) => {
        const { rest, open } = layout[i];
        return (
          <div
            key={work.title}
            style={
              {
                "--rest": rest,
                "--open": open,
                // Outer cards start moving first, so the deck opens outward.
                transitionDelay: `${Math.abs(i - (deck.length - 1) / 2) * 45}ms`,
                // A plain left-to-right stack, the way a dealt hand overlaps.
                zIndex: i,
              } as React.CSSProperties
            }
            className="absolute top-1/2 left-1/2 h-40 w-32 -translate-x-1/2 -translate-y-1/2 sm:h-48 sm:w-36"
          >
            <div className="size-full origin-bottom [transform:var(--rest)] transition-transform duration-[600ms] ease-soft group-hover/fan:[transform:var(--open)]">
              <div
                className="image-edge grid size-full place-items-center overflow-hidden rounded-inset px-3 shadow-card"
                style={{ backgroundColor: work.tint ?? "var(--color-secondary)" }}
              >
                {work.images?.length ? (
                  <img
                    src={work.images[0]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                ) : (
                  <span
                    className={`display text-center text-xl ${
                      work.ink === "light" ? "text-background" : "text-foreground"
                    }`}
                  >
                    {work.title}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
