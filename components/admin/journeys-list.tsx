"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Journey {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  active: boolean;
  duration_days: number | null;
  price_from_usd: number | null;
  regions: string[] | null;
  updated_at: string;
}

export function JourneysList({ journeys }: { journeys: Journey[] }) {
  const router = useRouter();

  const toggleActive = async (id: string, currentActive: boolean) => {
    const supabase = createClient();
    await supabase
      .from("tours")
      .update({ active: !currentActive })
      .eq("id", id);
    router.refresh();
  };

  if (journeys.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-foreground-muted bg-warm-50/50 rounded-xl border border-dashed border-warm-200">
        No journeys in the database yet. They&apos;ll appear here once
        populated from the knowledge base or added manually.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {journeys.map((journey) => (
        <div
          key={journey.id}
          className="bg-white rounded-xl border border-warm-200 px-5 py-4 flex items-center gap-4"
        >
          {/* Active indicator */}
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              journey.active ? "bg-green-500" : "bg-gray-300"
            }`}
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {journey.title}
            </p>
            <p className="text-xs text-foreground-muted truncate">
              {journey.tagline}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-foreground-muted flex-shrink-0">
            {journey.duration_days && (
              <span>{journey.duration_days} days</span>
            )}
            {journey.price_from_usd && (
              <span>${journey.price_from_usd.toLocaleString()}</span>
            )}
            {journey.regions && (
              <span className="max-w-[200px] truncate">
                {journey.regions.join(", ")}
              </span>
            )}
          </div>

          <button
            onClick={() => toggleActive(journey.id, journey.active)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0 ${
              journey.active
                ? "border-green-200 text-green-700 hover:bg-green-50"
                : "border-warm-200 text-foreground-muted hover:bg-warm-50"
            }`}
          >
            {journey.active ? "Active" : "Inactive"}
          </button>
        </div>
      ))}
    </div>
  );
}
