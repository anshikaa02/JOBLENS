import { Link } from "react-router-dom";
import { Scan } from "lucide-react";
import Button from "@/components/ui/Button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Stories" },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/70 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brass-500/15 text-brass-400">
            <Scan size={16} strokeWidth={2.25} />
          </div>
          <span className="font-display text-[17px] tracking-tight text-text-hi">
            JobLens
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-mid hover:text-text-hi transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to="/signup" variant="primary" size="sm">
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
