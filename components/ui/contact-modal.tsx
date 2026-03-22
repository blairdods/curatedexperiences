"use client";

import { useState, useCallback, useEffect, type FormEvent } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

export function ContactModal({ isOpen, onClose, context }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(context ? `I'm interested in ${context}` : "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Reset form when opened with new context
  useEffect(() => {
    if (isOpen) {
      setSent(false);
      setError("");
      if (context) setMessage(`I'm interested in ${context}`);
    }
  }, [isOpen, context]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;

      setSending(true);
      setError("");

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim() || undefined,
            email: email.trim(),
            phone: phone.trim() || undefined,
            source: "contact_form",
            interests: message.trim() ? [message.trim()] : [],
          }),
        });

        if (!res.ok) throw new Error("Failed to send");

        setSent(true);
      } catch {
        setError("Something went wrong. Please try again or email us directly.");
      } finally {
        setSending(false);
      }
    },
    [name, email, phone, message]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-2xl shadow-[0_24px_80px_-12px_rgba(31,56,100,0.2)] w-full max-w-md animate-[concierge-panel-in_0.3s_ease-out]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-xl text-navy tracking-tight">
              Get in touch
            </h2>
            <p className="text-sm text-foreground-muted mt-1">
              Tony or Liam will be in touch within 24 hours.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground transition-colors p-1 -mr-1"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="px-6 pb-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-green-600">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-foreground/80">
              Thank you, {name || "we've received your message"}. Tony or Liam
              will be in touch soon.
            </p>
            <button
              onClick={onClose}
              className="mt-4 text-sm text-navy hover:text-navy-light transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
            <div>
              <label className="block text-xs text-foreground-muted mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 text-sm bg-white border border-warm-200
                  rounded-lg placeholder:text-foreground/30
                  focus:outline-none focus:border-navy/30"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground-muted mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 text-sm bg-white border border-warm-200
                  rounded-lg placeholder:text-foreground/30
                  focus:outline-none focus:border-navy/30"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground-muted mb-1">
                Phone <span className="text-foreground/20">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 text-sm bg-white border border-warm-200
                  rounded-lg placeholder:text-foreground/30
                  focus:outline-none focus:border-navy/30"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground-muted mb-1">
                Message <span className="text-foreground/20">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Tell us about what you're imagining..."
                className="w-full px-4 py-2.5 text-sm bg-white border border-warm-200
                  rounded-lg placeholder:text-foreground/30
                  focus:outline-none focus:border-navy/30 resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full mt-2 px-4 py-3 text-sm font-medium bg-navy text-white
                rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

            <p className="text-[11px] text-center text-foreground/30 pt-1">
              No obligation — just a friendly conversation about your ideas.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Global contact modal state. Dispatch this event to open the modal.
 * Optional detail.context for pre-filling the message.
 */
export function openContactModal(context?: string) {
  window.dispatchEvent(
    new CustomEvent("ce:open-contact", { detail: { context } })
  );
}
