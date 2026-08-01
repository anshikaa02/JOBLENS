from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.resume import ResumeAnalysis
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ats_scorer import analyze_resume

router = APIRouter(prefix="/api/resume", tags=["resume"])

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/analyze", response_model=ResumeAnalysis)
async def analyze(file: UploadFile = File(...)) -> ResumeAnalysis:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large — please upload a PDF under 5MB.")

    text = extract_text_from_pdf(file_bytes)
    return analyze_resume(file.filename or "resume.pdf", text)
