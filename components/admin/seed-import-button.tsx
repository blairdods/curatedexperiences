"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedImportButton({
  endpoint,
  label,
  count,
}: {
  endpoint: string;
  label: string;
  count: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleImport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json() as { seeded?: number; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Import failed");
      } else {
        setDone(true);
        router.refresh();
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <p className="text-sm text-green-700 font-medium">
        ✓ Imported — page will refresh
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleImport}
        disabled={loading}
        className="px-4 py-2.5 text-sm font-medium rounded-lg bg-gold text-white hover:bg-gold/90 disabled:opacity-50 transition-colors"
      >
        {loading ? "Importing…" : `Import ${count} ${label} from static data`}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
