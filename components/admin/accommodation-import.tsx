"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface ImportResult {
  imported: number;
  inserted: number;
  updated: number;
  warnings: string[];
}

export function AccommodationImport() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.set("file", file);

    try {
      const response = await fetch("/api/admin/accommodations/import", {
        method: "POST",
        body: formData,
      });
      const data = await response.json() as ImportResult & { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Import failed. Please check the spreadsheet and try again.");
        return;
      }

      setResult(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch {
      setError("Network error. Please try the import again.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <section className="mt-6 rounded-xl border border-warm-200 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-sm font-medium text-navy">Import supplier directory</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-foreground-muted">
            Upload the supplier directory as XLSX or CSV. Property ID is the unique identifier:
            matching properties are updated, new IDs are added, and properties absent from the file
            are left unchanged.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setError("");
              setResult(null);
            }}
            disabled={importing}
            className="block max-w-full text-xs text-foreground-muted file:mr-3 file:rounded-lg file:border file:border-warm-200 file:bg-warm-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-navy hover:file:bg-warm-100 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={!file || importing}
            className="whitespace-nowrap rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {importing ? "Importing…" : "Upload & update"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {result && (
        <div className="mt-3 space-y-2">
          <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            Imported {result.imported} properties: {result.inserted} added and {result.updated} updated.
          </p>
          {result.warnings.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
              <p className="font-medium">{result.warnings.length} row(s) were skipped:</p>
              <ul className="mt-1 list-disc pl-5">
                {result.warnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
