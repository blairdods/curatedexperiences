"use client";

import { Button } from "./button";
import { openContactModal } from "./contact-modal";

export function StickyCta({
  title,
  priceFrom,
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

        {(priceFrom || duration) && (
          <div className="mt-3 flex items-baseline gap-2">
            {priceFrom && (
              <span className="text-2xl font-serif text-navy">
                ${priceFrom.toLocaleString()}
              </span>
            )}
            {priceFrom && (
              <span className="text-xs text-foreground-muted">USD per person</span>
            )}
          </div>
        )}

        {duration && (
          <p className="mt-1 text-xs text-foreground-muted">{duration} days</p>
        )}

        <div className="mt-6 space-y-3">
          <Button
            size="md"
            className="w-full"
            onClick={() =>
              window.dispatchEvent(new Event("ce:open-concierge"))
            }
          >
            Start Planning
          </Button>
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => openContactModal(title)}
          >
            Contact Our Team
          </Button>
        </div>

        <p className="mt-4 text-[11px] text-center text-foreground-muted">
          Every journey is fully customisable
        </p>
      </div>
    </div>
  );
}
