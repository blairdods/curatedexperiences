"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { AssetRecord } from "@/lib/asset-library";

// ─── Thumbnail helper ────────────────────────────────────────────────────────

function imgSrc(asset: AssetRecord): string | null {
  if (asset.publicSrc) return asset.publicSrc;
  if (asset.hasLocalFile) return `/api/admin/asset-library/image/${asset.filename}`;
  return null;
}

const LICENCE_LABELS: Record<string, string> = {
  "WorldWide - Unpaid Only": "Worldwide · Unpaid",
  "Paid Activity - Paid and Unpaid": "Paid OK",
  "NOT NZ - Unpaid Excl NZ": "Excl. NZ",
};

const PER_PAGE = 60;

// ─── Modal ───────────────────────────────────────────────────────────────────

interface ModalProps {
  onSelect: (src: string, alt: string) => void;
  onClose: () => void;
  /** Pre-filter to a specific region */
  defaultRegion?: string;
}

function ImagePickerModal({ onSelect, onClose, defaultRegion = "" }: ModalProps) {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(defaultRegion);
  const [licence, setLicence] = useState("");
  const [paidAdsOk, setPaidAdsOk] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [facets, setFacets] = useState<{ regions: string[]; licences: string[] }>({ regions: [], licences: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all assets once
  useEffect(() => {
    fetch("/api/admin/asset-library?perPage=9999")
      .then((r) => r.json())
      .then((data) => {
        setAssets(data.items ?? []);
        setFacets({ regions: data.facets?.regions ?? [], licences: data.facets?.licences ?? [] });
        setLoading(false);
      });
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return assets.filter((a) => {
      if (region && a.region.toLowerCase() !== region.toLowerCase()) return false;
      if (licence && a.licence !== licence) return false;
      if (paidAdsOk !== undefined && a.paidAdsOk !== paidAdsOk) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.credit.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.filename.toLowerCase().includes(q)
      );
    });
  }, [assets, query, region, licence, paidAdsOk]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const reset = useCallback(() => {
    setQuery(""); setRegion(defaultRegion); setLicence(""); setPaidAdsOk(undefined); setPage(1);
  }, [defaultRegion]);

  function handleSelect(asset: AssetRecord) {
    const src = asset.publicSrc ?? `/api/admin/asset-library/image/${asset.filename}`;
    const alt = asset.location || asset.title;
    onSelect(src, alt);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 flex h-[90vh] w-[92vw] max-w-6xl flex-col rounded-xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-warm-200 px-5 py-4 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-navy">Asset Library</h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              {loading ? "Loading…" : `${filtered.length.toLocaleString()} images`}
            </p>
          </div>
          <button onClick={onClose} className="text-foreground-muted hover:text-navy p-1 transition-colors">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-warm-100 px-5 py-3 flex-shrink-0 bg-warm-50">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search title, location, tags, photographer…"
            className="flex-1 min-w-[200px] rounded border border-warm-200 bg-white px-3 py-1.5 text-sm placeholder:text-warm-400 focus:outline-none focus:ring-1 focus:ring-navy/40"
          />
          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage(1); }}
            className="rounded border border-warm-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-navy/40"
          >
            <option value="">All regions</option>
            {facets.regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={licence}
            onChange={(e) => { setLicence(e.target.value); setPage(1); }}
            className="rounded border border-warm-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-navy/40"
          >
            <option value="">All licences</option>
            {facets.licences.map((l) => <option key={l} value={l}>{LICENCE_LABELS[l] ?? l}</option>)}
          </select>
          <div className="flex gap-1">
            <button
              onClick={() => { setPaidAdsOk(paidAdsOk === true ? undefined : true); setPage(1); }}
              className={`rounded border px-2.5 py-1.5 text-xs font-medium transition-colors ${paidAdsOk === true ? "border-navy bg-navy text-white" : "border-warm-200 bg-white text-foreground-muted hover:border-navy/40"}`}
            >
              Ads OK
            </button>
          </div>
          {(query || region !== defaultRegion || licence || paidAdsOk !== undefined) && (
            <button onClick={reset} className="text-xs text-foreground-muted underline hover:text-navy">
              Clear
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
              Loading asset library…
            </div>
          ) : visible.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-foreground-muted">
              <p>No images match.</p>
              <button onClick={reset} className="mt-2 text-sm text-navy underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {visible.map((asset) => (
                <PickerCard key={asset.assetId + asset.filename} asset={asset} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-warm-200 px-5 py-3 flex-shrink-0">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className="px-3 py-1.5 text-sm rounded border border-warm-200 disabled:opacity-40 hover:bg-warm-50"
            >
              ← Prev
            </button>
            <span className="text-sm text-foreground-muted">Page {safePage} of {totalPages}</span>
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
              className="px-3 py-1.5 text-sm rounded border border-warm-200 disabled:opacity-40 hover:bg-warm-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PickerCard({ asset, onSelect }: { asset: AssetRecord; onSelect: (a: AssetRecord) => void }) {
  const src = imgSrc(asset);
  return (
    <button
      onClick={() => onSelect(asset)}
      className="group relative aspect-[4/3] w-full overflow-hidden rounded bg-warm-100 hover:ring-2 hover:ring-navy transition-all focus:outline-none focus:ring-2 focus:ring-navy"
      title={asset.location || asset.title}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-warm-300">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
          </svg>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-medium text-white leading-tight truncate">{asset.location || asset.title}</p>
      </div>
      {/* Select indicator */}
      <div className="absolute inset-0 flex items-center justify-center bg-navy/0 group-hover:bg-navy/10 transition-colors">
        <span className="scale-0 group-hover:scale-100 transition-transform rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-navy shadow">
          Select
        </span>
      </div>
    </button>
  );
}

// ─── Public field component ──────────────────────────────────────────────────

interface ImagePickerFieldProps {
  label?: string;
  value: string;
  onChange: (src: string) => void;
  /** Also called when an image is selected — useful for setting alt text in a sibling field. */
  onAltChange?: (alt: string) => void;
  defaultRegion?: string;
  hint?: string;
}

export function ImagePickerField({
  label,
  value,
  onChange,
  onAltChange,
  defaultRegion,
  hint,
}: ImagePickerFieldProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(src: string, alt: string) {
    onChange(src);
    onAltChange?.(alt);
  }

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{label}</p>
      )}
      {hint && <p className="text-xs text-foreground-muted">{hint}</p>}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-warm-200 bg-warm-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full max-h-48 object-cover" />
          <div className="flex items-center gap-3 px-3 py-2 border-t border-warm-200 bg-white">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-xs font-medium text-navy hover:text-gold transition-colors"
            >
              Change image
            </button>
            <span className="text-warm-300 text-xs">·</span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-foreground-muted hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex flex-col items-center justify-center gap-2 h-32 rounded-lg border-2 border-dashed border-warm-300 bg-warm-50 hover:bg-warm-100 hover:border-warm-400 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-warm-400">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm font-medium text-foreground-muted">Choose from asset library</span>
          <span className="text-xs text-warm-400">{`${1415} licensed images`}</span>
        </button>
      )}

      {open && (
        <ImagePickerModal
          onSelect={handleSelect}
          onClose={() => setOpen(false)}
          defaultRegion={defaultRegion}
        />
      )}
    </div>
  );
}

