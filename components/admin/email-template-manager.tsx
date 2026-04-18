"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface EmailTemplate {
  id: string;
  sequence_type: string;
  step_index: number;
  subject: string;
  preview_text: string | null;
  body_html: string;
  delay_days: number;
  active: boolean;
  updated_by: string | null;
  updated_at: string;
}

export function EmailTemplateManager({
  templates,
}: {
  templates: EmailTemplate[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<EmailTemplate>>({});
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const highIntent = templates.filter((t) => t.sequence_type === "high_intent");
  const midIntent = templates.filter((t) => t.sequence_type === "mid_intent");

  const startEdit = (template: EmailTemplate) => {
    setEditingId(template.id);
    setEditData({
      subject: template.subject,
      preview_text: template.preview_text,
      body_html: template.body_html,
      delay_days: template.delay_days,
      active: template.active,
    });
  };

  const handleSave = useCallback(async () => {
    if (!editingId) return;
    setSaving(true);
    await fetch("/api/admin/email-templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...editData }),
    });
    setSaving(false);
    setEditingId(null);
    router.refresh();
  }, [editingId, editData, router]);

  const toggleActive = useCallback(
    async (id: string, active: boolean) => {
      await fetch("/api/admin/email-templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
      });
      router.refresh();
    },
    [router]
  );

  const renderGroup = (title: string, items: EmailTemplate[]) => (
    <div>
      <h2 className="font-serif text-lg text-navy tracking-tight mb-4">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-warm-200 overflow-hidden"
          >
            {editingId === t.id ? (
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-foreground-muted">Subject</label>
                    <input
                      value={editData.subject ?? ""}
                      onChange={(e) =>
                        setEditData((d) => ({ ...d, subject: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted">
                      Preview Text
                    </label>
                    <input
                      value={editData.preview_text ?? ""}
                      onChange={(e) =>
                        setEditData((d) => ({
                          ...d,
                          preview_text: e.target.value,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-foreground-muted">
                    Body HTML
                  </label>
                  <textarea
                    value={editData.body_html ?? ""}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, body_html: e.target.value }))
                    }
                    rows={8}
                    className="w-full mt-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30 font-mono resize-y"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs text-foreground-muted">
                      Delay (days)
                    </label>
                    <input
                      type="number"
                      value={editData.delay_days ?? 0}
                      onChange={(e) =>
                        setEditData((d) => ({
                          ...d,
                          delay_days: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-24 mt-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm mt-5">
                    <input
                      type="checkbox"
                      checked={editData.active ?? true}
                      onChange={(e) =>
                        setEditData((d) => ({
                          ...d,
                          active: e.target.checked,
                        }))
                      }
                      className="rounded border-warm-300"
                    />
                    Active
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setPreviewHtml(editData.body_html ?? null)}
                    className="px-4 py-2 text-xs text-foreground-muted hover:text-foreground transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 text-xs text-foreground-muted hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-5 py-4">
                <span className="text-xs text-foreground-muted w-8">
                  #{t.step_index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {t.subject}
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Day {t.delay_days} — {t.preview_text}
                  </p>
                </div>
                <button
                  onClick={() => toggleActive(t.id, t.active)}
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    t.active
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {t.active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => startEdit(t)}
                  className="text-xs text-navy hover:text-navy-light transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderGroup("High Intent Sequence (Score 7+)", highIntent)}
      {renderGroup("Mid Intent Sequence (Score 4-6)", midIntent)}

      {/* Preview modal */}
      {previewHtml && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between px-5 py-3 border-b border-warm-100">
              <h3 className="text-sm font-medium">Email Preview</h3>
              <button
                onClick={() => setPreviewHtml(null)}
                className="text-foreground-muted hover:text-foreground"
              >
                &times;
              </button>
            </div>
            <div
              className="p-6 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
