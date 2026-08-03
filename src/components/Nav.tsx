import { useEffect, useState } from "react";

/**
 * The page's sections, in the order they appear. The nav is generated from
 * this list rather than hand-written, so a link can never point at a section
 * that isn't there.
 */
const sections = [
  { id: "work", label: "Work" },
  { id: "thoughts", label: "Thoughts" },
] as const;

/**
 * Fixed navigation.
 *
 * A row of solid pills, not text on a bar — the header itself carries no
 * fill of its own, so every bit of surface here lives on the pills
 * themselves. Two fills only: a quiet neutral grey at rest, and a solid dark
 * pill for the one section you're currently reading, which the Contact link
 * also borrows. The filled link is a real state, not a hover echo, so the
 * nav answers "where am I" as well as "where can I go".
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
      <nav aria-label="Sections" className="page flex items-center justify-between gap-4 py-5">
        <ul className="flex items-center gap-1">
          {sections.map((section, i) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-current={current === section.id}
                aria-current={current === section.id ? "true" : undefined}
                className="navlink label rise-in"
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
