function bandColor(value: number): string {
  if (value >= 75) return "var(--color-signal-good)";
  if (value >= 50) return "var(--color-signal-warn)";
  return "var(--color-signal-bad)";
}

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export default function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-ink-700 ${className ?? ""}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: bandColor(clamped) }}
      />
    </div>
  );
}
