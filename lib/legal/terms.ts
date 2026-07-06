import { createServiceClient } from "@/lib/supabase/server";

export const TERMS_EFFECTIVE_DATE_SETTING_KEY = "terms_page_effective_date";
export const TERMS_CONTENT_SETTING_KEY = "terms_page_content";

export const DEFAULT_TERMS_EFFECTIVE_DATE = "1 June 2026";

export const DEFAULT_TERMS_MARKDOWN = `## 1. About These Terms

These Terms and Conditions govern all bookings made with Curated Experiences™, a trading name of PPG Tours Limited, a company registered in New Zealand. By making a booking with us — whether by phone, email, or through our website — you agree to be bound by these terms on behalf of yourself and all members of your travelling party.

References to “we”, “us”, and “our” mean Curated Experiences™. References to “you” mean the lead booker and all members of your party.

## 2. Your Booking

A booking is confirmed once we have received your deposit (see Section 4) and issued a written Booking Confirmation. Until that point, any itinerary, pricing, or availability we share with you is provisional and subject to change.

The lead booker (or designated Tour Leader/Main contact) is responsible for ensuring that all members of the travelling party are aware of and agree to these terms, and for the accuracy of all personal information provided to us.

We reserve the right to decline a booking at our discretion, in which case any deposit received will be refunded in full.

## 3. Pricing & Currency

All prices are quoted in New Zealand Dollars (NZD) and include GST (15%) unless otherwise stated in your written proposal. Prices are based on costs, exchange rates, and supplier tariffs current at the time of quotation.

We reserve the right to pass on any price increases from our suppliers or significant adverse exchange rate movements prior to full payment being received. We will notify you as soon as possible if any such increase applies to your booking.

Once full payment has been received, the price of your journey is guaranteed, except in the case of government-imposed taxes, levies, or fuel surcharges outside our control.

Unless specifically stated in your itinerary or Booking Confirmation, prices do not include international or domestic airfares, passport or visa costs, travel authorisations, baggage charges, travel insurance, personal expenses, gratuities, beverages, laundry, telecommunications, optional activities or any other items not expressly included in your itinerary.

## 4. Deposit & Payment

To confirm a booking, a deposit of **25% of the total journey price** is required. The deposit is non-refundable except where we are required to cancel your journey (see Section 6).

**Final payment** of the remaining balance is due **90 days before your departure date**. For bookings made within 90 days of departure, full payment is required at the time of booking.

### All year except any travel between 15 December – 06 January

Balance payment is due no later than 91 days prior to the date of arrival in New Zealand. For bookings made within 91 days of departure, full payment is required at the time of booking.

### All travel between 15 December – 06 January

Balance payment is due no later than 14 August. Where a booking is made after 14 August, the full payment is required at the time of booking.

If final payment is not received by the due date, we reserve the right to treat the booking as cancelled and apply the cancellation charges set out in Section 5.

Payment may be made by bank transfer or by arrangement with our team. Details will be provided in your Booking Confirmation.

## 5. Cancellation by You

All cancellations must be made in writing to [enquiries@curatedexperiences.com](mailto:enquiries@curatedexperiences.com). Cancellation takes effect on the date we receive your written notice. The following charges apply, calculated as a percentage of the total journey price:

### All year except any travel between 15 December – 06 January

- Received outside 91 days prior to date of travel: client will forfeit the deposit together with any prepaid supplier charges that are unable to be recovered.
- Received 91 to 47 days prior to date of travel: client will forfeit their deposit and 100% of accommodation cost.
- Received within 46 days of travel: client will forfeit 100% of itinerary cost.

### All travel between 15 December – 06 January

- Received before 14 August: client will forfeit the deposit together with any prepaid supplier charges that are unable to be recovered.
- From 15 August: client will forfeit their deposit and 100% of accommodation cost.
- Received within 46 days of travel: client will forfeit 100% of itinerary cost.

We strongly recommend taking out comprehensive travel insurance that includes cancellation cover (see Section 9).

## 6. Changes or Cancellation by Us

We plan every journey with great care, but occasionally circumstances beyond our control require us to make changes.

**Minor changes** — such as substituting an equivalent lodge, adjusting activity timing, or reordering itinerary days — may be made without liability on our part. We will always notify you as soon as possible and endeavour to maintain the spirit and quality of your original programme.

**Significant changes** — such as a change to the main destination regions or a material reduction in the quality of accommodation — will be notified to you in writing. You will then have the option to accept the revised journey, accept an alternative journey of comparable value, or cancel with a full refund.

In the unlikely event that we must cancel your journey due to circumstances within our control, you will receive a full refund of all payments made to us. We will not be liable for any further costs or compensation beyond this refund.

Bookings are non-transferable and may not be assigned to another person without our prior written consent. Any approved transfer may be subject to supplier approval, amendment fees, and any additional costs incurred.

## 7. Changes Requested by You

We understand that plans evolve. We will do our best to accommodate any changes you request after a booking is confirmed, subject to supplier availability. An administration fee of NZD $250 including GST per change may apply, in addition to any costs imposed by suppliers.

Changes that significantly alter the nature of your journey may be treated as a cancellation and rebooking, in which case the cancellation charges in Section 5 may apply.

## 8. Force Majeure

We will not be liable for any failure to perform, or delay in performing, our obligations where such failure or delay results from circumstances beyond our reasonable control. This includes, but is not limited to: natural disasters, extreme weather, pandemic or public health events, civil unrest, acts of terrorism, government action, or industrial disputes.

In such circumstances, we will use all reasonable endeavours to offer alternative arrangements or, where this is not possible, provide a refund of recoverable amounts from our suppliers. We will not be responsible for any additional costs you incur, such as airfares or accommodation, as a result of a force majeure event — which is another reason comprehensive travel insurance is essential.

## 9. Travel Insurance

Comprehensive travel insurance is a **condition of booking** with Curated Experiences.

Your policy must include, as a minimum:

- Trip cancellation and curtailment
- Emergency medical expenses and evacuation
- Baggage and personal effects
- Personal liability

We recommend taking out insurance at the time of paying your deposit so that cancellation cover begins immediately. We are happy to recommend insurance providers if you require guidance.

We will not be responsible for any costs you incur as a result of failing to hold adequate travel insurance.

## 10. Passports, Visas & Health Requirements

It is your responsibility to ensure that all members of your party hold valid passports (with at least six months' validity beyond your return date) and any visas or travel authorisations required to enter New Zealand and any other countries visited during your journey. We with share with you a pre arrival form / document that will get sent out to the main contact prior to travel showing requirements like how to apply for an NZeTA, as well as recommendations and other relevant New Zealand Travel information.

We are not responsible for any costs, losses, or disruption arising from failure to obtain the correct travel documents. We recommend checking with the relevant embassy or consulate well in advance of travel.

You are also responsible for ensuring you meet any health or vaccination requirements applicable to your destination. Please consult your doctor or a travel health clinic before travel.

## 11. Our Responsibilities & Liability

We act as a principal in arranging your journey and take responsibility for the overall quality and delivery of the programme we design for you. We will always endeavour to deliver your journey as described and to the standard you expect.

Our liability to you is limited to the total cost of your journey as paid to us. We are not liable for any indirect or consequential loss, including but not limited to lost profits, loss of enjoyment, or costs arising from delays or changes to your travel arrangements caused by third-party suppliers, force majeure events, or circumstances outside our reasonable control.

Curated Experiences shall not be responsible for the insolvency, liquidation, financial failure, or cessation of trading of any third-party supplier. Where recoveries are obtained from suppliers in such circumstances, we will pass on any recoverable amounts received, less any unrecoverable costs already incurred.

Nothing in these terms limits our liability for death, personal injury, or fraud caused by our negligence, or for any other liability that cannot lawfully be excluded.

Where you purchase services directly from third-party suppliers (such as optional activities booked locally), those suppliers are solely responsible for the delivery of those services.

## 12. Your Responsibilities

You are responsible for the behaviour of all members of your travelling party. We and our suppliers reserve the right to terminate a journey without refund if any member of your party behaves in a way that is disruptive, dangerous, or harmful to others.

Please inform us at the time of booking of any medical conditions, mobility requirements, dietary needs, or other circumstances that may affect your journey. We will do our best to accommodate your needs, but cannot guarantee that all requests can be fulfilled.

## 13. Privacy

We collect and hold personal information about you to facilitate your booking and to deliver the services you have requested. We will not sell or share your personal information with third parties except where necessary to deliver your journey (for example, providing your details to lodges, transport providers, and activity operators).

We comply with the New Zealand Privacy Act 2020. You have the right to access and correct any personal information we hold about you. To make a request, please contact us at [enquiries@curatedexperiences.com](mailto:enquiries@curatedexperiences.com).

## 14. Intellectual Property

Curated Experiences™ is a registered trademark in Australia and New Zealand. All itineraries, proposals, content, and materials produced by us remain our intellectual property and may not be reproduced or shared without our written consent.

## 15. Complaints

If something is not right during your journey, please contact your travel curator (different term used above) immediately so we have the opportunity to resolve the issue on the ground. Issues raised after your return that were not raised during travel may be more difficult to address.

If you wish to make a formal complaint after your return, please write to us at [enquiries@curatedexperiences.com](mailto:enquiries@curatedexperiences.com) within 28 days of your return date. We will acknowledge your complaint within 5 business days and aim to resolve it within 28 days.

## 16. Governing Law

These terms are governed by the laws of New Zealand. Any dispute arising in connection with a booking will be subject to the exclusive jurisdiction of the New Zealand courts.

Nothing in these terms affects any rights you may have under the New Zealand Consumer Guarantees Act 1993 or the Fair Trading Act 1986 where those rights cannot lawfully be excluded.

## 17. Contact Us

If you have any questions about these terms, please get in touch:

**Curated Experiences™**

A venture of PPG Tours Limited

Email: [enquiries@curatedexperiences.com](mailto:enquiries@curatedexperiences.com)

Phone: [0800 287 283](tel:0800287283)`;

