import { useEffect, useState } from "react";

/**
 * The page's sections, in the order they appear. The nav is generated from
 * this list rather than hand-written, so a link can never point at a section
 * that isn't there.
 */
const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "thoughts", label: "Thoughts" },
  { id: "playground", label: "Playground" },
] as const;

/**
 * Fixed navigation.
 *
 * At rest it's just words — no pills, no surface, no bar. The section links
 * sit directly on the page the way a masthead does, and the only fill on the
 * whole row is the one section you're currently reading, which borrows the
 * same solid pill as the Contact button. That's deliberate: a nav that looks
 * like four buttons before you've touched any of them reads as chrome, and
 * this page would rather read as content with a quiet way back to the top.
 *
 * The filled link marks the section you are currently reading — a real
 * state, not a hover echo — so the nav answers "where am I" as well as
 * "where can I go". `Thoughts` and `Playground` step out below `sm`: four
 * links plus Contact overflow a phone, and both sections are a scroll away
 * regardless.
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
