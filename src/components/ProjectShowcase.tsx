import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Filter, Clock, Scissors, Layers, ArrowUpRight } from 'lucide-react';
import { Project, FilterOption } from '../types';
import { PROJECTS } from '../data/projects';
import { soundEngine } from '../services/soundEngine';

interface ProjectShowcaseProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('ALL');

  const filteredProjects = PROJECTS.filter((proj) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'LONG FORM') return proj.type === 'long-form';
    if (activeFilter === 'SHORT FORM') return proj.type === 'short-form';
    if (activeFilter === 'GAMING') return proj.category === 'GAMING';
    if (activeFilter === 'TALKING HEAD') return proj.category === 'TALKING HEAD';
    return true;
  });

  const handleFilterClick = (filter: FilterOption) => {
    soundEngine.playCutSound();
    setActiveFilter(filter);
  };

  return (
    <section id="work" className="relative py-24 px-4 md:px-8 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header & Metadata */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-acid mb-2">
              <span className="w-2 h-2 bg-acid rounded-full animate-pulse" />
              <span>[ SELECTED REENTRIES // SEQUENCE 02 ]</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-off-white uppercase tracking-tight">
              FEATURED <span className="text-acid">EDITS</span>
            </h2>
          </div>

          {/* Edit Metadata Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none font-mono text-xs">
            <Filter className="w-4 h-4 text-muted shrink-0 mr-1" />
            {(['ALL', 'LONG FORM', 'SHORT FORM', 'GAMING', 'TALKING HEAD'] as FilterOption[]).map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-3 py-1.5 rounded transition-all whitespace-nowrap border ${
                  activeFilter === filter
                    ? 'bg-acid text-dark border-acid font-bold shadow-[0_0_15px_rgba(183,255,0,0.3)]'
                    : 'bg-charcoal border-white/10 text-muted hover:border-white/30 hover:text-off-white'
                }`}
              >
                [{filter}]
              </button>
            ))}
          </div>
        </div>

        {/* Project Scene Cards */}
        <div className="space-y-16">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, idx) => (
              <ProjectSceneItem
                key={project.id}
                project={project}
                index={idx}
                onSelect={() => {
                  soundEngine.playCutSound();
                  onSelectProject(project);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

interface ProjectSceneItemProps {
  project: Project;
  index: number;
  onSelect: () => void;
}

const ProjectSceneItem: React.FC<ProjectSceneItemProps> = ({ project, index, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundEngine.playHoverSound();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="group relative bg-charcoal/70 border border-white/10 rounded-xl overflow-hidden hover:border-acid/60 transition-all duration-300 shadow-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
        {/* Left Video Canvas Area */}
        <div 
          onClick={onSelect}
          className={`lg:col-span-7 relative cursor-pointer overflow-hidden ${
            project.type === 'short-form' ? 'aspect-[9/16] max-h-[500px] lg:max-h-[600px] mx-auto' : 'aspect-video'
          }`}
        >
          {/* Poster Image */}
          <img
            src={project.poster}
            alt={project.title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out filter contrast-105 ${
              isHovered ? 'scale-105 filter brightness-110' : 'scale-100'
            }`}
          />

          {/* Hover Video Preview */}
          <video
            ref={videoRef}
            src={project.previewVideo}
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />

          {/* Floating Category Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-dark/85 backdrop-blur border border-white/15 px-3 py-1 rounded font-mono text-xs text-acid">
            <span>0{index + 1} // {project.category}</span>
          </div>

          {/* Interactive View Button Prompt */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark/40 backdrop-blur-[2px]">
            <div className="flex items-center gap-3 px-6 py-3 bg-acid text-dark font-display font-black tracking-wider text-sm rounded shadow-[0_0_25px_rgba(183,255,0,0.5)] transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Play className="w-4 h-4 fill-dark" />
              <span>VIEW FULL EDIT Breakdown</span>
            </div>
          </div>
        </div>

        {/* Right Editing Metadata & Details */}
        <div className={`lg:col-span-5 p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-dark/40 ${
          project.type === 'short-form' ? 'h-full' : ''
        }`}>
          <div>
            {/* Top Metadata Tags */}
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-4">
              <span className="text-acid uppercase font-bold">[{project.type.toUpperCase()}]</span>
              <span>YEAR: {project.year}</span>
            </div>

            {/* Project Title */}
            <h3 
              onClick={onSelect}
              className="font-display font-black text-3xl md:text-4xl text-off-white group-hover:text-acid transition-colors cursor-pointer uppercase leading-tight mb-3"
            >
              {project.title}
            </h3>

            {/* Tagline & Description */}
            <p className="text-acid/90 font-mono text-xs font-semibold mb-4 leading-relaxed">
              {project.tagline}
            </p>
            <p className="text-muted text-sm leading-relaxed mb-6">
              {project.description}
            </p>
          </div>

          {/* Post-Production Metrics Grid */}
          <div className="border-t border-white/10 pt-6">
            <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-6">
              <div className="bg-charcoal/80 p-2.5 rounded border border-white/5">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Clock className="w-3 h-3 text-acid" />
                  <span>DURATION</span>
                </div>
                <div className="text-off-white font-bold">{project.metrics.timelineDuration}</div>
              </div>

              <div className="bg-charcoal/80 p-2.5 rounded border border-white/5">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Scissors className="w-3 h-3 text-acid" />
                  <span>TOTAL CUTS</span>
                </div>
                <div className="text-off-white font-bold">{project.metrics.cutsCount} CUTS</div>
              </div>
            </div>

            {/* Tools Used */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-muted">
                <Layers className="w-3 h-3 text-acid mr-1" />
                {project.tools.map((tool) => (
                  <span key={tool} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">
                    {tool}
                  </span>
                ))}
              </div>

              <button
                onClick={onSelect}
                className="flex items-center gap-1 text-xs font-mono text-acid group-hover:translate-x-1 transition-transform"
              >
                <span>DETAILS</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
