import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { syncGoogleAds } from "@/lib/google-ads/sync";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRole(user.email);
  if (!role || !["admin", "analyst"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let daysBack = 30;
  try {
    const body = (await request.json()) as { daysBack?: number };
    if (typeof body.daysBack === "number") daysBack = body.daysBack;
  } catch {
    // The default range is used when no JSON body is supplied.
  }

  const result = await syncGoogleAds(daysBack);
  const status = result.status === "error" ? 502 : 200;
  return NextResponse.json(result, { status });
}
