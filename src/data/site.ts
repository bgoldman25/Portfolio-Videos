export const SITE = {
  name: "Baltazar Goldman",
  role: "Freelance Video Editor",
  email: "hello@baltazargoldman.com",
  location: "Remote / Worldwide",
  timezone: "Asia/Kuala_Lumpur (UTC+8)",
  responseTime: "Within 24h on business days",
  availability: { status: "open" as const, label: "Available for new projects", capacity: "2 project slots this month" },
  // Call meeting link: Google Calendar Appointment Schedule or Calendly
  // Paste your Google Calendar appointment URL here, or set VITE_BOOKING_URL env
  bookingUrl: import.meta.env.VITE_BOOKING_URL || "https://calendar.google.com/calendar/appointment/schedules/PASTE_YOUR_SCHEDULE_ID_HERE",
  bookingEmbedUrl: import.meta.env.VITE_BOOKING_EMBED_URL || "",
  formspreeId: import.meta.env.VITE_FORMSPREE_ID || "YOUR_FORMSPREE_ID_HERE",
  showreel: {
    youtubeId: "eRsGy_F2vJw", // Sintel — placeholder, replace with your showreel ID
    title: "Showreel // 2026",
    poster: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80",
  },
  socials: [
    { label: "YouTube", url: "https://youtube.com/@baltazargoldman" },
    { label: "Instagram", url: "https://instagram.com/baltazargoldman" },
    { label: "X / Twitter", url: "https://x.com/baltazargoldman" },
    { label: "LinkedIn", url: "https://linkedin.com/in/baltazargoldman" },
  ],
} as const;
