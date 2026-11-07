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
- Booking: see `BOOKING_SETUP.md` (Cal.com inline embed; `VITE_CALCOM_LINK`)
- Contact: Resend via `api/contact.js` (`RESEND_API_KEY` server-side), falls back to `mailto:` (see `.env.example` + `BOOKING_SETUP.md`)

## Notes
- Cold-open intro shows once per session; ESC always works, sound is off by default.
- Do not commit `.env.local`. `vercel.json` handles SPA fallback + asset caching.
