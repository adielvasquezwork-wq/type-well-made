import { createFileRoute } from "@tanstack/react-router";
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
          "Independent designer working with startups and studios on brands and websites with a clear point of view.",
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

/** Work rows. Add a second array here later and the layout holds. */
function WorkList({ rows }: { rows: Work[] }) {
  return (
    <ul className="mt-6">
      {rows.map((row, i) => {
        const inner = (
          <>
            <span className="w-6 shrink-0 font-mono text-[0.68rem] text-muted-foreground/70 tabular-nums transition-colors duration-500 ease-quiet group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="shrink-0">{row.title}</span>
            <span
              aria-hidden
              className="mx-1 h-px flex-1 translate-y-[-2px] bg-hairline transition-colors duration-500 ease-quiet group-hover:bg-border"
            />
            <span className="hidden shrink-0 text-muted-foreground transition-opacity duration-500 ease-quiet sm:block sm:opacity-60 sm:group-hover:opacity-100">
              {row.meta}
            </span>
            <span className="w-6 shrink-0 text-right font-mono text-[0.68rem] tabular-nums text-muted-foreground/70">
              ’{row.year}
            </span>
          </>
        );

        const shared =
          "group flex items-baseline gap-3 py-[0.55rem] transition-colors duration-500 ease-quiet";

        return (
          <li key={row.title}>
            {row.href ? (
              <a
                href={row.href}
                data-sound-row
                className={`${shared} text-foreground/70 hover:text-foreground`}
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
  return (
    <main className="mx-auto min-h-screen w-full max-w-[34rem] animate-rise px-6 pb-32 pt-28 text-[0.95rem] leading-[1.8] sm:px-8 sm:pt-40">
      <header className="flex items-baseline justify-between gap-6">
        <h1 className="font-medium">Adiel Vásquez</h1>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
          <LocalTime /> mdt
        </p>
      </header>

      <div className="mt-12 space-y-5 text-foreground/85">
        <p>
          I&apos;m an independent brand &amp; web designer. I work with startups and studios on
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
        <Label>Selected work</Label>
        <WorkList rows={work} />
      </section>

      <section className="mt-14 max-w-[30rem] text-muted-foreground">
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

      <footer className="mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t border-hairline pt-6 text-muted-foreground">
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
