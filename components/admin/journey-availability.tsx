"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AvailabilitySlot {
  id: string;
  start_date: string;
  end_date: string;
  capacity: number;
  booked_count: number;
  price_usd: number | null;
  status: string;
  notes: string | null;
}

const STATUS_OPTIONS = ["available", "limited", "unavailable"];

export function JourneyAvailability({
  tourId,
  slots,
}: {
  tourId: string;
  slots: AvailabilitySlot[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newSlot, setNewSlot] = useState({
    start_date: "",
    end_date: "",
    capacity: 1,
    price_usd: "",
    status: "available",
    notes: "",
  });

  const handleAdd = useCallback(async () => {
    if (!newSlot.start_date || !newSlot.end_date) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("journey_availability").insert({
      tour_id: tourId,
      start_date: newSlot.start_date,
      end_date: newSlot.end_date,
      capacity: newSlot.capacity,
      price_usd: newSlot.price_usd ? parseFloat(newSlot.price_usd) : null,
      status: newSlot.status,
      notes: newSlot.notes || null,
    });
    setSaving(false);
    setAdding(false);
    setNewSlot({
      start_date: "",
      end_date: "",
      capacity: 1,
      price_usd: "",
      status: "available",
      notes: "",
    });
    router.refresh();
  }, [tourId, newSlot, router]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this availability window?")) return;
      const supabase = createClient();
      await supabase.from("journey_availability").delete().eq("id", id);
      router.refresh();
    },
    [router]
  );

  const handleUpdate = useCallback(
    async (id: string, updates: Partial<AvailabilitySlot>) => {
      const supabase = createClient();
      await supabase
        .from("journey_availability")
        .update(updates)
        .eq("id", id);
      setEditingId(null);
      router.refresh();
    },
    [router]
  );

  return (
    <div className="bg-white rounded-xl border border-warm-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-warm-100">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted">
          Availability & Pricing ({slots.length})
        </h2>
        <button
          onClick={() => setAdding(!adding)}
          className="text-xs px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
        >
          {adding ? "Cancel" : "+ Add Window"}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="p-5 border-b border-warm-100 bg-warm-50/50 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-foreground-muted">Start Date</label>
              <input
                type="date"
                value={newSlot.start_date}
                onChange={(e) => setNewSlot((s) => ({ ...s, start_date: e.target.value }))}
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">End Date</label>
              <input
                type="date"
                value={newSlot.end_date}
                onChange={(e) => setNewSlot((s) => ({ ...s, end_date: e.target.value }))}
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Capacity</label>
              <input
                type="number"
                min={1}
                value={newSlot.capacity}
                onChange={(e) => setNewSlot((s) => ({ ...s, capacity: parseInt(e.target.value) || 1 }))}
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
              />
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Price Override (USD)</label>
              <input
                type="number"
                value={newSlot.price_usd}
                onChange={(e) => setNewSlot((s) => ({ ...s, price_usd: e.target.value }))}
                placeholder="Base price"
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-foreground-muted">Status</label>
              <select
                value={newSlot.status}
                onChange={(e) => setNewSlot((s) => ({ ...s, status: e.target.value }))}
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-warm-200 rounded-lg"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-foreground-muted">Notes</label>
              <input
                value={newSlot.notes}
                onChange={(e) => setNewSlot((s) => ({ ...s, notes: e.target.value }))}
                placeholder="Optional notes..."
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving || !newSlot.start_date || !newSlot.end_date}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add"}
          </button>
        </div>
      )}

      {/* Slots table */}
      {slots.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-warm-100 text-left">
              <th className="px-5 py-3 text-xs tracking-widest uppercase text-foreground-muted font-medium">
                Dates
              </th>
              <th className="px-5 py-3 text-xs tracking-widest uppercase text-foreground-muted font-medium">
                Capacity
              </th>
              <th className="px-5 py-3 text-xs tracking-widest uppercase text-foreground-muted font-medium">
                Price
              </th>
              <th className="px-5 py-3 text-xs tracking-widest uppercase text-foreground-muted font-medium">
                Status
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr
                key={slot.id}
                className="border-b border-warm-50 last:border-0"
              >
                <td className="px-5 py-3 text-foreground">
                  {new Date(slot.start_date).toLocaleDateString("en-NZ", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  –{" "}
                  {new Date(slot.end_date).toLocaleDateString("en-NZ", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3 text-foreground-muted">
                  {slot.booked_count}/{slot.capacity}
                </td>
                <td className="px-5 py-3 text-foreground">
                  {slot.price_usd
                    ? `$${Number(slot.price_usd).toLocaleString()}`
                    : "Base"}
                </td>
                <td className="px-5 py-3">
                  {editingId === slot.id ? (
                    <select
                      defaultValue={slot.status}
                      onChange={(e) =>
                        handleUpdate(slot.id, { status: e.target.value })
                      }
                      className="text-xs px-2 py-1 border border-warm-200 rounded bg-white"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingId(slot.id)}
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        slot.status === "available"
                          ? "bg-green-50 text-green-700"
                          : slot.status === "limited"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {slot.status}
                    </button>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !adding && (
          <div className="px-5 py-8 text-center text-sm text-foreground-muted">
            No availability windows set. Add one to enable seasonal pricing.
          </div>
        )
      )}
    </div>
  );
}
