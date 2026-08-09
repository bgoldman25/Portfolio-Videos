import { useEffect, useState, useRef, RefObject } from 'react';

// Custom Hook to manage lazy playing/pausing of videos when entering/leaving viewport
export function useAutoPlayVideoOnScroll(videoRef: RefObject<HTMLVideoElement>, threshold: number = 0.4) {
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {
              // Browser autoplay policy might require muted state
              videoEl.muted = true;
              videoEl.play().catch(() => {});
            });
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold }
    );

    observer.observe(videoEl);

    return () => {
      observer.disconnect();
    };
  }, [videoRef, threshold]);
}

// Custom Hook for live updating post-production timecode counter (HH:MM:SS:FF at 60fps)
export function useLiveTimecode() {
  const [timecode, setTimecode] = useState('00:00:00:00');
  const frameRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;

    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      frameRef.current = (frameRef.current + 1) % 60;
      const frames = String(frameRef.current).padStart(2, '0');

      setTimecode(`${hours}:${minutes}:${seconds}:${frames}`);
      animationFrameId = requestAnimationFrame(updateClock);
    };

    animationFrameId = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return timecode;
}
