"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { ActivityTimeline } from "@/components/admin/activity-timeline";
import { AddNoteForm } from "@/components/admin/add-note-form";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  utm_campaign: string | null;
  intent_score: number | null;
  budget_signal: string | null;
  status: string;
  assigned_to: string | null;
  ai_brief: string | null;
  interests: string[] | null;
  journey_type_pref: string | null;
  group_size: number | null;
  group_composition: string | null;
  notes: string | null;
  nurture_sequence: string | null;
  created_at: string;
  last_contact_at: string | null;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_by: string | null;
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

export function LeadDetail({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [assignedTo, setAssignedTo] = useState(lead.assigned_to ?? "");
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = useCallback(async () => {
    const res = await fetch(`/api/admin/leads/${lead.id}/activities`);
    if (res.ok) {
      const data = await res.json();
      setActivities(data);
    }
  }, [lead.id]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const updateField = async (
    field: string,
    value: string | null,
    activityType: string,
    description: string,
    metadata?: Record<string, unknown>
  ) => {
    const supabase = createClient();
    await supabase
      .from("enquiries")
      .update({ [field]: value })
      .eq("id", lead.id);

    // Log activity
    await fetch(`/api/admin/leads/${lead.id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: activityType, description, metadata }),
    });

    fetchActivities();
    router.refresh();
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    updateField("status", newStatus, "status_change", `Status changed to ${newStatus.replace(/_/g, " ")}`, {
      from: lead.status,
      to: newStatus,
    });
  };

  const handleAssignmentChange = (newAssignee: string) => {
    setAssignedTo(newAssignee);
    updateField(
      "assigned_to",
      newAssignee || null,
      "assignment",
      newAssignee ? `Assigned to ${newAssignee}` : "Unassigned"
    );
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("enquiries")
      .update({ notes })
      .eq("id", lead.id);
    setNotesDirty(false);
    setSaving(false);
    router.refresh();
  };

  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column — main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Contact info */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-foreground-muted">Name</p>
              <p className="mt-0.5">{lead.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Email</p>
              <p className="mt-0.5">{lead.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Phone</p>
              <p className="mt-0.5">{lead.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Source</p>
              <p className="mt-0.5">{lead.source ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Campaign</p>
              <p className="mt-0.5">{lead.utm_campaign ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Journey Preference</p>
              <p className="mt-0.5">{lead.journey_type_pref ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Budget Signal</p>
              <p className="mt-0.5">{lead.budget_signal ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Group</p>
              <p className="mt-0.5">
                {lead.group_size ? `${lead.group_size} people` : "—"}
                {lead.group_composition ? ` (${lead.group_composition})` : ""}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Interests</p>
              <p className="mt-0.5">{lead.interests?.join(", ") ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* AI Brief */}
        {lead.ai_brief && (
          <div className="bg-white rounded-xl p-5 border border-warm-200">
            <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-3">
              AI Brief
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {lead.ai_brief}
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-3">
            Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setNotesDirty(true);
            }}
            rows={4}
            placeholder="Internal notes about this lead..."
            className="w-full px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg
              focus:outline-none focus:border-navy/30 resize-y"
          />
          {notesDirty && (
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>
              <button
                onClick={() => {
                  setNotes(lead.notes ?? "");
                  setNotesDirty(false);
                }}
                className="px-4 py-2 text-xs text-foreground-muted hover:text-foreground transition-colors"
              >
                Discard
              </button>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Activity
          </h2>
          <AddNoteForm enquiryId={lead.id} onAdded={fetchActivities} />
          <div className="mt-5 pt-5 border-t border-warm-100">
            <ActivityTimeline activities={activities} />
          </div>
        </div>
      </div>

      {/* Right column — sidebar */}
      <div className="space-y-6">
        {/* Status & Assignment */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Status
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-foreground-muted mb-1.5">Status</p>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-warm-200 rounded-lg bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs text-foreground-muted mb-1.5">Assigned to</p>
              <select
                value={assignedTo}
                onChange={(e) => handleAssignmentChange(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-warm-200 rounded-lg bg-white"
              >
                <option value="">Unassigned</option>
                <option value="tony">Tony</option>
                <option value="liam">Liam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Quick Stats
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Intent Score</span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    (lead.intent_score ?? 0) >= 7
                      ? "bg-red-500"
                      : (lead.intent_score ?? 0) >= 4
                        ? "bg-amber-400"
                        : "bg-gray-300"
                  }`}
                />
                <span className="text-sm font-medium">
                  {lead.intent_score ?? "—"}/10
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Days in Pipeline</span>
              <span className="text-sm font-medium">{daysSinceCreated}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Current Status</span>
              <StatusBadge status={status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Nurture</span>
              <span className="text-xs text-foreground">
                {lead.nurture_sequence ?? "None"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Created</span>
              <span className="text-xs text-foreground">
                {new Date(lead.created_at).toLocaleDateString("en-NZ", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
