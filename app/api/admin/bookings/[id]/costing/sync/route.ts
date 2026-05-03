import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { logAudit } from "@/lib/audit/log";
import {
  recalculateLineItem,
  calculateSectionTotals,
  calculateGrandTotals,
  calculateSummary,
} from "@/lib/costing/calculate";
import type { CostingTemplate, CostingLineItem } from "@/lib/costing/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.email);
    if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id: bookingId } = await params;
    const serviceSupabase = await createServiceClient();

    // Fetch latest template with sections and line items
    const { data: tmplRow } = await serviceSupabase
      .from("costing_templates")
      .select("*, costing_sections(*, costing_line_items(*))")
      .eq("booking_id", bookingId)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!tmplRow) {
      return NextResponse.json({ error: "No costing template found" }, { status: 404 });
    }

    const template = tmplRow as unknown as CostingTemplate & {
      costing_sections: Array<{
        id: string;
        name: string;
        costing_line_items: CostingLineItem[];
      }>;
    };

    // Recalculate all line items
    const pax = template.pax ?? 0;
    const rooms = template.rooms ?? 0;
    const globalMargin = template.global_margin_pct;

    for (const section of template.costing_sections) {
      for (const item of section.costing_line_items) {
        const { total_net_nzd, total_gross_nzd } = recalculateLineItem(
          item,
          pax,
          rooms,
          globalMargin,
        );

        if (
          total_net_nzd !== item.total_net_nzd ||
          total_gross_nzd !== item.total_gross_nzd
        ) {
          await serviceSupabase
            .from("costing_line_items")
            .update({ total_net_nzd, total_gross_nzd })
            .eq("id", item.id);
          item.total_net_nzd = total_net_nzd;
          item.total_gross_nzd = total_gross_nzd;
        }
      }
    }

    // Calculate totals
    const sectionTotals = template.costing_sections.map((s) =>
      calculateSectionTotals(s.costing_line_items),
    );
    const grandTotals = calculateGrandTotals(sectionTotals);
    const summary = calculateSummary(
      grandTotals.total_gross_nzd,
      grandTotals.total_net_nzd,
      template.fx_rate,
      pax,
    );

    // Build cost_breakdown snapshot
    const cost_breakdown = {
      generated_at: new Date().toISOString(),
      template_id: template.id,
      version: template.version,
      sections: template.costing_sections.map((s, i) => ({
        name: s.name,
        subtotal_net_nzd: sectionTotals[i].subtotal_net_nzd,
        subtotal_gross_nzd: sectionTotals[i].subtotal_gross_nzd,
        items: s.costing_line_items.map((item) => ({
          day: item.day_number,
          supplier: item.supplier_name,
          service: item.service_description,
          quote_type: item.quote_type,
          qty: item.quantity,
          unit_cost_nzd: item.unit_cost_nzd,
          margin_pct: item.item_margin_pct,
          total_net_nzd: item.total_net_nzd,
          total_gross_nzd: item.total_gross_nzd,
        })),
      })),
      summary,
    };

    // Update booking record
    const { error: updateError } = await serviceSupabase
      .from("bookings")
      .update({
        total_value_usd: summary.total_gross_usd,
        gross_margin_pct: summary.effective_margin_pct,
        cost_breakdown,
      })
      .eq("id", bookingId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Audit log
    await logAudit({
      entityType: "booking",
      entityId: bookingId,
      action: "costing_synced",
      changes: {
        after: {
          total_value_usd: summary.total_gross_usd,
          gross_margin_pct: summary.effective_margin_pct,
        },
      },
      userEmail: user.email,
    });

    return NextResponse.json({ success: true, summary });
  } catch (err) {
    console.error("Costing sync error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
