"use client";

import { useState } from "react";

interface ExportButtonProps {
  endpoint: string; // e.g. "/api/admin/export/leads"
  label?: string;
}

export function ExportButton({ endpoint, label = "Export CSV" }: ExportButtonProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const url = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`;
    window.open(url, "_blank");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 text-xs border border-warm-200 rounded-lg bg-white hover:bg-warm-50 transition-colors"
      >
        {label}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-warm-200 shadow-lg p-4 z-10 w-64">
          <p className="text-xs font-medium text-foreground mb-3">
            Date Range (optional)
          </p>
          <div className="space-y-2 mb-3">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From"
              className="w-full text-xs px-2.5 py-1.5 border border-warm-200 rounded-lg bg-white"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To"
              className="w-full text-xs px-2.5 py-1.5 border border-warm-200 rounded-lg bg-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 px-3 py-2 text-xs font-medium bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-2 text-xs text-foreground-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
