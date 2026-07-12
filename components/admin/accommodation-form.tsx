"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AccommodationData {
  id?: string;
  property_id?: string;
  slug?: string;
  name?: string;
  tier?: string;
  region?: string;
  location?: string;
  property_type?: string;
  description?: string;
  nightly_rate_nzd_min?: number;
  nightly_rate_nzd_max?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  contracted?: boolean;
  notes?: string;
  active?: boolean;
}

const REGIONS = [
  "Northland & Bay of Islands",
  "Auckland",
  "Coromandel",
  "Rotorua & Taupo",
  "Hawke's Bay",
  "Wellington & Wairarapa",
  "Nelson & Abel Tasman",
  "Marlborough",
  "West Coast",
  "Christchurch & Canterbury",
  "Queenstown & Wanaka",
  "Fiordland & Te Anau",
  "Dunedin & Otago",
  "Southland",
];

const PROPERTY_TYPES = [
  { value: "lodge", label: "Lodge" },
  { value: "hotel", label: "Hotel" },
  { value: "boutique_hotel", label: "Boutique Hotel" },
  { value: "camp", label: "Tented Camp / Glamping" },
  { value: "villa", label: "Villa / Private Residence" },
  { value: "retreat", label: "Retreat" },
  { value: "other", label: "Other" },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AccommodationForm({
  accommodation,
}: {
  accommodation?: AccommodationData;
}) {
  const router = useRouter();
  const isEdit = !!accommodation?.id;

  const [form, setForm] = useState({
    property_id: accommodation?.property_id ?? "",
    name: accommodation?.name ?? "",
    slug: accommodation?.slug ?? "",
    tier: accommodation?.tier ?? "gold",
    region: accommodation?.region ?? "",
    location: accommodation?.location ?? "",
    property_type: accommodation?.property_type ?? "",
    description: accommodation?.description ?? "",
    nightly_rate_nzd_min: accommodation?.nightly_rate_nzd_min?.toString() ?? "",
    nightly_rate_nzd_max: accommodation?.nightly_rate_nzd_max?.toString() ?? "",
    contact_name: accommodation?.contact_name ?? "",
    contact_email: accommodation?.contact_email ?? "",
    contact_phone: accommodation?.contact_phone ?? "",
    website_url: accommodation?.website_url ?? "",
    contracted: accommodation?.contracted ?? false,
    notes: accommodation?.notes ?? "",
    active: accommodation?.active ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: isEdit ? f.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      nightly_rate_nzd_min: form.nightly_rate_nzd_min
        ? parseInt(form.nightly_rate_nzd_min, 10)
        : null,
      nightly_rate_nzd_max: form.nightly_rate_nzd_max
        ? parseInt(form.nightly_rate_nzd_max, 10)
        : null,
    };

    const url = isEdit
      ? `/api/admin/accommodations/${accommodation!.id}`
      : "/api/admin/accommodations";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setSaving(false);
      return;
    }

    router.push("/admin/accommodations");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Core details */}
      <div className="bg-white rounded-xl border border-warm-200 p-6 space-y-4">
        <h2 className="text-sm font-medium text-navy uppercase tracking-wider">
          Property Details
        </h2>

        <div>
          <label className="block text-xs font-medium text-foreground-muted mb-1">
            Property ID
          </label>
          <input
            type="text"
            value={form.property_id}
            onChange={(e) => setForm((f) => ({ ...f, property_id: e.target.value.toUpperCase() }))}
            placeholder="e.g. AKL-GLD-001"
            className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 font-mono"
          />
          <p className="mt-1 text-xs text-foreground-muted">
            Used as the unique identifier when importing the supplier directory.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground-muted mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="e.g. Kauri Cliffs"
            className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground-muted mb-1">
            Slug
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="auto-generated from name"
            className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Tier <span className="text-red-500">*</span>
            </label>
            <select
              value={form.tier}
              onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
              required
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 bg-white"
            >
              <option value="platinum">Platinum — NZD 2,500–8,000+/night</option>
              <option value="gold">Gold — NZD 800–2,500/night</option>
              <option value="silver">Silver — ~NZD 600/night</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Property Type
            </label>
            <select
              value={form.property_type}
              onChange={(e) =>
                setForm((f) => ({ ...f, property_type: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 bg-white"
            >
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Region <span className="text-red-500">*</span>
            </label>
            <select
              value={form.region}
              onChange={(e) =>
                setForm((f) => ({ ...f, region: e.target.value }))
              }
              required
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 bg-white"
            >
              <option value="">Select region</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Location / Town
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              placeholder="e.g. Matauri Bay"
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground-muted mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
            placeholder="Brief description for internal reference"
            className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
          />
        </div>
      </div>

      {/* Rates */}
      <div className="bg-white rounded-xl border border-warm-200 p-6 space-y-4">
        <h2 className="text-sm font-medium text-navy uppercase tracking-wider">
          Rates (NZD)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Min / night
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
                $
              </span>
              <input
                type="number"
                value={form.nightly_rate_nzd_min}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nightly_rate_nzd_min: e.target.value,
                  }))
                }
                min={0}
                placeholder="800"
                className="w-full pl-7 pr-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Max / night
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
                $
              </span>
              <input
                type="number"
                value={form.nightly_rate_nzd_max}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nightly_rate_nzd_max: e.target.value,
                  }))
                }
                min={0}
                placeholder="2500"
                className="w-full pl-7 pr-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Supplier contact */}
      <div className="bg-white rounded-xl border border-warm-200 p-6 space-y-4">
        <h2 className="text-sm font-medium text-navy uppercase tracking-wider">
          Supplier Contact
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Contact Name
            </label>
            <input
              type="text"
              value={form.contact_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, contact_name: e.target.value }))
              }
              placeholder="Reservations manager"
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, contact_email: e.target.value }))
              }
              placeholder="reservations@property.co.nz"
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={form.contact_phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, contact_phone: e.target.value }))
              }
              placeholder="+64 9 ..."
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Website
            </label>
            <input
              type="url"
              value={form.website_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, website_url: e.target.value }))
              }
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
        </div>
      </div>

      {/* Status & notes */}
      <div className="bg-white rounded-xl border border-warm-200 p-6 space-y-4">
        <h2 className="text-sm font-medium text-navy uppercase tracking-wider">
          Status & Notes
        </h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.contracted}
              onChange={(e) =>
                setForm((f) => ({ ...f, contracted: e.target.checked }))
              }
              className="w-4 h-4 rounded border-warm-300 text-navy focus:ring-navy/20"
            />
            <span className="text-sm text-foreground">
              Contract in place (or contractable)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
              className="w-4 h-4 rounded border-warm-300 text-navy focus:ring-navy/20"
            />
            <span className="text-sm text-foreground">Active</span>
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground-muted mb-1">
            Internal Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) =>
              setForm((f) => ({ ...f, notes: e.target.value }))
            }
            rows={3}
            placeholder="Rate negotiation notes, seasonal availability, anything internal..."
            className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium bg-navy text-white rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Property"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm border border-warm-200 rounded-lg hover:bg-warm-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
