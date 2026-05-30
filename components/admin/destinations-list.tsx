"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
}

export function DestinationsList({ destinations }: { destinations: Destination[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    setDeletingId(null);
    setConfirmId(null);
    router.refresh();
  };

  const northIsland = destinations.filter((d) => d.region === "North Island");
  const southIsland = destinations.filter((d) => d.region === "South Island");

  const renderGroup = (label: string, items: Destination[]) => (
    items.length === 0 ? null : (
      <div key={label}>
        <p className="text-[10px] uppercase tracking-widest text-foreground-muted mb-2 mt-6 first:mt-0">{label}</p>
        <div className="space-y-2">
          {items.map((dest) => (
            <div
              key={dest.id}
              className="flex items-center gap-4 bg-white rounded-xl border border-warm-200 px-5 py-4"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dest.active ? "bg-green-500" : "bg-warm-300"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{dest.name}</p>
                {dest.tagline && (
                  <p className="text-xs text-foreground-muted truncate">{dest.tagline}</p>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-foreground-muted flex-shrink-0">
                <span>{dest.highlights?.length ?? 0} highlights</span>
                <span className="max-w-[160px] truncate">
                  {dest.best_for?.slice(0, 3).join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={`/admin/destinations/${dest.id}`}
                  className="text-xs text-navy hover:text-navy-light transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/destinations/${dest.slug}`}
                  target="_blank"
                  className="text-xs text-foreground-muted hover:text-foreground transition-colors"
                >
                  View
                </Link>
                {confirmId === dest.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(dest.id)}
                      disabled={deletingId === dest.id}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      {deletingId === dest.id ? "…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs text-foreground-muted hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(dest.id)}
                    className="text-xs text-foreground-muted hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div>
      {renderGroup("North Island", northIsland)}
      {renderGroup("South Island", southIsland)}
    </div>
  );
}
