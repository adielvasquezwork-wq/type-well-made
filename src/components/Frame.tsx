import { useEffect, useRef, useState } from "react";

/**
 * An image that fails invisibly.
 *
 * A broken `<img>` paints its alt text, or a broken-image glyph, inside
 * whatever frame it was given — on a portfolio that is worse than showing
 * nothing, because it advertises the failure. This removes itself instead and
 * leaves the frame's own background behind, which is already a designed empty
 * state.
 *
 * React's `onError` prop alone is not enough here, and the eager first frame
 * of a rail is exactly where it breaks: the page is server-rendered, so the
 * browser starts that request while parsing the HTML and can finish failing
 * it before React has hydrated and attached a handler. The error event is
 * gone by then. So the check is a settled-state one — a failed image reports
 * `complete` with a `naturalWidth` of zero — run once on mount to catch what
 * was missed, and again on every later load or error.
 */
export function Frame({
  src,
  alt,
  eager = false,
  className = "",
}: {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      if (el.complete && el.naturalWidth === 0) setBroken(true);
    };

    check();
    el.addEventListener("error", check);
    el.addEventListener("load", check);
    return () => {
      el.removeEventListener("error", check);
      el.removeEventListener("load", check);
    };
  }, []);

  if (broken) return null;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
