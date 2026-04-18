"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FormField, TextInput, TextArea } from "@/components/admin/ui/form-field";
import { TagInput } from "@/components/admin/ui/tag-input";
import { ListEditor } from "@/components/admin/ui/list-editor";
import {
  ItineraryDayEditor,
  type ItineraryDay,
} from "@/components/admin/itinerary-day-editor";

interface JourneyData {
  id?: string;
  slug: string;
  title: string;
  tagline: string;
  duration_days: number;
  price_from_usd: number;
  journey_type: string[];
  regions: string[];
  experience_tags: string[];
  theme_tags: string[];
  ideal_for: string[];
  seasons: string[];
  highlights: string[];
  inclusions: string[];
  itinerary_days: ItineraryDay[];
  media: { src: string; alt: string }[];
  active: boolean;
}

const emptyJourney: JourneyData = {
  slug: "",
  title: "",
  tagline: "",
  duration_days: 10,
  price_from_usd: 0,
  journey_type: [],
  regions: [],
  experience_tags: [],
  theme_tags: [],
  ideal_for: [],
  seasons: [],
  highlights: [],
  inclusions: [],
  itinerary_days: [],
  media: [],
  active: true,
};

export function JourneyForm({
  initialData,
}: {
  initialData?: JourneyData;
}) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const [data, setData] = useState<JourneyData>(initialData ?? emptyJourney);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newMediaSrc, setNewMediaSrc] = useState("");
  const [newMediaAlt, setNewMediaAlt] = useState("");

  const update = <K extends keyof JourneyData>(
    key: K,
    value: JourneyData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleTitleChange = (title: string) => {
    update("title", title);
    if (!isEditing) {
      update("slug", generateSlug(title));
    }
  };

  const addDay = () => {
    const newDay: ItineraryDay = {
      day: data.itinerary_days.length + 1,
      title: "",
      location: "",
      description: "",
      activities: [],
      accommodation: "",
    };
    update("itinerary_days", [...data.itinerary_days, newDay]);
  };

  const updateDay = (index: number, day: ItineraryDay) => {
    const days = [...data.itinerary_days];
    days[index] = day;
    update("itinerary_days", days);
  };

  const removeDay = (index: number) => {
    const days = data.itinerary_days
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day: i + 1 }));
    update("itinerary_days", days);
  };

  const addMedia = () => {
    if (!newMediaSrc.trim()) return;
    update("media", [
      ...data.media,
      { src: newMediaSrc.trim(), alt: newMediaAlt.trim() || data.title },
    ]);
    setNewMediaSrc("");
    setNewMediaAlt("");
  };

  const removeMedia = (index: number) => {
    update("media", data.media.filter((_, i) => i !== index));
  };

  const handleSave = useCallback(async () => {
    if (!data.title.trim() || !data.slug.trim()) {
      setError("Title and slug are required");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient();

    const record = {
      slug: data.slug,
      title: data.title.trim(),
      tagline: data.tagline.trim() || null,
      duration_days: data.duration_days,
      price_from_usd: data.price_from_usd,
      journey_type: data.journey_type,
      regions: data.regions,
      experience_tags: data.experience_tags,
      theme_tags: data.theme_tags,
      ideal_for: data.ideal_for,
      seasons: data.seasons,
      highlights: data.highlights,
      inclusions: data.inclusions,
      itinerary_days: data.itinerary_days,
      media: data.media,
      active: data.active,
    };

    if (isEditing && data.id) {
      const { error: err } = await supabase
        .from("tours")
        .update(record)
        .eq("id", data.id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: err } = await supabase.from("tours").insert(record);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    router.push("/admin/journeys");
    router.refresh();
  }, [data, isEditing, router]);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Basic Info
        </h2>
        <div className="space-y-4">
          <FormField label="Title">
            <TextInput
              value={data.title}
              onChange={handleTitleChange}
              placeholder="Journey title..."
            />
          </FormField>
          <FormField label="Slug" hint="URL-friendly identifier">
            <TextInput
              value={data.slug}
              onChange={(v) => update("slug", v)}
              placeholder="the-journey-slug"
            />
          </FormField>
          <FormField label="Tagline">
            <TextArea
              value={data.tagline}
              onChange={(v) => update("tagline", v)}
              placeholder="Short compelling tagline..."
              rows={2}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Duration (days)">
              <TextInput
                value={String(data.duration_days)}
                onChange={(v) => update("duration_days", parseInt(v) || 0)}
                type="number"
              />
            </FormField>
            <FormField label="Price from (USD)">
              <TextInput
                value={String(data.price_from_usd)}
                onChange={(v) => update("price_from_usd", parseInt(v) || 0)}
                type="number"
              />
            </FormField>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.active}
                onChange={(e) => update("active", e.target.checked)}
                className="rounded border-warm-300"
              />
              Active (visible on website)
            </label>
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Classification
        </h2>
        <div className="space-y-4">
          <FormField label="Journey Types">
            <TagInput value={data.journey_type} onChange={(v) => update("journey_type", v)} placeholder="e.g. luxury, adventure" />
          </FormField>
          <FormField label="Regions">
            <TagInput value={data.regions} onChange={(v) => update("regions", v)} placeholder="e.g. Queenstown, Fiordland" />
          </FormField>
          <FormField label="Experience Tags">
            <TagInput value={data.experience_tags} onChange={(v) => update("experience_tags", v)} placeholder="e.g. heli, wine" />
          </FormField>
          <FormField label="Ideal For">
            <TagInput value={data.ideal_for} onChange={(v) => update("ideal_for", v)} placeholder="e.g. couples, families" />
          </FormField>
          <FormField label="Seasons">
            <TagInput value={data.seasons} onChange={(v) => update("seasons", v)} placeholder="e.g. summer, autumn" />
          </FormField>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Highlights & Inclusions
        </h2>
        <div className="space-y-4">
          <FormField label="Highlights">
            <ListEditor value={data.highlights} onChange={(v) => update("highlights", v)} placeholder="Add highlight..." />
          </FormField>
          <FormField label="Inclusions">
            <ListEditor value={data.inclusions} onChange={(v) => update("inclusions", v)} placeholder="Add inclusion..." />
          </FormField>
        </div>
      </div>

      {/* Itinerary */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted">
            Itinerary ({data.itinerary_days.length} days)
          </h2>
          <button
            type="button"
            onClick={addDay}
            className="text-xs px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
          >
            + Add Day
          </button>
        </div>
        <div className="space-y-4">
          {data.itinerary_days.map((day, i) => (
            <ItineraryDayEditor
              key={i}
              day={day}
              onChange={(d) => updateDay(i, d)}
              onRemove={() => removeDay(i)}
            />
          ))}
          {data.itinerary_days.length === 0 && (
            <p className="text-sm text-foreground-muted text-center py-6">
              No itinerary days added yet.
            </p>
          )}
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-xl p-6 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Media ({data.media.length} images)
        </h2>
        <div className="space-y-2 mb-4">
          {data.media.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-warm-50 rounded-lg px-3 py-2"
            >
              <span className="flex-1 text-sm text-foreground truncate">
                {m.src}
              </span>
              <span className="text-xs text-foreground-muted">{m.alt}</span>
              <button
                type="button"
                onClick={() => removeMedia(i)}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newMediaSrc}
            onChange={(e) => setNewMediaSrc(e.target.value)}
            placeholder="Image URL..."
            className="flex-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
          />
          <input
            value={newMediaAlt}
            onChange={(e) => setNewMediaAlt(e.target.value)}
            placeholder="Alt text..."
            className="w-40 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
          />
          <button
            type="button"
            onClick={addMedia}
            className="px-3 py-2 text-xs bg-warm-100 text-foreground-muted rounded-lg hover:bg-warm-200 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Update Journey" : "Create Journey"}
        </button>
        <button
          onClick={() => router.push("/admin/journeys")}
          className="px-5 py-2.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
