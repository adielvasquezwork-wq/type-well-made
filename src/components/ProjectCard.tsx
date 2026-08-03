import { useState } from "react";
import { ArrowUpRight, Expand } from "@/components/icons";

export type Work = {
  title: string;
  /** The one-line reason the project exists. Two lines at most on the card. */
  blurb: string;
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
 * The card is a padded surface with the cover set inside it, which is what
 * gives the caption a place to sit rather than floating loose under a
 * bleeding image. The radii are concentric: 20px outer, 8px of padding, 12px
 * on the cover.
 *
 * Three states, decided entirely by the data rather than by a flag: with
 * images it opens the gallery, with only a link it goes out to the case
 * study, and with neither it is a plain typographic panel. Nothing is dimmed
 * or disabled — unreleased work simply doesn't offer an affordance it can't
 * honour, and says so in words.
 */
export function ProjectCard({ work, onOpen }: { work: Work; onOpen: (work: Work) => void }) {
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
          className={`display text-center text-[clamp(2rem,4.5vw,3.25rem)] transition-transform duration-[600ms] ease-soft group-hover:scale-[1.03] ${
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
          className="relative size-full object-cover transition-transform duration-[600ms] ease-soft group-hover:scale-[1.04]"
        />
      ) : null}
    </>
  );

  const body = (
    <div
      className={`rounded-card bg-surface p-2 shadow-card transition-[box-shadow,transform] duration-300 ease-strong ${
        interactive ? "group-hover:-translate-y-0.5 group-hover:shadow-lift" : ""
      }`}
    >
      {/* 16:10 rather than 4:3 — at half the page width a squarer cover reads
          as a block, and every one of these images is a landscape composition. */}
      <div className="image-edge relative aspect-[16/10] overflow-hidden rounded-image bg-secondary">
        {visual}

        {/*
         * The gallery affordance. It rides in on hover, but the icon beside
         * the title below is always present — motion is never the only thing
         * telling you the card does something.
         */}
        {hasGallery ? (
          <span className="chip label pointer-events-none absolute bottom-3 left-3 translate-y-1.5 bg-surface/92 opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-300 ease-soft group-hover:translate-y-0 group-hover:opacity-100">
            View gallery
            <Expand className="size-3" />
          </span>
        ) : null}
      </div>

      <div className="px-2 pt-4 pb-1.5">
        <div className="flex items-start justify-between gap-4">
          {/* A step up from the label size, and a step up in weight, so the
              project's name still leads the block its description sits in. */}
          <h3 className="label pt-px text-[0.75rem] font-medium text-foreground">{work.title}</h3>

          {hasGallery ? (
            <Expand className="size-3.5 shrink-0 text-muted-foreground transition-[color,transform] duration-300 ease-strong group-hover:scale-110 group-hover:text-foreground" />
          ) : work.href ? (
            <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-[color,transform] duration-300 ease-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          ) : (
            <span className="label shrink-0 pt-px text-muted-foreground">Soon</span>
          )}
        </div>

        {/* Two lines at the widest, so every caption block is the same height
            whatever the copy does. 1.45 keeps the second line breathing. */}
        <p className="mt-2.5 max-w-[36ch] text-[0.875rem] leading-[1.45] text-prose">
          {work.blurb}
        </p>

        <p className="label mt-3.5 text-muted-foreground">
          {work.meta} <span className="px-1 opacity-40">/</span> {work.year}
        </p>
      </div>
    </div>
  );

  /*
   * A card this large gets a gentler press than a button would: 0.96 on
   * something the width of half the page reads as a lurch rather than a click.
   */
  const shell = "group block w-full text-left transition-transform duration-200 ease-strong";

  if (hasGallery) {
    return (
      <button
        type="button"
        onClick={() => onOpen(work)}
        aria-label={`${work.title} — open gallery`}
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
