import { Frame } from "@/components/Frame";

export type Work = {
  title: string;
  /** The one line that says why the project exists. Read in the gallery. */
  blurb: string;
  /** What the project was — "Brand, Web, Naming". Sits opposite the title. */
  tags?: string[];
  /** Everything shot for the project. The first one is the cover. */
  images?: string[];
  /** The cover's own width ÷ height, so its box is reserved before it loads. */
  ratio?: number;
  /** Appended to the title, and shown in the empty frame — "Coming Soon". */
  pending?: string;
};

/**
 * Used only when a project has no cover to measure. Wide enough that an empty
 * frame reads as a missing image rather than as a gap in the column.
 */
const FALLBACK_RATIO = 16 / 10;

/**
 * One project in the work grid: a cover at its own aspect ratio, and a single
 * caption line under it — name on the left, disciplines on the right.
 *
 * The cover keeps the shape it was shot in. Every project sharing one crop is
 * what turns a portfolio into a contact sheet, and the ragged column bottoms
 * that come out of not cropping are the whole reason the grid reads as work
 * rather than as tiles.
 *
 * The cover is the click target rather than the whole card: a `<button>` may
 * only hold phrasing content, so wrapping the caption's heading in one would
 * mean giving up the heading. Hover lives on that same button, so nothing
 * moves under a pointer that can't click it.
 */
export function ProjectCard({ work, onOpen }: { work: Work; onOpen: (work: Work) => void }) {
  const cover = work.images?.[0];
  const name = work.pending ? `${work.title} — ${work.pending}` : work.title;
  const tags = work.tags?.length ? work.tags.join(", ") : null;

  const frame = "image-edge overflow-hidden rounded-card bg-placeholder";
  const box = { aspectRatio: `${work.ratio ?? FALLBACK_RATIO}` };

  return (
    <article>
      {cover ? (
        <button
          type="button"
          onClick={() => onOpen(work)}
          aria-label={`${work.title} — open the full gallery`}
          className={`${frame} group block w-full transition-transform duration-200 ease-strong active:scale-[0.995]`}
          style={box}
        >
          <Frame
            src={cover}
            alt={`${work.title} — cover`}
            className="h-full w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.015]"
          />
        </button>
      ) : (
        /* Nothing shot yet. An empty frame that says so is more honest than a
           grey rectangle pretending to be work. */
        <div className={`${frame} grid place-items-center`} style={box}>
          <span className="label text-muted-foreground">{work.pending ?? "In progress"}</span>
        </div>
      )}

      <div className="mt-2.5 flex items-start justify-between gap-6">
        <h3 className="text-[0.875rem] leading-[1.5] font-medium">{name}</h3>
        {tags ? (
          <p className="shrink-0 text-right text-[0.875rem] leading-[1.5] text-muted-foreground">
            {tags}
          </p>
        ) : null}
      </div>
    </article>
  );
}
