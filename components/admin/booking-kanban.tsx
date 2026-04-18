"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { KanbanCard } from "@/components/admin/kanban-card";

interface Booking {
  id: string;
  status: string;
  total_value_usd: number | null;
  start_date: string | null;
  guests: unknown[] | null;
  tours: { title: string } | null;
}

const COLUMNS = [
  { key: "deposit", label: "Deposit Paid" },
  { key: "planning", label: "Planning" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const VALID_TRANSITIONS: Record<string, string[]> = {
  deposit: ["planning"],
  planning: ["deposit", "in_progress"],
  in_progress: ["planning", "completed"],
  completed: ["in_progress"],
};

function DroppableColumn({
  columnKey,
  label,
  bookings,
  isOver,
}: {
  columnKey: string;
  label: string;
  bookings: Booking[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: columnKey });

  return (
    <div ref={setNodeRef}>
      <h3 className="text-xs tracking-widest uppercase text-foreground-muted mb-3">
        {label}
        <span className="ml-2 text-warm-400">{bookings.length}</span>
      </h3>
      <div
        className={`space-y-3 min-h-[200px] rounded-lg p-2 transition-colors ${
          isOver ? "bg-navy/5 ring-2 ring-navy/20" : ""
        }`}
      >
        {bookings.map((booking) => (
          <KanbanCard key={booking.id} booking={booking} />
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-8 text-xs text-foreground-muted bg-warm-50/50 rounded-lg border border-dashed border-warm-200">
            No bookings
          </div>
        )}
      </div>
    </div>
  );
}

export function BookingKanban({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const byStatus = COLUMNS.map((col) => ({
    ...col,
    bookings: bookings.filter((b) => b.status === col.key),
  }));

  const activeBooking = activeId
    ? bookings.find((b) => b.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragEndEvent) => {
    setOverId(event.over?.id ? String(event.over.id) : null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    setOverId(null);

    const { active, over } = event;
    if (!over) return;

    const bookingId = String(active.id);
    const newStatus = String(over.id);
    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking || booking.status === newStatus) return;

    // Validate transition
    const allowed = VALID_TRANSITIONS[booking.status];
    if (!allowed?.includes(newStatus)) return;

    // Update status
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    // Log audit
    await fetch("/api/admin/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "booking",
        entityId: bookingId,
        action: "updated",
        changes: { before: { status: booking.status }, after: { status: newStatus } },
      }),
    });

    router.refresh();
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {byStatus.map((col) => (
          <DroppableColumn
            key={col.key}
            columnKey={col.key}
            label={col.label}
            bookings={col.bookings}
            isOver={overId === col.key}
          />
        ))}
      </div>

      <DragOverlay>
        {activeBooking ? (
          <div className="bg-white rounded-lg p-4 border border-navy/30 shadow-xl opacity-90 w-64">
            <p className="text-sm font-medium text-foreground">
              {activeBooking.tours?.title ?? "Custom Journey"}
            </p>
            {activeBooking.total_value_usd && (
              <p className="text-lg font-serif text-navy mt-1">
                ${Number(activeBooking.total_value_usd).toLocaleString()}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
