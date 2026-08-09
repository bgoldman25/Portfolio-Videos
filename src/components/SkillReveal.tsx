import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap, Code } from 'lucide-react';
import { SOFTWARE_SKILLS } from '../data/projects';
import { soundEngine } from '../services/soundEngine';

export const SkillReveal: React.FC = () => {
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const activeSkill = SOFTWARE_SKILLS[activeSkillIndex];

  return (
    <section id="skills" className="relative py-24 px-4 md:px-8 bg-charcoal border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-acid mb-2">
              <Cpu className="w-4 h-4" />
              <span>[ SOFTWARE PROFICIENCY // SEQUENCE 04 ]</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-off-white uppercase tracking-tight">
              TOOLKIT & <span className="text-acid">MASTERY</span>
            </h2>
          </div>
          <div className="bg-dark/80 border border-acid/30 px-4 py-2 rounded font-mono text-xs text-acid">
            "The tools matter less than what Baltazar does with them."
          </div>
        </div>

        {/* Skill Reveal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Software Meter Selectors */}
          <div className="lg:col-span-6 space-y-4">
            {SOFTWARE_SKILLS.map((skill, idx) => {
              const isActive = idx === activeSkillIndex;
              return (
                <div
                  key={skill.name}
                  onMouseEnter={() => {
                    setActiveSkillIndex(idx);
                    soundEngine.playHoverSound();
                  }}
                  onClick={() => {
                    setActiveSkillIndex(idx);
                    soundEngine.playCutSound();
                  }}
                  className={`group relative p-5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-dark border-acid shadow-[0_0_20px_rgba(183,255,0,0.2)]'
                      : 'bg-surface border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: skill.color }} />
                      <span className="font-display font-black text-xl text-off-white group-hover:text-acid transition-colors uppercase">
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-acid font-bold text-lg">{skill.percentage}% PROFICIENCY</span>
                  </div>

                  {/* Experimental Waveform / Timeline Track Fill Indicator */}
                  <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="absolute inset-y-0 left-0 bg-acid rounded-full shadow-[0_0_10px_rgba(183,255,0,0.8)]"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 font-mono text-[11px] text-muted">
                    <span>{skill.tagline}</span>
                    <span className="text-acid/80">SHORTCUT: {skill.shortcut}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Editing Console Details Terminal */}
          <div className="lg:col-span-6 bg-dark border border-white/15 rounded-xl p-6 md:p-8 flex flex-col justify-between font-mono shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-white/5 font-display font-black text-9xl select-none pointer-events-none">
              {activeSkill.percentage}%
            </div>

            <div>
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-acid" />
                  <span>EDITING_ROOM_CONSOLE_V2.6</span>
                </div>
                <div className="text-acid">STATUS: ACTIVE</div>
              </div>

              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-acid text-xs">
                  TARGET: {activeSkill.name}
                </div>
                <h3 className="font-display font-black text-3xl text-off-white uppercase">
                  {activeSkill.tagline}
                </h3>
                <p className="text-off-white/80 text-sm leading-relaxed font-sans">
                  {activeSkill.description}
                </p>
              </div>
            </div>

            {/* Bottom Software Philosophy Statement */}
            <div className="border-t border-white/10 pt-6 mt-8 flex items-center gap-3 text-xs text-muted">
              <Zap className="w-4 h-4 text-acid shrink-0" />
              <span>Editing speed is driven by muscle memory, story intuition, and relentless pacing refinement.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
