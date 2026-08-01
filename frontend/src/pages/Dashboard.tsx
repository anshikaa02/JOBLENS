import { Link } from "react-router-dom";
import {
  Upload,
  FileText,
  Target,
  Sparkles,
  History as HistoryIcon,
  UploadCloud,
  ScanText,
  MessageSquareText,
  FileEdit,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import ScoreGauge from "@/components/ui/ScoreGauge";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAuth } from "@/lib/auth-context";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatRelativeTime } from "@/lib/format";
import type { ActivityType } from "@/lib/types";

const STATUS_BADGE: Record<string, { tone: "good" | "warn" | "neutral"; label: string }> = {
  analyzed: { tone: "good", label: "Analyzed" },
  processing: { tone: "neutral", label: "Processing" },
  "needs-update": { tone: "warn", label: "Needs update" },
};

const ACTIVITY_ICON: Record<ActivityType, typeof Upload> = {
  upload: UploadCloud,
  match: Target,
  "ai-suggestion": Sparkles,
  "cover-letter": FileEdit,
};

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-[var(--radius-card)] bg-ink-850" />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <Card>
        <CardBody className="pt-5 text-sm text-signal-bad">
          {error ?? "Something went wrong loading your dashboard."}
        </CardBody>
      </Card>
    );
  }

  const { resume, matches, activity } = data;
  const statusInfo = resume ? STATUS_BADGE[resume.status] : null;

  return (
    <div className="space-y-4">
      {/* Welcome + quick actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-tight text-text-hi">
            Welcome back, {firstName}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Here's where your job search stands right now.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} to="/app/analyzer" size="sm" icon={Upload}>
            Upload resume
          </Button>
          <Button as={Link} to="/app/matcher" variant="secondary" size="sm" icon={Target}>
            Match a job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* ATS Score */}
        <Card>
          <CardHeader>
            <CardTitle>ATS Score</CardTitle>
          </CardHeader>
          <CardBody className="flex justify-center">
            {resume ? (
              <ScoreGauge score={resume.atsScore} label="Current resume" />
            ) : (
              <p className="text-sm text-text-muted">No resume analyzed yet.</p>
            )}
          </CardBody>
        </Card>

        {/* Resume status */}
        <Card>
          <CardHeader>
            <CardTitle>Resume Status</CardTitle>
          </CardHeader>
          <CardBody>
            {resume ? (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-ink-800 text-text-mid">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-hi">{resume.fileName}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Uploaded {formatRelativeTime(resume.uploadedAt)}
                  </p>
                  {statusInfo && (
                    <Badge tone={statusInfo.tone} className="mt-2">
                      {statusInfo.label}
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-[var(--radius-control)] border border-dashed border-ink-700 px-4 py-6 text-text-muted text-sm">
                <FileText size={18} />
                No resume uploaded yet.
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            <Button as={Link} to="/app/analyzer" variant="secondary" size="sm" icon={ScanText} className="w-full justify-start">
              Re-analyze resume
            </Button>
            <Button as={Link} to="/app/career-ai" variant="secondary" size="sm" icon={MessageSquareText} className="w-full justify-start">
              Generate interview questions
            </Button>
            <Button as={Link} to="/app/history" variant="secondary" size="sm" icon={HistoryIcon} className="w-full justify-start">
              View full history
            </Button>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Job match summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Match Summary</CardTitle>
            <Button as={Link} to="/app/matcher" variant="ghost" size="sm">
              New match
            </Button>
          </CardHeader>
          <CardBody className="space-y-4">
            {matches.length === 0 && (
              <p className="text-sm text-text-muted">No job matches yet — paste a job description to start.</p>
            )}
            {matches.map((match) => (
              <div key={match.id}>
                <div className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <span className="font-medium text-text-hi">{match.jobTitle}</span>
                    <span className="text-text-muted"> · {match.company}</span>
                  </div>
                  <span className="font-mono text-xs text-text-muted shrink-0 ml-3">
                    {match.matchScore}%
                  </span>
                </div>
                <ProgressBar value={match.matchScore} className="mt-2" />
                {match.missingKeywords.length > 0 && (
                  <p className="mt-1.5 text-xs text-text-muted">
                    Missing: {match.missingKeywords.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {activity.map((item) => {
              const Icon = ACTIVITY_ICON[item.type];
              return (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-800 text-brass-400">
                    <Icon size={12} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-text-mid leading-snug">{item.label}</p>
                    <p className="text-xs text-text-muted">{formatRelativeTime(item.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
