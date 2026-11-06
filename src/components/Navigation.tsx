import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Calendar } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { SITE } from '../data/site';

const LINKS = [
  { href: '#work', label: 'Work', n: '01' },
  { href: '#process', label: 'Process', n: '02' },
  { href: '#services', label: 'Services', n: '03' },
  { href: '#about', label: 'About', n: '04' },
];

export const Navigation: React.FC<{ onReplayIntro?: () => void }> = ({ onReplayIntro }) => {
  const [audio, setAudio] = useState(soundEngine.getMuted() === false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  const toggle = () => { const n = !audio; setAudio(n); soundEngine.setMuted(!n); if (n) soundEngine.playCutSound(); };
  return (
    <header className={`fixed top-0 inset-x-0 z-50 border-b transition-colors ${scrolled ? 'bg-[#080808]/95 backdrop-blur border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]' : 'bg-[#080808]/80 backdrop-blur border-white/[0.06]'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-16 flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <span className="w-2.5 h-2.5 bg-acid rounded-full animate-pulse" />
          <span className="font-display font-black tracking-tight text-sm md:text-base uppercase">Baltazar <span className="text-acid">Goldman</span></span>
          <span className="hidden xl:inline text-[10px] font-mono text-muted border-l border-white/10 pl-3">VIDEO EDITOR — RETENTION-FIRST</span>
        </a>
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-acid/10 border border-acid/30 text-acid whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />{SITE.availability.label} · {SITE.availability.capacity}</span>
        </div>
        <nav className="hidden lg:flex items-center gap-4 text-xs font-mono text-muted shrink-0">
          {LINKS.map((l) => <a key={l.href} href={l.href} className="hover:text-acid transition-colors"><span className="text-acid/70 mr-1">{l.n}</span>{l.label.toUpperCase()}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#book" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-acid text-black text-xs font-bold hover:bg-white transition-colors whitespace-nowrap shrink-0"><Calendar className="w-3.5 h-3.5 shrink-0" />Book a call</a>
          <button onClick={toggle} aria-label="Toggle sound" aria-pressed={audio} className="p-2 rounded-full border border-white/15 text-muted hover:text-acid hover:border-acid shrink-0">{audio ? <Volume2 className="w-4 h-4 text-acid" /> : <VolumeX className="w-4 h-4" />}</button>
          {onReplayIntro && <button onClick={onReplayIntro} className="hidden xl:inline text-xs font-mono text-muted hover:text-acid whitespace-nowrap shrink-0">REPLAY INTRO</button>}
          <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} aria-controls="mobile-nav" className="md:hidden p-2 rounded border border-white/15">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>
      {open && <nav id="mobile-nav" aria-label="Mobile" className="md:hidden border-t border-white/10 bg-dark/95 px-4 py-4 flex flex-col gap-1 text-sm font-mono">{LINKS.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2.5 border-b border-white/5 last:border-0">{l.n} — {l.label}</a>)}<a href="#book" onClick={() => setOpen(false)} className="py-3 text-acid font-bold">Book a discovery call →</a></nav>}
    </header>
  );
};
