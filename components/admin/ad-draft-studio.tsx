"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AdContentSourceOption,
  EligibleAdAsset,
} from "@/lib/google-ads/content";

interface Props {
  sources: AdContentSourceOption[];
  assets: EligibleAdAsset[];
}

function relevance(source: AdContentSourceOption, asset: EligibleAdAsset) {
  const haystack = `${asset.title} ${asset.region} ${asset.location} ${asset.tags.join(" ")}`.toLowerCase();
  const needles = `${source.title} ${source.region} ${source.slug}`
    .toLowerCase()
    .split(/[^a-z0-9āēīōū]+/)
    .filter((token) => token.length >= 4);
  return needles.reduce(
    (score, token) => score + (haystack.includes(token) ? 1 : 0),
    0
  );
}

export function AdDraftStudio({ sources, assets }: Props) {
  const router = useRouter();
  const [sourceKey, setSourceKey] = useState(
    sources[0] ? `${sources[0].type}:${sources[0].id}` : ""
  );
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [campaignName, setCampaignName] = useState("");
  const [adGroupName, setAdGroupName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const source = sources.find(
    (item) => `${item.type}:${item.id}` === sourceKey
  );
  const sortedAssets = useMemo(() => {
    if (!source) return assets;
    return [...assets].sort(
      (a, b) => relevance(source, b) - relevance(source, a)
    );
  }, [assets, source]);

  const toggleAsset = (assetId: string) => {
    setSelectedAssets((current) =>
      current.includes(assetId)
        ? current.filter((id) => id !== assetId)
        : current.length < 8
          ? [...current, assetId]
          : current
    );
  };

  const generate = async () => {
    if (!source) return;
    setGenerating(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/google-ads/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: source.type,
          sourceId: source.id,
          selectedAssetIds: selectedAssets,
          campaignName: campaignName || undefined,
          adGroupName: adGroupName || undefined,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Draft generation failed");
      setMessage("Draft created for review. Nothing was published to Google Ads.");
      setSelectedAssets([]);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Draft generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted lg:col-span-2">
          Live content source
          <select
            value={sourceKey}
            onChange={(event) => {
              setSourceKey(event.target.value);
              setSelectedAssets([]);
            }}
            className="mt-1.5 w-full rounded-lg border border-warm-200 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          >
            {sources.map((item) => (
              <option key={`${item.type}:${item.id}`} value={`${item.type}:${item.id}`}>
                {item.type[0].toUpperCase() + item.type.slice(1)} · {item.title}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-lg bg-warm-50 px-4 py-3 text-xs text-foreground-muted">
          <span className="font-semibold text-navy">{assets.length}</span> durable assets are explicitly licensed for paid use.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
          Campaign name <span className="font-normal normal-case">(optional)</span>
          <input
            value={campaignName}
            onChange={(event) => setCampaignName(event.target.value)}
            placeholder={source ? `US | Search | ${source.title}` : ""}
            className="mt-1.5 w-full rounded-lg border border-warm-200 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
          Ad group <span className="font-normal normal-case">(optional)</span>
          <input
            value={adGroupName}
            onChange={(event) => setAdGroupName(event.target.value)}
            placeholder={source?.title ?? ""}
            className="mt-1.5 w-full rounded-lg border border-warm-200 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </label>
      </div>

      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Paid-media assets</p>
            <p className="mt-1 text-xs text-foreground-muted">Optional. Select up to eight. Local-only files are excluded.</p>
          </div>
          <span className="text-xs text-foreground-muted">{selectedAssets.length}/8 selected</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          {sortedAssets.map((asset) => {
            const selected = selectedAssets.includes(asset.assetId);
            return (
              <button
                key={asset.assetId}
                type="button"
                onClick={() => toggleAsset(asset.assetId)}
                className={`overflow-hidden rounded-lg border text-left transition-colors ${
                  selected
                    ? "border-navy ring-2 ring-navy/15"
                    : "border-warm-200 hover:border-navy/30"
                }`}
              >
                {/* Remote or already-tracked public source; never a raw local file. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.thumbnailSrc}
                  alt={asset.title}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <span className="block px-2 py-2 text-[11px] leading-snug text-navy">
                  {asset.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-warm-100 pt-4">
        <p className="text-xs text-foreground-muted">{message}</p>
        <button
          type="button"
          onClick={generate}
          disabled={!source || generating}
          className="rounded-lg bg-navy px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-navy-light disabled:opacity-45"
        >
          {generating ? "Generating…" : "Generate review draft"}
        </button>
      </div>
    </div>
  );
}
