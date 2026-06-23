"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FormField, TextInput, TextArea } from "@/components/admin/ui/form-field";
import { SelectField } from "@/components/admin/ui/select-field";
import { TagInput } from "@/components/admin/ui/tag-input";
import { ImagePickerField } from "@/components/admin/image-picker";

const CATEGORY_OPTIONS = [
  { value: "Wild Interior", label: "Wild Interior" },
  { value: "Food & Wine", label: "Food & Wine" },
  { value: "Lodge Insider", label: "Lodge Insider" },
  { value: "Travel Intelligence", label: "Travel Intelligence" },
  { value: "Māori Culture", label: "Māori Culture" },
  { value: "Conservation", label: "Conservation" },
  { value: "The CE Way", label: "The CE Way" },
];

const JOURNEY_SLUGS = [
  "the-masterpiece",
  "the-discovery",
  "the-expedition",
  "the-hidden-trail",
  "the-epicurean",
  "the-southern-heart",
];

interface JournalFrontmatter {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  heroImage: string;
  relatedJourneySlugs: string[];
}

interface JournalFormProps {
  slug?: string; // undefined = new article
  initialFrontmatter?: Partial<JournalFrontmatter>;
  initialContent?: string;
}

export function JournalForm({
  slug,
  initialFrontmatter,
  initialContent = "",
}: JournalFormProps) {
  const router = useRouter();
  const isEditing = !!slug;

  const [title, setTitle] = useState(initialFrontmatter?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialFrontmatter?.excerpt ?? "");
  const [category, setCategory] = useState(
    initialFrontmatter?.category ?? "Travel Intelligence"
  );
  const [author, setAuthor] = useState(
    initialFrontmatter?.author ?? "The Curated Experiences Team"
  );
  const [publishedAt, setPublishedAt] = useState(
    initialFrontmatter?.publishedAt ?? new Date().toISOString().split("T")[0]
  );
  const [readTime, setReadTime] = useState(
    initialFrontmatter?.readTime ?? "5 min read"
  );
  const [heroImage, setHeroImage] = useState(
    initialFrontmatter?.heroImage ?? ""
  );
  const [relatedJourneySlugs, setRelatedJourneySlugs] = useState<string[]>(
    initialFrontmatter?.relatedJourneySlugs ?? []
  );
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Article body is required");
      return;
    }

    setSaving(true);
    setError("");

    const frontmatter: JournalFrontmatter = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      author,
      publishedAt,
      readTime,
      heroImage,
      relatedJourneySlugs,
    };

    if (isEditing) {
      const res = await fetch(`/api/admin/journal/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontmatter, content }),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = "Failed to save";
        try { msg = JSON.parse(text).error ?? msg; } catch { msg = text || msg; }
        setError(msg);
        setSaving(false);
        return;
      }
      router.push("/admin/content?tab=journal");
      router.refresh();
    } else {
      const res = await fetch("/api/admin/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontmatter, content }),
      });
      const text = await res.text();
      let data: { error?: string; slug?: string } = {};
      try { data = JSON.parse(text); } catch { /* empty */ }
      if (!res.ok) {
        setError(data.error ?? "Failed to create");
        setSaving(false);
        return;
      }
      router.push("/admin/content?tab=journal");
      router.refresh();
    }
  }, [
    title,
    excerpt,
    category,
    author,
    publishedAt,
    readTime,
    heroImage,
    relatedJourneySlugs,
    content,
    isEditing,
    slug,
    router,
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      {/* Metadata */}
      <div className="bg-white rounded-xl p-6 border border-warm-200 space-y-5">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted">
          Article Details
        </h2>

        <FormField label="Title">
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Article title..."
          />
        </FormField>

        <FormField label="Excerpt">
          <TextArea
            value={excerpt}
            onChange={setExcerpt}
            placeholder="One or two sentences summarising the article..."
            rows={2}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Category">
            <SelectField
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
            />
          </FormField>
          <FormField label="Published Date">
            <TextInput
              value={publishedAt}
              onChange={setPublishedAt}
              type="date"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Read Time">
            <TextInput
              value={readTime}
              onChange={setReadTime}
              placeholder="5 min read"
            />
          </FormField>
          <FormField label="Author">
            <TextInput
              value={author}
              onChange={setAuthor}
              placeholder="The Curated Experiences Team"
            />
          </FormField>
        </div>

        <FormField label="Hero Image">
          <ImagePickerField
            value={heroImage}
            onChange={setHeroImage}
          />
        </FormField>

        <FormField
          label="Related Journeys"
          hint={`Options: ${JOURNEY_SLUGS.join(", ")}`}
        >
          <TagInput
            value={relatedJourneySlugs}
            onChange={setRelatedJourneySlugs}
            placeholder="Add journey slug..."
          />
        </FormField>
      </div>

      {/* Body */}
      <div className="bg-white rounded-xl p-6 border border-warm-200 space-y-4">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted">
          Article Body
        </h2>
        <FormField
          label="Content (Markdown)"
          hint="Use ## for headings, **bold**, *italic*. MDX format."
        >
          <TextArea
            value={content}
            onChange={setContent}
            placeholder="Write your article here..."
            rows={28}
          />
        </FormField>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Publish Article"}
        </button>
        <button
          onClick={() => router.push("/admin/content?tab=journal")}
          className="px-5 py-2.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
