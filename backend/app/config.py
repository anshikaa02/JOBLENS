import os

from dotenv import load_dotenv

load_dotenv()  # reads backend/.env if present — see .env.example

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Model names change over time — if this stops working, check
# https://ai.google.dev/gemini-api/docs/models for current options and
# set GEMINI_MODEL in your .env instead of editing code.
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