// ─── Gallery picker (multi-select) ───────────────────────────────────────────

interface GalleryPickerProps {
  label?: string;
  images: { src: string; alt: string }[];
  onAdd: (src: string, alt: string) => void;
  onRemove: (index: number) => void;
  defaultRegion?: string;
}

export function GalleryPickerField({
  label,
  images,
  onAdd,
  onRemove,
  defaultRegion,
}: GalleryPickerProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(src: string, alt: string) {
    onAdd(src, alt);
    // Keep modal open so multiple images can be added
  }

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{label}</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={i} className="relative group aspect-[4/3] rounded overflow-hidden bg-warm-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="scale-0 group-hover:scale-100 transition-transform rounded-full bg-white p-1 text-red-500 hover:bg-red-50 shadow"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </svg>
                </button>
              </div>
              <p className="absolute bottom-0 inset-x-0 bg-black/50 px-1.5 py-0.5 text-[9px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {img.alt}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded border border-warm-200 bg-white px-3 py-2 text-xs font-medium text-navy hover:bg-warm-50 transition-colors"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
        Add from asset library
      </button>

      {open && (
        <ImagePickerModal
          onSelect={handleSelect}
          onClose={() => setOpen(false)}
          defaultRegion={defaultRegion}
        />
      )}
    </div>
  );
}
