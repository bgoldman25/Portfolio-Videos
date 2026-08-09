import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Loader2, Link as LinkIcon, Film } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Long Form — Premium',
    description: '',
    referenceUrls: ''
  });

  const [status, setStatus] = useState<'idle' | 'preparing' | 'processing' | 'exporting' | 'submitted'>('idle');
  const [exportProgress, setExportProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    soundEngine.playCutSound();
    setStatus('preparing');

    // Simulate post-production export animation sequence
    setTimeout(() => {
      setStatus('processing');
    }, 800);

    setTimeout(() => {
      setStatus('exporting');
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setExportProgress(progress);
        soundEngine.playScrubSound();

        if (progress >= 100) {
          clearInterval(interval);
          soundEngine.playExportBeep();
          setStatus('submitted');
        }
      }, 120);
    }, 1600);
  };

  return (
    <section id="contact" className="relative py-24 px-4 md:px-8 bg-dark border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs rounded mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>[ INITIALIZE NEW PROJECT // SEQUENCE 06 ]</span>
          </div>

          <h2 className="font-display font-black text-5xl sm:text-7xl text-off-white uppercase tracking-tight">
            LET'S MAKE <span className="text-acid">SOMETHING.</span>
          </h2>
          <p className="text-muted font-mono text-sm mt-3">
            Have raw footage, a YouTube channel, or a brand campaign? Fill out the project spec below.
          </p>
        </div>

        {/* Interactive Form / Export Animation Canvas */}
        <div className="bg-charcoal border border-white/15 rounded-xl p-6 sm:p-10 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.form
                key="contact-form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2 font-mono text-xs">
                    <label className="text-acid font-bold uppercase flex items-center gap-1.5">
                      <span>NAME</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-dark border border-white/10 rounded text-off-white placeholder:text-muted/50 focus:border-acid focus:outline-none transition-colors text-sm font-sans"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2 font-mono text-xs">
                    <label className="text-acid font-bold uppercase flex items-center gap-1.5">
                      <span>EMAIL ADDRESS</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@creator.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-dark border border-white/10 rounded text-off-white placeholder:text-muted/50 focus:border-acid focus:outline-none transition-colors text-sm font-sans"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div className="space-y-2 font-mono text-xs">
                  <label className="text-acid font-bold uppercase">PROJECT TYPE</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded text-off-white focus:border-acid focus:outline-none transition-colors text-sm font-sans cursor-pointer"
                  >
                    <option value="Long Form — Standard">Long Form — Standard (YouTube / Commentary / Gaming)</option>
                    <option value="Long Form — Premium">Long Form — Premium (Cinematic Doc / Flagship YouTube)</option>
                    <option value="Short Form — Standard">Short Form — Standard (Reels / Shorts / TikTok)</option>
                    <option value="Short Form — Premium">Short Form — Premium (Viral Mobile High-Energy)</option>
                    <option value="Other / Custom Campaign">Other / Custom Post-Production Campaign</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2 font-mono text-xs">
                  <label className="text-acid font-bold uppercase">PROJECT DESCRIPTION</label>
                  <textarea
                    rows={4}
                    placeholder="Tell me about the video goal, raw footage length, target audience, and desired turnaround timeline..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded text-off-white placeholder:text-muted/50 focus:border-acid focus:outline-none transition-colors text-sm font-sans"
                  />
                </div>

                {/* Reference Video Links */}
                <div className="space-y-2 font-mono text-xs">
                  <label className="text-acid font-bold uppercase flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>REFERENCE VIDEO URLS (OPTIONAL)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=... (Paste reference edit styles)"
                    value={formData.referenceUrls}
                    onChange={(e) => setFormData({ ...formData, referenceUrls: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded text-off-white placeholder:text-muted/50 focus:border-acid focus:outline-none transition-colors text-sm font-sans"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={() => soundEngine.playCutSound()}
                  className="w-full py-4 bg-acid text-dark font-display font-black text-lg tracking-wider rounded uppercase hover:bg-white transition-all shadow-[0_0_25px_rgba(183,255,0,0.3)] flex items-center justify-center gap-2"
                >
                  <span>SEND INQUIRY</span>
                  <Send className="w-5 h-5" />
                </button>
              </motion.form>
            )}

            {/* Export Animation States */}
            {(status === 'preparing' || status === 'processing' || status === 'exporting') && (
              <motion.div
                key="exporting-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center space-y-6 font-mono"
              >
                <div className="w-16 h-16 mx-auto rounded-full border-4 border-acid border-t-transparent animate-spin flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-acid" />
                </div>

                <div className="space-y-2">
                  <div className="text-acid font-bold text-lg uppercase tracking-widest">
                    {status === 'preparing' && 'PREPARING PROJECT SPEC...'}
                    {status === 'processing' && 'PROCESSING RENDER PIPELINE...'}
                    {status === 'exporting' && `EXPORTING PROJECT DATA... ${exportProgress}%`}
                  </div>

                  {/* Render Bar */}
                  <div className="w-full max-w-md mx-auto h-3 bg-dark border border-white/15 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${status === 'exporting' ? exportProgress : status === 'processing' ? 50 : 20}%` }}
                      className="h-full bg-acid transition-all duration-200"
                    />
                  </div>

                  <div className="text-muted text-xs">SEQUENCE: PROJECT_INQUIRY_SUBMIT.XML</div>
                </div>
              </motion.div>
            )}

            {/* Final Export Received Success Message */}
            {status === 'submitted' && (
              <motion.div
                key="submitted-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <CheckCircle2 className="w-20 h-20 text-acid mx-auto shadow-[0_0_30px_rgba(183,255,0,0.5)] rounded-full p-2" />

                <div className="space-y-3">
                  <h3 className="font-display font-black text-4xl sm:text-5xl text-off-white uppercase">
                    PROJECT <span className="text-acid">RECEIVED.</span>
                  </h3>
                  <p className="text-off-white/90 text-base max-w-md mx-auto font-sans">
                    Thanks <strong className="text-acid">{formData.name}</strong>! Your project spec has been successfully exported. Baltazar will review your details and reach out shortly.
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playCutSound();
                    setStatus('idle');
                  }}
                  className="px-6 py-2.5 bg-dark border border-acid/50 text-acid font-mono text-xs rounded hover:bg-acid hover:text-dark transition-all"
                >
                  [ SUBMIT ANOTHER SPEC ]
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
