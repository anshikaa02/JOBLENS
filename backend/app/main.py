from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import resume, match, career_ai

app = FastAPI(
    title="JobLens API",
    description="Resume analysis, job matching, and AI career features.",
    version="0.1.0",
)

# In Phase 12 (deployment), replace "*" with the deployed frontend's real
# origin (e.g. https://joblens.vercel.app) — wide open CORS is fine for
# local development only.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)
app.include_router(match.router)
app.include_router(career_ai.router)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
