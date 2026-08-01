from pydantic import BaseModel


class ScoreBreakdownItem(BaseModel):
    """One scored dimension of the resume (e.g. 'Action verbs')."""
    label: str
    points_earned: int
    points_possible: int
    passed: bool


class ResumeAnalysis(BaseModel):
    """Full response returned by POST /api/resume/analyze."""
    file_name: str
    word_count: int
    ats_score: int  # 0-100, sum of ScoreBreakdownItem.points_earned
    breakdown: list[ScoreBreakdownItem]
    strengths: list[str]
    weaknesses: list[str]
    missing_skills: list[str]
    suggestions: list[str]
