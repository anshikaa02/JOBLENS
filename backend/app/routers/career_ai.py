from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.career_ai import (
    BulletImprovementResponse,
    CoverLetterResponse,
    InterviewQuestionsResponse,
)
from app.services.pdf_parser import extract_text_from_pdf
from app.services import gemini_client

router = APIRouter(prefix="/api/career-ai", tags=["career-ai"])

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024


async def _read_resume_text(file: UploadFile) -> str:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large — please upload a PDF under 5MB.")
    return extract_text_from_pdf(file_bytes)


@router.post("/improve-bullets", response_model=BulletImprovementResponse)
async def improve_bullets(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
) -> BulletImprovementResponse:
    resume_text = await _read_resume_text(file)
    return gemini_client.improve_bullets(resume_text, job_description)


@router.post("/cover-letter", response_model=CoverLetterResponse)
async def cover_letter(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    company_name: Optional[str] = Form(None),
) -> CoverLetterResponse:
    if len(job_description.strip()) < 30:
        raise HTTPException(status_code=400, detail="Paste the full job description.")
    resume_text = await _read_resume_text(file)
    return gemini_client.generate_cover_letter(resume_text, job_description, company_name)


@router.post("/interview-questions", response_model=InterviewQuestionsResponse)
async def interview_questions(
    file: UploadFile = File(...),
    job_description: str = Form(...),
) -> InterviewQuestionsResponse:
    if len(job_description.strip()) < 30:
        raise HTTPException(status_code=400, detail="Paste the full job description.")
    resume_text = await _read_resume_text(file)
    return gemini_client.generate_interview_questions(resume_text, job_description)
