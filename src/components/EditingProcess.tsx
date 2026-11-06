import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, CheckCircle2 } from 'lucide-react';
import { EDITING_PROCESS_STEPS } from '../data/projects';
import { soundEngine } from '../services/soundEngine';

export const EditingProcess: React.FC = () => {
  const [active, setActive] = useState(0);
  const step = EDITING_PROCESS_STEPS[active];
  return (
    <section id="process" scroll-mt-20 className="relative py-20 md:py-28 px-4 md:px-6 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div><div className="flex items-center gap-2 text-xs font-mono text-acid mb-2"><Scissors className="w-4 h-4" /><span>[ 02 // PROCESS ]</span></div><h2 className="font-display font-black text-5xl md:text-6xl uppercase tracking-tight">The cutting <span className="text-acid">process</span></h2></div>
          <p className="text-muted font-mono text-xs max-w-md leading-relaxed">Editing isn't making footage look good. It's deciding what deserves to stay.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {EDITING_PROCESS_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => { soundEngine.playCutSound(); setActive(i); }} aria-pressed={i === active} className={`p-4 rounded-xl text-left border transition-colors font-mono ${i === active ? 'bg-acid text-black border-acid' : 'bg-charcoal border-white/10 text-muted hover:border-white/30 hover:text-white'}`}>
              <div className="flex justify-between text-xs mb-2"><span className="font-bold">STEP {s.stepNumber}</span>{i === active && <CheckCircle2 className="w-4 h-4" />}</div>
              <div className="font-display font-black text-base uppercase leading-tight">{s.name}</div>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-6 bg-charcoal border border-white/10 rounded-2xl p-5 md:p-7 items-center">
            <div className="lg:col-span-7 relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
              <video key={step.id} src={step.videoUrl} poster={step.poster} autoPlay loop muted playsInline preload="metadata" aria-label={step.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/85 border border-acid/50 text-acid font-mono text-xs px-2.5 py-1 rounded">REC ● {step.name}</div>
              <div className="absolute bottom-3 right-3 bg-black/85 font-mono text-xs px-2.5 py-1 rounded">{step.timecode}</div>
            </div>
            <div className="lg:col-span-5 space-y-5">
              <span className="text-acid font-mono text-xs font-bold uppercase">[{step.subtitle}]</span>
              <h3 className="font-display font-black text-3xl md:text-4xl uppercase">{step.name}</h3>
              <p className="text-off-white/90 leading-relaxed">{step.description}</p>
              <div className="bg-dark rounded-xl border border-white/10 p-4 font-mono text-xs"><div className="text-muted uppercase mb-1.5">// Visual treatment</div><div className="text-acid font-semibold">{step.visualTreatment}</div></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
