import { motion } from "framer-motion";

function bandColor(score: number): string {
  if (score >= 75) return "var(--color-signal-good)";
  if (score >= 50) return "var(--color-signal-warn)";
  return "var(--color-signal-bad)";
}

interface ScoreGaugeProps {
  score?: number;
  label?: string;
  size?: number;
}

/**
 * ScoreGauge — the app's signature element: a tick-marked arc gauge,
 * styled like a measuring instrument rather than a generic progress ring.
 * Used for ATS score, match %, and any 0-100 readout.
 */
export default function ScoreGauge({ score = 0, label, size = 148 }: ScoreGaugeProps) {
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75; // 270-degree sweep
  const arcLength = circumference * arcFraction;
  const filled = (score / 100) * arcLength;
  const color = bandColor(score);
  const center = size / 2;
  const rotationOffset = 135; // start angle so the gap sits at the bottom

  const ticks = Array.from({ length: 21 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(${rotationOffset} ${center} ${center})`}>
          {ticks.map((i) => {
            const angle = (i / (ticks.length - 1)) * (360 * arcFraction);
            const isMajor = i % 5 === 0;
            const r1 = radius + 2;
            const r2 = isMajor ? radius + 8 : radius + 5;
            const rad = (angle * Math.PI) / 180;
            const x1 = center + r1 * Math.cos(rad);
            const y1 = center + r1 * Math.sin(rad);
            const x2 = center + r2 * Math.cos(rad);
            const y2 = center + r2 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--color-ink-600)"
                strokeWidth={isMajor ? 1.5 : 1}
              />
            );
          })}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-ink-700)"
            strokeWidth={6}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: arcLength - filled }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </g>
      </svg>
      <div className="-mt-[86px] flex flex-col items-center">
        <span className="font-mono text-3xl font-medium text-text-hi tabular-nums">
          {Math.round(score)}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
          / 100
        </span>
      </div>
      {label && <span className="mt-2 text-sm text-text-mid text-center">{label}</span>}
    </div>
  );
}
