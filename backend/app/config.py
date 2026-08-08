import os

from dotenv import load_dotenv

load_dotenv()  # reads backend/.env if present — see .env.example

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Model names change FREQUENTLY — Google has deprecated multiple Gemini
# model generations within months of each other. If this stops working
# with a 404 "model no longer available" error, check
# https://ai.google.dev/gemini-api/docs/models for the current stable
# model name and set GEMINI_MODEL in your .env — no code change needed.
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

# --- Auth (Phase 9) ---
# JWT_SECRET signs auth tokens. The fallback below is fine for local dev
# ONLY — if this were ever deployed (Phase 12), a real random secret MUST
# be set via environment variable, or anyone could forge valid login
# tokens. main.py prints a warning at startup if this default is in use.
JWT_SECRET = os.getenv("JWT_SECRET", "dev-insecure-secret-change-me-before-deploying")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))  # 24 hours
