import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-[28px] border border-ink-700 bg-ink-900 px-8 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] scan-ruler-bg" aria-hidden />
        <h2 className="font-display text-3xl tracking-tight text-text-hi sm:text-4xl">
          Know your score before you hit submit.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-text-mid">
          It takes under a minute to see where your resume actually stands
          against a real job description.
        </p>
        <div className="mt-8 flex justify-center">
          <Button as={Link} to="/signup" size="lg" icon={ArrowRight} iconPosition="right">
            Analyze your resume — free
          </Button>
        </div>
      </div>
    </section>
  );
}
