"use client";

import type { CostingLineItem } from "@/lib/costing/types";

const QUOTE_TYPE_LABELS: Record<string, string> = {
  per_person: "/person",
  per_room: "/room",
  flat_rate: "flat",
};

interface Props {
  item: CostingLineItem;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function CostingLineItemRow({ item, onEdit, onDelete, disabled }: Props) {
  return (
    <tr className="border-b border-warm-100 hover:bg-warm-50/50 transition-colors">
      <td className="py-2 px-2 text-xs text-foreground-muted w-10">
        {item.day_number ?? "—"}
      </td>
      <td className="py-2 px-2 text-sm font-medium">{item.supplier_name}</td>
      <td className="py-2 px-2 text-sm text-foreground-muted max-w-[200px] truncate">
        {item.service_description}
      </td>
      <td className="py-2 px-2 text-xs">
        <span className="px-1.5 py-0.5 rounded bg-warm-100 text-foreground-muted">
          {QUOTE_TYPE_LABELS[item.quote_type] ?? item.quote_type}
        </span>
      </td>
      <td className="py-2 px-2 text-sm text-right">{item.quantity}</td>
      <td className="py-2 px-2 text-sm text-right font-mono">
        ${Number(item.unit_cost_nzd).toLocaleString()}
      </td>
      <td className="py-2 px-2 text-sm text-right">
        {item.item_margin_pct !== null ? (
          <span className="text-navy font-medium">{Number(item.item_margin_pct)}%</span>
        ) : (
          <span className="text-foreground-muted">—</span>
        )}
      </td>
      <td className="py-2 px-2 text-sm text-right font-mono">
        ${Number(item.total_gross_nzd).toLocaleString()}
      </td>
      <td className="py-2 px-2">
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            disabled={disabled}
            className="text-xs text-foreground-muted hover:text-navy transition-colors disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={disabled}
            className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            Del
          </button>
        </div>
      </td>
    </tr>
  );
}
