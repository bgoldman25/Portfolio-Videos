import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Film, AlertCircle } from 'lucide-react';
import { SITE } from '../data/site';

const SERVICE_OPTIONS = ['Long Form — Standard', 'Long Form — Premium', 'Short Form — Standard', 'Short Form — Premium', 'Other / Custom Campaign'];
const TIMELINES = ['ASAP (< 1 week)', 'This month', 'Flexible', 'Ongoing retainer'];
const BUDGETS = ['Under $500', '$500 – $1,500', '$1,500 – $4,000', '$4,000+', 'Prefer to discuss'];

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', service: SERVICE_OPTIONS[1], timeline: TIMELINES[1], budget: BUDGETS[1], description: '', referenceUrls: '', honeypot: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    if (!form.name.trim() || !form.email.includes('@')) { setError('Please add your name and a valid email.'); return; }
    if (form.description.trim().length < 20) { setError('Tell me a little more (2–3 sentences) so I can quote accurately.'); return; }
    setError(''); setStatus('sending');
    const hasFormspree = SITE.formspreeId && !SITE.formspreeId.includes('YOUR_');
    try {
      if (hasFormspree) {
        const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, service: form.service, timeline: form.timeline, budget: form.budget, description: form.description, referenceUrls: form.referenceUrls }) });
        if (!res.ok) throw new Error('formspree failed');
        setStatus('sent');
      } else {
        // Graceful fallback: open mail client with pre-filled brief
        const subject = encodeURIComponent(`Project Inquiry — ${form.service} — ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\nTimeline: ${form.timeline}\nBudget: ${form.budget}\n\n${form.description}\n\nReferences: ${form.referenceUrls || '—'}`);
        window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
        setStatus('sent');
      }
    } catch { setStatus('error'); setError('Could not send — please email directly: ' + SITE.email); }
  };

  return (
    <section id="contact" className="relative py-20 md:py-28 px-4 md:px-6 bg-dark border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs rounded-full mb-3"><Film className="w-3.5 h-3.5" /> PROJECT INQUIRY</div>
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tight">Let's make <span className="text-acid">something.</span></h2>
          <p className="text-muted font-mono text-sm mt-3">Raw footage, a channel, or a campaign — send the brief. I reply inside 24h with next steps.</p>
        </div>
        <div className="bg-charcoal border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-acid mx-auto" />
                <h3 className="font-display font-black text-4xl uppercase">Project <span className="text-acid">received.</span></h3>
                <p className="text-muted max-w-md mx-auto">Thanks <strong className="text-off-white">{form.name}</strong> — your brief is in. Expect a reply within 24h with a scoped quote.</p>
                <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', service: SERVICE_OPTIONS[1], timeline: TIMELINES[1], budget: BUDGETS[1], description: '', referenceUrls: '', honeypot: '' }); }} className="px-5 py-2.5 border border-acid/50 text-acid font-mono text-xs rounded-full hover:bg-acid hover:text-black transition-colors">Send another brief</button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Name *</span><input required maxLength={80} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Alex Rivera" className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl focus:border-acid outline-none text-sm" autoComplete="name" /></label>
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Email *</span><input type="email" required maxLength={120} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="alex@creator.com" className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl focus:border-acid outline-none text-sm" autoComplete="email" /></label>
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Service</span><select value={form.service} onChange={(e) => set('service', e.target.value)} className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-sm focus:border-acid outline-none">{SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></label>
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Timeline</span><select value={form.timeline} onChange={(e) => set('timeline', e.target.value)} className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-sm focus:border-acid outline-none">{TIMELINES.map((o) => <option key={o}>{o}</option>)}</select></label>
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Budget</span><select value={form.budget} onChange={(e) => set('budget', e.target.value)} className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-sm focus:border-acid outline-none">{BUDGETS.map((o) => <option key={o}>{o}</option>)}</select></label>
                </div>
                <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Project brief *</span><textarea rows={4} required minLength={20} maxLength={2000} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Video goal, raw footage length, audience, turnaround…" className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl focus:border-acid outline-none text-sm" /><span className="block text-xs font-mono text-muted">{form.description.length} / 20 min characters</span></label>
                <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Reference edit (optional)</span><input value={form.referenceUrls} onChange={(e) => set('referenceUrls', e.target.value)} placeholder="https://youtube.com/watch?v=…" className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl focus:border-acid outline-none text-sm" /></label>
                <input type="text" value={form.honeypot} onChange={(e) => set('honeypot', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" />
                {error && <p role="alert" className="flex items-center gap-2 text-sm text-red-400 font-mono"><AlertCircle className="w-4 h-4" />{error}</p>}
                <button type="submit" disabled={status === 'sending'} className="w-full py-4 bg-acid text-black font-display font-black text-base tracking-wide rounded-xl uppercase hover:bg-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {status === 'sending' ? 'SENDING BRIEF…' : 'Send project brief'} <Send className="w-4 h-4" />
                </button>
                <p className="text-center text-xs font-mono text-muted">No spam. No obligation. You'll get a scoped quote or a polite pass within 24h.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
