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
    src: "/videos/showreel-2026.mp4",
    title: "Showreel // 2026",
    duration: "0:28",
    poster: "/videos/showreel-2026-poster.jpg",
  },
  socials: [
    { label: "YouTube", url: "https://youtube.com/@baltazargoldman" },
    { label: "Instagram", url: "https://instagram.com/baltazargoldman" },
    { label: "X / Twitter", url: "https://x.com/baltazargoldman" },
    { label: "LinkedIn", url: "https://linkedin.com/in/baltazargoldman" },
  ],
} as const;
