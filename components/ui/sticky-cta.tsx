"use client";

import { dispatchOpenConcierge } from "@/lib/itinerary-refiner/events";
import { openContactModal } from "./contact-modal";

export function StickyCta({
  title,
  duration,
}: {
  title: string;
  priceFrom?: number;
  duration?: number;
}) {
  return (
    <div className="hidden lg:block sticky top-28">
      <div className="bg-white rounded-xl p-6 shadow-[0_2px_20px_-4px_rgba(31,56,100,0.08)] border border-warm-200">
        <h3 className="font-serif text-lg text-navy tracking-tight">{title}</h3>

        {duration && (
          <p className="mt-2 text-xs text-foreground-muted">{duration} days</p>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={() => dispatchOpenConcierge()}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide
              bg-navy text-background rounded-lg
              hover:bg-navy/90 transition-colors duration-200"
          >
            Begin Your Journey
          </button>
          <button
            onClick={() => openContactModal(title)}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide
              text-navy border border-navy/20 rounded-lg
              hover:bg-navy/5 transition-colors duration-200"
          >
            Enquire
          </button>
        </div>

        <p className="mt-4 text-[11px] text-center text-foreground-muted">
          Every experience is fully customisable
        </p>
      </div>
    </div>
  );
}
