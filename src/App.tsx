import React, { useState, useEffect } from 'react';
import { Project } from './types';
import { Navigation } from './components/Navigation';
import { ColdOpen } from './components/ColdOpen';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ProjectModal } from './components/ProjectModal';
import { RawVsEdited } from './components/RawVsEdited';
import { EditingProcess } from './components/EditingProcess';
import { SkillReveal } from './components/SkillReveal';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export function App() {
  const [showColdOpen, setShowColdOpen] = useState(() => {
    try { return !sessionStorage.getItem('coldopen-seen'); } catch { return false; }
  });
  const [selected, setSelected] = useState<Project | null>(null);
  useEffect(() => { if (showColdOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = ''; }, [showColdOpen]);
  return (
    <div className="min-h-screen bg-dark text-off-white selection:bg-acid selection:text-black">
      {showColdOpen && <ColdOpen onComplete={() => setShowColdOpen(false)} />}
      <Navigation onReplayIntro={() => setShowColdOpen(true)} />
      <main>
        <Hero />
        <ProjectShowcase onSelectProject={setSelected} />
        <RawVsEdited />
        <EditingProcess />
        <SkillReveal />
        <ServicesSection />
        <AboutSection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
      <ProjectModal project={selected} onClose={() => setSelected(null)} onSelectProject={setSelected} />
    </div>
  );
}
export default App;
