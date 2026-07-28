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

/** Groups the flat list by year, newest first, preserving in-year order. */
function byYear(rows: Work[]) {
  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => b.localeCompare(a));
  return years.map((year) => ({ year, rows: rows.filter((r) => r.year === year) }));
}

/** Sets the entrance delay slot for a block. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The only place colour appears. It marks a state — currently open for work —
 * the way a status light does, which is why nothing else on the page is clay.
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
      className="size-4 shrink-0 opacity-50 transition-opacity duration-150 ease-strong group-hover:opacity-100"
    >
      <path d="M5 11 11 5" />
      <path d="M5.5 5H11v5.5" />
    </svg>
  );
}

/**
 * Section label. Body size and sentence case — the hairline tick under it does
 * the separating, so the type never has to shout to mark a boundary.
 */
function Label({ children }: { children: string }) {
  return (
    <>
      <h2 className="text-foreground">{children}</h2>
      <span aria-hidden className="mt-2.5 block h-px w-8 bg-border" />
    </>
  );
}

/**
 * A work row. Bleeds 0.75rem into the gutter on both sides so the hover block
 * reads as a band across the column rather than a box drawn around the text.
 *
 * Tailwind v4 already gates `hover:` behind @media (hover:hover), so touch
 * devices never latch the highlight on tap — no extra variant needed.
 */
const rowBase =
  "-mx-3 flex items-center justify-between gap-6 rounded-lg px-3 py-2.5 transition-colors duration-150 ease-strong";

function Row({ row, onEnter, onLeave }: { row: Work; onEnter: () => void; onLeave: () => void }) {
  const meta = (
    <span className="shrink-0 text-muted-foreground transition-colors duration-150 ease-strong group-hover:text-foreground">
      {row.meta}
    </span>
  );

  if (!row.href) {
    // Unreleased work: same weight as the rest of the list, since the missing
    // arrow is what says "not clickable" — dimming it too would read as noise.
    return (
      <div className={`${rowBase} text-muted-foreground`}>
        <span>{row.title}</span>
        <span className="shrink-0">{row.meta}</span>
      </div>
    );
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
      className={`group ${rowBase} text-muted-foreground hover:bg-foreground/[0.045] hover:text-foreground`}
    >
      <span className="flex items-center gap-1">
        <span>{row.title}</span>
        <ArrowOut />
      </span>
      {meta}
    </a>
  );
}

/**
 * Floating preview: a slider of real case-study screenshots. It carries no
 * background, border, or shadow of its own — just the images — so there's
 * nothing sitting on the page until a project with real shots is hovered.
 *
 * It's positioned relative to the work section rather than the grid, so the
 * single reading column never changes width to make room for it; on anything
 * narrower than a very large desktop there's no space to show it and it
 * doesn't render at all.
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
    <div className="w-[21rem]">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
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
      {images.length > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((src, i) => (
            <span
              key={src}
              aria-hidden
              className={`h-[3px] w-4 rounded-full transition-colors duration-300 ease-strong ${
                i === index ? "bg-foreground" : "bg-foreground/15"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
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
    <main className="relative mx-auto min-h-screen w-full max-w-[34rem] px-6 pb-28 pt-24 text-[0.9rem] leading-[1.55] tracking-[-0.008em] sm:px-8 sm:pt-36">
      <header className="rise-in flex flex-col gap-0.5" style={at(0)}>
        <h1>Adiel Vásquez</h1>
        <p className="text-muted-foreground">Independent brand &amp; web designer</p>
      </header>

      <div className="rise-in mt-10 space-y-4 text-prose" style={at(1)}>
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

      <section className="mt-14">
        <div className="rise-in" style={at(next())}>
          <Label>Selected work</Label>
        </div>

        <div className="mt-5 flex flex-col gap-7">
          {groups.map((group) => (
            <div key={group.year}>
              <p
                className="rise-in font-mono text-[0.72rem] tabular-nums text-muted-foreground/70"
                style={at(next())}
              >
                {group.year}
              </p>
              <ul className="mt-1.5">
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

      {/*
       * Fixed to the viewport rather than laid into the column, so it never
       * changes the page's width or depends on scroll position — it's an
       * overlay that happens to have somewhere to sit only once the screen is
       * wide enough (50vw + half the column + a gap clears the text). Below
       * that it doesn't render at all rather than crowd the reading column.
       */}
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

      <footer
        className="rise-in mt-16 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-4 border-t border-hairline pt-6 text-muted-foreground"
        style={at(next())}
      >
        <p>
          <a className="link" href="mailto:hello@adiel.design">
            Email
          </a>
          {", "}
          <a className="link" href="https://x.com/adieldesign" target="_blank" rel="noreferrer">
            Twitter
          </a>
          {", "}
          <a className="link" href="https://www.cosmos.so/adiell" target="_blank" rel="noreferrer">
            Cosmos
          </a>
          {", "}
          <a className="link" href="https://savee.com/theadielv_/" target="_blank" rel="noreferrer">
            Savee
          </a>
        </p>
        <div className="flex items-baseline gap-5">
          <SoundToggle />
          <p className="font-mono text-[0.72rem] tabular-nums">
            <LocalTime /> MDT
          </p>
        </div>
      </footer>
    </main>
  );
}
