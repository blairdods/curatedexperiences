"use client";

import { IconConcierge } from "@/components/ui/icon-concierge";

export function ConciergeTrigger({
  isOpen,
  showPrompt,
  onClick,
  onPromptClick,
  onPromptDismiss,
}: {
  isOpen: boolean;
  showPrompt: boolean;
  onClick: () => void;
  onPromptClick: () => void;
  onPromptDismiss: () => void;
}) {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3">
      {/* Soft prompt bubble */}
      {showPrompt && (
        <div className="animate-[concierge-fade-in_0.4s_ease-out] max-w-[260px]">
          <div
            className="bg-white rounded-2xl rounded-br-sm px-4 py-3
              shadow-[0_8px_32px_-4px_rgba(31,56,100,0.12)]
              border border-warm-200 cursor-pointer"
            onClick={onPromptClick}
          >
            <p className="text-sm text-foreground/80 leading-relaxed">
              Thinking about a New Zealand journey? I&apos;d love to help you explore ideas.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPromptDismiss();
            }}
            className="mt-1 text-[10px] text-foreground/30 hover:text-foreground/50
              transition-colors ml-auto block"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={onClick}
        aria-label="Open travel concierge"
        className="w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full
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
    </div>
  );
}
