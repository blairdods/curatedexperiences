"use client";

import Script from "next/script";
import {
  useCallback,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { trackConversion } from "@/components/ui/analytics";

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: {
        ready?: (callback: () => void) => void;
        render: (
          container: HTMLElement,
          parameters: {
            sitekey: string;
            action: string;
            theme?: "light" | "dark";
            callback?: (token: string) => void;
            "expired-callback"?: () => void;
            "error-callback"?: () => void;
          }
        ) => number;
        reset: (widgetId?: number) => void;
      };
    };
  }
}

const RECAPTCHA_ACTION = "contact_enquiry";
const FIELD_CLASS =
  "mt-2 w-full border border-navy/15 bg-white px-4 py-3.5 text-[14px] text-navy outline-none transition-colors placeholder:text-navy/28 focus:border-gold";

export function ContactForm({ siteKey }: { siteKey: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetId = useRef<number | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const renderRecaptcha = useCallback(() => {
    const recaptcha = window.grecaptcha?.enterprise;

    if (!siteKey || !recaptcha || captchaWidgetId.current !== null) {
      return;
    }

    if (typeof recaptcha.render !== "function") {
      recaptcha.ready?.(renderRecaptcha);
      return;
    }

    if (!captchaContainerRef.current) return;

    captchaWidgetId.current = recaptcha.render(
      captchaContainerRef.current,
      {
        sitekey: siteKey,
        action: RECAPTCHA_ACTION,
        theme: "light",
        callback: (token) => {
          setCaptchaToken(token);
          setError("");
        },
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => {
          setCaptchaToken("");
          setError("Spam protection could not load. Please try again.");
        },
      }
    );
  }, [siteKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please confirm that you are not a robot.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          interests: [message],
          source: "contact_page",
          recaptcha_token: captchaToken,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error || "Unable to send your enquiry");
      }

      trackConversion("lead_created", {
        value: 50,
        params: { source: "contact_page" },
        userData: { email, phone_number: phone },
      });

      formRef.current?.reset();
      setSubmitted(true);
      setCaptchaToken("");
      if (captchaWidgetId.current !== null) {
        window.grecaptcha?.enterprise?.reset(captchaWidgetId.current);
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[560px] flex-col justify-center bg-cream px-8 py-14 text-center sm:px-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
          Enquiry received
        </p>
        <h2 className="mt-4 font-serif text-[36px] leading-tight text-navy">
          Thank you for getting in touch.
        </h2>
        <p className="mx-auto mt-5 max-w-[420px] text-[14px] leading-7 text-navy/60">
          A member of our award-winning team will be in touch soon to begin
          shaping your New Zealand journey.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-cream px-6 py-10 text-navy sm:px-10 sm:py-12"
    >
      {siteKey ? (
        <Script
          src="https://www.google.com/recaptcha/enterprise.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderRecaptcha}
          onError={() =>
            setError("Spam protection could not load. Please refresh the page.")
          }
        />
      ) : null}

      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
        Your journey
      </p>
      <h2 className="mt-4 font-serif text-[34px] font-medium leading-tight text-navy">
        Tell us what you are imagining.
      </h2>

      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/62">
          First name
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className={FIELD_CLASS}
          />
        </label>
        <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/62">
          Last name
          <input
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            className={FIELD_CLASS}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/62">
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className={FIELD_CLASS}
          />
        </label>
        <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/62">
          Phone number
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className={FIELD_CLASS}
          />
        </label>
      </div>

      <label className="mt-5 block text-[11px] font-medium uppercase tracking-[0.16em] text-navy/62">
        Message
        <textarea
          name="message"
          rows={6}
          required
          placeholder="Tell us about your travel dates, interests, pace, and who will be joining you."
          className={`${FIELD_CLASS} resize-y`}
        />
      </label>

      <div className="mt-6 min-h-[78px] overflow-x-auto">
        {siteKey ? (
          <div ref={captchaContainerRef} />
        ) : (
          <div className="border border-gold/40 bg-white px-4 py-4 text-[13px] leading-6 text-navy/60">
            Spam protection is not configured. Add the reCAPTCHA Essentials site
            key to enable this form.
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-4 text-[13px] text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || !captchaToken || !siteKey}
        className="mt-6 w-full border border-gold bg-navy px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-navy disabled:cursor-not-allowed disabled:opacity-45"
      >
        {submitting ? "Sending enquiry…" : "Send enquiry"}
      </button>

      <p className="mt-4 text-center text-[11px] leading-5 text-navy/38">
        Your details are used only to respond to your enquiry.
      </p>
    </form>
  );
}
