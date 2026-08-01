import { motion } from "framer-motion";
import { ScanText, Target, Sparkles, ListChecks, FileEdit, MessageSquareText } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: ScanText,
    title: "ATS score breakdown",
    body: "Not just a number — see exactly which formatting, sections, and keywords are costing you points with real applicant tracking systems.",
  },
  {
    icon: Target,
    title: "Job match percentage",
    body: "Paste any job description. We run TF-IDF and cosine similarity against your resume to score the actual overlap, not a guess.",
  },
  {
    icon: ListChecks,
    title: "Missing skill detection",
    body: "See the specific skills and keywords the job asks for that your resume doesn't mention yet — ranked by how often they appear.",
  },
  {
    icon: Sparkles,
    title: "AI-written improvements",
    body: "Get rewritten bullet points that keep your real experience but phrase it the way the job description does.",
  },
  {
    icon: FileEdit,
    title: "Cover letters that aren't generic",
    body: "Generated from your actual resume and the actual job post — not a template with your name swapped in.",
  },
  {
    icon: MessageSquareText,
    title: "Interview question prep",
    body: "Likely interview questions generated from the gap between your resume and the role, so you prep for what they'll actually ask.",
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 max-w-xl">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-brass-400">
          What it does
        </span>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-text-hi sm:text-4xl">
          Everything between "I applied" and "I got the interview."
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="h-full">
              <CardBody className="pt-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] bg-brass-500/12 text-brass-400">
                  <feature.icon size={18} strokeWidth={2} />
                </div>
                <h3 className="font-display text-lg tracking-tight text-text-hi">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{feature.body}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
