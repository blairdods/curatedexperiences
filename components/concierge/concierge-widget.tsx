"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConcierge } from "./use-concierge";
import { ConciergeTrigger } from "./concierge-trigger";
import { ConciergePanel } from "./concierge-panel";
import { trackEvent } from "@/components/ui/analytics";
import type { ConciergeOpenDetail } from "@/lib/itinerary-refiner/events";
import { CONCIERGE_OPEN_EVENT } from "@/lib/itinerary-refiner/events";
import type { ItineraryCustomization } from "@/lib/itinerary-refiner/types";
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
  const customizationRef = useRef<ItineraryCustomization | null>(null);
  const { messages, isStreaming, error, sendMessage, stopStreaming } =
    useConcierge();

  const open = useCallback(
    (customization?: ItineraryCustomization) => {
      customizationRef.current = customization ?? null;
      setIsOpen(true);
      setShowPrompt(false);
      trackEvent("concierge_open", {
        page: pathname,
        hasCustomization: !!customization,
      });
    },
    [pathname]
  );

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

  // --- Reset prompt state on navigation ---
  useEffect(() => {
    setShowPrompt(false);
  }, [pathname]);

  // --- Auto-trigger: 45s on tour pages ---
  useEffect(() => {
    if (isOpen || wasDismissed() || wasTriggered(pathname)) return;
    if (!isTourPage(pathname)) return;

    timerRef.current = setTimeout(() => {
      if (!isOpen && !wasDismissed()) {
        setShowPrompt(true);
        markTriggered(pathname);
      }
    }, 45000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, isOpen]);

  // --- Exit intent trigger ---
  useEffect(() => {
    if (isOpen || wasDismissed() || wasTriggered(pathname)) return;
    if (!isHighValuePage(pathname)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isOpen && !wasDismissed()) {
        setShowPrompt(true);
        markTriggered(pathname);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [pathname, isOpen]);

  // --- Global CTA trigger ---
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConciergeOpenDetail>).detail;
      open(detail?.customization);
    };
    window.addEventListener(CONCIERGE_OPEN_EVENT, handler);
    return () =>
      window.removeEventListener(CONCIERGE_OPEN_EVENT, handler);
  }, [open]);

  // --- Send message with customization context ---
  const handleSendMessage = useCallback(
    (content: string) => {
      const customization = customizationRef.current;
      // Once sent, clear so it doesn't get re-sent on subsequent messages
      customizationRef.current = null;
      sendMessage(content, customization ?? undefined);
    },
    [sendMessage]
  );

  // --- Email capture handler ---
  const handleEmailCapture = useCallback(
    async (email: string, name?: string) => {
      try {
        // Build a summary of the conversation for context
        const conversationSummary = messages
          .map((m) => `${m.role === "user" ? "Visitor" : "Concierge"}: ${m.content}`)
          .join("\n\n");

        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            source: "concierge_email_capture",
            interests: [],
            conversation_summary: conversationSummary || undefined,
          }),
        });
      } catch {
        // Silent fail — don't interrupt UX
      }
    },
    [messages]
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
          onSend={handleSendMessage}
          onStop={stopStreaming}
          onClose={close}
          onEmailCapture={handleEmailCapture}
        />
      )}
    </>
  );
}
