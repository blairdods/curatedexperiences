import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { JournalForm } from "@/components/admin/journal-form";

export default async function NewJournalArticlePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div>
      <BackLink href="/admin/content?tab=journal" label="Back to Journal Articles" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-6">
        New Article
      </h1>
      <JournalForm />
    </div>
  );
}
