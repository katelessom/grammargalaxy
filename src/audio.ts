"use client";

export type SoundKind = "navigate" | "select" | "launch" | "repair" | "fragment" | "transmit" | "purchase" | "place" | "remove" | "hint" | "reward" | "achievement";

type WebkitWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

let sharedContext: AudioContext | null = null;
const namedJingles = new Set<HTMLAudioElement>();

function context() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedContext || sharedContext.state === "closed") sharedContext = new AudioContextClass();
  if (sharedContext.state === "suspended") void sharedContext.resume();
  return sharedContext;
}

function note(ctx: AudioContext, output: AudioNode, frequency: number, start: number, duration: number, volume: number, type: OscillatorType = "sine", endFrequency = frequency) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(24, endFrequency), start + duration);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), start + .012);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(gain); gain.connect(output);
  oscillator.start(start); oscillator.stop(start + duration + .02);
}

function noise(ctx: AudioContext, output: AudioNode, start: number, duration: number, volume: number, highpass = 700) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource(); const filter = ctx.createBiquadFilter(); const gain = ctx.createGain();
  source.buffer = buffer; filter.type = "highpass"; filter.frequency.value = highpass;
  gain.gain.setValueAtTime(volume, start); gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  source.connect(filter); filter.connect(gain); gain.connect(output); source.start(start); source.stop(start + duration);
}

export function playSound(kind: SoundKind, volume: number) {
  if (volume <= 0) return;
  const ctx = context(); if (!ctx) return;
  const master = ctx.createGain(); master.gain.value = Math.min(.22, (volume / 100) * .18); master.connect(ctx.destination);
  const now = ctx.currentTime + .005;
  const patterns: Record<SoundKind, () => void> = {
    navigate: () => { note(ctx, master, 330, now, .11, .32, "sine", 480); },
    select: () => { note(ctx, master, 520, now, .08, .3, "triangle", 680); },
    launch: () => { note(ctx, master, 95, now, .42, .52, "sawtooth", 690); noise(ctx, master, now, .34, .09, 500); },
    repair: () => { note(ctx, master, 170, now, .12, .4, "square", 150); note(ctx, master, 410, now + .09, .18, .3, "triangle", 630); },
    fragment: () => { note(ctx, master, 620, now, .12, .31, "sine", 940); note(ctx, master, 310, now, .1, .18, "triangle", 420); },
    transmit: () => { [0, .07, .14, .21].forEach((delay, index) => note(ctx, master, 260 + index * 130, now + delay, .14, .27, "square", 420 + index * 150)); },
    purchase: () => { [0, .08, .16, .27].forEach((delay, index) => note(ctx, master, [392, 523, 659, 784][index], now + delay, .24, .34, "sine")); },
    place: () => { noise(ctx, master, now, .36, .16, 1200); note(ctx, master, 440, now, .42, .35, "sine", 880); note(ctx, master, 880, now + .18, .38, .22, "sine", 1320); },
    remove: () => { note(ctx, master, 560, now, .18, .3, "triangle", 220); },
    hint: () => { note(ctx, master, 740, now, .3, .25, "sine", 1120); note(ctx, master, 1100, now + .11, .28, .18, "sine", 1480); },
    reward: () => { [0, .12, .24, .38].forEach((delay, index) => note(ctx, master, [392, 494, 587, 784][index], now + delay, .42, .36, "sine")); noise(ctx, master, now + .16, .55, .08, 1800); },
    achievement: () => { [0, .1, .2, .3, .44].forEach((delay, index) => note(ctx, master, [523, 659, 784, 988, 1318][index], now + delay, .5, .35, "triangle")); },
  };
  patterns[kind]();
  window.setTimeout(() => master.disconnect(), 1600);
}

export function playNamedJingle(path: string, volume: number) {
  if (typeof window === "undefined" || volume <= 0) return;
  stopNamedJingles();
  const audio = new Audio(path); audio.volume = Math.min(1, volume / 100); audio.preload = "auto";
  namedJingles.add(audio);
  audio.addEventListener("ended", () => namedJingles.delete(audio), { once: true });
  audio.addEventListener("error", () => namedJingles.delete(audio), { once: true });
  void audio.play().catch(() => undefined);
}

export function stopNamedJingles() {
  namedJingles.forEach((audio) => {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  });
  namedJingles.clear();
}
