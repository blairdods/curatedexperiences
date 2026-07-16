export function ConciergeOfframp({ onDirectContact }: { onDirectContact: () => void }) {
  return (
    <div className="px-5 py-2.5 border-t border-warm-200 text-center">
      <p className="text-[11px] text-foreground/40 leading-relaxed">
        Prefer a real person?{" "}
        <button
          onClick={onDirectContact}
          className="text-navy/60 hover:text-navy underline underline-offset-2 transition-colors"
        >
          Speak with Tony or Liam directly
        </button>
      </p>
    </div>
  );
}
