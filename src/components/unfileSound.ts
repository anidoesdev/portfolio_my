/* A classic click: the dry, short sound of a mechanical button, in two
   layers and about 45ms end to end.

     A. the contact  — 7ms of high-passed noise, the click itself
     B. the body     — a short mid thock, the case around the switch

   Deliberately dry. There is no tail, no sweep and no settle: those
   belong to paper and to drawers, and this is a machine. Two earlier
   versions lived here — a paper-and-latch sound for the filing-cabinet
   layout, and a longer buckling-spring keyswitch — and both were
   reverted in favour of this.

   Gains are low. This fires on a portfolio, in an office, next to other
   people. Every call is wrapped: audio is a nicety and must never take
   the interaction down with it. */

type MaybeWebkit = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;

/* ------------------------------------------------------------------
   Whether sound is on, as an external store rather than component
   state. The preference lives in localStorage, which does not exist on
   the server: `useSyncExternalStore` is the supported way to read that
   — it renders the server snapshot during hydration and swaps to the
   real value afterwards, with no cascading setState in an effect.
   ------------------------------------------------------------------ */

const SOUND_KEY = "projects-sound";

let listeners: Array<() => void> = [];
let cached: boolean | null = null;

export function subscribeSound(cb: () => void): () => void {
  listeners = [...listeners, cb];
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function getSound(): boolean {
  if (cached === null) {
    try {
      cached = window.localStorage.getItem(SOUND_KEY) !== "off";
    } catch {
      /* private mode, blocked storage — default to on */
      cached = true;
    }
  }
  return cached;
}

/* On by default, and the same value on both sides of hydration. */
export function getSoundOnServer(): boolean {
  return true;
}

export function setSound(on: boolean): void {
  cached = on;
  try {
    window.localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    /* not worth failing the toggle over */
  }
  for (const l of listeners) l();
}

export function playUnfile(): void {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as MaybeWebkit).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
    }
    /* Browsers hold the context suspended until a gesture. The click
       that opens a window is that gesture, so this resolves in time. */
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    const out = ctx.destination;

    /* A. Contact — 7ms of steeply decaying noise, high-passed so it
          reads as a click rather than a thump */
    const len = Math.floor(ctx.sampleRate * 0.007);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.16));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(2400, now);
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.3, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
    src.connect(hp).connect(clickGain).connect(out);
    src.start(now);

    /* B. Body — a short triangle dropping through the mids. This is what
          stops the click sounding thin and digital. */
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = "triangle";
    body.frequency.setValueAtTime(320, now);
    body.frequency.exponentialRampToValueAtTime(110, now + 0.035);
    bodyGain.gain.setValueAtTime(0.15, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    body.connect(bodyGain).connect(out);
    body.start(now);
    body.stop(now + 0.045);
  } catch {
    /* No Web Audio, no output device, autoplay policy — all fine. */
  }
}
