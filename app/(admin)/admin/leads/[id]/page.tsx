import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { LeadDetail } from "@/components/admin/lead-detail";
import { StatusBadge } from "@/components/admin/ui/status-badge";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const serviceSupabase = await createServiceClient();

  const { data: lead } = await serviceSupabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (!lead) notFound();

  // Check if a booking already exists for this lead
  const { data: existingBooking } = await serviceSupabase
    .from("bookings")
    .select("id")
    .eq("enquiry_id", id)
    .limit(1);

  const hasBooking = (existingBooking?.length ?? 0) > 0;

  return (
    <div>
      <BackLink href="/admin/leads" label="Back to Leads" />

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="font-serif text-2xl text-navy tracking-tight">
            {lead.name || lead.email || "Anonymous Lead"}
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            {lead.email}
            {lead.phone ? ` · ${lead.phone}` : ""}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <LeadDetail lead={lead} hasBooking={hasBooking} />
    </div>
  );
}
