"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FormField, TextInput, TextArea } from "@/components/admin/ui/form-field";
import { SelectField } from "@/components/admin/ui/select-field";
import { TagInput } from "@/components/admin/ui/tag-input";

interface ContentItem {
  id?: string;
  type: string;
  title: string;
  body: string;
  region_tags: string[];
  status: string;
  source_type: string | null;
}

const TYPE_OPTIONS = [
  { value: "lodge", label: "Lodge" },
  { value: "activity", label: "Activity" },
  { value: "destination", label: "Destination" },
  { value: "region", label: "Region" },
  { value: "article", label: "Article" },
  { value: "faq", label: "FAQ" },
  { value: "supplier", label: "Supplier" },
  { value: "general", label: "General" },
];

const STATUS_OPTIONS = [
  { value: "pending_approval", label: "Pending Approval" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export function ContentForm({
  initialData,
}: {
  initialData?: ContentItem;
}) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [type, setType] = useState(initialData?.type ?? "general");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [regionTags, setRegionTags] = useState<string[]>(
    initialData?.region_tags ?? []
  );
  const [status, setStatus] = useState(initialData?.status ?? "pending_approval");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = useCallback(
    async (generateEmbedding = false) => {
      if (!title.trim() || !body.trim()) {
        setError("Title and body are required");
        return;
      }

      setSaving(true);
      setError("");

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const record = {
        type,
        title: title.trim(),
        body: body.trim(),
        region_tags: regionTags,
        status,
        source_type: "manual",
        ...(status === "active" ? { approved_by: user?.email } : {}),
      };

      let savedId = initialData?.id;

      if (isEditing && savedId) {
        const { error: err } = await supabase
          .from("content")
          .update(record)
          .eq("id", savedId);
        if (err) {
          setError(err.message);
          setSaving(false);
          return;
        }
      } else {
        const { data, error: err } = await supabase
          .from("content")
          .insert(record)
          .select("id")
          .single();
        if (err) {
          setError(err.message);
          setSaving(false);
          return;
        }
        savedId = data.id;
      }

      // Trigger embedding generation
      if (generateEmbedding && savedId) {
        await fetch("/api/embed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentId: savedId, table: "content" }),
        }).catch(() => {
          // Non-critical — embedding can be generated later
        });
      }

      setSaving(false);
      router.push("/admin/content");
      router.refresh();
    },
    [type, title, body, regionTags, status, isEditing, initialData?.id, router]
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl p-6 border border-warm-200 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Type">
            <SelectField
              value={type}
              onChange={setType}
              options={TYPE_OPTIONS}
            />
          </FormField>
          <FormField label="Status">
            <SelectField
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
          </FormField>
        </div>

        <FormField label="Title">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Content title..."
          />
        </FormField>

        <FormField label="Body">
          <TextArea
            value={body}
            onChange={setBody}
            placeholder="Content body..."
            rows={12}
          />
        </FormField>

        <FormField label="Region Tags">
          <TagInput
            value={regionTags}
            onChange={setRegionTags}
            placeholder="Add region (e.g. Queenstown)"
          />
        </FormField>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gold text-white hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & Generate Embedding"}
        </button>
        <button
          onClick={() => router.push("/admin/content")}
          className="px-5 py-2.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
