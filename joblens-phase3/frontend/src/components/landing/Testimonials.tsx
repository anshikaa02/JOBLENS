import { motion } from "framer-motion";
import { Card, CardBody } from "@/components/ui/Card";

const TESTIMONIALS = [
  {
    initials: "MP",
    name: "Meera P.",
    role: "New grad, applying to SWE roles",
    quote:
      "I found out my resume was getting filtered before a human ever saw it. Fixing the three things it flagged got me two callbacks that same week.",
  },
  {
    initials: "DK",
    name: "Daniel K.",
    role: "Career switcher, into data analytics",
    quote:
      "The missing-keyword list was more useful than any resume template I'd downloaded. It told me what the job actually wanted, not what looks nice.",
  },
  {
    initials: "AT",
    name: "Aisha T.",
    role: "Product manager, 4 YOE",
    quote:
      "I stopped rewriting my resume from scratch for every job. Now I check the match score first and only touch what's actually low.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 max-w-xl">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-brass-400">
          Who it's for
        </span>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-text-hi sm:text-4xl">
          People tired of guessing why they weren't getting callbacks.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="h-full">
              <CardBody className="pt-5">
                <p className="text-sm leading-relaxed text-text-mid">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brass-500/40 bg-brass-500/15 font-mono text-xs text-brass-400">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-hi">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-xs text-text-muted">
        Illustrative example profiles for demo purposes.
      </p>
    </section>
  );
}
