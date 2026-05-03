"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type {
  CostingTemplate,
  CostingLineItem,
  CostingLineItemInput,
  CostingSummary,
} from "@/lib/costing/types";
import { getLatestTemplate, createTemplate } from "@/lib/costing/queries";
import {
  recalculateLineItem,
  calculateSectionTotals,
  calculateGrandTotals,
  calculateSummary,
} from "@/lib/costing/calculate";
import { CostingHeader } from "./costing-header";
import { CostingSectionGroup } from "./costing-section-group";
import { CostingSummaryCard } from "./costing-summary-card";

interface BookingInfo {
  guests: Array<Record<string, unknown>> | null;
  tourTitle: string | null;
  tourSlug: string | null;
}

interface Props {
  bookingId: string;
  bookingInfo: BookingInfo;
}

interface SectionState {
  id: string;
  name: string;
  items: CostingLineItem[];
  subtotalNetNzd: number;
  subtotalGrossNzd: number;
}

export function CostingPanel({ bookingId, bookingInfo }: Props) {
  const router = useRouter();
  const [template, setTemplate] = useState<CostingTemplate | null>(null);
  const [sections, setSections] = useState<SectionState[]>([]);
  const [summary, setSummary] = useState<CostingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [creating, setCreating] = useState(false);

  // Load template on mount
  useEffect(() => {
    loadTemplate();
  }, [bookingId]);

  const loadTemplate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLatestTemplate(bookingId);
      if (data) {
        setTemplate(data as unknown as CostingTemplate);
        const rawSections = (data as unknown as Record<string, unknown>).costing_sections as Array<Record<string, unknown>> || [];
        const sectionStates: SectionState[] = rawSections.map((s) => {
          const items = (s.costing_line_items || []) as unknown as CostingLineItem[];
          const totals = calculateSectionTotals(items);
          return {
            id: s.id as string,
            name: s.name as string,
            items,
            subtotalNetNzd: totals.subtotal_net_nzd,
            subtotalGrossNzd: totals.subtotal_gross_nzd,
          };
        });
        setSections(sectionStates);
        updateSummary(sectionStates, data as unknown as CostingTemplate);
      }
    } catch (err) {
      setError("Failed to load costing");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSummary = (sects: SectionState[], tmpl: CostingTemplate) => {
    const grandTotals = calculateGrandTotals(
      sects.map((s) => ({ subtotal_net_nzd: s.subtotalNetNzd, subtotal_gross_nzd: s.subtotalGrossNzd })),
    );
    const sum = calculateSummary(
      grandTotals.total_gross_nzd,
      grandTotals.total_net_nzd,
      tmpl.fx_rate,
      tmpl.pax ?? 0,
    );
    setSummary(sum);
  };

  const handleCreateTemplate = async () => {
    setCreating(true);
    try {
      const pax = bookingInfo.guests?.length ?? 2;
      const tmpl = await createTemplate(bookingId, {
        pax,
        rooms: Math.ceil(pax / 2),
        tour_code: bookingInfo.tourSlug?.toUpperCase() ?? null,
      });
      await loadTemplate();
    } catch (err) {
      setError("Failed to create costing template");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const recalculateAndUpdate = useCallback(
    async (updatedSections: SectionState[], tmpl: CostingTemplate) => {
      const supabase = createClient();

      // Recalculate all line items and update in DB
      for (const section of updatedSections) {
        for (const item of section.items) {
          const { total_net_nzd, total_gross_nzd } = recalculateLineItem(
            item,
            tmpl.pax ?? 0,
            tmpl.rooms ?? 0,
            tmpl.global_margin_pct,
          );
          if (
            total_net_nzd !== item.total_net_nzd ||
            total_gross_nzd !== item.total_gross_nzd
          ) {
            await supabase
              .from("costing_line_items")
              .update({ total_net_nzd, total_gross_nzd })
              .eq("id", item.id);
            item.total_net_nzd = total_net_nzd;
            item.total_gross_nzd = total_gross_nzd;
          }
        }
        const totals = calculateSectionTotals(section.items);
        section.subtotalNetNzd = totals.subtotal_net_nzd;
        section.subtotalGrossNzd = totals.subtotal_gross_nzd;
      }

      setSections([...updatedSections]);
      const grandTotals = calculateGrandTotals(
        updatedSections.map((s) => ({ subtotal_net_nzd: s.subtotalNetNzd, subtotal_gross_nzd: s.subtotalGrossNzd })),
      );
      const sum = calculateSummary(
        grandTotals.total_gross_nzd,
        grandTotals.total_net_nzd,
        tmpl.fx_rate,
        tmpl.pax ?? 0,
      );
      setSummary(sum);

      // Sync to booking record
      setSyncing(true);
      try {
        await supabase
          .from("bookings")
          .update({
            total_value_usd: sum.total_gross_usd,
            gross_margin_pct: sum.effective_margin_pct,
            cost_breakdown: {
              generated_at: new Date().toISOString(),
              template_id: tmpl.id,
              version: tmpl.version,
              sections: updatedSections.map((s) => ({
                name: s.name,
                subtotal_net_nzd: s.subtotalNetNzd,
                subtotal_gross_nzd: s.subtotalGrossNzd,
                items: s.items.map((i) => ({
                  day: i.day_number,
                  supplier: i.supplier_name,
                  service: i.service_description,
                  quote_type: i.quote_type,
                  qty: i.quantity,
                  unit_cost_nzd: i.unit_cost_nzd,
                  margin_pct: i.item_margin_pct,
                  total_net_nzd: i.total_net_nzd,
                  total_gross_nzd: i.total_gross_nzd,
                })),
              })),
              summary: sum,
            },
          })
          .eq("id", bookingId);

        // Log audit
        await fetch("/api/admin/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entityType: "booking",
            entityId: bookingId,
            action: "costing_synced",
            changes: { after: { total_value_usd: sum.total_gross_usd, gross_margin_pct: sum.effective_margin_pct } },
          }),
        });
      } catch (err) {
        console.error("Sync failed:", err);
      } finally {
        setSyncing(false);
      }

      router.refresh();
    },
    [bookingId],
  );

  const handleUpdateHeader = async (
    updates: Partial<Pick<CostingTemplate, "fx_rate" | "global_margin_pct" | "pax" | "rooms" | "grade" | "season" | "market" | "tour_code">>,
  ) => {
    if (!template) return;
    const supa = createClient();
    await supa.from("costing_templates").update(updates).eq("id", template.id);
    const updatedTmpl = { ...template, ...updates };
    setTemplate(updatedTmpl);

    // PAX/margin/FX changes require full recalculation
    if ("pax" in updates || "rooms" in updates || "global_margin_pct" in updates || "fx_rate" in updates) {
      await recalculateAndUpdate(sections, updatedTmpl);
    } else {
      updateSummary(sections, updatedTmpl);
    }
  };

  const handleAddItem = async (sectionId: string, input: CostingLineItemInput) => {
    if (!template) return;
    const supa = createClient();

    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const sortOrder = section.items.length;
    const { data, error } = await supa
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

    if (error) {
      console.error("Failed to add line item:", error);
      return;
    }

    // Recalculate this item
    const { total_net_nzd, total_gross_nzd } = recalculateLineItem(
      input,
      template.pax ?? 0,
      template.rooms ?? 0,
      template.global_margin_pct,
    );

    await supa
      .from("costing_line_items")
      .update({ total_net_nzd, total_gross_nzd })
      .eq("id", data.id);

    const newItem: CostingLineItem = {
      ...data,
      total_net_nzd,
      total_gross_nzd,
    } as CostingLineItem;

    const updatedSections = sections.map((s) => {
      if (s.id !== sectionId) return s;
      const items = [...s.items, newItem];
      const totals = calculateSectionTotals(items);
      return { ...s, items, ...totals };
    });

    await recalculateAndUpdate(updatedSections, template);
  };

  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    if (!template) return;
    const supa = createClient();
    await supa.from("costing_line_items").delete().eq("id", itemId);

    const updatedSections = sections.map((s) => {
      if (s.id !== sectionId) return s;
      const items = s.items.filter((i) => i.id !== itemId);
      const totals = calculateSectionTotals(items);
      return { ...s, items, ...totals };
    });

    await recalculateAndUpdate(updatedSections, template);
  };

  // ── Render ────────────────────────────────────────────

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 border border-warm-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-warm-100 rounded w-1/3" />
          <div className="h-8 bg-warm-50 rounded" />
          <div className="h-20 bg-warm-50 rounded" />
          <div className="h-8 bg-warm-50 rounded" />
        </div>
      </div>
    );
  }

  if (error && !template) {
    return (
      <div className="bg-white rounded-xl p-5 border border-warm-200">
        <p className="text-sm text-red-500 mb-3">{error}</p>
        <button
          onClick={loadTemplate}
          className="text-xs px-3 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state — no template exists
  if (!template) {
    return (
      <div className="bg-white rounded-xl p-5 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-3">
          Costing
        </h2>
        <p className="text-sm text-foreground-muted mb-4">
          No costing template exists for this booking yet. Create one to start building a tour
          cost breakdown.
        </p>
        <button
          onClick={handleCreateTemplate}
          disabled={creating}
          className="text-xs px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50"
        >
          {creating ? "Creating..." : "Build Costing"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Costing Header */}
      <CostingHeader
        template={template}
        onUpdate={handleUpdateHeader}
        disabled={syncing}
      />

      {/* Section Groups */}
      <CostingSectionGroup
        sections={sections}
        pax={template.pax}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
        disabled={syncing}
      />

      {/* Summary */}
      {summary && (
        <CostingSummaryCard
          summary={summary}
          fxRate={template.fx_rate}
          pax={template.pax}
        />
      )}

      {/* Sync indicator */}
      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span>
          {syncing ? "Syncing..." : "Changes auto-saved"}
        </span>
        <span>
          {template.updated_at &&
            `Last updated: ${new Date(template.updated_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
        </span>
      </div>
    </div>
  );
}
