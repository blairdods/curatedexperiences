import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "gold";

const variants: Record<Variant, string> = {
  // Navy fill — strong CTA on cream/light sections
  primary:
    "bg-navy text-cream hover:bg-navy-light active:bg-navy-dark",
  // Subtle — tertiary actions
  secondary:
    "bg-stone/40 text-navy hover:bg-stone/60 active:bg-stone/80",
  // Ghost — low-prominence actions
  ghost:
    "bg-transparent text-foreground hover:bg-stone/30 active:bg-stone/50",
  // Navy outline
  outline:
    "bg-transparent text-navy border border-navy/25 hover:border-navy/50 hover:bg-navy/5",
  // Gold ghost — editorial primary CTA on cream backgrounds
  gold:
    "bg-transparent text-gold border border-gold hover:bg-gold/8 active:bg-gold/15",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "px-4 py-2 text-xs tracking-[0.2em]",
  md: "px-6 py-3 text-xs tracking-[0.2em]",
  lg: "px-8 py-4 text-sm tracking-[0.2em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-sans font-medium uppercase
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:pointer-events-none
          ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
