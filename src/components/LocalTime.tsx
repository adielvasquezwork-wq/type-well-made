import { useEffect, useState } from "react";

/** Live local time in Adiel's timezone — the page's small sign of life. */
export function LocalTime({ timeZone = "America/Santo_Domingo" }: { timeZone?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 10_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span
      className={`underline decoration-border underline-offset-[3px] transition-opacity duration-700 ease-quiet ${
        time ? "opacity-100" : "opacity-0"
      }`}
    >
      {time ?? "—:—"}
    </span>
  );
}
