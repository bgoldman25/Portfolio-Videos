import { useEffect, useState, useRef, RefObject } from 'react';

export function useAutoPlayVideoOnScroll(videoRef: RefObject<HTMLVideoElement | null>, threshold: number = 0.4) {
  useEffect(() => {
    const el = videoRef.current; if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const obs = new IntersectionObserver((entries) => { entries.forEach((e) => { if (e.isIntersecting) { el.play().catch(() => { el.muted = true; el.play().catch(() => {}); }); } else el.pause(); }); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [videoRef, threshold]);
}

export function useLiveTimecode() {
  const [tc, setTc] = useState('00:00:00:00');
  const frameRef = useRef(0);
  useEffect(() => {
    let raf: number; let lastSecond = -1;
    const tick = () => {
      const now = new Date(); const sec = now.getSeconds();
      if (sec !== lastSecond) { lastSecond = sec; frameRef.current = 0; } else { frameRef.current = (frameRef.current + 1) % 60; }
      const pad = (n: number) => String(n).padStart(2, '0');
      setTc(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(sec)}:${pad(frameRef.current)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return tc;
}
