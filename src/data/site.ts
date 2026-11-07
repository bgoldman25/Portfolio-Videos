const rawCalcomLink = (import.meta.env.VITE_CALCOM_LINK || "").trim();
const calcomLink = rawCalcomLink
  .replace(/^https?:\/\/(?:app\.)?cal\.com\//i, "")
  .replace(/^\/+|\/+$/g, "");
const calcomConfigured = calcomLink.length > 0 && !calcomLink.includes("your-username");

export const SITE = {
  name: "Baltazar Goldman",
  role: "Freelance Video Editor",
  email: "goldmanbaltazar@gmail.com",
  location: "Remote / Worldwide",
  timezone: "Asia/Manila (UTC+8)",
  responseTime: "Within 24h on business days",
  availability: { status: "open" as const, label: "Available for new projects", capacity: "2 project slots this month" },
  // Cal.com event type, e.g. "baltazargoldman/discovery" (a full cal.com URL also works)
  calcom: {
    link: calcomLink,
    url: calcomConfigured ? `https://cal.com/${calcomLink}` : "",
    configured: calcomConfigured,
  },
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
