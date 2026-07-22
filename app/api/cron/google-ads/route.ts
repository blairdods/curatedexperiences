import { NextResponse } from "next/server";
import { syncGoogleAds } from "@/lib/google-ads/sync";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (
    cronSecret &&
    request.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncGoogleAds(7);
  return NextResponse.json(result, {
    status: result.status === "error" ? 502 : 200,
  });
}
