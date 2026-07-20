import { createServiceClient } from "@/lib/supabase/server";
import {
  markdownToTermsHtml,
  sanitizeTermsHtml,
} from "@/lib/legal/terms";

export const PRIVACY_EFFECTIVE_DATE_SETTING_KEY =
  "privacy_page_effective_date";
export const PRIVACY_CONTENT_SETTING_KEY = "privacy_page_content";

export const DEFAULT_PRIVACY_EFFECTIVE_DATE = "20 July 2026";

export const DEFAULT_PRIVACY_MARKDOWN = `**Curated Experiences™** ("we", "our", or "us") is committed to protecting your privacy and handling your personal information in accordance with the **Privacy Act 2020 (New Zealand)**.

Personal information is any information about an identifiable individual.

This Privacy Policy explains how we collect, use, disclose, store and protect your personal information when you visit our website, contact us or use our travel planning and concierge services.

This Privacy Policy does not limit or exclude any of your rights under the Privacy Act 2020. For more information about your privacy rights, please visit the Office of the Privacy Commissioner at **[www.privacy.org.nz](https://www.privacy.org.nz/)**.

By using our website or engaging our services, you agree to the collection and use of your personal information as described in this Privacy Policy.

## Changes to this Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be published on this page and will take effect from the date the revised policy is posted. We encourage you to review this page periodically to stay informed about how we protect your information.

## Information We Collect

Depending on the services you request, we may collect personal information including:

- Your name
- Email address
- Telephone number
- Postal or billing address
- Travel preferences and itinerary requirements
- Passport details (where required for travel bookings)
- Visa information (where required)
- Date of birth (where required by travel providers)
- Emergency contact details
- Dietary, medical or accessibility information that you choose to provide where necessary to arrange your travel
- Travel insurance information where required
- Payment information (payments are processed securely through third-party payment providers and we do not store your full credit card details)
- Communications you send to us
- Information collected automatically through cookies and website analytics, including your IP address, browser type, device information and pages visited

## How We Collect Your Information

We collect personal information directly from you when you:

- Submit an enquiry through our website
- Request a consultation or quotation
- Make or confirm a booking
- Subscribe to our newsletter
- Contact us by phone, email or social media
- Complete forms or surveys
- Use our website

We may also collect personal information from third parties where:

- You have authorised us to do so;
- It is necessary to provide our travel planning and booking services (for example, from travel suppliers or booking partners); or
- The information is publicly available.

Where reasonably practicable, we will collect your personal information directly from you.

## How We Use Your Personal Information

We use your personal information to:

- Verify your identity where necessary.
- Respond to your enquiries and requests.
- Prepare personalised travel proposals and quotations.
- Arrange and manage your travel bookings.
- Coordinate travel with accommodation providers, transport companies, tour operators and other travel suppliers.
- Provide personalised travel recommendations and concierge services.
- Process payments and manage billing.
- Communicate booking confirmations, itinerary updates and important travel information.
- Send you marketing communications, travel inspiration and special offers where you have agreed to receive them or where permitted by law. You may unsubscribe at any time.
- Protect and enforce our legal rights and interests.
- Comply with our legal and regulatory obligations.
- Carry out any other purpose authorised by you or permitted under the Privacy Act 2020.

## Travel Information

To arrange your travel, we may need to collect information such as passport details, visa information, travel insurance details, emergency contacts, dietary requirements, medical information relevant to your travel, mobility or accessibility needs, or other information necessary to provide the services you request.

We only collect this information where it is reasonably necessary to arrange and manage your travel. Where required, this information may be shared only with accommodation providers, transport companies, tour operators and other suppliers involved in delivering your itinerary.

## Sharing Your Information

We may disclose your personal information to:

- Accommodation providers, tour operators, transport companies and other travel suppliers involved in your booking.
- Payment processing providers.
- Professional advisers including accountants, legal advisers and insurers where necessary.
- IT service providers, website hosting providers and businesses that support our systems and services.
- Regulatory authorities or government agencies where required by law.
- Law enforcement agencies where authorised or required by law.
- Any other person or organisation where you have authorised us to do so.

We only disclose the information that is reasonably necessary for the relevant purpose.

## Cookies and Website Analytics

Our website uses cookies and similar technologies to:

- Improve website functionality.
- Remember your preferences.
- Analyse website traffic and visitor behaviour.
- Improve your browsing experience.
- Measure the effectiveness of our marketing.

You may disable cookies through your browser settings. Please note that some features of our website may not function correctly if cookies are disabled.

## Data Security

We take reasonable technical, administrative and organisational measures to protect your personal information from loss, misuse, unauthorised access, alteration or disclosure.

While we take reasonable precautions to safeguard your information, no method of transmitting information over the internet or storing electronic information is completely secure. Any information you transmit electronically is provided at your own risk.

## How Long We Keep Your Information

We retain your personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes and enforce our agreements.

## Accessing and Correcting Your Information

Under the Privacy Act 2020, you have the right to request access to the personal information we hold about you and to request correction of any inaccurate information.

Before processing your request, we may ask you to verify your identity.

If we do not agree that a correction should be made, we will take reasonable steps to record that you requested the correction where required by law.

To request access to or correction of your personal information, please contact us using the details below.

## Third-Party Websites

Our website may contain links to third-party websites for your convenience. These websites operate independently from us and have their own privacy policies. We encourage you to review those policies before providing any personal information.

## Contact Us

If you have any questions about this Privacy Policy or wish to access or correct your personal information, please contact us:

**Curated Experiences™**

Email: [discover@curatedexperiences.com](mailto:discover@curatedexperiences.com)

Phone: [0800 287 283](tel:0800287283)

Address: 349 Remuera Road, Remuera, Auckland 1050

If you are not satisfied with our response, you may contact the Office of the Privacy Commissioner.`;

export type PrivacyPageContent = {
  effectiveDate: string;
  html: string;
};

export function resolvePrivacyHtml(value?: string | null) {
  const content = value?.trim();
  if (!content) {
    return sanitizeTermsHtml(markdownToTermsHtml(DEFAULT_PRIVACY_MARKDOWN));
  }
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return sanitizeTermsHtml(content);
  }
  return sanitizeTermsHtml(markdownToTermsHtml(content));
}

export async function getPrivacyPageContent(): Promise<PrivacyPageContent> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [
        PRIVACY_EFFECTIVE_DATE_SETTING_KEY,
        PRIVACY_CONTENT_SETTING_KEY,
      ]);

    if (error) {
      return {
        effectiveDate: DEFAULT_PRIVACY_EFFECTIVE_DATE,
        html: resolvePrivacyHtml(),
      };
    }

    const settings = Object.fromEntries(
      (data ?? []).map((setting) => [setting.key, setting.value])
    );

    return {
      effectiveDate:
        settings[PRIVACY_EFFECTIVE_DATE_SETTING_KEY]?.trim() ||
        DEFAULT_PRIVACY_EFFECTIVE_DATE,
      html: resolvePrivacyHtml(settings[PRIVACY_CONTENT_SETTING_KEY]),
    };
  } catch {
    return {
      effectiveDate: DEFAULT_PRIVACY_EFFECTIVE_DATE,
      html: resolvePrivacyHtml(),
    };
  }
}
