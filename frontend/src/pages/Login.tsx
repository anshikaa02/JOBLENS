import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Scan } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { loginSchema, type LoginValues } from "@/lib/validation";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? "/app";

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      await login(values.email, values.password);
      navigate(redirectTo, { replace: true });
    } catch {
      setFormError("Couldn't log you in. Check your details and try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brass-500/15 text-brass-400">
            <Scan size={16} strokeWidth={2.25} />
          </div>
          <span className="font-display text-[17px] tracking-tight text-text-hi">JobLens</span>
        </Link>

        <Card>
          <CardBody className="pt-6">
            <h1 className="font-display text-xl tracking-tight text-text-hi">Log in</h1>
            <p className="mt-1 text-sm text-text-muted">
              Welcome back — pick up where you left off.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
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
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password")}
              />

              {formError && <p className="text-sm text-signal-bad">{formError}</p>}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                icon={LogIn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in…" : "Log in"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="mt-5 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="text-brass-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
