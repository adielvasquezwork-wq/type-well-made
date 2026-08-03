import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties } from "react";
import { LocalTime } from "@/components/LocalTime";
import { SoundToggle } from "@/components/SoundToggle";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import { Nav } from "@/components/Nav";
import { Mark } from "@/components/Mark";
import { ProjectCard, type Work } from "@/components/ProjectCard";
import { CoverStrip, Ticks, type Print } from "@/components/CoverStrip";
import { ArrowUpRight, Asterisk } from "@/components/icons";

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

const work: Work[] = [
  {
    title: "Opus",
    blurb: "Identity, site and motion system for a research studio that ships in public.",
    meta: "Brand, web, motion",
    year: "2026",
    tint: "oklch(0.22 0.006 60)",
    ink: "light",
  },
  {
    title: "Semantic",
    blurb: "A brand built on one rule: meaning arrives before decoration does.",
    meta: "Brand, web, motion",
    year: "2026",
    tint: "oklch(0.93 0.03 85)",
  },
  {
    title: "Maters",
    blurb: "Designed and vibecoded end to end in a week, without losing the craft.",
    meta: "Web, vibecoding",
    year: "2026",
    tint: "oklch(0.9 0.03 145)",
  },
  {
    title: "Serveo",
    blurb: "Naming, identity and website for a service platform starting from zero.",
    href: "https://adiel.design/serveo",
    meta: "Brand, web, naming",
    year: "2025",
    tint: "oklch(0.88 0.035 55)",
    images: [
      "https://framerusercontent.com/images/l7zfXudj0Gcle7M4WBCLsDU5Y.jpg",
      "https://framerusercontent.com/images/t48AH01F2ws45pm1R7STMBW0mgM.jpg",
      "https://framerusercontent.com/images/8u7RRRYRgcTox1dPSEespWV2FoI.jpg",
      "https://framerusercontent.com/images/kYAYwybdRgLVzl2msMuMCcMJFeQ.jpg",
    ],
  },
  {
    title: "Grain",
    blurb: "A generative identity that draws its own patterns, one seed at a time.",
    href: "https://adiel.design/grain",
    meta: "Brand, web, naming",
    year: "2025",
    tint: "oklch(0.87 0.025 250)",
    // Frames from the project's own brand reel — palette card, pattern
    // generator, a live session, and the mark.
    images: [
      "/work/grain/grain-1-palette.jpg",
      "/work/grain/grain-2-pattern.jpg",
      "/work/grain/grain-3-session.jpg",
      "/work/grain/grain-4-mark.jpg",
    ],
  },
  {
    title: "Cipher",
    blurb: "Identity and site for a security company that wanted to say much less.",
    meta: "Brand, web",
    year: "2025",
    tint: "oklch(0.89 0.008 70)",
  },
];

/**
 * The playground deck. Photographic frames and flat covers alternate, and no
 * two neighbours come from the same project — the row should read as a spread
 * of unrelated prints rather than as two case studies shuffled together.
 *
 * Every card carries a tint whether or not it carries art, so a slow or dead
 * CDN costs the deck an image and not its composition.
 */
const prints: Print[] = [
  { src: "/work/grain/grain-1-palette.jpg", tint: "oklch(0.87 0.025 250)" },
  { title: "Opus", tint: "oklch(0.22 0.006 60)", ink: "light" },
  {
    src: "https://framerusercontent.com/images/l7zfXudj0Gcle7M4WBCLsDU5Y.jpg",
    tint: "oklch(0.88 0.035 55)",
  },
  { src: "/work/grain/grain-2-pattern.jpg", tint: "oklch(0.87 0.025 250)" },
  { title: "Semantic", tint: "oklch(0.93 0.03 85)" },
  {
    src: "https://framerusercontent.com/images/t48AH01F2ws45pm1R7STMBW0mgM.jpg",
    tint: "oklch(0.88 0.035 55)",
  },
  { src: "/work/grain/grain-3-session.jpg", tint: "oklch(0.87 0.025 250)" },
  { title: "Cipher", tint: "oklch(0.89 0.008 70)" },
];

