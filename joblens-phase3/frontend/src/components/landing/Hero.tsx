import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import ScoreGauge from "@/components/ui/ScoreGauge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-20 pb-24 lg:grid-cols-2 lg:pt-28 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-ink-700 bg-ink-900 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
            ATS scoring, rebuilt from the job description up
          </span>

          <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-text-hi sm:text-5xl">
            Measure your resume against the job.
            <span className="text-brass-400"> Precisely.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-text-mid sm:text-lg">
            Paste a job description, upload your resume, and JobLens tells you
            exactly what's missing — with a match score, the keywords you
            skipped, and specific lines to fix. No generic advice.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/signup" size="lg" icon={ArrowRight} iconPosition="right">
              Analyze your resume
            </Button>
            <Button as={Link} to="/app" variant="secondary" size="lg" icon={Upload}>
              See a live demo
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-muted">
            {["No sign-up to try it", "Your resume isn't stored by default", "Built on real TF-IDF matching"].map(
              (item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-signal-good" />
                  {item}
                </li>
              )
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-brass-500/[0.04]" />
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Resume vs. Senior Frontend Engineer</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col items-center gap-5">
              <ScoreGauge score={82} label="Match score" size={132} />
              <div className="w-full space-y-2">
                {[
                  { label: "React / TypeScript", found: true },
                  { label: "System design", found: true },
                  { label: "GraphQL", found: false },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-[var(--radius-control)] border border-ink-700 bg-ink-900 px-3 py-2 text-sm"
                  >
                    <span className="text-text-mid">{row.label}</span>
                    <span
                      className={
                        row.found
                          ? "font-mono text-xs text-signal-good"
                          : "font-mono text-xs text-signal-warn"
                      }
                    >
                      {row.found ? "FOUND" : "MISSING"}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
