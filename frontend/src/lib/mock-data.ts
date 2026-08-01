import type { ResumeSummary, JobMatch, ActivityItem } from "@/lib/types";

/**
 * MOCK DATA — Phase 5 scaffolding only.
 *
 * There's no backend yet (Phase 9), so this simulates what a real
 * `GET /api/dashboard` response will eventually look like. The shape here
 * matches lib/types.ts exactly, so when Phase 9 lands, useDashboardData()
 * (in hooks/useDashboardData.ts) swaps its body for a real axios call and
 * every component consuming it is unaffected.
 */

const MOCK_RESUME: ResumeSummary = {
  id: "resume_1",
  fileName: "Riya_Sharma_Resume.pdf",
  uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6h ago
  atsScore: 78,
  status: "analyzed",
};

const MOCK_MATCHES: JobMatch[] = [
  {
    id: "match_1",
    jobTitle: "Senior Frontend Engineer",
    company: "Nimbus Systems",
    matchScore: 82,
    missingKeywords: ["GraphQL", "Storybook"],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "match_2",
    jobTitle: "Full Stack Developer",
    company: "Fieldstone Labs",
    matchScore: 67,
    missingKeywords: ["Docker", "PostgreSQL", "CI/CD"],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: "match_3",
    jobTitle: "React Developer",
    company: "Kettlebell Health",
    matchScore: 74,
    missingKeywords: ["Accessibility", "Testing Library"],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
  },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "act_1",
    type: "match",
    label: "Matched against Senior Frontend Engineer @ Nimbus Systems",
    timestamp: MOCK_MATCHES[0].analyzedAt,
  },
  {
    id: "act_2",
    type: "upload",
    label: "Uploaded Riya_Sharma_Resume.pdf",
    timestamp: MOCK_RESUME.uploadedAt,
  },
  {
    id: "act_3",
    type: "ai-suggestion",
    label: "Generated 4 bullet-point rewrites",
    timestamp: MOCK_MATCHES[1].analyzedAt,
  },
  {
    id: "act_4",
    type: "cover-letter",
    label: "Drafted cover letter for Fieldstone Labs",
    timestamp: MOCK_MATCHES[1].analyzedAt,
  },
];

export interface DashboardData {
  resume: ResumeSummary | null;
  matches: JobMatch[];
  activity: ActivityItem[];
}

/** Simulates GET /api/dashboard with realistic network latency. */
export async function fetchDashboardData(): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 450));
  return {
    resume: MOCK_RESUME,
    matches: MOCK_MATCHES,
    activity: MOCK_ACTIVITY,
  };
}
