/**
 * Domain types for JobLens data. These are written as if a real backend
 * already returns this shape — so when Phase 9 adds FastAPI, the response
 * bodies just need to match these interfaces and nothing else changes.
 */

export interface ResumeSummary {
  id: string;
  fileName: string;
  uploadedAt: string; // ISO date string
  atsScore: number; // 0-100
  status: "analyzed" | "processing" | "needs-update";
}

export interface JobMatch {
  id: string;
  jobTitle: string;
  company: string;
  matchScore: number; // 0-100
  missingKeywords: string[];
  analyzedAt: string; // ISO date string
}

export type ActivityType = "upload" | "match" | "ai-suggestion" | "cover-letter";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  label: string;
  timestamp: string; // ISO date string
}

/**
 * Resume analysis types — these mirror backend/app/schemas/resume.py
 * exactly. If you change one side, change the other, or the shapes
 * will silently drift apart (nothing enforces this across the language
 * boundary — worth knowing as a limitation of this architecture).
 */
export interface ScoreBreakdownItem {
  label: string;
  points_earned: number;
  points_possible: number;
  passed: boolean;
}

export interface ResumeAnalysis {
  file_name: string;
  word_count: number;
  ats_score: number;
  breakdown: ScoreBreakdownItem[];
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  suggestions: string[];
}

/** Mirrors backend/app/schemas/match.py exactly. */
export interface MatchResult {
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
}
