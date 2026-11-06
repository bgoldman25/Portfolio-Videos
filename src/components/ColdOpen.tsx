import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../services/soundEngine';

const FRAMES = [
  { url: '/videos/source-shift-thumbnail.webp', type: 'TALKING HEAD', word: 'CUT.' },
  { url: '/videos/marathon-thumbnail.jpg', type: 'GAMING ANALYSIS', word: 'PACE.' },
  { url: '/videos/tim-ferris-thumbnail.jpg', type: '9:16 VERTICAL', word: 'TIMING.' },
];

export const ColdOpen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'waiting' | 'cuts' | 'title' | 'done'>('waiting');
  const [idx, setIdx] = useState(0);
  const complete = useCallback(() => { setStage('done'); try { sessionStorage.setItem('coldopen-seen', '1'); } catch {} onComplete(); }, [onComplete]);
  const skip = useCallback(() => { soundEngine.playCutSound(); complete(); }, [complete]);

  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Restore focus to whatever opened the intro (or body on first load).
  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    return () => {
      const opener = openerRef.current;
      if (opener && opener !== document.body && document.contains(opener)) opener.focus();
      openerRef.current = null;
    };
  }, []);

  // Keep focus inside the blocking intro: Escape skips, Tab wraps.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { skip(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panelRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skip]);

  // Stage changes unmount the clicked control; always leave focus on a control inside the dialog.
  useEffect(() => {
    const el = panelRef.current;
    if (!el || el.contains(document.activeElement)) return;
    const first = el.querySelector<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
    (first ?? el).focus();
  }, [stage]);
  useEffect(() => {
    if (stage !== 'cuts') return;
    let i = 0; const timer = window.setInterval(() => { i = (i + 1) % FRAMES.length; setIdx(i); soundEngine.playCutSound(); }, 650);
    const t = window.setTimeout(() => setStage('title'), 2200);
    return () => { clearInterval(timer); clearTimeout(t); };
  }, [stage]);
  useEffect(() => { if (stage !== 'title') return; soundEngine.playImpactSound(); const t = window.setTimeout(complete, 2600); return () => clearTimeout(t); }, [stage, complete]);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div key="cold" initial={{ opacity: 1 }} exit={{ opacity: 0 }} ref={panelRef} tabIndex={-1} className="fixed inset-0 z-50 bg-dark flex flex-col items-center justify-center overflow-hidden select-none px-6 outline-none" role="dialog" aria-modal="true" aria-label="Intro">
          <button onClick={skip} className="absolute top-5 right-5 z-10 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white/80 hover:text-acid hover:border-acid">SKIP INTRO ✕</button>
          {stage === 'waiting' && (
            <button onClick={async () => { await soundEngine.unlockAudio(); soundEngine.playHeroRiserSound(); setStage('cuts'); }} className="flex flex-col items-center gap-5 group">
              <span className="w-3 h-3 bg-acid rounded-full animate-pulse" />
              <span className="font-mono text-2xl md:text-4xl text-acid/70 tracking-widest font-bold">00:00:00:00</span>
              <span className="w-16 h-16 rounded-full border-2 border-acid/60 grid place-items-center group-hover:scale-105 transition-transform"><span className="w-0 h-0 border-l-[12px] border-l-acid border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-1" /></span>
              <span className="text-xs font-mono text-muted tracking-[0.3em] uppercase">Tap to begin · ESC to skip</span>
            </button>
          )}
          {stage === 'cuts' && (
            <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10">
              <img src={FRAMES[idx].url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale contrast-125" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/70" />
              <div className="absolute top-4 left-4 font-mono text-xs text-acid bg-black/70 border border-acid/40 px-3 py-1 rounded">REC ● {FRAMES[idx].type}</div>
              <motion.div key={idx} initial={{ scale: 1.25, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.12 }} className="absolute inset-0 grid place-items-center font-display font-black text-7xl md:text-9xl tracking-tighter text-acid drop-shadow-[0_0_35px_rgba(183,255,0,0.6)]">{FRAMES[idx].word}</motion.div>
            </div>
          )}
          {stage === 'title' && (
            <div className="text-center">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs text-acid mb-4">SEQUENCE READY</motion.div>
              <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="font-display font-black text-6xl md:text-8xl uppercase leading-none">Baltazar<br /><span className="text-acid">Goldman</span></motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="font-mono text-sm text-muted mt-4">CUTTING STORIES. BUILDING MOMENTUM.</motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
