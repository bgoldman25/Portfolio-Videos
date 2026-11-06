import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sliders, Sparkles, Play, Pause } from 'lucide-react';

export const RawVsEdited: React.FC = () => {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef<HTMLVideoElement>(null);
  const finalRef = useRef<HTMLVideoElement>(null);

  const sync = useCallback(() => {
    const r = rawRef.current, f = finalRef.current;
    if (r && f && !r.paused && !f.paused && Math.abs(r.currentTime - f.currentTime) > 0.12) f.currentTime = r.currentTime;
  }, []);

  useEffect(() => { if (!playing) return; const id = window.setInterval(sync, 60); return () => clearInterval(id); }, [playing, sync]);

  const toggle = () => {
    const r = rawRef.current, f = finalRef.current;
    if (!r || !f) return;
    if (playing) { r.pause(); f.pause(); setPlaying(false); }
    else { r.play().catch(() => {}); f.play().catch(() => {}); setPlaying(true); }
  };

  const move = useCallback((clientX: number) => {
    const el = containerRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(98, Math.max(2, pct)));
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => { if (dragging) move(e.clientX); };
    const mu = () => setDragging(false);
    if (dragging) { window.addEventListener('mousemove', mm); window.addEventListener('mouseup', mu); }
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
  }, [dragging, move]);

  const finalSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const rawSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'; // same clip, grade difference via CSS — swap with your Before/After pair

  return (
    <section className="relative py-20 md:py-28 px-4 md:px-6 bg-charcoal border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs rounded-full mb-3"><Sliders className="w-3.5 h-3.5" /> INTERACTIVE BEFORE / AFTER</div>
          <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight">Raw vs <span className="text-acid">final edit</span></h2>
          <p className="text-muted text-sm font-mono mt-3">DRAG THE PLAYHEAD · TAP PLAY TO SYNC BOTH CLIPS</p>
        </div>
        <div ref={containerRef} onMouseDown={(e) => { setDragging(true); move(e.clientX); }} onTouchMove={(e) => move(e.touches[0].clientX)} className="relative aspect-video w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/15 bg-black cursor-ew-resize select-none shadow-2xl" role="slider" aria-label="Before and after comparison" aria-valuenow={Math.round(pos)} aria-valuemin={0} aria-valuemax={100} tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowLeft') setPos((p) => Math.max(2, p - 4)); if (e.key === 'ArrowRight') setPos((p) => Math.min(98, p + 4)); }}>
          <video ref={finalRef} src={finalSrc} loop muted playsInline preload="metadata" onError={() => setVideoError(true)} className="absolute inset-0 w-full h-full object-cover contrast-125 saturate-125" />
          <div className="absolute top-4 right-4 bg-acid text-black font-mono text-xs font-black px-3 py-1 rounded">FINAL — GRADED</div>
          <div className="absolute bottom-14 right-4 bg-black/85 border border-acid/50 text-acid px-3 py-1.5 font-mono text-xs rounded hidden sm:flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> REC.709 · KINETIC TYPE</div>
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <video ref={rawRef} src={rawSrc} loop muted playsInline preload="metadata" onError={() => setVideoError(true)} className="absolute inset-0 w-full h-full object-cover brightness-90 saturate-50" />
            <div className="absolute inset-0 bg-emerald-950/25" />
            <div className="absolute top-4 left-4 bg-black/85 border border-white/20 text-muted font-mono text-xs px-3 py-1 rounded">RAW — LOG · UNMIXED</div>
            <div className="absolute bottom-10 left-4 bg-black/80 text-muted font-mono text-xs p-2 rounded border border-white/10 hidden sm:block">ROOM AUDIO · NO MOTION</div>
          </div>
          <div style={{ left: `${pos}%` }} className="absolute inset-y-0 -ml-px w-0.5 bg-acid shadow-[0_0_18px_rgba(183,255,0,0.8)]">
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-acid text-black grid place-items-center border-2 border-white shadow-xl"><Sliders className="w-5 h-5" /></div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); toggle(); }} aria-label={playing ? 'Pause comparison' : 'Play comparison'} className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 border border-white/20 rounded-full px-4 py-2 text-xs font-mono text-white hover:text-acid">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {playing ? 'PAUSE' : 'PLAY BOTH'}
          </button>
        </div>
        
      </div>
    </section>
  );
};
