import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { SITE } from '../data/site';

const TICKER = ['HIGH-RETENTION CUTS', 'YOUTUBE DOCUMENTARIES', 'GAMING BREAKDOWNS', 'TALKING HEAD', '9:16 SHORTS', 'MOTION GRAPHICS', 'COLOR GRADING', 'SOUND DESIGN'];

export const Hero: React.FC = () => (
  <section id="top" className="relative pt-24 md:pt-28 overflow-hidden bg-dark">
    <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
    <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-acid/10 blur-[140px] pointer-events-none" />
    <div className="relative max-w-7xl mx-auto px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-6">
          <span className="px-3 py-1.5 rounded-full bg-acid/10 border border-acid/40 text-acid font-bold">[ FREELANCE VIDEO EDITOR ]</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted"><Sparkles className="w-3.5 h-3.5 text-acid" />{SITE.availability.label} — {SITE.availability.capacity}</span>
        </div>
        <h1 className="font-display font-black uppercase leading-[0.88] tracking-tighter text-[clamp(3.2rem,10vw,9.5rem)]">Baltazar<br /><span className="text-acid">Goldman</span></h1>
        <div className="grid md:grid-cols-12 gap-6 mt-8 items-end">
          <div className="md:col-span-7">
            <p className="font-display font-bold text-2xl md:text-[2.2rem] leading-tight">I cut raw footage into stories people actually watch — <span className="text-acid">start to finish.</span></p>
            <p className="text-muted mt-4 max-w-2xl leading-relaxed">Retention-first editing for creators, brands, and documentary YouTube. Pacing, motion, and sound engineered so the half-second before the joke lands exactly when it should.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="#work" className="inline-flex items-center gap-2 px-5 py-3 bg-acid text-black font-bold rounded-full hover:bg-white transition-colors"><Play className="w-4 h-4 fill-black" />Explore work <ArrowDown className="w-4 h-4" /></a>
              <a href="#book" className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 font-semibold rounded-full hover:border-acid hover:text-acid transition-colors">Book discovery call <ArrowUpRight className="w-4 h-4" /></a>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-cols-3 gap-3 font-mono text-center">
            {[{ v: '298', l: 'CUTS IN ONE FILM' }, { v: '60fps', l: 'DELIVERY STANDARD' }, { v: '24h', l: 'RESPONSE TIME' }].map((s) => <div key={s.l} className="p-3.5 rounded-xl bg-charcoal border border-white/10"><div className="font-display font-black text-2xl text-acid">{s.v}</div><div className="text-[10px] text-muted tracking-wider mt-1">{s.l}</div></div>)}
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="mt-10">
        <div className="flex items-center justify-between font-mono text-xs text-muted mb-3"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />SHOWREEL // 2026 — TAP TO PLAY</span><span className="hidden sm:inline">SOUND ON FOR BEST EXPERIENCE</span></div>
        <VideoPlayer youtubeId={SITE.showreel.youtubeId} poster={SITE.showreel.poster} title={SITE.showreel.title} rounded="rounded-2xl" />
      </motion.div>
    </div>
    <div className="relative mt-10 border-y border-white/10 bg-charcoal/60 overflow-hidden py-3" aria-hidden="true">
      <div className="flex whitespace-nowrap animate-marquee gap-8 font-mono text-xs tracking-[0.25em] text-muted"><span>● </span>{[...TICKER, ...TICKER].map((t, i) => <span key={i} className={i % 2 ? 'text-acid/80' : ''}>{t} <span className="text-white/30"> ✂ </span></span>)}</div>
    </div>
  </section>
);
