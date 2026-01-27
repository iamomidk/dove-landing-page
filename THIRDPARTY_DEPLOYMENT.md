# Third-Party Deployment Guide

This guide is for external teams deploying the Dove Landing Page frontend, backend API, and database.

## Architecture overview

- **Frontend:** Vite + React, built to static files and served via Nginx.
- **Backend:** Node/Express API in `server/`.
- **Database:** PostgreSQL.
- **Analytics:** Google Analytics via gtag snippet in `index.html`.

Key endpoints:
- `GET /health` (proxy to API health)
- `POST /api/otp/send`
- `POST /api/otp/verify`
- `GET /api/video-url/signed/:key`
- `GET /api/video-url/static/:file`

## Minimum requirements

- Docker + Docker Compose **or** Node.js 20+ and Postgres 16+ (non‑Docker)
- A domain (optional, but recommended)
- S3-compatible object storage if using video URL endpoints
- SMS provider credentials (Kavenegar) if using SMS endpoints

## Option A — Docker Compose (recommended)

### 1) Prepare environment files

Backend env:
```
cp server/.env.example server/.env
```
Set at minimum:
- `DATABASE_URL`
- `ALLOWED_ORIGINS` (comma-separated)

If you use video endpoints:
- `S3_BUCKET`
- `PUBLIC_VIDEO_BASE`
Optional S3 overrides:
- `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`

If you use SMS endpoints:
- `KAVENEGAR_API_KEY`
- `KAVENEGAR_TEMPLATE`
- `KAVENEGAR_SENDER`

Frontend env (optional):
```
cp .env.example .env
```
Set `VITE_API_BASE` only if your API is not served from `/api`.

### 2) Start the stack

```
docker compose up --build -d
```

### 3) Verify

- Frontend: `http://<host>`
- API health: `http://<host>/health`

### 4) Update / redeploy

```
git pull
docker compose up --build -d
```

## Option B — Non‑Docker runbook

Use this if Docker is not available.

### 1) Install requirements

- Node.js 20+
- PostgreSQL 16+
- A process manager (recommended): `pm2`

```
npm install -g pm2
```

### 2) Clone and install

```
git clone <REPO_URL> dove-landing-page
cd dove-landing-page
npm ci
cd server
npm ci
```

### 3) Configure env

Frontend (optional):
```
cp .env.example .env
```

Backend:
```
cp server/.env.example server/.env
```
Set required values as listed in Option A.

### 4) Provision database

Create a database and user (example):
```
createdb dove
```

Ensure `DATABASE_URL` in `server/.env` points to it:
```
DATABASE_URL=postgres://user:password@127.0.0.1:5432/dove
```

The API auto-creates/migrates tables at startup.

### 5) Build and run backend

```
cd server
npm run build
pm2 start dist/index.js --name dove-api
pm2 save
```

Health check:
```
curl http://127.0.0.1:4000/health
```

### 6) Build and serve frontend

```
cd ..
npm run build
```

Serve `dist/` with any static server (Nginx, CloudFront, Netlify).

Example Nginx:
```
server {
    listen 80;
    server_name example.com;

    root /opt/dove/dove-landing-page/dist;
    index index.html;

    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:4000;
    }

    location /health {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:4000/health;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

## Environment variables reference

Frontend:
- `VITE_API_BASE` (optional, defaults to `/api`)

Backend:
- `DATABASE_URL` (required)
- `ALLOWED_ORIGINS` (recommended in production)
- `S3_BUCKET`, `PUBLIC_VIDEO_BASE` (required if video endpoints are used)
- `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE` (optional)
- `KAVENEGAR_API_KEY`, `KAVENEGAR_TEMPLATE`, `KAVENEGAR_SENDER` (optional)

## Analytics

Google Analytics is configured via the gtag snippet in `index.html`.
Update the measurement ID there if needed.

## Operational checklist

- Health check returns `{ ok: true }`
- `/api/otp/send` and `/api/otp/verify` work if SMS is configured
- Video URL endpoints work if S3 is configured
- CORS allowed origins set correctly
- TLS enabled at the reverse proxy/load balancer

## Troubleshooting

- **API fails on startup:** Verify `DATABASE_URL` and database connectivity.
- **CORS errors:** Ensure `ALLOWED_ORIGINS` includes the frontend domain.
- **Video endpoints fail:** Set `S3_BUCKET` and `PUBLIC_VIDEO_BASE`.
- **SMS errors:** Verify Kavenegar credentials and template name.
