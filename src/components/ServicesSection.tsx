import React from 'react';
import { Check, ArrowUpRight, Film, Smartphone } from 'lucide-react';
import { SERVICE_TIERS } from '../data/projects';
import { soundEngine } from '../services/soundEngine';

export const ServicesSection: React.FC = () => {
  return (
    <section className="relative py-24 px-4 md:px-8 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-acid mb-2">
              <Film className="w-4 h-4" />
              <span>[ EDITING CAPABILITIES // SEQUENCE 05 ]</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-off-white uppercase tracking-tight">
              SERVICES & <span className="text-acid">OFFERINGS</span>
            </h2>
          </div>
          <a
            href="#contact"
            onClick={() => soundEngine.playHoverSound()}
            className="inline-flex items-center gap-2 font-mono text-xs text-acid border border-acid/40 px-4 py-2 rounded hover:bg-acid hover:text-dark transition-all"
          >
            <span>REQUEST CUSTOM QUOTE</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-6 md:p-8 rounded-xl border flex flex-col justify-between transition-all ${
                tier.tier === 'PREMIUM'
                  ? 'bg-charcoal border-acid/60 shadow-[0_0_25px_rgba(183,255,0,0.15)] relative overflow-hidden'
                  : 'bg-surface/80 border-white/10 hover:border-white/30'
              }`}
            >
              {tier.tier === 'PREMIUM' && (
                <div className="absolute top-0 right-0 bg-acid text-dark font-mono text-[10px] font-black px-4 py-1 rounded-bl uppercase">
                  FLAGSHIP SPEC
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-acid mb-3">
                  {tier.category === 'SHORT FORM' ? <Smartphone className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
                  <span>[{tier.category} — {tier.tier}]</span>
                </div>

                <h3 className="font-display font-black text-2xl md:text-3xl text-off-white uppercase mb-3">
                  {tier.title}
                </h3>

                <p className="text-muted text-sm mb-6 leading-relaxed">
                  {tier.description}
                </p>

                {/* Deliverables List */}
                <div className="space-y-2.5 font-mono text-xs mb-8">
                  <div className="text-acid font-bold uppercase mb-2">// INCLUDED DELIVERABLES</div>
                  {tier.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-off-white/90">
                      <Check className="w-4 h-4 text-acid shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs text-muted">IDEAL FOR: <strong className="text-off-white">{tier.idealFor}</strong></span>
                <a
                  href="#contact"
                  onClick={() => soundEngine.playCutSound()}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-acid font-bold hover:underline"
                >
                  <span>GET QUOTE ↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
