"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormField, TextInput, TextArea } from "@/components/admin/ui/form-field";
import { SelectField } from "@/components/admin/ui/select-field";
import { TagInput } from "@/components/admin/ui/tag-input";
import Image from "next/image";

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) {
      setUploadError(data.error ?? "Upload failed");
    } else {
      setHeroImage(data.url);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

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
        const data = await res.json();
        setError(data.error ?? "Failed to save");
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
      const data = await res.json();
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {heroImage ? (
            <div className="relative rounded-lg overflow-hidden border border-warm-200 bg-warm-50">
              <div className="relative h-48 w-full">
                <Image
                  src={heroImage}
                  alt="Hero image preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 border-t border-warm-200">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-sm text-navy hover:text-navy-light font-medium transition-colors disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Replace image"}
                </button>
                <span className="text-warm-400 text-xs">·</span>
                <button
                  type="button"
                  onClick={() => setHeroImage("")}
                  className="text-sm text-foreground-muted hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-2 h-36 rounded-lg border-2 border-dashed border-warm-300 bg-warm-50 hover:bg-warm-100 hover:border-warm-400 transition-colors disabled:opacity-50"
            >
              <svg className="w-7 h-7 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm text-foreground-muted">
                {uploading ? "Uploading..." : "Upload hero image"}
              </span>
              <span className="text-xs text-warm-400">JPG, PNG, WebP · max 10MB</span>
            </button>
          )}
          {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
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
