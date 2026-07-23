import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getUserRole } from "@/lib/auth/roles";
import { IMAGE_SLOT_SETTING_KEY } from "@/lib/image-slots";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRole(user.email);
  if (!role || !["admin", "curator"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    key?: unknown;
    value?: unknown;
  };
  if (
    typeof body.key !== "string" ||
    !body.key.trim() ||
    typeof body.value !== "string"
  ) {
    return NextResponse.json(
      { error: "A setting key and string value are required" },
      { status: 400 }
    );
  }
  if (role === "curator" && body.key !== IMAGE_SLOT_SETTING_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const serviceSupabase = await createServiceClient();
  const { error } = await serviceSupabase.from("settings").upsert(
    {
      key: body.key,
      value: body.value,
      updated_by: user.email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
