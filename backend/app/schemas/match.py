from pydantic import BaseModel


class MatchResult(BaseModel):
    """Response returned by POST /api/match/analyze."""
    match_score: int  # 0-100, cosine similarity scaled
    matched_keywords: list[str]
    missing_keywords: list[str]
