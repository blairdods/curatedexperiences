"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function SettingsEditor({
  settingKey,
  label,
  rows,
  initialValue,
  lastUpdatedBy,
  lastUpdatedAt,
}: {
  settingKey: string;
  label: string;
  rows: number;
  initialValue: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const isDirty = value !== initialValue;

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: upsertError } = await supabase.from("settings").upsert(
      {
        key: settingKey,
        value,
        updated_by: user?.email ?? "unknown",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    setSaving(false);

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }, [settingKey, value]);

  return (
    <div className="bg-white rounded-xl border border-warm-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {lastUpdatedBy && lastUpdatedAt && (
          <span className="text-[10px] text-foreground-muted">
            Last edited by {lastUpdatedBy} on{" "}
            {new Date(lastUpdatedAt).toLocaleDateString("en-NZ", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200
          rounded-lg focus:outline-none focus:border-navy/30
          font-mono leading-relaxed resize-y"
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            isDirty
              ? "bg-navy text-white hover:bg-navy-light"
              : "bg-warm-100 text-foreground-muted cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {isDirty && (
          <button
            onClick={() => setValue(initialValue)}
            className="px-4 py-2 text-xs text-foreground-muted hover:text-foreground transition-colors"
          >
            Discard
          </button>
        )}

        {saved && (
          <span className="text-xs text-green-600">Saved successfully</span>
        )}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
}
