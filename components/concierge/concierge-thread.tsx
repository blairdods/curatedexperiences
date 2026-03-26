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
  }, [messages]);

  const showThinking =
    isStreaming &&
    (messages.length === 0 ||
      messages[messages.length - 1]?.role !== "assistant" ||
      messages[messages.length - 1]?.content === "");

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
        <p className="text-2xl font-light tracking-tight text-navy">
          Welcome to Curated Experiences
        </p>
        <p className="mt-3 text-sm text-foreground/50 max-w-[280px] leading-relaxed">
          What kind of New Zealand journey are you imagining?
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
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

  return (
    <div
      ref={containerRef}
      onScroll={checkNearBottom}
      className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scroll-smooth"
    >
      {messages.map((msg, i) =>
        msg.content || msg.role === "user" ? (
          <ConciergeMessage key={i} message={msg} />
        ) : null
      )}
      {showThinking && <ConciergeThinking />}
      <div ref={bottomRef} />
    </div>
  );
}
