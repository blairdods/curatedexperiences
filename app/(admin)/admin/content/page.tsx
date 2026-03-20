import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ContentQueue } from "@/components/admin/content-queue";

export default async function ContentApprovalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: pending } = await supabase
    .from("content")
    .select("*")
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  const { data: recent } = await supabase
    .from("content")
    .select("*")
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(10);

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">
        Content
      </h1>
      <p className="text-sm text-foreground-muted mt-1">
        {pending?.length ?? 0} pending approval
      </p>

      {/* Pending approval */}
      <div className="mt-6">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Pending Approval
        </h2>
        <ContentQueue items={pending ?? []} />
      </div>

      {/* Recently published */}
      <div className="mt-10">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Recently Published
        </h2>
        <div className="space-y-2">
          {(recent ?? []).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-warm-200"
            >
              <div>
                <p className="text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-foreground-muted">
                  {item.type} — approved by {item.approved_by ?? "system"}
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                Active
              </span>
            </div>
          ))}
          {(!recent || recent.length === 0) && (
            <p className="text-sm text-foreground-muted text-center py-8">
              No published content yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
