import { Bell, Search } from "lucide-react";

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title = "Dashboard" }: NavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-ink-800 bg-ink-950/80 px-6 backdrop-blur">
      <h1 className="font-display text-xl tracking-tight text-text-hi">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-[var(--radius-control)] border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm text-text-muted">
          <Search size={14} />
          <span>Search resumes, jobs…</span>
          <kbd className="ml-2 rounded border border-ink-700 bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
            ⌘K
          </kbd>
        </div>
        <button
          aria-label="Notifications"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] text-text-muted hover:bg-ink-800 hover:text-text-hi transition-colors"
        >
          <Bell size={16} />
        </button>
        <div className="h-8 w-8 rounded-full bg-brass-500/20 border border-brass-500/40 flex items-center justify-center font-mono text-xs text-brass-400">
          RS
        </div>
      </div>
    </header>
  );
}
