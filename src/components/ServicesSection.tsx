import React from 'react';
import { Check, Film, Smartphone, Star } from 'lucide-react';
import { SERVICE_TIERS } from '../data/projects';

export const ServicesSection: React.FC = () => (
  <section id="services" className="relative py-20 md:py-28 px-4 md:px-6 bg-dark scroll-mt-20">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div><div className="flex items-center gap-2 text-xs font-mono text-acid mb-2"><Film className="w-4 h-4" /><span>[ 03 // SERVICES ]</span></div><h2 className="font-display font-black text-5xl md:text-6xl uppercase tracking-tight">Services & <span className="text-acid">offerings</span></h2></div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {SERVICE_TIERS.map((tier) => (
          <article key={tier.id} className={`relative p-7 md:p-8 rounded-2xl border flex flex-col ${tier.popular ? 'bg-charcoal border-acid/50 shadow-[0_0_35px_rgba(183,255,0,0.12)]' : 'bg-surface/70 border-white/10'}`}>
            {tier.popular && <span className="absolute top-0 right-6 -translate-y-1/2 inline-flex items-center gap-1 bg-acid text-black font-mono text-[10px] font-black px-3 py-1 rounded-full"><Star className="w-3 h-3" /> MOST BOOKED</span>}
            <div className="flex items-center gap-2 font-mono text-xs text-acid mb-3">{tier.category === 'SHORT FORM' ? <Smartphone className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}<span>[{tier.category} — {tier.tier}]</span></div>
            <h3 className="font-display font-black text-2xl md:text-3xl uppercase mb-2.5">{tier.title}</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">{tier.description}</p>
            <div className="space-y-2.5 text-sm mb-7 flex-1">{tier.deliverables.map((d) => <div key={d} className="flex gap-2.5"><Check className="w-4 h-4 text-acid shrink-0 mt-0.5" /><span className="text-off-white/90">{d}</span></div>)}</div>
            <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 md:min-h-[6rem]">
              <span className="font-mono text-xs text-muted">IDEAL FOR <strong className="text-off-white">{tier.idealFor}</strong></span>
              <a href="#contact" className="inline-block py-1.5 font-mono text-xs text-acid font-bold hover:underline">GET A QUOTE →</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
