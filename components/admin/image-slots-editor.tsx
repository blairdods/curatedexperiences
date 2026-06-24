"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImagePickerField } from "@/components/admin/image-picker";
import {
  IMAGE_SLOT_DEFINITIONS,
  IMAGE_SLOT_SETTING_KEY,
  getSlotImages,
  groupedImageSlotDefinitions,
  serialiseImageSlotOverrides,
  type ImageSlotOverrides,
  type ManagedImage,
} from "@/lib/image-slots";

function emptyImage(): ManagedImage {
  return { src: "", alt: "" };
}

function normaliseSlotImages(
  images: ManagedImage[],
  length: number
): ManagedImage[] {
  return Array.from({ length }, (_, index) => images[index] ?? emptyImage());
}

export function ImageSlotsEditor({
  initialOverrides,
  updatedBy,
  updatedAt,
}: {
  initialOverrides: ImageSlotOverrides;
  updatedBy?: string | null;
  updatedAt?: string | null;
}) {
  const [overrides, setOverrides] = useState<ImageSlotOverrides>(initialOverrides);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const groups = useMemo(() => groupedImageSlotDefinitions(), []);
  const initialSerialised = useMemo(
    () => serialiseImageSlotOverrides(initialOverrides),
    [initialOverrides]
  );
  const currentSerialised = useMemo(
    () => serialiseImageSlotOverrides(overrides),
    [overrides]
  );
  const isDirty = initialSerialised !== currentSerialised;

  function updateSlotImage(key: string, index: number, image: ManagedImage) {
    const definition = IMAGE_SLOT_DEFINITIONS.find((slot) => slot.key === key);
    const length = definition?.mode === "rotation" ? 3 : 1;
    const current = normaliseSlotImages(overrides[key] ?? [], length);
    current[index] = image;

    setOverrides((previous) => ({
      ...previous,
      [key]: current.filter((item) => item.src.trim()),
    }));
  }

  function resetSlot(key: string) {
    setOverrides((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: upsertError } = await supabase.from("settings").upsert(
      {
        key: IMAGE_SLOT_SETTING_KEY,
        value: currentSerialised,
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
        entityId: IMAGE_SLOT_SETTING_KEY,
        action: "updated",
        changes: {
          before: JSON.parse(initialSerialised || "{}"),
          after: JSON.parse(currentSerialised || "{}"),
        },
      }),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 -mx-1 rounded-xl border border-warm-200 bg-white/95 px-5 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {Object.keys(overrides).length} slots customised
            </p>
            {updatedBy && updatedAt && (
              <p className="mt-1 text-xs text-foreground-muted">
                Last saved by {updatedBy} on{" "}
                {new Date(updatedAt).toLocaleDateString("en-NZ", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-green-600">Saved</span>}
            {error && <span className="text-xs text-red-500">{error}</span>}
            <button
              type="button"
              onClick={save}
              disabled={!isDirty || saving}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                isDirty
                  ? "bg-navy text-white hover:bg-navy-light"
                  : "cursor-not-allowed bg-warm-100 text-foreground-muted"
              }`}
            >
              {saving ? "Saving..." : "Save image settings"}
            </button>
          </div>
        </div>
      </div>

      {Object.entries(groups).map(([group, slots]) => (
        <section key={group}>
          <h2 className="font-serif text-lg tracking-tight text-navy">{group}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {slots.map((slot) => {
              const slotLength = slot.mode === "rotation" ? 3 : 1;
              const editableImages = normaliseSlotImages(
                overrides[slot.key] ?? [],
                slotLength
              );
              const displayImages = normaliseSlotImages(
                getSlotImages(overrides, slot.key),
                slotLength
              );
              const isCustomised = Boolean(overrides[slot.key]?.length);

              return (
                <div
                  key={slot.key}
                  className="rounded-xl border border-warm-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        {slot.label}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] text-foreground-muted">
                        {slot.key}
                      </p>
                      {slot.description && (
                        <p className="mt-2 text-xs leading-5 text-foreground-muted">
                          {slot.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="rounded-full bg-warm-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
                        {slot.mode}
                      </span>
                      {isCustomised && (
                        <button
                          type="button"
                          onClick={() => resetSlot(slot.key)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4">
                    {editableImages.map((image, index) => (
                      <div key={`${slot.key}-${index}`} className="space-y-2">
                        <ImagePickerField
                          label={
                            slot.mode === "rotation"
                              ? `Rotation image ${index + 1}`
                              : "Image"
                          }
                          value={image.src}
                          onChange={(src) =>
                            updateSlotImage(slot.key, index, {
                              src,
                              alt: image.alt,
                            })
                          }
                          onAltChange={(alt) =>
                            updateSlotImage(slot.key, index, {
                              src: image.src,
                              alt,
                            })
                          }
                          defaultRegion={slot.defaultRegion}
                          hint={
                            image.src
                              ? undefined
                              : `Using fallback: ${displayImages[index]?.src ?? "none"}`
                          }
                        />
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(event) =>
                            updateSlotImage(slot.key, index, {
                              src: image.src,
                              alt: event.target.value,
                            })
                          }
                          placeholder={displayImages[index]?.alt || "Alt text"}
                          className="w-full rounded border border-warm-200 bg-warm-50 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-navy/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
