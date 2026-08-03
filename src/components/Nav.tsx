import { useEffect, useState } from "react";

/**
 * The page's sections, in the order they appear. The nav is generated from
 * this list rather than hand-written, so a chip can never point at a section
 * that isn't there.
 */
const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "playground", label: "Playground" },
  { id: "archive", label: "Archive" },
] as const;

/**
 * Fixed chip navigation.
 *
 * The chips are keycaps rather than pills, and they carry their own surface,
 * so they stay legible over whatever is passing beneath them and the bar
 * itself never needs to grow a background on scroll. What sits behind them is
 * a masked blur: fully blurred at the very top, fading to nothing by the
 * bottom of the strip, which reads as the page softening under the chips
 * rather than as a bar appearing.
 *
 * The filled chip marks the section you are currently reading — a real state,
 * not a hover echo — so the nav answers "where am I" as well as "where can I
 * go". `Playground` and `Archive` step out below `sm`: four chips plus the
 * contact key overflow a phone, and both sections are a scroll away regardless.
 */
export function Nav() {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    // A thin band across the middle of the viewport, so the active section is
    // whichever one the reader is actually looking at — not whichever one
    // happens to have a pixel on screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-background/45 backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_0%,black_42%,transparent_100%)]"
      />

      <nav
        aria-label="Sections"
        className="relative mx-auto flex w-full max-w-[76rem] items-center justify-between gap-4 px-5 py-5 sm:px-10 lg:px-14"
      >
        <ul className="flex items-center gap-1.5">
          {sections.map((section, i) => (
            <li
              key={section.id}
              // The two that step out on phones are the two furthest down the
              // page, so the visible pair still matches reading order.
              className={i >= 2 ? "hidden sm:block" : undefined}
            >
              <a
                href={`#${section.id}`}
                data-current={current === section.id}
                aria-current={current === section.id ? "true" : undefined}
                className="chip label rise-in"
                style={{ "--i": i } as React.CSSProperties}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="mailto:hello@adiel.design"
          className="chip label rise-in"
          style={{ "--i": sections.length } as React.CSSProperties}
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
