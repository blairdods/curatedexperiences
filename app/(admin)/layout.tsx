import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow login page without auth
  // The login page is rendered inside this layout but doesn't need the sidebar
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-warm-50">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-auto">{children}</main>
    </div>
  );
}
