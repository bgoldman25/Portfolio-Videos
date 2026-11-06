import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Scissors, Monitor, CheckCircle2, ArrowRight, ArrowLeft, ExternalLink, Sliders, Film } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS } from '../data/projects';
import { VideoPlayer } from './VideoPlayer';

export const ProjectModal: React.FC<{ project: Project | null; onClose: () => void; onSelectProject: (p: Project) => void }> = ({ project, onClose, onSelectProject }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const idx = project ? PROJECTS.findIndex((p) => p.id === project.id) : -1;
  const next = idx >= 0 ? PROJECTS[(idx + 1) % PROJECTS.length] : null;
  const prev = idx >= 0 ? PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length] : null;
  const openerRef = useRef<HTMLElement | null>(null);
  const isOpen = Boolean(project);

  // Open/close only. Kept separate from the key handler so browsing with Next/Prev
  // does not restore focus to the card behind the open dialog.
  useEffect(() => {
    if (!isOpen) return;
    // Capture before moving focus, otherwise the dialog's own control becomes the "opener".
    openerRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current;
    const firstControl = panel?.querySelector<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
    (firstControl ?? panel)?.focus();
    return () => {
      document.body.style.overflow = '';
      const opener = openerRef.current;
      if (opener && opener !== document.body && document.contains(opener)) opener.focus();
      openerRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && next) onSelectProject(next);
      if (e.key === 'ArrowLeft' && prev) onSelectProject(prev);
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panelRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, next, prev, onClose, onSelectProject]);
  return (
    <AnimatePresence>
      {project && (
        <motion.div role="dialog" aria-modal="true" aria-label={`Project details: ${project.title}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl overflow-y-auto overscroll-contain" onClick={onClose}>
          <motion.div ref={panelRef} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()} className="max-w-5xl mx-4 md:mx-auto my-6 md:my-10 bg-charcoal border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-surface font-mono text-xs">
              <span className="flex items-center gap-2 text-acid"><span className="w-2 h-2 rounded-full bg-acid animate-pulse" />PROJECT BREAKDOWN // {project.category} — use ← → to browse, ESC to close</span>
              <button onClick={onClose} aria-label="Close" className="p-2 rounded bg-white/5 border border-white/40 hover:border-acid hover:text-acid"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-6"><VideoPlayer youtubeId={project.youtubeId} mp4Src={project.fullVideo} poster={project.poster} title={project.title} /></div>
            <div className="px-5 md:px-10 -mt-1 pb-5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted">
              <span className="flex items-center gap-2"><Film className="w-3.5 h-3.5 text-acid" />FULL FILM — {project.durationLabel} · {project.metrics.resolution}</span>
              <div className="flex flex-wrap gap-4">
                {project.rawVideo && project.finalVideo && (
                  <button onClick={() => { onClose(); window.setTimeout(() => document.getElementById('raw-vs-edited')?.scrollIntoView({ behavior: 'smooth' }), 80); }} className="flex items-center gap-1.5 text-acid hover:underline"><Sliders className="w-3.5 h-3.5" />Raw vs final grade</button>
                )}
                <a href={project.fullVideo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-acid hover:underline">Open source film <ExternalLink className="w-3.5 h-3.5" /></a>
              </div>
            </div>
            <div className="px-5 md:px-10 pb-8 md:pb-10 space-y-7">
              <div>
                <div className="flex flex-wrap gap-2 font-mono text-xs text-muted mb-3"><span className="px-2 py-0.5 bg-acid/10 border border-acid/30 text-acid font-bold">[{project.type.toUpperCase()}]</span><span>{project.year} · {project.role}</span></div>
                <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-tight">{project.title}</h2>
              </div>
              <p className="text-off-white/90 leading-relaxed text-base md:text-lg">{project.description}</p>
              {project.gallery?.length ? (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 font-mono text-xs">
                    <span className="flex items-center gap-2 text-acid"><Film className="w-3.5 h-3.5" />FRAMES FROM THE EDIT</span>
                    <span className="text-[11px] text-muted"><span className="sm:hidden">SWIPE →</span><span className="hidden sm:inline">REAL PROJECT FOOTAGE</span></span>
                  </div>
                  <div tabIndex={0} role="group" aria-label="Project frames" className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0">
                    {project.gallery.map((frame, i) => (
                      <figure key={frame.src} className={`relative min-w-[82%] snap-start overflow-hidden rounded-xl border border-white/10 bg-black sm:min-w-0 ${project.type === 'short-form' ? 'aspect-[3/4]' : 'aspect-video'}`}>
                        <img src={frame.src} alt={`${project.title} — ${frame.label.toLowerCase()}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <figcaption className="absolute bottom-2 left-2 right-2 font-mono text-[9px] md:text-[10px] tracking-wider text-white/85"><span className="text-acid">{String(i + 1).padStart(2, '0')}</span> / {frame.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                {[{ icon: Clock, k: 'RUNTIME', v: project.metrics.timelineDuration }, { icon: Scissors, k: 'CUTS', v: `${project.metrics.cutsCount}` }, { icon: Monitor, k: 'DELIVERY', v: project.metrics.resolution }, { icon: CheckCircle2, k: 'GRADE', v: project.metrics.colorGrade }].map((m) => <div key={m.k} className="p-4 rounded-xl bg-dark border border-white/10"><m.icon className="w-4 h-4 text-acid mb-2" /><div className="text-muted text-[11px]">{m.k}</div><div className="text-off-white font-bold text-sm mt-0.5">{m.v}</div></div>)}
              </div>
              <div className="flex flex-wrap gap-2">{project.tools.map((t) => <span key={t} className="px-3 py-1.5 bg-surface border border-white/15 font-mono text-xs rounded-full">{t}</span>)}</div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                <div className="flex gap-2">
                  {prev && <button onClick={() => onSelectProject(prev)} className="flex items-center gap-2 px-4 py-2.5 border border-white/40 rounded-full font-mono text-xs hover:border-acid"><ArrowLeft className="w-4 h-4" /> Prev</button>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.youtubeId && <a href={`https://www.youtube.com/watch?v=${project.youtubeId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 border border-white/40 rounded-full font-mono text-xs hover:border-acid hover:text-acid">Open on YouTube <ExternalLink className="w-4 h-4" /></a>}
                  {next && <button onClick={() => onSelectProject(next)} className="flex items-center gap-2 px-5 py-2.5 bg-acid text-black font-bold rounded-full hover:bg-white">Next: {next.title.length > 28 ? `${next.title.slice(0, 28)}…` : next.title} <ArrowRight className="w-4 h-4" /></button>}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
