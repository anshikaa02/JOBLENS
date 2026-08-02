from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.match import MatchResult
from app.services.pdf_parser import extract_text_from_pdf
from app.services.text_matcher import compute_match

router = APIRouter(prefix="/api/match", tags=["match"])

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
MIN_JD_LENGTH = 30


@router.post("/analyze", response_model=MatchResult)
async def analyze_match(
    file: UploadFile = File(...),
    job_description: str = Form(...),
) -> MatchResult:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    if len(job_description.strip()) < MIN_JD_LENGTH:
        raise HTTPException(
            status_code=400,
            detail="Paste the full job description — that was too short to match against.",
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large — please upload a PDF under 5MB.")

    resume_text = extract_text_from_pdf(file_bytes)
    return compute_match(resume_text, job_description)
