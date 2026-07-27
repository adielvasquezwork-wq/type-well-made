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

type Row = { title: string; href?: string; meta: string; year: string };

const highlights: Row[] = [
  { title: "Serveo", href: "https://adiel.design/serveo", meta: "Brand, Web, Naming", year: "2025" },
  { title: "Grain", href: "https://adiel.design/grain", meta: "Brand, Web, Naming", year: "2025" },
  { title: "Cipher", meta: "Brand, Web", year: "2025" },
  { title: "Opus", meta: "Brand, Web, Motion", year: "2026" },
  { title: "Semantic", meta: "Brand, Web, Motion", year: "2026" },
  { title: "Maters", meta: "Web, Vibecoding", year: "2026" },
];

const recognition: Row[] = [
  { title: "Awwwards", meta: "Young Jury member", year: "—" },
  { title: "A1Gallery", meta: "Site of the day", year: "1×" },
  { title: "Landbook", meta: "Featured", year: "1×" },
  { title: "Framer Gallery", meta: "Featured", year: "1×" },
];

function Section({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="mt-16">
      <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h2>
      <ul className="mt-5 border-t border-hairline">
        {rows.map((row) => {
          const inner = (
            <>
              <span className="flex items-baseline gap-1.5">
                {row.title}
                {row.href ? (
                  <span
                    aria-hidden
                    className="translate-y-[-1px] text-[0.7em] opacity-40 transition-transform duration-500 ease-quiet group-hover:translate-x-[2px] group-hover:translate-y-[-3px] group-hover:opacity-100"
                  >
                    ↗
                  </span>
                ) : null}
              </span>
              <span className="hidden flex-1 text-muted-foreground sm:block">{row.meta}</span>
              <span className="font-mono text-[0.72rem] tabular-nums text-muted-foreground">
                {row.year}
              </span>
            </>
          );

          const shared =
            "group flex items-baseline justify-between gap-6 py-3 text-[0.95rem] transition-colors duration-500 ease-quiet";

          return (
            <li key={row.title} className="border-b border-hairline">
              {row.href ? (
                <a
                  href={row.href}
                  data-sound-row
                  className={`${shared} text-muted-foreground hover:text-foreground`}
                >
                  {inner}
                </a>
              ) : (
                <div data-sound-row className={`${shared} text-muted-foreground`}>
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[38rem] animate-rise px-6 pb-32 pt-24 text-[0.95rem] leading-[1.75] sm:px-8 sm:pt-36">
      <header>
        <h1 className="text-[0.95rem] font-medium">Adiel Vásquez</h1>
        <p className="text-muted-foreground">
          Independent brand &amp; web designer, Dominican Republic. It&apos;s{" "}
          <LocalTime /> here.
        </p>
      </header>

      <div className="mt-10 space-y-5 text-foreground/90">
        <p>
          I work with startups and studios on brands and websites with real character and a clear
          point of view. My practice is multidisciplinary but grounded in brand and web —
          concept-first, execution-obsessed, and allergic to generic.
        </p>
        <p>
          Most days that means naming, identity systems, art direction and the site that carries
          them, built end to end. I also sit on the{" "}
          <a className="link" href="https://www.awwwards.com/" target="_blank" rel="noreferrer">
            Awwwards
          </a>{" "}
          Young Jury, and I keep a running set of references on{" "}
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
          Currently taking on a small number of projects for 2026. Reach me at{" "}
          <a className="link" href="mailto:hello@adiel.design">
            hello@adiel.design
          </a>{" "}
          or on{" "}
          <a className="link" href="https://x.com/adieldesign" target="_blank" rel="noreferrer">
            Twitter
          </a>
          .
        </p>
      </div>

      <Section title="Highlights" rows={highlights} />
      <Section title="Recognition" rows={recognition} />

      <section className="mt-16">
        <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          Services
        </h2>
        <p className="mt-4 text-muted-foreground">
          Brand identity, website design, creative direction, graphic design, motion, art direction,
          naming, UI/UX, no-code and AI development.
        </p>
      </section>

      <footer className="mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-hairline pt-6 text-muted-foreground">
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
