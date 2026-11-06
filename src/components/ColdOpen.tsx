import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../services/soundEngine';

const FRAMES = [
  { url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=80', type: 'TALKING HEAD', word: 'CUT.' },
  { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80', type: 'GAMING ANALYSIS', word: 'PACE.' },
  { url: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1400&q=80', type: '9:16 VERTICAL', word: 'TIMING.' },
];

export const ColdOpen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'waiting' | 'cuts' | 'title' | 'done'>('waiting');
  const [idx, setIdx] = useState(0);
  const complete = useCallback(() => { setStage('done'); sessionStorage.setItem('coldopen-seen', '1'); onComplete(); }, [onComplete]);
  const skip = useCallback(() => { soundEngine.playCutSound(); complete(); }, [complete]);

  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') skip(); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [skip]);
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
        <motion.div key="cold" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-dark flex flex-col items-center justify-center overflow-hidden select-none px-6" role="dialog" aria-label="Intro">
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
              <img src={FRAMES[idx].url} alt={FRAMES[idx].type} className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/70" />
              <div className="absolute top-4 left-4 font-mono text-xs text-acid bg-black/70 border border-acid/40 px-3 py-1 rounded">REC ● {FRAMES[idx].type}</div>
              <motion.div key={idx} initial={{ scale: 1.25, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.12 }} className="absolute inset-0 grid place-items-center font-display font-black text-7xl md:text-9xl tracking-tighter text-acid drop-shadow-[0_0_35px_rgba(183,255,0,0.6)]">{FRAMES[idx].word}</motion.div>
            </div>
          )}
          {stage === 'title' && (
            <div className="text-center">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs text-acid mb-4">SEQUENCE READY</motion.div>
              <motion.h1 initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="font-display font-black text-6xl md:text-8xl uppercase leading-none">Baltazar<br /><span className="text-acid">Goldman</span></motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="font-mono text-sm text-muted mt-4">CUTTING STORIES. BUILDING MOMENTUM.</motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
