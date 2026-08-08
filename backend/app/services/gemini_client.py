"""
Career AI — Phase 8. This is the only part of JobLens that calls an LLM.

Everything before this phase (ATS scoring, job matching) was deliberately
rule-based/statistical, because those were well-defined, deterministic
problems. Rewriting a bullet point well, writing a cover letter, and
predicting likely interview questions are NOT well-defined problems —
they require judgment, tone, and language generation, which is exactly
what LLMs are for and rule-based heuristics are bad at. This is the
dividing line to be able to explain: use classical NLP/statistics when
the problem is measurable and deterministic; use an LLM when the problem
is genuinely generative/subjective.

Prompt engineering choices, explained inline near each function:
- Every prompt states the exact task, constraints, and input data as
  clearly-delimited sections (not one run-on paragraph).
- response_schema forces Gemini to return JSON matching our Pydantic
  models exactly — no regex-parsing free-form text out of an LLM
  response, which is a fragile anti-pattern.
- temperature is tuned per task: lower (more deterministic) for
  interview questions and bullet rewrites, since we want reliable,
  grounded output; slightly higher for the cover letter, since it
  benefits from more natural, varied phrasing.
"""

from google import genai
from google.genai import types
from fastapi import HTTPException

from app.config import GEMINI_API_KEY, GEMINI_MODEL
from app.schemas.career_ai import (
    BulletImprovementResponse,
    CoverLetterResponse,
    InterviewQuestionsResponse,
)
from app.services.text_utils import extract_bullet_lines

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "GEMINI_API_KEY is not set on the server. Add it to backend/.env "
                "(copy .env.example) and restart uvicorn."
            ),
        )
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def _call_gemini(prompt: str, response_schema, temperature: float):
    client = _get_client()
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=temperature,
            ),
        )
    except Exception as exc:  # Gemini SDK errors are broad; surface a clean 502
        raise HTTPException(status_code=502, detail=f"AI service error: {exc}") from exc

    if response.parsed is None:
        raise HTTPException(status_code=502, detail="AI service returned an unparseable response.")
    return response.parsed


def improve_bullets(resume_text: str, job_description: str | None = None) -> BulletImprovementResponse:
    bullets = extract_bullet_lines(resume_text)
    if not bullets:
        raise HTTPException(
            status_code=400,
            detail="No bullet points detected in this resume — nothing to rewrite.",
        )

    jd_context = (
        f"\n\nTAILOR TOWARD THIS JOB DESCRIPTION where relevant (don't invent skills the "
        f"candidate doesn't have):\n{job_description}"
        if job_description
        else ""
    )

    prompt = f"""You are a resume editor helping a job seeker strengthen their bullet points.

TASK: For each bullet point below, rewrite it to:
1. Start with a strong action verb (Led, Built, Reduced, Increased — not "Responsible for")
2. Include a quantifiable result if one is plausible from context (%, $, time, count) —
   but NEVER invent a specific number that isn't implied by the original bullet.
3. Stay truthful to what the original bullet actually claims. Do not add skills,
   technologies, or achievements the original didn't mention.

BULLET POINTS TO REWRITE:
{chr(10).join(f"- {b}" for b in bullets)}
{jd_context}

For each one, return the original, the improved version, and one short sentence
explaining what changed."""

    return _call_gemini(prompt, BulletImprovementResponse, temperature=0.4)


def generate_cover_letter(
    resume_text: str, job_description: str, company_name: str | None = None
) -> CoverLetterResponse:
    company_line = f"The company is {company_name}." if company_name else ""

    prompt = f"""You are helping a job seeker write a cover letter.

TASK: Write a complete, ready-to-send cover letter (3-4 paragraphs) that:
1. Opens by naming the specific role from the job description below (not a generic greeting)
2. Draws 2-3 SPECIFIC, concrete examples from the candidate's actual resume that
   match what the job description asks for — do not invent experience the resume
   doesn't contain
3. Closes with a brief, confident call to action
4. Avoids generic filler phrases like "I am a hard worker" or "I am excited about this opportunity"
   without backing it up with a specific reason tied to the role
{company_line}

CANDIDATE'S RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}"""

    return _call_gemini(prompt, CoverLetterResponse, temperature=0.6)


def generate_interview_questions(resume_text: str, job_description: str) -> InterviewQuestionsResponse:
    prompt = f"""You are a hiring manager preparing interview questions for a candidate.

TASK: Generate 6-8 realistic interview questions this candidate would likely be
asked for this specific role, based on:
1. Gaps or unclear areas between their resume and the job description
2. Specific technologies/claims on their resume worth probing deeper
3. Standard questions for this type of role

For each question, briefly explain what prompted it (a gap, a claim to verify, etc).
Do not ask generic questions unrelated to this specific resume and job description.

CANDIDATE'S RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}"""

    return _call_gemini(prompt, InterviewQuestionsResponse, temperature=0.5)
