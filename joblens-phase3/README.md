# JobLens — Phase 1, 2 & 3 (TypeScript)

AI resume analyzer & job matcher. Covers **Phase 1 (setup)**, **Phase 2
(design system)**, and **Phase 3 (full landing page)**, in TypeScript.

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
      ui/       Button.tsx, Card.tsx, ScoreGauge.tsx — the reusable design system
      layout/   Sidebar.tsx, Navbar.tsx, AppLayout.tsx, Footer.tsx — app shell + shared footer
      landing/  SiteNav.tsx, Hero.tsx, Features.tsx, HowItWorks.tsx,
                Testimonials.tsx, CTA.tsx — landing page sections (Phase 3)
    pages/      Landing.tsx (full, Phase 3), Dashboard.tsx (placeholder, real in Phase 5)
    lib/utils.ts  cn() classname helper
    index.css     Design tokens (@theme block) — colors, fonts, radii, scan-ruler motifs
    vite-env.d.ts Vite's ambient type declarations
  tsconfig.json / tsconfig.app.json / tsconfig.node.json
```

`npm run build` runs `tsc -b` (type-check) before `vite build`.

## Next phases

Reply with "continue" or "Phase 3" to get the full landing page (hero,
features, how it works, testimonials, footer, CTA) built out next.
