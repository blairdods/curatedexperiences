"use client";

import type { Message } from "./use-concierge";

const BRIEF_PATTERN = /<!--BRIEF_JSON[\s\S]*?BRIEF_JSON-->/g;

export function ConciergeMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const content = isUser
    ? message.content
    : message.content.replace(BRIEF_PATTERN, "").trim();

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-[concierge-fade-in_0.3s_ease-out]`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-navy text-background rounded-2xl rounded-br-sm"
            : "bg-warm-100 text-foreground rounded-2xl rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
