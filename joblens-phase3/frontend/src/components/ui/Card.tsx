import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "panel" | "paper";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

/**
 * Card — base elevated surface used across dashboard & analyzer screens.
 * variant "paper" renders the warm document surface (for resume/JD content);
 * variant "panel" (default) renders the dark instrument-panel surface.
 */
export function Card({ className, variant = "panel", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border",
        variant === "panel" &&
          "bg-ink-850 border-ink-700/70 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]",
        variant === "paper" &&
          "bg-paper-50 border-paper-200 text-ink-950 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pt-5 pb-3 flex items-start justify-between gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-display text-lg tracking-tight text-text-hi", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pb-5", className)} {...props}>
      {children}
    </div>
  );
}
