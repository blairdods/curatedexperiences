import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow login page without auth
  if (!user) {
    return <>{children}</>;
  }

  const role = user.email ? await getUserRole(user.email) : null;

  // No role assigned — show access denied
  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-50">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-2xl text-navy mb-2">Access Denied</h1>
          <p className="text-sm text-foreground-muted mb-4">
            Your account ({user.email}) does not have admin access.
            Contact Tony or Liam to request access.
          </p>
          <form action="/admin/login" method="GET">
            <button className="px-4 py-2 text-sm bg-navy text-white rounded-lg hover:bg-navy-light transition-colors">
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-warm-50">
      <AdminSidebar role={role} />
      <main className="flex-1 p-6 sm:p-8 overflow-auto">{children}</main>
    </div>
  );
}
