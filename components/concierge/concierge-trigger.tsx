"use client";

import { IconConcierge } from "@/components/ui/icon-concierge";

export function ConciergeTrigger({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      aria-label="Open travel concierge"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50
        w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full
        bg-navy text-background
        shadow-[0_8px_32px_-4px_rgba(31,56,100,0.3)]
        hover:shadow-[0_12px_40px_-4px_rgba(31,56,100,0.4)]
        hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        flex items-center justify-center
        animate-[concierge-fade-in_0.5s_ease-out_2s_both]"
    >
      <IconConcierge className="w-6 h-6 sm:w-7 sm:h-7" />
    </button>
  );
}
