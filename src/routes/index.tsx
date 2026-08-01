import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { LocalTime } from "@/components/LocalTime";
import { SoundToggle } from "@/components/SoundToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adiel Vásquez — Independent Brand & Web Designer" },
      {
        name: "description",
        content:
          "Adiel Vásquez is an independent designer working with startups and studios on brands and websites with a clear point of view.",
      },
      { property: "og:title", content: "Adiel Vásquez — Independent Brand & Web Designer" },
      {
        property: "og:description",
        content:
          "Adiel Vásquez is an independent designer working with startups and studios on brands and websites with a clear point of view.",
      },
    ],
  }),
  component: Home,
});

type Work = {
  title: string;
  href?: string;
  meta: string;
  year: string;
  /**
   * Real screenshots from the case study, shown as a slider in the floating
   * preview. Left empty for anything without a live case study to pull
   * from — the preview simply never appears for that row, rather than
   * standing in a graphic for work that isn't published.
   */
  images?: string[];
};

const work: Work[] = [
  { title: "Opus", meta: "Brand, web, motion", year: "2026" },
  { title: "Semantic", meta: "Brand, web, motion", year: "2026" },
  { title: "Maters", meta: "Web, vibecoding", year: "2026" },
  {
    title: "Serveo",
    href: "https://adiel.design/serveo",
    meta: "Brand, web, naming",
    year: "2025",
    images: [
      "https://framerusercontent.com/images/l7zfXudj0Gcle7M4WBCLsDU5Y.jpg",
      "https://framerusercontent.com/images/t48AH01F2ws45pm1R7STMBW0mgM.jpg",
      "https://framerusercontent.com/images/8u7RRRYRgcTox1dPSEespWV2FoI.jpg",
      "https://framerusercontent.com/images/kYAYwybdRgLVzl2msMuMCcMJFeQ.jpg",
    ],
  },
  {
    title: "Grain",
    href: "https://adiel.design/grain",
    meta: "Brand, web, naming",
    year: "2025",
    // Frames pulled from the project's own brand reel — the palette card,
    // the pattern generator, a live session, and the mark — rather than
    // screenshots of the marketing site.
    images: [
      "/work/grain/grain-1-palette.jpg",
      "/work/grain/grain-2-pattern.jpg",
      "/work/grain/grain-3-session.jpg",
      "/work/grain/grain-4-mark.jpg",
    ],
  },
  { title: "Cipher", meta: "Brand, web", year: "2025" },
];

/**
 * Groups the flat list by year, newest first, and hands every row a running
 * catalog number across the whole list — the numbers belong to the archive,
 * not to the year, so they never restart.
 */
function byYear(rows: Work[]) {
  const numbered = rows.map((row, i) => ({ ...row, no: String(i + 1).padStart(2, "0") }));
  const years = [...new Set(numbered.map((r) => r.year))].sort((a, b) => b.localeCompare(a));
  return years.map((year) => ({ year, rows: numbered.filter((r) => r.year === year) }));
}

/** Sets the entrance delay slot for a block. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The only place colour appears. It marks a state — currently open for work —
 * the way a grease-pencil tick on a folder does, which is why nothing else on
 * the sheet is clay.
 */
function StatusDot() {
  return (
    <span
      aria-hidden
      className="mr-2 inline-block size-[6px] shrink-0 -translate-y-[0.15em] rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]"
    />
  );
}

/** External-link glyph. Present, not revealed on hover — the row shouldn't twitch. */
function ArrowOut() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-[13px] shrink-0 -translate-y-px opacity-45 transition-opacity duration-150 ease-strong group-hover:opacity-100"
    >
      <path d="M5 11 11 5" />
      <path d="M5.5 5H11v5.5" />
    </svg>
  );
}

/**
 * Section heading, set as a typed catalog label rather than a bigger line of
 * type. The rule finishes it and carries one short clay tick at the far end —
 * the same mark used on the folder tab, so the sheet reads as one system.
 */
function Label({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="label-tag text-muted-foreground">{children}</h2>
      <span aria-hidden className="h-px flex-1 bg-hairline" />
      <span aria-hidden className="h-px w-2.5 bg-accent/60" />
    </div>
  );
}

