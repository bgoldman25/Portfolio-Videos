import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { SITE } from '../data/site';
import { usePrefersReducedMotion, motionTiming } from '../utils/performance';

export const Hero: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion();
  return (
  <section id="top" className="relative pt-24 md:pt-28 overflow-hidden bg-dark">
    <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
    <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-acid/10 blur-[140px] pointer-events-none" />
    <div className="relative max-w-7xl mx-auto px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={motionTiming(reduceMotion, { duration: 0.7 })}>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-6">
          <span className="px-3 py-1.5 text-acid font-bold">[ FREELANCE VIDEO EDITOR ]</span>
        </div>
        <h1 className="font-display font-black uppercase leading-[0.88] tracking-tighter text-[clamp(3.2rem,10vw,9.5rem)]">Baltazar<br /><span className="text-acid">Goldman</span></h1>
        <div className="grid md:grid-cols-12 gap-6 mt-8 items-stretch">
          <div className="md:col-span-7">
            <p className="font-display font-bold text-2xl md:text-[2.2rem] leading-tight">I cut raw footage into stories people actually watch — <span className="text-acid">start to finish.</span></p>
            <p className="text-muted mt-4 max-w-2xl leading-relaxed">Retention-first editing for creators, brands, and documentary YouTube. Pacing, motion, and sound engineered so the half-second before the joke lands exactly when it should.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="#work" className="inline-flex items-center gap-2 px-5 py-3 bg-acid text-black font-bold rounded-full hover:bg-white transition-colors"><Play className="w-4 h-4 fill-black" />Explore work <ArrowDown className="w-4 h-4" /></a>
              <a href="#book" className="inline-flex items-center gap-2 px-5 py-3 border border-white/40 font-semibold rounded-full hover:border-acid hover:text-acid transition-colors">Book discovery call <ArrowUpRight className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={motionTiming(reduceMotion, { duration: 0.8, delay: 0.15 })} className="mt-10">
        <VideoPlayer mp4Src={SITE.showreel.src} poster={SITE.showreel.poster} title={SITE.showreel.title} autoPlay rounded="rounded-2xl" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted">
          <span>SOURCE SHIFT · MARATHON · 30/30 PROTOCOL</span>
          <a href="#work" className="inline-block py-1 text-acid hover:underline">SEE THE FULL EDITS ↓</a>
        </div>
      </motion.div>
    </div>
  </section>
  );
};
