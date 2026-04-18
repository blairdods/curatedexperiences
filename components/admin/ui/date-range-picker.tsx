"use client";

interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
}: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        className="text-xs px-2.5 py-1.5 border border-warm-200 rounded-lg bg-white focus:outline-none focus:border-navy/30"
      />
      <span className="text-xs text-foreground-muted">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        className="text-xs px-2.5 py-1.5 border border-warm-200 rounded-lg bg-white focus:outline-none focus:border-navy/30"
      />
    </div>
  );
}
