# API server (local / self-host)

This folder contains a minimal Express API used by the React `/admin` panel to manage the MySQL/MariaDB database created from `schema.sql`.

## Environment

Create a `.env` file (example):

```bash
PORT=8787
ADMIN_API_TOKEN=change_me

DB_HOST=localhost
DB_USER=admin_ifairycouk
DB_PASSWORD=
DB_NAME=admin_ifairycouk
DB_PORT=3306
```

## Run

- `npm run server:dev`
- `npm run server`

## Security

All `/api/*` endpoints (except `/api/health`) require:

`Authorization: Bearer $ADMIN_API_TOKEN`

Restrict access server-side (Basic Auth / IP allowlist) for production use.

