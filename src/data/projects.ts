import { Project, ServiceTier, SoftwareSkill, EditingProcessStep } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'project-01',
    slug: 'source-shift-masterclass',
    title: 'SOURCE SHIFT MASTERCLASS',
    category: 'TALKING HEAD',
    type: 'long-form',
    tagline: 'Identity shift from operator to autonomous leader — coaching, delegation traps & the source shift framework',
    description: 'A 36-minute masterclass on the hardest transition in business ownership: the Source Shift. Breaks down why founders stall at Level 5 when the business runs but only with them in the room. Covers the four traps (Highest Paid Problem Solver, Emotional Center, Waiting to Feel Natural, They Need Me), the shift from internally-sourced to impact-sourced value, identity grief, and six practices to build a leadership layer — coaching over managing, reading rooms for capacity, sitting with silence, releasing outcomes, holding standards without enforcing. Edited from raw coaching sessions with kinetic motion callouts, animated vector diagrams, and micro-cuts to maintain retention through complex leadership concepts.',
    role: 'Lead Video Editor, Motion Design & Sound Mix',
    tools: ['Premiere Pro', 'After Effects', 'Photoshop', 'Audition'],
    year: '2026',
    featured: true,
    thumbnail: '/videos/source-shift-thumbnail.webp',
    poster: '/videos/source-shift-thumbnail.webp',
    previewVideo: '/videos/reel-01.mp4',
    fullVideo: 'https://github.com/bgoldman25/Portfolio-Videos/releases/download/videos-v1/Source.Shift.Masterclass.V2_1.mp4',
    rawVideo: '/videos/Before_1.mp4',
    finalVideo: '/videos/After_1.mp4',
    gallery: [
      { src: '/videos/source-shift-frame-01.webp', label: 'SEQUENCE FRAME 01' },
      { src: '/videos/source-shift-frame-02.webp', label: 'SEQUENCE FRAME 02' },
      { src: '/videos/source-shift-frame-03.webp', label: 'SEQUENCE FRAME 03' },
    ],
    durationLabel: '36:50',
    metrics: { timelineDuration: '36:50:00', fps: 60, cutsCount: 298, resolution: '4K DCI', colorGrade: 'Cinematic Rec.709 Teal-Amber' },
  },
  {
    id: 'project-02',
    slug: 'marathon-bungie-review',
    title: "I CAN'T BELIEVE WHAT THEY DID TO MARATHON...",
    category: 'GAMING',
    type: 'long-form',
    tagline: "Bungie's extraction shooter redemption — heat mechanics, disposable runners & why the skepticism was wrong",
    description: "A 13-minute documentary-style review of Bungie's Marathon reboot. Covers striking visual design of Tau Ceti IV, the heat mechanic replacing stamina, sound design as actionable intelligence, the runner lore, and Bungie's post-launch support. Frame-accurate gameplay cuts, dramatic silence pauses, and kinetic typography turn technical analysis into narrative.",
    role: 'Editor, Story Architect, Colorist',
    tools: ['Premiere Pro', 'After Effects', 'Audition'],
    year: '2026',
    featured: true,
    thumbnail: '/videos/marathon-thumbnail.jpg',
    poster: '/videos/marathon-thumbnail.jpg',
    previewVideo: '/videos/reel-02.mp4',
    fullVideo: 'https://github.com/bgoldman25/Portfolio-Videos/releases/download/videos-v1/Marathon.V3.Enhanced.Voice.Audio._1.mp4',
    gallery: [
      { src: '/videos/marathon-frame-01.jpg', label: 'SEQUENCE FRAME 01' },
      { src: '/videos/marathon-frame-02.jpg', label: 'SEQUENCE FRAME 02' },
      { src: '/videos/marathon-frame-03.jpg', label: 'SEQUENCE FRAME 03' },
    ],
    durationLabel: '13:26',
    metrics: { timelineDuration: '13:26:00', fps: 60, cutsCount: 136, resolution: '4K UHD', colorGrade: 'High Contrast Cyber Gamma' },
  },
  {
    id: 'project-03',
    slug: 'fat-loss-breakfast-protocol',
    title: 'THE 30/30 FAT LOSS PROTOCOL',
    category: 'SHORT FORM',
    type: 'short-form',
    tagline: 'Two changes, 30 grams protein, 30 minutes — lose 10-20 lbs/month without changing anything else',
    description: 'A 52-second high-retention vertical reel distilling Tim Ferriss\'s fat loss framework into two actionable changes. Rapid text tracking, dynamic sound design impacts, kinetic speed ramps, and attention-grabbing hooks optimized for 9:16 mobile screens. Hook, value, hook, value, CTA.',
    role: 'Short-Form Video Specialist',
    tools: ['Premiere Pro', 'After Effects', 'CapCut Pro'],
    year: '2026',
    featured: true,
    thumbnail: '/videos/tim-ferris-thumbnail-landscape.jpg',
    poster: '/videos/tim-ferris-thumbnail-landscape.jpg',
    previewVideo: '/videos/reel-05.mp4',
    fullVideo: 'https://github.com/bgoldman25/Portfolio-Videos/releases/download/videos-v1/Tim.Ferris.V1.mp4',
    gallery: [
      { src: '/videos/tim-ferris-frame-01.jpg', label: 'VERTICAL FRAME 01' },
      { src: '/videos/tim-ferris-frame-02.jpg', label: 'VERTICAL FRAME 02' },
      { src: '/videos/tim-ferris-frame-03.jpg', label: 'VERTICAL FRAME 03' },
    ],
    durationLabel: '0:52',
    metrics: { timelineDuration: '00:52:18', fps: 60, cutsCount: 13, resolution: '1080x1920 (9:16)', colorGrade: 'Vibrant Neon Saturation' },
  },
];

