import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, Scissors, Monitor, CheckCircle2, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS } from '../data/projects';
import { soundEngine } from '../services/soundEngine';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSelectProject }) => {
  if (!project) return null;

  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  const handleClose = () => {
    soundEngine.playCutSound();
    onClose();
  };

  const handleNext = () => {
    soundEngine.playCutSound();
    onSelectProject(nextProject);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/95 backdrop-blur-xl flex justify-center items-start py-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl bg-charcoal border border-white/15 rounded-xl overflow-hidden shadow-2xl my-auto"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface">
            <div className="flex items-center gap-3 font-mono text-xs text-acid">
              <span className="w-2.5 h-2.5 bg-acid rounded-full animate-pulse" />
              <span>PROJECT BREAKDOWN // {project.category}</span>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded bg-white/5 border border-white/10 text-muted hover:text-off-white hover:border-acid transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player Header */}
          <div className="relative aspect-video w-full bg-black">
            <video
              src={project.fullVideo}
              poster={project.poster}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-10 space-y-8">
            {/* Header Title & Role */}
            <div>
              <div className="flex items-center gap-3 font-mono text-xs text-muted mb-2">
                <span className="px-2 py-0.5 bg-acid/10 border border-acid/30 text-acid font-bold">
                  [{project.type.toUpperCase()}]
                </span>
                <span>YEAR: {project.year}</span>
                <span>•</span>
                <span>ROLE: {project.role}</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-off-white uppercase">
                {project.title}
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-acid uppercase font-bold tracking-widest">
                [ EDITING STRATEGY & BREAKDOWN ]
              </h3>
              <p className="text-off-white/90 leading-relaxed text-base md:text-lg">
                {project.description}
              </p>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-dark/60 rounded-lg border border-white/10 font-mono text-xs">
              <div>
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Clock className="w-3.5 h-3.5 text-acid" />
                  <span>TIMELINE</span>
                </div>
                <div className="text-off-white font-bold text-sm">{project.metrics.timelineDuration}</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Scissors className="w-3.5 h-3.5 text-acid" />
                  <span>TOTAL CUTS</span>
                </div>
                <div className="text-off-white font-bold text-sm">{project.metrics.cutsCount} CUTS</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Monitor className="w-3.5 h-3.5 text-acid" />
                  <span>RESOLUTION</span>
                </div>
                <div className="text-off-white font-bold text-sm">{project.metrics.resolution}</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-acid" />
                  <span>COLOR GRADE</span>
                </div>
                <div className="text-off-white font-bold text-sm">{project.metrics.colorGrade}</div>
              </div>
            </div>

            {/* Tools Used */}
            <div>
              <h4 className="font-mono text-xs text-muted mb-3 uppercase">[ SOFTWARE PIPELINE ]</h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((t) => (
                  <span key={t} className="px-3 py-1 bg-surface border border-white/15 text-off-white font-mono text-xs rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Project Nav Footer */}
            <div className="border-t border-white/10 pt-8 flex items-center justify-between">
              <div className="font-mono text-xs text-muted">
                NEXT SEQUENCE IN TIMELINE
              </div>
              <button
                onClick={handleNext}
                className="flex items-center gap-3 px-6 py-3 bg-acid text-dark font-display font-black tracking-wider text-sm rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(183,255,0,0.3)]"
              >
                <span>NEXT: {nextProject.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