export type TermsPageContent = {
  effectiveDate: string;
  html: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+|mailto:[^)]+|tel:[^)]+|\/[^)]+|#[^)]+)\)/g,
      '<a href="$2">$1</a>'
    );
}

export function markdownToTermsHtml(markdown: string) {
  const blocks: string[] = [];
  const listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(`<ul>${listItems.join("")}</ul>`);
    listItems.length = 0;
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push(`<h2>${formatInlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      blocks.push(`<h3>${formatInlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(`<li>${formatInlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    flushList();
    blocks.push(`<p>${formatInlineMarkdown(line)}</p>`);
  }

  flushList();
  return blocks.join("\n");
}

export function sanitizeTermsHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<\/?(?:html|body|head|meta|link|object|embed|form|input|button|textarea|select|option|label|svg|math)[^>]*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(
      /<a\b([^>]*)href\s*=\s*(['"]?)([^'"\s>]+)\2([^>]*)>/gi,
      (_match, _before, _quote, href: string) => {
        const safeHref = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href)
          ? href
          : "#";
        return `<a href="${escapeHtml(safeHref)}">`;
      }
    );
}

function resolveTermsHtml(value?: string | null) {
  const content = value?.trim();
  if (!content) return sanitizeTermsHtml(markdownToTermsHtml(DEFAULT_TERMS_MARKDOWN));
  if (/<[a-z][\s\S]*>/i.test(content)) return sanitizeTermsHtml(content);
  return sanitizeTermsHtml(markdownToTermsHtml(content));
}

export async function getTermsPageContent(): Promise<TermsPageContent> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [TERMS_EFFECTIVE_DATE_SETTING_KEY, TERMS_CONTENT_SETTING_KEY]);

    if (error) {
      return {
        effectiveDate: DEFAULT_TERMS_EFFECTIVE_DATE,
        html: resolveTermsHtml(),
      };
    }

    const settings = Object.fromEntries(
      (data ?? []).map((setting) => [setting.key, setting.value])
    );

    return {
      effectiveDate:
        settings[TERMS_EFFECTIVE_DATE_SETTING_KEY]?.trim() ||
        DEFAULT_TERMS_EFFECTIVE_DATE,
      html: resolveTermsHtml(settings[TERMS_CONTENT_SETTING_KEY]),
    };
  } catch {
    return {
      effectiveDate: DEFAULT_TERMS_EFFECTIVE_DATE,
      html: resolveTermsHtml(),
    };
  }
}