export const EDITING_PROCESS_STEPS: EditingProcessStep[] = [
  { id: 'step-1', stepNumber: '01', name: 'RAW DUMP', subtitle: 'The Unfiltered Chaos', description: 'Sifting through 40+ hours of unedited raw footage, multi-track audio, and outtakes. Identifying hidden gems and gold nugget moments.', visualTreatment: 'Flat log color profile, unmixed room audio, visible stumble cuts.', timecode: '00:00:15:00', videoUrl: '/videos/Before_1.mp4', poster: '/videos/Before_1-thumbnail.jpg' },
  { id: 'step-2', stepNumber: '02', name: 'STRUCTURE & ASSEMBLY', subtitle: 'Building the Narrative Spine', description: 'Trimming dead air, removing filler words, and carving out an irresistible opening hook within the first 5 seconds to lock in retention.', visualTreatment: 'A-roll sequence timeline cut down by 65%. Clear visual narrative curve.', timecode: '00:02:40:12', videoUrl: '/videos/reel-01.mp4', poster: '/videos/source-shift-thumbnail.webp' },
  { id: 'step-3', stepNumber: '03', name: 'PACING & RHYTHM', subtitle: 'Micro-cuts & Meme Timing', description: 'Injecting dynamic zoom punches, J-cuts, L-cuts, and internet-native meme beats. Balancing high-intensity beats with strategic breathers.', visualTreatment: 'Speed ramps, punch zooms, rhythmic frame skipping.', timecode: '00:05:12:08', videoUrl: '/videos/reel-04.mp4', poster: '/videos/marathon-thumbnail.jpg' },
  { id: 'step-4', stepNumber: '04', name: 'POLISH & MOTION', subtitle: 'Visual Graphics & Sound Design', description: 'Layering custom kinetic typography, SFX impacts, custom color grading, and motion overlays to turn a good edit into an incredible experience.', visualTreatment: 'Full Rec.709 color grade, kinetic titles, spatial audio mixing.', timecode: '00:08:42:15', videoUrl: '/videos/After_1.mp4', poster: '/videos/After_1-thumbnail.jpg' },
];

export const SOFTWARE_SKILLS: SoftwareSkill[] = [
  { name: 'PREMIERE PRO', percentage: 95, tagline: 'Timeline Master', color: '#9999FF', shortcut: 'Cmd + K', description: 'Precision trimming, multi-cam sync, ripple editing, and timeline speed-workflow mastery.' },
  { name: 'AFTER EFFECTS', percentage: 85, tagline: 'Motion Enhancer', color: '#D685FF', shortcut: 'F9 (Easy Ease)', description: 'Kinetic typography, shape layer animations, tracking, masking, and visual callouts.' },
  { name: 'PHOTOSHOP', percentage: 90, tagline: 'Asset Prep & Compositing', color: '#31A8FF', shortcut: 'Cmd + Shift + N', description: 'High-converting YouTube thumbnails, asset cutouts, texture creation, and photo touch-ups.' },
  { name: 'ILLUSTRATOR', percentage: 80, tagline: 'Vector Graphics', color: '#FF9A00', shortcut: 'Pen Tool (P)', description: 'Custom vector logo badges, icon design, and graphic elements for motion callouts.' },
];

export const SERVICE_TIERS: ServiceTier[] = [
  { id: 'long-standard', title: 'LONG FORM — STANDARD', category: 'LONG FORM', tier: 'STANDARD', description: 'Clean, engaging long-form editing for YouTube, commentary, gaming, and educational content.', deliverables: ['Comprehensive story trimming & A-roll cut down', 'Clean audio leveling & noise reduction', 'Basic lower thirds & title overlays', 'Strategic zoom punches & retention cuts', 'Standard 1080p/4K master export'], idealFor: 'Consistent weekly YouTube uploaders & vloggers' },
  { id: 'long-premium', title: 'LONG FORM — PREMIUM', category: 'LONG FORM', tier: 'PREMIUM', description: 'Cinematic documentary-style YouTube editing with heavy motion graphics & custom sound design.', deliverables: ['Advanced narrative structuring & retention optimization', 'Custom After Effects motion callouts & kinetic typography', 'Bespoke sound design & multi-layer audio mixing', 'Professional Rec.709 / Film emulation color grading', 'Optimized thumbnail asset kit & vertical promo cut'], idealFor: 'High-stakes documentaries, flagship YouTube projects & brand campaigns', popular: true },
  { id: 'short-standard', title: 'SHORT FORM — STANDARD', category: 'SHORT FORM', tier: 'STANDARD', description: 'Fast-turnaround 9:16 vertical videos for Instagram Reels, YouTube Shorts, and TikTok.', deliverables: ['Attention-grabbing hook cutting within 3 seconds', 'Automated kinetic captions with highlight styling', 'Dynamic crop & auto-framing for vertical', 'Background music track integration', 'Vertical 1080x1920 master export'], idealFor: 'Content creators repurposing podcast clips & long-form highlights' },
  { id: 'short-premium', title: 'SHORT FORM — PREMIUM', category: 'SHORT FORM', tier: 'PREMIUM', description: 'High-energy, algorithm-topping short form with bespoke motion treatment and sound layering.', deliverables: ['Hand-crafted frame-by-frame text animation', 'Custom sound effects (whooshes, pops, impacts)', 'Subtle motion graphic overlays & emoji callouts', 'Speed ramps & rhythm-synced beats', 'A/B testing variation cuts'], idealFor: 'Brands & creators seeking viral reach and max conversion on mobile', popular: true },
];
