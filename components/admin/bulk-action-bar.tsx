"use client";

import { useState } from "react";

const STATUS_OPTIONS = [
  "new",
  "nurturing",
  "proposal_sent",
  "deposit",
  "confirmed",
  "closed_won",
  "closed_lost",
];

interface BulkActionBarProps {
  selectedCount: number;
  onAction: (action: "status" | "assign" | "delete", value?: string) => Promise<void>;
  onClear: () => void;
}

export function BulkActionBar({
  selectedCount,
  onAction,
  onClear,
}: BulkActionBarProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (
    action: "status" | "assign" | "delete",
    value?: string
  ) => {
    if (action === "delete" && !confirm(`Delete ${selectedCount} lead(s)? This cannot be undone.`)) {
      return;
    }
    setLoading(true);
    await onAction(action, value);
    setLoading(false);
  };

  return (
    <div className="sticky top-0 z-10 bg-navy text-white rounded-xl px-5 py-3 flex items-center gap-4 shadow-lg">
      <span className="text-sm font-medium">
        {selectedCount} selected
      </span>

      <select
        onChange={(e) => {
          if (e.target.value) handleAction("status", e.target.value);
          e.target.value = "";
        }}
        disabled={loading}
        className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white"
        defaultValue=""
      >
        <option value="" disabled>
          Change status...
        </option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} className="text-navy">
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => {
          handleAction("assign", e.target.value);
          e.target.value = "";
        }}
        disabled={loading}
        className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white"
        defaultValue=""
      >
        <option value="" disabled>
          Assign to...
        </option>
        <option value="" className="text-navy">Unassigned</option>
        <option value="tony" className="text-navy">Tony</option>
        <option value="liam" className="text-navy">Liam</option>
      </select>

      <button
        onClick={() => handleAction("delete")}
        disabled={loading}
        className="text-xs px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors"
      >
        Delete
      </button>

      <button
        onClick={onClear}
        className="ml-auto text-xs text-white/60 hover:text-white transition-colors"
      >
        Clear selection
      </button>
    </div>
  );
}
