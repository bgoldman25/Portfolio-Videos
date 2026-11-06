import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Scissors, Monitor, CheckCircle2, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS } from '../data/projects';
import { VideoPlayer } from './VideoPlayer';

export const ProjectModal: React.FC<{ project: Project | null; onClose: () => void; onSelectProject: (p: Project) => void }> = ({ project, onClose, onSelectProject }) => {
  const idx = project ? PROJECTS.findIndex((p) => p.id === project.id) : -1;
  const next = idx >= 0 ? PROJECTS[(idx + 1) % PROJECTS.length] : null;
  const prev = idx >= 0 ? PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length] : null;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight' && next) onSelectProject(next); if (e.key === 'ArrowLeft' && prev) onSelectProject(prev); };
    if (project) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', onKey); }
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [project, next, prev, onClose, onSelectProject]);
  return (
    <AnimatePresence>
      {project && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl overflow-y-auto" onClick={onClose}>
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()} className="max-w-5xl mx-auto my-6 md:my-10 mx-4 md:mx-auto bg-charcoal border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-surface font-mono text-xs">
              <span className="flex items-center gap-2 text-acid"><span className="w-2 h-2 rounded-full bg-acid animate-pulse" />PROJECT BREAKDOWN // {project.category} — use ← → to browse, ESC to close</span>
              <button onClick={onClose} aria-label="Close" className="p-2 rounded bg-white/5 border border-white/10 hover:border-acid hover:text-acid"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-6"><VideoPlayer youtubeId={project.youtubeId} mp4Src={project.fullVideo} poster={project.poster} title={project.title} /></div>
            <div className="px-5 md:px-10 pb-8 md:pb-10 space-y-7">
              <div>
                <div className="flex flex-wrap gap-2 font-mono text-xs text-muted mb-3"><span className="px-2 py-0.5 bg-acid/10 border border-acid/30 text-acid font-bold">[{project.type.toUpperCase()}]</span><span>{project.year} · {project.role}</span></div>
                <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-tight">{project.title}</h2>
              </div>
              <p className="text-off-white/90 leading-relaxed text-base md:text-lg">{project.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                {[{ icon: Clock, k: 'RUNTIME', v: project.metrics.timelineDuration }, { icon: Scissors, k: 'CUTS', v: `${project.metrics.cutsCount}` }, { icon: Monitor, k: 'DELIVERY', v: project.metrics.resolution }, { icon: CheckCircle2, k: 'GRADE', v: project.metrics.colorGrade }].map((m) => <div key={m.k} className="p-4 rounded-xl bg-dark border border-white/10"><m.icon className="w-4 h-4 text-acid mb-2" /><div className="text-muted text-[11px]">{m.k}</div><div className="text-off-white font-bold text-sm mt-0.5">{m.v}</div></div>)}
              </div>
              <div className="flex flex-wrap gap-2">{project.tools.map((t) => <span key={t} className="px-3 py-1.5 bg-surface border border-white/15 font-mono text-xs rounded-full">{t}</span>)}</div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                <div className="flex gap-2">
                  {prev && <button onClick={() => onSelectProject(prev)} className="flex items-center gap-2 px-4 py-2.5 border border-white/15 rounded-full font-mono text-xs hover:border-acid"><ArrowLeft className="w-4 h-4" /> Prev</button>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.youtubeId && <a href={`https://www.youtube.com/watch?v=${project.youtubeId}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 border border-white/15 rounded-full font-mono text-xs hover:border-acid hover:text-acid">Open on YouTube <ExternalLink className="w-4 h-4" /></a>}
                  {next && <button onClick={() => onSelectProject(next)} className="flex items-center gap-2 px-5 py-2.5 bg-acid text-black font-bold rounded-full hover:bg-white">Next: {next.title.slice(0, 28)}… <ArrowRight className="w-4 h-4" /></button>}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
