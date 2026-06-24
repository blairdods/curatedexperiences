import { createServiceClient } from "@/lib/supabase/server";
import {
  IMAGE_SLOT_SETTING_KEY,
  parseImageSlotOverrides,
  type ImageSlotOverrides,
} from "@/lib/image-slots";

export async function getImageSlotOverrides(): Promise<ImageSlotOverrides> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", IMAGE_SLOT_SETTING_KEY)
      .maybeSingle();

    if (error) return {};
    return parseImageSlotOverrides(data?.value);
  } catch {
    return {};
  }
}
