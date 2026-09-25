type Bus = { ctx: AudioContext; master: GainNode; sfx: GainNode; music: GainNode };

let bus: Bus | null = null;
let muted = false;
let ambientTimer: number | null = null;

function getBus(): Bus | null {
  if (typeof window === "undefined") return null;
  if (bus) return bus;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor({ latencyHint: "interactive" });
  const master = ctx.createGain();
  const sfx = ctx.createGain();
  const music = ctx.createGain();
  master.gain.value = 0.7;
  sfx.gain.value = 0.9;
  music.gain.value = 0.18;
  sfx.connect(master);
  music.connect(master);
  master.connect(ctx.destination);
  bus = { ctx, master, sfx, music };
  return bus;
}

export function unlockAudio() {
  const b = getBus();
  if (!b) return;
  if (b.ctx.state === "suspended") void b.ctx.resume();
}

export function setMuted(value: boolean) {
  muted = value;
  const b = getBus();
  if (!b) return;
  b.master.gain.setTargetAtTime(value ? 0 : 0.7, b.ctx.currentTime, 0.03);
}

export function isMuted() {
  return muted;
}

function envGain(ctx: AudioContext, dest: AudioNode, start: number, peak: number, attack: number, release: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
  g.connect(dest);
  return g;
}

function tone(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  type: OscillatorType,
  when: number,
  dur: number,
  peak = 0.12,
) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  const g = envGain(ctx, dest, when, peak, 0.012, dur);
  osc.connect(g);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

export function playDrop(axisHue = 0) {
  const b = getBus();
  if (!b || muted) return;
  const t = b.ctx.currentTime;
  const base = 220 + (axisHue % 7) * 18;
  tone(b.ctx, b.sfx, base * 2, "sine", t, 0.22, 0.11);
  tone(b.ctx, b.sfx, base * 3, "triangle", t + 0.04, 0.28, 0.08);
  tone(b.ctx, b.sfx, 90, "sine", t, 0.18, 0.09);
}

export function playUndo() {
  const b = getBus();
  if (!b || muted) return;
  const t = b.ctx.currentTime;
  tone(b.ctx, b.sfx, 320, "triangle", t, 0.16, 0.07);
  tone(b.ctx, b.sfx, 210, "sine", t + 0.05, 0.2, 0.05);
}

export function playReveal() {
  const b = getBus();
  if (!b || muted) return;
  const t = b.ctx.currentTime;
  const notes = [261.63, 329.63, 392.0, 523.25];
  notes.forEach((f, i) => tone(b.ctx, b.sfx, f, "sine", t + i * 0.12, 0.4, 0.1));
}

export function playWhoosh() {
  const b = getBus();
  if (!b || muted) return;
  const t = b.ctx.currentTime;
  const osc = b.ctx.createOscillator();
  const g = envGain(b.ctx, b.sfx, t, 0.04, 0.02, 0.25);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(140, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.28);
  osc.connect(g);
  osc.start(t);
  osc.stop(t + 0.32);
}

export function startAmbient() {
  const b = getBus();
  if (!b || muted) return;
  if (ambientTimer != null) return;
  const drone = () => {
    if (!bus || muted) return;
    const t = bus.ctx.currentTime;
    tone(bus.ctx, bus.music, 110, "sine", t, 2.8, 0.04);
    tone(bus.ctx, bus.music, 164.8, "sine", t + 0.4, 2.4, 0.025);
  };
  drone();
  ambientTimer = window.setInterval(drone, 4200);
}

export function stopAmbient() {
  if (ambientTimer != null) {
    window.clearInterval(ambientTimer);
    ambientTimer = null;
  }
}

export function bindVisibilityResume() {
  if (typeof document === "undefined") return () => {};
  const onVis = () => {
    if (document.visibilityState === "visible") unlockAudio();
  };
  document.addEventListener("visibilitychange", onVis);
  return () => document.removeEventListener("visibilitychange", onVis);
}
