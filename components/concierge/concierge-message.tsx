"use client";

import type { ReactNode } from "react";
import type { Message } from "./use-concierge";
import { openContactModal } from "@/components/ui/contact-modal";

const BRIEF_PATTERN = /<!--BRIEF_JSON[\s\S]*?BRIEF_JSON-->/g;
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Parse markdown links in assistant messages. #contact opens the contact modal. */
function renderContent(text: string) {
  const parts: (string | ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const href = match[2];

    if (href === "#contact" || href === "#") {
      parts.push(
        <button
          key={match.index}
          onClick={() => openContactModal()}
          className="underline underline-offset-2 text-navy hover:text-navy-light transition-colors"
        >
          {label}
        </button>
      );
    } else {
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-navy hover:text-navy-light transition-colors"
        >
          {label}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

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
        {isUser ? content : renderContent(content)}
      </div>
    </div>
  );
}
