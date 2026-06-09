import { NextResponse } from "next/server";
import { syncAll } from "@/lib/analytics/ga4";
import * as fs from "fs";
import * as path from "path";

async function handler(request: Request, defaultDaysBack: number = 7) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let daysBack = defaultDaysBack;
  if (request.method === "POST") {
    try {
      const body = await request.json();
      if (body.daysBack && typeof body.daysBack === "number") {
        daysBack = Math.min(Math.max(body.daysBack, 1), 365);
      }
    } catch {}
  }

  const result = await syncAll(daysBack);

  if (result.migrationNote) {
    const migrationSql = fs.readFileSync(
      path.join(process.cwd(), "supabase/migrations/00020_ga4_analytics.sql"),
      "utf8"
    );
    return NextResponse.json({
      ...result,
      migrationSql,
      setupUrl:
        "https://supabase.com/dashboard/project/bwpbvdmdwjqguiliymnq/sql/new",
    });
  }

  return NextResponse.json(result);
}

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request, 7);
}
