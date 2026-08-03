import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties } from "react";
import { LocalTime } from "@/components/LocalTime";
import { SoundToggle } from "@/components/SoundToggle";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import { Nav } from "@/components/Nav";
import { Mark } from "@/components/Mark";
import { ProjectRow, type Work } from "@/components/ProjectRow";
import { Spread, Ticks } from "@/components/Spread";
import { Asterisk } from "@/components/icons";

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

/**
 * The three projects the page shows. Each one becomes a rail: the first three
 * images are what you scroll, and the whole array is what the gallery opens.
 * Adding a fourth project is adding a fourth entry — the section reads the
 * length of this list and nothing else.
 */
const work: Work[] = [
  {
    title: "Grain",
    blurb: "A generative identity that draws its own patterns, one seed at a time.",
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
    title: "Serveo",
    blurb: "Naming, identity and website for a service platform starting from zero.",
    // TODO: these four are still served by the old site's Framer CDN. Move the
    // files into /public/work/serveo/ before that site comes down — this is the
    // last thing on the page that depends on it.
    images: [
      "https://framerusercontent.com/images/l7zfXudj0Gcle7M4WBCLsDU5Y.jpg",
      "https://framerusercontent.com/images/t48AH01F2ws45pm1R7STMBW0mgM.jpg",
      "https://framerusercontent.com/images/8u7RRRYRgcTox1dPSEespWV2FoI.jpg",
      "https://framerusercontent.com/images/kYAYwybdRgLVzl2msMuMCcMJFeQ.jpg",
    ],
  },
  {
    title: "Opus",
    blurb: "Identity, site and motion system for a research studio that ships in public.",
    pending: "Shipping 2026",
  },
];

/**
 * Writing. Empty until there is some — a section that says so reads better
 * than three invented posts, and the empty state costs one array entry to
 * replace. Give an entry an `href` once a post has somewhere to live.
 */
const notes: { title: string; date: string; href?: string }[] = [];

/** Pieces for the playground spread. */
const pieces = [
  "/work/grain/grain-1-palette.jpg",
  "https://framerusercontent.com/images/l7zfXudj0Gcle7M4WBCLsDU5Y.jpg",
  "/work/grain/grain-2-pattern.jpg",
  "https://framerusercontent.com/images/t48AH01F2ws45pm1R7STMBW0mgM.jpg",
  "/work/grain/grain-3-session.jpg",
  "https://framerusercontent.com/images/8u7RRRYRgcTox1dPSEespWV2FoI.jpg",
  "/work/grain/grain-4-mark.jpg",
];

/** Sets the entrance delay slot for an introduction block. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Section marker. Just the word — the rule that used to finish it was one
 * more line on a page whose whole argument is that there aren't many.
 */
function SectionLabel({ children }: { children: string }) {
  return <h2 className="label text-muted-foreground">{children}</h2>;
}

function Home() {
  const [gallery, setGallery] = useState<Work | null>(null);

  return (
    <>
      <Nav />

      <main id="top">
        {/*
         * The introduction. A mark, two lines and a paragraph — everything
         * else that used to live up here was the page talking about itself
         * before it had shown anything.
         */}
        <section className="page pt-32 pb-14 sm:pt-40 sm:pb-16">
          <div className="flex items-center gap-3.5 rise-in" style={at(0)}>
            <Mark />
            <div className="min-w-0">
              <h1 className="text-[0.9375rem] leading-tight font-medium">Adiel Vásquez</h1>
              <p className="text-[0.9375rem] leading-tight text-muted-foreground">
                Independent brand &amp; web designer
              </p>
            </div>
          </div>

          <p
            className="mt-7 max-w-[52ch] text-[0.9375rem] leading-[1.62] text-prose rise-in"
            style={at(1)}
          >
            I work with startups and studios on identities and websites with real character. I sit
            on the{" "}
            <a
              className="link inline-flex items-baseline gap-1"
              href="https://www.awwwards.com/"
              target="_blank"
              rel="noreferrer"
            >
              <Asterisk className="size-3 translate-y-px self-center" />
              Awwwards
            </a>{" "}
            Young Jury, care <em className="stress text-foreground">deeply</em> about craft and
            quality, and like to make people feel something through my work.
          </p>
        </section>

        {/*
         * Work. Each project owns a full-width band: a rail of frames that
         * runs off the right edge, and a caption under the first one. No
         * grid — six small cards side by side was the version that turned
         * the work into thumbnails.
         */}
        <section id="work" className="pb-24 sm:pb-32">
          <div className="page">
            <Reveal>
              <SectionLabel>Selected work</SectionLabel>
            </Reveal>
          </div>

          <div className="mt-6 flex flex-col gap-16 sm:gap-20">
            {work.map((project) => (
              <Reveal key={project.title}>
                <ProjectRow work={project} onOpen={setGallery} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="about" className="page pb-24 sm:pb-32">
          <Reveal>
            <SectionLabel>About</SectionLabel>
          </Reveal>

          <Reveal>
            <div className="mt-6 max-w-[58ch] space-y-5 text-[0.9375rem] leading-[1.62] text-prose">
              <p className="text-[1.0625rem] leading-[1.55] text-foreground">
                Most days that means naming, identity systems, art direction and the site that
                carries them — built end to end, by one person, on purpose.
              </p>
              <p>
                Working alone is the point rather than the constraint: the brand and the build are
                the same decision made twice, and nothing gets lost in the handoff. I keep
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
        </section>

        <section id="thoughts" className="page pb-24 sm:pb-32">
          <Reveal>
            <SectionLabel>Thoughts</SectionLabel>
          </Reveal>

          <Reveal>
            {notes.length ? (
              <ul className="mt-6 max-w-[58ch]">
                {notes.map((note) => {
                  const row = (
                    <>
                      <span className="text-[0.9375rem]">{note.title}</span>
                      <span className="label shrink-0 text-muted-foreground">{note.date}</span>
                    </>
                  );
                  return (
                    <li key={note.title} className="border-b border-hairline last:border-0">
                      {note.href ? (
                        <a
                          href={note.href}
                          className="group flex items-baseline justify-between gap-6 py-4 transition-opacity duration-200 ease-strong hover:opacity-60"
                        >
                          {row}
                        </a>
                      ) : (
                        <div className="flex items-baseline justify-between gap-6 py-4">{row}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-[1.62] text-prose">
                Notes on craft, process and the things that don’t fit in a case study. The first one
                is coming.
              </p>
            )}
          </Reveal>
        </section>

        {/*
         * The playground runs the full width of the viewport and past both
         * edges, which is the one place the page breaks its own margin. It
         * gets no container for exactly that reason.
         */}
        <section id="playground" className="pb-24 sm:pb-32">
          <div className="page">
            <Reveal>
              <SectionLabel>Playground</SectionLabel>
            </Reveal>
          </div>

          <Reveal className="relative mt-8 sm:mt-12">
            <Ticks className="pointer-events-none absolute top-1/2 left-3 hidden h-24 -translate-y-1/2 text-foreground/25 sm:block" />
            <Spread pieces={pieces} />
          </Reveal>

          <div className="page mt-10 sm:mt-12">
            <Reveal>
              <p className="mx-auto max-w-[44ch] text-center text-[0.9375rem] text-muted-foreground">
                Offcuts, tests and frames that never made it into a case study.
              </p>
            </Reveal>
          </div>
        </section>

        <footer className="page pb-16">
          <div className="flex flex-col gap-8 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
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
          gallery={{ title: gallery.title, blurb: gallery.blurb, images: gallery.images }}
          onClose={() => setGallery(null)}
        />
      ) : null}
    </>
  );
}
