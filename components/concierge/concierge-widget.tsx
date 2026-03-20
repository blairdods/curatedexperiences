"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConcierge } from "./use-concierge";
import { ConciergeTrigger } from "./concierge-trigger";
import { ConciergePanel } from "./concierge-panel";
import { trackEvent } from "@/components/ui/analytics";
import {
  wasDismissed,
  markDismissed,
  wasTriggered,
  markTriggered,
  isHighValuePage,
  isTourPage,
} from "@/lib/concierge/triggers";

export function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { messages, isStreaming, error, sendMessage, stopStreaming } =
    useConcierge();

  const open = useCallback(() => {
    setIsOpen(true);
    setShowPrompt(false);
    trackEvent("concierge_open", { page: pathname });
  }, [pathname]);

  const close = useCallback(() => {
    setIsOpen(false);
    // Mark dismissed if no messages were sent
    if (messages.length === 0) {
      markDismissed();
    }
  }, [messages.length]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // --- Escape key ---
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  // --- Auto-trigger: 45s on tour pages ---
  useEffect(() => {
    if (isOpen || wasDismissed() || wasTriggered()) return;
    if (!isTourPage(pathname)) return;

    timerRef.current = setTimeout(() => {
      if (!isOpen && !wasDismissed()) {
        setShowPrompt(true);
        markTriggered();
      }
    }, 45000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, isOpen]);

  // --- Exit intent trigger ---
  useEffect(() => {
    if (isOpen || wasDismissed() || wasTriggered()) return;
    if (!isHighValuePage(pathname)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isOpen && !wasDismissed()) {
        setShowPrompt(true);
        markTriggered();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [pathname, isOpen]);

  // --- Global CTA trigger ---
  useEffect(() => {
    const handler = () => open();
    window.addEventListener("ce:open-concierge", handler);
    return () => window.removeEventListener("ce:open-concierge", handler);
  }, [open]);

  // --- Email capture handler ---
  const handleEmailCapture = useCallback(
    async (email: string, name?: string) => {
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            source: "concierge_email_capture",
            interests: [],
          }),
        });
      } catch {
        // Silent fail — don't interrupt UX
      }
    },
    []
  );

  return (
    <>
      <ConciergeTrigger
        isOpen={isOpen}
        showPrompt={showPrompt}
        onClick={toggle}
        onPromptClick={open}
        onPromptDismiss={() => {
          setShowPrompt(false);
          markDismissed();
        }}
      />

      {isOpen && (
        <ConciergePanel
          messages={messages}
          isStreaming={isStreaming}
          error={error}
          onSend={sendMessage}
          onStop={stopStreaming}
          onClose={close}
          onEmailCapture={handleEmailCapture}
        />
      )}
    </>
  );
}
