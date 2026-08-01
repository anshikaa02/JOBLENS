import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import ScoreGauge from "@/components/ui/ScoreGauge";
import Button from "@/components/ui/Button";
import { Upload, FileText } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div>
            <CardTitle>Welcome back, Riya</CardTitle>
            <p className="text-sm text-text-muted mt-1">
              Full dashboard data (recent activity, quick actions) wires up in Phase 5.
            </p>
          </div>
          <Button variant="primary" size="sm" icon={Upload}>
            Upload resume
          </Button>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-3 rounded-[var(--radius-control)] border border-dashed border-ink-700 px-4 py-6 text-text-muted text-sm">
            <FileText size={18} />
            No resume analyzed yet — this is placeholder scaffolding.
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ATS Score</CardTitle>
        </CardHeader>
        <CardBody className="flex justify-center">
          <ScoreGauge score={78} label="Last analyzed resume" />
        </CardBody>
      </Card>
    </div>
  );
}
