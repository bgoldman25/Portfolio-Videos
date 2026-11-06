import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import { SITE } from '../data/site';

export const BookingSection: React.FC = () => {
  const hasRealBooking = !SITE.bookingUrl.includes('PASTE_YOUR');
  const hasEmbed = !!SITE.bookingEmbedUrl;
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent('Discovery Call Booking Request — Baltazar Goldman')}`;
  return (
    <section id="book" scroll-mt-20 className="relative py-20 md:py-28 px-4 md:px-8 bg-charcoal border-y border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-acid mb-4"><span className="w-2 h-2 bg-acid rounded-full animate-pulse" /><span>[ AVAILABLE // DISCOVERY CALL ]</span></div>
              <h2 className="font-display font-black text-5xl md:text-6xl uppercase tracking-tight leading-[0.95]">Book a<br /><span className="text-acid">free call.</span></h2>
              <p className="text-muted mt-4 leading-relaxed">A 30-minute discovery call to scope your project, timeline, and retention goals. No commitment — you'll leave with a clear edit plan whether we work together or not.</p>
              <ul className="mt-6 space-y-3 text-sm text-off-white/90">
                {['Fit check: content type, audience & turnaround', 'Retention audit of your channel + 2 competitor edits', 'Fixed-scope quote in writing within 24h'].map((t) => (
                  <li key={t} className="flex gap-2.5"><CheckCircle2 className="w-5 h-5 text-acid shrink-0 mt-0.5" /><span>{t}</span></li>
                ))}
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-dark border border-white/10"><div className="flex items-center gap-1.5 text-muted mb-1"><Clock className="w-4 h-4 text-acid" />RESPONSE</div><div className="text-off-white font-semibold">{SITE.responseTime}</div></div>
                <div className="p-3.5 rounded-xl bg-dark border border-white/10"><div className="flex items-center gap-1.5 text-muted mb-1"><Video className="w-4 h-4 text-acid" />FORMAT</div><div className="text-off-white font-semibold">30 min · Google Meet</div></div>
              </div>
              <p className="mt-4 text-xs font-mono text-muted flex items-center gap-2"><Calendar className="w-4 h-4" />Timezone: {SITE.timezone} — calendar auto-converts to your local time.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={hasRealBooking ? SITE.bookingUrl : mailto} target={hasRealBooking ? '_blank' : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-acid text-black font-bold rounded-full hover:bg-white transition-colors"><Sparkles className="w-4 h-4" /> {hasRealBooking ? 'Open booking calendar' : 'Request call by email'} <ExternalLink className="w-4 h-4" /></a>
              <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 rounded-full font-semibold hover:border-acid hover:text-acid transition-colors">Skip to form</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-7 bg-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 font-mono text-xs"><span className="flex items-center gap-2 text-muted"><span className="w-2 h-2 rounded-full bg-acid animate-pulse" /> Google Calendar — Appointments</span><span className="text-acid">{SITE.availability.label}</span></div>
            {hasEmbed ? (
              <iframe title="Book a discovery call" src={SITE.bookingEmbedUrl} className="w-full flex-1 min-h-[540px] bg-white" loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
            ) : (
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-center gap-6">
                <div className="grid sm:grid-cols-3 gap-3">
                  {['1 · Pick a time', '2 · Get Meet link', '3 · Bring your footage goal'].map((s) => <div key={s} className="p-4 rounded-xl bg-surface border border-white/10 text-sm font-medium">{s}</div>)}
                </div>
                <p className="text-sm text-muted leading-relaxed">The live Google Calendar scheduler embeds here once connected. Until then, use email booking — I confirm within 24h and send the Meet link.</p>
                
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
