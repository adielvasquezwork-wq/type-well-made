import { Frame } from "@/components/Frame";
import { useDragRail } from "@/hooks/useDragRail";

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
 * The rail is a native scroll-snap container first — it swipes on touch,
 * scrolls on a trackpad, and tabs through with a keyboard for free. What it
 * doesn't get for free is a mouse, which has no equivalent gesture for
 * pushing content sideways — `useDragRail` covers that with a click-and-drag
 * that carries momentum on release, gated to mouse pointers only, so touch
 * and trackpad keep their own native scrolling untouched.
 *
 * A frame is a real button that opens the gallery, which means a drag has to
 * be told apart from a click — `wasDragged()` is what tells them apart.
 */
export function ProjectRow({ work, onOpen }: { work: Work; onOpen: (work: Work) => void }) {
  const { ref, bind, wasDragged } = useDragRail<HTMLDivElement>();

  const frames = work.images?.slice(0, RAIL_COUNT) ?? [];
  const hasGallery = frames.length > 0;

  const openUnlessDragged = () => {
    if (wasDragged()) return;
    onOpen(work);
  };

  return (
    <article>
      {hasGallery ? (
        <div ref={ref} className="rail cursor-grab active:cursor-grabbing" {...bind}>
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
