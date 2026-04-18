"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "nurturing", label: "Nurturing" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "deposit", label: "Deposit" },
  { value: "confirmed", label: "Confirmed" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

const SCORE_OPTIONS = [
  { value: "", label: "All scores" },
  { value: "hot", label: "Hot (7-10)" },
  { value: "warm", label: "Warm (4-6)" },
  { value: "cold", label: "Cold (0-3)" },
];

export function LeadFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/admin/leads?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = () => {
    updateFilters("q", search);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by name or email..."
          className="w-full text-sm px-3 py-2 border border-warm-200 rounded-lg bg-white
            focus:outline-none focus:border-navy/30"
        />
      </div>
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateFilters("status", e.target.value)}
        className="text-xs px-3 py-2 border border-warm-200 rounded-lg bg-white"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select
        value={searchParams.get("score") ?? ""}
        onChange={(e) => updateFilters("score", e.target.value)}
        className="text-xs px-3 py-2 border border-warm-200 rounded-lg bg-white"
      >
        {SCORE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
