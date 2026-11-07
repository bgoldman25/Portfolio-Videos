import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap } from 'lucide-react';
import { SOFTWARE_SKILLS } from '../data/projects';
import { usePrefersReducedMotion } from '../utils/performance';

export const SkillReveal: React.FC = () => {
  const [active, setActive] = useState(0);
  const skill = SOFTWARE_SKILLS[active];
  const reduceMotion = usePrefersReducedMotion();
  return (
    <section id="skills" className="relative py-20 md:py-28 px-4 md:px-6 bg-charcoal border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div><div className="flex items-center gap-2 text-xs font-mono text-acid mb-2"><Cpu className="w-4 h-4" /><span>[ TOOLKIT ]</span></div><h2 className="font-display font-black text-5xl md:text-6xl uppercase tracking-tight">Toolkit & <span className="text-acid">mastery</span></h2></div>
          <div className="font-mono text-xs text-acid border border-acid/30 rounded-full px-4 py-2">The tools matter less than what I do with them.</div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {SOFTWARE_SKILLS.map((s, i) => {
              const isActive = i === active;
              return (
                <button key={s.name} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={isActive} className={`w-full text-left p-5 rounded-2xl border transition-colors ${isActive ? 'bg-dark border-acid' : 'bg-surface border-white/40 hover:border-white/60'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} /><span className="font-display font-black text-xl uppercase">{s.name}</span></span>
                    <span className="text-acid font-bold">{s.percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: reduceMotion ? `${s.percentage}%` : 0 }} whileInView={{ width: `${s.percentage}%` }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.9 }} className="h-full bg-acid rounded-full" /></div>
                  <div className="flex justify-between mt-2 font-mono text-[11px] text-muted"><span>{s.tagline}</span><span>{s.shortcut}</span></div>
                </button>
              );
            })}
          </div>
          <div className="relative bg-dark border border-white/10 rounded-2xl p-7 flex flex-col justify-between overflow-hidden min-h-[320px]">
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-2 right-3 font-display font-black text-[7rem] leading-none text-white/40 select-none">{skill.percentage}%</span>
            <div className="relative z-10">
              <div className="flex items-center gap-2 font-mono text-xs text-muted pb-4 border-b border-white/10 mb-6"><Terminal className="w-4 h-4 text-acid" />EDITING_ROOM_CONSOLE <span className="ml-auto text-acid">ACTIVE</span></div>
              <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-acid text-xs font-mono">TARGET: {skill.name}</span>
              <h3 className="font-display font-black text-3xl uppercase mt-4">{skill.tagline}</h3>
              <p className="text-off-white/80 text-sm leading-relaxed mt-3 font-sans">{skill.description}</p>
            </div>
            <div className="border-t border-white/10 pt-5 mt-6 flex gap-3 text-xs text-muted font-mono"><Zap className="w-4 h-4 text-acid shrink-0" />Speed comes from muscle memory, story intuition & relentless pacing refinement.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
