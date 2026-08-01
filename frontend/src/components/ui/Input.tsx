import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Input — text field primitive used across auth and analyzer forms.
 * For type="password", renders a show/hide toggle automatically.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, id, ...props }, ref) => {
    const [reveal, setReveal] = useState(false);
    const isPassword = type === "password";
    const inputId = id ?? props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm text-text-mid">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (reveal ? "text" : "password") : type}
            className={cn(
              "h-10 w-full rounded-[var(--radius-control)] border bg-ink-900 px-3 text-sm text-text-hi",
              "placeholder:text-text-muted/70 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-brass-400/50",
              error ? "border-signal-bad/60" : "border-ink-700 focus:border-brass-500/60",
              isPassword && "pr-10",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setReveal((r) => !r)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-hi"
              aria-label={reveal ? "Hide password" : "Show password"}
            >
              {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-signal-bad">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
