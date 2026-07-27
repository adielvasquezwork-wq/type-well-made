import { createFileRoute } from "@tanstack/react-router";
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

type Work = { title: string; href?: string; meta: string; year: string };

const work: Work[] = [
  { title: "Serveo", href: "https://adiel.design/serveo", meta: "Brand, web, naming", year: "25" },
  { title: "Grain", href: "https://adiel.design/grain", meta: "Brand, web, naming", year: "25" },
  { title: "Cipher", meta: "Brand, web", year: "25" },
  { title: "Opus", meta: "Brand, web, motion", year: "26" },
  { title: "Semantic", meta: "Brand, web, motion", year: "26" },
  { title: "Maters", meta: "Web, vibecoding", year: "26" },
];

/** Order of the entrance, top to bottom. Rows claim STAGGER_WORK onward. */
const STAGGER_WORK = 3;

/** Sets the entrance delay slot for a block. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Work rows. The meta column is a fixed width so every leader rule stops at
 * the same x — the alignment is what makes the list read as a table rather
 * than six unrelated lines. Add a second array here later and it still holds.
 */
function WorkList({ rows }: { rows: Work[] }) {
  return (
    <ul className="mt-5">
      {rows.map((row, i) => {
        const inner = (
          <>
            <span className="w-6 shrink-0 font-mono text-[0.68rem] tabular-nums text-muted-foreground/70 transition-colors duration-500 ease-quiet group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="shrink-0">{row.title}</span>

            {/* Reserved either way, so linked and unlinked rows share a rhythm. */}
            <span
              aria-hidden
              className="w-[0.7rem] shrink-0 -translate-x-1 font-mono text-[0.62rem] text-accent opacity-0 transition-all duration-500 ease-quiet group-hover:translate-x-0 group-hover:opacity-100"
            >
              {row.href ? "↗" : ""}
            </span>

            <span
              aria-hidden
              className="mx-1 h-px flex-1 translate-y-[-2px] bg-hairline transition-colors duration-500 ease-quiet group-hover:bg-border"
            />

            <span className="hidden w-[8.25rem] shrink-0 whitespace-nowrap text-[0.82rem] text-muted-foreground opacity-60 transition-opacity duration-500 ease-quiet group-hover:opacity-100 sm:block">
              {row.meta}
            </span>

            <span className="w-7 shrink-0 text-right font-mono text-[0.68rem] tabular-nums text-muted-foreground/70">
              ’{row.year}
            </span>

            {/*
             * Narrow screens have no room for a meta column, so it drops to a
             * second line indented under the title (w-6 + gap-3 = pl-9).
             * Hidden at sm+, where nothing wraps and the table layout returns.
             */}
            <span className="w-full pl-9 text-[0.8rem] leading-[1.5] text-muted-foreground/80 sm:hidden">
              {row.meta}
            </span>
          </>
        );

        const shared =
          "flex flex-wrap items-baseline gap-x-3 py-[0.5rem] transition-colors duration-500 ease-quiet";

        return (
          <li key={row.title} className="rise-in" style={at(STAGGER_WORK + i)}>
            {row.href ? (
              <a
                href={row.href}
                data-sound-row
                className={`group ${shared} text-foreground/70 hover:text-foreground`}
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

function Label({ children }: { children: string }) {
  return (
    <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground/70">
      {children}
    </h2>
  );
}

function Home() {
  const afterWork = STAGGER_WORK + work.length;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[34rem] px-6 pb-32 pt-28 text-[0.95rem] leading-[1.8] tracking-[-0.006em] sm:px-8 sm:pt-40">
      <header className="rise-in flex items-baseline justify-between gap-6" style={at(0)}>
        <h1 className="font-medium tracking-[-0.015em]">Adiel Vásquez</h1>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
          <LocalTime /> mdt
        </p>
      </header>

      <div className="rise-in mt-12 space-y-5 text-foreground/85" style={at(1)}>
        <p>
          I’m an independent brand &amp; web designer. I work with startups and studios on
          identities and websites with real character — concept-first, execution-obsessed, allergic
          to generic.
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
          Taking on a small number of projects for 2026 — write to{" "}
          <a className="link" href="mailto:hello@adiel.design">
            hello@adiel.design
          </a>
          .
        </p>
      </div>

      <section className="mt-16">
        <div className="rise-in" style={at(2)}>
          <Label>Selected work</Label>
        </div>
        <WorkList rows={work} />
      </section>

      <section className="rise-in mt-14 max-w-[30rem] text-muted-foreground" style={at(afterWork)}>
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
        className="rise-in mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-hairline pt-6 text-muted-foreground"
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
        <SoundToggle />
      </footer>
    </main>
  );
}
