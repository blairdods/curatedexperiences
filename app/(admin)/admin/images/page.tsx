import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { ImageSlotsEditor } from "@/components/admin/image-slots-editor";
import {
  IMAGE_SLOT_SETTING_KEY,
  parseImageSlotOverrides,
} from "@/lib/image-slots";

export default async function ImagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const serviceSupabase = await createServiceClient();
  const { data: setting } = await serviceSupabase
    .from("settings")
    .select("value, updated_by, updated_at")
    .eq("key", IMAGE_SLOT_SETTING_KEY)
    .maybeSingle();

  return (
    <div>
      <h1 className="font-serif text-2xl tracking-tight text-navy">
        Website Images
      </h1>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-foreground-muted">
        Control homepage hero variants, homepage section imagery, and key static
        page images. Empty slots use the committed fallback image; saved slots
        take effect without a code deploy.
      </p>

      <div className="mt-8">
        <ImageSlotsEditor
          initialOverrides={parseImageSlotOverrides(setting?.value)}
          updatedBy={setting?.updated_by}
          updatedAt={setting?.updated_at}
        />
      </div>
    </div>
  );
}
