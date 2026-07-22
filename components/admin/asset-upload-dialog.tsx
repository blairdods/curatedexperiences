"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AssetRecord } from "@/lib/asset-library";
import { fieldsFromEmbeddedMetadata, formatFileSize, titleFromFilename } from "@/lib/asset-library/metadata-utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onUploaded: (asset: AssetRecord) => void;
}

interface FormFields {
  title: string;
  altText: string;
  description: string;
  region: string;
  location: string;
  licence: string;
  adStatus: "approved" | "not_approved" | "pending";
  tags: string;
  credit: string;
  copyright: string;
  sourceUrl: string;
  usageNotes: string;
}

const INITIAL_FIELDS: FormFields = {
  title: "",
  altText: "",
  description: "",
  region: "",
  location: "",
  licence: "Owned by Curated Experiences",
  adStatus: "pending",
  tags: "",
  credit: "",
  copyright: "",
  sourceUrl: "",
  usageNotes: "",
};

const fieldClass = "w-full rounded border border-warm-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-warm-400 focus:outline-none focus:ring-1 focus:ring-navy/40";

export function AssetUploadDialog({ open, onClose, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [analysing, setAnalysing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectionId = useRef(0);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (!open) return null;

  const setField = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    selectionId.current += 1;
    setFile(null);
    setDimensions(null);
    setFields(INITIAL_FIELDS);
    setError("");
    setSubmitting(false);
    setAnalysing(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const close = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const chooseFile = async (selectedFile: File | null) => {
    const currentSelection = ++selectionId.current;
    setError("");
    setDimensions(null);
    setFile(selectedFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const nextPreview = selectedFile ? URL.createObjectURL(selectedFile) : "";
    setPreviewUrl(nextPreview);
    if (!selectedFile) return;
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Images must be 10 MB or smaller.");
      return;
    }

    setAnalysing(true);
    const fallbackTitle = titleFromFilename(selectedFile.name);
    try {
      const bitmap = await createImageBitmap(selectedFile);
      if (currentSelection === selectionId.current) {
        setDimensions({ width: bitmap.width, height: bitmap.height });
      }
      bitmap.close();
    } catch {
      // Server-side decoding remains authoritative for formats unsupported by
      // the current browser.
    }

    let tags: Record<string, unknown> = {};
    try {
      const { parse } = await import("exifr");
      tags = (await parse(selectedFile, {
        tiff: true,
        exif: true,
        gps: true,
        xmp: true,
        iptc: true,
        makerNote: false,
        userComment: true,
        sanitize: true,
        mergeOutput: true,
      })) ?? {};
    } catch {
      // Embedded metadata is optional.
    }
    if (currentSelection !== selectionId.current) return;
    const suggested = fieldsFromEmbeddedMetadata(tags, selectedFile.name);
    setFields((current) => ({
      ...current,
      title: suggested.title || fallbackTitle,
      altText: suggested.title || fallbackTitle,
      description: suggested.description,
      region: suggested.region,
      location: suggested.location,
      tags: suggested.keywords.join(", "),
      credit: suggested.credit,
      copyright: suggested.copyright,
    }));
    setAnalysing(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Choose an image to upload.");
      return;
    }
    setSubmitting(true);
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    Object.entries(fields).forEach(([key, value]) => formData.set(key, value));

    try {
      const response = await fetch("/api/admin/asset-library", { method: "POST", body: formData });
      const payload = await response.json() as { asset?: AssetRecord; error?: string };
      if (!response.ok || !payload.asset) throw new Error(payload.error || "Upload failed");
      onUploaded(payload.asset);
      reset();
      onClose();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-dark/60 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="asset-upload-title">
      <div className="w-full max-w-4xl rounded-xl bg-warm-50 shadow-2xl">
        <div className="flex items-start justify-between border-b border-warm-200 px-6 py-5">
          <div>
            <h2 id="asset-upload-title" className="font-serif text-2xl text-navy">Add to asset library</h2>
            <p className="mt-1 text-sm text-foreground-muted">Image metadata is read automatically. Review and add the platform usage details before upload.</p>
          </div>
          <button type="button" onClick={close} disabled={submitting} className="rounded px-2 py-1 text-xl text-foreground-muted hover:bg-warm-100 hover:text-navy">×</button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-6 p-6 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <label className="block cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-warm-200 bg-white hover:border-navy/40">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="sr-only"
                  onChange={(event) => void chooseFile(event.target.files?.[0] ?? null)}
                />
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Upload preview" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] flex-col items-center justify-center px-5 text-center">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mb-2 h-8 w-8 text-warm-400"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                    <span className="text-sm font-medium text-navy">Choose an image</span>
                    <span className="mt-1 text-xs text-foreground-muted">JPEG, PNG, WebP, GIF or AVIF · max 10 MB</span>
                  </div>
                )}
              </label>

              {file && (
                <div className="rounded-lg border border-warm-200 bg-white p-4 text-xs">
                  <p className="break-all font-medium text-navy">{file.name}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-foreground-muted">
                    <dt>File size</dt><dd className="text-right text-navy">{formatFileSize(file.size)}</dd>
                    <dt>File type</dt><dd className="text-right text-navy">{file.type || "Detected on upload"}</dd>
                    <dt>Resolution</dt><dd className="text-right text-navy">{dimensions ? `${dimensions.width} × ${dimensions.height}` : analysing ? "Reading…" : "Detected on upload"}</dd>
                    <dt>Embedded data</dt><dd className="text-right text-navy">{analysing ? "Reading…" : "Extracted"}</dd>
                  </dl>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" required><input className={fieldClass} value={fields.title} required maxLength={200} onChange={(e) => setField("title", e.target.value)} /></Field>
                <Field label="Alt text" hint="Used by screen readers"><input className={fieldClass} value={fields.altText} maxLength={300} onChange={(e) => setField("altText", e.target.value)} /></Field>
              </div>
              <Field label="Description"><textarea className={`${fieldClass} min-h-20 resize-y`} value={fields.description} maxLength={5000} onChange={(e) => setField("description", e.target.value)} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Region"><input className={fieldClass} value={fields.region} maxLength={120} onChange={(e) => setField("region", e.target.value)} /></Field>
                <Field label="Location"><input className={fieldClass} value={fields.location} maxLength={240} onChange={(e) => setField("location", e.target.value)} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Licence / rights" required>
                  <input className={fieldClass} list="asset-licences" value={fields.licence} required maxLength={160} onChange={(e) => setField("licence", e.target.value)} />
                  <datalist id="asset-licences">
                    <option value="Owned by Curated Experiences" />
                    <option value="Licensed - paid and unpaid" />
                    <option value="Licensed - unpaid only" />
                    <option value="Permission required" />
                  </datalist>
                </Field>
                <Field label="Paid advertising status" required>
                  <select className={fieldClass} value={fields.adStatus} onChange={(e) => setField("adStatus", e.target.value as FormFields["adStatus"])}>
                    <option value="pending">Pending review</option>
                    <option value="approved">Approved for paid ads</option>
                    <option value="not_approved">Not approved for paid ads</option>
                  </select>
                </Field>
              </div>
              <Field label="Tags" hint="Comma-separated"><input className={fieldClass} value={fields.tags} maxLength={2000} placeholder="luxury, alpine, winter" onChange={(e) => setField("tags", e.target.value)} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Photographer / credit"><input className={fieldClass} value={fields.credit} maxLength={240} onChange={(e) => setField("credit", e.target.value)} /></Field>
                <Field label="Copyright"><input className={fieldClass} value={fields.copyright} maxLength={500} onChange={(e) => setField("copyright", e.target.value)} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Source URL"><input type="url" className={fieldClass} value={fields.sourceUrl} maxLength={2000} placeholder="https://…" onChange={(e) => setField("sourceUrl", e.target.value)} /></Field>
                <Field label="Usage notes"><input className={fieldClass} value={fields.usageNotes} maxLength={3000} placeholder="Expiry, campaign restrictions…" onChange={(e) => setField("usageNotes", e.target.value)} /></Field>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-warm-200 px-6 py-4">
            <p role="alert" className="text-sm text-red-700">{error}</p>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={close} disabled={submitting} className="rounded border border-warm-200 bg-white px-4 py-2 text-sm text-navy hover:bg-warm-100 disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={!file || analysing || submitting} className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? "Uploading…" : analysing ? "Reading metadata…" : "Add asset"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline gap-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
        {label}{required && <span className="text-red-700">*</span>}{hint && <span className="ml-auto normal-case font-normal tracking-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
