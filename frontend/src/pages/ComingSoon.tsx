import type { LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
}

/** Placeholder for routes whose real pages land in a later phase. */
export default function ComingSoon({ icon: Icon, title, description, phase }: ComingSoonProps) {
  return (
    <Card>
      <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] bg-brass-500/12 text-brass-400">
          <Icon size={20} />
        </div>
        <h2 className="font-display text-xl tracking-tight text-text-hi">{title}</h2>
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
        <span className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
          Lands in {phase}
        </span>
      </CardBody>
    </Card>
  );
}
