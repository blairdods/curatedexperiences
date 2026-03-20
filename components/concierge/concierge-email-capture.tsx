"use client";

import { useState, useCallback, type FormEvent } from "react";

export function ConciergeEmailCapture({
  onSubmit,
}: {
  onSubmit: (email: string, name?: string) => void;
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
      <div className="px-5 py-4 text-center animate-[concierge-fade-in_0.3s_ease-out]">
        <p className="text-sm text-foreground/70">
          Thank you — we&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-5 py-4 border-t border-warm-200 animate-[concierge-fade-in_0.3s_ease-out]"
    >
      <p className="text-xs text-foreground/50 mb-3">
        Not ready to chat? Leave your email and we&apos;ll send you some inspiration.
      </p>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-warm-200
            rounded-lg placeholder:text-foreground/30
            focus:outline-none focus:border-navy/30"
        />
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 text-sm bg-white border border-warm-200
              rounded-lg placeholder:text-foreground/30
              focus:outline-none focus:border-navy/30"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-navy text-background rounded-lg
              hover:bg-navy/90 transition-colors flex-shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}
