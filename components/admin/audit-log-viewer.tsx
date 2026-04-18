"use client";

import { useState, useEffect, useCallback } from "react";

interface AuditEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes: { before?: unknown; after?: unknown } | null;
  user_email: string;
  created_at: string;
}

const ENTITY_TYPES = ["all", "lead", "booking", "content", "tour", "settings", "user_role", "email_template"];

export function AuditLogViewer() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("entity_type", filter);
    params.set("limit", "200");

    const res = await fetch(`/api/admin/audit?${params}`);
    if (res.ok) {
      setEntries(await res.json());
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const actionColor = (action: string) => {
    if (action === "created") return "bg-green-50 text-green-700";
    if (action === "updated") return "bg-blue-50 text-blue-700";
    if (action === "deleted") return "bg-red-50 text-red-700";
    if (action === "restored") return "bg-purple-50 text-purple-700";
    return "bg-gray-50 text-gray-700";
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {ENTITY_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              filter === t
                ? "bg-navy text-white"
                : "bg-warm-100 text-foreground-muted hover:bg-warm-200"
            }`}
          >
            {t === "all" ? "All" : t.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-foreground-muted py-8 text-center">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-foreground-muted py-8 text-center">No audit entries found.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg border border-warm-200 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === entry.id ? null : entry.id)
                }
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-warm-50/50 transition-colors"
              >
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${actionColor(
                    entry.action
                  )}`}
                >
                  {entry.action}
                </span>
                <span className="text-xs text-foreground-muted">
                  {entry.entity_type}
                </span>
                <span className="text-xs text-foreground truncate flex-1">
                  {entry.entity_id.substring(0, 8)}...
                </span>
                <span className="text-xs text-foreground-muted">
                  {entry.user_email}
                </span>
                <span className="text-[10px] text-foreground-muted">
                  {new Date(entry.created_at).toLocaleString("en-NZ", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </button>
              {expandedId === entry.id && entry.changes && (
                <div className="px-4 pb-3 border-t border-warm-100 pt-2">
                  <pre className="text-xs bg-warm-50 rounded p-3 overflow-auto max-h-64 text-foreground/70">
                    {JSON.stringify(entry.changes, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
