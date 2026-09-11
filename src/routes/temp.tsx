import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CSSProperties } from "react";
import { Frame } from "@/components/Frame";
import { LocalTime } from "@/components/LocalTime";
import { Mark } from "@/components/Mark";
import type { Work } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { fetchWork } from "@/lib/sanity.server";

/**
 * THE TEMPORARY INDEX — /temp
 *
 * A one-pager for the stretch where the work exists and the case studies
 * don't. The home page at `/` is built around projects you can click into;
 * this one drops that idea entirely and shows the pictures themselves, each
 * captioned with a name and a discipline and nothing more. It is the oldest
 * portfolio format there is — a contact sheet — and it is the one format that
 * costs nothing to fill.
 *
 * It reads from the same Sanity projects the home page does, so there is no
 * second place to keep content up to date: every photo in the Studio becomes
 * one tile here, in the order they are filed. Upload a shot and it appears.
 *
 * TO MAKE THIS THE LIVE HOME PAGE: rename this file to `index.tsx`, replacing
 * the one that is there (the old one stays in git history, so switching back
 * is a revert away). Nothing else in the app points at this route.
 */

/** Runs only on the server, so the Sanity project needs no CORS setup. */
const getWork = createServerFn({ method: "GET" }).handler(() => fetchWork());

export const Route = createFileRoute("/temp")({
  loader: () => getWork(),
  head: () => ({
    meta: [
      { title: "Adiel Vásquez — Selected Work" },
      {
        name: "description",
        content:
          "A short index of recent brand and web work by Adiel Vásquez, an independent multidisciplinary designer.",
      },
      { property: "og:title", content: "Adiel Vásquez — Selected Work" },
      {
        property: "og:description",
        content:
          "A short index of recent brand and web work by Adiel Vásquez, an independent multidisciplinary designer.",
      },
    ],
  }),
  component: TemporaryIndex,
});

/**
 * The second line of a caption — what the project was, and when.
 *
 * Keyed by the project's title in Sanity. Whatever you type here is printed
 * as-is, so a year is just more text: `"Brand Identity, 2025"`. A project
 * with no entry shows its name alone, which is a caption too, not a hole.
 *
 * Sanity wins when it has something to say: fill a project's **Disciplines**
 * field in the Studio and that is used instead of the line below, and the
 * line below can then be deleted.
 */
const disciplines: Record<string, string> = {
  Serveo: "Naming, Identity, Web",
  Grain: "Brand Identity",
};

/** Where to find him. The rail's last block, and the only ask on the page. */
const elsewhere = [
  { label: "hello@adiel.design", href: "mailto:hello@adiel.design" },
  { label: "Twitter", href: "https://x.com/adieldesign" },
  { label: "Cosmos", href: "https://www.cosmos.so/adiell" },
  { label: "Savee", href: "https://savee.com/theadielv_/" },
];

/** Used only for a photo whose URL didn't carry its pixel size. */
const FALLBACK_RATIO = 4 / 3;

/** Sets the entrance delay slot for a block in the rail. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** One picture on the page, with everything it needs to be captioned. */
type Shot = {
  key: string;
  src: string;
  /** Width ÷ height. Holds the box open at the right shape before it loads. */
  ratio: number;
  title: string;
  caption: string | null;
  /** Which shot of the project this is — alt text only. */
  index: number;
  total: number;
};

/**
 * Projects in, pictures out.
 *
 * The home page takes one cover per project and hides the rest behind a
 * click. Here every photo is its own tile, which is the whole trick: four
 * shots of one identity fill four slots in the grid, so a body of work that
 * is two projects deep still reads as a page of work.
 */
function toShots(work: Work[]): Shot[] {
  return work.flatMap((project) => {
    // Titles are typed by hand in the Studio and arrive with whatever
    // whitespace came with them; the caption map is keyed on the clean one.
    const title = project.title.trim();
    const caption = project.tags?.length ? project.tags.join(", ") : (disciplines[title] ?? null);
    const images = project.images ?? [];

    return images.map((image, i) => ({
      key: `${title}-${i}`,
      src: image.src,
      ratio: image.ratio ?? FALLBACK_RATIO,
      title,
      caption,
      index: i + 1,
      total: images.length,
    }));
  });
}

