"use client";

import { useState } from "react";
import type { CostingLineItem, CostingLineItemInput } from "@/lib/costing/types";
import { CostingLineItemRow } from "./costing-line-item-row";
import { CostingLineItemForm } from "./costing-line-item-form";

interface Props {
  name: string;
  items: CostingLineItem[];
  subtotalNetNzd: number;
  subtotalGrossNzd: number;
  pax: number | null;
  onAddItem: (input: CostingLineItemInput) => void;
  onDeleteItem: (itemId: string) => void;
  disabled?: boolean;
}

export function CostingSection({
  name,
  items,
  subtotalNetNzd,
  subtotalGrossNzd,
  pax,
  onAddItem,
  onDeleteItem,
  disabled,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const hasItems = items.length > 0;
  const sortedItems = [...items].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="border border-warm-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-warm-50 hover:bg-warm-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-foreground-muted transition-transform duration-150"
            style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>
            ▶
          </span>
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-foreground-muted">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="text-right">
          {hasItems ? (
            <div>
              <span className="text-sm font-mono text-navy">
                ${subtotalGrossNzd.toLocaleString()}
              </span>
              <span className="text-xs text-foreground-muted ml-1">NZD</span>
            </div>
          ) : (
            <span className="text-xs text-foreground-muted">Empty</span>
          )}
        </div>
      </button>

      {/* Section Body */}
      {expanded && (
        <div className="border-t border-warm-100">
          {hasItems ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-100 bg-warm-50/50">
                    <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium w-10">
                      Day
                    </th>
                    <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium">
                      Supplier
                    </th>
                    <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium">
                      Service
                    </th>
                    <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium">
                      Type
                    </th>
                    <th className="py-2 px-2 text-right text-[10px] uppercase tracking-wider text-foreground-muted font-medium">
                      Qty
                    </th>
                    <th className="py-2 px-2 text-right text-[10px] uppercase tracking-wider text-foreground-muted font-medium">
                      Unit NZD
                    </th>
                    <th className="py-2 px-2 text-right text-[10px] uppercase tracking-wider text-foreground-muted font-medium">
                      Margin%
                    </th>
                    <th className="py-2 px-2 text-right text-[10px] uppercase tracking-wider text-foreground-muted font-medium">
                      Gross NZD
                    </th>
                    <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium w-16">
                      &nbsp;
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => (
                    <CostingLineItemRow
                      key={item.id}
                      item={item}
                      onEdit={() => {
                        // Edit triggers the form inline — future improvement
                      }}
                      onDelete={() => onDeleteItem(item.id)}
                      disabled={disabled}
                    />
                  ))}
                  {showForm && (
                    <CostingLineItemForm
                      pax={pax}
                      onSave={(input) => {
                        onAddItem(input);
                        setShowForm(false);
                      }}
                      onCancel={() => setShowForm(false)}
                    />
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              {showForm ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-warm-100 bg-warm-50/50">
                        <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium w-10">Day</th>
                        <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium">Supplier</th>
                        <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium">Service</th>
                        <th className="py-2 px-2 text-left text-[10px] uppercase tracking-wider text-foreground-muted font-medium">Type</th>
                        <th className="py-2 px-2 text-right text-[10px] uppercase tracking-wider text-foreground-muted font-medium">Qty</th>
                        <th className="py-2 px-2 text-right text-[10px] uppercase tracking-wider text-foreground-muted font-medium">Unit NZD</th>
                        <th className="py-2 px-2 text-right text-[10px] uppercase tracking-wider text-foreground-muted font-medium">Margin%</th>
                        <th className="py-2 px-2 text-right text-[10px] uppercase tracking-wider text-foreground-muted font-medium">Gross NZD</th>
                        <th className="py-2 px-2 w-16">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <CostingLineItemForm
                        pax={pax}
                        onSave={(input) => {
                          onAddItem(input);
                          setShowForm(false);
                        }}
                        onCancel={() => setShowForm(false)}
                      />
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-foreground-muted mb-3">No items in this section yet.</p>
              )}
            </div>
          )}

          {/* Add button */}
          {!showForm && (
            <div className="px-4 py-2 border-t border-warm-100">
              <button
                onClick={() => setShowForm(true)}
                disabled={disabled}
                className="text-xs text-navy hover:text-navy-light transition-colors disabled:opacity-50"
              >
                + Add line item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
