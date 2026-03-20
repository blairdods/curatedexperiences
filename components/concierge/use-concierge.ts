"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "ce-concierge-messages";
const SESSION_ID_KEY = "ce-session-id";
const BRIEF_PATTERN = /<!--BRIEF_JSON[\s\S]*?BRIEF_JSON-->/g;

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

function stripBriefFromContent(content: string): string {
  return content.replace(BRIEF_PATTERN, "").trim();
}

function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function useConcierge() {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sessionId = useRef(getSessionId());
  const bufferRef = useRef("");
  const pendingTextRef = useRef("");
  const rafRef = useRef<number | null>(null);

  // Persist messages to sessionStorage (with briefs stripped)
  useEffect(() => {
    const cleaned = messages.map((m) =>
      m.role === "assistant"
        ? { ...m, content: stripBriefFromContent(m.content) }
        : m
    );
    saveMessages(cleaned);
  }, [messages]);

  const flushPendingText = useCallback(() => {
    rafRef.current = null;
    const text = pendingTextRef.current;
    if (!text) return;
    pendingTextRef.current = "";

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant") {
        return [
          ...prev.slice(0, -1),
          { ...last, content: last.content + text },
        ];
      }
      return [...prev, { role: "assistant", content: text }];
    });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMessage: Message = { role: "user", content: content.trim() };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setIsStreaming(true);
      setError(null);
      bufferRef.current = "";
      pendingTextRef.current = "";

      // Add empty assistant message to start
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/concierge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            sessionId: sessionId.current,
            visitorContext: {
              currentPage: typeof window !== "undefined" ? window.location.pathname : undefined,
              referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
              returningVisitor: messages.length > 0,
            },
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          if (res.status === 429) {
            const data = await res.json();
            setError(data.message);
            setMessages((prev) => prev.slice(0, -1)); // remove empty assistant msg
            setIsStreaming(false);
            return;
          }
          throw new Error(`Request failed: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          bufferRef.current += decoder.decode(value, { stream: true });

          // Stream outputs newline-separated JSON objects
          const lines = bufferRef.current.split("\n");
          bufferRef.current = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Handle both raw JSON and SSE "data: " prefix formats
            const jsonStr = trimmed.startsWith("data: ")
              ? trimmed.slice(6)
              : trimmed;

            try {
              const data = JSON.parse(jsonStr);
              if (
                data.type === "content_block_delta" &&
                data.delta?.type === "text_delta"
              ) {
                pendingTextRef.current += data.delta.text;

                // Batch updates at 60fps
                if (rafRef.current === null) {
                  rafRef.current = requestAnimationFrame(flushPendingText);
                }
              }
            } catch {
              // Skip malformed lines
            }
          }
        }

        // Flush any remaining text
        if (pendingTextRef.current) {
          flushPendingText();
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User cancelled — flush what we have
          if (pendingTextRef.current) flushPendingText();
        } else {
          setError(
            "I'm having trouble connecting right now. Please try again in a moment."
          );
          // Remove empty assistant message on error
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && !last.content) {
              return prev.slice(0, -1);
            }
            return prev;
          });
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }
    },
    [messages, isStreaming, flushPendingText]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages };
}
