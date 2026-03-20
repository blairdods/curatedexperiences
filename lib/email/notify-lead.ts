import { Resend } from "resend";
import type { ConciergeBrief } from "@/lib/claude/extract-brief";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAILS = ["tony@curatedexperiences.com", "liam@curatedexperiences.com"];
const FROM_EMAIL = "concierge@curatedexperiences.com";

export async function notifyNewLead(brief: ConciergeBrief, enquiryId: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping lead notification");
    return;
  }

  const intentLabel =
    brief.intent_score >= 7
      ? "🔥 High Intent"
      : brief.intent_score >= 4
        ? "⚡ Active Planning"
        : "🌱 Early Research";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAILS,
      subject: `${intentLabel} — New concierge lead${brief.name ? `: ${brief.name}` : ""}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #1F3864; margin-bottom: 4px;">New Concierge Lead</h2>
          <p style="color: #888; margin-top: 0;">${intentLabel} — Score: ${brief.intent_score}/10</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${brief.name ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6; color: #888; width: 140px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6;">${brief.name}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6; color: #888;">Interests</td><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6;">${brief.interests.join(", ") || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6; color: #888;">Journey type</td><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6;">${brief.journey_type_pref}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6; color: #888;">Travel dates</td><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6;">${brief.travel_dates || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6; color: #888;">Group</td><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6;">${brief.group_size ? `${brief.group_size} people` : "Not specified"} ${brief.group_composition ? `(${brief.group_composition})` : ""}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6; color: #888;">Budget signal</td><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6;">${brief.budget_signal}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6; color: #888;">Regions</td><td style="padding: 8px 0; border-bottom: 1px solid #e8dfd6;">${brief.regions_mentioned.join(", ") || "Not specified"}</td></tr>
          </table>

          <div style="background: #f5f0eb; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 4px; color: #888; font-size: 13px;">AI Brief</p>
            <p style="margin: 0;">${brief.ai_brief}</p>
          </div>

          <p style="color: #888; font-size: 13px;">
            <a href="https://curatedexperiences.com/admin/leads" style="color: #1F3864;">View in dashboard</a>
            — Enquiry ID: ${enquiryId}
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send lead notification:", err);
  }
}
