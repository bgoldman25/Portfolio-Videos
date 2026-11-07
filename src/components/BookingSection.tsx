import React from 'react';
import { motion } from 'framer-motion';
import Cal from '@calcom/embed-react';
import { Clock, Video, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import { SITE } from '../data/site';
import { usePrefersReducedMotion, motionTiming } from '../utils/performance';

export const BookingSection: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion();
  const configured = SITE.calcom.configured;
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent('Discovery Call Booking Request — Baltazar Goldman')}`;
  return (
    <section id="book" className="relative py-20 md:py-28 px-4 md:px-8 bg-charcoal border-y border-white/10 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-4 flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-acid mb-4"><span>[ AVAILABLE // DISCOVERY CALL ]</span></div>
              <h2 className="font-display font-black text-5xl md:text-6xl uppercase tracking-tight leading-[0.95]">Book a<br /><span className="text-acid">free call.</span></h2>
              <p className="text-muted mt-4 leading-relaxed">A 60-minute discovery call to scope your project, timeline, and retention goals. No commitment — you'll leave with a clear edit plan whether we work together or not.</p>
              <ul className="mt-6 space-y-3 text-sm text-off-white/90">
                {['Fit check: content type, audience & turnaround', 'Retention audit of your channel + 2 competitor edits', 'Fixed-scope quote in writing within 24h'].map((t) => (
                  <li key={t} className="flex gap-2.5"><CheckCircle2 className="w-5 h-5 text-acid shrink-0 mt-0.5" /><span>{t}</span></li>
                ))}
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-dark border border-white/10"><div className="flex items-center gap-1.5 text-muted mb-1"><Clock className="w-4 h-4 text-acid" />RESPONSE</div><div className="text-off-white font-semibold">{SITE.responseTime}</div></div>
                <div className="p-3.5 rounded-xl bg-dark border border-white/10"><div className="flex items-center gap-1.5 text-muted mb-1"><Video className="w-4 h-4 text-acid" />FORMAT</div><div className="text-off-white font-semibold">60 min · Google Meet</div></div>
              </div>
            </div>
            {!configured && (
              <a href={mailto} className="inline-flex items-center gap-2 px-5 py-3 bg-acid text-black font-bold rounded-full hover:bg-white transition-colors"><Sparkles className="w-4 h-4" /> Request call by email <ExternalLink className="w-4 h-4" /></a>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={motionTiming(reduceMotion, { duration: 0.5, delay: 0.1 })} className="lg:col-span-8 bg-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[560px] md:h-[600px] lg:h-[660px]">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10 font-mono text-xs">
              <span className="flex items-center gap-2 text-muted"><span className="w-2 h-2 rounded-full bg-acid animate-pulse" /> Discovery call — 60 min · Google Meet</span>
              <span className="text-acid whitespace-nowrap">{configured ? SITE.availability.label : 'EMAIL BOOKING'}</span>
            </div>
            {configured ? (
              <div className="cal-embed-fit flex-1 min-h-0 overflow-hidden">
                <Cal
                  calLink={SITE.calcom.link}
                  config={{ theme: 'dark', layout: 'month_view', hideEventTypeDetails: 'true' }}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ) : (
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-center gap-6">
                <div className="grid sm:grid-cols-3 gap-3">
                  {['1 · Pick a time', '2 · Get Meet link', '3 · Bring your footage goal'].map((s) => <div key={s} className="p-4 rounded-xl bg-surface border border-white/10 text-sm font-medium">{s}</div>)}
                </div>
                <p className="text-sm text-muted leading-relaxed">Live scheduling is being connected. Until then, request a time by email — I confirm within 24h and send the Meet link.</p>
                <a href={mailto} className="inline-flex w-fit items-center gap-2 px-5 py-3 bg-acid text-black font-bold rounded-full hover:bg-white transition-colors"><Sparkles className="w-4 h-4" /> Request times by email</a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
