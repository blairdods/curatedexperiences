import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAssets, searchAssets } from "@/lib/asset-library";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? "";
  const region = searchParams.get("region") ?? "";
  const licence = searchParams.get("licence") ?? "";
  const fileType = searchParams.get("fileType") ?? "";
  const paidAdsOkParam = searchParams.get("paidAdsOk");
  const paidAdsOk = paidAdsOkParam === "true" ? true : paidAdsOkParam === "false" ? false : undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 60;

  const all = getAssets();
  const filtered = searchAssets(all, { q, region, licence, paidAdsOk, fileType });

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const items = filtered.slice((page - 1) * perPage, page * perPage);

  // Send facets from the full filtered result (pre-pagination) for the filter UI
  const regions = [...new Set(all.map((a) => a.region).filter(Boolean))].sort();
  const licences = [...new Set(all.map((a) => a.licence).filter(Boolean))].sort();
  const fileTypes = [...new Set(all.map((a) => a.fileType).filter(Boolean))].sort();

  return NextResponse.json({
    items,
    total,
    page,
    totalPages,
    perPage,
    facets: { regions, licences, fileTypes },
  });
}
