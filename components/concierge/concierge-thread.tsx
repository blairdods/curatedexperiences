"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Message } from "./use-concierge";
import { ConciergeMessage } from "./concierge-message";
import { ConciergeThinking } from "./concierge-thinking";

const SUGGESTIONS = [
  "The Masterpiece — Luxury Lodges",
  "The Epicurean — Wine & Dining",
  "The Expedition — Wilderness & Fjords",
  "The Discovery — North to South",
  "The Hidden Trail — Self-Drive Adventure",
  "The Southern Heart — Alpine Immersion",
];

export function ConciergeThread({
  messages,
  isStreaming,
  onSuggestion,
}: {
  messages: Message[];
  isStreaming: boolean;
  onSuggestion: (text: string) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const checkNearBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 80;
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center sm:px-12 sm:py-12">
        <p className="text-2xl font-light tracking-tight text-navy">
          Welcome to Curated Experiences
        </p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/50 sm:text-base">
          What kind of New Zealand journey are you imagining?
        </p>
        <p className="mt-2 text-xs text-foreground/40">
          Write your own message below, or choose an idea to begin.
        </p>
        <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2 sm:mt-8">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestion(s)}
              className="px-4 py-2 text-xs tracking-wide text-navy
                border border-warm-200 rounded-full
                hover:bg-warm-100 hover:border-warm-300
                transition-colors duration-200"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const visibleMessages =
    isStreaming && messages[messages.length - 1]?.role === "assistant"
      ? messages.slice(0, -1)
      : messages;

  return (
    <div
      ref={containerRef}
      onScroll={checkNearBottom}
      className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scroll-smooth"
    >
      {visibleMessages.map((msg, i) =>
        msg.content || msg.role === "user" ? (
          <ConciergeMessage key={i} message={msg} />
        ) : null
      )}
      {isStreaming && <ConciergeThinking />}
      <div ref={bottomRef} />
    </div>
  );
}
