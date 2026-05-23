// lib/audio.ts
// Minimal Web Audio chime utility — generates tones at call time, ships no
// audio assets. AudioContext is created lazily and must be unlocked by a
// user gesture (call unlockAudio() inside an onClick handler).

type Ctx = AudioContext & { state: AudioContextState };

let ctx: Ctx | null = null;
let muted = false;

function getCtx(): Ctx | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctor =
    (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor() as Ctx;
    return ctx;
  } catch {
    return null;
  }
}

export async function unlockAudio() {
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') {
    try {
      await c.resume();
    } catch {
      // ignore
    }
  }
}

export function setMuted(value: boolean) {
  muted = value;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('eyeCareMuted', value ? '1' : '0');
  } catch {
    // ignore
  }
}

export function loadMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem('eyeCareMuted') === '1';
  } catch {
    return false;
  }
}

function tone(freq: number, duration = 0.5, gain = 0.12, type: OscillatorType = 'sine') {
  const c = getCtx();
  if (!c || muted || c.state === 'suspended') return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration + 0.05);
}

// Two-note soft bell on break start.
export function chimeBreakStart() {
  tone(528, 0.7, 0.14);
  window.setTimeout(() => tone(660, 0.7, 0.12), 180);
}

// Single low ping at last-5-seconds warning.
export function chimeWarning() {
  tone(420, 0.22, 0.07);
}

// Light high tick at break end (return to work).
export function chimeBreakEnd() {
  tone(740, 0.3, 0.09);
}
