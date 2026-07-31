import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ScanText,
  Target,
  Sparkles,
  History,
  Settings,
  Scan,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/app/analyzer", label: "Resume Analyzer", icon: ScanText },
  { to: "/app/matcher", label: "Job Matcher", icon: Target },
  { to: "/app/career-ai", label: "Career AI", icon: Sparkles },
  { to: "/app/history", label: "History", icon: History },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 shrink-0 flex-col border-r border-ink-800 bg-ink-950 px-3 py-5">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brass-500/15 text-brass-400">
          <Scan size={16} strokeWidth={2.25} />
        </div>
        <span className="font-display text-[17px] tracking-tight text-text-hi">
          JobLens
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-[var(--radius-control)] px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-ink-800 text-text-hi"
                  : "text-text-muted hover:bg-ink-900 hover:text-text-mid"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={2} className={isActive ? "text-brass-400" : ""} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/app/settings"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2.5 rounded-[var(--radius-control)] px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-ink-800 text-text-hi"
              : "text-text-muted hover:bg-ink-900 hover:text-text-mid"
          )
        }
      >
        <Settings size={16} strokeWidth={2} />
        Settings
      </NavLink>
    </aside>
  );
}
