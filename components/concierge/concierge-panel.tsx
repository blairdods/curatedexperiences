"use client";

import { useState, useCallback } from "react";
import type { Message } from "./use-concierge";
import { ConciergeHeader } from "./concierge-header";
import { ConciergeThread } from "./concierge-thread";
import { ConciergeInput } from "./concierge-input";
import { ConciergeOfframp } from "./concierge-offramp";
import { ConciergeEmailCapture } from "./concierge-email-capture";
import { ConciergeInlineCapture } from "./concierge-inline-capture";

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
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [inlineCaptured, setInlineCaptured] = useState(false);
  const [inlineDismissed, setInlineDismissed] = useState(false);

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

  return (
    <div
      className="fixed z-50
        inset-0 sm:inset-auto
        sm:bottom-6 sm:right-6 md:bottom-8 md:right-8
        sm:w-[420px] sm:h-[600px] sm:max-h-[80vh]
        bg-background sm:rounded-2xl
        sm:shadow-[0_24px_80px_-12px_rgba(31,56,100,0.15)]
        sm:border sm:border-warm-200
        flex flex-col
        animate-[concierge-panel-in_0.3s_ease-out]"
    >
      <ConciergeHeader onClose={onClose} />

      <ConciergeThread
        messages={messages}
        isStreaming={isStreaming}
        onSuggestion={onSend}
      />

      {error && (
        <div className="px-5 py-2 text-xs text-red-600/80 bg-red-50/50">
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

      <ConciergeOfframp />

      {/* Email capture toggle — show when no messages or not yet captured */}
      {messages.length === 0 && !showEmailCapture && (
        <div className="px-5 pb-3 text-center">
          <button
            onClick={() => setShowEmailCapture(true)}
            className="text-[11px] text-foreground/35 hover:text-foreground/50 transition-colors"
          >
            Just browsing? Get inspiration by email instead
          </button>
        </div>
      )}
    </div>
  );
}
