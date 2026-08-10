import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Frame } from "@/components/Frame";
import { Close } from "@/components/icons";
import type { Shot } from "@/components/ProjectCard";

export type Gallery = {
  title: string;
  blurb: string;
  images: Shot[];
};

/**
 * How long the page behind takes to settle — the `#shell` transition in
 * `styles.css`, which outlasts the sheet's own 450ms travel. The component
 * stays mounted for this long after a dismiss, because its cleanup is what
 * hands the page back its scroll, and doing that early would cut the
 * animation short.
 */
const SHELL_MS = 600;
/** Pull the sheet further than this, or faster than this, and it lets go. */
const DRAG_PX = 200;
const DRAG_VELOCITY = 0.5;

/** A shot that is taller than it is wide. Anything unmeasured is not. */
const isPortrait = (shot?: Shot) => Boolean(shot?.ratio && shot.ratio <= 1);

/**
 * Whether a shot runs the full width of the sheet or takes one of the two
 * columns.
 *
 * Wide shots always run full width — halving a landscape photo is what turns
 * a gallery into a contact sheet. The opening shot also runs full width, so
 * every gallery starts on one image rather than on a pair, unless the shot
 * immediately after it is a portrait: two portraits side by side is a better
 * opening than one portrait alone with a column of air next to it.
 */
const isFullWidth = (images: Shot[], i: number) =>
  !isPortrait(images[i]) || (i === 0 && !isPortrait(images[1]));

/**
 * A project's photographs, as a sheet that slides up over the site.
 *
 * Not an overlay on a dark ground: the sheet is the same paper as the page,
 * pushed up from the bottom edge and stopped just short of the top, and the
 * page it came from is still there behind it — scaled back, corners rounded,
 * desaturated and dimmed against a near-black ground. Nothing is covered up,
 * so the way out is obvious without a single word of chrome: the strip of
 * shrunken page still showing at the top is the dismiss target, along with a
 * white close button, Escape, and — on a touchscreen — dragging the sheet
 * back down.
 *
 * Inside, two columns, with anything wide taking both. The shots keep the
 * shapes they were shot in and the rows end where they end.
 */
