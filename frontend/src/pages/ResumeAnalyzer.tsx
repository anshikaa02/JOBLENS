import { useState } from "react";
import axios from "axios";
import { ScanText, AlertCircle, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import FileDropzone from "@/components/ui/FileDropzone";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import ScoreGauge from "@/components/ui/ScoreGauge";
import { api } from "@/lib/api";
import type { ResumeAnalysis } from "@/lib/types";

type Status = "idle" | "uploading" | "error" | "done";

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (err.code === "ERR_NETWORK") {
      return "Couldn't reach the analysis server. Is the FastAPI backend running on port 8000?";
    }
  }
  return "Something went wrong analyzing this resume. Please try again.";
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);

  async function handleAnalyze() {
    if (!file) return;
    setStatus("uploading");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post<ResumeAnalysis>("/resume/analyze", formData, {
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
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl tracking-tight text-text-hi">Resume Analyzer</h2>
        <p className="mt-1 text-sm text-text-muted">
          Upload a PDF resume to get an ATS score breakdown, strengths, weaknesses, and suggestions.
        </p>
      </div>

      {status !== "done" && (
        <Card>
          <CardBody className="space-y-4 pt-5">
            <FileDropzone
              onFileSelected={(f) => setFile(f)}
              selectedFileName={file?.name}
              disabled={status === "uploading"}
            />

            {status === "error" && errorMessage && (
              <div className="flex items-start gap-2 rounded-[var(--radius-control)] border border-signal-bad/30 bg-signal-bad-soft px-3 py-2.5 text-sm text-signal-bad">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!file || status === "uploading"}
              icon={ScanText}
              size="lg"
            >
              {status === "uploading" ? "Analyzing…" : "Analyze resume"}
            </Button>
          </CardBody>
        </Card>
      )}

      {status === "done" && result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Results for <span className="text-text-hi">{result.file_name}</span> ·{" "}
              {result.word_count} words
            </p>
            <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset}>
              Analyze another
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>ATS Score</CardTitle>
              </CardHeader>
              <CardBody className="flex justify-center">
                <ScoreGauge score={result.ats_score} label="Overall" />
              </CardBody>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                {result.breakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-mid">{item.label}</span>
                      <span className="font-mono text-xs text-text-muted">
                        {item.points_earned}/{item.points_possible}
                      </span>
                    </div>
                    <ProgressBar
                      value={(item.points_earned / item.points_possible) * 100}
                      className="mt-1.5"
                    />
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Strengths</CardTitle>
              </CardHeader>
              <CardBody className="flex flex-wrap gap-2">
                {result.strengths.length === 0 && (
                  <p className="text-sm text-text-muted">None detected yet — see weaknesses below.</p>
                )}
                {result.strengths.map((s) => (
                  <Badge key={s} tone="good">
                    {s}
                  </Badge>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weaknesses</CardTitle>
              </CardHeader>
              <CardBody className="flex flex-wrap gap-2">
                {result.weaknesses.length === 0 && (
                  <p className="text-sm text-text-muted">None — nice work.</p>
                )}
                {result.weaknesses.map((w) => (
                  <Badge key={w} tone="warn">
                    {w}
                  </Badge>
                ))}
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Missing Keywords</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-wrap gap-2">
              {result.missing_skills.length === 0 ? (
                <p className="text-sm text-text-muted">Nothing obvious missing from our general checklist.</p>
              ) : (
                result.missing_skills.map((skill) => (
                  <Badge key={skill} tone="neutral">
                    {skill}
                  </Badge>
                ))
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardBody>
              {result.suggestions.length === 0 ? (
                <p className="text-sm text-text-muted">No structural issues found — great resume.</p>
              ) : (
                <ul className="space-y-2">
                  {result.suggestions.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-text-mid">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
