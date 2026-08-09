import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Maximize, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { useAutoPlayVideoOnScroll } from '../utils/performance';

export const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useAutoPlayVideoOnScroll(videoRef);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const togglePlay = () => {
    soundEngine.playCutSound();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleAudio = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      soundEngine.setMuted(nextMuted);
      soundEngine.playCutSound();
    }
  };

  const toggleFullscreen = () => {
    soundEngine.playCutSound();
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 flex flex-col justify-between overflow-hidden bg-dark"
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Editorial Headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-acid/10 border border-acid/40 text-acid font-mono text-xs uppercase tracking-widest font-bold">
              [ FREELANCE VIDEO EDITOR ]
            </span>
            <span className="hidden sm:inline-block font-mono text-xs text-muted">
              SEQUENCE_01 // HIGH-RETENTION CUTS
            </span>
          </div>

          {/* Massive Brand Name Header */}
          <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none tracking-tighter text-off-white uppercase select-none">
            BALTAZAR <br />
            <span className="text-acid hover:text-acid-glow transition-all">GOLDMAN</span>
          </h1>
        </motion.div>

        {/* Positioning Statement & Copy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-8"
          >
            <p className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-off-white leading-tight">
              I cut raw footage into stories people actually want to watch.
            </p>
            <p className="text-muted text-base md:text-lg mt-3 max-w-2xl">
              Specializing in gaming breakdowns, YouTube documentaries, talking-head content, short-form reels, and high-retention storytelling with internet-native pacing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:col-span-4 flex flex-col md:items-end gap-3 font-mono text-xs text-muted"
          >
            <div className="flex items-center gap-2 bg-charcoal border border-white/10 px-3 py-2 rounded">
              <Sparkles className="w-4 h-4 text-acid" />
              <span>RETENTION-FIRST EDITING</span>
            </div>
            <a
              href="#work"
              onClick={() => soundEngine.playHoverSound()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-acid text-dark font-display font-black tracking-wider text-sm rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(183,255,0,0.3)]"
            >
              <span>EXPLORE WORK</span>
              <span>↓</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Hero Video Canvas Experience */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        style={{
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`
        }}
        className="relative z-10 max-w-7xl mx-auto w-full mt-10 rounded-lg overflow-hidden border border-white/15 bg-charcoal shadow-2xl transition-transform duration-200 ease-out"
      >
        {/* Video Canvas Container */}
        <div className="relative aspect-video w-full bg-black group">
          <video
            ref={videoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover filter contrast-105"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent pointer-events-none" />

          {/* Top Metadata Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none font-mono text-xs text-off-white/80">
            <div className="flex items-center gap-2 bg-dark/80 backdrop-blur px-3 py-1 border border-white/10 rounded">
              <span className="w-2 h-2 bg-acid rounded-full animate-pulse" />
              <span>SHOWREEL // 2026</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-dark/80 backdrop-blur px-3 py-1 border border-white/10 rounded text-acid">
              <span>PRORES 422 HQ</span>
              <span>•</span>
              <span>60 FPS</span>
            </div>
          </div>

          {/* Minimal Custom Video Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-dark/85 backdrop-blur border border-white/15 px-4 py-2.5 rounded font-mono text-xs text-off-white">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 hover:text-acid transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-acid" /> : <Play className="w-4 h-4 text-acid" />}
                <span className="font-bold">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={toggleAudio}
                className="flex items-center gap-2 hover:text-acid transition-colors border-l border-white/15 pl-4"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-muted" /> : <Volume2 className="w-4 h-4 text-acid" />}
                <span>{isMuted ? 'UNMUTE' : 'AUDIO ON'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-muted">TIMECODE: <strong className="text-acid">00:01:24:18</strong></span>
              <button
                onClick={toggleFullscreen}
                className="hover:text-acid transition-colors p-1"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
