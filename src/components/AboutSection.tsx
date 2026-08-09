import React from 'react';
import { Sparkles, Video, Flame, Zap } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export const AboutSection: React.FC = () => {
  return (
    <section className="relative py-24 px-4 md:px-8 bg-charcoal border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Portrait & Editing Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black group">
              <img
                src="/images/profilepicture.jpg"
                alt="Baltazar Goldman Video Editor"
                className="w-full h-full object-cover filter contrast-115 grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 bg-acid text-dark font-mono font-bold text-xs px-3 py-1 rounded">
                BALTAZAR GOLDMAN
              </div>

              <div className="absolute bottom-6 left-6 right-6 font-mono text-xs text-off-white space-y-1">
                <div className="text-acid font-bold">[ FREELANCE EDITOR ]</div>
                <div className="text-muted">LOCATION: REMOTE // GLOBAL CLIENTS</div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Identity */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs rounded">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE PERSON BEHIND THE TIMELINE</span>
            </div>

            <h2 className="font-display font-black text-5xl sm:text-7xl text-off-white uppercase leading-none">
              I LIKE CUTTING <br />
              <span className="text-acid">THINGS.</span>
            </h2>

            <p className="font-display font-bold text-2xl text-off-white leading-snug">
              I'm Baltazar, a freelance video editor who cares way too much about pacing, timing, and making a video hit exactly when it should.
            </p>

            <p className="text-muted text-base leading-relaxed font-sans">
              I don't treat editing as just arranging clips on a timeline. I view every edit as a battle for audience attention. Whether it's a 45-minute deep-dive YouTube documentary, an intense gaming breakdown, or a high-velocity 9:16 mobile reel, my focus is delivering high retention through intentional narrative structure.
            </p>

            {/* Personality Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono text-xs">
              <div className="p-4 bg-dark/80 border border-white/10 rounded-lg space-y-2">
                <Flame className="w-5 h-5 text-acid" />
                <div className="text-acid font-bold uppercase">CONFIDENT</div>
                <div className="text-off-white/80">"Give me the raw footage. I'll figure it out."</div>
              </div>

              <div className="p-4 bg-dark/80 border border-white/10 rounded-lg space-y-2">
                <Zap className="w-5 h-5 text-acid" />
                <div className="text-acid font-bold uppercase">INTERNET-NATIVE</div>
                <div className="text-off-white/80">"40 hours of footage and a deadline that should've been illegal."</div>
              </div>

              <div className="p-4 bg-dark/80 border border-white/10 rounded-lg space-y-2">
                <Video className="w-5 h-5 text-acid" />
                <div className="text-acid font-bold uppercase">OBSESSIVE</div>
                <div className="text-off-white/80">"I care about the half-second before the joke lands."</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
