"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FormField, TextInput, TextArea } from "@/components/admin/ui/form-field";
import { TagInput } from "@/components/admin/ui/tag-input";
import { ListEditor } from "@/components/admin/ui/list-editor";

interface DestinationData {
  id?: string;
  slug: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  highlights: string[];
  best_for: string[];
  best_seasons: string;
  related_journey_slugs: string[];
  hero_image: string;
  images: { src: string; alt: string }[];
  active: boolean;
}

const empty: DestinationData = {
  slug: "",
  name: "",
  region: "South Island",
  tagline: "",
  description: "",
  highlights: [],
  best_for: [],
  best_seasons: "",
  related_journey_slugs: [],
  hero_image: "",
  images: [],
  active: true,
};

export function DestinationForm({ initialData }: { initialData?: DestinationData }) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const [data, setData] = useState<DestinationData>(initialData ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newImgSrc, setNewImgSrc] = useState("");
  const [newImgAlt, setNewImgAlt] = useState("");

  const update = <K extends keyof DestinationData>(key: K, value: DestinationData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleNameChange = (name: string) => {
    update("name", name);
    if (!isEditing) update("slug", generateSlug(name));
  };

  const addImage = () => {
    if (!newImgSrc.trim()) return;
    update("images", [...data.images, { src: newImgSrc.trim(), alt: newImgAlt.trim() || data.name }]);
    setNewImgSrc("");
    setNewImgAlt("");
  };

  const removeImage = (index: number) => {
    update("images", data.images.filter((_, i) => i !== index));
  };

  const handleSave = useCallback(async () => {
    if (!data.name.trim() || !data.slug.trim() || !data.region) {
      setError("Name, slug, and region are required");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      slug: data.slug,
      name: data.name.trim(),
      region: data.region,
      tagline: data.tagline.trim() || null,
      description: data.description.trim() || null,
      highlights: data.highlights,
      best_for: data.best_for,
      best_seasons: data.best_seasons.trim() || null,
      related_journey_slugs: data.related_journey_slugs,
      hero_image: data.hero_image.trim() || null,
      images: data.images,
      active: data.active,
    };

    const url = isEditing ? `/api/admin/destinations/${data.id}` : "/api/admin/destinations";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json() as { error?: string };
    if (!res.ok) {
      setError(json.error ?? "Save failed");
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push("/admin/destinations");
    router.refresh();
  }, [data, isEditing, router]);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">Basic Info</h2>
        <div className="space-y-4">
          <FormField label="Name">
            <TextInput value={data.name} onChange={handleNameChange} placeholder="Fiordland" />
          </FormField>
          <FormField label="Slug" hint="URL identifier — auto-generated from name">
            <TextInput value={data.slug} onChange={(v) => update("slug", v)} placeholder="fiordland" />
          </FormField>
          <FormField label="Region">
            <select
              value={data.region}
              onChange={(e) => update("region", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy/20"
            >
              <option value="North Island">North Island</option>
              <option value="South Island">South Island</option>
            </select>
          </FormField>
          <FormField label="Tagline">
            <TextInput
              value={data.tagline}
              onChange={(v) => update("tagline", v)}
              placeholder="Ancient rainforest, mirror-still fiords, and a silence that stays with you."
            />
          </FormField>
          <FormField label="Description">
            <TextArea
              value={data.description}
              onChange={(v) => update("description", v)}
              placeholder="Full editorial description for the destination detail page..."
              rows={8}
            />
          </FormField>
          <FormField label="Best Seasons">
            <TextInput
              value={data.best_seasons}
              onChange={(v) => update("best_seasons", v)}
              placeholder="October–April, though winter has a haunting beauty"
            />
          </FormField>
        </div>
      </div>

      {/* Highlights & Tags */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">Highlights & Tags</h2>
        <div className="space-y-4">
          <FormField label="Highlights" hint="Key experiences at this destination">
            <ListEditor
              value={data.highlights}
              onChange={(v) => update("highlights", v)}
              placeholder="Add a highlight..."
            />
          </FormField>
          <FormField label="Best For" hint="Tags like Nature lovers, Couples, Wine lovers">
            <TagInput
              tags={data.best_for}
              onChange={(v) => update("best_for", v)}
              placeholder="Add a tag..."
            />
          </FormField>
          <FormField label="Related Journey Slugs" hint="Slugs of journeys that visit this destination">
            <TagInput
              tags={data.related_journey_slugs}
              onChange={(v) => update("related_journey_slugs", v)}
              placeholder="e.g. the-masterpiece"
            />
          </FormField>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">Images</h2>
        <div className="space-y-4">
          <FormField label="Hero Image URL">
            <TextInput
              value={data.hero_image}
              onChange={(v) => update("hero_image", v)}
              placeholder="https://..."
            />
          </FormField>
          {data.hero_image && (
            <img
              src={data.hero_image}
              alt="Hero preview"
              className="w-full max-h-48 object-cover rounded-lg border border-warm-200"
            />
          )}

          {/* Gallery images */}
          {data.images.length > 0 && (
            <div className="space-y-2">
              {data.images.map((img, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-warm-50 rounded-lg border border-warm-100">
                  <img src={img.src} alt={img.alt} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{img.src}</p>
                    <p className="text-xs text-foreground-muted truncate">{img.alt}</p>
                  </div>
                  <button
                    onClick={() => removeImage(i)}
                    className="text-xs text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <TextInput
              value={newImgSrc}
              onChange={setNewImgSrc}
              placeholder="Image URL..."
            />
            <TextInput
              value={newImgAlt}
              onChange={setNewImgAlt}
              placeholder="Alt text..."
            />
            <button
              onClick={addImage}
              className="flex-shrink-0 px-3 py-2 text-xs font-medium bg-navy text-cream rounded-lg hover:bg-navy/90 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">Status</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.active}
            onChange={(e) => update("active", e.target.checked)}
            className="w-4 h-4 accent-navy"
          />
          <span className="text-sm text-foreground">Active (visible on public site)</span>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-3 pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 text-sm font-medium bg-navy text-cream rounded-lg hover:bg-navy/90 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Destination"}
        </button>
        <button
          onClick={() => router.push("/admin/destinations")}
          className="px-4 py-2.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
