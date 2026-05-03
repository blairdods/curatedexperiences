import { createClient } from "@/lib/supabase/client";
import type {
  CostingTemplate,
  CostingSection,
  CostingLineItem,
  CostingLineItemInput,
} from "./types";
import { COSTING_SECTIONS } from "./types";

// ─── Template ───────────────────────────────────────────────

export async function getLatestTemplate(
  bookingId: string,
): Promise<(CostingTemplate & { sections: (CostingSection & { line_items: CostingLineItem[] })[] }) | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("costing_templates")
    .select("*, costing_sections(*, costing_line_items(*))")
    .eq("booking_id", bookingId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as unknown as (CostingTemplate & {
    sections: (CostingSection & { line_items: CostingLineItem[] })[];
  }) | null;
}

export async function createTemplate(
  bookingId: string,
  overrides?: Partial<Pick<CostingTemplate, "pax" | "rooms" | "grade" | "season" | "tour_code">>,
): Promise<CostingTemplate> {
  const supabase = createClient();

  // Create template
  const { data: template, error } = await supabase
    .from("costing_templates")
    .insert({
      booking_id: bookingId,
      version: 1,
      pax: overrides?.pax ?? null,
      rooms: overrides?.rooms ?? null,
      grade: overrides?.grade ?? null,
      season: overrides?.season ?? null,
      tour_code: overrides?.tour_code ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  // Create 8 default sections
  const sections = COSTING_SECTIONS.map((name, i) => ({
    template_id: template.id,
    name,
    sort_order: i,
  }));

  await supabase.from("costing_sections").insert(sections);

  return template as CostingTemplate;
}

export async function updateTemplateHeader(
  templateId: string,
  updates: Partial<
    Pick<
      CostingTemplate,
      "fx_rate" | "global_margin_pct" | "pax" | "rooms" | "grade" | "season" | "market" | "tour_code" | "notes" | "prepared_by"
    >
  >,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("costing_templates")
    .update(updates)
    .eq("id", templateId);

  if (error) throw error;
}

// ─── Line Items ─────────────────────────────────────────────

export async function addLineItem(
  sectionId: string,
  input: CostingLineItemInput,
  sortOrder: number,
): Promise<CostingLineItem> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("costing_line_items")
    .insert({
      section_id: sectionId,
      day_number: input.day_number,
      supplier_name: input.supplier_name,
      service_description: input.service_description,
      quote_type: input.quote_type,
      quantity: input.quantity,
      unit_cost_nzd: input.unit_cost_nzd,
      item_margin_pct: input.item_margin_pct,
      notes: input.notes,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CostingLineItem;
}

export async function updateLineItem(
  itemId: string,
  updates: Partial<
    Pick<
      CostingLineItem,
      | "day_number"
      | "supplier_name"
      | "service_description"
      | "quote_type"
      | "quantity"
      | "unit_cost_nzd"
      | "item_margin_pct"
      | "total_net_nzd"
      | "total_gross_nzd"
      | "notes"
    >
  >,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("costing_line_items")
    .update(updates)
    .eq("id", itemId);

  if (error) throw error;
}

export async function deleteLineItem(itemId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("costing_line_items")
    .delete()
    .eq("id", itemId);

  if (error) throw error;
}
