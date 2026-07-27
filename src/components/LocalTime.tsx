import { useEffect, useState } from "react";

/** Live local time — the page's small sign of life. */
export function LocalTime({ timeZone = "America/Denver" }: { timeZone?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });
    const update = () => setTime(fmt.format(new Date()).toLowerCase().replace(/\s/g, ""));
    update();
    const id = window.setInterval(update, 10_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span
      className={`font-mono text-[0.82em] tabular-nums transition-opacity duration-700 ease-quiet ${
        time ? "opacity-100" : "opacity-0"
      }`}
    >
      {time ?? "—:—"}
    </span>
  );
}
