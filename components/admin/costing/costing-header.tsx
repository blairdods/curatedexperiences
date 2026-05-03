"use client";

import { FormField, TextInput } from "@/components/admin/ui/form-field";
import { SelectField } from "@/components/admin/ui/select-field";
import type { CostingTemplate } from "@/lib/costing/types";

interface Props {
  template: CostingTemplate;
  onUpdate: (
    updates: Partial<Pick<CostingTemplate, "fx_rate" | "global_margin_pct" | "pax" | "rooms" | "grade" | "season" | "market" | "tour_code">>,
  ) => void;
  disabled?: boolean;
}

const GRADE_OPTIONS = [
  { value: "Superior", label: "Superior" },
  { value: "Luxury", label: "Luxury" },
  { value: "Ultra-Luxury", label: "Ultra-Luxury" },
];

const SEASON_OPTIONS = [
  { value: "peak", label: "Peak" },
  { value: "shoulder", label: "Shoulder" },
  { value: "off-peak", label: "Off-Peak" },
];

const MARKET_OPTIONS = [
  { value: "USA", label: "USA" },
  { value: "AU", label: "Australia" },
  { value: "UK", label: "UK" },
  { value: "NZ", label: "New Zealand" },
];

export function CostingHeader({ template, onUpdate, disabled }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 border border-warm-200">
      <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
        Costing Settings
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <FormField label="NZD → USD Rate" hint="E.g. 0.60">
          <TextInput
            type="number"
            value={template.fx_rate?.toString() ?? "0.60"}
            onChange={(v) => onUpdate({ fx_rate: parseFloat(v) || 0 })}
            disabled={disabled}
          />
        </FormField>

        <FormField label="Global Margin %" hint="Applied to all lines">
          <TextInput
            type="number"
            value={template.global_margin_pct?.toString() ?? "25"}
            onChange={(v) => onUpdate({ global_margin_pct: parseFloat(v) || 0 })}
            disabled={disabled}
          />
        </FormField>

        <FormField label="PAX" hint="Travellers">
          <TextInput
            type="number"
            value={template.pax?.toString() ?? ""}
            onChange={(v) => onUpdate({ pax: parseInt(v, 10) || 0 })}
            disabled={disabled}
          />
        </FormField>

        <FormField label="Rooms" hint="For per-room pricing">
          <TextInput
            type="number"
            value={template.rooms?.toString() ?? ""}
            onChange={(v) => onUpdate({ rooms: parseInt(v, 10) || 0 })}
            disabled={disabled}
          />
        </FormField>

        <FormField label="Grade">
          <SelectField
            value={template.grade ?? ""}
            onChange={(v) => onUpdate({ grade: v || null })}
            options={GRADE_OPTIONS}
            placeholder="—"
            disabled={disabled}
          />
        </FormField>

        <FormField label="Season">
          <SelectField
            value={template.season ?? ""}
            onChange={(v) => onUpdate({ season: v || null })}
            options={SEASON_OPTIONS}
            placeholder="—"
            disabled={disabled}
          />
        </FormField>

        <FormField label="Market">
          <SelectField
            value={template.market ?? "USA"}
            onChange={(v) => onUpdate({ market: v })}
            options={MARKET_OPTIONS}
            disabled={disabled}
          />
        </FormField>

        <FormField label="Tour Code">
          <TextInput
            value={template.tour_code ?? ""}
            onChange={(v) => onUpdate({ tour_code: v || null })}
            placeholder="e.g. MAST-001"
            disabled={disabled}
          />
        </FormField>

        <FormField label="Version">
          <p className="text-sm text-foreground-muted py-2">v{template.version}</p>
        </FormField>
      </div>
    </div>
  );
}
