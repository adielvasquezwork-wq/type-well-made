import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
   * Cover shown in the preview panel. Drop a file in `public/work/` and point
   * at it — `image: "/work/serveo.jpg"`. Anything without one falls back to a
   * typeset panel rather than a stand-in graphic, so the list never implies
   * work that isn't there yet.
   */
  image?: string;
  /** Line under the preview. Defaults to the disciplines. */
  credit?: string;
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
  },
  { title: "Grain", href: "https://adiel.design/grain", meta: "Brand, web, naming", year: "2025" },
  { title: "Cipher", meta: "Brand, web", year: "2025" },
];

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

/** Title over year, so the chip behind a row hugs the text instead of a column. */
const rowBase = "flex flex-col gap-0.5 px-3 py-2";

function RowBody({ row }: { row: Work }) {
  return (
    <>
      <span className="flex items-center gap-1">
        <span
          className={
            row.href
              ? "underline decoration-border decoration-2 underline-offset-2 transition-colors duration-150 ease-strong group-hover:decoration-accent"
              : undefined
          }
        >
          {row.title}
        </span>
        {row.href ? <ArrowOut /> : null}
      </span>
      <span className="text-muted-foreground">
        {row.year}
        {/* No preview panel on small screens, so the disciplines ride along here. */}
        <span className="lg:hidden"> · {row.meta}</span>
      </span>
    </>
  );
}

/**
 * Cover for a project with no image yet: a typeset title card, not a stand-in
 * screenshot. The panel is artwork rather than running text, which is the one
 * place a display size is allowed — the page's type scale is still flat.
 *
 * The wash origin cycles so six of these in a row don't read as one repeated
 * card.
 */
const washes = ["120% 90% at 18% 8%", "115% 95% at 82% 12%", "130% 95% at 50% 0%"];

function PreviewFallback({ row, i }: { row: Work; i: number }) {
  return (
    <div className="relative flex size-full flex-col justify-between p-7">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${washes[i % washes.length]}, color-mix(in oklab, var(--color-accent) 17%, transparent), transparent 70%)`,
        }}
      />
      <p className="relative self-end font-mono text-[0.72rem] tabular-nums text-muted-foreground">
        {row.year}
      </p>
      <div className="relative">
        <p className="text-[1.75rem] leading-[1.1] tracking-[-0.022em] text-foreground">
          {row.title}
        </p>
        <p className="mt-1.5 text-muted-foreground">{row.meta}</p>
      </div>
    </div>
  );
}

/**
 * The work list and its preview. One shared chip slides and resizes between
 * rows rather than each row carrying its own hover background — the travel is
 * what makes the list feel like a single object being read down.
 *
 * Hover and keyboard focus both drive it, so tabbing through the links moves
 * the preview too. The panel itself is a large-screen affordance; on touch the
 * list stands on its own and carries the disciplines inline.
 */
function WorkShowcase({ rows, baseSlot }: { rows: Work[]; baseSlot: number }) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [chip, setChip] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [lit, setLit] = useState(false);
  // Until the chip has been placed once, moving it would mean sliding in from
  // the list's top-left corner.
  const [placed, setPlaced] = useState(false);

  const measure = useCallback((i: number) => {
    const el = itemsRef.current[i];
    if (!el) return;
    setChip({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  }, []);

  useLayoutEffect(() => {
    measure(0);
    const id = requestAnimationFrame(() => setPlaced(true));
    return () => cancelAnimationFrame(id);
  }, [measure]);

  // Rows reflow when the webfont swaps in or the window resizes; the chip has
  // to follow or it ends up sitting beside the text it belongs to.
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure(active));
    ro.observe(list);
    return () => ro.disconnect();
  }, [active, measure]);

  const enter = (i: number) => {
    setActive(i);
    measure(i);
    setLit(true);
  };

  const current = rows[active];
  // The fallback card already names the disciplines, so repeating them under it
  // would just be the same words twice. A real cover gets the caption instead.
  const caption = current.credit ?? (current.image ? current.meta : null);

  return (
    // Auto first column: the list is only as wide as its longest title, so the
    // gap to the panel stays constant instead of being padded out by an
    // arbitrary column width.
    <div className="mt-5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
      <ul
        ref={listRef}
        className="relative -mx-3"
        onPointerLeave={() => setLit(false)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setLit(false);
        }}
      >
        <span
          aria-hidden
          className={`chip pointer-events-none absolute left-0 top-0 -z-10 rounded-xl ${
            placed ? "transition-all duration-[280ms] ease-strong" : ""
          }`}
          style={{
            transform: `translate3d(${chip.x}px, ${chip.y}px, 0)`,
            width: chip.w,
            height: chip.h,
            opacity: lit ? 1 : 0,
          }}
        />
        {rows.map((row, i) => (
          <li
            key={row.title}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            className="rise-in w-fit"
            style={at(baseSlot + i)}
            onPointerEnter={() => enter(i)}
            onFocus={() => enter(i)}
          >
            {row.href ? (
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className={`group ${rowBase} text-foreground`}
              >
                <RowBody row={row} />
              </a>
            ) : (
              // Unreleased work: same size as the rest of the list, since the
              // missing arrow is what says "not clickable" — dimming it too
              // would read as noise.
              <div className={`${rowBase} text-muted-foreground`}>
                <RowBody row={row} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* No top margin: the panel's top edge lines up with the first row. */}
      <div className="rise-in hidden lg:block" style={at(baseSlot + rows.length)}>
        <div className="sticky top-24">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-hairline bg-card">
            {rows.map((row, i) => (
              <div
                key={row.title}
                aria-hidden={i !== active}
                className={`absolute inset-0 transition-opacity duration-300 ease-strong ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                {row.image ? (
                  <img
                    src={row.image}
                    alt={`${row.title} — ${row.meta}`}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  <PreviewFallback row={row} i={i} />
                )}
              </div>
            ))}
          </div>
          {/* Height is reserved so swapping to a project with a credit line
              doesn't nudge everything below it. */}
          <p className="mt-3 min-h-[1.55em] text-muted-foreground">{caption}</p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  // Entrance slots, handed out top to bottom as the page is composed: header
  // and bio take 0 and 1, then the work label, its rows, and its preview.
  const workSlot = 2;
  const listSlot = workSlot + 1;
  const afterWork = listSlot + work.length + 1;

  return (
    /*
     * The reading column stays at 34rem everywhere. On large screens the page
     * itself widens so the work preview has somewhere to sit — the text blocks
     * keep their measure and the composition just gains a right-hand panel.
     */
    <main className="mx-auto min-h-screen w-full max-w-[34rem] px-6 pb-28 pt-24 text-[0.9rem] leading-[1.55] tracking-[-0.008em] sm:px-8 sm:pt-36 lg:max-w-[54rem] lg:px-10">
      <header className="rise-in flex flex-col gap-0.5" style={at(0)}>
        <h1>Adiel Vásquez</h1>
        <p className="text-muted-foreground">Independent brand &amp; web designer</p>
      </header>

      <div className="rise-in mt-10 max-w-[34rem] space-y-4 text-prose" style={at(1)}>
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
        <div className="rise-in" style={at(workSlot)}>
          <Label>Selected work</Label>
        </div>
        <WorkShowcase rows={work} baseSlot={listSlot} />
      </section>

      <section className="rise-in mt-14 max-w-[34rem] text-prose" style={at(afterWork)}>
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
        className="rise-in mt-16 flex max-w-[34rem] flex-wrap items-baseline justify-between gap-x-6 gap-y-4 border-t border-hairline pt-6 text-muted-foreground"
        style={at(afterWork + 1)}
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
