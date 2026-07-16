"use client";

import { useRef, useState, useCallback, type KeyboardEvent } from "react";

export function ConciergeInput({
  onSend,
  onStop,
  isStreaming,
}: {
  onSend: (content: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, []);

  const handleSend = useCallback(() => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isStreaming) return;
      handleSend();
    }
  };

  return (
    <form
      className="mx-4 mb-2 flex items-end gap-3 rounded-2xl border border-warm-300 bg-white px-4 py-3 shadow-[0_8px_30px_-18px_rgba(31,56,100,0.35)] focus-within:border-navy/40 focus-within:ring-2 focus-within:ring-navy/10 sm:mx-6 sm:mb-3 sm:px-5 sm:py-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!isStreaming) handleSend();
      }}
    >
      <textarea
        ref={textareaRef}
        autoFocus
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          resize();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Tell us what you're imagining, or ask anything about New Zealand..."
        aria-label="Message your travel curator"
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-foreground
          placeholder:text-foreground/35 leading-relaxed
          focus:outline-none max-h-[120px] min-h-6"
      />
      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generating"
          className="w-8 h-8 flex items-center justify-center
            rounded-full bg-foreground/10 hover:bg-foreground/20
            transition-colors flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-foreground/60">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send message"
          className={`w-8 h-8 flex items-center justify-center
            rounded-full transition-all duration-200 flex-shrink-0 ${
              value.trim()
                ? "bg-navy text-background scale-100 opacity-100"
                : "bg-transparent text-transparent scale-90 opacity-0 pointer-events-none"
            }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      )}
    </form>
  );
}
