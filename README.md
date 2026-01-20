# iFairy Studio (Vite + React) – marketing frontpage + AI demo + Admin dashboard

This repo is a Vite + React single-page app used as the public website for **ifairy.co.uk**.
It contains:

- A dark-fantasy themed marketing frontpage (multiple sections).
- An AI “support/chat” drawer + a simple lesson generator (Gemini).
- An in-app **Admin dashboard** (`/admin`) for editing frontpage sections and AI bot settings.

The project is currently deployed as a static build (Vite `dist/`) and served via nginx.

## Tech stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 (via PostCSS) + some inline CSS in `index.html`
- Google Gemini via `@google/genai`
- Icons: `lucide-react`

## Project structure

- `index.html` – base HTML template
- `index.tsx` – React entrypoint
- `App.tsx` – main SPA (frontpage sections + chat drawer + generator + `/admin` route detection)
- `AdminDashboard.tsx` – admin panel UI (edits config + import/export)
- `appConfig.ts` – config schema, defaults, localStorage helpers
- `services/geminiService.ts` – Gemini calls (uses config from `localStorage`)
- `types.ts` – shared types/enums
- `vite.config.ts` – Vite config + env injection for `GEMINI_API_KEY`

## Running locally

**Prerequisites:** Node.js 18+ recommended

1. Install dependencies:
   - `npm install`
2. Create `.env.local` (or edit existing) with:
   - `GEMINI_API_KEY=...`
3. Run dev server:
   - `npm run dev`
4. Open:
   - `http://localhost:3000`

## Running in GitHub Codespaces

This repo includes a devcontainer configuration in `.devcontainer/`.

After you create a Codespace:

- Start API:
  - `npm run server:dev`
- Start frontend:
  - `npm run dev`

If you want Gemini locally in Codespaces, add `GEMINI_API_KEY` to Codespaces Secrets and create `.env.local` based on `.env.example`.

## Build & preview

- Build production assets:
  - `npm run build`
- Preview the built app locally:
  - `npm run preview`

Vite outputs to `dist/`.

## Admin dashboard (`/admin`)

Open:

- `https://ifairy.co.uk/admin` (production)
- `http://localhost:3000/admin` (local dev)

What you can edit:

- **Frontpage sections**: `Intro`, `Purpose`, `Manifesto (About)`, `Archive`, `Vision`, `Mission`
  - Each section has an `Enabled/Disabled` toggle.
  - Text fields are used by the frontpage render in `App.tsx`.
- **AI settings**
  - `Gemini API key` (optional override)
  - Chat: `model`, `systemInstruction`, `temperature`
  - Dream generator: `model`, `systemInstruction`, `temperature`
- **Import/Export JSON**
  - Export is redacted by default (API key removed), with an option to include it.
  - Import replaces the current config stored in the browser.

### Persistence model (important)

Edits are stored in the **browser** (localStorage):

- Key: `ifairy:appConfig:v1` (see `appConfig.ts`)

This means:

- Changes are per-device/per-browser (not global).
- If you want global content changes for all visitors, you must:
  - either bake changes into `defaultAppConfig` in `appConfig.ts`, or
  - add a backend to store config server-side.

## Gemini API key behavior

The app can get the Gemini API key from two places:

1. **Admin dashboard override** (stored in `localStorage`):
   - `appConfig.ai.geminiApiKey`
2. **Build-time env** injected by Vite:
   - `GEMINI_API_KEY` from `.env.local` is injected into `process.env.API_KEY` by `vite.config.ts`

Resolution order is:

1) `appConfig.ai.geminiApiKey` if present  
2) `process.env.API_KEY` if present and not `PLACEHOLDER_API_KEY`  

If no key is available, AI features show a helpful “AI disabled” message.

## Deployment notes (this server)

This app is deployed as a static Vite build.

On this host, nginx is configured to serve built assets from:

- `/home/admin/web/ifairy.co.uk/public_html/dist`

Files created for that:

- `/home/admin/conf/web/ifairy.co.uk/nginx.conf_dist.conf`
- `/home/admin/conf/web/ifairy.co.uk/nginx.ssl.conf_dist.conf`

And the project root has:

- `/home/admin/web/ifairy.co.uk/public_html/.htaccess` (fallback rules + safety denies)

Typical deploy flow on the server:

1. `npm install`
2. `npm run build`
3. (optional) reload web server configs if changed:
   - `systemctl reload nginx`

## Admin integrations (Google Workspace + GitHub)

The admin panel supports OAuth integrations stored in MySQL table `admin_auth_provider`:

- Google Workspace: login + Drive + YouTube
- GitHub: repos + Codespaces

**Server env required (see `server/.env.example`):**

- `ADMIN_SESSION_SECRET` (cookie signing)
- `ENCRYPTION_KEY` (encrypt tokens at rest)
- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- GitHub: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI`
- Optional restrictions:
  - `ALLOWED_GOOGLE_DOMAIN`
  - `ALLOWED_ADMIN_EMAILS` (comma-separated)

**UI:**

- `https://ifairy.co.uk/admin/integrations`

## Security notes

- Do not commit real API keys to git.
- If you want to restrict `/admin`, do it at the server layer (Basic Auth / IP allowlist), not in client-side JS.
