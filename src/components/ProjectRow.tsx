import { useCallback, useEffect, useRef, useState } from "react";
import { Frame } from "@/components/Frame";
import { ArrowUpRight, Chevron } from "@/components/icons";

export type Work = {
  title: string;
  /** The one line that says why the project exists. */
  blurb: string;
  /** Everything shot for the project. The rail shows the first few. */
  images?: string[];
  /** Shown in place of the rail when there is nothing to show yet. */
  pending?: string;
};

/** How many frames the rail carries before the gallery takes over. */
const RAIL_COUNT = 3;

/**
 * The slide width, and the reason the rail works.
 *
 * At 78vw the next image is always cut by the right edge of the screen, at
 * every width — that half-visible frame is the only thing telling you the row
 * scrolls, so it can never be allowed to disappear. The 44rem ceiling stops
 * a single image from becoming the whole page on a wide monitor.
 */
const SLIDE = "w-[min(78vw,44rem)]";

/**
 * One project: a rail of frames, and a caption under its first frame.
 *
 * The rail is a native scroll-snap container rather than a JavaScript
 * carousel. That means it swipes on touch, scrolls on a trackpad, tabs
 * through with a keyboard and survives JavaScript failing, all without a
 * library. The arrows exist only for mouse users, who have no gesture for
 * horizontal scroll — they are gated behind `hover: hover` and stay invisible
 * until the row is pointed at, so the design at rest is exactly the drawing.
 */
export function ProjectRow({ work, onOpen }: { work: Work; onOpen: (work: Work) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState({ start: true, end: false });

  const frames = work.images?.slice(0, RAIL_COUNT) ?? [];
  const hasGallery = frames.length > 0;
  const more = (work.images?.length ?? 0) - frames.length;

  // Which arrows are live. A 1px tolerance, because a snapped scroll position
  // lands on a fractional pixel often enough to matter.
  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAt({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 1,
    });
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  // One slide per press, measured off the rail's own children so it stays
  // correct when the slide width changes with the viewport.
  const step = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const by = (first?.offsetWidth ?? el.clientWidth * 0.78) + gap;
    el.scrollBy({ left: by * direction, behavior: "smooth" });
  };

  return (
    <article className="group/row">
      <div className="relative">
        {hasGallery ? (
          <div ref={railRef} className="rail">
            {frames.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => onOpen(work)}
                aria-label={`${work.title} — open the full gallery`}
                className={`${SLIDE} image-edge relative aspect-[16/9] overflow-hidden rounded-frame bg-placeholder transition-transform duration-200 ease-strong active:scale-[0.995]`}
              >
                <Frame
                  src={src}
                  alt={`${work.title}, frame ${i + 1}`}
                  eager={i === 0}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          /* Nothing shot yet. An empty frame that says so is more honest than
             three grey rectangles pretending to be work. */
          <div className="page">
            <div
              className={`${SLIDE} image-edge grid aspect-[16/9] place-items-center rounded-frame bg-placeholder`}
            >
              <span className="label text-muted-foreground">{work.pending ?? "In progress"}</span>
            </div>
          </div>
        )}

        {hasGallery ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 left-0 hidden items-center justify-between px-4 opacity-0 transition-opacity duration-200 ease-strong group-hover/row:opacity-100 sm:px-6 [@media(hover:hover)]:flex"
          >
            {(
              [
                ["prev", -1, at.start],
                ["next", 1, at.end],
              ] as const
            ).map(([name, direction, spent]) => (
              <button
                key={name}
                type="button"
                tabIndex={-1}
                onClick={() => step(direction)}
                className={`pointer-events-auto grid size-10 place-items-center rounded-full bg-surface/90 shadow-card backdrop-blur-sm transition-[opacity,transform] duration-200 ease-strong active:scale-[0.96] ${
                  spent ? "scale-90 opacity-0" : "opacity-100"
                }`}
              >
                <Chevron className={`size-4 ${direction === -1 ? "-scale-x-100" : ""}`} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="page">
        {/* Held to the first frame's width so the caption reads as belonging to
            that image rather than to the row as a whole. */}
        <div className={`${SLIDE} mt-4 flex items-start justify-between gap-6`}>
          <div className="rounded-inset bg-surface px-4 py-3.5 shadow-card">
            <h3 className="caps">{work.title}</h3>
            <p className="mt-2 max-w-[30ch] text-[0.875rem] leading-[1.45] text-prose">
              {work.blurb}
            </p>
          </div>

          {hasGallery ? (
            <button
              type="button"
              onClick={() => onOpen(work)}
              className="group/link -mt-0.5 flex shrink-0 items-center gap-2 text-muted-foreground transition-colors duration-200 ease-strong hover:text-foreground"
            >
              {/* The count is the second half of the affordance: it says how
                  much more there is than the three frames on the rail. */}
              {more > 0 ? <span className="label">+{more}</span> : null}
              <span className="sr-only">
                {work.title} — open the full gallery
                {more > 0 ? `, ${work.images!.length} images` : ""}
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-strong group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
