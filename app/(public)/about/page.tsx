import { getImageSlotOverrides } from "@/lib/image-slot-settings";
import { getSlotImage } from "@/lib/image-slots";
import { AboutClient } from "./about-client";

export default async function AboutPage() {
  const imageSlots = await getImageSlotOverrides();
  const heroImage = getSlotImage(imageSlots, "page.about.hero");

  return <AboutClient heroImage={heroImage} />;
}
