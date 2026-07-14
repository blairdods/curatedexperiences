import { revalidatePath } from "next/cache";

export function revalidateJournal(slug: string) {
  revalidatePath("/journal");
  revalidatePath(`/journal/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}
