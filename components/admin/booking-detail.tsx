"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import Link from "next/link";

interface Booking {
  id: string;
  enquiry_id: string | null;
  tour_id: string | null;
  custom_itinerary: Record<string, unknown> | null;
  start_date: string | null;
  end_date: string | null;
  guests: Record<string, unknown>[] | null;
  total_value_usd: number | null;
  cost_breakdown: Record<string, unknown> | null;
  gross_margin_pct: number | null;
  deposit_amount: number | null;
  deposit_paid_at: string | null;
  balance_due_date: string | null;
  balance_paid_at: string | null;
  supplier_bookings: Record<string, unknown>[] | null;
  documents: string[] | null;
  status: string;
  post_trip_review: string | null;
  created_at: string;
  tours: { title: string; slug: string } | null;
  enquiries: { name: string | null; email: string | null } | null;
}

const STATUS_FLOW = ["confirmed", "deposit", "in_progress", "completed"];

export function BookingDetail({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [status, setStatus] = useState(booking.status);
  const [depositPaidAt, setDepositPaidAt] = useState(booking.deposit_paid_at ?? "");
  const [balancePaidAt, setBalancePaidAt] = useState(booking.balance_paid_at ?? "");
  const [saving, setSaving] = useState(false);
  const [newDoc, setNewDoc] = useState("");
  const [documents, setDocuments] = useState<string[]>(booking.documents ?? []);

  const updateBooking = async (updates: Record<string, unknown>) => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("bookings").update(updates).eq("id", booking.id);

    // Log audit
    await fetch("/api/admin/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "booking",
        entityId: booking.id,
        action: "updated",
        changes: { after: updates },
      }),
    });

    setSaving(false);
    router.refresh();
  };

  const handleStatusTransition = (newStatus: string) => {
    setStatus(newStatus);
    updateBooking({ status: newStatus });
  };

  const handleMarkDepositPaid = () => {
    const now = new Date().toISOString();
    setDepositPaidAt(now);
    updateBooking({ deposit_paid_at: now });
  };

  const handleMarkBalancePaid = () => {
    const now = new Date().toISOString();
    setBalancePaidAt(now);
    updateBooking({ balance_paid_at: now });
  };

  const handleAddDocument = () => {
    if (!newDoc.trim()) return;
    const updated = [...documents, newDoc.trim()];
    setDocuments(updated);
    setNewDoc("");
    updateBooking({ documents: updated });
  };

  const totalValue = Number(booking.total_value_usd ?? 0);
  const depositAmount = Number(booking.deposit_amount ?? 0);
  const balanceRemaining = totalValue - depositAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Status Workflow */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Status Workflow
          </h2>
          <div className="flex items-center gap-2">
            {STATUS_FLOW.map((s, i) => {
              const isActive = s === status;
              const isPast = STATUS_FLOW.indexOf(status) > i;
              return (
                <button
                  key={s}
                  onClick={() => handleStatusTransition(s)}
                  disabled={saving}
                  className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-navy text-white"
                      : isPast
                        ? "bg-green-50 text-green-700"
                        : "bg-warm-50 text-foreground-muted hover:bg-warm-100"
                  }`}
                >
                  {s.replace(/_/g, " ")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guest & Travel Details */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Travel Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-foreground-muted">Journey</p>
              <p className="mt-0.5 font-medium">
                {booking.tours?.title ?? "Custom Journey"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Start Date</p>
              <p className="mt-0.5">
                {booking.start_date
                  ? new Date(booking.start_date).toLocaleDateString("en-NZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">End Date</p>
              <p className="mt-0.5">
                {booking.end_date
                  ? new Date(booking.end_date).toLocaleDateString("en-NZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Guests</p>
              <p className="mt-0.5">
                {booking.guests ? `${booking.guests.length} guests` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Created</p>
              <p className="mt-0.5">
                {new Date(booking.created_at).toLocaleDateString("en-NZ", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Linked Lead */}
        {booking.enquiries && (
          <div className="bg-white rounded-xl p-5 border border-warm-200">
            <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-3">
              Linked Lead
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {booking.enquiries.name ?? booking.enquiries.email ?? "—"}
                </p>
                <p className="text-xs text-foreground-muted">
                  {booking.enquiries.email}
                </p>
              </div>
              {booking.enquiry_id && (
                <Link
                  href={`/admin/leads/${booking.enquiry_id}`}
                  className="text-xs text-navy hover:text-navy-light transition-colors"
                >
                  View lead &rarr;
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Supplier Bookings */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Supplier Bookings
          </h2>
          {booking.supplier_bookings && booking.supplier_bookings.length > 0 ? (
            <div className="space-y-2">
              {booking.supplier_bookings.map((sb, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-warm-50 rounded-lg px-3 py-2 text-sm"
                >
                  <span>{(sb as Record<string, string>).supplier ?? `Supplier ${i + 1}`}</span>
                  <span className="text-xs text-foreground-muted">
                    {(sb as Record<string, string>).confirmation ?? "No ref"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground-muted">
              No supplier bookings recorded.
            </p>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Documents
          </h2>
          {documents.length > 0 ? (
            <div className="space-y-2 mb-4">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-warm-50 rounded-lg px-3 py-2 text-sm"
                >
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy hover:text-navy-light truncate"
                  >
                    {doc}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground-muted mb-4">
              No documents attached.
            </p>
          )}
          <div className="flex gap-2">
            <input
              value={newDoc}
              onChange={(e) => setNewDoc(e.target.value)}
              placeholder="Document URL..."
              className="flex-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
            />
            <button
              onClick={handleAddDocument}
              className="px-4 py-2 text-xs bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Right column — Financials */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Financials
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-foreground-muted">Total Value</p>
              <p className="text-2xl font-serif text-navy mt-0.5">
                ${totalValue.toLocaleString()}
              </p>
            </div>

            <div className="border-t border-warm-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground-muted">Deposit</p>
                  <p className="text-sm font-medium mt-0.5">
                    ${depositAmount.toLocaleString()}
                  </p>
                </div>
                {depositPaidAt ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                    Paid{" "}
                    {new Date(depositPaidAt).toLocaleDateString("en-NZ", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                ) : (
                  <button
                    onClick={handleMarkDepositPaid}
                    className="text-xs px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-warm-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground-muted">Balance</p>
                  <p className="text-sm font-medium mt-0.5">
                    ${balanceRemaining.toLocaleString()}
                  </p>
                  {booking.balance_due_date && (
                    <p className="text-[11px] text-foreground-muted mt-0.5">
                      Due{" "}
                      {new Date(booking.balance_due_date).toLocaleDateString(
                        "en-NZ",
                        { day: "numeric", month: "short" }
                      )}
                    </p>
                  )}
                </div>
                {balancePaidAt ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                    Paid{" "}
                    {new Date(balancePaidAt).toLocaleDateString("en-NZ", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                ) : (
                  <button
                    onClick={handleMarkBalancePaid}
                    className="text-xs px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>

            {booking.gross_margin_pct && (
              <div className="border-t border-warm-100 pt-4">
                <p className="text-xs text-foreground-muted">Gross Margin</p>
                <p className="text-sm font-medium mt-0.5">
                  {Number(booking.gross_margin_pct).toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Status
          </h2>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}
