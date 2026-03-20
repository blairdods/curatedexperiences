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
    onSend(value);
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
    <div className="border-t border-warm-200 px-4 py-3 flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          resize();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ask about New Zealand..."
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-foreground
          placeholder:text-foreground/35 leading-relaxed
          focus:outline-none max-h-[120px]"
      />
      {isStreaming ? (
        <button
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
          onClick={handleSend}
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
    </div>
  );
}