function TemporaryIndex() {
  // Cast: the loader always resolves to Work[] (see getWork above), but the
  // router's generic inference doesn't carry that through on this route.
  const shots = toShots(Route.useLoaderData() as Work[]);

  return (
    <main className="page flex min-h-dvh flex-col pt-10 pb-10 sm:pt-12">
      {/* The page shows no heading — the references it follows don't, and a
          title above a contact sheet is a caption for something that captions
          itself. It still needs one for a screen reader and a search result. */}
      <h1 className="sr-only">Adiel Vásquez — selected work</h1>

      {/*
       * Two columns that do different jobs. The left one is the whole of the
       * writing — who this is, and where to reach him — and it sticks, so
       * both stay on screen for the entire scroll rather than leaving at the
       * first row of pictures. The right one is work, and nothing else.
       *
       * Proportional rather than a fixed rail width: at 2.6:1 the text column
       * lands between about 240 and 400px at every size it is used, which
       * keeps the measure readable without ever taking width off the work.
       */}
      <div className="grid gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] lg:gap-x-16">
        <aside className="lg:sticky lg:top-12 lg:flex lg:h-[calc(100dvh-6rem)] lg:flex-col lg:justify-between lg:gap-12">
          <div className="rise-in" style={at(0)}>
            <Mark />
          </div>

          {/*
           * One paragraph in two tones. The first sentence is the claim and
           * is set in full ink; the second is the housekeeping — why there
           * are no case studies behind these pictures — and steps back into
           * grey. Saying it plainly costs one sentence and is worth more than
           * a page of placeholders pretending to be writing.
           */}
          <p
            className="rise-in mt-12 max-w-[36ch] text-[0.9375rem] leading-[1.62] lg:mt-0"
            style={at(1)}
          >
            Adiel Vásquez is a multidisciplinary designer working across brand and web design for
            modern brands to create clear, purposeful designs that thrive in the real world.{" "}
            <span className="text-muted-foreground">
              Full case studies are on the way. This is a short index of recent work in the
              meantime.
            </span>
          </p>

          <nav aria-label="Elsewhere" className="rise-in mt-12 lg:mt-0" style={at(2)}>
            <ul className="label flex flex-wrap gap-x-7 gap-y-3 lg:flex-col lg:items-start lg:gap-y-3">
              {elsewhere.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="link transition-opacity duration-200 ease-strong hover:opacity-60"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/*
         * The contact sheet. Two columns of pictures, each kept at the shape
         * it was shot in, so the columns end at different heights instead of
         * ruling a line across the page every row — the ragged bottom is what
         * makes a grid of pictures read as work rather than as tiles.
         *
         * `columns` rather than a two-item grid, for the same reason the home
         * page uses it: multi-column balances the two by height on its own,
         * and it leaves the tiles in one flat source order, so the single
         * column on a phone reads 1, 2, 3.
         *
         * Nothing here is a link. There is nowhere to click through to yet,
         * and a tile that lifts under the cursor and then does nothing is a
         * worse promise than a tile that sits still.
         */}
        {shots.length ? (
          <div className="-mb-10 columns-1 gap-6 sm:columns-2">
            {shots.map((shot, i) => (
              <Reveal
                key={shot.key}
                delay={Math.min(i, 3) * 90}
                className="mb-10 break-inside-avoid"
              >
                <figure>
                  <div
                    className="image-edge overflow-hidden rounded-card bg-placeholder"
                    style={{ aspectRatio: `${shot.ratio}` }}
                  >
                    <Frame
                      src={shot.src}
                      alt={`${shot.title} — ${shot.index} of ${shot.total}`}
                      // Roughly the first screen — which tiles that is depends
                      // on how the columns balance, so it is a guess, but a
                      // cheap one: the rest stay lazy.
                      eager={i < 4}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <figcaption className="mt-3">
                    <span className="block text-[0.875rem] leading-[1.5] font-medium">
                      {shot.title}
                    </span>
                    {shot.caption ? (
                      <span className="block text-[0.875rem] leading-[1.5] text-muted-foreground">
                        {shot.caption}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          /* The Studio is empty, or the fetch failed. Either way, say so
             quietly rather than leaving the page looking half-painted. */
          <p className="max-w-[46ch] text-[0.9375rem] leading-[1.62] text-prose">
            The work isn’t loading right now. Email is the fastest way to see it in the meantime.
          </p>
        )}
      </div>

      {/* `mt-auto` so the footer sits on the bottom of the screen on a short
          page, and at the end of the pictures on a long one. The padding runs
          deliberately long: the grid above ends on a negative margin that eats
          40px of whatever is set here. */}
      <footer className="mt-auto pt-28 sm:pt-36">
        <div className="label flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-hairline pt-6 text-muted-foreground">
          <p>Adiel Vásquez — 2026</p>
          <p>
            <LocalTime /> MDT
          </p>
        </div>
      </footer>
    </main>
  );
}
