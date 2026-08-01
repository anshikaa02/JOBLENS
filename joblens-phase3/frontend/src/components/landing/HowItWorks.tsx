import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Upload your resume",
    body: "Drop in a PDF. We extract the text with PyMuPDF, preserving section structure so nothing gets scrambled.",
  },
  {
    number: "02",
    title: "Paste the job description",
    body: "Any listing — LinkedIn, a company careers page, a forwarded email. Plain text is all we need.",
  },
  {
    number: "03",
    title: "Get your scored breakdown",
    body: "ATS score, match percentage, missing keywords, and specific rewrite suggestions — in under 10 seconds.",
  },
  {
    number: "04",
    title: "Fix it and re-run",
    body: "Apply the suggestions, re-check the score, and know before you hit submit whether it's actually competitive.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-ink-800/70 bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-brass-400">
            How it works
          </span>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-text-hi sm:text-4xl">
            Four steps. No account required to see your first score.
          </h2>
        </div>

        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative pl-5"
            >
              <span className="scan-ruler absolute left-0 top-1 h-10" aria-hidden />
              <span className="font-mono text-xs text-text-muted">{step.number}</span>
              <h3 className="mt-2 font-display text-lg tracking-tight text-text-hi">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
