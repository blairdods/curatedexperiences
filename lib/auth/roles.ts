import { createServiceClient } from "@/lib/supabase/server";

export type Role = "admin" | "curator" | "analyst";

export async function getUserRole(email: string): Promise<Role | null> {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("email", email)
    .single();

  return (data?.role as Role) ?? null;
}

export async function requireRole(
  email: string,
  allowedRoles: Role[]
): Promise<Role> {
  const role = await getUserRole(email);
  if (!role || !allowedRoles.includes(role)) {
    throw new Error("Insufficient permissions");
  }
  return role;
}

export function canManageEntity(
  role: Role,
  assignedTo: string | null,
  email: string
): boolean {
  if (role === "admin") return true;
  if (role === "curator") return assignedTo === email || assignedTo === null;
  return false;
}
