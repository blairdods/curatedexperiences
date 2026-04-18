import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getSequence } from "@/lib/email/sequences";
import { sendNurtureEmail } from "@/lib/email/send";

/**
 * POST /api/nurture
 *
 * Processes the nurture email queue. Called by a cron job (Vercel Cron or external).
 * Reads email templates from DB (email_templates table), falling back to
 * hardcoded sequences if DB is empty.
 *
 * Auth: Requires CRON_SECRET header to prevent unauthorized calls.
 */

interface DbTemplate {
  subject: string;
  preview_text: string | null;
  body_html: string;
  delay_days: number;
}

async function getSequenceFromDb(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  sequenceType: string
): Promise<DbTemplate[] | null> {
  const { data } = await supabase
    .from("email_templates")
    .select("subject, preview_text, body_html, delay_days")
    .eq("sequence_type", sequenceType)
    .eq("active", true)
    .order("step_index", { ascending: true });

  if (data && data.length > 0) return data;
  return null;
}

async function handleNurture(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();

  // Fetch enquiries with active nurture sequences
  const { data: enquiries, error } = await supabase
    .from("enquiries")
    .select("id, email, name, intent_score, nurture_sequence, created_at")
    .not("email", "is", null)
    .not("nurture_sequence", "is", null)
    .in("status", ["new", "nurturing"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const enquiry of enquiries ?? []) {
    if (!enquiry.email || !enquiry.intent_score) {
      skipped++;
      continue;
    }

    // Try DB templates first, fall back to hardcoded
    const seqType = enquiry.intent_score >= 7 ? "high_intent" : "mid_intent";
    const dbTemplates = await getSequenceFromDb(supabase, seqType);
    const sequence = dbTemplates
      ? dbTemplates.map((t) => ({
          delayDays: t.delay_days,
          subject: t.subject,
          previewText: t.preview_text ?? "",
          bodyHtml: t.body_html,
        }))
      : getSequence(enquiry.intent_score);

    if (!sequence) {
      skipped++;
      continue;
    }

    // Parse nurture state: "high:2" means high-intent sequence, email index 2 sent
    const [, lastSentStr] = (enquiry.nurture_sequence ?? ":0").split(":");
    const lastSentIndex = parseInt(lastSentStr) || 0;
    const nextIndex = lastSentIndex === 0 && !enquiry.nurture_sequence?.includes(":")
      ? 0
      : lastSentIndex + 1;

    if (nextIndex >= sequence.length) {
      // Sequence complete — update status
      await supabase
        .from("enquiries")
        .update({ nurture_sequence: null })
        .eq("id", enquiry.id);
      skipped++;
      continue;
    }

    const nextEmail = sequence[nextIndex];
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(enquiry.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Check if it's time to send
    if (daysSinceCreated < nextEmail.delayDays) {
      skipped++;
      continue;
    }

    try {
      await sendNurtureEmail(enquiry.email, nextEmail.subject, nextEmail.bodyHtml);

      const prefix = enquiry.intent_score >= 7 ? "high" : "mid";
      await supabase
        .from("enquiries")
        .update({
          nurture_sequence: `${prefix}:${nextIndex}`,
          last_contact_at: new Date().toISOString(),
        })
        .eq("id", enquiry.id);

      sent++;
    } catch (err) {
      console.error(`Failed to send nurture email to ${enquiry.email}:`, err);
      skipped++;
    }
  }

  return NextResponse.json({ sent, skipped, total: enquiries?.length ?? 0 });
}

// Vercel Cron sends GET requests
export async function GET(request: Request) {
  return handleNurture(request);
}

// Manual/external triggers can use POST
export async function POST(request: Request) {
  return handleNurture(request);
}
