"use client";

export function ConciergeThinking() {
  return (
    <div
      role="status"
      aria-label="Thinking..."
      className="flex justify-start animate-[concierge-fade-in_0.3s_ease-out]"
    >
      <div className="bg-warm-100 text-foreground rounded-full px-4 py-2.5 text-sm">
        <span aria-hidden="true">
          Thinking
          <span className="inline-block animate-[concierge-dot-pulse_1.4s_ease-in-out_infinite]">
            .
          </span>
          <span className="inline-block animate-[concierge-dot-pulse_1.4s_ease-in-out_0.2s_infinite]">
            .
          </span>
          <span className="inline-block animate-[concierge-dot-pulse_1.4s_ease-in-out_0.4s_infinite]">
            .
          </span>
        </span>
      </div>
    </div>
  );
}
