"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  intent_score: number | null;
  budget_signal: string | null;
  status: string;
  assigned_to: string | null;
  ai_brief: string | null;
  interests: string[] | null;
  journey_type_pref: string | null;
  group_size: number | null;
  group_composition: string | null;
  created_at: string;
}

const STATUS_OPTIONS = [
  "new",
  "nurturing",
  "proposal_sent",
  "deposit",
  "confirmed",
  "closed_won",
  "closed_lost",
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  nurturing: "bg-amber-50 text-amber-700",
  proposal_sent: "bg-purple-50 text-purple-700",
  deposit: "bg-emerald-50 text-emerald-700",
  confirmed: "bg-green-50 text-green-700",
  closed_won: "bg-green-100 text-green-800",
  closed_lost: "bg-gray-100 text-gray-500",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  const updateLead = async (
    id: string,
    updates: Partial<Pick<Lead, "status" | "assigned_to">>
  ) => {
    const supabase = createClient();
    await supabase.from("enquiries").update(updates).eq("id", id);
    router.refresh();
  };

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="bg-white rounded-xl border border-warm-200 overflow-hidden"
        >
          {/* Header row */}
          <div
            className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-warm-50/50"
            onClick={() =>
              setExpandedId(expandedId === lead.id ? null : lead.id)
            }
          >
            {/* Intent indicator */}
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                (lead.intent_score ?? 0) >= 7
                  ? "bg-red-500"
                  : (lead.intent_score ?? 0) >= 4
                    ? "bg-amber-400"
                    : "bg-gray-300"
              }`}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {lead.name || lead.email || "Anonymous"}
              </p>
              <p className="text-xs text-foreground-muted">
                {lead.source} —{" "}
                {new Date(lead.created_at).toLocaleDateString("en-NZ", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>

            {lead.intent_score && (
              <span className="text-xs text-foreground-muted">
                Score: {lead.intent_score}/10
              </span>
            )}

            <span
              className={`text-xs px-2.5 py-1 rounded-full ${
                STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {lead.status.replace("_", " ")}
            </span>

            <span className="text-xs text-foreground-muted">
              {lead.assigned_to ?? "Unassigned"}
            </span>
          </div>

          {/* Expanded detail */}
          {expandedId === lead.id && (
            <div className="px-5 pb-5 border-t border-warm-100 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-foreground-muted">Email</p>
                  <p className="text-foreground mt-0.5">
                    {lead.email ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-foreground-muted">Phone</p>
                  <p className="text-foreground mt-0.5">
                    {lead.phone ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-foreground-muted">Budget</p>
                  <p className="text-foreground mt-0.5">
                    {lead.budget_signal ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-foreground-muted">Group</p>
                  <p className="text-foreground mt-0.5">
                    {lead.group_size ? `${lead.group_size} people` : "—"}
                    {lead.group_composition
                      ? ` (${lead.group_composition})`
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="text-foreground-muted">Journey type</p>
                  <p className="text-foreground mt-0.5">
                    {lead.journey_type_pref ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-foreground-muted">Interests</p>
                  <p className="text-foreground mt-0.5">
                    {lead.interests?.join(", ") ?? "—"}
                  </p>
                </div>
              </div>

              {lead.ai_brief && (
                <div className="mt-4 p-3 bg-warm-50 rounded-lg">
                  <p className="text-xs text-foreground-muted mb-1">
                    AI Brief
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {lead.ai_brief}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center gap-3">
                <select
                  value={lead.status}
                  onChange={(e) =>
                    updateLead(lead.id, { status: e.target.value })
                  }
                  className="text-xs px-3 py-2 border border-warm-200 rounded-lg bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>

                <select
                  value={lead.assigned_to ?? ""}
                  onChange={(e) =>
                    updateLead(lead.id, {
                      assigned_to: e.target.value || null,
                    })
                  }
                  className="text-xs px-3 py-2 border border-warm-200 rounded-lg bg-white"
                >
                  <option value="">Unassigned</option>
                  <option value="tony">Tony</option>
                  <option value="liam">Liam</option>
                </select>
              </div>
            </div>
          )}
        </div>
      ))}

      {leads.length === 0 && (
        <div className="text-center py-12 text-foreground-muted text-sm">
          No leads yet. They&apos;ll appear here when visitors interact with
          the concierge.
        </div>
      )}
    </div>
  );
}
