import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ArrowRight, Scan } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-ink-950">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brass-500/15 text-brass-400 mb-6">
        <Scan size={20} strokeWidth={2.25} />
      </div>
      <h1 className="font-display text-4xl md:text-5xl tracking-tight text-text-hi max-w-xl">
        Measure your resume against the job. Precisely.
      </h1>
      <p className="mt-4 max-w-md text-text-mid">
        The full landing page — features, how it works, testimonials — lands
        in Phase 3. This is a scaffold placeholder so routing works end to end.
      </p>
      <div className="mt-8 flex gap-3">
        <Button as={Link} to="/app" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
          Open the app
        </Button>
        <Button as={Link} to="/login" variant="secondary" size="lg">
          Log in
        </Button>
      </div>
    </div>
  );
}
