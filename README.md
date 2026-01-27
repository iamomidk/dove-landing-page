# Dove Landing Page

Vite + React frontend with a Node/Express API in `server/`. The API serves OTP/SMS flows and video URL endpoints and uses Postgres for storage.

## Quick start (local dev)

Frontend:
```
npm ci
npm run dev
```

Backend:
```
cd server
npm ci
npm run dev
```

## Environment variables

Frontend:
- `VITE_API_BASE` (optional, defaults to `/api`)

Backend:
- `DATABASE_URL` (required)
- `S3_BUCKET`, `PUBLIC_VIDEO_BASE` (required if video URL endpoints are used)
- `KAVENEGAR_API_KEY`, `KAVENEGAR_TEMPLATE`, `KAVENEGAR_SENDER` (optional, SMS)

## Analytics

Google Analytics is wired via the gtag snippet in `index.html`. Update the measurement ID there if needed.

## Deployment

See `DEPLOYMENT.md` for internal deployment notes and `THIRDPARTY_DEPLOYMENT.md` for a full external runbook.
