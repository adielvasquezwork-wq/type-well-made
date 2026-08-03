import { useRef } from "react";
import { Frame } from "@/components/Frame";

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

/** Beyond this many pixels of pointer travel, a press is a drag, not a click. */
const DRAG_THRESHOLD = 6;

/**
 * One project: a rail of frames, and a caption under its first frame.
 *
 * The rail is a native scroll-snap container first — it swipes on touch,
 * scrolls on a trackpad, and tabs through with a keyboard for free. What it
 * doesn't get for free is a mouse: a trackpad or touchscreen can push the
 * content sideways directly, but a mouse has no equivalent gesture. So the
 * rail also answers to a plain click-and-drag, tracked by hand with pointer
 * events and gated to `pointerType === "mouse"` — touch and pen keep using
 * their own native scrolling untouched.
 *
 * Two things only show up once you try to make this work, not from reading
 * about it:
 *
 * - `setPointerCapture` has to wait until the gesture has actually crossed
 *   `DRAG_THRESHOLD`. Call it unconditionally on every pointerdown and
 *   Chromium retargets the following `click` to the capturing element — the
 *   rail, which has no click handler — so a plain, undragged click on a
 *   frame silently stops opening the gallery.
 * - `scroll-snap-type` has to switch off for the duration of the drag.
 *   Mandatory snapping re-centres the rail on the nearest frame the instant
 *   `scrollLeft` is set by hand, so every pointermove gets fought back to
 *   where it started and the rail never visibly moves. `data-dragging`
 *   toggles it off on the element itself — imperative, not React state,
 *   since state would mean a re-render on every pixel of mouse travel.
 *
 * A frame is a real button that opens the gallery, which means a drag still
 * has to be told apart from a click: once the gesture is marked as a drag,
 * the click it produces on release is swallowed, so pulling the rail across
 * the screen never accidentally opens a project.
 */
export function ProjectRow({ work, onOpen }: { work: Work; onOpen: (work: Work) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const frames = work.images?.slice(0, RAIL_COUNT) ?? [];
  const hasGallery = frames.length > 0;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = railRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el || !drag.current.active) return;
    const delta = e.clientX - drag.current.startX;

    if (!drag.current.moved) {
      if (Math.abs(delta) <= DRAG_THRESHOLD) return;
      drag.current.moved = true;
      el.dataset.dragging = "true";
      el.setPointerCapture(e.pointerId);
    }

    el.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (el) delete el.dataset.dragging;
    drag.current.active = false;
  };

  const openUnlessDragged = () => {
    if (drag.current.moved) return;
    onOpen(work);
  };

  return (
    <article>
      {hasGallery ? (
        <div
          ref={railRef}
          className="rail cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(e) => e.preventDefault()}
        >
          {frames.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={openUnlessDragged}
              aria-label={`${work.title} — open the full gallery`}
              className={`${SLIDE} image-edge relative aspect-[16/9] overflow-hidden rounded-frame bg-placeholder transition-transform duration-200 ease-strong active:scale-[0.995]`}
            >
              <Frame
                src={src}
                alt={`${work.title}, frame ${i + 1}`}
                eager={i === 0}
                className="pointer-events-none size-full object-cover"
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

      <div className="page">
        {/* Held to the first frame's width so the caption reads as belonging to
            that image rather than to the row as a whole. */}
        <div className={`${SLIDE} mt-4`}>
          <h3 className="caps">{work.title}</h3>
          <p className="mt-1.5 max-w-[42ch] text-[0.875rem] leading-[1.45] text-prose">
            {work.blurb}
          </p>
        </div>
      </div>
    </article>
  );
}
