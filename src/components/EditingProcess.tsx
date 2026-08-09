import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Play, CheckCircle2 } from 'lucide-react';
import { EDITING_PROCESS_STEPS } from '../data/projects';
import { soundEngine } from '../services/soundEngine';

export const EditingProcess: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = EDITING_PROCESS_STEPS[activeStepIndex];

  const handleStepSelect = (index: number) => {
    soundEngine.playCutSound();
    setActiveStepIndex(index);
  };

  return (
    <section id="process" className="relative py-24 px-4 md:px-8 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-acid mb-2">
              <Scissors className="w-4 h-4" />
              <span>[ EDITING PHILOSOPHY // SEQUENCE 03 ]</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-off-white uppercase tracking-tight">
              THE CUTTING <span className="text-acid">PROCESS</span>
            </h2>
          </div>
          <p className="text-muted font-mono text-xs max-w-md">
            "Editing isn't just making footage look good. It's deciding what deserves to stay."
          </p>
        </div>

        {/* Workflow Timeline Step Navigation Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {EDITING_PROCESS_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => handleStepSelect(idx)}
                className={`p-4 rounded-lg text-left transition-all font-mono border ${
                  isActive
                    ? 'bg-acid text-dark border-acid shadow-[0_0_20px_rgba(183,255,0,0.3)] scale-[1.02]'
                    : 'bg-charcoal border-white/10 text-muted hover:border-white/30 hover:text-off-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-bold ${isActive ? 'text-dark' : 'text-acid'}`}>
                    STEP {step.stepNumber}
                  </span>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-dark" />}
                </div>
                <div className="font-display font-black text-lg uppercase leading-tight">
                  {step.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Stage Display Canvas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-charcoal/80 border border-white/10 p-6 md:p-8 rounded-xl items-center"
          >
            {/* Left Preview Screen */}
            <div className="lg:col-span-7 relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
              <video
                src={activeStep.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute top-4 left-4 bg-dark/90 border border-acid/50 text-acid font-mono text-xs px-3 py-1 rounded">
                REC ● {activeStep.name}
              </div>
              <div className="absolute bottom-4 right-4 bg-dark/90 text-off-white font-mono text-xs px-3 py-1 rounded">
                TIMECODE: {activeStep.timecode}
              </div>
            </div>

            {/* Right Stage Copy & Details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-acid font-mono text-xs font-bold uppercase tracking-wider">
                  [{activeStep.subtitle}]
                </span>
                <h3 className="font-display font-black text-3xl md:text-4xl text-off-white uppercase mt-1">
                  {activeStep.name}
                </h3>
              </div>

              <p className="text-off-white/90 text-base leading-relaxed">
                {activeStep.description}
              </p>

              <div className="bg-surface p-4 rounded border border-white/10 font-mono text-xs space-y-2">
                <div className="text-muted uppercase">// VISUAL TREATMENT</div>
                <div className="text-acid font-semibold">{activeStep.visualTreatment}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
