import { useMemo, type ElementType, type ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brass-500 text-ink-950 hover:bg-brass-400 shadow-[0_1px_0_rgba(0,0,0,0.15)]",
  secondary:
    "bg-ink-800 text-text-hi border border-ink-700 hover:border-brass-500/60 hover:bg-ink-700/60",
  ghost: "bg-transparent text-text-mid hover:text-text-hi hover:bg-ink-800/60",
  danger:
    "bg-signal-bad-soft text-signal-bad border border-signal-bad/30 hover:bg-signal-bad/15",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

type ButtonOwnProps<C extends ElementType> = {
  as?: C;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps<C extends ElementType> = ButtonOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>;

/**
 * Button — the single button primitive for JobLens.
 * Polymorphic: pass `as={Link}` to render as a router link, etc.
 */
export default function Button<C extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  icon: Icon,
  iconPosition = "left",
  ...props
}: ButtonProps<C>) {
  const Component = as ?? "button";
  const MotionComponent = useMemo(() => motion(Component as ElementType), [Component]);

  return (
    <MotionComponent
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium",
        "transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={16} strokeWidth={2} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={16} strokeWidth={2} />}
    </MotionComponent>
  );
}
