"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  tagline: string | null;
  highlights: string[] | null;
  best_for: string[] | null;
  active: boolean;
  updated_at: string;
  sort_order: number;
}

function SortableDestination({
  destination,
  position,
  confirmId,
  deletingId,
  onConfirmDelete,
  onDelete,
}: {
  destination: Destination;
  position: number;
  confirmId: string | null;
  deletingId: string | null;
  onConfirmDelete: (id: string | null) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: destination.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex items-center gap-3 sm:gap-4 bg-white rounded-xl border px-3 sm:px-5 py-4 ${
        isDragging
          ? "border-navy/30 shadow-lg opacity-80 z-10"
          : "border-warm-200"
      }`}
    >
      <button
        type="button"
        aria-label={`Move ${destination.name}`}
        className="touch-none cursor-grab active:cursor-grabbing text-warm-400 hover:text-navy p-1 -ml-1"
        {...attributes}
        {...listeners}
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <circle cx="5" cy="3" r="1.25" />
          <circle cx="11" cy="3" r="1.25" />
          <circle cx="5" cy="8" r="1.25" />
          <circle cx="11" cy="8" r="1.25" />
          <circle cx="5" cy="13" r="1.25" />
          <circle cx="11" cy="13" r="1.25" />
        </svg>
      </button>

      <span className="w-6 text-right text-xs tabular-nums text-foreground-muted">
        {position}
      </span>

      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          destination.active ? "bg-green-500" : "bg-warm-300"
        }`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {destination.name}
          </p>
          <span className="hidden sm:inline text-[9px] uppercase tracking-wider text-foreground-muted bg-warm-100 rounded px-1.5 py-0.5">
            {destination.region}
          </span>
        </div>
        {destination.tagline && (
          <p className="text-xs text-foreground-muted truncate">
            {destination.tagline}
          </p>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-4 text-xs text-foreground-muted flex-shrink-0">
        <span>{destination.highlights?.length ?? 0} highlights</span>
        <span className="max-w-[160px] truncate">
          {destination.best_for?.slice(0, 3).join(", ")}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          href={`/admin/destinations/${destination.id}`}
          className="text-xs text-navy hover:text-navy-light transition-colors"
        >
          Edit
        </Link>
        <Link
          href={`/destinations/${destination.slug}`}
          target="_blank"
          className="hidden sm:inline text-xs text-foreground-muted hover:text-foreground transition-colors"
        >
          View
        </Link>
        {confirmId === destination.id ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDelete(destination.id)}
              disabled={deletingId === destination.id}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              {deletingId === destination.id ? "…" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => onConfirmDelete(null)}
              className="text-xs text-foreground-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onConfirmDelete(destination.id)}
            className="text-xs text-foreground-muted hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export function DestinationsList({
  destinations,
}: {
  destinations: Destination[];
}) {
  const router = useRouter();
  const [orderedDestinations, setOrderedDestinations] = useState(destinations);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    setOrderedDestinations(destinations);
  }, [destinations]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    setDeletingId(null);
    setConfirmId(null);
    router.refresh();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || savingOrder) return;

    const previousOrder = orderedDestinations;
    const oldIndex = previousOrder.findIndex(
      (destination) => destination.id === active.id
    );
    const newIndex = previousOrder.findIndex(
      (destination) => destination.id === over.id
    );
    if (oldIndex === -1 || newIndex === -1) return;

    const nextOrder = arrayMove(previousOrder, oldIndex, newIndex);
    setOrderedDestinations(nextOrder);
    setSavingOrder(true);
    setOrderError("");

    try {
      const response = await fetch("/api/admin/destinations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: nextOrder.map((destination) => destination.id),
        }),
      });
      const result = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not save destination order");
      }

      router.refresh();
    } catch (error) {
      setOrderedDestinations(previousOrder);
      setOrderError(
        error instanceof Error ? error.message : "Could not save destination order"
      );
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-xs text-foreground-muted">
          Drag destinations into the order they should appear on the public site.
        </p>
        <span className="text-xs text-foreground-muted flex-shrink-0">
          {savingOrder ? "Saving order…" : "Order saves automatically"}
        </span>
      </div>

      {orderError && (
        <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {orderError}
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedDestinations.map((destination) => destination.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {orderedDestinations.map((destination, index) => (
              <SortableDestination
                key={destination.id}
                destination={destination}
                position={index + 1}
                confirmId={confirmId}
                deletingId={deletingId}
                onConfirmDelete={setConfirmId}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
