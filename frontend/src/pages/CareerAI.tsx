import { useState } from "react";
import axios from "axios";
import { Sparkles, FileEdit, MessageSquareText, AlertCircle, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import FileDropzone from "@/components/ui/FileDropzone";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type {
  BulletImprovementResponse,
  CoverLetterResponse,
  InterviewQuestionsResponse,
} from "@/lib/types";

type Tab = "bullets" | "cover-letter" | "interview";
type Status = "idle" | "loading" | "error" | "done";

const TABS: { id: Tab; label: string; icon: typeof Sparkles }[] = [
  { id: "bullets", label: "Improve Bullets", icon: Sparkles },
  { id: "cover-letter", label: "Cover Letter", icon: FileEdit },
  { id: "interview", label: "Interview Prep", icon: MessageSquareText },
];

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (err.code === "ERR_NETWORK") {
      return "Couldn't reach the analysis server. Is the FastAPI backend running on port 8000?";
    }
  }
  return "Something went wrong. Please try again.";
}

export default function CareerAI() {
  const [tab, setTab] = useState<Tab>("bullets");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [bulletsResult, setBulletsResult] = useState<BulletImprovementResponse | null>(null);
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResponse | null>(null);
  const [interviewResult, setInterviewResult] = useState<InterviewQuestionsResponse | null>(null);

  const jdRequired = tab !== "bullets";
  const jdTooShort = jdRequired && jobDescription.trim().length < 30;

  function resetResults() {
    setBulletsResult(null);
    setCoverLetterResult(null);
    setInterviewResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  function switchTab(next: Tab) {
    setTab(next);
    resetResults();
  }

  async function handleRun() {
    if (!file || jdTooShort) return;
    setStatus("loading");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    if (jobDescription.trim()) formData.append("job_description", jobDescription);

    try {
      if (tab === "bullets") {
        const res = await api.post<BulletImprovementResponse>("/career-ai/improve-bullets", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBulletsResult(res.data);
      } else if (tab === "cover-letter") {
        if (companyName.trim()) formData.append("company_name", companyName);
        const res = await api.post<CoverLetterResponse>("/career-ai/cover-letter", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCoverLetterResult(res.data);
      } else {
        const res = await api.post<InterviewQuestionsResponse>("/career-ai/interview-questions", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setInterviewResult(res.data);
      }
      setStatus("done");
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
      setStatus("error");
    }
  }

  const hasResult = bulletsResult || coverLetterResult || interviewResult;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl tracking-tight text-text-hi">Career AI</h2>
        <p className="mt-1 text-sm text-text-muted">
          Gemini-powered resume rewrites, cover letters, and interview prep.
        </p>
      </div>

      <div className="flex gap-1 rounded-[var(--radius-control)] border border-ink-700 bg-ink-900 p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-sm transition-colors",
              tab === id ? "bg-ink-800 text-text-hi" : "text-text-muted hover:text-text-mid"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {!hasResult && (
        <Card>
          <CardBody className="space-y-4 pt-5">
            <FileDropzone
              onFileSelected={(f) => setFile(f)}
              selectedFileName={file?.name}
              disabled={status === "loading"}
            />

            {tab === "cover-letter" && (
              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm text-text-mid">
                  Company name (optional)
                </label>
                <input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="e.g. Nimbus Systems"
                  className="h-10 w-full rounded-[var(--radius-control)] border border-ink-700 bg-ink-900 px-3 text-sm text-text-hi placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-brass-400/50 focus:border-brass-500/60"
                />
              </div>
            )}

            <div>
              <label htmlFor="jd" className="mb-1.5 block text-sm text-text-mid">
                Job description {tab === "bullets" && <span className="text-text-muted">(optional — tailors the rewrite)</span>}
              </label>
              <textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={status === "loading"}
                rows={6}
                placeholder="Paste the job description here…"
                className="w-full rounded-[var(--radius-control)] border border-ink-700 bg-ink-900 px-3 py-2.5 text-sm text-text-hi placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-brass-400/50 focus:border-brass-500/60"
              />
              {jdRequired && jobDescription.length > 0 && jdTooShort && (
                <p className="mt-1.5 text-xs text-signal-warn">Needs at least 30 characters.</p>
              )}
            </div>

            {status === "error" && errorMessage && (
              <div className="flex items-start gap-2 rounded-[var(--radius-control)] border border-signal-bad/30 bg-signal-bad-soft px-3 py-2.5 text-sm text-signal-bad">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button onClick={handleRun} disabled={!file || jdTooShort || status === "loading"} icon={Sparkles} size="lg">
              {status === "loading" ? "Thinking…" : "Generate"}
            </Button>
          </CardBody>
        </Card>
      )}

      {hasResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <Button variant="ghost" size="sm" icon={RotateCcw} onClick={resetResults}>
              Start over
            </Button>
          </div>

          {bulletsResult && (
            <div className="space-y-3">
              {bulletsResult.improvements.map((imp, i) => (
                <Card key={i}>
                  <CardBody className="space-y-2 pt-5">
                    <p className="text-sm text-text-muted line-through decoration-signal-bad/50">
                      {imp.original}
                    </p>
                    <p className="text-sm text-text-hi">{imp.improved}</p>
                    <p className="text-xs text-brass-400">{imp.reasoning}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {coverLetterResult && (
            <Card>
              <CardHeader>
                <CardTitle>Your Cover Letter</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="whitespace-pre-wrap rounded-[var(--radius-control)] bg-paper-50 p-5 text-sm leading-relaxed text-ink-950">
                  {coverLetterResult.cover_letter}
                </div>
              </CardBody>
            </Card>
          )}

          {interviewResult && (
            <div className="space-y-3">
              {interviewResult.questions.map((q, i) => (
                <Card key={i}>
                  <CardBody className="pt-5">
                    <p className="text-sm font-medium text-text-hi">{q.question}</p>
                    <p className="mt-1.5 text-xs text-text-muted">{q.why_asked}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
