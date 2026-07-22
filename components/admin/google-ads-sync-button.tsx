"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GoogleAdsSyncButton({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const sync = async () => {
    setSyncing(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/google-ads/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysBack: 30 }),
      });
      const result = (await response.json()) as {
        error?: string;
        configNote?: string;
        migrationNote?: string;
        status?: string;
      };
      if (!response.ok || result.status === "error") {
        throw new Error(result.error || "Google Ads sync failed");
      }
      setMessage(
        result.configNote || result.migrationNote || "Google Ads data synced."
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {message && <p className="max-w-sm text-xs text-foreground-muted">{message}</p>}
      <button
        type="button"
        onClick={sync}
        disabled={disabled || syncing}
        className="rounded-lg bg-navy px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-45"
      >
        {syncing ? "Syncing…" : "Sync last 30 days"}
      </button>
    </div>
  );
}
