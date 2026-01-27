# Deployment

This repo has a Vite frontend and a Node/Express API in `server/`. The most straightforward deployment path is Docker Compose.
For a full external runbook, see `THIRDPARTY_DEPLOYMENT.md`.

## Quick start (Docker)

1) Create API env file:
```
cp server/.env.example server/.env
```
Fill in the required values (`DATABASE_URL`, S3, etc.).

2) Create frontend env file (optional):
```
cp .env.example .env
```
Set `VITE_API_BASE` only if your API is not served from `/api`.

3) Build and start everything:
```
docker compose up --build -d
```

4) Verify:
- Frontend: http://localhost
- API health: http://localhost/health

## Services (Docker Compose)

- `web`: builds the frontend and serves it with Nginx.
- `api`: builds the backend from `server/`.
- `postgres`: local database for API (`DATABASE_URL` defaults to it).

## Environment variables (API)

Required:
- `DATABASE_URL` (Postgres connection string)

Required if video URL endpoints are used:
- `S3_BUCKET`
- `PUBLIC_VIDEO_BASE`
Optional S3 overrides:
- `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`

Optional (SMS endpoints):
- `KAVENEGAR_API_KEY`, `KAVENEGAR_TEMPLATE`, `KAVENEGAR_SENDER`

## Environment variables (Frontend)

Optional:
- `VITE_API_BASE` (defaults to `/api`, which works with the Docker Nginx proxy)

## Analytics

Google Analytics is configured via the gtag snippet in `index.html`. Update the measurement ID there for a new property.

## Production notes

- Put a real reverse proxy/TLS terminator in front of port 80, or extend Nginx to handle TLS.
- Use strong database credentials and a managed Postgres if possible.
- Set `ALLOWED_ORIGINS` to your real domain(s).
- If you use object storage (S3-compatible), make sure the bucket policy allows signed URL access.

## Non-Docker deployment (step-by-step ops runbook)

This runbook assumes:
- macOS/Linux host
- Node.js 20+ installed
- PostgreSQL 16+ available and reachable
- A system user to run the service (recommended)

### 1) Prepare the host

Install Node.js 20+ and a process manager (recommended):
```
node -v
npm -v
npm install -g pm2
```

Create a deploy directory:
```
mkdir -p /opt/dove
```

### 2) Clone and install dependencies

```
cd /opt/dove
git clone <REPO_URL> dove-landing-page
cd dove-landing-page
npm ci
```

Backend dependencies:
```
cd server
npm ci
cd ..
```

### 3) Configure environment variables

Frontend env (optional):
```
cp .env.example .env
```
Set `VITE_API_BASE` if your API is not served from `/api`.

Backend env (required):
```
cp server/.env.example server/.env
```
Set at minimum:
- `DATABASE_URL`
- `ALLOWED_ORIGINS` (comma-separated list of allowed origins)
If you use video URL endpoints, also set:
- `S3_BUCKET`
- `PUBLIC_VIDEO_BASE`
If you use SMS endpoints:
- `KAVENEGAR_API_KEY`
- `KAVENEGAR_TEMPLATE`
- `KAVENEGAR_SENDER`

### 4) Create the database

Create a database and user:
```
createdb dove
```
Set `DATABASE_URL` in `server/.env` to point to it, e.g.:
```
DATABASE_URL=postgres://user:password@127.0.0.1:5432/dove
```

On first boot, the API will create and migrate tables automatically.

### 5) Build the frontend

```
npm run build
```
This produces `dist/` for static hosting.

### 6) Run the backend

Build:
```
cd server
npm run build
```

Run with PM2:
```
pm2 start dist/index.js --name dove-api
pm2 save
```

Check health:
```
curl http://127.0.0.1:4000/health
```

### 7) Serve the frontend

Option A: Nginx (recommended)

Create a site config (example):
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

Reload Nginx:
```
nginx -t && sudo systemctl reload nginx
```

Option B: Any static host

Upload the `dist/` directory to your static host and set `VITE_API_BASE` to your API origin (e.g., `https://api.example.com`).

### 8) Validation checklist

- `curl http://127.0.0.1:4000/health` returns `{ ok: true }`
- `GET /` returns the app HTML
- `POST /api/otp/send` works (if configured)
- `GET /api/video-url/static/...` works (if S3 configured)

### 9) Operations

Logs:
```
pm2 logs dove-api
```

Restart:
```
pm2 restart dove-api
```

Update deploy:
```
cd /opt/dove/dove-landing-page
git pull
npm ci
npm run build
cd server
npm ci
npm run build
pm2 restart dove-api
```

### 10) Troubleshooting

- API won’t start: check `server/.env` and `DATABASE_URL`.
- CORS errors: update `ALLOWED_ORIGINS`.
- Video endpoints fail: ensure `S3_BUCKET` and `PUBLIC_VIDEO_BASE` are set.
