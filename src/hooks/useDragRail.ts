import { useCallback, useEffect, useRef } from "react";
import type { DragEvent, PointerEvent } from "react";

/** Beyond this many pixels of pointer travel, a press is a drag, not a click. */
const DRAG_THRESHOLD = 6;

/**
 * How far ahead, in ms, a release velocity is projected before the result
 * gets rounded to the nearest frame. This is the same role as the
 * "time constant" in most momentum-scroll implementations — roughly, how
 * long a flick keeps carrying after the pointer lifts.
 */
const PROJECTION_MS = 260;

/** A cheap analytic stand-in for `--ease-strong`: fast rise, gentle tail. */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

type Sample = { t: number; x: number };

// The step between frames, measured off the rail's own first child rather
// than assumed, so it stays correct whatever width the caller's CSS gives
// its children at the current viewport. A module-level function rather than
// one defined inside the hook: it closes over nothing but its own argument,
// so keeping it outside means the callbacks below that use it never need it
// in a dependency array.
function frameStep<T extends HTMLElement>(el: T) {
  const first = el.firstElementChild as HTMLElement | null;
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
  return (first?.offsetWidth ?? el.clientWidth) + gap;
}

/**
 * Turns any horizontally scrollable element into a mouse-draggable rail with
 * momentum, while leaving touch and trackpad scrolling — which already have
 * their own native momentum — completely untouched.
 *
 * Two things only surface once this is actually driven by a pointer, not
 * read about:
 *
 * - `setPointerCapture` has to wait until the gesture crosses
 *   `DRAG_THRESHOLD`. Call it on every pointerdown and Chromium retargets
 *   the following `click` to the capturing element instead of whatever was
 *   actually pressed, so a plain, undragged click silently stops working.
 * - CSS `scroll-snap-type: mandatory`, if the caller's element has it,
 *   fights every `scrollLeft` write a drag makes — it re-centres on the
 *   nearest snap point the instant the value changes, so the element never
 *   visibly moves. `data-dragging="true"` is set on the element for the
 *   entire gesture, including the settle animation below, so the caller's
 *   CSS can suspend snapping for exactly that long and get back an element
 *   that's already sitting on a valid snap point — nothing left to correct.
 *
 * Release carries velocity forward rather than stopping dead: the last
 * ~80ms of scroll position is used to project where the drag would have
 * landed had it kept going, and that projection — not the raw release
 * point — is what gets rounded to the nearest frame. A fast short flick can
 * still advance a full frame, the way native touch scrolling already does
 * on the same element.
 */
export function useDragRail<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });
  const samples = useRef<Sample[]>([]);
  const settleFrame = useRef<number | null>(null);

  const cancelSettle = () => {
    if (settleFrame.current === null) return;
    cancelAnimationFrame(settleFrame.current);
    settleFrame.current = null;
  };

  const settleTo = useCallback((el: T, target: number) => {
    const from = el.scrollLeft;
    const max = el.scrollWidth - el.clientWidth;
    const to = Math.max(0, Math.min(max, target));
    const step = frameStep(el) || 1;
    // Scales gently with distance so a multi-frame fling doesn't feel
    // clipped and a one-pixel correction doesn't feel sluggish.
    const duration = Math.min(560, 240 + (Math.abs(to - from) / step) * 90);
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      el.scrollLeft = from + (to - from) * easeOutExpo(t);
      if (t < 1) {
        settleFrame.current = requestAnimationFrame(tick);
      } else {
        settleFrame.current = null;
        delete el.dataset.dragging;
      }
    };
    settleFrame.current = requestAnimationFrame(tick);
  }, []);

  const onPointerDown = useCallback((e: PointerEvent<T>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    // A fresh gesture always starts from rest: cancel whatever the last one
    // left running, and drop the flag it was suspending snap with — if this
    // gesture turns out to be a drag too, the flag comes right back the
    // moment it crosses the threshold below.
    cancelSettle();
    delete el.dataset.dragging;
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
    samples.current = [{ t: performance.now(), x: el.scrollLeft }];
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const delta = e.clientX - drag.current.startX;

    if (!drag.current.moved) {
      if (Math.abs(delta) <= DRAG_THRESHOLD) return;
      drag.current.moved = true;
      el.dataset.dragging = "true";
      el.setPointerCapture(e.pointerId);
    }

    el.scrollLeft = drag.current.startScroll - delta;

    const now = performance.now();
    samples.current.push({ t: now, x: el.scrollLeft });
    // An 80ms window is enough to catch the release velocity without
    // carrying stale motion from earlier in a long, slow drag.
    while (samples.current.length > 2 && now - samples.current[0].t > 80) {
      samples.current.shift();
    }
  }, []);

  const endDrag = useCallback(
    (e: PointerEvent<T>) => {
      const el = ref.current;
      if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      drag.current.active = false;
      if (!el || !drag.current.moved) return;

      const rest = samples.current;
      const first = rest[0];
      const last = rest[rest.length - 1];
      const dt = last.t - first.t;
      const velocity = dt > 4 ? (last.x - first.x) / dt : 0;

      const projected = el.scrollLeft + velocity * PROJECTION_MS;
      const step = frameStep(el) || 1;
      settleTo(el, Math.round(projected / step) * step);
    },
    [settleTo],
  );

  useEffect(() => cancelSettle, []);

  const wasDragged = useCallback(() => drag.current.moved, []);

  return {
    ref,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDragStart: (e: DragEvent) => e.preventDefault(),
    },
    wasDragged,
  };
}
