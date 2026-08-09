import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../services/soundEngine';

interface ColdOpenProps {
  onComplete: () => void;
}

const FOOTAGE_FRAMES = [
  {
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    type: 'TALKING HEAD',
    word: 'CUT.'
  },
  {
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    type: 'GAMING ANALYSIS',
    word: 'PACE.'
  },
  {
    url: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80',
    type: '9:16 VERTICAL REEL',
    word: 'TIMING.'
  },
  {
    url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    type: 'MOTION GRAPHICS',
    word: 'STORY.'
  },
  {
    url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
    type: 'RETENTION EDIT',
    word: 'IMPACT.'
  }
];

export const ColdOpen: React.FC<ColdOpenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'waiting' | 'initial' | 'rapid-cuts' | 'freeze' | 'title' | 'done'>('waiting');
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [timecodeText, setTimecodeText] = useState('00:00:00:00');

  // User clicks/taps anywhere on the cold open screen → unlock audio + start sequence
  const handleBegin = useCallback(async () => {
    if (stage !== 'waiting') return;

    // This click IS the user gesture — unlock audio first
    await soundEngine.unlockAudio();

    // Now fire the riser (AudioContext is guaranteed resumed)
    soundEngine.playHeroRiserSound();

    // Transition to the flickering timecode stage
    setStage('initial');
  }, [stage]);

  // Stage: initial → rapid-cuts (timecode flicker for ~1.8s then cut sequence)
  useEffect(() => {
    if (stage !== 'initial') return;

    // Initialize timecode state for proper 60fps counting
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let frames = 0;

    const timecodeInterval = setInterval(() => {
      frames++;
      if (frames >= 60) {
        frames = 0;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
      }
      const timecode = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
      setTimecodeText(timecode);
    }, 1000 / 60); // 60fps = ~16.67ms per frame

    const initialTimer = setTimeout(() => {
      clearInterval(timecodeInterval);
      setStage('rapid-cuts');
    }, 1800);

    return () => {
      clearInterval(timecodeInterval);
      clearTimeout(initialTimer);
    };
  }, [stage]);

  // Stage: rapid-cuts → freeze → title
  useEffect(() => {
    if (stage !== 'rapid-cuts') return;

    let index = 0;
    const cutIntervals = [600, 500, 380, 280, 200, 150, 120, 90, 80];
    let intervalIndex = 0;

    const runCutSequence = () => {
      if (intervalIndex >= cutIntervals.length) {
        soundEngine.playImpactSound();
        setStage('freeze');
        setTimeout(() => {
          setStage('title');
        }, 1200);
        return;
      }

      index = (index + 1) % FOOTAGE_FRAMES.length;
      setCurrentFrameIndex(index);
      soundEngine.playCutSound();
      intervalIndex++;

      setTimeout(runCutSequence, cutIntervals[intervalIndex] || 100);
    };

    runCutSequence();
  }, [stage]);

  // Stage: title → done
  useEffect(() => {
    if (stage !== 'title') return;

    soundEngine.playImpactSound();
    const titleTimer = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 3500);

    return () => clearTimeout(titleTimer);
  }, [stage, onComplete]);

  const handleSkip = () => {
    soundEngine.unlockAudio();
    soundEngine.playCutSound();
    setStage('done');
    onComplete();
  };

  const currentFrame = FOOTAGE_FRAMES[currentFrameIndex];

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="cold-open-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-50 bg-dark flex flex-col items-center justify-center overflow-hidden select-none"
          onClick={stage === 'waiting' ? handleBegin : undefined}
          style={stage === 'waiting' ? { cursor: 'pointer' } : undefined}
        >
          {/* Skip Intro Button — visible after sequence starts */}
          {stage !== 'waiting' && (
            <button
              onClick={handleSkip}
              className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-charcoal/80 border border-white/20 rounded text-xs font-mono text-muted hover:text-acid hover:border-acid transition-all"
            >
              <span>SKIP INTRO</span>
              <span>↗</span>
            </button>
          )}

          {/* Stage 0: Waiting for user gesture — cinematic "press play" gate */}
          {stage === 'waiting' && (
            <div className="flex flex-col items-center gap-6">
              {/* Pulsing record dot */}
              <div className="w-3 h-3 bg-acid rounded-full animate-pulse" />

              {/* Static timecode */}
              <div className="font-mono text-2xl md:text-4xl text-acid/60 tracking-widest font-bold">
                00:00:00:00
              </div>

              {/* Call to action */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 border-2 border-acid/50 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-0 h-0 border-l-[10px] border-l-acid border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                </div>
                <span className="text-xs font-mono text-muted tracking-[0.3em] uppercase">
                  [ CLICK ANYWHERE TO BEGIN ]
                </span>
              </motion.div>

              {/* Skip option even before starting */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip();
                }}
                className="mt-4 text-xs font-mono text-muted/50 hover:text-acid transition-colors tracking-wider"
              >
                SKIP INTRO ↗
              </button>
            </div>
          )}

          {/* Stage 1: Initial Darkness with Timecode Flicker */}
          {stage === 'initial' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-3 h-3 bg-acid rounded-full animate-flicker" />
              <div className="font-mono text-2xl md:text-4xl text-acid tracking-widest animate-pulse font-bold">
                {timecodeText}
              </div>
              <div className="text-xs font-mono text-muted tracking-widest uppercase">
                [ INITIALIZING TIMELINE ]
              </div>
            </div>
          )}

          {/* Stage 2: Rapid Cuts Sequence */}
          {stage === 'rapid-cuts' && currentFrame && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Background Footage Frame */}
              <img
                src={currentFrame.url}
                alt={currentFrame.type}
                className="absolute inset-0 w-full h-full object-cover opacity-65 scale-105 filter grayscale contrast-125"
              />

              {/* Grid / Frame Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark opacity-90" />
              <div className="absolute inset-0 border-[16px] md:border-[32px] border-dark/80 pointer-events-none" />

              {/* Post-Production Frame Metadata */}
              <div className="absolute top-8 left-8 font-mono text-xs text-acid bg-dark/80 border border-acid/40 px-3 py-1">
                REC ● {currentFrame.type}
              </div>
              <div className="absolute bottom-8 left-8 font-mono text-xs text-off-white/70">
                SEQUENCE_01 // FRAME 0248
              </div>

              {/* Massive Typographic Word Impact */}
              <motion.h1
                key={currentFrame.word}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.08 }}
                className="relative z-10 font-display font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter text-acid drop-shadow-[0_0_35px_rgba(183,255,0,0.6)]"
              >
                {currentFrame.word}
              </motion.h1>
            </div>
          )}

          {/* Stage 3: Silence & Black Screen Freeze */}
          {stage === 'freeze' && (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 bg-acid rounded-full animate-ping" />
            </div>
          )}

          {/* Stage 4: Massive Title Drop */}
          {stage === 'title' && (
            <div className="relative z-10 max-w-5xl px-6 text-center flex flex-col items-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs rounded"
              >
                <span className="w-2 h-2 bg-acid rounded-full animate-pulse" />
                <span>SEQUENCE READY</span>
              </motion.div>

              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-5xl sm:text-7xl md:text-9xl tracking-tight text-off-white uppercase leading-none mb-6"
              >
                BALTAZAR <br />
                <span className="text-acid">GOLDMAN</span>
              </motion.h1>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-3 font-mono text-sm md:text-base text-muted tracking-wider"
              >
                <span className="text-acid font-bold">[ VIDEO EDITOR ]</span>
                <span className="hidden sm:inline-block">•</span>
                <span>CUTTING STORIES. BUILDING MOMENTUM.</span>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
