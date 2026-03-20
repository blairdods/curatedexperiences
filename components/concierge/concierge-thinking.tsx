"use client";

export function ConciergeThinking() {
  return (
    <div className="flex justify-start animate-[concierge-fade-in_0.3s_ease-out]">
      <div className="bg-warm-100 rounded-full px-4 py-2.5 flex gap-1.5 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-warm-300 animate-[concierge-dot-pulse_1.4s_ease-in-out_infinite]" />
        <span className="w-1.5 h-1.5 rounded-full bg-warm-300 animate-[concierge-dot-pulse_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="w-1.5 h-1.5 rounded-full bg-warm-300 animate-[concierge-dot-pulse_1.4s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}
