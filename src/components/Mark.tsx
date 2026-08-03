/**
 * The personal mark that opens the page.
 *
 * A monogram rather than a photograph: the site is about the work, and a
 * 40px portrait would be a thumbnail of a face nobody can read anyway. The
 * warm off-centre light in the gradient gives the disc a direction, so it
 * reads as an object catching light rather than as a flat coloured circle.
 */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`image-edge relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full shadow-card ${className}`}
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 125% at 28% 20%, oklch(0.5 0.115 48), oklch(0.185 0.02 55) 66%)",
        }}
      />
      {/*
       * Nudged down a hair. A capital A has no descender, so a line box
       * centred by geometry leaves it sitting visibly high in the disc.
       */}
      <span className="relative translate-y-px font-serif text-[1.2rem] leading-none text-background">
        A
      </span>
    </span>
  );
}
