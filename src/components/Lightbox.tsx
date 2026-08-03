import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDragRail } from "@/hooks/useDragRail";
import { Frame } from "@/components/Frame";
import { Close } from "@/components/icons";

export type Gallery = {
  title: string;
  blurb: string;
  images: string[];
};

const EXIT_MS = 260;

/**
 * Full-screen gallery for a single project.
 *
 * One large image at a time — a hero, not a scroll of everything at once —
 * with a thumbnail rail underneath for picking among the rest. Both the
 * panel's enter/exit and the thumbnail rail's drag get their own kind of
 * asymmetry: the panel rises 24px into place over 420ms and leaves by only
 * 12px over 260ms, because getting back to the page shouldn't cost as much
 * time as arriving did; the hero itself crossfades between shots rather
 * than cutting, so paging through never reads as a reload.
 *
 * Everything here floats directly on the dark backdrop — no white card, no
 * boxed header — which is also why the title and caption are set in the
 * background colour rather than the foreground one.
 */
export function Lightbox({ gallery, onClose }: { gallery: Gallery; onClose: () => void }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [selected, setSelected] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Whatever was focused when the gallery opened, so it can be handed back.
  const returnRef = useRef<HTMLElement | null>(null);
  const {
    ref: thumbRef,
    bind: thumbBind,
    wasDragged: thumbWasDragged,
  } = useDragRail<HTMLDivElement>();

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

  // Escape closes; the arrow keys page through the shots; Tab is trapped so
  // focus can't wander onto the inert page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
        return;
      }
      if (e.key === "ArrowRight") {
        setSelected((i) => Math.min(gallery.images.length - 1, i + 1));
        return;
      }
      if (e.key === "ArrowLeft") {
        setSelected((i) => Math.max(0, i - 1));
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
  }, [dismiss, gallery.images.length]);

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
        className={`absolute inset-0 cursor-default bg-black/70 backdrop-blur-[2px] transition-opacity duration-300 ease-soft ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/*
       * Fixed to the viewport rather than the panel, so it stays reachable
       * regardless of scroll position in a tall gallery, and given a dark
       * band of its own to sit in rather than a raw offset from the corner.
       * Two things collided before this landed here: at `top-4` it sat
       * directly on the nav's Contact pill, which the backdrop dims but
       * doesn't hide; nudged down to clear the nav, it instead sat right on
       * the hero's own top edge, where a light patch of whatever image
       * happened to be showing could wash out a plain white icon. The
       * scroll wrapper's increased top padding below is what actually
       * carves out that gutter — this offset just centres the button in it.
       */}
      <button
        ref={closeRef}
        type="button"
        onClick={dismiss}
        aria-label="Close gallery"
        className={`fixed top-16 right-4 z-10 grid size-10 place-items-center rounded-full text-background transition-[background-color,opacity,transform] duration-200 ease-strong hover:bg-white/10 active:scale-[0.96] sm:top-20 sm:right-6 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <Close className="size-4" />
      </button>

      <div className="absolute inset-0 overflow-y-auto overscroll-contain px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
        <div
          ref={panelRef}
          className={`relative mx-auto w-full max-w-4xl transition-[opacity,transform] duration-[420ms] ease-soft ${
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          } ${closing ? "!translate-y-3 !duration-[260ms]" : ""}`}
        >
          <div className="image-edge relative aspect-[16/9] overflow-hidden rounded-frame shadow-panel">
            {gallery.images.map((src, i) => (
              <Frame
                key={src}
                src={src}
                alt={`${gallery.title}, image ${i + 1} of ${gallery.images.length}`}
                eager={i === 0}
                className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ease-soft ${
                  i === selected ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              />
            ))}
          </div>

          {gallery.images.length > 1 ? (
            <div
              ref={thumbRef}
              className="thumb-rail mt-3 cursor-grab active:cursor-grabbing"
              {...thumbBind}
            >
              {gallery.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    if (!thumbWasDragged()) setSelected(i);
                  }}
                  aria-label={`Show image ${i + 1} of ${gallery.images.length}`}
                  aria-current={i === selected ? "true" : undefined}
                  className={`image-edge relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-inset transition-opacity duration-200 ease-strong sm:w-24 ${
                    i === selected ? "opacity-100" : "opacity-45 hover:opacity-75"
                  }`}
                >
                  <Frame src={src} alt="" className="pointer-events-none size-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-5 px-1">
            <h2 className="caps text-background">{gallery.title}</h2>
            <p className="mt-2 max-w-[46ch] text-[0.875rem] leading-[1.45] text-background/65">
              {gallery.blurb}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
