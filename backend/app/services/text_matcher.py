"""
Job matching — Phase 7.

Classic NLP approach, not an LLM: TF-IDF (Term Frequency-Inverse Document
Frequency) turns both the resume and the job description into weighted
word vectors, then cosine similarity measures the angle between those two
vectors as the match score. This is a well-established technique (used in
search engines and document-similarity tools for decades) — appropriate
here because "how much does this resume's vocabulary overlap with this
job description's vocabulary" is exactly the problem TF-IDF was designed
for, and it requires no API calls, no cost per request, and returns
identical results for identical inputs.
"""

import re

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.schemas.match import MatchResult

CLEAN_RE = re.compile(r"[^a-z0-9\s]")
WHITESPACE_RE = re.compile(r"\s+")

# Important for the keyword-extraction step below: skip words too generic
# to be meaningful "missing skills" even if they appear often.
GENERIC_STOPWORDS = {
    "role", "team", "work", "job", "company", "years", "experience",
    "strong", "ability", "skills", "candidate", "responsibilities",
    "plus", "looking", "ideal", "required", "best",
}


def clean_text(text: str) -> str:
    """Lowercase, strip punctuation/digits-as-noise, collapse whitespace."""
    lowered = text.lower()
    no_punct = CLEAN_RE.sub(" ", lowered)
    return WHITESPACE_RE.sub(" ", no_punct).strip()


def compute_match(resume_text: str, job_description: str, top_n: int = 15) -> MatchResult:
    resume_clean = clean_text(resume_text)
    jd_clean = clean_text(job_description)

    # --- Match score: joint TF-IDF + cosine similarity ---
    # Fitting the vectorizer on BOTH documents together is what makes the
    # resulting vectors comparable by angle (cosine similarity) — this
    # correctly measures overall vocabulary overlap between the two texts.
    similarity_vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
    tfidf_matrix = similarity_vectorizer.fit_transform([resume_clean, jd_clean])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    match_score = round(float(similarity) * 100)

    # --- Keyword extraction: plain term frequency within the JD alone ---
    # Deliberately NOT reusing the joint TF-IDF vector above for this part.
    # TF-IDF fit jointly on 2 documents actually DOWN-weights terms shared
    # by both (their IDF is lower because they appear in more of the
    # corpus) — so a term like "React" that's in both the resume AND the
    # JD would rank *below* a JD-only term like "Docker", which is
    # mathematically correct but produces a confusing "missing skills"
    # list. What we actually want here is simpler: "what does this JD
    # emphasize most, and is that word anywhere in the resume?" — that's
    # plain term frequency, which CountVectorizer gives directly.
    count_vectorizer = CountVectorizer(stop_words="english", max_features=100)
    jd_counts = count_vectorizer.fit_transform([jd_clean]).toarray()[0]
    feature_names = count_vectorizer.get_feature_names_out()
    ranked_indices = jd_counts.argsort()[::-1]

    matched: list[str] = []
    missing: list[str] = []
    resume_words = set(resume_clean.split())

    for idx in ranked_indices:
        term = feature_names[idx]
        if jd_counts[idx] <= 0:
            break
        if term in GENERIC_STOPWORDS:
            continue
        if term in resume_words:
            matched.append(term)
        else:
            missing.append(term)
        if len(matched) + len(missing) >= top_n:
            break

    return MatchResult(
        match_score=match_score,
        matched_keywords=matched,
        missing_keywords=missing,
    )
