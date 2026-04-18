"use client";

import { useDraggable } from "@dnd-kit/core";
import Link from "next/link";

interface Booking {
  id: string;
  status: string;
  total_value_usd: number | null;
  start_date: string | null;
  guests: unknown[] | null;
  tours: { title: string } | null;
}

export function KanbanCard({ booking }: { booking: Booking }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: booking.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-lg p-4 border border-warm-200 shadow-sm cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? "shadow-lg opacity-75 z-50" : "hover:shadow-md hover:border-navy/20"
      }`}
    >
      <Link
        href={`/admin/bookings/${booking.id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-medium text-foreground hover:text-navy transition-colors"
      >
        {booking.tours?.title ?? "Custom Journey"}
      </Link>
      {booking.total_value_usd && (
        <p className="text-lg font-serif text-navy mt-1">
          ${Number(booking.total_value_usd).toLocaleString()}
        </p>
      )}
      <div className="mt-2 flex items-center gap-3 text-xs text-foreground-muted">
        {booking.start_date && (
          <span>
            {new Date(booking.start_date).toLocaleDateString("en-NZ", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
        {booking.guests && (
          <span>{(booking.guests as unknown[]).length} guests</span>
        )}
      </div>
    </div>
  );
}
