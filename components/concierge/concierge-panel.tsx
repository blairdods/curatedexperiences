"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Message } from "./use-concierge";
import { ConciergeHeader } from "./concierge-header";
import { ConciergeThread } from "./concierge-thread";
import { ConciergeInput } from "./concierge-input";
import { ConciergeOfframp } from "./concierge-offramp";
import { ConciergeEmailCapture } from "./concierge-email-capture";
import { ConciergeInlineCapture } from "./concierge-inline-capture";
import { ContactModal } from "@/components/ui/contact-modal";

export function ConciergePanel({
  messages,
  isStreaming,
  error,
  onSend,
  onStop,
  onClose,
  onEmailCapture,
}: {
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onStop: () => void;
  onClose: () => void;
  onEmailCapture: (email: string, name?: string) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [inlineCaptured, setInlineCaptured] = useState(false);
  const [inlineDismissed, setInlineDismissed] = useState(false);
  const [showDirectContact, setShowDirectContact] = useState(false);

  const handleInlineSubmit = useCallback(
    (email: string, name?: string) => {
      onEmailCapture(email, name);
      setInlineCaptured(true);
    },
    [onEmailCapture]
  );

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const showInlineCapture =
    userMessageCount >= 3 && !inlineCaptured && !inlineDismissed && !showEmailCapture;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/55 p-0 backdrop-blur-[2px] sm:p-6 lg:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="concierge-title"
        className="flex h-full w-full flex-col overflow-hidden bg-background shadow-[0_24px_80px_-12px_rgba(31,56,100,0.28)] animate-[concierge-panel-in_0.3s_ease-out] sm:h-[min(820px,88vh)] sm:max-w-4xl sm:rounded-2xl sm:border sm:border-warm-200"
      >
        <ConciergeHeader onClose={onClose} />

        {showDirectContact ? (
          <ContactModal
            isOpen
            embedded
            onClose={() => setShowDirectContact(false)}
          />
        ) : (
          <>
            <ConciergeThread
              messages={messages}
              isStreaming={isStreaming}
              onSuggestion={onSend}
            />

            {error && (
              <div className="bg-red-50/50 px-5 py-2 text-xs text-red-600/80" role="alert">
                {error}
              </div>
            )}

            {showInlineCapture && (
              <ConciergeInlineCapture
                onSubmit={handleInlineSubmit}
                onDismiss={() => setInlineDismissed(true)}
              />
            )}

            {showEmailCapture ? (
              <ConciergeEmailCapture onSubmit={onEmailCapture} />
            ) : (
              <ConciergeInput
                onSend={onSend}
                onStop={onStop}
                isStreaming={isStreaming}
              />
            )}

            <ConciergeOfframp onDirectContact={() => setShowDirectContact(true)} />

      {/* Email capture toggle — show when no messages or not yet captured */}
            {messages.length === 0 && !showEmailCapture && (
              <div className="px-5 pb-3 text-center">
                <button
                  onClick={() => setShowEmailCapture(true)}
                  className="text-[11px] text-navy/60 underline underline-offset-2 transition-colors hover:text-navy"
                >
                  Just browsing? Get inspiration by email instead
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
