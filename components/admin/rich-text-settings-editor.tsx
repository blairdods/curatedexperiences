"use client";

import { useCallback, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function RichTextSettingsEditor({
  settingKey,
  label,
  initialValue,
  lastUpdatedBy,
  lastUpdatedAt,
}: {
  settingKey: string;
  label: string;
  initialValue: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(initialValue);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const isDirty = value !== savedValue;

  const syncValue = useCallback(() => {
    setValue(editorRef.current?.innerHTML ?? "");
  }, []);

  const runCommand = useCallback(
    (command: string, commandValue?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, commandValue);
      syncValue();
    },
    [syncValue]
  );

  const handleLink = useCallback(() => {
    const url = window.prompt("Link URL");
    if (!url) return;
    runCommand("createLink", url);
  }, [runCommand]);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    syncValue();
  }, [syncValue]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    const nextValue = editorRef.current?.innerHTML ?? value;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: upsertError } = await supabase.from("settings").upsert(
      {
        key: settingKey,
        value: nextValue,
        updated_by: user?.email ?? "unknown",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    setSaving(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    await fetch("/api/admin/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "settings",
        entityId: settingKey,
        action: "updated",
        changes: { before: { value: savedValue }, after: { value: nextValue } },
      }),
    });

    setValue(nextValue);
    setSavedValue(nextValue);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [settingKey, savedValue, value]);

  const handleDiscard = useCallback(() => {
    setValue(savedValue);
    if (editorRef.current) {
      editorRef.current.innerHTML = savedValue;
    }
  }, [savedValue]);

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

      <div className="flex flex-wrap items-center gap-2 rounded-t-lg border border-warm-200 bg-warm-50 px-3 py-2">
        <select
          aria-label="Text style"
          onChange={(event) => runCommand("formatBlock", event.target.value)}
          defaultValue="p"
          className="rounded-md border border-warm-200 bg-white px-2 py-1 text-xs text-foreground focus:outline-none focus:border-navy/30"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <button
          type="button"
          onClick={() => runCommand("bold")}
          className="rounded-md border border-warm-200 bg-white px-2 py-1 text-xs font-semibold text-foreground hover:border-navy/30"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => runCommand("italic")}
          className="rounded-md border border-warm-200 bg-white px-2 py-1 text-xs italic text-foreground hover:border-navy/30"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => runCommand("insertUnorderedList")}
          className="rounded-md border border-warm-200 bg-white px-2 py-1 text-xs text-foreground hover:border-navy/30"
        >
          Bullets
        </button>
        <button
          type="button"
          onClick={() => runCommand("insertOrderedList")}
          className="rounded-md border border-warm-200 bg-white px-2 py-1 text-xs text-foreground hover:border-navy/30"
        >
          Numbers
        </button>
        <button
          type="button"
          onClick={handleLink}
          className="rounded-md border border-warm-200 bg-white px-2 py-1 text-xs text-foreground hover:border-navy/30"
        >
          Link
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncValue}
        onBlur={syncValue}
        onPaste={handlePaste}
        className="min-h-[520px] w-full rounded-b-lg border-x border-b border-warm-200 bg-white px-5 py-4 text-sm leading-relaxed text-foreground focus:outline-none focus:border-navy/30 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-navy [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2:first-child]:mt-0 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-navy [&_h3]:tracking-tight [&_h3]:mt-5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-gold [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: initialValue }}
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
            onClick={handleDiscard}
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
