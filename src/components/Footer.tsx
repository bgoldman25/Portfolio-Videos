import React from 'react';
import { ArrowUp, Radio } from 'lucide-react';
import { SITE } from '../data/site';

export const Footer: React.FC = () => (
  <footer className="relative bg-dark border-t border-white/10 py-14 px-4 md:px-6 font-mono text-xs text-muted">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between gap-10 pb-10 border-b border-white/10">
        <div className="max-w-md">
          <div className="flex items-center gap-2 text-acid mb-3"><Radio className="w-4 h-4 animate-pulse" /><span>SEQUENCE COMPLETE</span></div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight">Baltazar<br /><span className="text-acid">Goldman</span></h2>
        </div>
        <div className="flex gap-12">
          <nav aria-label="Footer navigation" className="space-y-2.5 flex flex-col"><span className="text-acid font-bold uppercase tracking-wider">Navigate</span><a href="#work" className="inline-block py-1.5 hover:text-acid">Work</a><a href="#process" className="inline-block py-1.5 hover:text-acid">Process</a><a href="#services" className="inline-block py-1.5 hover:text-acid">Services</a><a href="#about" className="inline-block py-1.5 hover:text-acid">About</a></nav>
          <nav aria-label="Footer booking and contact" className="space-y-2.5 flex flex-col"><span className="text-acid font-bold uppercase tracking-wider">Book</span><a href="#book" className="inline-block py-1.5 hover:text-acid">Discovery call</a><a href="#contact" className="inline-block py-1.5 hover:text-acid">Project brief</a><a href={`mailto:${SITE.email}`} className="inline-block py-1.5 hover:text-acid">{SITE.email}</a></nav>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="self-start p-3 rounded-full border border-white/40 text-white hover:text-acid hover:border-acid transition-colors"><ArrowUp className="w-5 h-5" /></button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 text-[11px]"><span>© {new Date().getFullYear()} Baltazar Goldman. All rights reserved.</span></div>
    </div>
  </footer>
);
