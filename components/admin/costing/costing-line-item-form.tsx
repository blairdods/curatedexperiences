"use client";

import { useState } from "react";
import type { CostingLineItem, CostingLineItemInput, QuoteType } from "@/lib/costing/types";

const QUOTE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "per_person", label: "Per Person" },
  { value: "per_room", label: "Per Room" },
  { value: "flat_rate", label: "Flat Rate" },
];

interface Props {
  initial?: Partial<CostingLineItem>;
  pax: number | null;
  onSave: (input: CostingLineItemInput) => void;
  onCancel: () => void;
}

export function CostingLineItemForm({ initial, pax, onSave, onCancel }: Props) {
  const [dayNumber, setDayNumber] = useState(initial?.day_number?.toString() ?? "");
  const [supplierName, setSupplierName] = useState(initial?.supplier_name ?? "");
  const [serviceDescription, setServiceDescription] = useState(initial?.service_description ?? "");
  const [quoteType, setQuoteType] = useState<QuoteType>(
    (initial?.quote_type as QuoteType) ?? "flat_rate",
  );
  const [quantity, setQuantity] = useState(initial?.quantity?.toString() ?? "1");
  const [unitCost, setUnitCost] = useState(initial?.unit_cost_nzd?.toString() ?? "");
  const [marginPct, setMarginPct] = useState(
    initial?.item_margin_pct !== null && initial?.item_margin_pct !== undefined
      ? initial.item_margin_pct.toString()
      : "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!supplierName.trim()) e.supplier_name = "Supplier is required";
    if (!serviceDescription.trim()) e.service_description = "Description is required";
    if (!unitCost.trim() || isNaN(Number(unitCost)) || Number(unitCost) < 0)
      e.unit_cost = "Valid unit cost required";
    if (quoteType === "per_person" && (!pax || pax < 1))
      e.quote_type = "Set number of travellers first";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      day_number: dayNumber ? parseInt(dayNumber, 10) : null,
      supplier_name: supplierName.trim(),
      service_description: serviceDescription.trim(),
      quote_type: quoteType,
      quantity: parseInt(quantity, 10) || 1,
      unit_cost_nzd: parseFloat(unitCost) || 0,
      item_margin_pct: marginPct ? parseFloat(marginPct) : null,
      notes: notes.trim() || null,
    });
  };

  const inputClass =
    "w-full px-2 py-1.5 text-sm bg-warm-50 border border-warm-200 rounded focus:outline-none focus:border-navy/30";

  return (
    <tr className="bg-warm-50/50">
      <td className="py-2 px-2">
        <input
          type="number"
          value={dayNumber}
          onChange={(e) => setDayNumber(e.target.value)}
          placeholder="Day"
          className={`${inputClass} w-14`}
        />
      </td>
      <td className="py-2 px-2">
        <input
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          placeholder="Supplier"
          className={inputClass}
        />
        {errors.supplier_name && (
          <p className="text-[10px] text-red-500 mt-0.5">{errors.supplier_name}</p>
        )}
      </td>
      <td className="py-2 px-2">
        <input
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          placeholder="Service / Description"
          className={inputClass}
        />
        {errors.service_description && (
          <p className="text-[10px] text-red-500 mt-0.5">{errors.service_description}</p>
        )}
      </td>
      <td className="py-2 px-2">
        <select
          value={quoteType}
          onChange={(e) => setQuoteType(e.target.value as QuoteType)}
          className={`${inputClass} text-xs`}
        >
          {QUOTE_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.quote_type && (
          <p className="text-[10px] text-red-500 mt-0.5">{errors.quote_type}</p>
        )}
      </td>
      <td className="py-2 px-2">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={`${inputClass} w-16 text-right`}
        />
      </td>
      <td className="py-2 px-2">
        <input
          type="number"
          value={unitCost}
          onChange={(e) => setUnitCost(e.target.value)}
          placeholder="0"
          className={`${inputClass} w-24 text-right font-mono`}
        />
        {errors.unit_cost && (
          <p className="text-[10px] text-red-500 mt-0.5">{errors.unit_cost}</p>
        )}
      </td>
      <td className="py-2 px-2">
        <input
          type="number"
          value={marginPct}
          onChange={(e) => setMarginPct(e.target.value)}
          placeholder="Global"
          className={`${inputClass} w-16 text-right`}
        />
      </td>
      <td className="py-2 px-2 text-sm text-foreground-muted font-mono text-right">
        —
      </td>
      <td className="py-2 px-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            className="text-xs px-2 py-1 bg-navy text-white rounded hover:bg-navy-light transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="text-xs px-2 py-1 text-foreground-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}