export function Lightbox({ gallery, onClose }: { gallery: Gallery; onClose: () => void }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Whatever was focused when the gallery opened, so it can be handed back.
  const returnRef = useRef<HTMLElement | null>(null);
  // Where the page was left. The clip and the pinned nav are both measured
  // from it, and it can't be re-read later: locking the scroll keeps
  // `scrollY` truthful, but nothing else here should have to assume that.
  const topRef = useRef(0);
  const dismissed = useRef(false);
  // The browser chrome's colour before the sheet borrowed it.
  const paperRef = useRef("");

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    setClosing(true);
    window.setTimeout(onClose, SHELL_MS);
  }, [onClose]);

  // Freeze the page and set up the two things the shell's own transition
  // can't know on its own: where the viewport currently sits in the document.
  //
  // The shell is the full height of the document, so scaling it about its own
  // centre would push whatever you were reading off-screen. Both the origin
  // and the clip are measured from the scroll offset instead, which is what
  // makes the page shrink around the part of it you were actually looking at.
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const shell = document.getElementById("shell");
    const top = window.scrollY;
    topRef.current = top;

    // Padding compensates for the scrollbar the lock removes, so the page
    // underneath doesn't shift sideways as the sheet opens.
    const gap = window.innerWidth - html.clientWidth;
    const prev = {
      htmlOverflow: html.style.overflow,
      overflow: body.style.overflow,
      pad: body.style.paddingRight,
      overscroll: body.style.overscrollBehavior,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    if (shell) {
      // Nothing behind the sheet can be clicked, tabbed to or read out.
      shell.inert = true;
      // The nav is fixed, and a transformed shell becomes the thing its
      // fixed children measure from — so it has to be pushed down the
      // document by the scroll offset to stay at the top of the viewport.
      shell.style.setProperty("--pinned-top", `${top}px`);
      shell.style.transformOrigin = `50% ${top}px`;
      // The "from" half of the corner rounding. A transition needs both.
      shell.style.clipPath = `xywh(0 ${top}px 100% 100dvh round 0px)`;
    }

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.overflow;
      body.style.overscrollBehavior = prev.overscroll;
      body.style.paddingRight = prev.pad;
      html.removeAttribute("data-sheet");
      if (shell) {
        shell.inert = false;
        shell.removeAttribute("style");
      }
    };
  }, []);

  // Enter on the frame after mount, so the browser has a "from" state to
  // transition out of rather than painting the sheet already in place.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Push the page back, and pull it forward again on the way out.
  useEffect(() => {
    if (!entered) return;
    const html = document.documentElement;
    const shell = document.getElementById("shell");
    const radius = closing ? "0px" : "24px";

    if (closing) html.removeAttribute("data-sheet");
    else html.setAttribute("data-sheet", "open");

    // On a phone the browser's own chrome sits directly above the strip of
    // ground the sheet leaves showing, so it has to change colour too — a
    // light toolbar over a near-black band is the one thing that would give
    // away that this is a web page and not a sheet.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      if (closing) meta.content = paperRef.current;
      else {
        paperRef.current ||= meta.content;
        meta.content = getComputedStyle(html).getPropertyValue("--ground-dim").trim();
      }
    }

    // Cleared by the drag handler while a finger is down; put back either way.
    if (shell) {
      shell.style.transition = "";
      shell.style.transform = "";
      shell.style.opacity = "";
      shell.style.clipPath = `xywh(0 ${topRef.current}px 100% 100dvh round ${radius})`;
    }
  }, [entered, closing]);

  useEffect(() => {
    returnRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => returnRef.current?.focus?.();
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

  // Drag the sheet back down to dismiss it.
  //
  // Only from the top of its own scroll, so the gesture never fights the
  // gallery: once you're a pixel into the photographs, a downward drag is a
  // scroll and nothing else. The page behind is walked back towards its
  // resting state as the sheet falls, so the two stay attached to each other
  // rather than the sheet sliding over a page frozen mid-shrink.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const shell = document.getElementById("shell");

    let startY = 0;
    let startedAt = 0;
    let offset = 0;
    let tracking = false;

    /** Hands both elements back to their stylesheets. */
    const release = () => {
      panel.style.transition = "";
      panel.style.transform = "";
      if (!shell) return;
      shell.style.transition = "";
      shell.style.transform = "";
      shell.style.opacity = "";
    };

    const onStart = (e: TouchEvent) => {
      if (panel.scrollTop > 0 || closing) return;
      tracking = true;
      offset = 0;
      startY = e.touches[0].clientY;
      startedAt = e.timeStamp;
    };

    const onMove = (e: TouchEvent) => {
      if (!tracking) return;
      offset = e.touches[0].clientY - startY;
      // Dragging up is the scroll the sheet was going to do anyway.
      if (offset <= 0) {
        if (panel.style.transform) release();
        return;
      }
      e.preventDefault();

      panel.style.transition = "none";
      panel.style.transform = `translateY(${offset}px)`;

      if (!shell) return;
      // 0 at the top of the pull, 1 once the sheet is a screen down.
      const t = Math.min(offset / window.innerHeight, 1);
      shell.style.transition = "none";
      shell.style.transform = `translateY(${10 * (1 - t)}px) scale(${0.95 + 0.05 * t})`;
      shell.style.opacity = `${0.4 + 0.6 * t}`;
    };

    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      if (offset <= 0) return;

      const velocity = offset / Math.max(e.timeStamp - startedAt, 1);
      if (offset >= DRAG_PX || velocity >= DRAG_VELOCITY) {
        // Let go from wherever the finger left it: dropping the inline
        // styles first means the exit transition starts at the drag's
        // position rather than snapping back up to run from the top.
        release();
        dismiss();
        return;
      }

      panel.style.transition = `transform 250ms var(--ease-sheet)`;
      panel.style.transform = "translateY(0px)";
      if (shell) {
        shell.style.transition = "";
        shell.style.transform = "";
        shell.style.opacity = "";
      }
      window.setTimeout(release, 250);
    };

    panel.addEventListener("touchstart", onStart, { passive: true });
    panel.addEventListener("touchmove", onMove, { passive: false });
    panel.addEventListener("touchend", onEnd);
    panel.addEventListener("touchcancel", onEnd);
    return () => {
      panel.removeEventListener("touchstart", onStart);
      panel.removeEventListener("touchmove", onMove);
      panel.removeEventListener("touchend", onEnd);
      panel.removeEventListener("touchcancel", onEnd);
    };
  }, [closing, dismiss]);

  const open = entered && !closing;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`${gallery.title} — gallery`}
    >
      {/*
       * The band of page still showing above the sheet. Not a scrim — there
       * is nothing to dim, the page behind dims itself — just the click
       * target that the gap already implies. The close button and Escape are
       * what the keyboard and screen readers get, so this stays out of both.
       */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={dismiss}
        className="absolute inset-0 cursor-default"
      />

      <div ref={panelRef} data-open={open} className="sheet">
        <h2 className="sr-only">{gallery.title}</h2>
        <p className="sr-only">{gallery.blurb}</p>

        {/* Touchscreens get the affordance for the drag they can actually do. */}
        <div className="sheet-handle" aria-hidden="true">
          <span />
        </div>

        <div className="sheet-pin">
          <button ref={closeRef} type="button" onClick={dismiss} aria-label="Close gallery">
            <Close className="size-4" />
          </button>
        </div>

        <div className="sheet-grid">
          {gallery.images.map((shot, i) => (
            <Frame
              key={shot.src}
              src={shot.src}
              alt={`${gallery.title}, image ${i + 1} of ${gallery.images.length}`}
              eager={i === 0}
              className={`image-edge sheet-media ${isFullWidth(gallery.images, i) ? "sheet-media-wide" : ""}`}
              style={shot.ratio ? { aspectRatio: `${shot.ratio}` } : undefined}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
