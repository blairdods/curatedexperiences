import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { ContentForm } from "@/components/admin/content-form";

export default async function NewContentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div>
      <BackLink href="/admin/content" label="Back to Content" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-6">
        Add Knowledge Base Entry
      </h1>
      <ContentForm />
    </div>
  );
}
