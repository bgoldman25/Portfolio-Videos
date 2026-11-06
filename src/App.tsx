import React, { useState, useEffect, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { Project } from './types';
import { usePrefersReducedMotion } from './utils/performance';
import { Navigation } from './components/Navigation';
import { ColdOpen } from './components/ColdOpen';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { RawVsEdited } from './components/RawVsEdited';
import { EditingProcess } from './components/EditingProcess';
import { SkillReveal } from './components/SkillReveal';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
const ProjectModal = React.lazy(() => import('./components/ProjectModal').then((m) => ({ default: m.ProjectModal })));
const BookingSection = React.lazy(() => import('./components/BookingSection').then((m) => ({ default: m.BookingSection })));
const ContactSection = React.lazy(() => import('./components/ContactSection').then((m) => ({ default: m.ContactSection })));

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="min-h-screen grid place-items-center p-6 text-center bg-dark"><div><h1 className="font-display font-black text-3xl mb-2">Something hit a bad cut.</h1><p className="text-muted mb-4">Refresh the page.</p><button onClick={() => location.reload()} className="px-5 py-2.5 bg-acid text-black font-bold rounded-full">Reload</button></div></div>;
    return this.props.children;
  }
}

export function App() {
  const reduceMotion = usePrefersReducedMotion();
  const [showColdOpen, setShowColdOpen] = useState(() => {
    try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false; return !sessionStorage.getItem('coldopen-seen'); } catch { return false; }
  });
  const [selected, setSelected] = useState<Project | null>(null);
  useEffect(() => { if (showColdOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = ''; }, [showColdOpen]);
  return (
    <MotionConfig reducedMotion="user" transition={reduceMotion ? { duration: 0, delay: 0 } : undefined}>
    <div className="min-h-screen bg-dark text-off-white selection:bg-acid selection:text-black">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-acid focus:text-black focus:font-bold rounded-full">Skip to content</a>
      {showColdOpen && <ColdOpen onComplete={() => setShowColdOpen(false)} />}
      <Navigation onReplayIntro={() => setShowColdOpen(true)} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <ProjectShowcase onSelectProject={setSelected} />
        <RawVsEdited />
        <EditingProcess />
        <SkillReveal />
        <ServicesSection />
        <AboutSection />
        <ErrorBoundary>
        <Suspense fallback={<div className="py-16 text-center font-mono text-xs text-muted">Loading booking…</div>}>
        <BookingSection />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center font-mono text-xs text-muted">Loading form…</div>}>
        <ContactSection />
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Suspense fallback={null}>
      <ProjectModal project={selected} onClose={() => setSelected(null)} onSelectProject={setSelected} />
      </Suspense>
    </div>
    </MotionConfig>
  );
}
export default App;
