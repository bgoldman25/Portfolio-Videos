import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sliders, Sparkles } from 'lucide-react';

export const RawVsEdited: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawVideoRef = useRef<HTMLVideoElement>(null);
  const finalVideoRef = useRef<HTMLVideoElement>(null);
  const syncIntervalRef = useRef<number | null>(null);
  const playPromiseRef = useRef<Promise<void>[]>([]);

  const syncVideos = useCallback(() => {
    const raw = rawVideoRef.current;
    const final = finalVideoRef.current;
    if (raw && final && !raw.paused && !final.paused) {
      if (Math.abs(raw.currentTime - final.currentTime) > 0.1) {
        final.currentTime = raw.currentTime;
      }
    }
  }, []);

  const startSync = useCallback(() => {
    if (syncIntervalRef.current) return;
    syncIntervalRef.current = window.setInterval(syncVideos, 50);
  }, [syncVideos]);

  const stopSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
  }, []);

  const attemptPlay = useCallback(async () => {
    const raw = rawVideoRef.current;
    const final = finalVideoRef.current;
    if (!raw || !final || hasAttemptedPlay) return;

    setHasAttemptedPlay(true);
    raw.currentTime = 0;
    final.currentTime = 0;

    try {
      playPromiseRef.current = [
        raw.play().catch(() => {}),
        final.play().catch(() => {})
      ];
      await Promise.all(playPromiseRef.current);
      startSync();
    } catch {
      // Autoplay blocked - user interaction required
    }
  }, [hasAttemptedPlay, startSync]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;
    setSliderPosition(percentage);
  }, []);

  // Intersection Observer for autoplay when in view
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(element);
          }
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Autoplay when in view
  useEffect(() => {
    if (isInView) {
      attemptPlay();
    } else {
      stopSync();
      rawVideoRef.current?.pause();
      finalVideoRef.current?.pause();
      setHasAttemptedPlay(false);
    }
    return () => stopSync();
  }, [isInView, attemptPlay, stopSync]);

  // Global mouse move & mouse up listeners so dragging continues smoothly even outside the container
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMove]);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="relative py-24 px-4 md:px-8 bg-charcoal border-y border-white/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs rounded mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE TIMELINE SCRUBBER</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-off-white uppercase tracking-tight">
            RAW VS <span className="text-acid">FINAL EDIT</span>
          </h2>
          <p className="text-muted text-sm sm:text-base font-mono mt-3">
            Drag the playhead divider to scrub between raw footage and the polished, high-retention final export.
          </p>
        </div>

        {/* Interactive Comparison Canvas */}
        <div
          ref={containerRef}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchMove={handleTouchMove}
          className="relative aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/20 select-none cursor-ew-resize shadow-2xl bg-black user-select-none"
        >
          {/* Layer 1: Right Side - FINAL POLISHED EDIT */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
            <video
              ref={finalVideoRef}
              src="/videos/After_1.mp4"
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover filter contrast-125 saturate-125 pointer-events-none select-none"
            />

            {/* Kinetic Graphics Overlays simulated for Final Edit */}
            <div className="absolute bottom-16 right-20 bg-dark/90 border border-acid/60 text-acid px-3 py-1.5 font-mono text-xs rounded flex items-center gap-2 hidden sm:flex">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REC.709 COLOR GRADED</span>
            </div>

            {/* Top Right Label */}
            <div className="absolute top-4 right-4 bg-acid text-dark font-mono text-xs font-black px-3 py-1 rounded shadow hidden sm:block">
              FINAL EDIT [POLISHED]
            </div>
          </div>

          {/* Layer 2: Left Side - RAW UNEDITED FOOTAGE (Clipped by Slider) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
            <video
              ref={rawVideoRef}
              src="/videos/Before_1.mp4"
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Raw Log Footprint overlay */}
            <div className="absolute inset-0 bg-emerald-950/20" />

            {/* Top Left Label */}
            <div className="absolute top-4 left-4 bg-dark/90 border border-white/20 text-muted font-mono text-xs px-3 py-1 rounded hidden sm:block">
              RAW FOOTAGE [FLAT LOG]
            </div>

            <div className="absolute bottom-12 left-6 bg-dark/80 text-muted font-mono text-xs p-2 rounded border border-white/10 hidden sm:block">
              UNMIXED ROOM AUDIO // NO MOTION GRAPHICS
            </div>
          </div>

          {/* Draggable Playhead Bar */}
          <div
            style={{ left: `${sliderPosition}%` }}
            className="absolute inset-y-0 z-20 -ml-4 flex flex-col items-center justify-between py-4 pointer-events-none select-none"
          >
            {/* Center Handle Knob */}
            <div className="w-8 h-8 rounded-full bg-acid text-dark flex items-center justify-center shadow-[0_0_20px_rgba(183,255,0,0.8)] border-2 border-white">
              <Sliders className="w-4 h-4" />
            </div>

            {/* Bottom Drag Instruction */}
            <div className="bg-dark/90 text-acid border border-acid/40 font-mono text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
              DRAG TO COMPARE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
