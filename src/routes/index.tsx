import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { SoundToggle } from "@/components/SoundToggle";
import { useDenverLight } from "@/hooks/use-denver-light";

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

type Work = { title: string; href?: string; meta: string; year: string };

const work: Work[] = [
  { title: "Serveo", href: "https://adiel.design/serveo", meta: "Brand, web, naming", year: "25" },
  { title: "Grain", href: "https://adiel.design/grain", meta: "Brand, web, naming", year: "25" },
  { title: "Cipher", meta: "Brand, web", year: "25" },
  { title: "Opus", meta: "Brand, web, motion", year: "26" },
  { title: "Semantic", meta: "Brand, web, motion", year: "26" },
  { title: "Maters", meta: "Web, vibecoding", year: "26" },
];

/** Sets the entrance delay slot for a block. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * A ruled section with its mark in the margin — the page's organising unit.
 * The margin collapses above the content on narrow screens.
 */
function Section({
  mark,
  title,
  stagger,
  children,
}: {
  mark: string;
  title: string;
  stagger: number;
  children: ReactNode;
}) {
  return (
    <section
      className="rise-in mt-14 grid gap-y-5 border-t border-hairline pt-6 sm:mt-16 sm:grid-cols-[9rem_1fr] sm:gap-x-10"
      style={at(stagger)}
    >
      <h2 className="label flex items-baseline gap-2 text-muted-foreground/70">
        <span className="text-accent">{mark}</span>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

/**
 * Work table. Column widths are fixed rather than content-sized, so titles,
 * disciplines and years line up down the page even though each row is its
 * own grid. Meta drops under the title where there's no room for a column.
 */
function WorkTable({ rows }: { rows: Work[] }) {
  return (
    <ul className="-mt-1">
      {rows.map((row) => {
        const inner = (
          <>
            <span className="font-serif text-[1.3rem] leading-none tracking-[-0.015em] transition-transform duration-500 ease-quiet group-hover:translate-x-1">
              {row.title}
            </span>

            <span className="label hidden text-muted-foreground opacity-70 transition-opacity duration-500 ease-quiet group-hover:opacity-100 sm:block">
              {row.meta}
            </span>

            <span className="label flex items-baseline justify-end gap-1.5 text-muted-foreground/70">
              ’{row.year}
              <span
                aria-hidden
                className="w-2 -translate-x-1 text-accent opacity-0 transition-all duration-500 ease-quiet group-hover:translate-x-0 group-hover:opacity-100"
              >
                {row.href ? "↗" : ""}
              </span>
            </span>

            {/* No column room on narrow screens, so the discipline sits below. */}
            <span className="label mt-2 text-muted-foreground/80 sm:hidden">{row.meta}</span>
          </>
        );

        const shared =
          "grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-hairline py-4 " +
          "transition-colors duration-500 ease-quiet sm:grid-cols-[1fr_10.5rem_3.25rem]";

        return (
          <li key={row.title}>
            {row.href ? (
              <a
                href={row.href}
                data-sound-row
                className={`group ${shared} text-foreground/80 hover:text-foreground`}
              >
                {inner}
              </a>
            ) : (
              <div data-sound-row className={`${shared} text-foreground/55`}>
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Home() {
  const light = useDenverLight();

  return (
    <main className="relative z-10 mx-auto w-full max-w-[54rem] px-6 pb-28 pt-20 sm:px-10 sm:pt-28">
      <header className="rise-in" style={at(0)}>
        <h1 className="display">Adiel Vásquez</h1>

        <div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-border pt-4">
          <p className="label text-muted-foreground">Independent brand &amp; web designer</p>
          {/* Reads as a dateline: where the work is made, and the light there now. */}
          <p
            className={`label flex items-baseline gap-2 text-muted-foreground transition-opacity duration-1000 ease-quiet ${
              light ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>Denver</span>
            <span aria-hidden className="text-muted-foreground/40">
              /
            </span>
            <span className="tabular-nums">{light?.time ?? "—:—"}</span>
            <span aria-hidden className="text-muted-foreground/40">
              /
            </span>
            <span className="text-accent">{light?.phase ?? ""}</span>
          </p>
        </div>
      </header>

      <p
        className="rise-in mt-14 max-w-[44rem] font-serif text-[clamp(1.3rem,2.6vw,1.7rem)] leading-[1.34] tracking-[-0.014em] text-foreground/90 sm:mt-16"
        style={at(1)}
      >
        I’m an independent brand &amp; web designer. I work with startups and studios on identities
        and websites with real character — concept-first, execution-obsessed, allergic to generic.
      </p>

      <Section mark="01" title="Practice" stagger={2}>
        <div className="max-w-[32rem] space-y-4 text-[0.95rem] leading-[1.72] tracking-[-0.006em] text-foreground/75">
          <p>
            Most days that means naming, identity systems, art direction and the site that carries
            them, built end to end. I sit on the{" "}
            <a className="link" href="https://www.awwwards.com/" target="_blank" rel="noreferrer">
              Awwwards
            </a>{" "}
            Young Jury, and keep references on{" "}
            <a
              className="link"
              href="https://www.cosmos.so/adiell"
              target="_blank"
              rel="noreferrer"
            >
              Cosmos
            </a>{" "}
            and{" "}
            <a
              className="link"
              href="https://savee.com/theadielv_/"
              target="_blank"
              rel="noreferrer"
            >
              Savee
            </a>
            .
          </p>
          <p>
            Taking on a small number of projects for 2026 — write to{" "}
            <a className="link" href="mailto:hello@adiel.design">
              hello@adiel.design
            </a>
            .
          </p>
        </div>
      </Section>

      <Section mark="02" title="Selected work" stagger={3}>
        <WorkTable rows={work} />
      </Section>

      <Section mark="03" title="Elsewhere" stagger={4}>
        <p className="max-w-[32rem] text-[0.95rem] leading-[1.72] tracking-[-0.006em] text-foreground/75">
          Site of the day on A1Gallery, featured on Landbook and the Framer Gallery. Older work and
          case studies live at{" "}
          <a className="link" href="https://adiel.design/" target="_blank" rel="noreferrer">
            adiel.design
          </a>
          .
        </p>
      </Section>

      <footer
        className="rise-in mt-16 grid gap-y-5 border-t border-hairline pt-6 sm:grid-cols-[9rem_1fr] sm:gap-x-10"
        style={at(5)}
      >
        <p className="label text-muted-foreground/70">Contact</p>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
          <p className="text-[0.95rem] tracking-[-0.006em] text-muted-foreground">
            <a className="link" href="mailto:hello@adiel.design">
              Email
            </a>
            {", "}
            <a className="link" href="https://x.com/adieldesign" target="_blank" rel="noreferrer">
              Twitter
            </a>
            {", "}
            <a
              className="link"
              href="https://www.cosmos.so/adiell"
              target="_blank"
              rel="noreferrer"
            >
              Cosmos
            </a>
            {", "}
            <a
              className="link"
              href="https://savee.com/theadielv_/"
              target="_blank"
              rel="noreferrer"
            >
              Savee
            </a>
          </p>
          <SoundToggle />
        </div>
      </footer>
    </main>
  );
}
