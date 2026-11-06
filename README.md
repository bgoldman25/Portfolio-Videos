# Baltazar Goldman — Portfolio (Redesign v2)

Retention-first video editor portfolio. React 18 + Vite 5 + Tailwind 3.

## Run locally
```
npm install
npm run dev     # http://localhost:3000
npm run build   # production build -> dist/
npm run preview # preview production build
```

## Content & config
- Single source of truth: `src/data/site.ts` (email, booking URLs, showreel ID, socials)
- Projects: `src/data/projects.ts` — set `youtubeId` to the real client video ID; poster/thumb are Unsplash placeholders
- Booking: see `BOOKING_SETUP.md` (Google Calendar Appointment Schedule + embed)
- Contact: Formspree via `VITE_FORMSPREE_ID`, falls back to `mailto:` (see `.env.example`)

## Notes
- Cold-open intro shows once per session; SKIP INTRO / ESC always works, sound is off by default.
- Do not commit `.env.local`. `vercel.json` handles SPA fallback + asset caching.
