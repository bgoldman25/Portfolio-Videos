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

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Zeroes a reveal transition when the visitor asks their OS for reduced motion. */
export function motionTiming(reduce: boolean, timing: { duration: number; delay?: number }) {
  return reduce ? { duration: 0, delay: 0 } : timing;
}

export function useLiveTimecode() {
  const [tc, setTc] = useState('00:00:00:00');
  const frameRef = useRef(0);
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const id = window.setInterval(() => {
      const now = new Date();
      frameRef.current = (frameRef.current + 15) % 60;
      setTc(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${pad(frameRef.current)}`);
    }, 250);
    return () => window.clearInterval(id);
  }, []);
  return tc;
}
