import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Close } from "@/components/icons";

export type Gallery = {
  title: string;
  meta: string;
  year: string;
  href?: string;
  images: string[];
};

const EXIT_MS = 260;

/**
 * Full-screen gallery for a single project.
 *
 * Enter and exit are deliberately asymmetric: the panel rises 24px into place
 * over 420ms, and leaves by only 12px over 260ms. A soft exit reads as the
 * sheet being set down rather than yanked away, and getting back to the page
 * shouldn't cost the reader as much time as arriving did.
 */
export function Lightbox({ gallery, onClose }: { gallery: Gallery; onClose: () => void }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Whatever was focused when the gallery opened, so it can be handed back.
  const returnRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    setClosing(true);
    window.setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  // Enter on the frame after mount, so the browser has a "from" state to
  // transition out of rather than painting the panel already in place.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    returnRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => returnRef.current?.focus?.();
  }, []);

  // Lock the page behind the overlay. Padding compensates for the scrollbar
  // the lock removes, so the page underneath doesn't shift as it opens.
  useEffect(() => {
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, []);

  // Escape closes; Tab is trapped so focus can't wander onto the inert page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dismiss]);

  const open = entered && !closing;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`${gallery.title} — gallery`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={dismiss}
        className={`absolute inset-0 cursor-default bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 ease-soft ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute inset-0 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-8">
        <div
          ref={panelRef}
          className={`relative mx-auto w-full max-w-4xl transition-[opacity,transform] duration-[420ms] ease-soft ${
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          } ${closing ? "!translate-y-3 !duration-[260ms]" : ""}`}
        >
          <div className="overflow-hidden rounded-panel bg-surface shadow-panel">
            <header className="flex items-start justify-between gap-6 border-b border-hairline px-6 py-5 sm:px-8">
              <div>
                <h2 className="display text-3xl sm:text-4xl">{gallery.title}</h2>
                <p className="label mt-2.5 text-muted-foreground">
                  {gallery.meta} — {gallery.year}
                </p>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={dismiss}
                aria-label="Close gallery"
                className="group -mt-1 -mr-1 grid size-10 shrink-0 place-items-center rounded-full border border-border bg-surface transition-[background-color,border-color,transform] duration-200 ease-strong hover:border-foreground hover:bg-foreground active:scale-[0.96]"
              >
                <Close className="size-4 text-foreground transition-colors duration-200 ease-strong group-hover:text-background" />
              </button>
            </header>

            {/* Padding stays at 12px so the 8px inset radius stays concentric. */}
            <div className="flex flex-col gap-3 p-3">
              {gallery.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${gallery.title}, image ${i + 1} of ${gallery.images.length}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="image-edge w-full rounded-inset bg-background"
                />
              ))}
            </div>

            {gallery.href ? (
              <footer className="border-t border-hairline px-6 py-5 sm:px-8">
                <a
                  href={gallery.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-[0.9375rem] transition-transform duration-200 ease-strong active:scale-[0.96]"
                >
                  <span className="link">Visit the case study</span>
                  <ArrowUpRight className="size-4 transition-transform duration-300 ease-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </footer>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
