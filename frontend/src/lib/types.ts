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
