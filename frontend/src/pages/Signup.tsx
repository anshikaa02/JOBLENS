import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Scan } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { extractErrorMessage } from "@/lib/api";
import { signupSchema, type SignupValues } from "@/lib/validation";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupValues) {
    setFormError(null);
    try {
      await signup(values.name, values.email, values.password);
      navigate("/app", { replace: true });
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't create your account. Try again."));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brass-500/15 text-brass-400">
            <Scan size={16} strokeWidth={2.25} />
          </div>
          <span className="font-display text-[17px] tracking-tight text-text-hi">JobLens</span>
        </Link>

        <Card>
          <CardBody className="pt-6">
            <h1 className="font-display text-xl tracking-tight text-text-hi">Create your account</h1>
            <p className="mt-1 text-sm text-text-muted">
              Free to start — see your first score in under a minute.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
              <Input
                label="Full name"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              {formError && <p className="text-sm text-signal-bad">{formError}</p>}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                icon={UserPlus}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="mt-5 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-brass-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
