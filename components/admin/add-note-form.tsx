"use client";

import { useState } from "react";

interface AddNoteFormProps {
  enquiryId: string;
  onAdded: () => void;
}

export function AddNoteForm({ enquiryId, onAdded }: AddNoteFormProps) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/leads/${enquiryId}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "note",
        description: note.trim(),
      }),
    });
    setNote("");
    setSaving(false);
    onAdded();
  };

  return (
    <div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note..."
        rows={3}
        className="w-full px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg
          focus:outline-none focus:border-navy/30 resize-y"
      />
      <div className="mt-2 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!note.trim() || saving}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            note.trim()
              ? "bg-navy text-white hover:bg-navy-light"
              : "bg-warm-100 text-foreground-muted cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Add Note"}
        </button>
      </div>
    </div>
  );
}
