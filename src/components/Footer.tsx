import React from 'react';
import { ArrowUp, Radio } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundEngine.playCutSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark border-t border-white/10 py-16 px-4 md:px-8 font-mono text-xs text-muted">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/10 pb-12">
          {/* Brand & Identity */}
          <div>
            <div className="flex items-center gap-2 text-acid mb-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>SEQUENCE COMPLETE</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-off-white uppercase tracking-tight">
              BALTAZAR <span className="text-acid">GOLDMAN</span>
            </h2>
            <div className="text-muted mt-1">[ FREELANCE VIDEO EDITOR ]</div>
          </div>

          {/* Quick Contact & Scroll Top */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              onClick={() => soundEngine.playHoverSound()}
              className="px-6 py-3 bg-acid text-dark font-display font-black text-sm rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(183,255,0,0.3)] uppercase"
            >
              LET'S MAKE SOMETHING ↗
            </a>

            <button
              onClick={scrollToTop}
              className="p-3 bg-charcoal border border-white/15 rounded text-off-white hover:text-acid hover:border-acid transition-all"
              title="Return to timeline start"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-muted text-[11px]">
          <div>
            © {new Date().getFullYear()} BALTAZAR GOLDMAN. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>STORYTELLING</span>
            <span>•</span>
            <span>PACING</span>
            <span>•</span>
            <span>RETENTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
