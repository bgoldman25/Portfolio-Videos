// Vercel serverless function: POST /api/contact
// Sends the portfolio Project Inquiry form to the site owner via Resend.
// Runs server-side so RESEND_API_KEY is never shipped to the browser.
// Also used by the Vite dev server (see vite.config.ts) so local testing matches production.
//
// Env (set in Vercel → Project Settings → Environment Variables, and locally in .env.local):
//   RESEND_API_KEY     — required. Create at https://resend.com → API Keys
//   RESEND_FROM        — sender, e.g. "Portfolio <hello@yourdomain.com>". Domain must be verified in Resend.
//                        Defaults to Resend's test sender (delivers only to the account owner).
//   CONTACT_TO_EMAIL   — inbox that receives briefs. Defaults to goldmanbaltazar@gmail.com

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_BRIEF = 20;
const MAX_BRIEF = 2000;

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body; // Vercel may pre-parse JSON
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method_not_allowed' });

  let data;
  try {
    data = await readBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, error: 'invalid_json' });
  }

  // Honeypot: silently accept bot submissions without sending anything.
  if (data.website) return sendJson(res, 200, { ok: true });

  const name = String(data.name || '').trim().slice(0, 80);
  const email = String(data.email || '').trim().slice(0, 120);
  const service = String(data.service || '').trim().slice(0, 80);
  const timeline = String(data.timeline || '').trim().slice(0, 80);
  const budget = String(data.budget || '').trim().slice(0, 80);
  const description = String(data.description || '').trim().slice(0, MAX_BRIEF);
  const referenceUrls = String(data.referenceUrls || '').trim().slice(0, 500);

  if (!name || !EMAIL_RE.test(email) || description.length < MIN_BRIEF) {
    return sendJson(res, 400, { ok: false, error: 'validation_failed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return sendJson(res, 501, { ok: false, error: 'email_not_configured' });

  const from = process.env.RESEND_FROM || 'Portfolio <onboarding@resend.dev>';
  const to = process.env.CONTACT_TO_EMAIL || 'goldmanbaltazar@gmail.com';

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Service', service || '—'],
    ['Timeline', timeline || '—'],
    ['Budget', budget || '—'],
    ['References', referenceUrls || '—'],
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', description].join('\n');
  const html = [
    '<div style="font-family:system-ui,sans-serif;max-width:560px">',
    '<h2 style="margin:0 0 16px">New project inquiry</h2>',
    '<table style="border-collapse:collapse;width:100%">',
    ...rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${esc(k)}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`),
    '</table>',
    `<p style="white-space:pre-wrap;margin-top:16px">${esc(description)}</p>`,
    '</div>',
  ].join('');

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: [email],
        subject: `Project Inquiry — ${service || 'General'} — ${name}`,
        text,
        html,
      }),
    });
    const payload = await resendRes.json().catch(() => ({}));
    if (!resendRes.ok) return sendJson(res, 502, { ok: false, error: 'resend_failed', detail: payload?.message || resendRes.statusText });
    return sendJson(res, 200, { ok: true, id: payload.id || null });
  } catch {
    return sendJson(res, 502, { ok: false, error: 'resend_unreachable' });
  }
}
