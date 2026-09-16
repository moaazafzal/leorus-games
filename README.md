# Leorus Web 2026

Marketing site for Leorus — mobile games studio — with a private admin dashboard.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 4
- Framer Motion
- File-based CMS: all site content lives in `content/site.json`

## Develop

```bash
npm install
cp .env.example .env.local   # fill in admin credentials + AUTH_SECRET
npm run dev
```

Open http://localhost:3000.

## Admin dashboard

- URL: `/dashboard` (not linked anywhere on the public site, noindex)
- Login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`
- Session: signed HTTP-only cookie (7 days), verified by middleware
- Edit everything: hero text/badge/stats, games (add/remove/reorder,
  upload icons), partner cards, growth section, studios, about/games/
  contact pages, footer — plus a raw JSON tab for full control
- Image uploads land in `public/img/uploads/`

`.env.local` is gitignored — never commit credentials.

## Pages

- `/` — hero + stats, game collection, partner, growth sandbox, studios
- `/about` — values, studios, careers CTA
- `/games` — filterable game grid
- `/contact` — contact form
- `/dashboard` — private admin (auth required)