/**
 * An index row, set like a line in a catalog: running number, title, dotted
 * leader, discipline. The leader is what aligns the two ends, so no column
 * widths have to be guessed. Bleeds into the gutter so the hover wash reads
 * as ink soaking the line, not a box drawn around it.
 *
 * Tailwind v4 already gates `hover:` behind @media (hover:hover), so touch
 * devices never latch the highlight on tap.
 */
const rowBase =
  "-mx-2.5 flex items-baseline gap-2.5 rounded-[3px] px-2.5 py-[0.55rem] transition-colors duration-150 ease-strong";

function Row({
  row,
  onEnter,
  onLeave,
}: {
  row: Work & { no: string };
  onEnter: () => void;
  onLeave: () => void;
}) {
  const body = (
    <>
      <span className="idx w-[1.35rem] shrink-0 tabular-nums group-hover:text-accent">{row.no}</span>
      <span className="flex items-baseline gap-1.5">
        <span>{row.title}</span>
        {row.href ? <ArrowOut /> : null}
      </span>
      <span aria-hidden className="leader group-hover:border-muted-foreground/60" />
      <span className="label-tag shrink-0 text-muted-foreground transition-colors duration-150 ease-strong group-hover:text-foreground">
        {row.meta}
      </span>
    </>
  );

  if (!row.href) {
    // Unreleased work: same weight as the rest of the index, since the missing
    // arrow is what says "not filed yet" — dimming it would read as noise.
    return <div className={`group ${rowBase} text-muted-foreground`}>{body}</div>;
  }

  return (
    <a
      href={row.href}
      target="_blank"
      rel="noreferrer"
      onPointerEnter={onEnter}
      onFocus={onEnter}
      onPointerLeave={onLeave}
      onBlur={onLeave}
      className={`group ${rowBase} text-prose hover:bg-secondary/55 hover:text-foreground`}
    >
      {body}
    </a>
  );
}

/**
 * Floating preview: a slider of real case-study screenshots, mounted like a
 * print clipped to the sheet — a hairline edge and a faint drop, nothing more.
 *
 * It's fixed to the viewport rather than laid into the column, so the single
 * reading measure never changes width to make room for it; below a very wide
 * desktop it doesn't render at all.
 */
