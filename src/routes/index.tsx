import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { LocalTime } from "@/components/LocalTime";
import { SoundToggle } from "@/components/SoundToggle";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import { ProjectCard, type Work } from "@/components/ProjectCard";
import { CardFan } from "@/components/CardFan";
import { ArrowUpRight } from "@/components/icons";

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
    meta: "Brand, web, motion",
    year: "2026",
    tint: "oklch(0.22 0.006 60)",
    ink: "light",
  },
  { title: "Semantic", meta: "Brand, web, motion", year: "2026", tint: "oklch(0.93 0.03 85)" },
  { title: "Maters", meta: "Web, vibecoding", year: "2026", tint: "oklch(0.9 0.03 145)" },
  {
    title: "Serveo",
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
  { title: "Cipher", meta: "Brand, web", year: "2025", tint: "oklch(0.89 0.008 70)" },
];

/**
 * Groups the flat list by year, newest first, and hands every row a running
 * catalog number across the whole list — the numbers belong to the archive,
 * not to the year, so they never restart.
 */
function byYear(rows: Work[]) {
  const numbered = rows.map((row, i) => ({ row, no: String(i + 1).padStart(2, "0") }));
  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => b.localeCompare(a));
  return years.map((year) => ({ year, items: numbered.filter((n) => n.row.year === year) }));
}

/** Sets the entrance delay slot for a masthead line. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

const container = "mx-auto w-full max-w-[76rem] px-6 sm:px-10 lg:px-14";

/** Section label with the rule that finishes it. */
function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-5">
      <h2 className="label text-muted-foreground">{children}</h2>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}

/** Marks the state the page is in. The dot is the cue; the words carry it. */
function Status() {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="size-[7px] shrink-0 rounded-full bg-accent shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-accent)_14%,transparent)]"
      />
      Available for 2026
    </span>
  );
}

function Home() {
  const groups = byYear(work);
  const [gallery, setGallery] = useState<Work | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // The masthead sits over the page; the bar only earns a surface once the
  // content has started to slide underneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ease-soft ${
          scrolled
            ? "border-b border-hairline bg-background/85 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className={`${container} flex items-center justify-between gap-6 py-4`}>
          <a
            href="#top"
            className="label transition-opacity duration-200 ease-strong hover:opacity-60"
          >
            Adiel Vásquez
          </a>
          <div className="label flex items-center gap-6 text-muted-foreground">
            <span className="hidden sm:inline-flex">
              <Status />
            </span>
            <a
              href="mailto:hello@adiel.design"
              className="transition-colors duration-200 ease-strong hover:text-foreground"
            >
              {/* The full address needs more room than a phone has beside the
                  wordmark, so small screens get the short label instead. */}
              <span className="sm:hidden">Email</span>
              <span className="hidden sm:inline">hello@adiel.design</span>
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/*
         * Masthead. The name arrives a line at a time from behind its own
         * mask — the one staged, run-once sequence on the page.
         */}
        <section className={`${container} pt-36 pb-20 sm:pt-48 sm:pb-28`}>
          <p className="line-mask label text-muted-foreground">
            <span className="line-in inline-block" style={at(0)}>
              Independent brand &amp; web designer
            </span>
          </p>

          <h1 className="display mt-8 text-[clamp(3.5rem,13vw,10rem)]">
            <span className="line-mask">
              <span className="line-in" style={at(1)}>
                Adiel
              </span>
            </span>
            <span className="line-mask">
              <span className="line-in" style={at(2)}>
                Vásquez
              </span>
            </span>
          </h1>

          {/* Prose sits in the right half — the asymmetry is what keeps the
              masthead from reading as a centred title card. */}
          <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12">
            <div className="lg:col-start-6 lg:col-end-13">
              <Reveal>
                <div className="max-w-[54ch] space-y-5 text-prose">
                  <p className="text-[1.1875rem] leading-[1.55] text-foreground">
                    I work with startups and studios on identities and websites with real character
                    — concept-first, execution-obsessed, allergic to generic.
                  </p>
                  <p>
                    Most days that means naming, identity systems, art direction and the site that
                    carries them, built end to end. I sit on the{" "}
                    <a
                      className="link"
                      href="https://www.awwwards.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
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
              </Reveal>
            </div>
          </div>
        </section>

        <section className={`${container} pb-24 sm:pb-32`}>
          <Reveal>
            <SectionLabel>Selected work</SectionLabel>
          </Reveal>

          <div className="mt-12 flex flex-col gap-20 sm:gap-24">
            {groups.map((group) => (
              <div key={group.year}>
                <Reveal>
                  <p className="label mb-8 flex items-center gap-4 text-muted-foreground">
                    <span aria-hidden className="h-px w-8 bg-foreground/25" />
                    {group.year}
                  </p>
                </Reveal>

                <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2">
                  {group.items.map(({ row, no }, i) => (
                    // Only the first two cards in a row stagger. Past that the
                    // delay would outlast the scroll and land after the reader.
                    <Reveal
                      key={row.title}
                      delay={Math.min(i, 1) * 90}
                      className={i === 0 ? "sm:col-span-2" : ""}
                    >
                      <ProjectCard work={row} index={no} featured={i === 0} onOpen={setGallery} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Elsewhere, given a surface of its own so the page has one moment
            of white before the colophon. */}
        <section className={`${container} pb-24 sm:pb-32`}>
          <Reveal>
            <div className="rounded-panel bg-surface px-8 py-16 text-center shadow-card sm:px-16 sm:py-20">
              <p className="label text-muted-foreground">Elsewhere</p>

              {/* A spread of covers with contrasting weight — two flat tints,
                  one photographic, one dark — rather than the first four. */}
              <div className="mt-12 mb-14">
                <CardFan items={[work[0], work[1], work[4], work[5]]} />
              </div>

              <p className="display mx-auto max-w-[14ch] text-[clamp(2rem,5vw,3.5rem)]">
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
                className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-border px-6 py-3.5 text-[0.9375rem] transition-[background-color,border-color,color,transform] duration-300 ease-strong hover:border-foreground hover:bg-foreground hover:text-background active:scale-[0.96]"
              >
                Visit adiel.design
                <ArrowUpRight className="size-4 transition-transform duration-300 ease-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        </section>

        <footer className={`${container} pb-16`}>
          <div className="flex flex-col gap-8 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <nav className="label flex flex-wrap items-center gap-x-8 gap-y-4">
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
