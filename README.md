# JobLens — Phase 1–9 (TypeScript + FastAPI + Gemini + real auth)

Covers Phases 1–9. **Phase 4's mocked auth is now fully replaced** — real
signup/login against the backend, PBKDF2 password hashing, real
server-signed JWTs, and session verification on page load. Still using
local JSON file storage for user data (explicitly allowed by the original
project spec for the MVP) — MongoDB replaces this in Phase 10.

## New required setup: JWT_SECRET

Add to `backend/.env` (alongside your existing `GEMINI_API_KEY`):
```
JWT_SECRET=<any long random string>
```
Generate one with:
```
python -c "import secrets; print(secrets.token_hex(32))"
```
Without this, the app still runs and works fully for local development —
it falls back to an insecure default and prints a clear warning at
startup — but you should set a real one before this ever gets deployed
anywhere beyond your own machine.

## Where user accounts are stored

`backend/app/data/users.json` — created automatically on first signup,
git-ignored (so test accounts never get committed). Passwords are never
stored in plaintext — see `backend/app/services/security.py`.

## Two servers now run together

- `frontend/` — Vite dev server, port 5173
- `backend/` — FastAPI/uvicorn, port 8000

Both must be running for the Resume Analyzer page to work. See
`backend/README.md` for backend setup instructions (Python venv, pip
install, uvicorn).

## ⚠️ Still-mocked data layers

1. **Auth** (`frontend/src/lib/auth-context.tsx`) — unsigned token in
   localStorage. Real JWT auth arrives in Phase 9.
2. **Dashboard data** (`frontend/src/lib/mock-data.ts`) — hardcoded resume/
   match/activity data. Real API call arrives in Phase 9.

**Resume analysis is NOT mocked** — it's a real FastAPI endpoint doing real
PDF text extraction and real rule-based scoring. See
`backend/app/services/ats_scorer.py` for why this phase used a rule-based
scorer rather than an LLM call (Gemini AI features are Phase 8).

## Run it

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — you'll see the placeholder landing page, and
`/app` for the dashboard shell (real data lands in Phase 5).

## Design direction

The app is styled as a dark "instrument panel" that measures resumes — not a
generic bright-blue SaaS dashboard. Resume/job-description content sits on a
warm paper surface inset into the dark frame (see `Card variant="paper"`).
The accent is a muted brass/gold, evoking a highlighter or measuring tool. The
signature component is `ScoreGauge` — a tick-marked instrument dial (not a
generic circular progress bar) used for ATS score and match %.

Fonts: Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (data/scores).

## Structure

```
frontend/
  src/
    components/
      ui/       Button, Card, Input, ScoreGauge, Badge, ProgressBar, FileDropzone
      layout/   Sidebar, Navbar, AppLayout, Footer
      landing/  SiteNav, Hero, Features, HowItWorks, Testimonials, CTA
      auth/     ProtectedRoute
    pages/
      Landing, Login, Signup, Dashboard
      ResumeAnalyzer.tsx   real feature — uploads to the FastAPI backend
      ComingSoon.tsx        placeholder for matcher/career-ai/history/settings
    hooks/useDashboardData.ts
    lib/
      types.ts       includes ResumeAnalysis, matching backend/app/schemas/resume.py
      api.ts         axios instance, baseURL "/api"
      mock-data.ts, auth-context.tsx, validation.ts, format.ts, utils.ts

backend/
  app/
    main.py                    FastAPI app + CORS + JWT_SECRET startup warning
    config.py                  loads all env vars (Gemini + JWT) from .env
    dependencies.py            get_current_user — the auth guard for protected routes
    routers/
      auth.py                  POST /api/auth/{signup,login}, GET /api/auth/me
      resume.py                POST /api/resume/analyze
      match.py                 POST /api/match/analyze
      career_ai.py             POST /api/career-ai/{improve-bullets,cover-letter,interview-questions}
    services/
      security.py              PBKDF2 password hashing + JWT create/decode (see its docstring)
      json_store.py            generic JSON file read/write — MongoDB replaces this in Phase 10
      user_store.py            user CRUD, built on json_store.py
      pdf_parser.py, ats_scorer.py, text_matcher.py, text_utils.py, gemini_client.py
    schemas/
      auth.py, resume.py, match.py, career_ai.py
    data/                       git-ignored — users.json lives here, created on first signup
  .env.example                 GEMINI_API_KEY, GEMINI_MODEL, JWT_SECRET, JWT_EXPIRE_MINUTES
  requirements.txt
  README.md

frontend/
  src/lib/
    api.ts                     axios instance + auth interceptor (attaches JWT automatically)
                                 + extractErrorMessage() shared across pages
    auth-context.tsx           REAL auth now — calls the backend, verifies session via /auth/me
  ... (all Phase 1-8 files unchanged)
```

`npm run build` runs `tsc -b` (type-check) before `vite build`.

## Next phases

Reply with "continue" or "Phase 3" to get the full landing page (hero,
features, how it works, testimonials, footer, CTA) built out next.