function PreviewSlider({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (images.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), 2400);
    return () => window.clearInterval(id);
  }, [images]);

  return (
    <figure className="w-[20rem]">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3px] border border-border bg-secondary/40 p-1 shadow-[0_1px_0_var(--color-hairline),0_12px_28px_-18px_oklch(0.24_0.007_63_/_0.35)]">
        <div className="relative size-full overflow-hidden rounded-[2px]">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={i === index ? alt : ""}
              loading="lazy"
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ease-strong ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
      <figcaption className="label-tag mt-2.5 flex items-center gap-2 text-muted-foreground">
        <span>{alt}</span>
        {images.length > 1 ? (
          <span aria-hidden className="ml-auto flex items-center gap-1">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-px w-3 transition-colors duration-300 ease-strong ${
                  i === index ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

function Home() {
  const groups = byYear(work);

  // Entrance slots are handed out top to bottom as the page is composed.
  let slot = 2;
  const next = () => slot++;

  const [preview, setPreview] = useState<Work | null>(null);
  // Keeps the last project on screen while the panel fades out, so it
  // doesn't go blank mid-transition.
  const [shown, setShown] = useState<Work | null>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const showPreview = (row: Work) => {
    if (!row.images?.length) return;
    window.clearTimeout(hideTimer.current);
    setShown(row);
    setPreview(row);
  };
  const hidePreview = () => {
    setPreview(null);
    hideTimer.current = window.setTimeout(() => setShown(null), 350);
  };

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[35rem] px-6 pt-14 pb-24 text-[0.9rem] leading-[1.55] tracking-[-0.008em] sm:px-10 sm:pt-20">
      {/*
       * The folder tab. Cut card stock on the top edge of the sheet, carrying
       * the file reference the way a typed label does — it's the page's only
       * ornament, and it's still just a label.
       */}
      <div className="rise-in flex items-stretch" style={at(0)}>
        <span className="tab label-tag flex items-center gap-2 py-[0.42rem] pr-4 pl-3 text-muted-foreground">
          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-accent" />
          AV / 001
        </span>
      </div>
      <div aria-hidden className="rise-in h-px w-full bg-border" style={at(0)} />

      <header className="rise-in mt-12 flex flex-col gap-1.5" style={at(1)}>
        <h1>Adiel Vásquez</h1>
        <p className="label-tag text-muted-foreground">Independent brand &amp; web designer</p>
      </header>

      <div className="rise-in mt-9 space-y-4 text-prose" style={at(2)}>
        <p>
          I work with startups and studios on identities and websites with real character —
          concept-first, execution-obsessed, allergic to generic.
        </p>
        <p>
          Most days that means naming, identity systems, art direction and the site that carries
          them, built end to end. I sit on the{" "}
          <a className="link" href="https://www.awwwards.com/" target="_blank" rel="noreferrer">
            Awwwards
          </a>{" "}
          Young Jury, and keep references on{" "}
          <a className="link" href="https://www.cosmos.so/adiell" target="_blank" rel="noreferrer">
            Cosmos
          </a>{" "}
          and{" "}
          <a className="link" href="https://savee.com/theadielv_/" target="_blank" rel="noreferrer">
            Savee
          </a>
          .
        </p>
        <p>
          <StatusDot />
          Taking on a small number of projects for 2026 — write to{" "}
          <a className="link" href="mailto:hello@adiel.design">
            hello@adiel.design
          </a>
          .
        </p>
      </div>

      {/*
       * The index. No boxes and no rules across the rows — the running numbers
       * and the dotted leaders already carry the rhythm, and adding ruled stock
       * on top of them only put lines through the type.
       */}
      <section className="mt-14">
        <div className="rise-in" style={at(next())}>
          <Label>Selected work</Label>
        </div>

        <div className="mt-4 flex flex-col gap-6">

          {groups.map((group) => (
            <div key={group.year}>
              <p className="rise-in flex items-baseline gap-2" style={at(next())}>
                <span className="label-tag text-muted-foreground/70">{group.year}</span>
              </p>
              <ul className="mt-1">
                {group.rows.map((row) => (
                  <li key={row.title} className="rise-in" style={at(next())}>
                    <Row row={row} onEnter={() => showPreview(row)} onLeave={hidePreview} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {shown?.images ? (
        <div
          aria-hidden
          className={`pointer-events-none fixed top-1/2 left-[calc(50%+21rem)] hidden -translate-y-1/2 transition-all duration-300 ease-strong 2xl:block ${
            preview ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
          }`}
        >
          <PreviewSlider images={shown.images} alt={`${shown.title} — ${shown.meta}`} />
        </div>
      ) : null}

      <section className="rise-in mt-14 text-prose" style={at(next())}>
        <Label>Elsewhere</Label>
        <p className="mt-4">
          Site of the day on A1Gallery, featured on Landbook and the Framer Gallery. Older work and
          case studies live at{" "}
          <a className="link" href="https://adiel.design/" target="_blank" rel="noreferrer">
            adiel.design
          </a>
          .
        </p>
      </section>

      {/*
       * Colophon. Set entirely in the catalog label, because the foot of the
       * sheet is filing information — not something to be read as prose.
       */}
      <footer
        className="rise-in mt-16 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-4 border-t border-hairline pt-5"
        style={at(next())}
      >
        <p className="label-tag flex items-baseline gap-3 text-muted-foreground">
          <a className="transition-colors duration-150 ease-strong hover:text-accent" href="mailto:hello@adiel.design">
            Email
          </a>
          <span aria-hidden className="text-border">
            ·
          </span>
          <a
            className="transition-colors duration-150 ease-strong hover:text-accent"
            href="https://x.com/adieldesign"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
          <span aria-hidden className="text-border">
            ·
          </span>
          <a
            className="transition-colors duration-150 ease-strong hover:text-accent"
            href="https://www.cosmos.so/adiell"
            target="_blank"
            rel="noreferrer"
          >
            Cosmos
          </a>
          <span aria-hidden className="text-border">
            ·
          </span>
          <a
            className="transition-colors duration-150 ease-strong hover:text-accent"
            href="https://savee.com/theadielv_/"
            target="_blank"
            rel="noreferrer"
          >
            Savee
          </a>
        </p>
        <div className="label-tag flex items-baseline gap-5 text-muted-foreground">
          <SoundToggle />
          <p>
            <LocalTime /> MDT
          </p>
        </div>
      </footer>
    </main>
  );
}
