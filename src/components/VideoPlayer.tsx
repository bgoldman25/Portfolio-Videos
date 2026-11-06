import React, { useRef, useState, useCallback } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';

interface Props {
  youtubeId?: string;
  mp4Src?: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  rounded?: string;
}

export const VideoPlayer: React.FC<Props> = ({ youtubeId, mp4Src, poster, title = 'Video', className = '', autoPlay = false, rounded = 'rounded-2xl' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ytStarted, setYtStarted] = useState(false);
  const [error, setError] = useState(false);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); } else { v.pause(); setPlaying(false); }
  }, []);

  const toggleMute = () => { const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); };
  const toggleFullscreen = () => { const el = containerRef.current; if (!el) return; if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.().catch(() => {}); };
  const onTimeUpdate = () => { const v = videoRef.current; if (!v || !v.duration) return; setProgress((v.currentTime / v.duration) * 100); };

  if (error) {
    return (
      <div className={`relative aspect-video w-full bg-charcoal grid place-items-center ${rounded} border border-white/10 p-6 text-center ${className}`}>
        <div><p className="font-mono text-sm text-muted">Video unavailable offline.</p><p className="text-sm mt-1">Check your connection.</p></div>
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
      <video ref={videoRef} src={mp4Src} poster={poster} loop muted playsInline autoPlay={autoPlay} preload="metadata" onTimeUpdate={onTimeUpdate} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError(true)} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15"><div className="h-full bg-acid transition-[width]" style={{ width: `${progress}%` }} /></div>
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
        <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className="p-2.5 rounded bg-black/70 text-white hover:text-acid border border-white/20 min-w-[40px] min-h-[40px] grid place-items-center">{playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={toggleMute} aria-label="Toggle sound" className="p-2.5 rounded bg-black/70 text-white hover:text-acid border border-white/20 min-w-[40px] min-h-[40px] grid place-items-center">{muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
        <button onClick={toggleFullscreen} aria-label="Fullscreen" className="p-2.5 rounded bg-black/70 text-white hover:text-acid border border-white/20 min-w-[40px] min-h-[40px] grid place-items-center"><Maximize className="w-4 h-4" /></button>
      </div>
      <button onClick={togglePlay} aria-label={`${title} — toggle play`} className="absolute inset-0 grid place-items-center" style={{ pointerEvents: playing ? 'none' : 'auto' }}>
        {!playing && <span className="w-14 h-14 rounded-full bg-acid text-black grid place-items-center shadow-xl"><Play className="w-6 h-6 fill-black" /></span>}
      </button>
    </div>
  );
};
