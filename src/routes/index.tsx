import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import type { CSSProperties } from "react";
import { LocalTime } from "@/components/LocalTime";
import { SoundToggle } from "@/components/SoundToggle";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import { Nav } from "@/components/Nav";
import { ProjectCard, type Work } from "@/components/ProjectCard";
import { fetchWork } from "@/lib/sanity.server";

/** Runs only on the server, so the Sanity project needs no CORS setup. */
const getWork = createServerFn({ method: "GET" }).handler(() => fetchWork());

export const Route = createFileRoute("/")({
  loader: () => getWork(),
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
 * Writing. Empty until there is some — a section that says so reads better
 * than three invented posts, and the empty state costs one array entry to
 * replace. Give an entry an `href` once a post has somewhere to live.
 */
const notes: { title: string; date: string; href?: string }[] = [];

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
  // Cast: the loader always resolves to Work[] (see getWork above), but the
  // router's generic inference doesn't carry that through on this route.
  const work = Route.useLoaderData() as Work[];
  const [gallery, setGallery] = useState<Work | null>(null);

  return (
    <>
      <Nav />

      <main id="top">
        {/*
         * The introduction. One sentence and nothing else, set at a single
         * size and left to sit under a deep band of air — the page says who
         * this is once and then gets out of the way of the work.
         */}
        <section className="page pt-40 pb-12 sm:pt-[15.5rem]">
          <h1 className="statement max-w-[53rem] rise-in" style={at(0)}>
            Adiel Vásquez is a multidisciplinary designer working across brand and web design for
            modern brands to create clear, purposeful designs that thrive in the real world.
          </h1>
        </section>

        {/*
         * Work. Two columns of covers, each kept at the shape it was shot in,
         * so the columns end at different heights instead of ruling a line
         * across the page every row.
         *
         * `columns` rather than a grid of two hand-filled lists: multi-column
         * balances the two by height on its own, and — the reason it wins —
         * it leaves the cards in one flat source order, so the single column
         * on a phone reads 1, 2, 3 and the tab order follows the eye down one
         * column and back up the other. The trailing `-mb-*` swallows the row
         * gap hanging off the last card in each column.
         */}
        <section id="work" className="page pb-24 sm:pb-32">
          <div className="-mb-5 columns-1 gap-4 md:columns-2">
            {work.map((project) => (
              <Reveal key={project.title} className="mb-5 break-inside-avoid">
                <ProjectCard work={project} onOpen={setGallery} />
              </Reveal>
            ))}
          </div>
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
