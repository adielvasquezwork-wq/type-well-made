import { useState } from "react";
import { ArrowUpRight, Expand } from "@/components/icons";

export type Work = {
  title: string;
  meta: string;
  year: string;
  href?: string;
  /** Real case-study images. Their presence is what makes a card openable. */
  images?: string[];
  /** The card's own colour. Also the fallback if its imagery fails to load. */
  tint?: string;
  /** Which ink the tint takes. Defaults to dark. */
  ink?: "light" | "dark";
};

/**
 * A project in the index.
 *
 * Three states, decided entirely by the data rather than by a flag:
 * with images it opens the gallery, with only a link it goes out to the case
 * study, and with neither it is a plain typographic panel. Nothing is dimmed
 * or disabled — unreleased work simply doesn't offer an affordance it can't
 * honour.
 */
export function ProjectCard({
  work,
  index,
  featured = false,
  onOpen,
}: {
  work: Work;
  index: string;
  featured?: boolean;
  onOpen: (work: Work) => void;
}) {
  const [imageBroken, setImageBroken] = useState(false);
  const hasGallery = Boolean(work.images?.length);
  const interactive = hasGallery || Boolean(work.href);

  /*
   * Every card is a typographic panel first — the project's own name set
   * large in the display serif on a flat tint. Imagery, when there is any,
   * simply covers it. That ordering means a slow or dead image never leaves
   * an empty grey rectangle behind: the cover underneath is already a
   * finished design rather than a placeholder.
   */
  const visual = (
    <>
      <div
        className="absolute inset-0 grid place-items-center px-8"
        style={{ backgroundColor: work.tint ?? "var(--color-secondary)" }}
      >
        <span
          className={`display text-center text-[clamp(2.25rem,5vw,3.75rem)] transition-transform duration-[900ms] ease-soft group-hover:scale-[1.03] ${
            work.ink === "light" ? "text-background" : "text-foreground"
          }`}
        >
          {work.title}
        </span>
      </div>

      {hasGallery && !imageBroken ? (
        <img
          src={work.images![0]}
          alt={`${work.title} — ${work.meta}`}
          loading="lazy"
          decoding="async"
          onError={() => setImageBroken(true)}
          className="relative size-full object-cover transition-transform duration-[900ms] ease-soft group-hover:scale-[1.04]"
        />
      ) : null}
    </>
  );

  const body = (
    <>
      <div
        className={`relative overflow-hidden rounded-card bg-secondary shadow-card transition-[box-shadow,transform] duration-500 ease-soft ${
          interactive ? "group-hover:-translate-y-1 group-hover:shadow-lift" : ""
        } ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}
      >
        {visual}

        {/*
         * The gallery affordance. It rides in on hover, but the arrow beside
         * the title below is always present — motion is never the only thing
         * telling you the card does something.
         */}
        {hasGallery ? (
          <span className="pointer-events-none absolute bottom-4 left-4 flex translate-y-2 items-center gap-2 rounded-full bg-surface/95 px-3.5 py-2 text-[0.8125rem] opacity-0 shadow-card backdrop-blur-sm transition-[opacity,transform] duration-300 ease-soft group-hover:translate-y-0 group-hover:opacity-100">
            View gallery
            <Expand className="size-3.5" />
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="label pt-1 text-muted-foreground tabular-nums">{index}</span>
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-[0.9375rem] font-medium">
            <span className={interactive ? "link" : ""}>{work.title}</span>
            {work.href && !hasGallery ? (
              <ArrowUpRight className="size-3.5 shrink-0 transition-transform duration-300 ease-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            ) : null}
          </h3>
          <p className="mt-1 text-[0.875rem] text-muted-foreground">{work.meta}</p>
        </div>
        <span className="label shrink-0 text-muted-foreground tabular-nums">{work.year}</span>
      </div>
    </>
  );

  const shell = `group block w-full text-left transition-transform duration-200 ease-strong ${
    featured ? "sm:col-span-2" : ""
  }`;

  if (hasGallery) {
    return (
      <button
        type="button"
        onClick={() => onOpen(work)}
        aria-label={`${work.title} — open gallery`}
        // A large surface gets a gentler press than a button would: 0.96 on
        // something this size reads as a lurch rather than a click.
        className={`${shell} active:scale-[0.99]`}
      >
        {body}
      </button>
    );
  }

  if (work.href) {
    return (
      <a
        href={work.href}
        target="_blank"
        rel="noreferrer"
        className={`${shell} active:scale-[0.99]`}
      >
        {body}
      </a>
    );
  }

  return <div className={shell}>{body}</div>;
}
