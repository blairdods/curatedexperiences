"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Accommodation {
  id: string;
  name: string;
  tier: "platinum" | "gold" | "silver";
  region: string;
  location: string | null;
  property_type: string | null;
  nightly_rate_nzd_min: number | null;
  nightly_rate_nzd_max: number | null;
  contracted: boolean;
  active: boolean;
}

const TIER_STYLES = {
  platinum: "bg-navy/10 text-navy",
  gold: "bg-amber-100 text-amber-800",
  silver: "bg-stone-100 text-stone-600",
};

function formatRate(min: number | null, max: number | null): string {
  if (!min && !max) return "—";
  if (min && max) return `NZD ${min.toLocaleString()}–${max.toLocaleString()}`;
  if (min) return `From NZD ${min.toLocaleString()}`;
  return `To NZD ${max!.toLocaleString()}`;
}

export function AccommodationsList({
  accommodations,
}: {
  accommodations: Accommodation[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/accommodations/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  };

  return (
    <div className="bg-white rounded-xl border border-warm-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-warm-100">
            <th className="text-left px-4 py-3 text-xs font-medium text-foreground-muted uppercase tracking-wider">
              Property
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-foreground-muted uppercase tracking-wider hidden sm:table-cell">
              Tier
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-foreground-muted uppercase tracking-wider hidden md:table-cell">
              Region
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-foreground-muted uppercase tracking-wider hidden lg:table-cell">
              Rate / night
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-foreground-muted uppercase tracking-wider hidden md:table-cell">
              Contracted
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-100">
          {accommodations.map((a) => (
            <tr key={a.id} className="hover:bg-warm-50 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{a.name}</p>
                {a.location && (
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {a.location}
                  </p>
                )}
                {!a.active && (
                  <span className="inline-block mt-1 text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TIER_STYLES[a.tier]}`}>
                  {a.tier.charAt(0).toUpperCase() + a.tier.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-foreground-muted">
                {a.region}
              </td>
              <td className="px-4 py-3 hidden lg:table-cell text-foreground-muted">
                {formatRate(a.nightly_rate_nzd_min, a.nightly_rate_nzd_max)}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                {a.contracted ? (
                  <span className="text-green-600 text-xs font-medium">✓ Yes</span>
                ) : (
                  <span className="text-foreground-muted text-xs">Pending</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/accommodations/${a.id}`}
                    className="text-xs text-navy hover:text-navy-light transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a.id, a.name)}
                    disabled={deleting === a.id}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleting === a.id ? "…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
