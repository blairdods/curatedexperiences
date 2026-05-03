import type { QuoteType, CostingSummary, CostingLineItem } from "./types";

/**
 * Calculate the net total for a line item, taking into account
 * the quote type's effective quantity (PAX for per_person, rooms for per_room).
 */
export function calculateLineTotal(
  unitCostNzd: number,
  quantity: number,
  quoteType: QuoteType,
  pax: number,
  rooms: number,
): { total_net_nzd: number; effective_qty: number } {
  const multiplier =
    quoteType === "per_person" ? pax
    : quoteType === "per_room" ? rooms
    : 1; // flat_rate

  const effectiveQty = multiplier * quantity;
  const totalNet = Math.round(unitCostNzd * effectiveQty * 100) / 100;

  return { total_net_nzd: totalNet, effective_qty: effectiveQty };
}

/**
 * Apply margin to a net total. Uses item-level margin if set,
 * otherwise falls back to the template's global margin.
 */
export function applyMargin(
  totalNetNzd: number,
  itemMarginPct: number | null,
  globalMarginPct: number,
): { total_gross_nzd: number; applied_margin_pct: number } {
  const margin = itemMarginPct ?? globalMarginPct;
  const totalGross = Math.round(totalNetNzd * (1 + margin / 100) * 100) / 100;
  return { total_gross_nzd: totalGross, applied_margin_pct: margin };
}

/**
 * Recalculate a line item's totals based on current template parameters.
 * Returns updated total_net_nzd and total_gross_nzd.
 */
export function recalculateLineItem(
  item: Pick<CostingLineItem, "unit_cost_nzd" | "quantity" | "quote_type" | "item_margin_pct">,
  pax: number,
  rooms: number,
  globalMarginPct: number,
): { total_net_nzd: number; total_gross_nzd: number; effective_qty: number } {
  const { total_net_nzd } = calculateLineTotal(
    item.unit_cost_nzd,
    item.quantity,
    item.quote_type,
    pax,
    rooms,
  );
  const { total_gross_nzd } = applyMargin(total_net_nzd, item.item_margin_pct, globalMarginPct);
  return { total_net_nzd, total_gross_nzd, effective_qty: 0 };
}

/**
 * Calculate section subtotals from line items.
 */
export function calculateSectionTotals(
  lineItems: Array<{ total_net_nzd: number; total_gross_nzd: number }>,
): { subtotal_net_nzd: number; subtotal_gross_nzd: number } {
  return {
    subtotal_net_nzd: Math.round(lineItems.reduce((sum, li) => sum + li.total_net_nzd, 0) * 100) / 100,
    subtotal_gross_nzd: Math.round(lineItems.reduce((sum, li) => sum + li.total_gross_nzd, 0) * 100) / 100,
  };
}

/**
 * Calculate grand totals across all sections.
 */
export function calculateGrandTotals(
  sections: Array<{ subtotal_net_nzd: number; subtotal_gross_nzd: number }>,
): { total_net_nzd: number; total_gross_nzd: number } {
  return {
    total_net_nzd: Math.round(sections.reduce((sum, s) => sum + s.subtotal_net_nzd, 0) * 100) / 100,
    total_gross_nzd: Math.round(sections.reduce((sum, s) => sum + s.subtotal_gross_nzd, 0) * 100) / 100,
  };
}

/**
 * Calculate the full summary including USD conversion and per-person breakdowns.
 */
export function calculateSummary(
  totalGrossNzd: number,
  totalNetNzd: number,
  fxRate: number,
  pax: number,
): CostingSummary {
  const totalGrossUsd = Math.round(totalGrossNzd * fxRate * 100) / 100;
  const perPersonNzd = pax > 0 ? Math.round((totalGrossNzd / pax) * 100) / 100 : 0;
  const perPersonUsd = pax > 0 ? Math.round((totalGrossUsd / pax) * 100) / 100 : 0;
  const effectiveMarginPct =
    totalGrossNzd > 0
      ? Math.round(((totalGrossNzd - totalNetNzd) / totalNetNzd) * 100 * 10) / 10
      : 0;

  return {
    total_net_nzd: totalNetNzd,
    total_gross_nzd: totalGrossNzd,
    total_gross_usd: totalGrossUsd,
    per_person_nzd: perPersonNzd,
    per_person_usd: perPersonUsd,
    effective_margin_pct: effectiveMarginPct,
    total_margin_amount_nzd: Math.round((totalGrossNzd - totalNetNzd) * 100) / 100,
  };
}
