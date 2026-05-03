export type QuoteType = "per_person" | "per_room" | "flat_rate";

export const COSTING_SECTIONS = [
  "Accommodation",
  "Transfers",
  "Experiences & Activities",
  "Guides",
  "International Flights",
  "Travel Insurance",
  "Tipping & Gratuities",
  "Miscellaneous",
] as const;

export type CostingSectionName = (typeof COSTING_SECTIONS)[number];

export interface CostingTemplate {
  id: string;
  booking_id: string;
  version: number;
  fx_rate: number;
  global_margin_pct: number;
  market: string | null;
  season: string | null;
  grade: string | null;
  pax: number | null;
  rooms: number | null;
  notes: string | null;
  prepared_by: string | null;
  tour_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface CostingSection {
  id: string;
  template_id: string;
  name: string;
  sort_order: number;
  created_at: string;
  line_items: CostingLineItem[];
  // Computed
  subtotal_net_nzd: number;
  subtotal_gross_nzd: number;
}

export interface CostingLineItem {
  id: string;
  section_id: string;
  day_number: number | null;
  supplier_name: string;
  service_description: string;
  quote_type: QuoteType;
  quantity: number;
  unit_cost_nzd: number;
  item_margin_pct: number | null;
  total_net_nzd: number;
  total_gross_nzd: number;
  notes: string | null;
  sort_order: number;
  source_option_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CostingLineItemInput {
  day_number: number | null;
  supplier_name: string;
  service_description: string;
  quote_type: QuoteType;
  quantity: number;
  unit_cost_nzd: number;
  item_margin_pct: number | null;
  notes: string | null;
}

export interface CostingSummary {
  total_net_nzd: number;
  total_gross_nzd: number;
  total_gross_usd: number;
  per_person_nzd: number;
  per_person_usd: number;
  effective_margin_pct: number;
  total_margin_amount_nzd: number;
}
