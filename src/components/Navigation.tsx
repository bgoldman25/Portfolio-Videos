import React, { useState } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { useLiveTimecode } from '../utils/performance';

interface NavigationProps {
  onReplayIntro?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onReplayIntro }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const timecode = useLiveTimecode();

  const toggleSound = () => {
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);
    soundEngine.setMuted(!nextState);
    if (nextState) {
      soundEngine.playCutSound();
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-dark/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Brand & Identity */}
      <div className="flex items-center gap-4">
        <a href="#" className="group flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-acid rounded-full animate-pulse" />
          <span className="font-display font-black tracking-wider text-sm md:text-base text-off-white group-hover:text-acid transition-colors uppercase">
            BALTAZAR GOLDMAN
          </span>
        </a>
        <span className="hidden sm:inline-block text-xs font-mono text-muted border-l border-white/10 pl-3">
          TIMELINE // EDITING ROOM
        </span>
      </div>

      {/* Center Live Timecode */}
      <div className="hidden lg:flex items-center gap-2 bg-charcoal/80 border border-white/10 px-3 py-1 rounded text-xs font-mono text-acid">
        <Radio className="w-3 h-3 text-acid animate-pulse" />
        <span>REC</span>
        <span className="text-off-white font-bold ml-1">{timecode}</span>
      </div>

      {/* Right Controls & Nav Links */}
      <div className="flex items-center gap-4 sm:gap-6">
        <nav className="hidden md:flex items-center gap-5 text-xs font-mono tracking-wide text-muted">
          <a 
            href="#work" 
            onClick={() => soundEngine.playHoverSound()}
            className="hover:text-acid transition-colors"
          >
            [01 WORK]
          </a>
          <a 
            href="#process" 
            onClick={() => soundEngine.playHoverSound()}
            className="hover:text-acid transition-colors"
          >
            [02 PROCESS]
          </a>
          <a 
            href="#skills" 
            onClick={() => soundEngine.playHoverSound()}
            className="hover:text-acid transition-colors"
          >
            [03 SKILLS]
          </a>
          <a 
            href="#contact" 
            onClick={() => soundEngine.playHoverSound()}
            className="hover:text-acid transition-colors"
          >
            [04 CONTACT]
          </a>
        </nav>

        {/* Audio Toggle Button */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all border ${
            isAudioEnabled
              ? 'bg-acid/10 border-acid text-acid shadow-[0_0_12px_rgba(183,255,0,0.2)]'
              : 'bg-surface border-white/10 text-muted hover:border-white/30 hover:text-off-white'
          }`}
          title="Toggle Post-Production Sound Design"
        >
          {isAudioEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-acid" />
              <span className="font-bold">SOUND ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-muted" />
              <span>SOUND OFF</span>
            </>
          )}
        </button>

        {/* Intro Replay Button */}
        {onReplayIntro && (
          <button
            onClick={() => {
              soundEngine.playCutSound();
              onReplayIntro();
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted hover:text-acid transition-colors"
            title="Replay Cinematic Cold Open"
          >
            <span>REPLAY INTRO ↗</span>
          </button>
        )}
      </div>
    </header>
  );
};
