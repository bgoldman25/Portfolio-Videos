import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sliders, Sparkles } from 'lucide-react';

const RELEASE = 'https://github.com/bgoldman25/Portfolio-Videos/releases/download/videos-v1';
const RAW_CANDIDATES = ['/videos/Before_1.mp4', `${RELEASE}/Before_1.mp4`];
const FINAL_CANDIDATES = ['/videos/After_1.mp4', `${RELEASE}/After_1.mp4`];

/* Two separate <video> elements never stay in lockstep on their own: they start a
   beat apart, buffer independently and drift while the tab is hidden. The raw clip
   is the master clock and the graded clip follows it. */
const HARD_DRIFT = 0.15; // seconds off before we seek instead of easing
const SOFT_DRIFT = 0.03; // seconds off before we nudge playback rate
const RATE_NUDGE = 0.08; // 8% faster/slower while catching up
const END_GUARD = 0.04; // shared loop point, so neither side wraps alone
const TICK_MS = 50;

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

  useEffect(() => {
    const master = rawRef.current; // raw clip drives the clock
    const slave = finalRef.current; // graded clip follows it
    if (!master || !slave) return;

    let alive = true;
    let rafId = 0;
    let heartbeatId = 0;
    let lastTick = 0;

    const loopLength = () => {
      const ds = [master.duration, slave.duration].filter((d) => Number.isFinite(d) && d > 0);
      return ds.length ? Math.min(...ds) : 0;
    };

    /* Start (or restart) the pair on the same frame rather than a beat apart. */
    const resume = () => {
      // Muted is what makes autoplay permissible, so enforce it on the element too.
      master.muted = true;
      slave.muted = true;
      if (master.paused && slave.paused) {
        try { slave.currentTime = master.currentTime; } catch { /* metadata not ready */ }
        slave.playbackRate = 1;
      }
      if (master.paused) void master.play().catch(() => { /* retried on next tick */ });
      if (slave.paused) void slave.play().catch(() => { /* retried on next tick */ });
    };

    const reconcile = () => {
      if (!alive) return;
      const limit = loopLength();
      if (!limit) return;

      // Loop the pair together so the split never shows two different moments.
      if (master.ended || slave.ended || master.currentTime >= limit - END_GUARD || slave.currentTime >= limit - END_GUARD) {
        try { master.currentTime = 0; slave.currentTime = 0; } catch { /* noop */ }
        master.playbackRate = 1;
        slave.playbackRate = 1;
        resume();
        return;
      }

      if (master.paused || slave.paused) {
        resume();
        return;
      }

      const drift = master.currentTime - slave.currentTime;
      if (Math.abs(drift) > HARD_DRIFT) {
        // Too far gone to ease back (tab wake, buffering stall): jump the graded side.
        try { slave.currentTime = Math.min(master.currentTime, limit - END_GUARD); } catch { /* noop */ }
        slave.playbackRate = 1;
      } else if (Math.abs(drift) > SOFT_DRIFT) {
        // Small drift: nudge the rate instead of seeking, so nothing visibly jumps.
        slave.playbackRate = drift > 0 ? 1 + RATE_NUDGE : 1 - RATE_NUDGE;
      } else if (slave.playbackRate !== 1) {
        slave.playbackRate = 1;
      }
    };

    const tick = (ts: number) => {
      if (!alive) return;
      rafId = window.requestAnimationFrame(tick);
      if (ts - lastTick < TICK_MS) return;
      lastTick = ts;
      reconcile();
    };

    /* Hidden tabs suspend media and throttle timers, which is exactly how the two
       clips end up at different moments. Park both instead, then resume aligned. */
    const onVisibility = () => {
      if (document.hidden) {
        master.pause();
        slave.pause();
        master.playbackRate = 1;
        slave.playbackRate = 1;
        return;
      }
      resume(); // aligns the graded clip to the raw one before either starts
      reconcile();
    };
    const onPlaybackEvent = () => resume();

    resume();
    master.addEventListener('canplay', onPlaybackEvent);
    slave.addEventListener('canplay', onPlaybackEvent);
    master.addEventListener('playing', reconcile);
    slave.addEventListener('playing', reconcile);
    master.addEventListener('waiting', reconcile);
    slave.addEventListener('waiting', reconcile);
    document.addEventListener('visibilitychange', onVisibility);
    rafId = window.requestAnimationFrame(tick);
    // Frames stop when the tab is hidden, but timers keep ticking (throttled), so the
    // pair is still reconciled in the background instead of drifting until it is seen.
    heartbeatId = window.setInterval(reconcile, 250);

    return () => {
      alive = false;
      window.cancelAnimationFrame(rafId);
      window.clearInterval(heartbeatId);
      master.removeEventListener('canplay', onPlaybackEvent);
      slave.removeEventListener('canplay', onPlaybackEvent);
      master.removeEventListener('playing', reconcile);
      slave.removeEventListener('playing', reconcile);
      master.removeEventListener('waiting', reconcile);
      slave.removeEventListener('waiting', reconcile);
      document.removeEventListener('visibilitychange', onVisibility);
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
