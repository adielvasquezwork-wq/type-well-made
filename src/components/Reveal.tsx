import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Reveals its children once, when they first scroll into view.
 *
 * The transition itself lives in CSS (`.reveal`) so it stays interruptible —
 * scrolling back up mid-reveal reverses smoothly instead of snapping. The
 * observer disconnects after the first hit: this is an entrance, not an
 * effect that should replay every time the reader passes it.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Stagger within a group. Keep to ~90ms steps, and only a few per group. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion still gets the content, just without the travel.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // Fires a little before the block is fully on screen, so the reveal is
      // finishing as it arrives rather than starting once it is already read.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-shown={shown}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
