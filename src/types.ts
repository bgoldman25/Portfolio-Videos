export type ProjectType = 'long-form' | 'short-form';
export type ProjectCategory = 'GAMING' | 'TALKING HEAD' | 'SHORT FORM' | 'MOTION';

export interface EditingMetrics {
  timelineDuration: string;
  fps: number;
  cutsCount: number;
  resolution: string;
  colorGrade: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  type: ProjectType;
  tagline: string;
  description: string;
  role: string;
  tools: string[];
  year: string;
  thumbnail: string;
  poster: string;
  previewVideo: string;
  fullVideo: string;
  rawVideo?: string;
  finalVideo?: string;
  metrics: EditingMetrics;
  featured?: boolean;
}

export type FilterOption = 'ALL' | 'LONG FORM' | 'SHORT FORM' | 'GAMING' | 'TALKING HEAD';

export interface EditingProcessStep {
  id: string;
  stepNumber: string;
  name: string;
  subtitle: string;
  description: string;
  visualTreatment: string;
  timecode: string;
  videoUrl: string;
}

export interface SoftwareSkill {
  name: string;
  percentage: number;
  tagline: string;
  color: string;
  shortcut: string;
  description: string;
}

export interface ServiceTier {
  id: string;
  title: string;
  category: 'LONG FORM' | 'SHORT FORM';
  tier: 'STANDARD' | 'PREMIUM';
  description: string;
  deliverables: string[];
  idealFor: string;
}
