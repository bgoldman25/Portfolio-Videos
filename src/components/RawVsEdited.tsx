import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sliders, Sparkles } from 'lucide-react';

const RELEASE = 'https://github.com/bgoldman25/Portfolio-Videos/releases/download/videos-v1';
const RAW_CANDIDATES = ['/videos/Before_1.mp4', `${RELEASE}/Before_1.mp4`];
const FINAL_CANDIDATES = ['/videos/After_1.mp4', `${RELEASE}/After_1.mp4`];

const DRIFT_TOLERANCE = 0.12;

export const RawVsEdited: React.FC = () => {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [rawIdx, setRawIdx] = useState(0);
  const [finalIdx, setFinalIdx] = useState(0);
  const rawSrc = RAW_CANDIDATES[rawIdx];
  const finalSrc = FINAL_CANDIDATES[finalIdx];

  const handleRawError = useCallback(() => {
    if (rawIdx < RAW_CANDIDATES.length - 1) setRawIdx((i) => Math.min(i + 1, RAW_CANDIDATES.length - 1));
    else setVideoError(true);
  }, [rawIdx]);

  const handleFinalError = useCallback(() => {
    if (finalIdx < FINAL_CANDIDATES.length - 1) setFinalIdx((i) => Math.min(i + 1, FINAL_CANDIDATES.length - 1));
    else setVideoError(true);
  }, [finalIdx]);

  const containerRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef<HTMLVideoElement>(null);
  const finalRef = useRef<HTMLVideoElement>(null);

  /* Both clips run on their own: muted inline loops that start as soon as the
     browser lets them, with drift corrected against the raw clip so the two
     sides always show the same frame of the same take. */
  useEffect(() => {
    const r = rawRef.current;
    const f = finalRef.current;
    if (!r || !f) return;

    let cancelled = false;

    const startBoth = () => {
      if (cancelled) return;
      // Belt and braces: the muted property is what makes autoplay permissible.
      r.muted = true;
      f.muted = true;
      void r.play().catch(() => { /* blocked or not ready yet; canplay retries */ });
      void f.play().catch(() => { /* blocked or not ready yet; canplay retries */ });
    };

    startBoth();
    r.addEventListener('canplay', startBoth);
    f.addEventListener('canplay', startBoth);

    const syncId = window.setInterval(() => {
      if (r.paused || f.paused) return;
      if (Math.abs(r.currentTime - f.currentTime) <= DRIFT_TOLERANCE) return;
      try {
        const end = (f.duration || r.duration || 0) - 0.05;
        f.currentTime = end > 0 ? Math.min(r.currentTime, end) : r.currentTime;
      } catch { /* seeking unavailable before metadata; next tick retries */ }
    }, 250);

    return () => {
      cancelled = true;
      window.clearInterval(syncId);
      r.removeEventListener('canplay', startBoth);
      f.removeEventListener('canplay', startBoth);
    };
  }, [rawSrc, finalSrc]);

  const move = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(98, Math.max(2, pct)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const mm = (e: PointerEvent) => move(e.clientX);
    const mu = () => setDragging(false);
    window.addEventListener('pointermove', mm);
    window.addEventListener('pointerup', mu);
    window.addEventListener('pointercancel', mu);
    return () => {
      window.removeEventListener('pointermove', mm);
      window.removeEventListener('pointerup', mu);
      window.removeEventListener('pointercancel', mu);
    };
  }, [dragging, move]);

  return (
    <section id="raw-vs-edited" className="relative py-20 md:py-28 px-4 md:px-6 bg-charcoal border-y border-white/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs rounded-full mb-3"><Sliders className="w-3.5 h-3.5" /> INTERACTIVE BEFORE / AFTER</div>
          <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight">Raw vs <span className="text-acid">final edit</span></h2>
          <p className="text-muted text-sm font-mono mt-3">DRAG THE PLAYHEAD · BOTH CLIPS RUNNING IN SYNC · SAME TAKE, FULL GRADE</p>
        </div>
        <div className="relative max-w-5xl mx-auto">
        <div
          ref={containerRef}
          onPointerDown={(e) => {
            setDragging(true);
            move(e.clientX);
          }}
          onPointerMove={(e) => { if (dragging) move(e.clientX); }}
          className="relative aspect-video w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/40 bg-black cursor-ew-resize select-none touch-none shadow-2xl"
          role="slider"
          aria-label="Before and after comparison"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${Math.round(pos)} percent raw footage`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); setPos((p) => Math.max(2, p - 4)); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setPos((p) => Math.min(98, p + 4)); }
            if (e.key === 'Home') { e.preventDefault(); setPos(2); }
            if (e.key === 'End') { e.preventDefault(); setPos(98); }
          }}
        >
          <video ref={finalRef} src={finalSrc} poster="/videos/After_1-thumbnail.jpg" aria-hidden="true" tabIndex={-1} autoPlay loop muted playsInline preload="auto" onError={handleFinalError} className="absolute inset-0 w-full h-full object-cover contrast-125 saturate-125" />
          <div className="absolute top-4 right-4 bg-acid text-black font-mono text-xs font-black px-3 py-1 rounded">FINAL — GRADED</div>
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            {/* Shown untouched: the source is already flat log, so any filter or tint here would fake the grade. */}
            <video ref={rawRef} src={rawSrc} poster="/videos/Before_1-thumbnail.jpg" aria-hidden="true" tabIndex={-1} autoPlay loop muted playsInline preload="auto" onError={handleRawError} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div style={{ left: `${pos}%` }} className="absolute inset-y-0 -ml-px w-0.5 bg-acid shadow-[0_0_18px_rgba(183,255,0,0.8)]">
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-acid text-black grid place-items-center border-2 border-white shadow-xl"><Sliders className="w-5 h-5" /></div>
          </div>
          {/* Raw-side annotations sit above the draggable playhead: the clipped layer's
              clip-path creates a stacking context, so they cannot out-rank it from inside. */}
          <div style={{ opacity: pos > 20 ? 1 : 0 }} className="pointer-events-none absolute top-4 left-4 z-20 bg-black border border-white/40 text-white/90 font-mono text-xs px-3 py-1 rounded transition-opacity duration-200">RAW — LOG · UNMIXED</div>
          <div style={{ opacity: pos > 30 ? 1 : 0 }} className="pointer-events-none absolute bottom-4 left-4 z-20 bg-black text-white/90 font-mono text-xs p-2 rounded border border-white/40 hidden sm:block transition-opacity duration-200">ROOM AUDIO · NO MOTION</div>
          <div className="pointer-events-none absolute bottom-4 right-4 z-20 bg-black/85 border border-acid/50 text-acid px-3 py-1.5 font-mono text-xs rounded hidden sm:flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> REC.709 · KINETIC TYPE</div>
          {videoError && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/85 border border-white/20 text-white font-mono text-xs px-3 py-1.5 rounded z-20">
              Video unavailable — please check your connection.
            </div>
          )}
        </div>
        <p className="text-center text-xs font-mono text-muted mt-4">Left: ungraded source + room audio · Right: final grade, motion callouts & mix</p>
      </div>
    </div>
    </section>
  );
};
