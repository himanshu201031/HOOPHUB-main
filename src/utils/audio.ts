/**
 * Procedural Audio Manager
 * Synthesizes high-fidelity micro-interaction sounds completely client-side in the browser.
 * Bypasses network latency and asset loading failures.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // @ts-ignore
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Ignored: dynamic resumption requires human gesture
    });
  }
  return audioCtx;
}

// Throttle swoosh triggers to avoid overwhelming concurrent audios
let lastSwooshTime = 0;
const SWOOSH_COOLDOWN = 600; // ms

/**
 * Synthesizes a premium, soft metallic click sound.
 * Excellent for subtle UI elements like card hovering and button states.
 */
export function playMetallicClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Ultra-subtle master gain to ensure it feels refined and in the background
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.045, now);
  masterGain.connect(ctx.destination);

  // 1. High-frequency non-harmonic metallic series (creates that luxury chime/ping feel)
  const freqs = [1020, 1650, 2480];
  
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = idx === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Staggered dampening envelopes
    gainNode.gain.setValueAtTime(0.8 - idx * 0.2, now);
    const decay = 0.035 + (2 - idx) * 0.015;
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + decay);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + decay + 0.01);
  });

  // 2. Tactile, warm low-frequency "wood/basket" tap
  const floorOsc = ctx.createOscillator();
  const floorGain = ctx.createGain();

  floorOsc.type = 'sine';
  floorOsc.frequency.setValueAtTime(140, now);
  floorOsc.frequency.exponentialRampToValueAtTime(70, now + 0.018);

  floorGain.gain.setValueAtTime(0.85, now);
  floorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

  floorOsc.connect(floorGain);
  floorGain.connect(masterGain);

  floorOsc.start(now);
  floorOsc.stop(now + 0.03);
}

/**
 * Synthesizes a highly realistic basketball 'swoosh' or 'whoosh' sound
 * using bandpass-filtered noise with dynamic resonance and pitch sweeps.
 */
export function playSwoosh() {
  const nowTime = Date.now();
  if (nowTime - lastSwooshTime < SWOOSH_COOLDOWN) return;
  lastSwooshTime = nowTime;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.42; // seconds

  // Population of a short white-noise buffer
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;

  // Setup bandpass filter for dynamic motion timbre simulation
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  
  // Modulate resonance curve (Q increases at speed peak)
  filter.Q.setValueAtTime(3.8, now);
  filter.Q.exponentialRampToValueAtTime(7.2, now + duration * 0.35);
  filter.Q.exponentialRampToValueAtTime(3.8, now + duration);

  // Modulate filter frequency sweep (creates the 'sw-ooh-sh' pitch curve)
  filter.frequency.setValueAtTime(190, now);
  filter.frequency.exponentialRampToValueAtTime(920, now + duration * 0.32);
  filter.frequency.exponentialRampToValueAtTime(140, now + duration);

  // Soft progression gain envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.linearRampToValueAtTime(0.22, now + duration * 0.32);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.02);

  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noiseSource.start(now);
  noiseSource.stop(now + duration);
}

/**
 * Synthesizes a luxury, high-fidelity basketball 'swish' sound.
 * Combines the soft friction of composite leather passing through string mesh (low-mid bandpass noise)
 * with the mechanical whip/snap of the net strings snapping back (higher frequency transient sweeps).
 */
export function playSwish() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const durMain = 0.38; // seconds
  const sampleRate = ctx.sampleRate;

  // 1. Friction sweep (Whoosh of physical ball pushing through the net)
  const bufSize1 = sampleRate * durMain;
  const buf1 = ctx.createBuffer(1, bufSize1, sampleRate);
  const d1 = buf1.getChannelData(0);
  for (let i = 0; i < bufSize1; i++) {
    d1[i] = Math.random() * 2 - 1;
  }

  const src1 = ctx.createBufferSource();
  src1.buffer = buf1;

  const filter1 = ctx.createBiquadFilter();
  filter1.type = 'bandpass';
  filter1.Q.setValueAtTime(4.5, now);
  // Whoosh frequency drops as momentum slows down in the net
  filter1.frequency.setValueAtTime(650, now);
  filter1.frequency.exponentialRampToValueAtTime(180, now + durMain * 0.8);

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.linearRampToValueAtTime(0.35, now + durMain * 0.22);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + durMain);

  src1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(ctx.destination);

  // 2. Net whip / string snap (The crisp, high-frequency 'swish-fizz' tension snap of nylon)
  const durSnap = 0.24;
  const bufSize2 = sampleRate * durSnap;
  const buf2 = ctx.createBuffer(1, bufSize2, sampleRate);
  const d2 = buf2.getChannelData(0);
  // Filtered granular noise for string friction
  for (let i = 0; i < bufSize2; i++) {
    const r = Math.random() * 2 - 1;
    // Layer some basic modulation to mimic separate string strands
    d2[i] = r * (0.6 + 0.4 * Math.sin(i * 0.015));
  }

  const src2 = ctx.createBufferSource();
  src2.buffer = buf2;

  const filter2 = ctx.createBiquadFilter();
  filter2.type = 'bandpass';
  filter2.Q.setValueAtTime(8.0, now + 0.05); // high response
  // Whip sweeps up in frequency as strings tighten, then drops
  filter2.frequency.setValueAtTime(950, now + 0.05);
  filter2.frequency.exponentialRampToValueAtTime(2200, now + 0.05 + durSnap * 0.4);
  filter2.frequency.exponentialRampToValueAtTime(1100, now + 0.05 + durSnap);

  const gain2 = ctx.createGain();
  // delay the whip slightly to line up with the ball exiting the bottom of the net
  const snapDelay = 0.06;
  gain2.gain.setValueAtTime(0.001, now);
  gain2.gain.setValueAtTime(0.001, now + snapDelay);
  gain2.gain.linearRampToValueAtTime(0.40, now + snapDelay + 0.05);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + snapDelay + durSnap);

  src2.connect(filter2);
  filter2.connect(gain2);
  gain2.connect(ctx.destination);

  src1.start(now);
  src1.stop(now + durMain);

  src2.start(now + snapDelay);
  src2.stop(now + snapDelay + durSnap);
}

