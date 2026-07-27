import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Opt-in ambient sound. Off by default, no autoplay.
 * Everything is synthesised with WebAudio — no audio assets, no playful tones.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    return { ctx: ctxRef.current!, master: masterRef.current! };
  }, []);

  const startAmbient = useCallback(() => {
    const { ctx, master } = ensureCtx();
    void ctx.resume();

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.4;
    filter.connect(master);

    // Two detuned low sines + a slow tremolo: a soft room tone, not a melody.
    const oscs = [55, 82.41, 110].map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = i * 4 - 4;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.06 : 0.14;
      osc.connect(g).connect(filter);
      osc.start();
      return { osc, g };
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.6);

    stopRef.current = () => {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.9);
      window.setTimeout(() => {
        lfo.stop();
        oscs.forEach(({ osc }) => osc.stop());
        filter.disconnect();
      }, 1100);
    };
  }, [ensureCtx]);

  const toggle = () => {
    if (on) {
      stopRef.current?.();
      stopRef.current = null;
      setOn(false);
    } else {
      startAmbient();
      setOn(true);
    }
  };

  // Considered interaction sound: a single short, filtered tick on link hover.
  useEffect(() => {
    if (!on) return;
    const tick = () => {
      const { ctx, master } = ensureCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 1180;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
      osc.connect(g).connect(master.context.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    };
    const handler = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("a, [data-sound-row]")) tick();
    };
    document.addEventListener("pointerover", handler);
    return () => document.removeEventListener("pointerover", handler);
  }, [on, ensureCtx]);

  useEffect(() => () => stopRef.current?.(), []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-500 ease-quiet hover:text-foreground"
    >
      <span
        aria-hidden
        className={`inline-block size-[6px] rounded-full transition-all duration-700 ease-quiet ${
          on ? "bg-accent scale-100" : "bg-border scale-90 group-hover:bg-muted-foreground"
        }`}
      />
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
