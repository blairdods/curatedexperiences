"use client";

import type { Message } from "./use-concierge";
import { ConciergeHeader } from "./concierge-header";
import { ConciergeThread } from "./concierge-thread";
import { ConciergeInput } from "./concierge-input";

export function ConciergePanel({
  messages,
  isStreaming,
  error,
  onSend,
  onStop,
  onClose,
}: {
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onStop: () => void;
  onClose: () => void;
}) {
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

      <ConciergeInput
        onSend={onSend}
        onStop={onStop}
        isStreaming={isStreaming}
      />
    </div>
  );
}
