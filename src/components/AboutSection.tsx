import React from 'react';
import { Sparkles, Flame, Zap, Video, Calendar, Clock } from 'lucide-react';
import { SITE } from '../data/site';
import { usePrefersReducedMotion } from '../utils/performance';

export const AboutSection: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion();
  return <AboutContent reduceMotion={reduceMotion} />;
};

const AboutContent: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => (
  <section id="about" className="relative py-20 md:py-28 px-4 md:px-6 bg-charcoal border-t border-white/10 overflow-hidden scroll-mt-20">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-5 relative">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 bg-black group">
          <img src="/images/profilepicture.jpg" alt="Portrait of Baltazar Goldman, freelance video editor" width={800} height={1000} decoding="async" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 font-mono text-xs space-y-1"><div className="text-acid font-bold">[ FREELANCE EDITOR ]</div><div className="text-white/90">REMOTE / WORLDWIDE · {SITE.timezone}</div></div>
        </div>
      </div>
      <div className="lg:col-span-7">
        <span className="inline-flex items-center gap-2 px-3 py-1 text-acid font-mono text-xs"><Sparkles className="w-3.5 h-3.5" />[ THE PERSON BEHIND THE TIMELINE ]</span>
        <h2 className="font-display font-black text-5xl md:text-6xl uppercase leading-[0.95] mt-4">I like cutting<br /><span className="text-acid">things.</span></h2>
        <p className="font-display font-bold text-xl md:text-2xl mt-5 leading-snug">I'm Baltazar — I care way too much about pacing, timing, and making a video hit exactly when it should.</p>
        <p className="text-muted leading-relaxed mt-4">Every edit is a battle for attention. From 45-minute YouTube documentaries to 9:16 verticals, the goal is the same: keep people watching, feeling, and sharing.</p>
        <div className="grid sm:grid-cols-3 gap-3 mt-7 font-mono text-xs">
          {[{ icon: Flame, t: 'CONFIDENT', d: 'Give me the raw footage. I will figure it out.' }, { icon: Zap, t: 'INTERNET-NATIVE', d: '40 hours of footage and a deadline that should have been illegal.' }, { icon: Video, t: 'OBSESSIVE', d: 'I care about the half-second before the joke lands.' }].map((c) => <div key={c.t} className="p-4 bg-dark/80 border border-white/10 rounded-xl space-y-2"><c.icon className="w-5 h-5 text-acid" /><div className="text-acid font-bold uppercase">{c.t}</div><div className="text-off-white/80 leading-relaxed">"{c.d}"</div></div>)}
        </div>
        <div className="mt-6 p-5 rounded-2xl bg-dark border border-acid/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 bg-acid rounded-full animate-pulse" /><div><div className="font-bold text-sm">{SITE.availability.label}</div><div className="font-mono text-xs text-muted flex items-center gap-1.5 mt-1"><Clock className="w-3.5 h-3.5" />{SITE.responseTime}</div></div></div>
          <a href="#book" className="inline-flex items-center gap-2 px-4 py-2.5 bg-acid text-black font-bold rounded-full text-sm hover:bg-white transition-colors"><Calendar className="w-4 h-4" />Book a call</a>
        </div>
      </div>
    </div>
  </section>
);
