from pydantic import BaseModel, Field


class BulletImprovement(BaseModel):
    original: str = Field(description="The original bullet point, verbatim from the resume.")
    improved: str = Field(description="A rewritten version using a stronger action verb and, where possible, a quantifiable result.")
    reasoning: str = Field(description="One short sentence explaining what changed and why.")


class BulletImprovementResponse(BaseModel):
    improvements: list[BulletImprovement]


class CoverLetterResponse(BaseModel):
    cover_letter: str = Field(description="A complete, ready-to-send cover letter, 3-4 paragraphs.")


class InterviewQuestion(BaseModel):
    question: str
    why_asked: str = Field(description="One short sentence on what gap or requirement in the job description prompted this question.")


class InterviewQuestionsResponse(BaseModel):
    questions: list[InterviewQuestion]
