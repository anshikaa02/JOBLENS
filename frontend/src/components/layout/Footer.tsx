import { Link } from "react-router-dom";
import { Scan, Github, Linkedin } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Try the demo", href: "/app" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-800/70">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brass-500/15 text-brass-400">
                <Scan size={16} strokeWidth={2.25} />
              </div>
              <span className="font-display text-[17px] tracking-tight text-text-hi">
                JobLens
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-text-muted">
              An AI resume analyzer and job matcher built to show exactly what
              a resume is missing — not just a score.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] border border-ink-700 text-text-muted hover:text-text-hi hover:border-brass-500/50 transition-colors"
              >
                <Github size={15} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] border border-ink-700 text-text-muted hover:text-text-hi hover:border-brass-500/50 transition-colors"
              >
                <Linkedin size={15} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-mid hover:text-text-hi transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ink-800/70 pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} JobLens. Built as a portfolio project.</span>
          <span>Not affiliated with any applicant tracking system vendor.</span>
        </div>
      </div>
    </footer>
  );
}
