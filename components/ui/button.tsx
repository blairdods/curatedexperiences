import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-light active:bg-navy-dark",
  secondary:
    "bg-warm-100 text-foreground hover:bg-warm-200 active:bg-warm-300",
  ghost:
    "bg-transparent text-foreground hover:bg-warm-100 active:bg-warm-200",
  outline:
    "bg-transparent text-navy border border-navy/20 hover:border-navy/40 hover:bg-navy/5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "px-4 py-2 text-xs tracking-wide",
  md: "px-6 py-3 text-sm tracking-wide",
  lg: "px-8 py-4 text-base tracking-wide",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-sans font-medium
          rounded-lg transition-all duration-200 ease-out
          disabled:opacity-50 disabled:pointer-events-none
          ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