/** The practical facts, kept out of the prose so the prose can stay prose. */
const facts = [
  { term: "Based", detail: "Denver, Colorado" },
  { term: "Focus", detail: "Brand, web, naming, art direction" },
  { term: "Jury", detail: "Awwwards Young Jury" },
];

/** Sets the entrance delay slot for an intro block. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

const container = "mx-auto w-full max-w-[76rem] px-5 sm:px-10 lg:px-14";

/** Section marker with the rule that finishes it. */
function SectionLabel({ children, count }: { children: string; count?: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="label text-muted-foreground">{children}</h2>
      <span aria-hidden className="h-px flex-1 bg-border" />
      {count ? <span className="label text-muted-foreground">{count}</span> : null}
    </div>
  );
}

/** Marks the state the page is in. The dot is the cue; the words carry it. */
function Status() {
  return (
    <span className="label inline-flex items-center gap-2 text-muted-foreground">
      <span
        aria-hidden
        className="size-[6px] shrink-0 rounded-full bg-accent shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-accent)_14%,transparent)]"
      />
      Available for 2026
    </span>
  );
}

function Home() {
  const [gallery, setGallery] = useState<Work | null>(null);

  return (
    <>
      <Nav />

      <main id="top">
        {/*
         * The masthead is deliberately small. The old one set the name at
         * 10rem and spent a whole screen doing it; the work is the thing
         * worth that much room, so the introduction now costs a card's height
         * and hands the page straight over to the grid.
         */}
        <section className={`${container} relative pt-32 pb-16 sm:pt-40 sm:pb-20`}>
          {/* The introduction is left-weighted, which leaves the right of the
              masthead empty. The marks give that half something to be. */}
          <Ticks className="pointer-events-none absolute top-32 right-16 hidden h-44 -rotate-12 text-foreground/30 lg:block" />

          <div className="flex items-center gap-3.5 rise-in" style={at(0)}>
            <Mark />
            <div className="min-w-0">
              <h1 className="text-[0.9375rem] leading-tight font-medium">Adiel Vásquez</h1>
              <p className="text-[0.9375rem] leading-tight text-muted-foreground">
                Independent brand &amp; web designer
              </p>
            </div>
          </div>

          {/* Held at the name's size so the masthead reads as one block rather
              than as a small name introducing a larger paragraph. */}
          <p
            className="mt-7 max-w-[54ch] text-base leading-[1.62] text-prose rise-in"
            style={at(1)}
          >
            I work with startups and studios on identities and websites with real character —
            concept first, execution obsessed, allergic to generic. I sit on the{" "}
            <a
              className="link inline-flex items-baseline gap-1"
              href="https://www.awwwards.com/"
              target="_blank"
              rel="noreferrer"
            >
              <Asterisk className="size-3 translate-y-px self-center text-accent" />
              Awwwards
            </a>{" "}
            Young Jury, care <em className="stress text-foreground">deeply</em> about craft, and
            like to make people feel something through the work.
          </p>

          <div className="mt-8 rise-in" style={at(2)}>
            <Status />
          </div>
        </section>

        <section id="work" className={`${container} pb-24 sm:pb-32`}>
          <Reveal>
            <SectionLabel count={`${work.length} projects`}>Selected work</SectionLabel>
          </Reveal>

          {/*
           * A flat, even grid. The covers already carry six different colour
           * temperatures — giving one of them a double-width slot on top of
           * that would be two claims about hierarchy at once.
           */}
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:mt-12 sm:grid-cols-2">
            {work.map((row, i) => (
              // Only the first card of a row staggers. Past that the delay
              // outlasts the scroll and lands after the reader.
              <Reveal key={row.title} delay={(i % 2) * 90}>
                <ProjectCard work={row} onOpen={setGallery} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="about" className={`${container} pb-24 sm:pb-32`}>
          <Reveal>
            <SectionLabel>About</SectionLabel>
          </Reveal>

          {/* Prose sits in the right two-thirds. The facts hold the left, so
              the asymmetry reads as two columns doing different jobs rather
              than as a paragraph that lost its margin. */}
          <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-12 lg:gap-8">
            <dl className="space-y-6 lg:col-start-1 lg:col-end-5">
              {facts.map((fact) => (
                <div key={fact.term}>
                  <dt className="label text-muted-foreground">{fact.term}</dt>
                  <dd className="mt-2 max-w-[24ch] text-[0.9375rem] leading-[1.45]">
                    {fact.detail}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="lg:col-start-6 lg:col-end-13">
              <Reveal>
                <div className="max-w-[54ch] space-y-5 text-prose">
                  <p className="text-[1.1875rem] leading-[1.55] text-foreground">
                    Most days that means naming, identity systems, art direction and the site that
                    carries them — built end to end, by one person, on purpose.
                  </p>
                  <p>
                    Working alone is the point rather than the constraint: the brand and the build
                    are the same decision made twice, and nothing gets lost in the handoff. I keep
                    references on{" "}
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
                    , and write the CSS myself.
                  </p>
                  <p>
                    Taking on a small number of projects for 2026 — write to{" "}
                    <a className="link" href="mailto:hello@adiel.design">
                      hello@adiel.design
                    </a>
                    .
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/*
         * The playground runs the full width of the viewport and past both
         * edges, which is the one place the page breaks its own margin. It
         * gets no container for exactly that reason.
         */}
        <section id="playground" className="pb-24 sm:pb-32">
          <div className={container}>
            <Reveal>
              <SectionLabel>Playground</SectionLabel>
            </Reveal>
          </div>

          <Reveal className="mt-12 sm:mt-16">
            <CoverStrip prints={prints} />
          </Reveal>

          <div className={`${container} mt-12 sm:mt-16`}>
            <Reveal>
              {/* A sentence, so it is set as one. The mono caps elsewhere are
                  for markers and values, never for copy that has to be read. */}
              <p className="mx-auto max-w-[44ch] text-center text-[0.9375rem] text-muted-foreground">
                Offcuts, tests and frames that never made it into a case study.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="archive" className={`${container} pb-24 sm:pb-32`}>
          <Reveal>
            <div className="rounded-panel bg-surface px-6 py-14 text-center shadow-card sm:px-16 sm:py-20">
              <p className="label text-muted-foreground">Elsewhere</p>

              <p className="display mx-auto mt-8 max-w-[14ch] text-[clamp(2.25rem,5.5vw,3.75rem)]">
                The longer archive.
              </p>

              <p className="mx-auto mt-6 max-w-[46ch] text-prose">
                Site of the day on A1Gallery, featured on Landbook and the Framer Gallery. Older
                work and full case studies live on the main site.
              </p>

              <a
                href="https://adiel.design/"
                target="_blank"
                rel="noreferrer"
                className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3.5 text-[0.9375rem] text-background shadow-card transition-[box-shadow,transform] duration-300 ease-strong hover:shadow-lift active:scale-[0.96]"
              >
                Visit adiel.design
                <ArrowUpRight className="size-4 transition-transform duration-300 ease-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        </section>

        <footer className={`${container} pb-16`}>
          <div className="flex flex-col gap-8 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <nav
              aria-label="Elsewhere"
              className="label flex flex-wrap items-center gap-x-7 gap-y-4"
            >
              {[
                { label: "Contact", href: "mailto:hello@adiel.design" },
                { label: "Twitter", href: "https://x.com/adieldesign" },
                { label: "Cosmos", href: "https://www.cosmos.so/adiell" },
                { label: "Savee", href: "https://savee.com/theadielv_/" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="link transition-opacity duration-200 ease-strong hover:opacity-60"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="label flex items-center gap-6 text-muted-foreground">
              <SoundToggle />
              <p>
                <LocalTime /> MDT
              </p>
            </div>
          </div>
        </footer>
      </main>

      {gallery?.images ? (
        <Lightbox
          gallery={{
            title: gallery.title,
            meta: gallery.meta,
            year: gallery.year,
            href: gallery.href,
            images: gallery.images,
          }}
          onClose={() => setGallery(null)}
        />
      ) : null}
    </>
  );
}
