"""
ATS scoring — Phase 6.

This is deliberately RULE-BASED, not AI-based. Gemini-powered rewrite
suggestions and career advice come in Phase 8. This module answers a
narrower question: "would a typical Applicant Tracking System parse this
resume cleanly, and does it follow structural best practices?" That's a
well-defined, testable problem — a real ATS mostly cares about parseable
structure and keyword presence, not writing quality — so a heuristic
scorer is the right tool, not an LLM call.

Each heuristic is a `ScoreBreakdownItem` worth a fixed number of points.
Scores sum to 100. This makes the total score interpretable and each
sub-score independently unit-testable.
"""

import re

from app.schemas.resume import ScoreBreakdownItem, ResumeAnalysis

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"(\+?\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}")
BULLET_LINE_RE = re.compile(r"^\s*([•\-\*▪●]|(\d+[\.\)]))\s+")
NUMBER_RE = re.compile(r"\d")

SECTION_HEADERS = {
    "experience": ["experience", "work experience", "employment history"],
    "education": ["education", "academic background"],
    "skills": ["skills", "technical skills", "core competencies"],
    "summary": ["summary", "objective", "profile"],
    "projects": ["projects", "personal projects"],
}

ACTION_VERBS = {
    "led", "built", "managed", "developed", "created", "improved", "increased",
    "designed", "implemented", "launched", "reduced", "optimized", "automated",
    "delivered", "architected", "spearheaded", "drove", "streamlined",
    "mentored", "coordinated", "analyzed", "engineered", "deployed",
    "collaborated", "resolved", "achieved", "generated", "established",
}

# Generic in-demand keywords used for a general "what's commonly missing"
# check when there's no job description to compare against yet. Once a
# specific job description is supplied (Phase 7 — Job Matcher), missing
# skills become job-specific via TF-IDF, which is far more useful than this
# generic list. This exists purely to give resume-only analysis something
# to say here in Phase 6.
COMMON_SKILLS = [
    "git", "sql", "python", "javascript", "typescript", "react", "api",
    "testing", "agile", "communication", "leadership", "docker", "cloud",
    "ci/cd",
]


def _score_contact_info(text: str) -> ScoreBreakdownItem:
    has_email = bool(EMAIL_RE.search(text))
    has_phone = bool(PHONE_RE.search(text))
    passed = has_email and has_phone
    return ScoreBreakdownItem(
        label="Contact information",
        points_earned=10 if passed else (5 if (has_email or has_phone) else 0),
        points_possible=10,
        passed=passed,
    )


def _score_sections(text: str) -> ScoreBreakdownItem:
    lower = text.lower()
    found = 0
    for _, aliases in SECTION_HEADERS.items():
        if any(alias in lower for alias in aliases):
            found += 1
    points = round((found / len(SECTION_HEADERS)) * 20)
    return ScoreBreakdownItem(
        label="Standard section headers",
        points_earned=points,
        points_possible=20,
        passed=found >= 4,
    )


def _score_bullets(lines: list[str]) -> ScoreBreakdownItem:
    non_empty = [l for l in lines if l.strip()]
    if not non_empty:
        return ScoreBreakdownItem(label="Bullet-point structure", points_earned=0, points_possible=15, passed=False)
    bullet_lines = [l for l in non_empty if BULLET_LINE_RE.match(l)]
    ratio = len(bullet_lines) / len(non_empty)
    points = round(min(ratio * 2, 1) * 15)  # 50%+ bullet lines = full marks
    return ScoreBreakdownItem(
        label="Bullet-point structure",
        points_earned=points,
        points_possible=15,
        passed=ratio >= 0.25,
    )


def _score_action_verbs(lines: list[str]) -> ScoreBreakdownItem:
    bullet_lines = [l for l in lines if BULLET_LINE_RE.match(l)]
    if not bullet_lines:
        return ScoreBreakdownItem(label="Action-verb usage", points_earned=0, points_possible=20, passed=False)
    starts_with_verb = 0
    for line in bullet_lines:
        stripped = BULLET_LINE_RE.sub("", line).strip().lower()
        first_word = stripped.split(" ")[0] if stripped else ""
        if first_word.rstrip(".,") in ACTION_VERBS:
            starts_with_verb += 1
    ratio = starts_with_verb / len(bullet_lines)
    points = round(min(ratio * 1.5, 1) * 20)
    return ScoreBreakdownItem(
        label="Action-verb usage",
        points_earned=points,
        points_possible=20,
        passed=ratio >= 0.4,
    )


def _score_quantifiable_results(lines: list[str]) -> ScoreBreakdownItem:
    bullet_lines = [l for l in lines if BULLET_LINE_RE.match(l)]
    if not bullet_lines:
        return ScoreBreakdownItem(label="Quantifiable achievements", points_earned=0, points_possible=20, passed=False)
    with_numbers = sum(1 for l in bullet_lines if NUMBER_RE.search(l))
    ratio = with_numbers / len(bullet_lines)
    points = round(min(ratio * 2.5, 1) * 20)
    return ScoreBreakdownItem(
        label="Quantifiable achievements",
        points_earned=points,
        points_possible=20,
        passed=ratio >= 0.3,
    )


def _score_length(word_count: int) -> ScoreBreakdownItem:
    if 350 <= word_count <= 900:
        points, passed = 15, True
    elif 250 <= word_count < 350 or 900 < word_count <= 1100:
        points, passed = 9, False
    else:
        points, passed = 3, False
    return ScoreBreakdownItem(label="Resume length", points_earned=points, points_possible=15, passed=passed)


def _missing_skills(text: str) -> list[str]:
    lower = text.lower()
    return [skill for skill in COMMON_SKILLS if skill not in lower]


def _suggestions_for(breakdown: list[ScoreBreakdownItem]) -> list[str]:
    suggestions = []
    for item in breakdown:
        if item.passed:
            continue
        if item.label == "Contact information":
            suggestions.append("Add a clear email and phone number near the top of your resume.")
        elif item.label == "Standard section headers":
            suggestions.append("Use standard section headers (Experience, Education, Skills) so ATS software can parse them.")
        elif item.label == "Bullet-point structure":
            suggestions.append("Break paragraphs into bullet points — ATS and recruiters both scan bullets faster than prose.")
        elif item.label == "Action-verb usage":
            suggestions.append("Start bullet points with strong action verbs (Led, Built, Improved) instead of passive phrasing.")
        elif item.label == "Quantifiable achievements":
            suggestions.append("Add numbers to your bullets — % improved, $ saved, users affected, time reduced.")
        elif item.label == "Resume length":
            suggestions.append("Aim for roughly 350–900 words — long enough to show impact, short enough to stay skimmable.")
    return suggestions


def analyze_resume(file_name: str, text: str) -> ResumeAnalysis:
    lines = text.splitlines()
    word_count = len(text.split())

    breakdown = [
        _score_contact_info(text),
        _score_sections(text),
        _score_bullets(lines),
        _score_action_verbs(lines),
        _score_quantifiable_results(lines),
        _score_length(word_count),
    ]

    ats_score = sum(item.points_earned for item in breakdown)
    strengths = [item.label for item in breakdown if item.passed]
    weaknesses = [item.label for item in breakdown if not item.passed]

    return ResumeAnalysis(
        file_name=file_name,
        word_count=word_count,
        ats_score=ats_score,
        breakdown=breakdown,
        strengths=strengths,
        weaknesses=weaknesses,
        missing_skills=_missing_skills(text),
        suggestions=_suggestions_for(breakdown),
    )
