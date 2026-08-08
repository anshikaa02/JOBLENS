from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import JWT_SECRET
from app.routers import resume, match, career_ai, auth

app = FastAPI(
    title="JobLens API",
    description="Resume analysis, job matching, and AI career features.",
    version="0.1.0",
)

if JWT_SECRET == "dev-insecure-secret-change-me-before-deploying":
    print(
        "\n⚠️  WARNING: JWT_SECRET is using the default dev value. "
        "Set a real random JWT_SECRET in backend/.env before deploying anywhere "
        "other than your own machine — anyone with this default could forge "
        "valid login tokens.\n"
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

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(match.router)
app.include_router(career_ai.router)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
