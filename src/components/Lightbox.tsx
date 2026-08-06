import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Frame } from "@/components/Frame";
import { Close } from "@/components/icons";

export type Gallery = {
  title: string;
  blurb: string;
  images: string[];
};

const EXIT_MS = 240;

/**
 * Full-screen gallery for a single project.
 *
 * Read as one continuous scroll rather than a slideshow: every shot stacked
 * at near-full width, rounded, on an opaque dark ground, with a single white
 * pill close button pinned to the top-right corner. There is no chrome
 * between the images — the caption is a short slug at the top and then the
 * work carries the rest of the page.
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
      <div
        className={`absolute inset-0 bg-[oklch(0.28_0.008_60)] transition-opacity duration-300 ease-soft ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* One white pill, pinned to the corner, the only chrome in here. */}
      <button
        ref={closeRef}
        type="button"
        onClick={dismiss}
        aria-label="Close gallery"
        className={`fixed top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-background text-foreground shadow-panel transition-[opacity,transform] duration-200 ease-strong hover:scale-[1.04] active:scale-[0.96] sm:top-6 sm:right-6 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <Close className="size-4" />
      </button>

      <div className="absolute inset-0 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4">
        <div
          ref={panelRef}
          className={`mx-auto w-full max-w-[76rem] transition-[opacity,transform] duration-[420ms] ease-soft ${
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } ${closing ? "!translate-y-2 !duration-[240ms]" : ""}`}
        >
          <h2 className="sr-only">{gallery.title}</h2>
          <p className="sr-only">{gallery.blurb}</p>

          <div className="flex flex-col gap-2 sm:gap-3">
            {gallery.images.map((src, i) => (
              <Frame
                key={src}
                src={src}
                alt={`${gallery.title}, image ${i + 1} of ${gallery.images.length}`}
                eager={i === 0}
                className="w-full rounded-frame"
              />
            ))}
          </div>

          <div className="h-10 sm:h-14" />
        </div>
      </div>

    </div>,
    document.body,
  );
}
