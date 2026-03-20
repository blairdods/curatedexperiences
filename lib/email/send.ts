import { Resend } from "resend";
import { render } from "@react-email/components";
import { WelcomeEmail } from "./templates/welcome";
import { EmailLayout, BRAND } from "./templates/base-layout";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Curated Experiences <hello@curatedexperiences.com>";

/**
 * Send the welcome email when a visitor submits their email via the concierge.
 */
export async function sendWelcomeEmail(email: string, name?: string) {
  if (!process.env.RESEND_API_KEY) return;

  const html = await render(WelcomeEmail({ name }));

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: name
      ? `Welcome, ${name} — your New Zealand journey starts here`
      : "Welcome — your New Zealand journey starts here",
    html,
  });
}

/**
 * Send a nurture sequence email (raw HTML body wrapped in brand layout).
 */
export async function sendNurtureEmail(
  email: string,
  subject: string,
  bodyHtml: string
) {
  if (!process.env.RESEND_API_KEY) return;

  // Wrap the body HTML in the brand layout
  const fullHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background-color: #faf9f7; font-family: Georgia, 'Times New Roman', serif; margin: 0; padding: 0;">
  <div style="max-width: 580px; margin: 0 auto; padding: 40px 24px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <p style="font-size: 24px; color: ${BRAND.navy}; margin: 0; letter-spacing: -0.5px;">Curated Experiences</p>
      <p style="font-size: 11px; color: ${BRAND.warm500}; letter-spacing: 2px; text-transform: uppercase; margin: 4px 0 0;">Luxury New Zealand Travel</p>
    </div>
    <div style="font-size: 15px; color: ${BRAND.foreground}; line-height: 1.7;">
      ${bodyHtml}
    </div>
    <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid ${BRAND.warm200}; text-align: center;">
      <p style="font-size: 12px; color: ${BRAND.warm500}; margin: 0 0 8px;">Curated Experiences — A PPG Tours Venture</p>
      <p style="font-size: 11px; color: ${BRAND.warm500}; margin: 0 0 4px;">
        <a href="https://curatedexperiences.com" style="color: ${BRAND.warm500};">curatedexperiences.com</a>
      </p>
      <p style="font-size: 11px; color: ${BRAND.warm500}; margin: 0;">
        <a href="mailto:hello@curatedexperiences.com?subject=Unsubscribe" style="color: ${BRAND.warm500};">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html: fullHtml,
  });
}
