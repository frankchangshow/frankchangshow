import type { SfxEvent } from "./types";

export function createAudio() {
  let ctx: AudioContext | null = null;

  const context = () => {
    if (typeof window === "undefined") return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  };

  const tone = (freq: number, dur: number, type: OscillatorType, gain: number, slide = 0) => {
    const ac = context();
    if (!ac) return;
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (slide !== 0) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(48, freq + slide), ac.currentTime + dur);
    }
    amp.gain.setValueAtTime(gain, ac.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.connect(amp);
    amp.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + dur + 0.02);
  };

  const noise = (dur: number, gain: number, freq: number) => {
    const ac = context();
    if (!ac) return;
    const count = Math.max(1, Math.floor(ac.sampleRate * dur));
    const buffer = ac.createBuffer(1, count, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < count; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / count);
    const source = ac.createBufferSource();
    source.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    const amp = ac.createGain();
    amp.gain.value = gain;
    source.connect(filter);
    filter.connect(amp);
    amp.connect(ac.destination);
    source.start();
  };

  return {
    unlock() {
      context();
    },
    play(name: SfxEvent, muted: boolean) {
      if (muted) return;
      if (name === "chop") noise(0.07, 0.12, 420);
      else if (name === "place") tone(520, 0.07, "triangle", 0.05, 180);
      else if (name === "remove") tone(280, 0.08, "sine", 0.04, -80);
      else if (name === "shoot") tone(660, 0.06, "square", 0.03, 220);
      else if (name === "hit") noise(0.05, 0.08, 240);
      else if (name === "hurt") tone(140, 0.14, "sawtooth", 0.04, -60);
      else if (name === "break") noise(0.12, 0.1, 180);
      else if (name === "repair") tone(440, 0.08, "triangle", 0.04, 120);
      else if (name === "wave") {
        tone(180, 0.28, "sawtooth", 0.04, -40);
        tone(120, 0.4, "sine", 0.05, -20);
      } else if (name === "dawn") {
        tone(392, 0.12, "triangle", 0.05);
        tone(523, 0.16, "triangle", 0.05);
      } else if (name === "over") tone(110, 0.45, "triangle", 0.06, -50);
      else if (name === "click") tone(620, 0.05, "sine", 0.04);
    },
  };
}
