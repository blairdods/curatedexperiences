import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAssets } from "@/lib/asset-library";
import { getUploadedAssets } from "@/lib/asset-library/uploaded";
import { getUserRole } from "@/lib/auth/roles";
import { AssetLibraryClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AssetLibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");

  const [uploadedAssets, role] = await Promise.all([
    getUploadedAssets(),
    getUserRole(user.email),
  ]);
  const assets = [...uploadedAssets, ...getAssets()];

  const regions = [...new Set(assets.map((a) => a.region).filter(Boolean))].sort();
  const licences = [...new Set(assets.map((a) => a.licence).filter(Boolean))].sort();
  const fileTypes = [...new Set(assets.map((a) => a.fileType).filter(Boolean))].sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Asset Library</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          {assets.length.toLocaleString()} platform images ·{" "}
          {assets.filter((a) => a.thumbnailSrc || a.publicSrc).length.toLocaleString()} with preview · search by location, tags, or rights
        </p>
      </div>
      <AssetLibraryClient
        initialAssets={assets}
        facets={{ regions, licences, fileTypes }}
        canUpload={role === "admin"}
      />
    </div>
  );
}
