"use client";

export function ConciergeOfframp() {
  return (
    <div className="px-5 py-2.5 border-t border-warm-200 text-center">
      <p className="text-[11px] text-foreground/40 leading-relaxed">
        Prefer a real person?{" "}
        <a
          href="mailto:hello@curatedexperiences.com?subject=I'd%20like%20to%20plan%20a%20trip"
          className="text-navy/60 hover:text-navy underline underline-offset-2 transition-colors"
        >
          Speak with Tony or Liam directly
        </a>
      </p>
    </div>
  );
}
