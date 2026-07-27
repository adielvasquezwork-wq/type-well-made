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
    filter.frequency.value = 480;
    filter.Q.value = 0.3;
    filter.connect(master);

    // Two detuned low sines: a warm, muted phone-like tone. A small random
    // offset each time it's switched on keeps repeat listens from sounding
    // like a loop.
    const drift = Math.random() * 4 - 2;
    const oscs = [60, 85].map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = i * 3 - 1.5 + drift;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.08 : 0.05;
      osc.connect(g).connect(filter);
      osc.start();
      return { osc, g };
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.045 + Math.random() * 0.015;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 60;
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

  // Considered interaction sound: a short, filtered tick on link hover.
  // Pitch and gain drift slightly each time so a row of six doesn't sound
  // like a metronome, and a minimum gap keeps a fast sweep from turning
  // into a clatter.
  useEffect(() => {
    if (!on) return;
    const notes = [660, 740, 780, 830];
    let lastTick = 0;
    const tick = () => {
      const { ctx, master } = ensureCtx();
      const t = ctx.currentTime;
      if (t - lastTick < 0.08) return;
      lastTick = t;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();

      osc.type = "sine";
      const note = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.value = note + (Math.random() * 6 - 3);

      filter.type = "lowpass";
      filter.frequency.value = 2200;
      filter.Q.value = 0.4;

      const peak = 0.028 + Math.random() * 0.012;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.018);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(filter).connect(g).connect(master.context.destination);
      osc.start(t);
      osc.stop(t + 0.18);
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
      className="group inline-flex items-center gap-2 text-muted-foreground transition-colors duration-150 ease-strong hover:text-foreground"
    >
      <span
        aria-hidden
        className={`inline-block size-[6px] rounded-full transition-all duration-300 ease-strong ${
          on ? "scale-100 bg-foreground" : "scale-90 bg-border group-hover:bg-muted-foreground"
        }`}
      />
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
