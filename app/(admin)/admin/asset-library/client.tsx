"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { AssetRecord } from "@/lib/asset-library";
import { getAssetContentSrc, getAssetThumbnailSrc } from "@/lib/asset-library/sources";
import { AssetUploadDialog } from "@/components/admin/asset-upload-dialog";

/** Returns the best available src for a thumbnail/preview image. */
const LICENCE_LABELS: Record<string, { label: string; colour: string }> = {
  "WorldWide - Unpaid Only": { label: "Worldwide · Unpaid", colour: "bg-emerald-100 text-emerald-800" },
  "Paid Activity - Paid and Unpaid": { label: "Paid OK", colour: "bg-blue-100 text-blue-800" },
  "NOT NZ - Unpaid Excl NZ": { label: "Excl. NZ", colour: "bg-amber-100 text-amber-800" },
};

const PER_PAGE = 60;

interface Props {
  initialAssets: AssetRecord[];
  facets: { regions: string[]; licences: string[]; fileTypes: string[] };
  canUpload: boolean;
}

export function AssetLibraryClient({ initialAssets, facets, canUpload }: Props) {
  const [assets, setAssets] = useState(initialAssets);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [licence, setLicence] = useState("");
  const [fileType, setFileType] = useState("");
  const [paidAdsOk, setPaidAdsOk] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AssetRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return assets.filter((a) => {
      if (region && a.region.toLowerCase() !== region.toLowerCase()) return false;
      if (licence && a.licence !== licence) return false;
      if (paidAdsOk !== undefined && a.paidAdsOk !== paidAdsOk) return false;
      if (fileType && a.fileType !== fileType.toUpperCase()) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.altText.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.credit.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.filename.toLowerCase().includes(q) ||
        a.usageNotes.toLowerCase().includes(q) ||
        a.assetId.includes(q)
      );
    });
  }, [assets, query, region, licence, paidAdsOk, fileType]);

  const availableFacets = useMemo(() => ({
    regions: [...new Set([...facets.regions, ...assets.map((asset) => asset.region).filter(Boolean)])].sort(),
    licences: [...new Set([...facets.licences, ...assets.map((asset) => asset.licence).filter(Boolean)])].sort(),
    fileTypes: [...new Set([...facets.fileTypes, ...assets.map((asset) => asset.fileType).filter(Boolean)])].sort(),
  }), [assets, facets]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const reset = useCallback(() => {
    setQuery("");
    setRegion("");
    setLicence("");
    setFileType("");
    setPaidAdsOk(undefined);
    setPage(1);
    inputRef.current?.focus();
  }, []);

  const applyFilter = useCallback(
    (field: string, value: string | boolean | undefined) => {
      setPage(1);
      if (field === "region") setRegion(value as string);
      if (field === "licence") setLicence(value as string);
      if (field === "fileType") setFileType(value as string);
      if (field === "paidAdsOk") setPaidAdsOk(value as boolean | undefined);
    },
    []
  );

  const copyPath = useCallback((a: AssetRecord) => {
    const path = getAssetContentSrc(a);
    if (!path) return;
    navigator.clipboard.writeText(path).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, []);

  const copyPublicPath = useCallback((a: AssetRecord) => {
    const path = `/assets/images/${a.filename}`;
    navigator.clipboard.writeText(path);
  }, []);

  const hasFilters = query || region || licence || fileType || paidAdsOk !== undefined;

  return (
    <div className="space-y-4">
      {canUpload && (
        <div className="flex justify-end">
          <button onClick={() => setUploadOpen(true)} className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90">
            + Add asset
          </button>
        </div>
      )}
      <div className="flex gap-6 min-h-0">
      {/* ── Sidebar filters ── */}
      <aside className="w-56 flex-shrink-0 space-y-5">
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1">
            Search
          </label>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="title, tag, location…"
            className="w-full rounded border border-warm-200 bg-white px-3 py-2 text-sm placeholder:text-warm-400 focus:outline-none focus:ring-1 focus:ring-navy/40"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => applyFilter("region", e.target.value)}
            className="w-full rounded border border-warm-200 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy/40"
          >
            <option value="">All regions</option>
            {availableFacets.regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Licence */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1">
            Licence
          </label>
          <select
            value={licence}
            onChange={(e) => applyFilter("licence", e.target.value)}
            className="w-full rounded border border-warm-200 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy/40"
          >
            <option value="">All licences</option>
            {availableFacets.licences.map((l) => (
              <option key={l} value={l}>{LICENCE_LABELS[l]?.label ?? l}</option>
            ))}
          </select>
        </div>

        {/* File type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1">
            File type
          </label>
          <select
            value={fileType}
            onChange={(e) => applyFilter("fileType", e.target.value)}
            className="w-full rounded border border-warm-200 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy/40"
          >
            <option value="">All types</option>
            {availableFacets.fileTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Paid ads */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1">
            Paid ads OK
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => applyFilter("paidAdsOk", paidAdsOk === true ? undefined : true)}
              className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium transition-colors ${
                paidAdsOk === true
                  ? "border-navy bg-navy text-white"
                  : "border-warm-200 bg-white text-foreground-muted hover:border-navy/40"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => applyFilter("paidAdsOk", paidAdsOk === false ? undefined : false)}
              className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium transition-colors ${
                paidAdsOk === false
                  ? "border-navy bg-navy text-white"
                  : "border-warm-200 bg-white text-foreground-muted hover:border-navy/40"
              }`}
            >
              No
            </button>
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={reset}
            className="w-full rounded border border-warm-200 px-3 py-1.5 text-xs text-foreground-muted hover:bg-warm-50 transition-colors"
          >
            Clear filters
          </button>
        )}

        <div className="pt-2 border-t border-warm-100 text-xs text-foreground-muted">
          <span className="font-semibold text-navy">{filtered.length.toLocaleString()}</span> of{" "}
          {assets.length.toLocaleString()} assets
        </div>
      </aside>

      {/* ── Main grid ── */}
      <div className="flex-1 min-w-0">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-foreground-muted">
            <p className="text-base">No assets match your filters.</p>
            <button onClick={reset} className="mt-3 text-sm text-navy underline">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 xl:grid-cols-4 2xl:grid-cols-5">
              {visible.map((asset) => (
                <AssetCard
                  key={asset.assetId + asset.filename}
                  asset={asset}
                  isSelected={selected?.filename === asset.filename}
                  onClick={() => setSelected(selected?.filename === asset.filename ? null : asset)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between text-sm">
                <button
                  disabled={safePage <= 1}
                  onClick={() => { setPage(safePage - 1); window.scrollTo(0, 0); }}
                  className="px-3 py-1.5 rounded border border-warm-200 disabled:opacity-40 hover:bg-warm-50 transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-foreground-muted">
                  Page {safePage} of {totalPages}
                </span>
                <button
                  disabled={safePage >= totalPages}
                  onClick={() => { setPage(safePage + 1); window.scrollTo(0, 0); }}
                  className="px-3 py-1.5 rounded border border-warm-200 disabled:opacity-40 hover:bg-warm-50 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail panel ── */}
      {selected && (
        <aside className="w-72 flex-shrink-0 border-l border-warm-200 pl-6 space-y-4">
          <button
            onClick={() => setSelected(null)}
            className="text-xs text-foreground-muted hover:text-navy"
          >
            ✕ Close
          </button>

          <div className="aspect-video overflow-hidden rounded bg-warm-100 flex items-center justify-center">
            {getAssetThumbnailSrc(selected) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getAssetThumbnailSrc(selected)!}
                alt={selected.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="text-center px-4">
                <p className="text-xs text-foreground-muted">Preview unavailable</p>
                {selected.sourceUrl && (
                  <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-1 text-xs text-navy underline">
                    View on TNZ →
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Title</p>
              <p className="mt-0.5 font-medium text-navy leading-snug">{selected.title}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-foreground-muted">
                {selected.source === "uploaded" ? "Platform upload" : "TNZ catalogue"}
              </p>
            </div>

            {selected.description && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Description</p>
                <p className="mt-0.5 text-xs leading-relaxed text-navy">{selected.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Region</p>
                <p className="mt-0.5 text-navy">{selected.region || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Asset ID</p>
                <p className="mt-0.5 font-mono text-navy">{selected.assetId}</p>
              </div>
            </div>

            {selected.location && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Location</p>
                <p className="mt-0.5 text-navy">{selected.location}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Size</p>
                <p className="mt-0.5 text-navy">{selected.fileSize}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Resolution</p>
                <p className="mt-0.5 text-navy text-xs">{selected.resolution}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Licence</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                LICENCE_LABELS[selected.licence]?.colour ?? "bg-warm-100 text-warm-700"
              }`}>
                {LICENCE_LABELS[selected.licence]?.label ?? selected.licence}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                selected.adStatus === "approved"
                  ? "bg-blue-100 text-blue-800"
                  : selected.adStatus === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-warm-100 text-warm-700"
              }`}>
                Paid ads: {selected.adStatus === "approved" ? "✓ Approved" : selected.adStatus === "pending" ? "Pending review" : "✗ Not approved"}
              </span>
            </div>

            {selected.credit && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Photographer</p>
                <p className="mt-0.5 text-navy">{selected.credit}</p>
              </div>
            )}

            {(selected.dateTaken || selected.camera) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Captured</p>
                  <p className="mt-0.5 text-xs text-navy">{selected.dateTaken ? new Date(selected.dateTaken).toLocaleDateString("en-NZ") : "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Camera</p>
                  <p className="mt-0.5 text-xs text-navy">{selected.camera || "—"}</p>
                </div>
              </div>
            )}

            {selected.copyright && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Copyright</p>
                <p className="mt-0.5 text-xs text-navy">{selected.copyright}</p>
              </div>
            )}

            {selected.usageNotes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Usage notes</p>
                <p className="mt-0.5 text-xs leading-relaxed text-navy">{selected.usageNotes}</p>
              </div>
            )}

            {selected.latitude != null && selected.longitude != null && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Embedded coordinates</p>
                <p className="mt-0.5 font-mono text-xs text-navy">{selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}</p>
              </div>
            )}

            {selected.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Tags</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selected.tags.slice(0, 20).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setQuery(tag); setPage(1); setSelected(null); }}
                      className="rounded bg-warm-100 px-1.5 py-0.5 text-xs text-warm-700 hover:bg-warm-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                  {selected.tags.length > 20 && (
                    <span className="text-xs text-foreground-muted">+{selected.tags.length - 20} more</span>
                  )}
                </div>
              </div>
            )}

            {selected.sourceUrl && (
              <div>
                <a
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-navy underline hover:text-gold"
                >
                  View source →
                </a>
              </div>
            )}
          </div>

          {/* Copy buttons */}
          <div className="border-t border-warm-200 pt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Use this image</p>
            <button
              onClick={() => copyPath(selected)}
              className="w-full rounded bg-navy px-3 py-2 text-xs font-medium text-white hover:bg-navy/90 transition-colors"
            >
              {copied ? "✓ Copied!" : "Copy API path"}
            </button>
            {selected.source === "tnz" && (
              <button
                onClick={() => copyPublicPath(selected)}
                className="w-full rounded border border-warm-200 px-3 py-2 text-xs font-medium text-foreground-muted hover:bg-warm-50 transition-colors"
                title="Only works if this image is in public/assets/images/"
              >
                Copy public path
              </button>
            )}
            <p className="text-[10px] text-foreground-muted leading-snug">
              Filename: <span className="font-mono">{selected.filename}</span>
            </p>
          </div>
        </aside>
      )}
      </div>
      <AssetUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(asset) => {
          setAssets((current) => [asset, ...current]);
          setSelected(asset);
          setPage(1);
        }}
      />
    </div>
  );
}

function AssetCard({
  asset,
  isSelected,
  onClick,
}: {
  asset: AssetRecord;
  isSelected: boolean;
  onClick: () => void;
}) {
  const licenceMeta = LICENCE_LABELS[asset.licence];

  return (
    <button
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded text-left transition-all ${
        isSelected
          ? "ring-2 ring-navy ring-offset-1"
          : "hover:ring-1 hover:ring-navy/30"
      }`}
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] overflow-hidden bg-warm-100">
        {getAssetThumbnailSrc(asset) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getAssetThumbnailSrc(asset)!}
            alt={asset.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-2 text-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-warm-400">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-[9px] text-warm-400 leading-tight">{asset.assetId}</p>
          </div>
        )}
      </div>

      {/* Overlay badges */}
      <div className="absolute top-1.5 left-1.5 flex gap-1">
        {licenceMeta && (
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${licenceMeta.colour}`}>
            {licenceMeta.label}
          </span>
        )}
        {asset.paidAdsOk && (
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold text-blue-800">
            Ads ✓
          </span>
        )}
        {asset.adStatus === "pending" && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
            Ads pending
          </span>
        )}
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-medium text-white leading-snug truncate">
          {asset.location || asset.title}
        </p>
        {asset.region && (
          <p className="text-[9px] text-white/70 truncate">{asset.region}</p>
        )}
      </div>
    </button>
  );
}
