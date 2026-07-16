"use client";

export function ConciergeHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-navy text-background px-5 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl">
      <div>
        <h2 id="concierge-title" className="text-base font-light tracking-widest uppercase">
          Your Curator
        </h2>
        <p className="text-xs text-stone mt-0.5">
          New Zealand Travel Concierge
        </p>
      </div>
      <button
        onClick={onClose}
        aria-label="Close concierge"
        className="rounded-full p-2 text-background/60 transition-colors hover:bg-white/10 hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="w-5 h-5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
