/**
 * Web Audio API Sound Synthesizer for Electronic Structure Challenge
 * Pure client-side synthesis ensures 100% offline reliability without external MP3 assets.
 */

let audioCtx: AudioContext | null = null;
let soundMuted = false;
let masterVolume = 0.6;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const soundEffects = {
  setMuted(muted: boolean) {
    soundMuted = muted;
  },

  setVolume(vol: number) {
    masterVolume = Math.max(0, Math.min(1, vol));
  },

  isMuted() {
    return soundMuted;
  },

  /**
   * Cheerful, crisp two-tone educational ping for correct answers
   */
  playPing() {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.35 * masterVolume, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      gainNode.connect(ctx.destination);

      // Note 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.connect(gainNode);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Note 2: B5 (987.77 Hz)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      osc2.connect(gainNode);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch {
      // Audio autoplay policy fallback
    }
  },

  /**
   * Gentle, springy cartoon boing for incorrect attempts
   */
  playBoing() {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      // Pitch drop with spring modulation
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(85, now + 0.35);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.35 * masterVolume, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Autoplay fallback
    }
  },

  /**
   * Crisp tactile tap for clicking element cells
   */
  playClick() {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

      gainNode.gain.setValueAtTime(0.12 * masterVolume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Autoplay fallback
    }
  },

  /**
   * Joyful round completion celebration fanfare
   */
  playFanfare() {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.28 * masterVolume, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.45);
      });
    } catch {
      // Autoplay fallback
    }
  },
};
