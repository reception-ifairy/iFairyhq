# Codespaces / Dev Container

This project is ready to run in GitHub Codespaces.

## Secrets Setup (GitHub Codespaces)

GitHub reserves `GITHUB_*` prefix, so use these names in Codespaces Secrets:

| Codespaces Secret | Maps to ENV var |
|-------------------|-----------------|
| `CLIENT_ID` | `GITHUB_CLIENT_ID` |
| `CLIENT_SECRET` | `GITHUB_CLIENT_SECRET` |
| `GOOGLE_ID` | `GOOGLE_CLIENT_ID` |
| `GOOGLE_SECRET` | `GOOGLE_CLIENT_SECRET` |
| `API_TOKEN` | `ADMIN_API_TOKEN` |
| `SESSION_SECRET` | `ADMIN_SESSION_SECRET` |
| `ENC_KEY` | `ENCRYPTION_KEY` |

Add secrets at: https://github.com/settings/codespaces (User secrets) or repo Settings → Secrets → Codespaces.

## Running the Server

Use the wrapper script to auto-map secrets:

```bash
./load-secrets.sh
```

Or manually:
```bash
export GITHUB_CLIENT_ID="$CLIENT_ID"
export GITHUB_CLIENT_SECRET="$CLIENT_SECRET"
npm run server
```

## Quick Start

After the container starts:

1) Install deps (runs automatically): `npm install`
2) Start API server:
   - `./load-secrets.sh` (recommended)
   - or `npm run server:dev`
3) Start frontend:
   - `npm run dev`

Notes:
- For Codespaces, the API is served as `/api/*` via Vite proxy during dev (`API_SERVER_URL`).
- Production uses nginx reverse-proxy to `/api/*` (already configured on the server).

Database in Codespaces:
- A MariaDB service is included via `.devcontainer/docker-compose.yml`.
- It auto-imports `schema.sql` on first start.
