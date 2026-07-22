"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Draft {
  id: string;
  source_title: string;
  campaign_name: string;
  ad_group_name: string;
  final_url: string;
  headlines: string[];
  descriptions: string[];
  selected_asset_ids: string[];
  status: "draft" | "approved" | "rejected" | "published";
  rationale: string | null;
  created_at: string;
}

export function AdDraftList({
  drafts,
  canApprove,
}: {
  drafts: Draft[];
  canApprove: boolean;
}) {
  const router = useRouter();
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState("");

  const update = async (id: string, status: "approved" | "rejected") => {
    setActing(`${id}:${status}`);
    setError("");
    try {
      const response = await fetch(`/api/admin/google-ads/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to update draft");
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update draft");
    } finally {
      setActing(null);
    }
  };

  if (drafts.length === 0) {
    return <p className="py-6 text-center text-sm text-foreground-muted">No ad drafts yet.</p>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-xs text-red-700">{error}</p>}
      {drafts.map((draft) => (
        <article key={draft.id} className="rounded-xl border border-warm-200 bg-warm-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-navy">{draft.source_title}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] uppercase tracking-wide text-foreground-muted">
                  {draft.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-foreground-muted">{draft.campaign_name} · {draft.ad_group_name}</p>
            </div>
            {canApprove && draft.status !== "published" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => update(draft.id, "approved")}
                  disabled={acting !== null}
                  className="rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white disabled:opacity-45"
                >
                  {acting === `${draft.id}:approved` ? "…" : "Approve"}
                </button>
                <button
                  type="button"
                  onClick={() => update(draft.id, "rejected")}
                  disabled={acting !== null}
                  className="rounded-lg border border-warm-200 bg-white px-3 py-1.5 text-xs text-foreground-muted disabled:opacity-45"
                >
                  Reject
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">Headlines</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {draft.headlines.map((headline) => (
                  <span key={headline} className="rounded bg-white px-2 py-1 text-xs text-navy">
                    {headline} <span className="text-foreground-muted">{headline.length}/30</span>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">Descriptions</p>
              <div className="mt-2 space-y-1.5">
                {draft.descriptions.map((description) => (
                  <p key={description} className="rounded bg-white px-3 py-2 text-xs leading-relaxed text-navy">
                    {description} <span className="text-foreground-muted">{description.length}/90</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-foreground-muted">
            {draft.selected_asset_ids.length} paid-approved assets · Final URL: {draft.final_url}
          </p>
        </article>
      ))}
    </div>
  );
}
