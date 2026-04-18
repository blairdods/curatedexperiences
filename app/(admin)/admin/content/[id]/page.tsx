import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { ContentForm } from "@/components/admin/content-form";
import { ContentVersionHistory } from "@/components/admin/content-version-history";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const serviceSupabase = await createServiceClient();

  const { data: content } = await serviceSupabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single();

  if (!content) notFound();

  const { data: versions } = await serviceSupabase
    .from("content_versions")
    .select("*")
    .eq("content_id", id)
    .order("version", { ascending: false });

  return (
    <div>
      <BackLink href="/admin/content" label="Back to Content" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-6">
        Edit Content
      </h1>
      <ContentForm
        initialData={{
          id: content.id,
          type: content.type ?? "general",
          title: content.title ?? "",
          body: content.body ?? "",
          region_tags: content.region_tags ?? [],
          status: content.status ?? "active",
          source_type: content.source_type,
        }}
      />
      <div className="mt-8 max-w-3xl">
        <ContentVersionHistory contentId={id} versions={versions ?? []} />
      </div>
    </div>
  );
}
