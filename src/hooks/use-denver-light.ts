import { useEffect, useState } from "react";

const TIME_ZONE = "America/Denver";

export type Light = {
  /** Local clock in Denver, e.g. "4:12pm". */
  time: string;
  /** Name of the current stretch of day, shown beside the clock. */
  phase: string;
  /** Colour resting over the top of the page. */
  wash: string;
  /** How much of that colour to let through, 0–1. */
  strength: number;
};

/**
 * Denver's day, in five parts. Midday is deliberately almost invisible —
 * the page should look like plain paper at noon and only take on colour
 * as the light gets low.
 */
function lightFor(hour: number): Omit<Light, "time"> {
  if (hour >= 5 && hour < 8) {
    return { phase: "Dawn", wash: "oklch(0.8 0.085 30)", strength: 0.3 };
  }
  if (hour >= 8 && hour < 11) {
    return { phase: "Morning", wash: "oklch(0.88 0.06 85)", strength: 0.22 };
  }
  if (hour >= 11 && hour < 16) {
    return { phase: "Midday", wash: "oklch(0.92 0.03 95)", strength: 0.12 };
  }
  if (hour >= 16 && hour < 20) {
    return { phase: "Dusk", wash: "oklch(0.7 0.125 48)", strength: 0.34 };
  }
  return { phase: "Night", wash: "oklch(0.5 0.085 265)", strength: 0.32 };
}

/**
 * The light in Denver, right now. Returns null until the client has read the
 * clock, so the server and the first paint agree on a neutral page.
 */
export function useDenverLight(): Light | null {
  const [light, setLight] = useState<Light | null>(null);

  useEffect(() => {
    const clock = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: TIME_ZONE,
    });
    const hourOnly = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: TIME_ZONE,
    });

    const read = () => {
      const now = new Date();
      const hour = Number(hourOnly.format(now));
      setLight({
        time: clock.format(now).toLowerCase().replace(/\s/g, ""),
        ...lightFor(hour),
      });
    };

    read();
    const id = window.setInterval(read, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Paint the wash onto the document so it can sit behind everything.
  useEffect(() => {
    if (!light) return;
    const root = document.documentElement;
    root.style.setProperty("--wash", light.wash);
    root.style.setProperty("--wash-strength", String(light.strength));
  }, [light]);

  return light;
}
