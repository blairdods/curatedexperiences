"use client";

import { useState, useCallback, type FormEvent } from "react";

/**
 * Soft, non-compulsory name/email capture that appears inline in the concierge
 * after 3+ user messages. Dismissable — never blocks the conversation.
 */
export function ConciergeInlineCapture({
  onSubmit,
  onDismiss,
}: {
  onSubmit: (email: string, name?: string) => void;
  onDismiss: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      onSubmit(email.trim(), name.trim() || undefined);
      setSubmitted(true);
    },
    [email, name, onSubmit]
  );

  if (submitted) {
    return (
      <div className="mx-5 mb-2 px-4 py-3 rounded-xl bg-warm-100/80 border border-warm-200/50 text-center animate-[concierge-fade-in_0.3s_ease-out]">
        <p className="text-xs text-foreground/60">
          Thanks — we&apos;ll follow up personally.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-5 mb-2 px-4 py-3 rounded-xl bg-warm-100/80 border border-warm-200/50 animate-[concierge-fade-in_0.3s_ease-out]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs text-foreground/50 leading-relaxed">
          Enjoying the conversation? Share your details and we&apos;ll follow up
          personally — no obligation.
        </p>
        <button
          onClick={onDismiss}
          className="text-foreground/30 hover:text-foreground/50 transition-colors flex-shrink-0 mt-0.5"
          aria-label="Dismiss"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-1.5 text-xs bg-white border border-warm-200
            rounded-lg placeholder:text-foreground/30
            focus:outline-none focus:border-navy/30"
        />
        <div className="flex gap-1.5">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-warm-200
              rounded-lg placeholder:text-foreground/30
              focus:outline-none focus:border-navy/30"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs bg-navy text-background rounded-lg
              hover:bg-navy/90 transition-colors flex-shrink-0"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
