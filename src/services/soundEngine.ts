// Web Audio API Synthesizer — sound OFF by default, user opts in via Navigation.
class PostProductionSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  constructor() {
    try { this.isMuted = localStorage.getItem('bg-sound-muted') === '0' ? false : true; } catch { this.isMuted = true; }
    if (typeof window !== 'undefined') {
      const unlock = () => { this.unlockAudio(); };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
    }
  }
  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
    if (this.ctx?.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }
  public async unlockAudio(): Promise<void> { const c = this.getContext(); if (c?.state === 'suspended') { try { await c.resume(); } catch {} } }
  public setMuted(m: boolean) { this.isMuted = m; try { localStorage.setItem('bg-sound-muted', m ? '1' : '0'); } catch {} if (!m) this.unlockAudio(); }
  public getMuted() { return this.isMuted; }
  private beep(freqA: number, freqB: number, dur: number, gain: number, type: OscillatorType = 'triangle') {
    if (this.isMuted) return; const ctx = this.getContext(); if (!ctx) return;
    try { const now = ctx.currentTime; const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(freqA, now); o.frequency.exponentialRampToValueAtTime(Math.max(20, freqB), now + dur); g.gain.setValueAtTime(gain, now); g.gain.exponentialRampToValueAtTime(0.001, now + dur); o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + dur); } catch {}
  }
  public playCutSound() { this.beep(480, 70, 0.06, 0.2); }
  public playImpactSound() { this.beep(180, 25, 0.5, 0.35, 'sine'); }
  public playScrubSound() { this.beep(700, 180, 0.02, 0.015, 'square'); }
  public playExportBeep() { if (this.isMuted) return; [523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => this.beep(f, f, 0.18, 0.12, 'sine'), i * 80)); }
  public playHoverSound() { this.beep(1200, 600, 0.015, 0.02, 'sine'); }
  private riserBuffer: AudioBuffer | null = null;
  public async playHeroRiserSound() {
    if (this.isMuted) return; const ctx = this.getContext(); if (!ctx) return;
    try {
      if (!this.riserBuffer) { const res = await fetch('/audio/riser%202.mp3'); const buf = await res.arrayBuffer(); this.riserBuffer = await ctx.decodeAudioData(buf); }
      const src = ctx.createBufferSource(); const g = ctx.createGain(); g.gain.value = 0.4; src.buffer = this.riserBuffer; src.connect(g); g.connect(ctx.destination); src.start(0);
    } catch {}
  }
}
export const soundEngine = new PostProductionSoundEngine();
