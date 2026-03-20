"use client";

import { useState, useEffect, useCallback } from "react";
import { useConcierge } from "./use-concierge";
import { ConciergeTrigger } from "./concierge-trigger";
import { ConciergePanel } from "./concierge-panel";

export function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isStreaming, error, sendMessage, stopStreaming } =
    useConcierge();

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  return (
    <>
      <ConciergeTrigger isOpen={isOpen} onClick={toggle} />

      {isOpen && (
        <ConciergePanel
          messages={messages}
          isStreaming={isStreaming}
          error={error}
          onSend={sendMessage}
          onStop={stopStreaming}
          onClose={close}
        />
      )}
    </>
  );
}
