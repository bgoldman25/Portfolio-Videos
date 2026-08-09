import React, { useState } from 'react';
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
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export function App() {
  const [showColdOpen, setShowColdOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleReplayIntro = () => {
    setShowColdOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark text-off-white selection:bg-acid selection:text-dark">
      {/* Cinematic Cold Open Intro */}
      {showColdOpen && (
        <ColdOpen onComplete={() => setShowColdOpen(false)} />
      )}

      {/* Main Portfolio Navigation */}
      <Navigation onReplayIntro={handleReplayIntro} />

      {/* Main Sections */}
      <main>
        <Hero />
        <ProjectShowcase onSelectProject={(proj) => setSelectedProject(proj)} />
        <RawVsEdited />
        <EditingProcess />
        <SkillReveal />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Full Project Detail Modal Overlay */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />
    </div>
  );
}

export default App;
