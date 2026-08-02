# JobLens — Phase 1–7 (TypeScript + FastAPI)

AI resume analyzer & job matcher. Covers Phases 1–7: setup, design system,
landing page, authentication (mocked), dashboard (mock data), Resume
Analyzer (real, rule-based ATS scoring), and now **Job Matcher — real
TF-IDF + cosine similarity, no mocking.**

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
    main.py                    FastAPI app + CORS
    routers/
      resume.py                POST /api/resume/analyze
      match.py                 POST /api/match/analyze
    services/
      pdf_parser.py            pdfplumber text extraction
      ats_scorer.py             rule-based scoring (see its docstring)
      text_matcher.py          TF-IDF + cosine similarity (see its docstring
                                 for why keyword ranking uses a SEPARATE
                                 CountVectorizer, not the same TF-IDF matrix)
    schemas/
      resume.py, match.py       Pydantic models — the frontend/backend contract
  requirements.txt
  README.md
```

`npm run build` runs `tsc -b` (type-check) before `vite build`.

## Next phases

Reply with "continue" or "Phase 3" to get the full landing page (hero,
features, how it works, testimonials, footer, CTA) built out next.
