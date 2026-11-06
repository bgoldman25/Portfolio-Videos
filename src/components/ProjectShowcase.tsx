import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Play, Clock, Scissors, Film } from 'lucide-react';
import { Project, FilterOption } from '../types';
import { PROJECTS } from '../data/projects';
import { usePrefersReducedMotion, motionTiming } from '../utils/performance';

interface ProjectCardProps {
  project: Project;
  idx: number;
  filter: FilterOption;
  onSelectProject: (p: Project) => void;
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(({ project, idx, filter, onSelectProject }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const hasPreview = /^(https?:\/\/|\/)/i.test(project.previewVideo || '');

  const playPreview = () => {
    const v = videoRef.current;
    if (!v || !hasPreview) return;
    setPreviewing(true);
    try { v.currentTime = 0; } catch { /* noop */ }
    void v.play().catch(() => setPreviewing(false));
  };
  const pausePreview = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPreviewing(false);
    try { v.currentTime = 0; } catch { /* noop */ }
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={motionTiming(reduceMotion, { duration: 0.45, delay: idx * 0.08 })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectProject(project); } }}
      onClick={() => { pausePreview(); onSelectProject(project); }}
      onMouseEnter={playPreview}
      onMouseLeave={pausePreview}
      onFocus={playPreview}
      onBlur={pausePreview}
      className={`group cursor-pointer rounded-2xl overflow-hidden bg-charcoal border border-white/10 hover:border-acid/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid transition-colors ${idx === 0 && filter === 'ALL' ? 'md:col-span-2' : ''}`}
    >
      <div className={`relative overflow-hidden ${project.type === 'short-form' ? 'aspect-[4/3] md:aspect-video' : 'aspect-video'}`}>
        <img src={project.thumbnail} alt={`${project.title} — ${project.category.toLowerCase()} edit`} loading={idx === 0 ? 'eager' : 'lazy'} decoding="async" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
        {hasPreview && (
          <video
            ref={videoRef}
            src={project.previewVideo}
            poster={project.thumbnail}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className={`pointer-events-none absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${previewing ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/25" />
        <div className="absolute top-4 left-4 flex gap-2 font-mono text-[11px]">
          <span className="px-2.5 py-1 rounded bg-black/70 border border-white/15 text-acid">{project.category}</span>
          <span className="px-2.5 py-1 rounded bg-black/70 border border-white/15 text-white/80">{project.durationLabel || project.metrics.timelineDuration.slice(0, 8)}</span>
          {previewing && <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-acid text-black font-bold"><Film className="w-3 h-3" />PREVIEW</span>}
        </div>
        <div className="absolute top-4 right-4 hidden sm:block opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0 group-focus-within:opacity-0 transition-opacity duration-300">
          <span className="flex items-center gap-1.5 bg-acid text-black font-bold px-3 py-1.5 rounded-full text-xs shadow-lg"><Play className="w-3.5 h-3.5 fill-black" /> Watch breakdown</span>
        </div>
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100 transition-opacity bg-black/20">
          <span className="flex items-center gap-2 bg-acid text-black font-bold px-5 py-2.5 rounded-full text-sm"><Play className="w-4 h-4 fill-black" /> Watch breakdown</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 bg-gradient-to-t from-black/95 via-black/85 to-black/40">
          <h3 className="font-display font-black text-2xl md:text-3xl uppercase leading-tight group-hover:text-acid transition-colors">{project.title}</h3>
          <p className="text-white/75 text-sm mt-1.5 line-clamp-2 max-w-2xl">{project.tagline}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-white/10 font-mono text-xs text-muted">
        <span className="flex gap-4"><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-acid" />{project.metrics.timelineDuration.slice(0, 8)}</span><span className="flex items-center gap-1.5"><Scissors className="w-3.5 h-3.5 text-acid" />{project.metrics.cutsCount} cuts</span></span>
        <span className="flex items-center gap-1 text-acid font-bold">CASE STUDY <ArrowUpRight className="w-4 h-4" /></span>
      </div>
    </motion.div>
  );
});
ProjectCard.displayName = 'ProjectCard';

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
    <section id="work" className="relative py-20 md:py-28 px-4 md:px-6 bg-dark scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-xs text-acid mb-2">[ 01 // SELECTED WORK ]</div>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tight">Featured <span className="text-acid">edits</span></h2>
            <p className="text-muted mt-3 max-w-xl">Three recent sequences — hover for a live preview, click any card for the full breakdown and playthrough.</p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {FILTERS.map((f) => <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`px-3.5 py-2.5 rounded-full border transition-colors ${filter === f ? 'bg-acid text-black border-acid font-bold' : 'border-white/40 text-muted hover:text-white hover:border-white/70'}`}>{f}</button>)}
          </div>
        </div>
        <motion.div layout className="grid md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <ProjectCard key={project.id} project={project} idx={idx} filter={filter} onSelectProject={onSelectProject} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
