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

export function LeadDetail({
  lead,
  hasBooking,
}: {
  lead: Lead;
  hasBooking: boolean;
}) {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Editable contact fields
  const [name, setName] = useState(lead.name ?? "");
  const [email, setEmail] = useState(lead.email ?? "");
  const [phone, setPhone] = useState(lead.phone ?? "");
  const [budgetSignal, setBudgetSignal] = useState(lead.budget_signal ?? "");
  const [journeyTypePref, setJourneyTypePref] = useState(lead.journey_type_pref ?? "");
  const [groupSize, setGroupSize] = useState(lead.group_size?.toString() ?? "");
  const [groupComposition, setGroupComposition] = useState(lead.group_composition ?? "");
  const [contactDirty, setContactDirty] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  // Status & assignment
  const [status, setStatus] = useState(lead.status);
  const [assignedTo, setAssignedTo] = useState(lead.assigned_to ?? "");
  const [statusSaving, setStatusSaving] = useState(false);

  // Notes
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);

  // Booking creation
  const [creatingBooking, setCreatingBooking] = useState(false);

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

  // Check if contact info changed
  useEffect(() => {
    const dirty =
      name !== (lead.name ?? "") ||
      email !== (lead.email ?? "") ||
      phone !== (lead.phone ?? "") ||
      budgetSignal !== (lead.budget_signal ?? "") ||
      journeyTypePref !== (lead.journey_type_pref ?? "") ||
      groupSize !== (lead.group_size?.toString() ?? "") ||
      groupComposition !== (lead.group_composition ?? "");
    setContactDirty(dirty);
    setContactSaved(false);
  }, [name, email, phone, budgetSignal, journeyTypePref, groupSize, groupComposition, lead]);

  const logActivity = async (type: string, description: string, metadata?: Record<string, unknown>) => {
    await fetch(`/api/admin/leads/${lead.id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, description, metadata }),
    });
  };

  const logAudit = async (action: string, changes: Record<string, unknown>) => {
    await fetch("/api/admin/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "lead",
        entityId: lead.id,
        action,
        changes,
      }),
    });
  };

  // Save contact info
  const handleSaveContact = async () => {
    setContactSaving(true);
    const supabase = createClient();
    const updates: Record<string, unknown> = {
      name: name.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      budget_signal: budgetSignal.trim() || null,
      journey_type_pref: journeyTypePref.trim() || null,
      group_size: groupSize ? parseInt(groupSize) : null,
      group_composition: groupComposition.trim() || null,
    };

    await supabase.from("enquiries").update(updates).eq("id", lead.id);
    await logActivity("contact_updated", "Contact information updated");
    await logAudit("updated", { after: updates });

    setContactSaving(false);
    setContactDirty(false);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
    fetchActivities();
    router.refresh();
  };

  const handleDiscardContact = () => {
    setName(lead.name ?? "");
    setEmail(lead.email ?? "");
    setPhone(lead.phone ?? "");
    setBudgetSignal(lead.budget_signal ?? "");
    setJourneyTypePref(lead.journey_type_pref ?? "");
    setGroupSize(lead.group_size?.toString() ?? "");
    setGroupComposition(lead.group_composition ?? "");
  };

  // Auto-create booking when status → deposit
  const createBookingForLead = async () => {
    setCreatingBooking(true);
    const supabase = createClient();

    // Check if booking already exists for this lead
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("enquiry_id", lead.id)
      .limit(1);

    if (existing && existing.length > 0) {
      setCreatingBooking(false);
      router.push(`/admin/bookings/${existing[0].id}`);
      return;
    }

    // Find the tour if lead had a journey interest
    let tourId = null;
    if (lead.journey_type_pref) {
      const { data: tour } = await supabase
        .from("tours")
        .select("id")
        .ilike("title", `%${lead.journey_type_pref}%`)
        .limit(1)
        .single();
      tourId = tour?.id ?? null;
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        enquiry_id: lead.id,
        tour_id: tourId,
        status: "deposit",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create booking:", error.message);
      setCreatingBooking(false);
      return;
    }

    await logActivity("booking_created", `Booking created (${booking.id.substring(0, 8)})`);
    await logAudit("booking_created", { after: { booking_id: booking.id } });

    setCreatingBooking(false);
    fetchActivities();
    router.refresh();
    router.push(`/admin/bookings/${booking.id}`);
  };

  // Status change
  const handleStatusChange = async (newStatus: string) => {
    setStatusSaving(true);
    setStatus(newStatus);

    const supabase = createClient();
    await supabase.from("enquiries").update({ status: newStatus }).eq("id", lead.id);

    await logActivity("status_change", `Status changed to ${newStatus.replace(/_/g, " ")}`, {
      from: lead.status,
      to: newStatus,
    });
    await logAudit("updated", {
      before: { status: lead.status },
      after: { status: newStatus },
    });

    setStatusSaving(false);
    fetchActivities();
    router.refresh();

    // Auto-create booking on deposit
    if (newStatus === "deposit" && !hasBooking) {
      await createBookingForLead();
    }
  };

  // Assignment change
  const handleAssignmentChange = async (newAssignee: string) => {
    setStatusSaving(true);
    setAssignedTo(newAssignee);

    const supabase = createClient();
    await supabase
      .from("enquiries")
      .update({ assigned_to: newAssignee || null })
      .eq("id", lead.id);

    await logActivity(
      "assignment",
      newAssignee ? `Assigned to ${newAssignee}` : "Unassigned"
    );
    await logAudit("updated", {
      before: { assigned_to: lead.assigned_to },
      after: { assigned_to: newAssignee || null },
    });

    setStatusSaving(false);
    fetchActivities();
    router.refresh();
  };

  // Notes
  const handleSaveNotes = async () => {
    setNotesSaving(true);
    const supabase = createClient();
    await supabase.from("enquiries").update({ notes }).eq("id", lead.id);
    setNotesDirty(false);
    setNotesSaving(false);
    router.refresh();
  };

  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const inputClass =
    "w-full px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column — main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Editable Contact info */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest uppercase text-foreground-muted">
              Contact Information
            </h2>
            {contactSaved && (
              <span className="text-xs text-green-600">Saved</span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-foreground-muted">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name..."
                className={inputClass + " mt-1"}
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className={inputClass + " mt-1"}
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                className={inputClass + " mt-1"}
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Budget Signal</label>
              <select
                value={budgetSignal}
                onChange={(e) => setBudgetSignal(e.target.value)}
                className={inputClass + " mt-1"}
              >
                <option value="">Unknown</option>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Journey Preference</label>
              <input
                value={journeyTypePref}
                onChange={(e) => setJourneyTypePref(e.target.value)}
                placeholder="e.g. The Masterpiece"
                className={inputClass + " mt-1"}
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Source</label>
              <p className="mt-1 px-3 py-2 text-sm text-foreground-muted">
                {lead.source ?? "—"}
              </p>
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Group Size</label>
              <input
                type="number"
                min="1"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                placeholder="e.g. 2"
                className={inputClass + " mt-1"}
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Group Composition</label>
              <input
                value={groupComposition}
                onChange={(e) => setGroupComposition(e.target.value)}
                placeholder="e.g. couple, family"
                className={inputClass + " mt-1"}
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Interests</label>
              <p className="mt-1 px-3 py-2 text-sm text-foreground-muted">
                {lead.interests?.join(", ") ?? "—"}
              </p>
            </div>
          </div>

          {contactDirty && (
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-warm-100">
              <button
                onClick={handleSaveContact}
                disabled={contactSaving}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors disabled:opacity-50"
              >
                {contactSaving ? "Saving..." : "Save Contact Info"}
              </button>
              <button
                onClick={handleDiscardContact}
                className="px-4 py-2 text-xs text-foreground-muted hover:text-foreground transition-colors"
              >
                Discard
              </button>
            </div>
          )}
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
                disabled={notesSaving}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
              >
                {notesSaving ? "Saving..." : "Save Notes"}
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
            Status & Assignment
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-foreground-muted mb-1.5 block">Status</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusSaving}
                className="w-full text-sm px-3 py-2 border border-warm-200 rounded-lg bg-white disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              {statusSaving && (
                <p className="text-[10px] text-foreground-muted mt-1">Saving...</p>
              )}
            </div>
            <div>
              <label className="text-xs text-foreground-muted mb-1.5 block">Assigned to</label>
              <select
                value={assignedTo}
                onChange={(e) => handleAssignmentChange(e.target.value)}
                disabled={statusSaving}
                className="w-full text-sm px-3 py-2 border border-warm-200 rounded-lg bg-white disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                <option value="tony">Tony</option>
                <option value="liam">Liam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Booking */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Booking
          </h2>
          {hasBooking ? (
            <p className="text-xs text-green-600">
              A booking exists for this lead. Check the Bookings page.
            </p>
          ) : (
            <div>
              <p className="text-xs text-foreground-muted mb-3">
                No booking yet. One will be created automatically when status
                changes to &ldquo;deposit&rdquo;, or you can create one manually.
              </p>
              <button
                onClick={createBookingForLead}
                disabled={creatingBooking}
                className="w-full px-4 py-2.5 text-xs font-medium rounded-lg bg-gold text-white hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {creatingBooking ? "Creating..." : "Create Booking"}
              </button>
            </div>
          )}
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
