import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, Loader2, ExternalLink } from 'lucide-react';
import { usePrefersReducedMotion } from '../utils/performance';

interface Props {
  youtubeId?: string;
  mp4Src?: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  rounded?: string;
}

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export const VideoPlayer: React.FC<Props> = ({ youtubeId, mp4Src, poster, title = 'Video', className = '', autoPlay = false, rounded = 'rounded-2xl' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ytStarted, setYtStarted] = useState(false);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setReady(false);
    setError(false);
    setBuffering(false);
  }, [mp4Src, youtubeId]);

  useEffect(() => {
    if (ready) { setShowLoading(false); return; }
    const timer = window.setTimeout(() => setShowLoading(true), 900);
    return () => window.clearTimeout(timer);
  }, [ready]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = () => { const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); };
  const toggleFullscreen = () => { const el = containerRef.current; if (!el) return; if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.().catch(() => {}); };
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
    setCurrentTime(v.currentTime);
  };
  const onLoadedMetadata = () => { const v = videoRef.current; if (v?.duration) setDuration(v.duration); setReady(true); };

  if (error) {
    return (
      <div className={`relative aspect-video w-full bg-charcoal grid place-items-center ${rounded} border border-white/10 p-6 text-center ${className}`}>
        <div>
          <p className="font-mono text-sm text-muted">Full film couldn't load here.</p>
          <p className="text-sm mt-1 mb-4">The source file is hosted remotely — open it directly or check your connection.</p>
          {mp4Src && <a href={mp4Src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-acid text-black font-bold rounded-full text-sm">Open source film <ExternalLink className="w-4 h-4" /></a>}
        </div>
      </div>
    );
  }
  // YouTube facade (lazy, privacy-friendly)
  if (youtubeId) {
    if (!ytStarted) {
      return (
        <div ref={containerRef} className={`relative aspect-video w-full bg-black overflow-hidden ${rounded} border border-white/10 group ${className}`}>
          {poster && <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" loading="lazy" decoding="async" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          <button onClick={() => setYtStarted(true)} aria-label={`Play ${title}`} className="absolute inset-0 grid place-items-center cursor-pointer">
            <span className="flex items-center gap-3 bg-acid text-black font-bold px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(183,255,0,0.35)] group-hover:scale-[1.03] transition-transform">
              <Play className="w-5 h-5 fill-black" /> Play
            </span>
            <span className="absolute bottom-4 left-4 text-xs font-mono text-white/80 bg-black/60 px-2.5 py-1 rounded border border-white/15">{title}</span>
          </button>
        </div>
      );
    }
    return (
      <div className={`relative aspect-video w-full bg-black overflow-hidden ${rounded} border border-white/10 ${className}`}>
        <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`} title={title} loading="lazy" sandbox="allow-scripts allow-same-origin allow-presentation" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative aspect-video w-full bg-black overflow-hidden ${rounded} border border-white/10 group ${className}`}>
      <video ref={videoRef} src={mp4Src} poster={poster} aria-label={title} loop muted playsInline autoPlay={autoPlay && !reduceMotion} preload="metadata" onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoadedMetadata} onCanPlay={() => { setReady(true); setBuffering(false); }} onWaiting={() => setBuffering(true)} onPlaying={() => { setPlaying(true); setBuffering(false); }} onPause={() => setPlaying(false)} onError={() => { setError(true); setShowLoading(false); }} className="w-full h-full object-cover" />
      {showLoading && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-2.5 py-1 font-mono text-[10px] text-white/85 pointer-events-none"><Loader2 className="w-3 h-3 animate-spin text-acid" />LOADING FILM</span>
      )}
      {buffering && ready && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-2.5 py-1 font-mono text-[10px] text-white/85 pointer-events-none"><Loader2 className="w-3 h-3 animate-spin text-acid" />BUFFERING</span>
      )}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15"><div className="h-full bg-acid transition-[width]" style={{ width: `${progress}%` }} /></div>
      <span className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/70 border border-white/15 font-mono text-[10px] text-white/80 pointer-events-none">{fmt(currentTime)} / {fmt(duration)}</span>
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
        <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className="p-2.5 rounded bg-black/70 text-white hover:text-acid border border-white/40 min-w-[40px] min-h-[40px] grid place-items-center">{playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={toggleMute} aria-label="Toggle sound" className="p-2.5 rounded bg-black/70 text-white hover:text-acid border border-white/40 min-w-[40px] min-h-[40px] grid place-items-center">{muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
        <button onClick={toggleFullscreen} aria-label="Fullscreen" className="p-2.5 rounded bg-black/70 text-white hover:text-acid border border-white/40 min-w-[40px] min-h-[40px] grid place-items-center"><Maximize className="w-4 h-4" /></button>
      </div>
      <button onClick={togglePlay} aria-hidden="true" tabIndex={-1} className="absolute inset-0 z-10 grid place-items-center" style={{ pointerEvents: playing ? 'none' : 'auto' }}>
        {!playing && <span className="w-14 h-14 rounded-full bg-acid text-black grid place-items-center shadow-xl"><Play className="w-6 h-6 fill-black" /></span>}
      </button>
    </div>
  );
};
