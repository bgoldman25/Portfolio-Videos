import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Play, Clock, Scissors } from 'lucide-react';
import { Project, FilterOption } from '../types';
import { PROJECTS } from '../data/projects';

export const ProjectShowcase: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const [filter, setFilter] = useState<FilterOption>('ALL');
  const filtered = PROJECTS.filter((p) => {
    if (filter === 'ALL') return true;
    if (filter === 'LONG FORM') return p.type === 'long-form';
    if (filter === 'SHORT FORM') return p.type === 'short-form';
    return p.category === filter;
  });
  const FILTERS: FilterOption[] = ['ALL', 'LONG FORM', 'SHORT FORM', 'GAMING', 'TALKING HEAD'];
  return (
    <section id="work" className="relative py-20 md:py-28 px-4 md:px-6 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-xs text-acid mb-2">[ 01 // SELECTED WORK ]</div>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tight">Featured <span className="text-acid">edits</span></h2>
            <p className="text-muted mt-3 max-w-xl">Three recent sequences — click any card for the full breakdown and playthrough.</p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {FILTERS.map((f) => <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`px-3.5 py-2 rounded-full border transition-colors ${filter === f ? 'bg-acid text-black border-acid font-bold' : 'border-white/15 text-muted hover:text-white hover:border-white/40'}`}>{f}</button>)}
          </div>
        </div>
        <motion.div layout className="grid md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.article layout key={project.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.45, delay: idx * 0.08 }}
                role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectProject(project); } }} onClick={() => onSelectProject(project)} className={`group cursor-pointer rounded-2xl overflow-hidden bg-charcoal border border-white/10 hover:border-acid/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid transition-colors ${idx === 0 && filter === 'ALL' ? 'md:col-span-2' : ''}`}>
                <div className={`relative overflow-hidden ${project.type === 'short-form' ? 'aspect-[4/3] md:aspect-video' : 'aspect-video'}`}>
                  <img src={project.thumbnail} alt={project.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2 font-mono text-[11px]">
                    <span className="px-2.5 py-1 rounded bg-black/70 border border-white/15 text-acid">{project.category}</span>
                    <span className="px-2.5 py-1 rounded bg-black/70 border border-white/15 text-white/80">{project.durationLabel || project.metrics.timelineDuration.slice(0, 8)}</span>
                  </div>
                  <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                    <span className="flex items-center gap-2 bg-acid text-black font-bold px-5 py-2.5 rounded-full text-sm"><Play className="w-4 h-4 fill-black" /> Watch breakdown</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">
                    <h3 className="font-display font-black text-2xl md:text-3xl uppercase leading-tight group-hover:text-acid transition-colors">{project.title}</h3>
                    <p className="text-white/70 text-sm mt-1.5 line-clamp-2 max-w-2xl">{project.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-white/10 font-mono text-xs text-muted">
                  <span className="flex gap-4"><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-acid" />{project.metrics.timelineDuration.slice(0, 8)}</span><span className="flex items-center gap-1.5"><Scissors className="w-3.5 h-3.5 text-acid" />{project.metrics.cutsCount} cuts</span></span>
                  <span className="flex items-center gap-1 text-acid font-bold">CASE STUDY <ArrowUpRight className="w-4 h-4" /></span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
