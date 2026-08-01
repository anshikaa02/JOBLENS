import { cn } from "@/lib/utils";

type BadgeTone = "good" | "warn" | "bad" | "neutral";

const TONES: Record<BadgeTone, string> = {
  good: "bg-signal-good-soft text-signal-good border-signal-good/30",
  warn: "bg-signal-warn-soft text-signal-warn border-signal-warn/30",
  bad: "bg-signal-bad-soft text-signal-bad border-signal-bad/30",
  neutral: "bg-ink-800 text-text-mid border-ink-700",
};

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
