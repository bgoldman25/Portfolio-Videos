// Web Audio API Synthesizer for Post-Production Audio Cues
class PostProductionSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false; // Default Sound ON

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('click', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
      window.addEventListener('touchstart', unlock, { once: true });
      window.addEventListener('click', unlock, { once: true });
    }
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public async unlockAudio(): Promise<void> {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Fallback
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.unlockAudio();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Sharp tape cut / mechanical edit snap
  public playCutSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.06);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio playback fallback
    }
  }

  // Enhanced Cinematic Trailer Sub-Bass Impact
  public playImpactSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Layer 1: Sub-bass drop
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(180, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.8);
      subGain.gain.setValueAtTime(0.7, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.8);

      // Layer 2: Punchy mechanical transient snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'sawtooth';
      snapOsc.frequency.setValueAtTime(600, now);
      snapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      snapGain.gain.setValueAtTime(0.4, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  // Cinematic Hero Riser — plays /audio/riser 2.mp3
  private riserBuffer: AudioBuffer | null = null;
  private riserLoading: Promise<AudioBuffer | null> | null = null;

  private async loadRiserBuffer(): Promise<AudioBuffer | null> {
    if (this.riserBuffer) return this.riserBuffer;
    if (this.riserLoading) return this.riserLoading;

    const ctx = this.getContext();
    if (!ctx) return null;

    this.riserLoading = fetch('/audio/riser 2.mp3')
      .then(res => res.arrayBuffer())
      .then(buf => ctx.decodeAudioData(buf))
      .then(decoded => {
        this.riserBuffer = decoded;
        return decoded;
      })
      .catch(() => {
        this.riserLoading = null;
        return null;
      });

    return this.riserLoading;
  }

  public async playHeroRiserSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const buffer = await this.loadRiserBuffer();
      if (!buffer) return;

      const source = ctx.createBufferSource();
      const gain = ctx.createGain();

      source.buffer = buffer;
      gain.gain.setValueAtTime(0.5, ctx.currentTime);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
    } catch {
      // Audio playback fallback
    }
  }

  // Scrubbing tape tick sound (Lessen volume by 70% -> 0.024 gain)
  public playScrubSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(700 + Math.random() * 300, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.018);

      // Reduced by 70% from 0.08 down to 0.024
      gain.gain.setValueAtTime(0.024, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.018);
    } catch {
      // Audio fallback
    }
  }

  // Export finished render chime
  public playExportBeep() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  // Subtle hover tick
  public playHoverSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.015);
    } catch {
      // Audio fallback
    }
  }
}

export const soundEngine = new PostProductionSoundEngine();
