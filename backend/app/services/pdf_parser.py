import io

import pdfplumber
from fastapi import HTTPException


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract plain text from a PDF's bytes using pdfplumber, page by page.
    Raises HTTPException(400) if the PDF has no extractable text (e.g. it's
    a scanned image with no text layer — OCR is out of scope for this MVP).
    """
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages_text = [page.extract_text() or "" for page in pdf.pages]
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Couldn't read this PDF: {exc}") from exc

    text = "\n".join(pages_text).strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail=(
                "No text could be extracted from this PDF. It may be a "
                "scanned image without a text layer — try exporting your "
                "resume directly from Word/Google Docs instead."
            ),
        )

    return text
