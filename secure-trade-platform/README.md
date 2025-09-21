# Secure Trade Settlement Platform


**Stack**: React (Vite) + Express + PostgreSQL, JWT RBAC, Audit Log, Prometheus metrics.


## Endpoints
- `POST /auth/seed-admin` — create demo admin (email/password in body)
- `POST /auth/login` — get JWT
- `GET /trades`, `POST /trades`, `PUT /trades/:id/confirm`, `PUT /trades/:id/cancel`
- `GET /settlements`, `POST /settlements`, `PUT /settlements/:id/settle`
- `GET /audit` — (ADMIN/COMPLIANCE) latest audit events
- `GET /metrics` — Prometheus metrics; `GET /health`


## Config
API env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`
Web env vars: `VITE_API_URL`


## Deploy
- **API (Render)**: New Web Service → root `api/` → Build `npm install` → Start `node server.js` → set env vars.
- **Web (Vercel)**: Import repo → root `web/` → set `VITE_API_URL` to API URL.
- **DB**: Neon/Supabase Postgres; set `DATABASE_URL` in Render.
- **Observability**: Point Grafana Cloud to API `/metrics`.


## Security Notes
- Replace demo seed endpoint with proper user provisioning.
- Use HTTPS, restrict CORS origin, rotate JWT secret.