import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Film, AlertCircle, Mail } from 'lucide-react';
import { SITE } from '../data/site';

const SERVICE_OPTIONS = ['Long Form — Standard', 'Long Form — Premium', 'Short Form — Standard', 'Short Form — Premium', 'Other / Custom Campaign'];
const TIMELINES = ['ASAP (< 1 week)', 'This month', 'Flexible', 'Ongoing retainer'];
const BUDGETS = ['Under $500', '$500 – $1,500', '$1,500 – $4,000', '$4,000+', 'Prefer to discuss'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_BRIEF = 20;
const MAX_BRIEF = 2000;

const EMPTY_FORM = { name: '', email: '', service: SERVICE_OPTIONS[1], timeline: TIMELINES[1], budget: BUDGETS[1], description: '', referenceUrls: '', honeypot: '' };

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';
type Field = 'name' | 'email' | 'description';

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<{ message: string; field?: Field } | null>(null);
  const [mailtoHref, setMailtoHref] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const briefRef = useRef<HTMLTextAreaElement>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const invalid = (field: Field) => (error?.field === field ? true : undefined);
  const describedBy = (field: Field) => (error?.field === field ? 'contact-form-error' : undefined);
  const resetForm = () => { setForm(EMPTY_FORM); setError(null); setStatus('idle'); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    if (!form.name.trim()) {
      setError({ message: 'Please add your name so I know who I am replying to.', field: 'name' });
      nameRef.current?.focus();
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError({ message: "That email doesn't look right — please check it.", field: 'email' });
      emailRef.current?.focus();
      return;
    }
    if (form.description.trim().length < MIN_BRIEF) {
      setError({ message: `Tell me a little more — at least ${MIN_BRIEF} characters so I can quote accurately.`, field: 'description' });
      briefRef.current?.focus();
      return;
    }
    setError(null);
    setStatus('sending');
    const hasFormspree = Boolean(SITE.formspreeId) && !SITE.formspreeId.includes('YOUR_');
    try {
      if (hasFormspree) {
        const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, service: form.service, timeline: form.timeline, budget: form.budget, description: form.description, referenceUrls: form.referenceUrls }) });
        if (!res.ok) throw new Error('formspree failed');
        setStatus('sent');
        return;
      }
      // No form endpoint configured: hand the brief to the visitor's mail client.
      const subject = encodeURIComponent(`Project Inquiry — ${form.service} — ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\nTimeline: ${form.timeline}\nBudget: ${form.budget}\n\n${form.description}\n\nReferences: ${form.referenceUrls || '—'}`);
      const href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setMailtoHref(href);
      window.location.href = href;
      setStatus('mailto');
    } catch {
      setStatus('error');
      setError({ message: `Could not send — please email directly: ${SITE.email}` });
    }
  };

  return (
    <section id="contact" className="relative py-20 md:py-28 px-4 md:px-6 bg-dark border-t border-white/10 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs rounded-full mb-3"><Film className="w-3.5 h-3.5" /> PROJECT INQUIRY</div>
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tight">Let's make <span className="text-acid">something.</span></h2>
          <p className="text-muted font-mono text-sm mt-3">Raw footage, a channel, or a campaign — send the brief. I reply inside 24h with next steps.</p>
        </div>
        <div className="bg-charcoal border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="sent" role="status" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-acid mx-auto" />
                <h3 className="font-display font-black text-4xl uppercase">Project <span className="text-acid">received.</span></h3>
                <p className="text-muted max-w-md mx-auto">Thanks <strong className="text-off-white">{form.name}</strong> — your brief is in. Expect a reply within 24h with a scoped quote.</p>
                <button type="button" onClick={resetForm} className="px-5 py-2.5 border border-acid/50 text-acid font-mono text-xs rounded-full hover:bg-acid hover:text-black transition-colors">Send another brief</button>
              </motion.div>
            ) : status === 'mailto' ? (
              <motion.div key="mailto" role="status" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center space-y-4">
                <Mail className="w-16 h-16 text-acid mx-auto" />
                <h3 className="font-display font-black text-4xl uppercase">One more <span className="text-acid">step.</span></h3>
                <p className="text-muted max-w-md mx-auto">Your brief is drafted in your email app — press send there and it reaches me. Nothing has left this page yet, so if no draft opened, use the button below.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href={mailtoHref} className="px-5 py-2.5 bg-acid text-black font-mono font-bold text-xs rounded-full hover:bg-white transition-colors">Reopen draft email</a>
                  <button type="button" onClick={resetForm} className="px-5 py-2.5 border border-acid/50 text-acid font-mono text-xs rounded-full hover:bg-acid hover:text-black transition-colors">Back to the form</button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Name *</span><input ref={nameRef} required maxLength={80} value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={invalid('name')} aria-describedby={describedBy('name')} placeholder="Alex Rivera" className="w-full px-4 py-3 bg-dark border border-white/40 rounded-xl focus:border-acid text-sm" autoComplete="name" /></label>
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Email *</span><input ref={emailRef} type="email" required maxLength={120} value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={invalid('email')} aria-describedby={describedBy('email')} placeholder="alex@creator.com" className="w-full px-4 py-3 bg-dark border border-white/40 rounded-xl focus:border-acid text-sm" autoComplete="email" /></label>
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Service</span><select value={form.service} onChange={(e) => set('service', e.target.value)} className="w-full px-4 py-3 bg-dark border border-white/40 rounded-xl text-sm focus:border-acid">{SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></label>
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Timeline</span><select value={form.timeline} onChange={(e) => set('timeline', e.target.value)} className="w-full px-4 py-3 bg-dark border border-white/40 rounded-xl text-sm focus:border-acid">{TIMELINES.map((o) => <option key={o}>{o}</option>)}</select></label>
                  <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Budget</span><select value={form.budget} onChange={(e) => set('budget', e.target.value)} className="w-full px-4 py-3 bg-dark border border-white/40 rounded-xl text-sm focus:border-acid">{BUDGETS.map((o) => <option key={o}>{o}</option>)}</select></label>
                </div>
                <div className="space-y-2">
                  <label className="space-y-2 block">
                    <span className="font-mono text-xs text-acid uppercase">Project brief *</span>
                    <textarea ref={briefRef} rows={4} required minLength={MIN_BRIEF} maxLength={MAX_BRIEF} value={form.description} onChange={(e) => set('description', e.target.value)} aria-invalid={invalid('description')} aria-describedby={[describedBy('description'), 'brief-counter'].filter(Boolean).join(' ')} placeholder="Video goal, raw footage length, audience, turnaround…" className="w-full px-4 py-3 bg-dark border border-white/40 rounded-xl focus:border-acid text-sm" />
                  </label>
                  <span id="brief-counter" className={`block text-xs font-mono ${form.description.trim().length >= MIN_BRIEF ? 'text-muted' : 'text-white/45'}`}>
                    {form.description.length.toLocaleString()} / {MAX_BRIEF.toLocaleString()} characters · minimum {MIN_BRIEF}
                  </span>
                </div>
                <label className="space-y-2 block"><span className="font-mono text-xs text-acid uppercase">Reference edit (optional)</span><input value={form.referenceUrls} onChange={(e) => set('referenceUrls', e.target.value)} placeholder="https://youtube.com/watch?v=…" className="w-full px-4 py-3 bg-dark border border-white/40 rounded-xl focus:border-acid text-sm" /></label>
                <input type="text" value={form.honeypot} onChange={(e) => set('honeypot', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" />
                {error && <p id="contact-form-error" role="alert" className="flex items-center gap-2 text-sm text-red-400 font-mono"><AlertCircle className="w-4 h-4 shrink-0" />{error.message}</p>}
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
