import { useState } from "react";
import axios from "axios";
import { Target, AlertCircle, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import FileDropzone from "@/components/ui/FileDropzone";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ScoreGauge from "@/components/ui/ScoreGauge";
import { api } from "@/lib/api";
import type { MatchResult } from "@/lib/types";

type Status = "idle" | "matching" | "error" | "done";

const MIN_JD_LENGTH = 30;

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (err.code === "ERR_NETWORK") {
      return "Couldn't reach the analysis server. Is the FastAPI backend running on port 8000?";
    }
  }
  return "Something went wrong matching this resume. Please try again.";
}

export default function JobMatcher() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);

  const jdTooShort = jobDescription.trim().length < MIN_JD_LENGTH;

  async function handleMatch() {
    if (!file || jdTooShort) return;
    setStatus("matching");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await api.post<MatchResult>("/match/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
      setStatus("done");
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
      setStatus("error");
    }
  }

  function handleReset() {
    setFile(null);
    setJobDescription("");
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl tracking-tight text-text-hi">Job Matcher</h2>
        <p className="mt-1 text-sm text-text-muted">
          Upload your resume and paste a job description to see your real match score.
        </p>
      </div>

      {status !== "done" && (
        <Card>
          <CardBody className="space-y-4 pt-5">
            <FileDropzone
              onFileSelected={(f) => setFile(f)}
              selectedFileName={file?.name}
              disabled={status === "matching"}
            />

            <div>
              <label htmlFor="jd" className="mb-1.5 block text-sm text-text-mid">
                Job description
              </label>
              <textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={status === "matching"}
                rows={8}
                placeholder="Paste the full job description here…"
                className="w-full rounded-[var(--radius-control)] border border-ink-700 bg-ink-900 px-3 py-2.5 text-sm text-text-hi placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-brass-400/50 focus:border-brass-500/60"
              />
              {jobDescription.length > 0 && jdTooShort && (
                <p className="mt-1.5 text-xs text-signal-warn">
                  Paste a bit more — needs at least {MIN_JD_LENGTH} characters to match against.
                </p>
              )}
            </div>

            {status === "error" && errorMessage && (
              <div className="flex items-start gap-2 rounded-[var(--radius-control)] border border-signal-bad/30 bg-signal-bad-soft px-3 py-2.5 text-sm text-signal-bad">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              onClick={handleMatch}
              disabled={!file || jdTooShort || status === "matching"}
              icon={Target}
              size="lg"
            >
              {status === "matching" ? "Matching…" : "Match resume to job"}
            </Button>
          </CardBody>
        </Card>
      )}

      {status === "done" && result && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset}>
              Match another job
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Match Score</CardTitle>
              </CardHeader>
              <CardBody className="flex justify-center">
                <ScoreGauge score={result.match_score} label="TF-IDF cosine similarity" />
              </CardBody>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Keyword Overlap</CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-mono uppercase tracking-[0.1em] text-text-muted">
                    Found in your resume
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_keywords.length === 0 ? (
                      <p className="text-sm text-text-muted">No overlapping keywords detected.</p>
                    ) : (
                      result.matched_keywords.map((k) => (
                        <Badge key={k} tone="good">
                          {k}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-mono uppercase tracking-[0.1em] text-text-muted">
                    Missing from your resume
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.length === 0 ? (
                      <p className="text-sm text-text-muted">Nothing obvious missing — great overlap.</p>
                    ) : (
                      result.missing_keywords.map((k) => (
                        <Badge key={k} tone="warn">
                          {k}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
